import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SuccessResponse } from 'src/common/models/success-response';

import { SportsEntity } from './entities/sports.entity';
import { TeamEntity } from 'src/team/entities/team.entity';
import { getFromDto } from 'src/common/utils/repository.util';
import { SportsRegisterDto, SportsUpdateDto } from './dtos/sports.dto';

export class SportsService {
  constructor(
    @InjectRepository(SportsEntity)
    private sportsRepository: Repository<SportsEntity>,

    @InjectRepository(TeamEntity)
    private teamRepository: Repository<TeamEntity>,
  ) {}

  // Create one sport
  async createSport(dto: SportsRegisterDto): Promise<SportsEntity> {
    const sport = getFromDto<SportsEntity>(dto, new SportsEntity());
    const sportEntity = await this.sportsRepository.save(sport);
    return sportEntity;
  }

  //Get all Sport list
  async getAllSport(
    skip: number,
    take: number,
  ): Promise<[SportsEntity[], number]> {
    return this.sportsRepository.findAndCount({
      relations: ['teams'],
      order: {
        createdAt: 'DESC',
      },
      skip,
      take,
    });
  }

  // Get one Sport by id
  async getOneSport(id: string): Promise<SportsEntity> {
    const sport = await this.sportsRepository.findOne({
      where: { id },
      relations: ['teams'],
    });

    if (!sport) {
      throw new BadRequestException('Could not find the sport item.');
    }
    return sport;
  }

  // Update Sport by id
  async updateSport(
    id: string,
    dto: SportsUpdateDto,
  ): Promise<SuccessResponse> {
    let sport = await this.sportsRepository.findOneBy({
      id: id,
    });
    if (!sport) {
      throw new BadRequestException('Could not find the sport item.');
    }
    sport = getFromDto(dto, sport);
    await this.sportsRepository.save(sport);
    return new SuccessResponse(true);
  }

  async deleteSport(id: string): Promise<SuccessResponse> {
    await this.sportsRepository.softDelete({ id });
    return new SuccessResponse(true);
  }
}
