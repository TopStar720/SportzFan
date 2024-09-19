import { InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  In,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';

import { UserEntity } from 'src/user/entities/user.entity';
import { TeamEntity } from 'src/team/entities/team.entity';
import { MilestoneRegisterDto } from './dtos/milestone.dto';
import { AssetEntity } from '../asset/entities/asset.entity';
import { MatchEntity } from 'src/match/entities/match.entity';
import { MilestoneEntity } from './entities/milestone.entity';
import { GameType, TransactionType, UserRole } from 'src/common/models/base';
import { SponsorEntity } from 'src/sponsor/entities/sponsor.entity';
import { SuccessResponse } from 'src/common/models/success-response';
import { PlayMilestoneEntity } from './entities/play-milestone.entity';
import { TransactionService } from '../transaction/transaction.service';
import { getFromDto } from 'src/common/utils/repository.util';
import { PlayMilestoneRegisterDto } from './dtos/play-milestone.dto';
import { SocketService } from '../socket/socket.service';
import {
  NotificationCategoryType,
  NotificationType,
} from '../notification/dtos/notification.dto';
import { PlayCheckInEntity } from '../check-in/entities/play-check-in.entity';
import { CheckInEntity } from '../check-in/entities/check-in.entity';
import { AssetService } from '../asset/asset.service';

@Injectable()
export class MilestoneService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(PlayMilestoneEntity)
    private playMilestoneRepository: Repository<PlayMilestoneEntity>,
    @InjectRepository(TeamEntity)
    private teamRepository: Repository<TeamEntity>,
    @InjectRepository(MatchEntity)
    private matchRepository: Repository<MatchEntity>,
    @InjectRepository(SponsorEntity)
    private sponsorRepository: Repository<SponsorEntity>,
    @InjectRepository(AssetEntity)
    private assetRepository: Repository<AssetEntity>,
    @InjectRepository(MilestoneEntity)
    private milestoneRepository: Repository<MilestoneEntity>,
    @InjectRepository(PlayCheckInEntity)
    private playCheckInRepository: Repository<PlayCheckInEntity>,
    @InjectRepository(CheckInEntity)
    private checkInRepository: Repository<CheckInEntity>,
    private dataSource: DataSource,
    private readonly transactionService: TransactionService,
    private socketService: SocketService,
    private assetService: AssetService,
  ) {}

  // Create one Milestone Game
  async createMilestone(dto: MilestoneRegisterDto): Promise<MilestoneEntity> {
    const team = await this.teamRepository.findOneBy({ id: dto.teamId });
    if (!team) {
      throw new BadRequestException('Could not find the team.');
    }
    const match = await this.matchRepository.findOneBy({ id: dto.matchId });
    if (!match) {
      throw new BadRequestException('Could not find the match.');
    }
    const sponsor = await this.sponsorRepository.findOneBy({
      id: dto.sponsorId,
    });
    if (!sponsor) {
      throw new BadRequestException('Could not find the sponsor.');
    }
    let asset;
    if (dto.enableAssetReward) {
      if (dto.assetId) {
        asset = await this.assetRepository.findOneBy({
          id: dto.assetId,
        });
        if (!asset) {
          throw new BadRequestException('Could not find the asset.');
        }
      }
      dto.rewardAssetCount = dto.rewardAssetCount || 1;
    } else {
      dto.assetId = null;
      dto.rewardAssetCount = 0;
    }
    const milestone = getFromDto<MilestoneEntity>(dto, new MilestoneEntity());
    milestone.team = team;
    milestone.match = match;
    milestone.sponsor = sponsor;
    if (dto.assetId) milestone.asset = asset;
    const createdMilestone = await this.milestoneRepository.save(milestone);
    if (milestone.anyWithVenue || milestone.onlyInVenue) {
      const checkIn = await this.checkInRepository.findOne({
        relations: ['playCheckIn', 'playCheckIn.user'],
        where: {
          matchId: milestone.matchId,
          teamId: team.id,
          ...(milestone.onlyInVenue && { playCheckIn: { location: 0 } }),
        },
        order: {
          playCheckIn: {
            createdAt: 'ASC',
          },
        },
      });
      if (checkIn) {
        for (const playCheckIn of checkIn.playCheckIn) {
          await this.createPlayMilestone(
            { milestoneId: createdMilestone.id },
            team.id,
            playCheckIn.userId,
          );
        }
      }
    }
    return createdMilestone;
  }

  // Get one milestone game by id
  async getOneMilestone(id: string): Promise<MilestoneEntity> {
    return this.milestoneRepository.findOne({
      relations: ['sponsor', 'match', 'team', 'asset'],
      where: {
        id: id,
      },
    });
  }

  async getMilestoneResult(
    milestoneId: string,
  ): Promise<PlayMilestoneEntity[]> {
    return this.playMilestoneRepository.find({
      select: {
        id: true,
        checkInFlag: true,
        balanceFlag: true,
        user: {
          firstName: true,
          lastName: true,
          email: true,
          id: true,
        },
      },
      relations: ['user'],
      where: {
        milestoneId: milestoneId,
      },
    });
  }

  async findMilestoneByMatch(matchId: string): Promise<MilestoneEntity[]> {
    return this.milestoneRepository.find({
      where: {
        matchId: matchId,
        isEnded: false,
        isDraft: false,
      },
    });
  }
  // Get all milestone games
  async getAllMilestone(
    skip: number,
    take: number,
    isVerified: string,
    search: string,
  ): Promise<[MilestoneEntity[], number]> {
    const teamArray =
      search === ''
        ? []
        : search.split(',').map((item) => item.replace(/\s/g, ''));
    let where = {};
    if (isVerified !== '') {
      where = [
        {
          isDraft: false,
          isEnded: isVerified === 'true',
          end: MoreThanOrEqual(new Date()),
          start: LessThanOrEqual(new Date()),
        },
        {
          isDraft: false,
          isEnded: isVerified === 'true',
          end: LessThanOrEqual(new Date()),
        },
      ];
    }
    if (search !== '') {
      where[0]['team'] = { id: In([...teamArray]) };
      where[1]['team'] = { id: In([...teamArray]) };
    }
    return this.milestoneRepository.findAndCount({
      relations: ['sponsor', 'match', 'team', 'asset'],
      where: where,
      order: {
        start: 'DESC',
      },
      skip,
      take,
    });
  }

  // Update Milestone game by id
  async updateMilestone(
    id: string,
    dto: MilestoneRegisterDto,
  ): Promise<MilestoneEntity> {
    let milestone = await this.milestoneRepository.findOneBy({
      id: id,
    });
    if (!milestone) {
      throw new BadRequestException(
        'Could not find the Milestone challenge item.',
      );
    }
    milestone = getFromDto(dto, milestone);
    return await this.milestoneRepository.save(milestone);
  }

  // publish Milestone game by id
  async publishMilestone(id: string): Promise<MilestoneEntity> {
    const milestone = await this.milestoneRepository.findOneBy({
      id: id,
    });
    if (!milestone) {
      throw new BadRequestException('Could not find the Milestone game item.');
    }
    if (!milestone.isDraft) {
      throw new BadRequestException(
        'Could only publish for draft Milestone game',
      );
    }
    milestone.isDraft = false;
    return await this.milestoneRepository.save(milestone);
  }

  // Update Milestone game by id
  async occurMilestone(id: string, count: number): Promise<MilestoneEntity> {
    const milestone = await this.milestoneRepository.findOneBy({
      id: id,
    });
    if (!milestone) {
      throw new BadRequestException(
        'Could not find the Milestone challenge item.',
      );
    }
    if (milestone.isDraft) {
      throw new BadRequestException('Could not occur for draft Milestone.');
    }
    if (milestone.isEnded) {
      throw new BadRequestException('Could not occur for ended Milestone.');
    }
    if (new Date(milestone.start) > new Date()) {
      throw new BadRequestException('This game is not started yet.');
    }
    milestone.occurCount = count;
    await this.handleMilestoneOccur(id, milestone, count);
    milestone.isEnded = true;
    return await this.milestoneRepository.save(milestone);
  }

  async handleMilestoneOccur(
    milestoneId: string,
    milestone: MilestoneEntity,
    count: number,
  ) {
    let users: Array<UserEntity>;

    if (!milestone.anyWithVenue && !milestone.onlyInVenue) {
      users = await this.userRepository.find({
        where: {
          role: UserRole.Fan,
          isActivated: true,
          isVerified: true,
          deletedAt: null,
          teamId: milestone.teamId,
          kudosAmount: MoreThan(milestone.eligbleKudos),
          tokenAmount: MoreThan(milestone.eligbleToken),
        },
        order: {
          createdAt: 'DESC',
        },
        ...(milestone.winnerLimit && { take: milestone.winnerLimit }),
      });
    } else {
      const checkIn = await this.checkInRepository.findOne({
        relations: ['playCheckIn', 'playCheckIn.user'],
        where: {
          matchId: milestone.matchId,
          playCheckIn: {
            ...(milestone.onlyInVenue && { location: 0 }),
            user: {
              tokenAmount: MoreThanOrEqual(milestone.eligbleToken),
              kudosAmount: MoreThanOrEqual(milestone.eligbleKudos),
            },
          },
        },
        order: {
          playCheckIn: {
            createdAt: 'ASC',
          },
        },
        ...(!milestone.winnerLimit && { take: milestone.winnerLimit }),
      });
      let allPlayedUsers = checkIn.playCheckIn.sort(
        (playHistory1: PlayCheckInEntity, playHistory2: PlayCheckInEntity) =>
          playHistory1.createdAt > playHistory2.createdAt ? 1 : -1,
      );
      if (milestone.winnerLimit) {
        allPlayedUsers = allPlayedUsers.slice(0, milestone.winnerLimit);
      }
      users = allPlayedUsers.map((item) => item.user);
    }

    // All play milestone history (including need to created now)

    const newPlayHistory: PlayMilestoneEntity[] = users.map((user) => {
      return getFromDto<PlayMilestoneEntity>(
        {
          user: user,
          userId: user.id,
          milestone: milestone,
          milestoneId: milestone.id,
          checkInFlag: true,
          balanceFlag: true,
          occurCount: count,
        },
        new PlayMilestoneEntity(),
      );
    });
    // Player list already exist in database
    const playerList: PlayMilestoneEntity[] =
      (await this.playMilestoneRepository.find({
        relations: ['user', 'milestone'],
        where: {
          milestoneId,
          checkInFlag: true,
          balanceFlag: true,
        },
      })) || [];

    const allPlayHistory = newPlayHistory.map((history) => {
      const existPlayHistory = playerList.find(
        (list) => list.user?.id === history.user?.id,
      );
      if (existPlayHistory) {
        return { ...existPlayHistory, occurCount: count };
      } else {
        return history;
      }
    });

    await this.playMilestoneRepository.save(allPlayHistory);

    const superAdmin = await this.userRepository.findOne({
      where: { role: UserRole.SuperAdmin },
    });
    this.socketService.bulkMessage$.next(
      allPlayHistory.map((playHistory) => {
        return {
          userId: playHistory.userId,
          type: NotificationType.Reward,
          category: NotificationCategoryType.Game,
          section: GameType.Milestone,
          uniqueId: milestoneId,
          content: milestone.title,
          detailContent: milestone.enableAssetReward ? milestone.assetId : '',
        };
      }),
    );
    for (const item of allPlayHistory) {
      try {
        await this.transactionService.createTransaction({
          teamId: milestone.teamId,
          type: TransactionType.MilestoneReward,
          matchId: milestone.matchId,
          senderId: superAdmin.id,
          receiverId: item.userId,
          uniqueId: milestoneId,
          tokenAmount: milestone.rewardTokenPerPlayer * count,
          kudosAmount: milestone.rewardKudosPerPlayer * count,
          reason: milestone.title,
        });
      } catch (e) {}
    }

    if (milestone.enableAssetReward) {
      try {
        await this.assetService.sendBonusAsset(
          milestone.assetId,
          allPlayHistory.map((playHistory) => playHistory.userId),
          milestone.rewardAssetCount,
          milestone.title,
        );
      } catch (e: any) {}
    }
  }

  async deleteMilestone(id: string): Promise<SuccessResponse> {
    await this.milestoneRepository.softDelete({ id });
    return new SuccessResponse(true);
  }

  // Create one Milestone game play history
  async createPlayMilestone(
    dto: PlayMilestoneRegisterDto,
    teamId: string,
    userId: string,
  ): Promise<PlayMilestoneEntity> {
    const milestone = await this.milestoneRepository.findOneBy({
      id: dto.milestoneId,
    });

    if (!milestone) {
      throw new BadRequestException('Could not find the milestone game item.');
    }
    if (milestone.teamId !== teamId) {
      throw new BadRequestException('You should only play team game');
    }
    if (milestone.isDraft) {
      throw new BadRequestException('Could not play the draft milestone game');
    }
    if (new Date(milestone.end) < new Date()) {
      throw new BadRequestException('This game is expired.');
    }
    if (new Date(milestone.start) > new Date()) {
      throw new BadRequestException('This game is not started yet.');
    }
    if (milestone.isEnded) {
      throw new BadRequestException('This game is already ended');
    }

    const user = await this.userRepository.findOneBy({
      id: userId,
    });
    if (!user) {
      throw new BadRequestException('Could not find the user.');
    }

    // Check if user already play milestone
    const playHistory = await this.playMilestoneRepository.findOne({
      relations: ['user', 'milestone'],
      where: {
        userId,
        milestoneId: milestone.id,
      },
    });

    const playMilestone = playHistory
      ? playHistory
      : getFromDto<PlayMilestoneEntity>(dto, new PlayMilestoneEntity());
    if (!playHistory) {
      playMilestone.milestone = milestone;
      playMilestone.userId = userId;
      playMilestone.user = user;
    }
    // Check if user is already eligible for milestone game
    if (playMilestone.checkInFlag && playMilestone.balanceFlag) {
      return playMilestone;
    }
    // check in exist
    if (!milestone.anyWithVenue && !milestone.onlyInVenue) {
      playMilestone.checkInFlag = true;
    } else {
      const checkInInstance = await this.checkInRepository.findOne({
        where: {
          matchId: milestone.matchId,
        },
      });
      if (!checkInInstance) {
        throw new BadRequestException(
          'No Check-In exist for current Match/Event',
        );
      }
      const playCheckInInstance = await this.playCheckInRepository.findOne({
        where: {
          userId,
          checkInId: checkInInstance.id,
        },
      });
      playMilestone.checkInFlag = false;
      if (
        playCheckInInstance &&
        milestone.anyWithVenue &&
        playCheckInInstance.location === 1
      ) {
        playMilestone.checkInFlag = true;
      } else if (
        playCheckInInstance &&
        milestone.onlyInVenue &&
        playCheckInInstance.location === 0
      ) {
        playMilestone.checkInFlag = true;
      }
    }
    // check balance
    playMilestone.balanceFlag =
      user.tokenAmount >= milestone.eligbleToken &&
      user.kudosAmount >= milestone.eligbleKudos;
    // Check if user is eligible for milestone game
    if (playMilestone.checkInFlag && playMilestone.balanceFlag) {
      this.socketService.message$.next({
        userId: userId,
        type: NotificationType.MilestoneEligible,
        category: NotificationCategoryType.Game,
        section: GameType.Milestone,
        uniqueId: dto.milestoneId,
        content: milestone.title,
      });
    }
    return await this.playMilestoneRepository.save(playMilestone);
  }

  // Check one Milestone game play
  async checkPlayMilestone(
    milestoneId: string,
    userId: string,
  ): Promise<PlayMilestoneEntity> {
    const milestone = await this.milestoneRepository.findOne({
      relations: ['sponsor', 'match', 'team', 'asset'],
      where: {
        id: milestoneId,
      },
    });
    if (!milestone) {
      throw new BadRequestException('Could not find the milestone game item.');
    }

    const milestonePlay = await this.playMilestoneRepository.findOne({
      relations: ['user', 'milestone'],
      where: { milestoneId, userId },
    });
    if (!milestonePlay) {
      throw new BadRequestException('Could not find the milestone play item.');
    }
    // check in exist
    const oldFlag = milestonePlay.checkInFlag && milestonePlay.balanceFlag;
    if (!oldFlag) {
      if (!milestone.anyWithVenue && !milestone.onlyInVenue) {
        milestonePlay.checkInFlag = true;
      } else {
        const checkInInstance = await this.checkInRepository.findOne({
          where: {
            matchId: milestone.matchId,
          },
        });
        if (!checkInInstance) {
          throw new BadRequestException(
            'No Check-In exist for current Match/Event',
          );
        }
        const playCheckInInstance = await this.playCheckInRepository.findOne({
          where: {
            userId,
            checkInId: checkInInstance.id,
          },
        });
        milestonePlay.checkInFlag = false;
        if (
          playCheckInInstance &&
          milestone.anyWithVenue &&
          playCheckInInstance.location === 1
        ) {
          milestonePlay.checkInFlag = true;
        } else if (
          playCheckInInstance &&
          milestone.onlyInVenue &&
          playCheckInInstance.location === 0
        ) {
          milestonePlay.checkInFlag = true;
        }
      }
      // check balance
      milestonePlay.balanceFlag =
        milestonePlay.user.tokenAmount > milestone.eligbleToken &&
        milestonePlay.user.kudosAmount > milestone.eligbleKudos;
    }
    return await this.playMilestoneRepository.save(milestonePlay);
  }

  // Get Milestone play history by milestoneId and userId
  async getOneMilestonePlayer(
    milestoneId: string,
    userId: string,
  ): Promise<PlayMilestoneEntity> {
    return this.playMilestoneRepository.findOne({
      relations: [
        'milestone',
        'milestone.match',
        'milestone.team',
        'user',
        'milestone.sponsor',
      ],
      where: {
        milestoneId,
        userId,
      },
    });
  }

  async endMilestone(id: string): Promise<SuccessResponse> {
    const milestone = await this.milestoneRepository.findOne({
      relations: {
        playMilestone: true,
      },
      where: { id },
    });
    // milestone.playMilestone.forEach((item) => {
    //   this.socketService.message$.next({
    //     userId: item.userId,
    //     type: NotificationType.GameEnded,
    //     category: NotificationCategoryType.Game,
    //     section: GameType.Milestone,
    //     uniqueId: id,
    //     content: milestone.title
    //   });
    // });
    milestone.isEnded = true;
    await this.milestoneRepository.save(milestone);
    return new SuccessResponse(true);
  }

  async endExpiredMilestone(): Promise<SuccessResponse> {
    try {
      const milestoneList = await this.milestoneRepository.find({
        relations: {
          playMilestone: true,
        },
        where: {
          isEnded: false,
          end: LessThan(new Date()),
        },
      });
      await Promise.all(
        milestoneList.map((item) => this.endMilestone(item.id)),
      );
      return new SuccessResponse(true);
    } catch (ex) {
      return new SuccessResponse(
        false,
        ex.errorMessage || 'Could not end expired milestone',
      );
    }
  }
}
