import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  getDistanceBetweenPoints,
  getFromDto,
} from '../common/utils/repository.util';
import {
  MultiCheckInRegisterDto,
  MultiCheckInUpdateDto,
} from './dtos/multi-check-in.dto';
import { PlayMultiCheckInEntity } from './entities/play-multi-check-in.entity';
import { PlayMultiCheckInItemEntity } from './entities/play-multi-check-in-item.entity';
import {
  PlayMultiCheckInDto,
  PlayMultiCheckInRegisterDto,
} from './dtos/play-multi-check-in.dto';
import { SuccessResponse } from '../common/models/success-response';
import { UserEntity } from 'src/user/entities/user.entity';
import { TeamEntity } from 'src/team/entities/team.entity';
import { MatchEntity } from 'src/match/entities/match.entity';
import { SponsorEntity } from 'src/sponsor/entities/sponsor.entity';
import { MultiCheckInEntity } from './entities/multi-check-in.entity';

@Injectable()
export class MultiCheckInService {
  constructor(
    @InjectRepository(MultiCheckInEntity)
    private multiCheckInRepository: Repository<MultiCheckInEntity>,
    @InjectRepository(PlayMultiCheckInEntity)
    private playMultiCheckInRepository: Repository<PlayMultiCheckInEntity>,
    @InjectRepository(PlayMultiCheckInItemEntity)
    private playMultiCheckInItemRepository: Repository<PlayMultiCheckInItemEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(TeamEntity)
    private teamRepository: Repository<TeamEntity>,
    @InjectRepository(MatchEntity)
    private matchRepository: Repository<MatchEntity>,
    @InjectRepository(SponsorEntity)
    private sponsorRepository: Repository<SponsorEntity>,
  ) {}

  // Crate one Multiple Check-in Challenge
  async createMultiCheckIn(
    dto: MultiCheckInRegisterDto,
  ): Promise<MultiCheckInEntity> {
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

    const multiCheckIn = getFromDto<MultiCheckInEntity>(
      dto,
      new MultiCheckInEntity(),
    );
    return this.multiCheckInRepository.save(multiCheckIn);
  }

  // Get all Multiple Check-in Challenges
  async getAllMultiCheckIn(
    skip: number,
    take: number,
  ): Promise<[MultiCheckInEntity[], number]> {
    return this.multiCheckInRepository.findAndCount({
      relations: [
        'team',
        'sponsor',
        'match',
        'match.homeTeam',
        'match.awayTeam',
        'playMultiCheckIn',
      ],
      skip,
      take,
    });
  }

  // Get one Multiple Check-in Challenge by id
  async getOneMultiCheckIn(id: string): Promise<MultiCheckInEntity> {
    return this.multiCheckInRepository.findOne({
      relations: [
        'team',
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

  // Update Check-in challenge by id
  async updateMultiCheckIn(
    id: string,
    dto: MultiCheckInUpdateDto,
  ): Promise<MultiCheckInEntity> {
    let checkIn = await this.multiCheckInRepository.findOneBy({
      id: id,
    });
    if (!checkIn) {
      throw new BadRequestException(
        'Could not find the multi check-in challenge item.',
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
    checkIn = getFromDto(dto, checkIn);
    return this.multiCheckInRepository.save(checkIn);
  }

  // Create one Multiple Check-in Challenge play history
  async createPlayMultiCheckIn(
    dto: PlayMultiCheckInRegisterDto,
    teamId: string,
    userId: string,
  ): Promise<PlayMultiCheckInEntity> {
    const multiCheckIn = await this.multiCheckInRepository.findOne({
      relations: [
        'team',
        'sponsor',
        'match',
        'match.homeTeam',
        'match.awayTeam',
      ],
      where: {
        id: dto.multiCheckInId,
      },
    });
    if (!multiCheckIn) {
      throw new BadRequestException(
        'Could not find the multi check-in challenge item.',
      );
    }
    if (multiCheckIn.teamId !== teamId) {
      throw new BadRequestException('You should only play team challenge');
    }
    if (multiCheckIn.isDraft) {
      throw new BadRequestException('This is draft check-in');
    }
    if (new Date(multiCheckIn.end) < new Date()) {
      throw new BadRequestException('This challenge is expired.');
    }
    if (new Date(multiCheckIn.start) > new Date()) {
      throw new BadRequestException('This challenge is not started yet.');
    }
    let playMultiCheckIn = await this.playMultiCheckInRepository.findOneBy({
      multiCheckInId: dto.multiCheckInId,
      userId: userId,
    });

    // Calculate distance between user location and match location
    const venueGoogleCoordinates =
      multiCheckIn.match.venueGoogleCoordinates.split(',');
    const userGoogleCoordinates = dto.item.userCoordinates.split(',');
    const distance = getDistanceBetweenPoints(
      Number(userGoogleCoordinates[0]),
      Number(userGoogleCoordinates[1]),
      Number(venueGoogleCoordinates[0]),
      Number(venueGoogleCoordinates[1]),
    );

    if (dto.item.location === 0 && distance > 500) {
      throw new BadRequestException('You are not in Venue');
    }

    if (!playMultiCheckIn) {
      const user = await this.userRepository.findOneBy({
        id: userId,
      });
      if (!user) {
        throw new BadRequestException('Could not find the user.');
      }
      const newplayMultiCheckIn = getFromDto<PlayMultiCheckInEntity>(
        dto,
        new PlayMultiCheckInEntity(),
      );
      newplayMultiCheckIn.user = user;
      playMultiCheckIn = await this.playMultiCheckInRepository.save(
        newplayMultiCheckIn,
      );
    }
    dto['item']['playMultiCheckInId'] = playMultiCheckIn.id;

    const newPlayMultiCheckInItem = getFromDto<PlayMultiCheckInItemEntity>(
      dto.item,
      new PlayMultiCheckInItemEntity(),
    );
    return await this.playMultiCheckInRepository.findOne({
      relations: {
        multiCheckIn: true,
      },
      where: {
        multiCheckInId: dto.multiCheckInId,
        userId: userId,
      },
    });
  }

  // publish by id
  async publish(id: string): Promise<MultiCheckInEntity> {
    let instance = await this.multiCheckInRepository.findOneBy({
      id: id,
    });
    if (!instance) {
      throw new BadRequestException('Could not find item.');
    }
    if (!instance.isDraft) {
      throw new BadRequestException('Could only publish for draft instance');
    }
    instance.isDraft = false;
    return await this.multiCheckInRepository.save(instance);
  }

  // Get Multiple Check-in Challenge with play history
  async getOneMultiCheckInForUser(
    id: string,
    userId: string,
  ): Promise<MultiCheckInEntity> {
    return this.multiCheckInRepository.findOne({
      relations: ['playMultiCheckIn', 'playMultiCheckIn.items', 'sponsor'],
      where: {
        id: id,
        playMultiCheckIn: {
          userId: userId,
        },
      },
    });
  }

  async deleteChallenge(id: string): Promise<SuccessResponse> {
    await this.multiCheckInRepository.softDelete({ id });
    return new SuccessResponse(true);
  }
}
