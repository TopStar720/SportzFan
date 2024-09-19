import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';

import { Between, DataSource, LessThan, Repository } from 'typeorm';
import { MiniGameRegisterDto } from './dtos/mini-game.dto';
import { MiniGameEntity } from './entities/mini-game.entity';
import {
  GameType,
  RewardActionType,
  TransactionStatus,
  TransactionType,
} from 'src/common/models/base';
import {
  PlayMiniGameRegisterDto,
  PlayMiniGameUpdateScoreRankDto,
} from './dtos/play-mini-game.dto';
import {
  NotificationCategoryType,
  NotificationType,
} from '../notification/dtos/notification.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { TeamEntity } from 'src/team/entities/team.entity';
import { getFromDto } from 'src/common/utils/repository.util';
import { PlayMiniGameEntity } from './entities/play-mini-game.entity';
import { SponsorEntity } from 'src/sponsor/entities/sponsor.entity';
import { SuccessResponse } from 'src/common/models/success-response';
import { TransactionEntity } from 'src/transaction/entities/transaction.entity';
import { MiniGameRewardDistributionEntity } from './entities/mini-game-reward-distribution.entity';
import { TransactionService } from '../transaction/transaction.service';
import { SocketService } from '../socket/socket.service';
import { UserService } from 'src/user/user.service';
import { MiniGamePlayerStatusEntity } from './entities/mini-game-player-status';
import { AssetEntity } from '../asset/entities/asset.entity';
import { AssetService } from '../asset/asset.service';
import { ErrorCode } from 'src/common/models/error-code';
import { isSameDay } from 'src/common/utils/common.util';
import { DeviceService } from 'src/device/device.service';
import { PushNotificationService } from 'src/push-notification/push-notification.service';

@Injectable()
export class MiniGameService {
  constructor(
    @InjectRepository(MiniGameEntity)
    private miniGameRepository: Repository<MiniGameEntity>,
    @InjectRepository(MiniGameRewardDistributionEntity)
    private miniGameRewardDistributionRepository: Repository<MiniGameRewardDistributionEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(PlayMiniGameEntity)
    private playMiniGameRepository: Repository<PlayMiniGameEntity>,
    @InjectRepository(TeamEntity)
    private teamRepository: Repository<TeamEntity>,
    @InjectRepository(SponsorEntity)
    private sponsorRepository: Repository<SponsorEntity>,
    @InjectRepository(MiniGamePlayerStatusEntity)
    private miniGamePlayerStatusRepository: Repository<MiniGamePlayerStatusEntity>,
    @InjectRepository(AssetEntity)
    private assetRepository: Repository<AssetEntity>,
    private dataSource: DataSource,
    private transactionService: TransactionService,
    private socketService: SocketService,
    private userService: UserService,
    private assetService: AssetService,
    private deviceService: DeviceService,
    private pushNotificationService: PushNotificationService,
  ) {}

  // Create one mini-game
  async createMiniGame(dto: MiniGameRegisterDto): Promise<MiniGameEntity> {
    const team = await this.teamRepository.findOneBy({ id: dto.teamId });
    if (!team) {
      throw new BadRequestException(ErrorCode.TeamNotFound);
    }

    if (!!dto.enableSponsor) {
      const sponsor = await this.sponsorRepository.findOneBy({
        id: dto.sponsorId,
      });
      if (!sponsor) {
        throw new BadRequestException(ErrorCode.SponsorNotFound);
      }
    }

    if (!!dto.rewardAction.length) {
      dto.rewardAction.forEach(rewardAction => {
        if (rewardAction.type === RewardActionType.CompleteSurvey) {
          if (!!rewardAction.rewardActionQuestions.length && rewardAction.rewardActionQuestions.length > 10) {
            throw new BadRequestException(ErrorCode.MiniGameSurveyQuestionOverLimit);
          }
          if (!!rewardAction.rewardActionRewardItems.length && rewardAction.rewardActionRewardItems.length > 2) {
            throw new BadRequestException(ErrorCode.MiniGameSurveyRewardItemOverLimit);
          }
        }
      });
    }

    let asset;
    if (dto.enableAssetReward) {
      if (dto.assetId) {
        asset = await this.assetRepository.findOneBy({
          id: dto.assetId,
        });
        if (!asset) {
          throw new BadRequestException(ErrorCode.AssetNotFound);
        }
      }
      dto.rewardAssetCount = dto.rewardAssetCount || 1;
    } else {
      dto.assetId = null;
      dto.rewardAssetCount = 0;
    }
    const miniGame = getFromDto<MiniGameEntity>(dto, new MiniGameEntity());
    if (dto.assetId) miniGame.asset = asset;
    return this.miniGameRepository.save(miniGame);
  }

  // Get one mini game by id
  async getOneMiniGame(id: string): Promise<MiniGameEntity> {
    return this.miniGameRepository.findOne({
      relations: [
        'team',
        'sponsor',
        'match',
        'match.homeTeam',
        'match.awayTeam',
        'rewardDistribution',
        'rewardAction',
        'rewardMarketplaceItem',
        'asset',
        'rewardAction.rewardActionQuestions',
        'rewardAction.rewardActionQuestions.options',
        'rewardAction.rewardActionRewardItems',
      ],
      where: {
        id: id,
      },
    });
  }

  // Get all mini-games
  async getAllMiniGame(
    skip: number,
    take: number,
  ): Promise<[MiniGameEntity[], number]> {
    return this.miniGameRepository.findAndCount({
      relations: [
        'team',
        'sponsor',
        'match',
        'match.homeTeam',
        'match.awayTeam',
        'rewardDistribution',
        'rewardAction',
        'rewardMarketplaceItem',
        'asset',
        'rewardAction.rewardActionQuestions',
        'rewardAction.rewardActionQuestions.options',
        'rewardAction.rewardActionRewardItems',
      ],
      order: {
        start: 'DESC',
      },
      skip,
      take,
    });
  }
  // Update mini game life
  async reduceLife(
    miniGameId: string,
    userId: string,
  ): Promise<SuccessResponse> {
    const miniGamePlayerStatus = await this.miniGamePlayerStatusRepository.findOne({
      where: {
        miniGameId,
        userId,
      },
    });
    if (miniGamePlayerStatus) {
      miniGamePlayerStatus.lifeCount = miniGamePlayerStatus.lifeCount - 1;
      await this.miniGamePlayerStatusRepository.save(miniGamePlayerStatus);
      return new SuccessResponse(true);
    } else {
      throw new BadRequestException(ErrorCode.MiniGameNoLifeParam);
    }
  }
  // Update mini game by id
  async updateMiniGame(
    id: string,
    dto: MiniGameRegisterDto,
  ): Promise<SuccessResponse> {
    const miniGamePlayList = await this.playMiniGameRepository.findBy({
      miniGameId: id,
    });

    if (miniGamePlayList?.length) {
      throw new BadRequestException(ErrorCode.AlreadyPlayedMiniGame);
    }

    let miniGame = await this.miniGameRepository.findOne({
      relations: ['rewardDistribution'],
      where: { id: id },
    });
    if (!miniGame) {
      throw new BadRequestException(ErrorCode.MiniGameNotFound);
    }

    if (!!dto.rewardAction.length) {
      dto.rewardAction.forEach(rewardAction => {
        if (rewardAction.type === RewardActionType.CompleteSurvey) {
          if (!!rewardAction.rewardActionQuestions.length && rewardAction.rewardActionQuestions.length > 10) {
            throw new BadRequestException(ErrorCode.MiniGameSurveyQuestionOverLimit);
          }
          if (!!rewardAction.rewardActionRewardItems.length && rewardAction.rewardActionRewardItems.length > 2) {
            throw new BadRequestException(ErrorCode.MiniGameSurveyRewardItemOverLimit);
          }
        }
      });
    }

    try {
      for (const distribution of miniGame.rewardDistribution) {
        await this.miniGameRewardDistributionRepository.softDelete({
          id: distribution.id,
        });
      }

      miniGame = getFromDto(dto, miniGame);
      await this.miniGameRepository.save(miniGame);
      return new SuccessResponse(true);
    } catch (ex) {
      return new SuccessResponse(
        false,
        ex.errmsg || 'Failed to update mini game',
      );
    }
  }

  async deleteMiniGame(id: string): Promise<SuccessResponse> {
    await this.miniGameRepository.softDelete({ id });
    return new SuccessResponse(true);
  }

  async createPlayMiniGame(
    dto: PlayMiniGameRegisterDto,
    miniGameId: string,
  ): Promise<SuccessResponse> {
    const miniGame = await this.miniGameRepository.findOne({
      where: { id: miniGameId },
    });
    if (!miniGame) {
      throw new BadRequestException(ErrorCode.MiniGameNotFound);
    }
    const user = await this.userRepository.findOne({
      where: { id: dto.userId },
    });
    if (!user) {
      throw new BadRequestException(ErrorCode.UserNotFound);
    }
    if (miniGame.teamId !== user.teamId) {
      throw new BadRequestException(ErrorCode.NotTeamMiniGame);
    }

    if (new Date(miniGame.end) < new Date()) {
      throw new BadRequestException(ErrorCode.MiniGameExpired);
    }
    if (new Date(miniGame.start) > new Date()) {
      throw new BadRequestException(ErrorCode.MiniGameNotStarted);
    }
    if (miniGame.isEnded) {
      throw new BadRequestException(ErrorCode.MiniGameEnded);
    }

    // Check if user is eligble for this game
    if (
      user.tokenAmount < miniGame.eligbleToken ||
      user.kudosAmount < miniGame.eligbleKudos
    ) {
      throw new BadRequestException(ErrorCode.NotEligibleForMiniGame);
    }
    const previousHistory = await this.playMiniGameRepository.findOne({
      relations: ['user', 'miniGame'],
      where: {
        userId: dto.userId,
        miniGameId: miniGameId,
        isHighest: 1,
      },
    });

    const playMiniGame = getFromDto<PlayMiniGameEntity>(
      dto,
      new PlayMiniGameEntity(),
    );
    try {
      playMiniGame.miniGame = miniGame;
      playMiniGame.userId = dto.userId;
      playMiniGame.user = user;
      playMiniGame.rewardKudos = miniGame.rewardKudos;
      playMiniGame.rewardToken = !previousHistory ? miniGame.rewardToken : 0;
      if (!previousHistory) {
        playMiniGame.isHighest = 1;
      } else if (previousHistory.score < dto.score) {
        playMiniGame.isHighest = 1;
        previousHistory['isHighest'] = 0;
        await this.playMiniGameRepository.save(previousHistory);
      } else {
        playMiniGame.isHighest = 0;
      }
      const playMiniGameEntity = await this.playMiniGameRepository.save(
        playMiniGame,
      );
      // Update life
      let miniGamePlayerStatus = await this.miniGamePlayerStatusRepository.findOne({
        where: {
          userId: dto.userId,
          miniGameId: miniGameId,
        },
      });

      if (!miniGamePlayerStatus) {
        miniGamePlayerStatus = getFromDto<MiniGamePlayerStatusEntity>(
          {
            user,
            userId: dto.userId,
            miniGame,
            miniGameId,
            lifeCount: dto.lifeCount,
            dailyBestScore: dto.score,
            bestScore: dto.score,
            lastRefreshTime: new Date(),
          },
          new MiniGamePlayerStatusEntity(),
        );
      } else {
        miniGamePlayerStatus.lifeCount = dto.lifeCount;
        miniGamePlayerStatus.bestScore = miniGamePlayerStatus.bestScore < dto.score ? dto.score : miniGamePlayerStatus.bestScore;
        if (isSameDay(miniGamePlayerStatus.lastRefreshTime, new Date())) {
          miniGamePlayerStatus.dailyBestScore = miniGamePlayerStatus.dailyBestScore < dto.score ? dto.score : miniGamePlayerStatus.dailyBestScore;
        } else {
          miniGamePlayerStatus.dailyBestScore = dto.score;
        }
      }
      await this.miniGamePlayerStatusRepository.save(miniGamePlayerStatus);

      const deviceList = await this.deviceService.getDeviceForUser('sportzfan', user.id);
      (deviceList || []).map(async (device) => {
        await this.pushNotificationService.sendNotification(device.projectId, device.token, { data: { title: 'Mini-Game Play', body: miniGame.title } })
      });
      await this.transactionService.createTransaction({
        senderId: null,
        receiverId: user.id,
        teamId: user.teamId,
        matchId: playMiniGame.miniGame.matchId,
        type: TransactionType.MiniGamePlay,
        uniqueId: playMiniGameEntity.id,
        status: TransactionStatus.Pending,
        kudosAmount: miniGame.rewardKudos,
        tokenAmount: !previousHistory ? miniGame.rewardToken : 0,
        reason: playMiniGame.miniGame.title,
      });
      return new SuccessResponse(true, dto.score.toString());
    } catch (ex) {
      return new SuccessResponse(
        false,
        ex.errmsg || 'could not play mini game',
      );
    }
  }

  async getLeaderboard(miniGameId: string): Promise<PlayMiniGameEntity[]> {
    return this.playMiniGameRepository.find({
      relations: ['miniGame', 'user'],
      where: {
        isHighest: 1,
        miniGameId: miniGameId,
      },
      order: {
        score: 'DESC',
      },
    });
  }

  async getMiniGamePlayListForUser(
    userId: string,
  ): Promise<PlayMiniGameEntity[]> {
    return this.playMiniGameRepository.find({
      relations: ['miniGame', 'user'],
      where: {
        userId: userId,
      },
    });
  }

  async refreshLife(): Promise<SuccessResponse> {
    await this.dataSource.query(`UPDATE mini_game_player_status mgl 
    SET last_refresh_time  = now(), life_count  = mg.refresh_amount 
    FROM mini_game mg 
    WHERE mgl.mini_game_id  = mg.id AND mgl.last_refresh_time  + mg.refresh_time * 60::text::interval <= now() AND mgl.life_count = 0`);
    return new SuccessResponse(true);
  }

  async getMiniGameResult(id: string): Promise<MiniGameEntity> {
    const miniGame = await this.miniGameRepository.findOne({
      relations: ['playMiniGame', 'playMiniGame.user'],
      where: {
        id: id,
      },
    });
    if (!miniGame.isEnded) {
      throw new BadRequestException(ErrorCode.MiniGameNotEnded);
    }
    return miniGame;
  }

  async getRangeMiniGameResult(
    id: string,
    start: Date,
    end: Date,
  ): Promise<PlayMiniGameEntity[]> {
    const rangePlayMiniGameList = await this.playMiniGameRepository.find({
      relations: ['user', 'miniGame'],
      where: {
        updatedAt: Between(
          new Date(start).toISOString(),
          new Date(end).toISOString(),
        ),
        miniGameId: id,
      },
      order: {
        score: 'DESC',
      },
    });
    return rangePlayMiniGameList;
  }

  async checkIfUserPlayedMiniGame(
    userId: string,
    miniGameId: string,
  ): Promise<PlayMiniGameEntity> {
    return this.playMiniGameRepository.findOne({
      relations: ['miniGame'],
      where: {
        userId: userId,
        miniGameId: miniGameId,
      },
      order: {
        createdAt: 'DESC',
      }
    });
  }

  async checkIfFinished(id: string): Promise<boolean> {
    const scores = await this.dataSource
      .getRepository(PlayMiniGameEntity)
      .createQueryBuilder('playMiniGame')
      .leftJoin('playMiniGame.miniGame', 'miniGame')
      .leftJoin(
        TransactionEntity,
        'transaction',
        '("transaction"."unique_id")::uuid = "playMiniGame"."id"',
      )
      .where('miniGame.id=:id', { id })
      .andWhere('transaction.type=:type', {
        type: TransactionType.MiniGameReward,
      })
      .getCount();
    return scores === 0;
  }

  async calcRank(id: string): Promise<any> {
    const scores = await this.dataSource.query(`select pmg.*
      from play_mini_game pmg 
      left join "user" u on u.id = pmg.user_id 
      where pmg.mini_game_id  = '${id}'
      and is_highest = 1
      order by pmg.score desc, u.kudos_amount desc`);
    const miniGame = await this.miniGameRepository.findOne({
      relations: ['rewardDistribution', 'playMiniGame'],
      where: {
        id: id,
      },
    });

    return [scores, miniGame];
  }

  async updateRankScore(
    dto: PlayMiniGameUpdateScoreRankDto,
  ): Promise<SuccessResponse> {
    const playMiniGame = await this.playMiniGameRepository.findOne({
      where: { id: dto.playMiniGameId },
    });
    playMiniGame.rank = dto.rank;
    playMiniGame.rewardToken = dto.rewardToken;
    playMiniGame.rewardKudos = dto.rewardKudos;
    playMiniGame.isSent = dto.isSent;
    await this.playMiniGameRepository.save(playMiniGame);
    return new SuccessResponse(true);
  }

  async endMiniGame(id: string): Promise<SuccessResponse> {
    const miniGameEntity = await this.getOneMiniGame(id);
    if (miniGameEntity.isEnded) {
      throw new BadRequestException(ErrorCode.MiniGameEnded);
    } else {
      const [scores, miniGame] = await this.calcRank(id);
      const superAdmin = await this.userService.findSuperAdmin();
      const rewardDistribution = miniGame.rewardDistribution;

      for (const score of scores) {
        const index = scores.indexOf(score);
        const reward = rewardDistribution.find(
          (distribution) => distribution.winnerOrder === index + 1,
        );
        if (reward) {
          await this.transactionService.createTransaction({
            senderId: superAdmin.id,
            receiverId: score.user_id,
            teamId: miniGame.teamId,
            matchId: miniGame.matchId,
            type: TransactionType.MiniGameReward,
            uniqueId: score.mini_game_id,
            status: TransactionStatus.Pending,
            kudosAmount: reward.rewardKudos,
            tokenAmount: reward.rewardToken,
            reason: miniGame.title,
          });
        }
        if (miniGame.enableAssetReward && index < miniGame.winnerLimit) {
          try {
            await this.assetService.sendBonusAsset(
              miniGame.assetId,
              new Array(1).fill(score.user_id),
              miniGame.rewardAssetCount,
              miniGame.title,
            );
          } catch (e: any) {}
        }
        await this.updateRankScore({
          playMiniGameId: score.id,
          rank: index + 1,
          rewardToken: reward ? reward.rewardToken : 0,
          rewardKudos: reward ? reward.rewardKudos : 0,
          isSent: !!reward,
        });
      }

      for (const item of miniGame.playMiniGame) {
        this.socketService.message$.next({
          userId: item.userId,
          type: NotificationType.GameEnded,
          category: NotificationCategoryType.Game,
          section: GameType.MiniGame,
          uniqueId: id,
          content: miniGame.title,
        });
      }
      miniGame.isEnded = true;
      await this.miniGameRepository.save(miniGame);
      return new SuccessResponse(true);
    }
  }

  async endExpiredMiniGame(): Promise<SuccessResponse> {
    try {
      const miniGameList = await this.miniGameRepository.find({
        where: {
          isEnded: false,
          end: LessThan(new Date()),
        },
      });
      await Promise.all(miniGameList.map((item) => this.endMiniGame(item.id)));
      return new SuccessResponse(true);
    } catch (ex) {
      return new SuccessResponse(
        false,
        ex.errorMessage || 'Could not end expired miniGame',
      );
    }
  }
}
