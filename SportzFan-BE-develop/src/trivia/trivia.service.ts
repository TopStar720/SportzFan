import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';

import { DataSource, LessThan, Repository } from 'typeorm';
import { TriviaRegisterDto } from './dtos/trivia.dto';
import { TriviaEntity } from './entities/trivia.entity';
import {
  GameType,
  TransactionStatus,
  TransactionType,
} from 'src/common/models/base';
import { UserEntity } from 'src/user/entities/user.entity';
import { TeamEntity } from 'src/team/entities/team.entity';
import { getFromDto } from 'src/common/utils/repository.util';
import { MatchEntity } from 'src/match/entities/match.entity';
import { PlayTriviaEntity } from './entities/play-trivia.entity';
import { SponsorEntity } from 'src/sponsor/entities/sponsor.entity';
import { SuccessResponse } from 'src/common/models/success-response';
import { TransactionEntity } from 'src/transaction/entities/transaction.entity';
import {
  PlayTriviaRegisterDto,
  PlayTriviaUpdateScoreRankDto,
} from './dtos/play-trivia.dto';
import { TriviaRewardDistributionEntity } from './entities/trivia-reward-distribution.entity';
import { TriviaQuestionEntity } from './entities/trivia-question.entity';
import { TransactionService } from '../transaction/transaction.service';
import {
  NotificationCategoryType,
  NotificationType,
} from '../notification/dtos/notification.dto';
import { SocketService } from '../socket/socket.service';
import { UserService } from 'src/user/user.service';
import { AssetService } from '../asset/asset.service';
import { AssetEntity } from '../asset/entities/asset.entity';
import { DeviceService } from 'src/device/device.service';
import { PushNotificationService } from 'src/push-notification/push-notification.service';

@Injectable()
export class TriviaService {
  constructor(
    @InjectRepository(TriviaEntity)
    private triviaRepository: Repository<TriviaEntity>,
    @InjectRepository(TriviaRewardDistributionEntity)
    private triviaRewardDistributionRepository: Repository<TriviaRewardDistributionEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(PlayTriviaEntity)
    private playTriviaRepository: Repository<PlayTriviaEntity>,
    @InjectRepository(TeamEntity)
    private teamRepository: Repository<TeamEntity>,
    @InjectRepository(MatchEntity)
    private matchRepository: Repository<MatchEntity>,
    @InjectRepository(SponsorEntity)
    private sponsorRepository: Repository<SponsorEntity>,
    @InjectRepository(TriviaQuestionEntity)
    private triviaQuestionRepository: Repository<TriviaQuestionEntity>,
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

  // Create one Trivia Game
  async createTrivia(dto: TriviaRegisterDto): Promise<TriviaEntity> {
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
    const trivia = getFromDto<TriviaEntity>(dto, new TriviaEntity());
    if (dto.assetId) trivia.asset = asset;
    return this.triviaRepository.save(trivia);
  }

  // Get one trivia game by id
  async getOneTrivia(id: string): Promise<TriviaEntity> {
    return this.triviaRepository.findOne({
      relations: [
        'team',
        'asset',
        'sponsor',
        'match',
        'match.homeTeam',
        'match.awayTeam',
        'rewardDistribution',
        'triviaQuestions',
        'triviaQuestions.options',
      ],
      where: {
        id: id,
      },
    });
  }

  // Get all trivia games
  async getAllTrivia(
    skip: number,
    take: number,
  ): Promise<[TriviaEntity[], number]> {
    return this.triviaRepository.findAndCount({
      relations: [
        'team',
        'asset',
        'sponsor',
        'match',
        'match.homeTeam',
        'match.awayTeam',
        'rewardDistribution',
        'triviaQuestions',
        'triviaQuestions.options',
      ],
      order: {
        start: 'DESC',
      },
      skip,
      take,
    });
  }

  // Update Trivia game by id
  async updateTrivia(
    id: string,
    dto: TriviaRegisterDto,
  ): Promise<SuccessResponse> {
    const triviaPlayList = await this.playTriviaRepository.findBy({
      triviaId: id,
    });
    if (triviaPlayList?.length) {
      throw new BadRequestException(
        'Could not update the trivia game since it is already played.',
      );
    }

    let trivia = await this.triviaRepository.findOne({
      relations: ['rewardDistribution', 'triviaQuestions'],
      where: { id: id },
    });
    if (!trivia) {
      throw new BadRequestException('Could not find the trivia game item.');
    }
    try {
      for (const distribution of trivia.rewardDistribution) {
        await this.triviaRewardDistributionRepository.softDelete({
          id: distribution.id,
        });
      }
      for (const question of trivia.triviaQuestions) {
        await this.triviaQuestionRepository.softDelete({ id: question.id });
      }

      trivia = getFromDto(dto, trivia);
      await this.triviaRepository.save(trivia);
      return new SuccessResponse(true);
    } catch (ex) {
      return new SuccessResponse(
        false,
        ex.errmsg || 'failed to update trivia game',
      );
    }
  }

  async deleteTrivia(id: string): Promise<SuccessResponse> {
    await this.triviaRepository.softDelete({ id });
    return new SuccessResponse(true);
  }

  async createPlayTrivia(
    dto: PlayTriviaRegisterDto,
    teamId: string,
    userId: string,
  ): Promise<SuccessResponse> {
    const trivia = await this.triviaRepository.findOne({
      relations: ['triviaQuestions', 'triviaQuestions.options'],
      where: { id: dto.triviaId },
    });
    if (!trivia) {
      throw new BadRequestException('Could not find the trivia game item.');
    }
    if (trivia.teamId !== teamId) {
      throw new BadRequestException('You should only play team game');
    }
    if (new Date(trivia.end) < new Date()) {
      throw new BadRequestException('This trivia game is expired.');
    }
    if (new Date(trivia.start) > new Date()) {
      throw new BadRequestException('This trivia game is not started yet.');
    }
    if (trivia.isEnded) {
      throw new BadRequestException('This trivia is already ended');
    }

    const user = await this.userRepository.findOneBy({
      id: userId,
    });
    if (!user) {
      throw new BadRequestException('Could not find the user.');
    }

    // Check if user already play trivia
    const playHistory = await this.playTriviaRepository.findOne({
      where: {
        userId,
        triviaId: dto.triviaId,
      },
    });

    if (playHistory) {
      throw new BadRequestException(
        'You have already played this trivia game.',
      );
    }

    // Check if user is eligble for this game
    if (
      user.tokenAmount < trivia.eligbleToken ||
      user.kudosAmount < trivia.eligbleKudos
    ) {
      throw new BadRequestException(
        'You are not eligible because of insufficient balance',
      );
    }

    const playTrivia = getFromDto<PlayTriviaEntity>(
      dto,
      new PlayTriviaEntity(),
    );
    try {
      const score = trivia.triviaQuestions.reduce((prev, question) => {
        const answer = dto.answer.find(
          (answer) => answer.questionId === question.id,
        );
        const isCorrect = question.options.findIndex(
          (option) => option.isCorrect && option.id === answer.optionId,
        );

        if (isCorrect >= 0) return prev + 1;
        else return prev;
      }, 0);

      playTrivia.trivia = trivia;
      playTrivia.userId = userId;
      playTrivia.user = user;
      playTrivia.score = score;
      const playTriviaEntity = await this.playTriviaRepository.save(playTrivia);
      const deviceList = await this.deviceService.getDeviceForUser('sportzfan', user.id);
      (deviceList || []).map(async (device) => {
        await this.pushNotificationService.sendNotification(device.projectId, device.token, { data: { title: 'Trivia Play', body: trivia.title } })
      });
      await this.transactionService.createTransaction({
        senderId: null,
        receiverId: user.id,
        teamId: user.teamId,
        matchId: playTrivia.trivia.matchId,
        type: TransactionType.TriviaPlay,
        uniqueId: playTriviaEntity.id,
        status: TransactionStatus.Pending,
        kudosAmount: trivia.rewardKudosAll,
        tokenAmount: 0,
        reason: playTrivia.trivia.title,
      });
      return new SuccessResponse(true, score.toString());
    } catch (ex) {
      return new SuccessResponse(
        false,
        ex.errmsg || 'could not play trivia game',
      );
    }
  }

  async getTriviaPlayListForUser(userId: string): Promise<PlayTriviaEntity[]> {
    return this.playTriviaRepository.find({
      relations: ['trivia', 'user'],
      where: {
        userId: userId,
      },
    });
  }

  async getTriviaResult(id: string): Promise<TriviaEntity> {
    const trivia = await this.triviaRepository.findOne({
      relations: [
        'triviaQuestions',
        'triviaQuestions.options',
        'playTrivia',
        'playTrivia.answer',
        'playTrivia.user',
        'sponsor',
      ],
      where: {
        id: id,
      },
    });
    if (!trivia.isEnded) {
      throw new BadRequestException(
        "This trivia isn't finished yet. Please finish it first.",
      );
    }
    return trivia;
  }

  async getMyTriviaResult(
    triviaId: string,
    userId: string,
  ): Promise<[TriviaEntity, number]> {
    const trivia = await this.triviaRepository.findOne({
      relations: [
        'match',
        'team',
        'asset',
        'playTrivia',
        'sponsor',
        'triviaQuestions',
      ],
      where: {
        id: triviaId,
        playTrivia: {
          userId: userId,
        },
      },
    });
    const totalCount = await this.playTriviaRepository.count({
      where: { triviaId: triviaId },
    });
    if (!trivia) {
      throw new BadRequestException("You haven't played this trivia. yet.");
    }
    if (!trivia.isEnded) {
      throw new BadRequestException(
        "This trivia isn't finished yet. Please finish it first.",
      );
    }
    return [trivia, totalCount];
  }

  async checkIfFinished(id: string): Promise<boolean> {
    const scores = await this.dataSource
      .getRepository(PlayTriviaEntity)
      .createQueryBuilder('playTrivia')
      .leftJoin('playTrivia.trivia', 'trivia')
      .leftJoin(
        TransactionEntity,
        'transaction',
        '("transaction"."unique_id")::uuid = "playTrivia"."id"',
      )
      .where('trivia.id=:id', { id })
      .andWhere('transaction.type=:type', {
        type: TransactionType.TriviaReward,
      })
      .getCount();
    return scores === 0;
  }

  async checkIfUserPlayedTrivia(
    userId: string,
    triviaId: string,
  ): Promise<PlayTriviaEntity> {
    return this.playTriviaRepository.findOne({
      relations: ['trivia'],
      where: {
        userId: userId,
        triviaId: triviaId,
      },
    });
  }

  async calcRank(id: string): Promise<any> {
    const scores = await this.dataSource
      .getRepository(PlayTriviaEntity)
      .createQueryBuilder('playTrivia')
      .leftJoin('playTrivia.trivia', 'trivia')
      .leftJoin('playTrivia.user', 'user')
      .addSelect(['"user"."first_name"', '"user"."last_name"'])
      .leftJoin('playTrivia.answer', 'answer')
      .leftJoin('answer.option', 'triviaOptions')
      .addSelect(
        'SUM(CASE WHEN triviaOptions.isCorrect = true THEN 1 ELSE 0 END)',
        'score',
      )
      .where('trivia.id=:id', { id })
      .groupBy('playTrivia.userId')
      .addGroupBy('playTrivia.id')
      .addGroupBy('user.id')
      .orderBy('score', 'DESC')
      .addOrderBy('taken_time', 'ASC')
      .addOrderBy('"playTrivia"."createdAt"', 'DESC')
      .getRawMany();

    const trivia = await this.triviaRepository.findOne({
      relations: ['rewardDistribution', 'playTrivia'],
      where: {
        id: id,
      },
    });

    return [scores, trivia];
  }

  async updateRankScore(
    dto: PlayTriviaUpdateScoreRankDto,
  ): Promise<SuccessResponse> {
    const playTrivia = await this.playTriviaRepository.findOne({
      where: { id: dto.playTriviaId },
    });
    playTrivia.score = dto.score;
    playTrivia.rank = dto.rank;
    playTrivia.rewardToken = dto.rewardToken;
    playTrivia.rewardKudos = dto.rewardKudos;
    playTrivia.isSent = dto.isSent;
    await this.playTriviaRepository.save(playTrivia);
    return new SuccessResponse(true);
  }

  async endTrivia(id: string): Promise<SuccessResponse> {
    const triviaEntity = await this.getOneTrivia(id);
    if (triviaEntity.isEnded) {
      throw new BadRequestException(
        'Could not finish for already ended trivia.',
      );
    } else {
      const [scores, trivia] = await this.calcRank(id);
      const superAdmin = await this.userService.findSuperAdmin();
      const rewardDistribution = trivia.rewardDistribution;

      if (scores && scores.length > 0) {
        for (const score of scores) {
          const index = scores.indexOf(score);
          const reward = rewardDistribution.find(
            (distribution) => distribution.winnerOrder === index + 1,
          );
          if (reward) {
            await this.transactionService.createTransaction({
              senderId: superAdmin.id,
              receiverId: score.playTrivia_user_id,
              teamId: trivia.teamId,
              matchId: trivia.matchId,
              type: TransactionType.TriviaReward,
              uniqueId: score.playTrivia_id,
              status: TransactionStatus.Pending,
              kudosAmount: reward.rewardKudos,
              tokenAmount: reward.rewardToken,
              reason: trivia.title,
            });
          }
          if (trivia.enableAssetReward && index < trivia.winnerLimit) {
            try {
              await this.assetService.sendBonusAsset(
                trivia.assetId,
                new Array(1).fill(score.playTrivia_user_id),
                trivia.rewardAssetCount,
                trivia.title,
              );
            } catch (e: any) {}
          }
          await this.updateRankScore({
            playTriviaId: score.playTrivia_id,
            score: score.score,
            rank: index + 1,
            rewardToken: reward ? reward.rewardToken : 0,
            rewardKudos: reward ? reward.rewardKudos : 0,
            isSent: !!reward,
          });
        }

        for (const item of trivia.playTrivia) {
          this.socketService.message$.next({
            userId: item.userId,
            type: NotificationType.GameEnded,
            category: NotificationCategoryType.Game,
            section: GameType.Trivia,
            uniqueId: id,
            content: trivia.title,
          });
        }
      }
      trivia.isEnded = true;
      await this.triviaRepository.save(trivia);
      return new SuccessResponse(true);
    }
  }

  async endExpiredTrivia(): Promise<SuccessResponse> {
    try {
      const triviaList = await this.triviaRepository.find({
        where: {
          isEnded: false,
          end: LessThan(new Date()),
        },
      });
      await Promise.all(triviaList.map((item) => this.endTrivia(item.id)));
      return new SuccessResponse(true);
    } catch (ex) {
      return new SuccessResponse(
        false,
        ex.errorMessage || 'Could not end expired trivia',
      );
    }
  }
}
