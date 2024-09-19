import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { PlayerEntity } from './entities/player.entity';
import { getFromDto } from '../common/utils/repository.util';
import { PlayerRegisterDto, PlayerUpdateDto } from './dtos/player.dto';
import { SuccessResponse } from 'src/common/models/success-response';

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(PlayerEntity)
    private playerRepository: Repository<PlayerEntity>,
  ) {}

  async create(dto: PlayerRegisterDto): Promise<PlayerEntity | null> {
    try {
      const player = getFromDto<PlayerEntity>(dto, new PlayerEntity());
      return await this.playerRepository.save(player);
    } catch (e) {
      return null;
    }
  }

  async updatePlayer(id: string, dto: PlayerUpdateDto): Promise<PlayerEntity> {
    let player = await this.playerRepository.findOneBy({
      id: id,
    });
    if (!player) {
      throw new BadRequestException('Could not find the team item.');
    }
    player = getFromDto(dto, player);
    return await this.playerRepository.save(player);
  }

  async deletePlayer(id: string): Promise<SuccessResponse> {
    await this.playerRepository.softDelete({ id });
    return new SuccessResponse(true);
  }

  async getPlayerList(
    skip: number,
    take: number,
    teams: string,
  ): Promise<[PlayerEntity[], number]> {
    const teamArray =
      teams === ''
        ? []
        : teams.split(',').map((item) => item.replace(/\s/g, ''));

    return await this.playerRepository.findAndCount({
      relations: {
        team: true,
      },
      where: {
        teamId: In([...teamArray]),
      },
      order: {
        createdAt: 'DESC',
      },
      skip,
      take,
    });
  }

  async find(): Promise<PlayerEntity[]> {
    return this.playerRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }
}
