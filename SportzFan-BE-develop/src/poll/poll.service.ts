import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource, LessThan, Repository } from 'typeorm';

import { PollFilter } from './enums';
import { PollDto, PollItemDto } from './dtos/poll.dto';
import { UserService } from 'src/user/user.service';
import { PollEntity } from './entities/poll.entity';
import { PollUpdateDto } from './dtos/poll-update.dto';
import { PollRegisterDto } from './dtos/poll-register.dto';
import { getFromDto } from 'src/common/utils/repository.util';
import { SuccessResponse } from 'src/common/models/success-response';
import { TransactionService } from 'src/transaction/transaction.service';
import { PollParticipantEntity } from './entities/pollParticipant.entity';
import { PollParticipantRegisterDto } from './dtos/poll-participant-register.dto';
import {
  DirectionFilter,
  MaterialType,
  SortFilter,
  TransactionStatus,
  TransactionType,
} from 'src/common/models/base';
import { PaginatorDto } from '../common/dtos/paginator.dto';
import {
  NotificationCategoryType,
  NotificationType,
} from '../notification/dtos/notification.dto';
import { SocketService } from '../socket/socket.service';
import { AssetService } from '../asset/asset.service';
import { AssetEntity } from '../asset/entities/asset.entity';

@Injectable()
export class PollService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(PollEntity)
    private pollRepository: Repository<PollEntity>,
    @InjectRepository(PollParticipantEntity)
    private pollParticipateRepository: Repository<PollParticipantEntity>,
    @InjectRepository(AssetEntity)
    private assetRepository: Repository<AssetEntity>,
    private transactionService: TransactionService,
    private userService: UserService,
    private readonly socketService: SocketService,
    private assetService: AssetService,
  ) {}

  async findById(id: string): Promise<PollEntity> {
    return this.pollRepository.findOne({
      where: {
        id,
      },
      relations: [
        'team',
        'options',
        'match',
        'match.homeTeam',
        'match.awayTeam',
        'sponsor',
        'asset',
      ],
      order: {
        options: {
          order: 'ASC',
        },
      },
    });
  }

  async checkMyPollResult(pollId: string, userId: string): Promise<PollEntity> {
    return this.pollRepository.findOne({
      relations: ['participants', 'participants.user'],
      where: {
        id: pollId,
        participants: {
          userId,
        },
      },
    });
  }

  async getPollResult(id: string): Promise<PollEntity> {
    return this.pollRepository.findOne({
      where: {
        id,
      },
      relations: ['participants'],
    });
  }

  async getPollMyResult(pollId: string, userId: string): Promise<PollEntity> {
    return this.pollRepository.findOne({
      relations: ['participants'],
      where: {
        id: pollId,
        participants: {
          userId,
        },
      },
    });
  }

  async findJustAlivePolls(diffMinutes = 10): Promise<PollItemDto[]> {
    let conditionStr = `EXTRACT(EPOCH FROM (now() - "poll"."start")) > 0 and EXTRACT(EPOCH FROM (now() - "poll"."start")) < ${
      diffMinutes * 60
    }`;
    conditionStr += ' and "poll"."is_draft" = false';

    return await this.dataSource
      .getRepository(PollEntity)
      .createQueryBuilder('poll')
      .select(['"poll"."id"'])
      .addSelect("'" + MaterialType.Poll + "'", 'type')
      .addSelect(['"poll"."team_id"'])
      .addSelect(['"poll"."title"'])
      .addSelect(['"poll"."description"'])
      .addSelect(['"poll"."start"'])
      .addSelect(['"poll"."end"'])
      .where(conditionStr)
      .getRawMany();
  }

  async findMine(
    userId: string,
    skip: number,
    take: number,
    filter: PollFilter,
    search: string,
    isEnded: string,
    isDraft: string,
  ): Promise<[PollEntity[], number]> {
    let conditionStr = `"participants"."user_id" = \'${userId}\'`;
    if (filter === PollFilter.Upcoming) {
      conditionStr +=
        ' and "poll"."start" > now() and "poll"."is_ended" = false';
    } else if (filter === PollFilter.Ongoing) {
      conditionStr +=
        ' and "poll"."start" < now() and "poll"."end" > now() and "poll"."is_ended" = false';
    } else if (filter === PollFilter.Past) {
      conditionStr += ' and ("poll"."end" < now() or "poll"."is_ended" = true)';
    }
    if (search) {
      conditionStr += ` and "poll"."team_id" in ('${search
        .split(',')
        .join("','")}')`;
    }
    if (isDraft === 'true') {
      conditionStr += ' and "poll"."is_draft" = true';
    } else if (isDraft === 'false') {
      conditionStr += ' and "poll"."is_draft" = false';
    }
    if (isEnded === 'true') {
      conditionStr += ' and "poll"."is_ended" = true';
    } else if (isEnded === 'false') {
      conditionStr += ' and "poll"."is_ended" = false';
    }

    return this.dataSource
      .getRepository(PollEntity)
      .createQueryBuilder('poll')
      .leftJoinAndSelect('poll.team', 'team')
      .leftJoinAndSelect('poll.match', 'match')
      .leftJoinAndSelect('poll.participants', 'participants')
      .where(conditionStr)
      .orderBy(
        `(case when poll.start <= now() and poll.end > now() and poll.is_ended = false then 1 when poll.start > now() and poll.is_ended = false then 2 else 3 end)`,
      )
      .limit(take)
      .offset(skip)
      .getManyAndCount();
  }

  async find(
    userId: string,
    skip: number,
    take: number,
    filter: PollFilter,
    search: string,
    isEnded: string,
    isDraft: string,
    sort: SortFilter,
    direction: DirectionFilter,
  ): Promise<[PollEntity[], number]> {
    let conditionStr = '1 = 1';
    if (filter === PollFilter.Upcoming) {
      conditionStr = '"poll"."start" > now() and "poll"."is_ended" = false';
    } else if (filter === PollFilter.Ongoing) {
      conditionStr =
        '"poll"."start" < now() and "poll"."end" > now() and "poll"."is_ended" = false';
    } else if (filter === PollFilter.Past) {
      conditionStr = '("poll"."end" < now() or "poll"."is_ended" = true)';
    }
    if (search) {
      conditionStr += ` and "poll"."team_id" in ('${search
        .split(',')
        .join("','")}')`;
    }
    if (isDraft === 'true') {
      conditionStr += ' and "poll"."is_draft" = true';
    } else if (isDraft === 'false') {
      conditionStr += ' and "poll"."is_draft" = false';
    }
    if (isEnded === 'true') {
      conditionStr += ' and "poll"."is_ended" = true';
    } else if (isEnded === 'false') {
      conditionStr += ' and "poll"."is_ended" = false';
    }

    let order = `poll.${sort}`;
    if (sort === SortFilter.Start) {
      order = `CASE WHEN "poll"."start" <= now() and "poll"."end" > now() and "poll"."is_ended" = false THEN now() - "poll"."start"
            WHEN  "poll"."start" > now() and "poll"."is_ended" = false THEN "poll"."start" - now()
            ELSE now() - "poll"."start" END
          `;
      direction =
        direction === DirectionFilter.ASC
          ? DirectionFilter.DESC
          : DirectionFilter.ASC;
    } else {
      if (sort === SortFilter.Type) {
        throw new BadRequestException('Invalid sort filter');
      } else if (sort === SortFilter.Team) {
        order = 'team.name';
      }
    }

    const [dataList, count] = await this.dataSource
      .getRepository(PollEntity)
      .createQueryBuilder('poll')
      .leftJoinAndSelect('poll.team', 'team')
      .leftJoinAndSelect('poll.match', 'match')
      .leftJoinAndSelect(
        'poll.participants',
        'participants',
        `participants.user_id = '${userId}'`,
      )
      .where(conditionStr)
      .orderBy(
        `(case when poll.start <= now() and poll.end > now() and poll.is_ended = false then 1 when poll.start > now() and poll.is_ended = false then 2 else 3 end)`,
      )
      .addOrderBy(order, direction)
      .getManyAndCount();

    return [dataList.slice(skip, skip + take), count];
  }

  async findByMatchId(matchId: string): Promise<PaginatorDto<PollDto>> {
    const [polls, count] = await this.pollRepository.findAndCount({
      relations: [
        'team',
        'options',
        'participants',
        'match',
        'sponsor',
        'asset',
      ],
      where: {
        matchId,
      },
      order: {
        start: 'DESC',
      },
    });

    return {
      data: polls.map((item) => item.toDto()) || [],
      count: count || 0,
    };
  }

  async updatePoll(id: string, dto: PollUpdateDto): Promise<SuccessResponse> {
    let poll = await this.pollRepository.findOneBy({
      id: id,
    });
    if (!poll) {
      throw new BadRequestException('Could not find the content item.');
    }

    poll = getFromDto(dto, poll);
    await this.pollRepository.save(poll);
    return new SuccessResponse(true);
  }

  async removeById(id: string): Promise<SuccessResponse> {
    await this.pollRepository.softDelete({ id });
    return new SuccessResponse(true);
  }

  async addPoll(dto: PollRegisterDto): Promise<PollEntity> {
    const poll = getFromDto<PollEntity>(dto, new PollEntity());
    return this.pollRepository.save(poll);
  }

  async addPollParticipant(
    teamId: string,
    userId: string,
    pollId: string,
    dto: PollParticipantRegisterDto,
  ): Promise<PollParticipantEntity> {
    const superAdmin = await this.userService.findSuperAdmin();
    const poll = await this.pollRepository.findOne({
      where: { id: pollId },
      relations: [
        'team',
        'options',
        'participants',
        'participants.user',
        'match',
        'sponsor',
        'asset',
      ],
    });
    if (!poll) {
      throw new BadRequestException('Could not find the poll item.');
    }
    if (poll.teamId !== teamId) {
      throw new BadRequestException('You should only play team poll');
    }
    if (poll.isDraft) {
      throw new BadRequestException('Could not play the draft poll');
    }

    const pollParticipate = getFromDto<PollParticipantEntity>(
      dto,
      new PollParticipantEntity(),
    );
    pollParticipate.userId = userId;
    pollParticipate.pollId = pollId;
    const pollParticipateEntity = await this.pollParticipateRepository.save(
      pollParticipate,
    );
    if (poll.enableAssetReward && poll.participants.length < poll.winnerLimit) {
      try {
        await this.assetService.sendBonusAsset(
          poll.assetId,
          new Array(1).fill(userId),
          poll.rewardAssetCount,
          poll.title,
        );
      } catch (e: any) {}
    }
    await this.transactionService.createTransaction({
      senderId: superAdmin.id,
      receiverId: userId,
      teamId: teamId,
      matchId: poll.matchId,
      type: TransactionType.PollReward,
      uniqueId: pollParticipateEntity.id,
      status: TransactionStatus.Pending,
      kudosAmount: poll.kudosReward,
      tokenAmount: poll.tokenReward,
      reason: poll.title,
    });
    this.socketService.message$.next({
      userId: userId,
      type: NotificationType.Reward,
      category: NotificationCategoryType.Poll,
      section: MaterialType.Poll,
      uniqueId: pollParticipateEntity.id,
      content: poll.title,
    });

    return pollParticipateEntity;
  }

  // publish by id
  async publishPoll(id: string): Promise<PollEntity> {
    const poll = await this.pollRepository.findOneBy({
      id: id,
    });
    if (!poll) {
      throw new BadRequestException('Could not find the Poll item.');
    }
    if (!poll.isDraft) {
      throw new BadRequestException('Could only publish for draft poll');
    }
    poll.isDraft = false;
    return await this.pollRepository.save(poll);
  }

  async endPoll(id: string): Promise<SuccessResponse> {
    const poll = await this.pollRepository.findOne({
      where: { id },
      relations: [
        'team',
        'options',
        'participants',
        'participants.user',
        'match',
        'sponsor',
      ],
    });
    poll.isEnded = true;

    const participants = poll.participants;
    participants.forEach((item) => {
      this.socketService.message$.next({
        userId: item.userId,
        type: NotificationType.PollEnded,
        category: NotificationCategoryType.Poll,
        section: MaterialType.Poll,
        uniqueId: id,
        content: poll.title,
      });
    });
    await this.pollRepository.save(poll);
    return new SuccessResponse(true);
  }

  async endExpiredPoll(): Promise<SuccessResponse> {
    try {
      const expiredPolls = await this.pollRepository.find({
        where: {
          isEnded: false,
          end: LessThan(new Date()),
        },
      });
      await Promise.all(
        expiredPolls.map(async (expiredPoll) => {
          return await this.endPoll(expiredPoll.id);
        }),
      );

      return new SuccessResponse(true);
    } catch (ex) {
      return new SuccessResponse(
        false,
        ex.errorMessage || 'Could not end expired poll',
      );
    }
  }
}
