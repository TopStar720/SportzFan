import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Not, Repository } from 'typeorm';

import { SuccessResponse } from 'src/common/models/success-response';
import { getFromDto } from 'src/common/utils/repository.util';
import {
  ActivityItemDto,
  TransactionRegisterDto,
  TransactionUpdateDto,
  TransferTransactionDto,
} from './dtos/transaction.dto';
import { TransactionEntity } from './entities/transaction.entity';
import {
  GameType,
  TransactionStatus,
  TransactionType,
  UserRole,
} from '../common/models/base';
import { UserEntity } from '../user/entities/user.entity';
import { TokenEntity } from '../token/entities/token.entity';
import { SocketService } from 'src/socket/socket.service';
import {
  NotificationCategoryType,
  NotificationType,
} from '../notification/dtos/notification.dto';
import { ReferralService } from '../referral/referral.service';
import { PlayMilestoneEntity } from 'src/milestone/entities/play-milestone.entity';
import { TeamEntity } from 'src/team/entities/team.entity';

@Injectable()
export class TransactionService {
  constructor(
    private dataSource: DataSource,
    private socketService: SocketService,
    private referralService: ReferralService,
    @InjectRepository(TransactionEntity)
    private transactionRepository: Repository<TransactionEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(TokenEntity)
    private tokenRepository: Repository<TokenEntity>,
    @InjectRepository(TeamEntity)
    private teamRepository: Repository<TeamEntity>,
    @InjectRepository(PlayMilestoneEntity)
    private playMilestoneRepository: Repository<PlayMilestoneEntity>,
  ) {}

  // Create one transaction
  async createTransaction(
    dto: TransactionRegisterDto,
  ): Promise<TransactionEntity> {
    if (!dto.senderId || !dto.receiverId) {
      const superAdmin = await this.userRepository.findOne({
        where: { role: UserRole.SuperAdmin },
      });
      if (!dto.senderId) dto.senderId = superAdmin.id;
      if (!dto.receiverId) dto.receiverId = superAdmin.id;
    }

    //Referral process
    const playTypes = [
      TransactionType.TriviaReward,
      TransactionType.PredictionReward,
      TransactionType.MilestoneReward,
      TransactionType.CheckInReward,
      TransactionType.MultiCheckInReward,
      TransactionType.MultiReferrerReward,
      TransactionType.SurveyReward,
      TransactionType.PollReward,
      TransactionType.AssetReward,
      TransactionType.TriviaEligible,
      TransactionType.PredictionEligible,
      TransactionType.MilestoneEligible,
      TransactionType.CheckInEligible,
      TransactionType.PredictionPlay,
      TransactionType.TriviaPlay,
      TransactionType.MultiCheckInEligible,
      TransactionType.MultiReferrerEligible,
      TransactionType.SurveyEligible,
      TransactionType.PollEligible,
      TransactionType.AssetEligible,
    ];
    if (playTypes.indexOf(dto.type) > -1) {
      const referral = await this.referralService.getReferralByReceiver(
        dto.receiverId,
      );
      if (referral && !referral.passedPlay) {
        const team = await this.teamRepository.findOne({
          where: { id: referral.sender.teamId },
        });
        if (team.referralPlayKudosReward > 0 || team.referralPlayTokenReward > 0) {
          await this.createTransaction({
            senderId: null,
            receiverId: referral.senderId,
            teamId: referral.sender.teamId,
            matchId: null,
            type: TransactionType.ReferralPlayReward,
            uniqueId: referral.id,
            status: TransactionStatus.Pending,
            kudosAmount:
              team.referralPlayKudosReward,
            tokenAmount:
              team.referralPlayTokenReward,
          });
        }        
        await this.referralService.passedPlay(
          dto.receiverId,
          team.referralPlayKudosReward,
          team.referralPlayTokenReward,
        );
      }
    }

    const transaction = getFromDto<TransactionEntity>(
      dto,
      new TransactionEntity(),
    );
    let processResultFlag;
    if (dto.type === TransactionType.Deposit) {
      processResultFlag = true;
    } else {
      processResultFlag = await this.processTransaction(transaction);
    }
    transaction.status = processResultFlag
      ? TransactionStatus.Success
      : TransactionStatus.Pending;

    transaction.isActivated = true;
    return this.transactionRepository.save(transaction);
  }

  // Create one transaction
  async transfer(
    senderId: string,
    dto: TransferTransactionDto,
  ): Promise<TransactionEntity> {
    const sender = await this.userRepository.findOne({
      where: {
        id: senderId,
      },
    });
    const receiver = await this.userRepository.findOne({
      where: {
        id: dto.receiverId,
      },
    });
    const transaction = getFromDto<TransactionEntity>(
      dto,
      new TransactionEntity(),
    );
    transaction.senderId = senderId;
    transaction.type = TransactionType.Transfer;
    transaction.teamId = sender.teamId;
    const processResultFlag = await this.processTransaction(transaction);

    transaction.status = processResultFlag
      ? TransactionStatus.Success
      : TransactionStatus.Pending;
    transaction.isActivated = true;
    const transEntity = await this.transactionRepository.save(transaction);
    if (sender.role !== UserRole.SuperAdmin) {
      this.socketService.message$.next({
        userId: senderId,
        type: NotificationType.Transfer,
        category: NotificationCategoryType.TransferSent,
        section: dto.receiverId,
        uniqueId: transEntity.id,
        content: `${dto.tokenAmount},${dto.kudosAmount}`,
        detailContent: `${receiver.firstName}`,
      });
    }
    if (receiver.role !== UserRole.SuperAdmin) {
      this.socketService.message$.next({
        userId: dto.receiverId,
        type: NotificationType.Transfer,
        category: NotificationCategoryType.TransferReceived,
        section: 'admin',
        uniqueId: transEntity.id,
        content: `${dto.tokenAmount},${dto.kudosAmount}`,
        detailContent: transEntity.reason,
      });
    }
    return transEntity;
  }

  async processTransaction(transaction: TransactionEntity): Promise<boolean> {
    const sender = await this.userRepository.findOne({
      where: { id: transaction.senderId },
    });
    const receiver = await this.userRepository.findOne({
      where: { id: transaction.receiverId },
    });
    if (sender.role === UserRole.SuperAdmin) {
      const token = await this.tokenRepository.findOne({
        relations: { team: true },
        where: { id: receiver.tokenId },
      });
      if (token.totalBalance < transaction.tokenAmount) {
        return false;
      } else {
        // level up checking
        let newLevelTitle = '';
        let newLevel = 0;
        if (
          token.team.kudosToTire1 > receiver.kudosAmount &&
          token.team.kudosToTire1 - receiver.kudosAmount <
            transaction.kudosAmount
        ) {
          newLevelTitle = token.team.memberLevelName1;
          newLevel = 1;
        } else if (
          token.team.kudosToTire2 > receiver.kudosAmount &&
          token.team.kudosToTire2 - receiver.kudosAmount <
            transaction.kudosAmount
        ) {
          newLevelTitle = token.team.memberLevelName2;
          newLevel = 2;
        } else if (
          token.team.kudosToTire3 > receiver.kudosAmount &&
          token.team.kudosToTire3 - receiver.kudosAmount <
            transaction.kudosAmount
        ) {
          newLevelTitle = token.team.memberLevelName3;
          newLevel = 3;
        } else if (
          token.team.kudosToTire4 > receiver.kudosAmount &&
          token.team.kudosToTire4 - receiver.kudosAmount <
            transaction.kudosAmount
        ) {
          newLevelTitle = token.team.memberLevelName4;
          newLevel = 4;
        }
        if (newLevelTitle) {
          this.socketService.message$.next({
            userId: receiver.id,
            type: NotificationType.LevelUp,
            category: NotificationCategoryType.LevelUp,
            section: '',
            uniqueId: receiver.id,
            content: newLevelTitle,
            detailContent: `${newLevel}`,
          });
        }
        token.totalBalance =
          parseFloat(`${token.totalBalance}`) -
          parseFloat(`${transaction.tokenAmount}`);
        receiver.tokenAmount =
          parseFloat(`${receiver.tokenAmount}`) +
          parseFloat(`${transaction.tokenAmount}`);
        receiver.kudosAmount =
          parseFloat(`${receiver.kudosAmount}`) +
          parseFloat(`${transaction.kudosAmount}`);
        await this.tokenRepository.save(token);
        await this.userRepository.save(receiver);
        // Check if milestone is eligible  for receiver
        const playMilestones = await this.playMilestoneRepository.find({
          relations: ['milestone', 'user'],
          where: {
            userId: receiver.id,
            checkInFlag: true,
            balanceFlag: false,
            milestone: {
              isEnded: false,
              isDraft: false,
            },
          },
        });
        for (const playMilestone of playMilestones) {
          if (
            playMilestone.milestone.eligbleKudos <= receiver.kudosAmount &&
            playMilestone.milestone.eligbleToken <= receiver.tokenAmount
          ) {
            playMilestone.balanceFlag = true;
            await this.playMilestoneRepository.save(playMilestone);
            this.socketService.message$.next({
              userId: receiver.id,
              type: NotificationType.MilestoneEligible,
              category: NotificationCategoryType.Game,
              section: GameType.Milestone,
              uniqueId: playMilestone.milestone.id,
              content: playMilestone.milestone.title,
            });
          }
        }
        return true;
      }
    } else if (receiver.role === UserRole.SuperAdmin) {
      const token = await this.tokenRepository.findOne({
        where: { id: sender.tokenId },
      });
      if (token.totalBalance < transaction.tokenAmount) {
        return false;
      } else {
        token.totalBalance =
          parseFloat(`${token.totalBalance}`) +
          parseFloat(`${transaction.tokenAmount}`);
        sender.tokenAmount =
          parseFloat(`${sender.tokenAmount}`) -
          parseFloat(`${transaction.tokenAmount}`);
        sender.kudosAmount =
          parseFloat(`${sender.kudosAmount}`) -
          parseFloat(`${transaction.kudosAmount}`);
        await this.tokenRepository.save(token);
        await this.userRepository.save(sender);
        return true;
      }
    } else {
      if (
        sender.tokenAmount > transaction.tokenAmount &&
        sender.kudosAmount > transaction.kudosAmount
      ) {
        sender.tokenAmount =
          parseFloat(`${sender.tokenAmount}`) -
          parseFloat(`${transaction.tokenAmount}`);
        sender.kudosAmount =
          parseFloat(`${sender.kudosAmount}`) -
          parseFloat(`${transaction.kudosAmount}`);
        receiver.tokenAmount =
          parseFloat(`${receiver.tokenAmount}`) +
          parseFloat(`${transaction.tokenAmount}`);
        receiver.kudosAmount =
          parseFloat(`${receiver.kudosAmount}`) +
          parseFloat(`${transaction.kudosAmount}`);
        await this.userRepository.save(sender);
        await this.userRepository.save(receiver);
        return true;
      } else {
        return false;
      }
    }
  }

  async processPendingTransactions(): Promise<SuccessResponse> {
    const pendingTransactions = await this.transactionRepository.find({
      where: { status: TransactionStatus.Pending },
    });
    for (const transaction of pendingTransactions) {
      const res = await this.processTransaction(transaction);
      if (res) {
        transaction.status = TransactionStatus.Success;
        await this.transactionRepository.save(transaction);
      }
    }
    return new SuccessResponse(true);
  }

  //Get all Transaction list
  async getAllTransaction(
    teamId: string,
  ): Promise<[TransactionEntity[], number]> {
    if (teamId) {
      return this.transactionRepository.findAndCount({
        relations: ['team', 'match', 'sender', 'receiver'],
        where: { teamId },
        order: {
          createdAt: 'DESC',
        },
      });
    } else {
      return this.transactionRepository.findAndCount({
        relations: ['team', 'match', 'sender', 'receiver'],
        order: {
          createdAt: 'DESC',
        },
      });
    }
  }

  //Get Transaction list with pagination
  async getTransactionList(
    skip: number,
    take: number,
    teamId: string,
  ): Promise<[TransactionEntity[], number]> {
    if (teamId) {
      return this.transactionRepository.findAndCount({
        relations: ['team', 'match', 'sender', 'receiver'],
        where: { teamId },
        skip: skip,
        take: take,
        order: {
          createdAt: 'DESC',
        },
      });
    } else {
      return this.transactionRepository.findAndCount({
        relations: ['team', 'match', 'sender', 'receiver'],
        skip: skip,
        take: take,
        order: {
          createdAt: 'DESC',
        },
      });
    }
  }

  //Get Transaction list with pagination
  async getUserAnalysis(
    userId: string,
  ): Promise<{ kudos_amount: number; token_amount: number }> {
    return await this.dataSource
      .getRepository(TransactionEntity)
      .createQueryBuilder('trans')
      .select(['SUM("trans"."kudos_amount") as kudos_amount'])
      .addSelect(['SUM("trans"."token_amount") as token_amount'])
      .where('"trans"."type" !=:type', { type: TransactionType.Deposit })
      .andWhere('"trans"."type" !=:type', { type: TransactionType.Transfer })
      .andWhere('"trans"."receiver_id" =:id', { id: userId })
      .andWhere('"trans"."status"=:status', {
        status: TransactionStatus.Success,
      })
      .getRawOne();
  }

  //Get Transaction list with pagination
  async getUserTransactionList(
    skip: number,
    take: number,
    teamId: string,
    userId: string,
  ): Promise<[TransactionEntity[], number]> {
    if (teamId) {
      return this.transactionRepository.findAndCount({
        relations: ['team', 'match', 'sender', 'receiver'],
        where: [
          { teamId, senderId: userId, tokenAmount: Not(0) },
          { teamId, receiverId: userId, tokenAmount: Not(0) },
        ],
        skip: skip,
        take: take,
        order: {
          createdAt: 'DESC',
        },
      });
    } else {
      return this.transactionRepository.findAndCount({
        relations: ['team', 'match', 'sender', 'receiver'],
        where: [{ senderId: userId }, { receiverId: userId }],
        skip: skip,
        take: take,
        order: {
          createdAt: 'DESC',
        },
      });
    }
  }

  //Get activity list
  async getActivityList(
    userId: string,
    skip: number,
    take: number,
  ): Promise<ActivityItemDto[]> {
    return await this.dataSource
      .getRepository(TransactionEntity)
      .createQueryBuilder('trans')
      .select(['"trans"."id"'])
      .addSelect(['"trans"."type"'])
      .addSelect([
        `CASE WHEN "trans"."receiver_id" = '${userId}' THEN "trans"."kudos_amount" ELSE -1 * "trans"."kudos_amount" END as kudosAmount`,
      ])
      .addSelect([
        `CASE WHEN "trans"."receiver_id" = '${userId}' THEN "trans"."token_amount" ELSE -1 * "trans"."token_amount" END as token_amount`,
      ])
      .addSelect(['"trans"."reason"'])
      .addSelect(['"trans"."createdAt"'])
      .where('"trans"."status"=:status', { status: TransactionStatus.Success })
      .andWhere('"trans"."is_activated"=:activate', { activate: true })
      .andWhere(
        '"trans"."receiver_id"=:receiverId or "trans"."sender_id"=:receiverId',
        { receiverId: userId },
      )
      .orderBy('"trans"."createdAt"', 'DESC')
      .skip(skip)
      .take(take)
      .getRawMany();
  }

  findOne(id: string): Promise<TransactionEntity | undefined> {
    return this.transactionRepository.findOneBy({ id });
  }

  // Get one Transaction by id
  async getOneTransaction(id: string): Promise<TransactionEntity> {
    const transaction = await this.transactionRepository.findOneBy({
      id: id,
    });
    if (!transaction) {
      throw new BadRequestException('Could not find the transaction item.');
    }
    return transaction;
  }

  async updateTransactionUpdate(
    id: string,
    dto: TransactionUpdateDto,
  ): Promise<TransactionEntity> {
    let transaction = await this.transactionRepository.findOneBy({
      id: id,
    });
    if (!transaction) {
      throw new BadRequestException('Could not find the transaction item.');
    }
    transaction = getFromDto(dto, transaction);
    return this.transactionRepository.save(transaction);
  }

  async deleteTransaction(id: string): Promise<SuccessResponse> {
    try {
      await this.transactionRepository.softDelete({ id });
      return new SuccessResponse(true);
    } catch (ex) {
      return new SuccessResponse(false);
    }
  }

  count(): Promise<number> {
    return this.transactionRepository.count();
  }
}
