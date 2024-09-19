import {
  BadRequestException,
  Injectable,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { getFromDto } from '../common/utils/repository.util';
import {
  MultiReferrerRegisterDto,
  MultiReferrerUpdateDto,
} from './dtos/multi-referrer.dto';
import { PlayMultiReferrerEntity } from './entities/play-multi-referrer.entity';
import { PlayMultiReferrerInvitationEntity } from './entities/play-multi-referrer-invitation.entity';
import { PlayMultiReferrerRegisterDto } from './dtos/play-multi-referrer.dto';
import { SuccessResponse } from '../common/models/success-response';
import { UserEntity } from 'src/user/entities/user.entity';
import { TeamEntity } from 'src/team/entities/team.entity';
import { SponsorEntity } from 'src/sponsor/entities/sponsor.entity';
import { MultiReferrerEntity } from './entities/multi-referrer.entity';

@Injectable()
export class MultiReferrerService {
  constructor(
    @InjectRepository(MultiReferrerEntity)
    private multiReferrerRepository: Repository<MultiReferrerEntity>,
    @InjectRepository(PlayMultiReferrerEntity)
    private playMultiReferrerRepository: Repository<PlayMultiReferrerEntity>,
    @InjectRepository(PlayMultiReferrerInvitationEntity)
    private playMultiReferrerInvitationRepository: Repository<PlayMultiReferrerInvitationEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(TeamEntity)
    private teamRepository: Repository<TeamEntity>,
    @InjectRepository(SponsorEntity)
    private sponsorRepository: Repository<SponsorEntity>,
  ) {}

  // Create One Multiple Referrer Challenge
  @UsePipes(new ValidationPipe({ transform: true }))
  async createMultiReferrer(
    dto: MultiReferrerRegisterDto,
  ): Promise<MultiReferrerEntity> {
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
    const multiReferrer = getFromDto<MultiReferrerEntity>(
      dto,
      new MultiReferrerEntity(),
    );
    return this.multiReferrerRepository.save(multiReferrer);
  }

  // Get all Multiple Referrer Challenges
  async getAllMultiReferrer(
    skip: number,
    take: number,
  ): Promise<[MultiReferrerEntity[], number]> {
    return this.multiReferrerRepository.findAndCount({
      relations: [
        'team',
        'sponsor',
        'match',
        'match.homeTeam',
        'match.awayTeam',
        'playMultiReferrer',
      ],
      skip,
      take,
    });
  }

  // Get one Multiple Referrer Challenges by id
  async getOneMultiReferrer(id: string): Promise<MultiReferrerEntity> {
    return this.multiReferrerRepository.findOne({
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

  // Update Multiple Referrer Challenge by id
  async updateMultiReferrer(
    id: string,
    dto: MultiReferrerUpdateDto,
  ): Promise<MultiReferrerEntity> {
    let multiReferrer = await this.multiReferrerRepository.findOneBy({
      id: id,
    });
    if (!multiReferrer) {
      throw new BadRequestException(
        'Could not find the multiple referrer challenge item.',
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
    multiReferrer = getFromDto(dto, multiReferrer);
    return this.multiReferrerRepository.save(multiReferrer);
  }

  // publish by id
  async publish(id: string): Promise<MultiReferrerEntity> {
    let instance = await this.multiReferrerRepository.findOneBy({
      id: id,
    });
    if (!instance) {
      throw new BadRequestException('Could not find item.');
    }
    if (!instance.isDraft) {
      throw new BadRequestException('Could only publish for draft instance');
    }
    instance.isDraft = false;
    return await this.multiReferrerRepository.save(instance);
  }

  // Create Multiple referrer challenge play history
  async createPlayMultiReferrer(
    dto: PlayMultiReferrerRegisterDto,
    teamId: string,
    userId: string,
  ): Promise<PlayMultiReferrerEntity> {
    const multiReferrer = await this.multiReferrerRepository.findOneBy({
      id: dto.multiReferrerId,
    });
    if (!multiReferrer) {
      throw new BadRequestException(
        'Could not find the multi referrer challenge item.',
      );
    }
    if (multiReferrer.teamId !== teamId) {
      throw new BadRequestException('You should only play team challenge');
    }
    if (multiReferrer.isDraft) {
      throw new BadRequestException('This is draft check-in');
    }
    if (new Date(multiReferrer.end) < new Date()) {
      throw new BadRequestException('This challenge is expired.');
    }
    if (new Date(multiReferrer.start) > new Date()) {
      throw new BadRequestException('This challenge is not started yet.');
    }
    let playMultiReferrer = await this.playMultiReferrerRepository.findOneBy({
      multiReferrerId: dto.multiReferrerId,
      userId: userId,
    });

    if (!playMultiReferrer) {
      const user = await this.userRepository.findOneBy({
        id: userId,
      });
      if (!user) {
        throw new BadRequestException('Could not find the user.');
      }
      dto['user'] = user;

      const newPlayMultiReferrer = getFromDto<PlayMultiReferrerEntity>(
        dto,
        new PlayMultiReferrerEntity(),
      );
      newPlayMultiReferrer.invitation = [];
      playMultiReferrer = await this.playMultiReferrerRepository.save(
        newPlayMultiReferrer,
      );
    }
    dto['invitation']['playMultiReferrerId'] = playMultiReferrer.id;

    const newPlayMultiReferrerInvitation =
      getFromDto<PlayMultiReferrerInvitationEntity>(
        dto.invitation,
        new PlayMultiReferrerInvitationEntity(),
      );
    await this.playMultiReferrerInvitationRepository.save(
      newPlayMultiReferrerInvitation,
    );
    return await this.playMultiReferrerRepository.findOne({
      relations: {
        multiReferrer: true,
      },
      where: {
        multiReferrerId: dto.multiReferrerId,
        userId: userId,
      },
    });
  }

  // Get multiple referrer challenge with play history by id and userId
  async getOneMultiReferrerForUser(
    id: string,
    userId: string,
  ): Promise<MultiReferrerEntity> {
    return this.multiReferrerRepository.findOne({
      relations: [
        'playMultiReferrer',
        'playMultiReferrer.invitation',
        'sponsor',
      ],
      where: {
        id: id,
        playMultiReferrer: {
          userId: userId,
        },
      },
    });
  }

  async deleteChallenge(id: string): Promise<SuccessResponse> {
    await this.multiReferrerRepository.softDelete({ id });
    return new SuccessResponse(true);
  }
}
