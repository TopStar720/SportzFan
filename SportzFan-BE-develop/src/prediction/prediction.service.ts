import {
  DataSource,
  In,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { DeviceService } from 'src/device/device.service';
import { UserEntity } from 'src/user/entities/user.entity';
import { TeamEntity } from 'src/team/entities/team.entity';
import { getFromDto } from 'src/common/utils/repository.util';
import { MatchEntity } from 'src/match/entities/match.entity';
import { PredictionEntity } from './entities/prediction.entity';
import { SponsorEntity } from 'src/sponsor/entities/sponsor.entity';
import { SuccessResponse } from 'src/common/models/success-response';
import { PlayPredictionEntity } from './entities/play-prediction.entity';
import { PushNotificationService } from 'src/push-notification/push-notification.service';
import {
  PredictionRegisterDto,
  PredictionResultUpdateDto,
} from './dtos/prediction.dto';
import {
  PlayPredictionRegisterDto,
  PlayPredictionUpdateDto,
} from './dtos/play-prediction.dto';
import { PredictionRewardDistributionEntity } from './entities/prediction-reward-distribution.entity';
import {
  GameType,
  TransactionStatus,
  TransactionType,
} from '../common/models/base';
import { TransactionService } from '../transaction/transaction.service';
import { SocketService } from '../socket/socket.service';
import {
  NotificationCategoryType,
  NotificationType,
} from '../notification/dtos/notification.dto';

@Injectable()
export class PredictionService {
  constructor(
    @InjectRepository(PredictionEntity)
    private predictionRepository: Repository<PredictionEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(PlayPredictionEntity)
    private playPredictionRepository: Repository<PlayPredictionEntity>,
    @InjectRepository(PredictionRewardDistributionEntity)
    private predictionRewardDistributionRepository: Repository<PredictionRewardDistributionEntity>,
    @InjectRepository(TeamEntity)
    private teamRepository: Repository<TeamEntity>,
    @InjectRepository(MatchEntity)
    private matchRepository: Repository<MatchEntity>,
    @InjectRepository(SponsorEntity)
    private sponsorRepository: Repository<SponsorEntity>,
    private dataSource: DataSource,
    private transactionService: TransactionService,
    private socketService: SocketService,
    private deviceService: DeviceService,
    private pushNotificationService: PushNotificationService,
  ) {}

  // Create one Prediction Game
  async createPrediction(
    dto: PredictionRegisterDto,
  ): Promise<PredictionEntity> {
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
    const prediction = getFromDto<PredictionEntity>(
      dto,
      new PredictionEntity(),
    );
    prediction.isResult = false;
    return this.predictionRepository.save(prediction);
  }

  // Get one prediction game by id
  async getOnePrediction(id: string): Promise<PredictionEntity> {
    return this.predictionRepository.findOne({
      relations: [
        'sponsor',
        'match',
        'match.homeTeam',
        'match.awayTeam',
        'team',
        'rewardDistribution',
      ],
      where: {
        id: id,
      },
    });
  }

  // Get all prediction games
  async getAllPrediction(
    skip: number,
    take: number,
    isVerified: string,
    search: string,
  ): Promise<[PredictionEntity[], number]> {
    const teamArray =
      search === ''
        ? []
        : search.split(',').map((item) => item.replace(/\s/g, ''));
    let where = {};
    if (isVerified !== '') {
      where = [
        {
          isDraft: false,
          isResult: isVerified === 'true',
          end: MoreThanOrEqual(new Date()),
          start: LessThanOrEqual(new Date()),
        },
        {
          isDraft: false,
          isResult: isVerified === 'true',
          end: LessThanOrEqual(new Date()),
        },
      ];
    }
    if (search !== '') {
      where[0]['team'] = { id: In([...teamArray]) };
      where[1]['team'] = { id: In([...teamArray]) };
    }
    return this.predictionRepository.findAndCount({
      relations: [
        'sponsor',
        'match',
        'match.homeTeam',
        'match.awayTeam',
        'team',
        'rewardDistribution',
      ],
      where: where,
      order: {
        start: 'DESC',
      },
      skip,
      take,
    });
  }

  // Update Prediction game result by id
  async updatePredictionResult(
    id: string,
    dto: PredictionResultUpdateDto,
  ): Promise<SuccessResponse> {
    let prediction = await this.predictionRepository.findOneBy({
      id: id,
    });
    if (!prediction) {
      throw new BadRequestException('Could not find the Prediction item.');
    }
    if (prediction.isEnded) {
      throw new BadRequestException(
        "Could not update Result since it's already ended.",
      );
    }

    try {
      prediction = getFromDto(dto, prediction);
      prediction.isResult = true;
      await this.predictionRepository.save(prediction);
      return new SuccessResponse(true);
    } catch (ex) {
      return new SuccessResponse(
        false,
        ex.errmsg || 'failed to update prediction result',
      );
    }
  }

  // Update Prediction game by id
  async updatePrediction(
    id: string,
    dto: PredictionRegisterDto,
  ): Promise<SuccessResponse> {
    const predictionPlayList = await this.playPredictionRepository.findBy({
      predictionId: id,
    });
    if (predictionPlayList?.length) {
      throw new BadRequestException(
        'Could not update the prediction game since it is already played.',
      );
    }
    let prediction = await this.predictionRepository.findOne({
      relations: ['rewardDistribution'],
      where: { id: id },
    });
    if (!prediction) {
      throw new BadRequestException('Could not find the Prediction item.');
    }
    try {
      for (const distribution of prediction.rewardDistribution) {
        await this.predictionRewardDistributionRepository.softDelete({
          id: distribution.id,
        });
      }
      prediction = getFromDto(dto, prediction);
      await this.predictionRepository.save(prediction);
      return new SuccessResponse(true);
    } catch (ex) {
      return new SuccessResponse(
        false,
        ex.errmsg || 'failed to update prediction result',
      );
    }
  }

  async deletePrediction(id: string): Promise<SuccessResponse> {
    try {
      await this.predictionRepository.softDelete({ id });
      return new SuccessResponse(true);
    } catch (ex) {
      return new SuccessResponse(
        false,
        ex.errmsg || 'failed to delete prediction',
      );
    }
  }

  // Create one Prediction game play history
  async createPlayPrediction(
    dto: PlayPredictionRegisterDto,
    teamId: string,
    userId: string,
  ): Promise<SuccessResponse> {
    const prediction = await this.predictionRepository.findOne({
      relations: {
        match: true,
      },
      where: {
        id: dto.predictionId,
      },
    });

    if (!prediction) {
      throw new BadRequestException('Could not find the prediction game item.');
    }
    if (prediction.teamId !== teamId) {
      throw new BadRequestException('You should only play team game');
    }
    if (new Date(prediction.end) < new Date()) {
      throw new BadRequestException('This prediction game is expired.');
    }
    if (new Date(prediction.start) > new Date()) {
      throw new BadRequestException('This prediction game is not started yet.');
    }
    if (new Date(prediction.match.start) < new Date()) {
      throw new BadRequestException('Match already started.');
    }
    if (prediction.isEnded) {
      throw new BadRequestException('This prediction is already ended');
    }
    if (prediction.isDraft) {
      throw new BadRequestException('This prediction is draft game');
    }

    const user = await this.userRepository.findOneBy({
      id: userId,
    });
    if (!user) {
      throw new BadRequestException('Could not find the user.');
    }

    // Check if user already play prediction
    const playHistory = await this.playPredictionRepository.findOne({
      where: {
        userId,
        predictionId: dto.predictionId,
      },
    });
    if (playHistory) {
      throw new BadRequestException(
        'You have already played this prediction game.',
      );
    }

    // Check if user is eligble for this game
    if (
      user.tokenAmount < prediction.eligbleToken ||
      user.kudosAmount < prediction.eligbleKudos
    ) {
      throw new BadRequestException(
        'You are not eligible because of insufficient balance',
      );
    }

    const playPrediction = getFromDto<PlayPredictionEntity>(
      dto,
      new PlayPredictionEntity(),
    );
    try {
      playPrediction.prediction = prediction;
      playPrediction.user = user;
      playPrediction.userId = userId;
      const playPredictionEntity = await this.playPredictionRepository.save(
        playPrediction,
      );
      const deviceList = await this.deviceService.getDeviceForUser('sportzfan', user.id);
      (deviceList || []).map(async (device) => {
        await this.pushNotificationService.sendNotification(device.projectId, device.token, { data: { title: 'Prediction Play', body: prediction.title } })
      });
      await this.transactionService.createTransaction({
        senderId: null,
        receiverId: user.id,
        teamId: user.teamId,
        matchId: prediction.matchId,
        type: TransactionType.PredictionPlay,
        uniqueId: playPredictionEntity.id,
        status: TransactionStatus.Pending,
        kudosAmount: prediction.rewardKudosAll,
        tokenAmount: 0,
        reason: prediction.title,
      });
      return new SuccessResponse(true);
    } catch (ex) {
      return new SuccessResponse(
        false,
        ex.errmsg || 'failed to play prediction',
      );
    }
  }

  // Get Prediction chalenge play history by challengeId and userId
  async getPredictionListForUser(
    userId: string,
  ): Promise<PlayPredictionEntity[]> {
    return this.playPredictionRepository.find({
      relations: ['prediction', 'user'],
      where: {
        userId: userId,
      },
    });
  }

  async getPredictionResult(predictionId: string): Promise<PredictionEntity> {
    const prediction = await this.predictionRepository.findOne({
      relations: ['playPrediction', 'playPrediction.user', 'sponsor'],
      where: {
        id: predictionId,
      },
    });
    if (!prediction.isResult) {
      throw new BadRequestException(
        "This prediction doesn't have Corrrect Score yet.",
      );
    }
    if (!prediction.isEnded) {
      throw new BadRequestException(
        "This prediction doesn't finished yet. Please finish first.",
      );
    }
    return prediction;
  }

  async getMyPredictionResult(
    predictionId: string,
    userId: string,
  ): Promise<[PredictionEntity, number]> {
    const prediction = await this.predictionRepository.findOne({
      relations: ['team', 'match', 'playPrediction', 'sponsor'],
      where: {
        id: predictionId,
        playPrediction: {
          userId: userId,
        },
      },
    });
    const totalCount = await this.playPredictionRepository.count({
      where: { predictionId: predictionId },
    });
    if (!prediction) {
      throw new BadRequestException("You haven't played this prediction yet.");
    }
    if (!prediction.isResult) {
      throw new BadRequestException(
        "This prediction doesn't have Corrrect Score yet.",
      );
    }
    if (!prediction.isEnded) {
      throw new BadRequestException(
        "This prediction doesn't finished yet. Please finish first.",
      );
    }
    return [prediction, totalCount];
  }

  async calcRank(predictionId: string): Promise<any> {
    const scores = await this.dataSource
      .getRepository(PlayPredictionEntity)
      .createQueryBuilder('playPrediction')
      .leftJoin('playPrediction.prediction', 'prediction')
      .leftJoin('playPrediction.user', 'user')
      .addSelect(
        'ABS(playPrediction.main_predict_score - prediction.result_main) + ABS(playPrediction.opposition_predict_score - prediction.result_opposition)',
        'score',
      )
      .where('prediction.id=:id', { id: predictionId })
      .orderBy('score', 'ASC')
      .addOrderBy('"playPrediction"."createdAt"', 'DESC')
      .getRawMany();

    const prediction = await this.predictionRepository.findOne({
      relations: ['rewardDistribution'],
      where: {
        id: predictionId,
      },
    });

    return [scores, prediction];
  }

  async updateRankScore(
    dto: PlayPredictionUpdateDto,
  ): Promise<SuccessResponse> {
    const playPrediction = await this.playPredictionRepository.findOne({
      where: { id: dto.playPredictionId },
    });
    playPrediction.rank = dto.rank;
    playPrediction.rewardToken = dto.rewardToken;
    playPrediction.rewardKudos = dto.rewardKudos;
    playPrediction.isSent = dto.isSent;
    await this.playPredictionRepository.save(playPrediction);
    return new SuccessResponse(true);
  }

  async endPrediction(id: string): Promise<SuccessResponse> {
    const prediction = await this.predictionRepository.findOne({
      relations: {
        playPrediction: true,
      },
      where: { id },
    });
    for (const item of prediction.playPrediction) {
      this.socketService.message$.next({
        userId: item.userId,
        type: NotificationType.GameEnded,
        category: NotificationCategoryType.Game,
        section: GameType.Prediction,
        uniqueId: id,
        content: prediction.title,
      });
    }
    prediction.isEnded = true;
    await this.predictionRepository.save(prediction);
    return new SuccessResponse(true);
  }

  async endExpiredPrediction(): Promise<SuccessResponse> {
    try {
      return new SuccessResponse(true);
    } catch (ex) {
      return new SuccessResponse(
        false,
        ex.errorMessage || 'Could not end expired prediction',
      );
    }
  }
}
