import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  CheckInDuplicateDto,
  CheckInRegisterDto,
  CheckInUpdateDto,
} from './dtos/check-in.dto';
import {
  getDistanceBetweenPoints,
  getFromDto,
} from '../common/utils/repository.util';
import { PlayCheckInEntity } from './entities/play-check-in.entity';
import {
  DistanceCalculatorDto,
  PlayCheckInDto,
  PlayCheckInRegisterDto,
} from './dtos/play-check-in.dto';
import { SuccessResponse } from '../common/models/success-response';
import { UserEntity } from 'src/user/entities/user.entity';
import { TeamEntity } from 'src/team/entities/team.entity';
import { MatchEntity } from 'src/match/entities/match.entity';
import { SponsorEntity } from 'src/sponsor/entities/sponsor.entity';
import { CheckInEntity } from './entities/check-in.entity';
import { TransactionService } from '../transaction/transaction.service';
import { ChallengeType } from '../common/models/base';
import { SocketService } from '../socket/socket.service';
import {
  NotificationCategoryType,
  NotificationType,
} from '../notification/dtos/notification.dto';
import { MilestoneService } from 'src/milestone/milestone.service';
import { AssetEntity } from '../asset/entities/asset.entity';
import { AssetService } from '../asset/asset.service';

@Injectable()
export class CheckInService {
  constructor(
    @InjectRepository(CheckInEntity)
    private checkInRepository: Repository<CheckInEntity>,
    @InjectRepository(PlayCheckInEntity)
    private playCheckInRepository: Repository<PlayCheckInEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(TeamEntity)
    private teamRepository: Repository<TeamEntity>,
    @InjectRepository(MatchEntity)
    private matchRepository: Repository<MatchEntity>,
    @InjectRepository(SponsorEntity)
    private sponsorRepository: Repository<SponsorEntity>,
    @InjectRepository(AssetEntity)
    private assetRepository: Repository<AssetEntity>,
    private transactionService: TransactionService,
    private milestoneService: MilestoneService,
    private socketService: SocketService,
    private assetService: AssetService,
  ) {}

  // Create one Check-in challenge
  async createCheckIn(dto: CheckInRegisterDto): Promise<CheckInEntity> {
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

    const sameMatch = await this.checkInRepository.count({
      relations: ['match'],
      where: {
        match: {
          id: dto.matchId,
        },
      },
    });

    if (sameMatch) {
      throw new BadRequestException(
        'Could not create new check-in challenge for this match/event',
      );
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
    const checkIn = getFromDto<CheckInEntity>(dto, new CheckInEntity());
    if (dto.assetId) checkIn.asset = asset;
    return this.checkInRepository.save(checkIn);
  }
  async duplicateCheckIn(dto: CheckInDuplicateDto): Promise<CheckInEntity> {
    const team = await this.teamRepository.findOneBy({ id: dto.teamId });
    if (!team) {
      throw new BadRequestException('Could not find the team.');
    }

    const sponsor = await this.sponsorRepository.findOneBy({
      id: dto.sponsorId,
    });
    if (!sponsor) {
      throw new BadRequestException('Could not find the sponsor.');
    }

    const checkIn = getFromDto<CheckInEntity>(dto, new CheckInEntity());
    return this.checkInRepository.save(checkIn);
  }
  //Get all Check-in challenge list
  async getAllCheckIn(
    skip: number,
    take: number,
  ): Promise<[CheckInEntity[], number]> {
    return this.checkInRepository.findAndCount({
      relations: [
        'team',
        'asset',
        'sponsor',
        'match',
        'match.homeTeam',
        'match.awayTeam',
      ],
      order: {
        start: 'DESC',
      },
      skip,
      take,
    });
  }

  // Get one Check-in challenge by id
  async getOneCheckIn(id: string): Promise<CheckInEntity> {
    return this.checkInRepository.findOne({
      relations: [
        'team',
        'asset',
        'sponsor',
        'match',
        'match.homeTeam',
        'match.awayTeam',
      ],
      where: {
        id: id,
      },
    });
  }

  // Get one Check-in challenge result by id
  async getOneCheckInResult(checkInId: string): Promise<PlayCheckInDto[]> {
    const playCheckIns = await this.playCheckInRepository.find({
      select: {
        id: true,
        location: true,
        createdAt: true,
        user: {
          id: true,
          firstName: true,
          lastName: true,
        },
        receiveBonus: true,
      },
      relations: ['user'],
      where: {
        checkInId: checkInId,
      },
    });
    return playCheckIns.map((playCheckIn) => playCheckIn.toDto());
  }

  async getOneCheckInResultForUser(
    checkInId: string,
    userId: string,
  ): Promise<PlayCheckInDto> {
    const playCheckIn = await this.playCheckInRepository.findOne({
      relations: ['user'],
      where: {
        checkInId: checkInId,
        userId: userId,
      },
    });
    return playCheckIn.toDto();
  }

  // Update Check-in challenge by id
  async updateCheckIn(
    id: string,
    dto: CheckInUpdateDto,
  ): Promise<CheckInEntity> {
    let checkIn = await this.checkInRepository.findOneBy({
      id: id,
    });
    if (!checkIn) {
      throw new BadRequestException(
        'Could not find the check-in challenge item.',
      );
    }

    if (dto.teamId) {
      const team = await this.teamRepository.findOneBy({
        id: dto.teamId,
      });
      if (!team) {
        throw new BadRequestException('Could not find the team.');
      }
    }
    if (dto.sponsorId) {
      const sponsor = await this.sponsorRepository.findOneBy({
        id: dto.sponsorId,
      });
      if (!sponsor) {
        throw new BadRequestException('Could not find the sponsor.');
      }
    }

    if (dto.matchId) {
      const match = await this.matchRepository.findOneBy({
        id: dto.matchId,
      });
      if (!match) {
        throw new BadRequestException('Could not find the match.');
      }
    }

    if (dto.assetId) {
      const asset = await this.assetRepository.findOneBy({
        id: dto.assetId,
      });
      if (!asset) {
        throw new BadRequestException('Could not find the asset.');
      }
    }

    checkIn = getFromDto(dto, checkIn);
    return this.checkInRepository.save(checkIn);
  }

  // publish by id
  async publish(id: string): Promise<CheckInEntity> {
    const instance = await this.checkInRepository.findOneBy({
      id: id,
    });
    if (!instance) {
      throw new BadRequestException('Could not find item.');
    }
    if (!instance.isDraft) {
      throw new BadRequestException('Could only publish for draft instance');
    }
    instance.isDraft = false;
    return await this.checkInRepository.save(instance);
  }

  // Create one Check-in challenge play history
  async createPlayCheckIn(
    teamId: string,
    userId: string,
    dto: PlayCheckInRegisterDto,
  ): Promise<PlayCheckInEntity> {
    //Check checkin challenge is exist
    const checkIn = await this.checkInRepository.findOne({
      relations: [
        'team',
        'asset',
        'sponsor',
        'match',
        'match.homeTeam',
        'match.awayTeam',
        'playCheckIn',
      ],
      where: {
        id: dto.checkInId,
      },
    });
    if (!checkIn) {
      throw new BadRequestException(
        'Could not find the check-in challenge item.',
      );
    }
    if (checkIn.teamId !== teamId) {
      throw new BadRequestException('You should only play team challenge');
    }
    if (checkIn.isDraft) {
      throw new BadRequestException('This is draft check-in');
    }
    // Check if this challenge is expired
    if (new Date(checkIn.end) < new Date()) {
      throw new BadRequestException('This check-in challenge is expired.');
    }
    if (new Date(checkIn.start) > new Date()) {
      throw new BadRequestException(
        'This check-in challenge is not started yet.',
      );
    }

    //Check user already play checkin
    const history = await this.getOneCheckInForUser(checkIn.id, userId);
    if (history) {
      throw new BadRequestException('You already play this checkin');
    }

    const user = await this.userRepository.findOneBy({
      id: userId,
    });
    if (!user) {
      throw new BadRequestException('Could not find the user.');
    }

    // Check if user is eligble for this game
    if (
      user.tokenAmount < checkIn.eligbleToken ||
      user.kudosAmount < checkIn.eligbleKudos
    ) {
      throw new BadRequestException(
        'You are not eligible because of insufficient balance',
      );
    }

    // Calculate distance between user location and match location
    const venueGoogleCoordinates =
      checkIn.match.venueGoogleCoordinates.split(',');
    const userGoogleCoordinates = dto.userCoordinates.split(',');
    const distance = getDistanceBetweenPoints(
      Number(userGoogleCoordinates[0]),
      Number(userGoogleCoordinates[1]),
      Number(venueGoogleCoordinates[0]),
      Number(venueGoogleCoordinates[1]),
    );

    if (dto.location === 0 && distance > 500) {
      throw new BadRequestException('You are not in Venue');
    }

    const playCheckIn = getFromDto<PlayCheckInEntity>(
      dto,
      new PlayCheckInEntity(),
    );
    playCheckIn.checkIn = checkIn;
    playCheckIn.userId = userId;
    playCheckIn.user = user;
    playCheckIn.receiveBonus = false;
    if (
      checkIn.enableAssetReward &&
      checkIn.playCheckIn.length < checkIn.winnerLimit
    ) {
      try {
        await this.assetService.sendBonusAsset(
          checkIn.assetId,
          new Array(1).fill(userId),
          checkIn.rewardAssetCount,
          checkIn.title,
        );
        playCheckIn.receiveBonus = true;
      } catch (e: any) {}
    }
    const playCheckInEntity = await this.playCheckInRepository.save(
      playCheckIn,
    );
    this.socketService.message$.next({
      userId: userId,
      type: NotificationType.ChallengeCompleted,
      category: NotificationCategoryType.Challenge,
      section: ChallengeType.CheckIn,
      uniqueId: checkIn.id,
      content: checkIn.title,
      detailContent: dto.location ? 'Outside' : 'Inside',
    });
    const milestones = await this.milestoneService.findMilestoneByMatch(
      checkIn.matchId,
    );
    if (milestones && milestones.length > 0) {
      for (const milestone of milestones) {
        try {
          await this.milestoneService.createPlayMilestone(
            { milestoneId: milestone.id },
            teamId,
            userId,
          );
        } catch (e) {}
      }
    }
    return playCheckInEntity;
  }

  // Get Check-in chalenge play history by challengeId and userId
  async getOneCheckInForUser(
    id: string,
    userId: string,
  ): Promise<CheckInEntity> {
    return this.checkInRepository.findOne({
      relations: ['playCheckIn', 'sponsor', 'match'],
      where: {
        id: id,
        playCheckIn: {
          userId: userId,
        },
      },
    });
  }

  getDistance(dto: DistanceCalculatorDto): number {
    return getDistanceBetweenPoints(
      Number(dto.lat1),
      Number(dto.lng1),
      Number(dto.lat2),
      Number(dto.lng2),
    );
  }

  async deleteCheckIn(id: string): Promise<SuccessResponse> {
    await this.checkInRepository.softDelete({ id });
    return new SuccessResponse(true);
  }
}
