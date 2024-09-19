import { In, Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SuccessResponse } from 'src/common/models/success-response';

import { getFromDto } from 'src/common/utils/repository.util';
import { TeamEntity } from 'src/team/entities/team.entity';
import { TokenRegisterDto, TokenUpdateDto } from './dtos/token.dto';
import { TokenEntity } from './entities/token.entity';

export class TokenService {
  constructor(
    @InjectRepository(TokenEntity)
    private tokenRepository: Repository<TokenEntity>,

    @InjectRepository(TeamEntity)
    private teamRepository: Repository<TeamEntity>,
  ) {}

  // Create one token
  async createToken(dto: TokenRegisterDto): Promise<TokenEntity> {
    const team = await this.teamRepository.findOneBy({ id: dto.teamId });
    if (!team) {
      throw new BadRequestException('Could not find the team.');
    }
    const token = getFromDto<TokenEntity>(dto, new TokenEntity());
    token.team = team;
    const tokenEntity = await this.tokenRepository.save(token);
    team.tokenId = tokenEntity.id;
    await this.teamRepository.save(team);
    return tokenEntity;
  }

  //Get all Token list
  async getAllToken(
    skip: number,
    take: number,
    search: string,
  ): Promise<[TokenEntity[], number]> {
    const searchArray =
      search === ''
        ? []
        : search.split(',').map((item) => item.replace(/\s/g, ''));
    return this.tokenRepository.findAndCount({
      relations: ['team'],
      where:
        search === ''
          ? {}
          : {
              team: {
                id: In([...searchArray]),
              },
            },
      order: {
        createdAt: 'DESC',
      },
      skip,
      take,
    });
  }

  // Get one Token by id
  async getOneToken(id: string): Promise<TokenEntity> {
    const token = await this.tokenRepository.findOne({
      where: { id },
      relations: ['team'],
    });

    if (!token) {
      throw new BadRequestException('Could not find the token item.');
    }
    return token;
  }

  // Update Token by id
  async updateToken(id: string, dto: TokenUpdateDto): Promise<SuccessResponse> {
    let token = await this.tokenRepository.findOneBy({
      id: id,
    });
    if (!token) {
      throw new BadRequestException('Could not find the token item.');
    }
    if (dto.teamId) {
      const team = await this.teamRepository.findOneBy({ id: dto.teamId });
      if (!team) {
        throw new BadRequestException('Could not find the team.');
      }
    }
    token = getFromDto(dto, token);
    await this.tokenRepository.save(token);
    return new SuccessResponse(true);
  }

  async deleteToken(id: string): Promise<SuccessResponse> {
    await this.tokenRepository.softDelete({ id });
    return new SuccessResponse(true);
  }
}
