import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import {
  In,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';

import { GameService } from '../game/game.service';
import {
  DirectionFilter,
  MatchFilter,
  SortFilter,
} from 'src/common/models/base';
import { MatchEntity } from './entities/match.entity';
import { TeamEntity } from 'src/team/entities/team.entity';
import { getFromDto } from 'src/common/utils/repository.util';
import {
  MatchDetailQueryDto,
  MatchRegisterDto,
  MatchUpdateDto,
} from './dtos/match.dto';
import { SuccessResponse } from 'src/common/models/success-response';
import { ChallengeService } from '../challenge/challenge.service';
import { PollService } from '../poll/poll.service';

@Injectable()
export class MatchService {
  constructor(
    private readonly gameService: GameService,
    private readonly challengeService: ChallengeService,
    private readonly pollService: PollService,
    @InjectRepository(MatchEntity)
    private matchRepository: Repository<MatchEntity>,
    @InjectRepository(TeamEntity)
    private teamRepository: Repository<TeamEntity>,
  ) {}

  // Create one match
  async createMatch(dto: MatchRegisterDto): Promise<MatchEntity> {
    const team = await this.teamRepository.findOneBy({
      id: dto.teamId,
    });
    if (!team) {
      throw new BadRequestException('Could not find the team.');
    }

    if (dto.homeTeamId === dto.awayTeamId) {
      throw new BadRequestException("Home team and Away team can't be same");
    }
    const homeTeam = await this.teamRepository.findOneBy({
      id: dto.homeTeamId,
    });
    if (!homeTeam) {
      throw new BadRequestException('Could not find the team.');
    }
    const awayTeam = await this.teamRepository.findOneBy({
      id: dto.awayTeamId,
    });
    if (!awayTeam) {
      throw new BadRequestException('Could not find the team.');
    }

    const match = getFromDto<MatchEntity>(dto, new MatchEntity());
    return this.matchRepository.save(match);
  }

  //Get all Match list
  async getAllMatch(
    skip: number,
    take: number,
    filter: MatchFilter,
    search: string,
    sort: SortFilter,
    direction: DirectionFilter,
  ): Promise<[MatchEntity[], number]> {
    const searchArray =
      search === ''
        ? []
        : search.split(',').map((item) => item.replace(/\s/g, ''));
    const order = {};
    if (sort != SortFilter.Team) {
      order[sort] = direction;
    } else {
      order['team'] = { name: direction };
    }
    if (sort === SortFilter.Start && filter === MatchFilter.Upcoming) {
      order[sort] =
        direction === DirectionFilter.ASC
          ? DirectionFilter.DESC
          : DirectionFilter.ASC;
    }

    if (filter === MatchFilter.Ongoing) {
      return await this.matchRepository.findAndCount({
        relations: ['team', 'homeTeam', 'awayTeam'],
        where:
          search === ''
            ? {
                isDraft: false,
                start: LessThanOrEqual(new Date()),
                end: MoreThanOrEqual(new Date()),
              }
            : [
                {
                  isDraft: false,
                  start: LessThanOrEqual(new Date()),
                  end: MoreThanOrEqual(new Date()),
                  team: {
                    id: In([...searchArray]),
                  },
                },
              ],
        order,
        skip,
        take,
      });
    } else if (filter === MatchFilter.Expired) {
      return await this.matchRepository.findAndCount({
        relations: ['team', 'homeTeam', 'awayTeam'],
        where:
          search === ''
            ? {
                isDraft: false,
                end: LessThan(new Date()),
              }
            : [
                {
                  isDraft: false,
                  end: LessThan(new Date()),
                  team: {
                    id: In([...searchArray]),
                  },
                },
              ],
        order,
        skip,
        take,
      });
    } else if (filter === MatchFilter.Upcoming) {
      return await this.matchRepository.findAndCount({
        relations: ['team', 'homeTeam', 'awayTeam'],
        where:
          search === ''
            ? [
                {
                  isDraft: false,
                  start: MoreThan(new Date()),
                },
              ]
            : [
                {
                  isDraft: false,
                  start: MoreThan(new Date()),
                  team: {
                    id: In([...searchArray]),
                  },
                },
              ],
        order,
        skip,
        take,
      });
    } else if (filter === MatchFilter.Draft) {
      return await this.matchRepository.findAndCount({
        relations: ['team', 'homeTeam', 'awayTeam'],
        where:
          search === ''
            ? {
                isDraft: true,
              }
            : [
                {
                  isDraft: true,
                  team: {
                    id: In([...searchArray]),
                  },
                },
              ],
        order,
        skip,
        take,
      });
    } else {
      return await this.matchRepository.findAndCount({
        relations: ['team', 'homeTeam', 'awayTeam'],
        where:
          search === ''
            ? {}
            : [
                {
                  homeTeam: {
                    id: In([...searchArray]),
                  },
                },
                {
                  awayTeam: {
                    id: In([...searchArray]),
                  },
                },
              ],
        order,
        skip,
        take,
      });
    }
  }

  // Get one Match by id
  async getOneMatch(
    id: string,
    showGame: string,
    showChallenge: string,
    showPoll: string,
  ): Promise<MatchDetailQueryDto> {
    const match = await this.matchRepository.findOne({
      where: {
        id,
      },
      relations: ['team', 'homeTeam', 'awayTeam'],
    });
    if (!match) {
      throw new BadRequestException('Could not find the match item.');
    }

    let games = { data: [], count: 0 };
    if (showGame === 'true') {
      games = await this.gameService.getGamesByMatchId(id);
    }

    let challenges = { data: [], count: 0 };
    if (showChallenge === 'true') {
      challenges = await this.challengeService.getChallengesByMatchId(id);
    }

    let polls = { data: [], count: 0 };
    if (showPoll === 'true') {
      polls = await this.pollService.findByMatchId(id);
    }
    return {
      match: match.toDto(),
      games,
      challenges,
      polls,
    };
  }

  // Update Match by id
  async updateMatch(id: string, dto: MatchUpdateDto): Promise<SuccessResponse> {
    let match = await this.matchRepository.findOneBy({
      id,
    });
    if (!match) {
      throw new BadRequestException('Could not find the match item.');
    }
    if (dto.teamId) {
      const team = await this.teamRepository.findOneBy({
        id: dto.teamId,
      });
      if (!team) {
        throw new BadRequestException('Could not find the team.');
      }
    }

    if (dto.homeTeamId) {
      const homeTeam = await this.teamRepository.findOneBy({
        id: dto.homeTeamId,
      });
      if (!homeTeam) {
        throw new BadRequestException('Could not find the team.');
      }
    }
    if (dto.awayTeamId) {
      const awayTeam = await this.teamRepository.findOneBy({
        id: dto.awayTeamId,
      });
      if (!awayTeam) {
        throw new BadRequestException('Could not find the team.');
      }
    }
    match = getFromDto(dto, match);
    await this.matchRepository.save(match);
    return new SuccessResponse(true);
  }

  async deleteMatch(id: string): Promise<SuccessResponse> {
    await this.matchRepository.softDelete({ id });
    return new SuccessResponse(true);
  }
}
