import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  In,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Not,
  Repository,
} from 'typeorm';

import {
  GameItemDto,
  GameListByOwnerResponseDto,
  JustOnlineGameDto,
} from './dtos/game.dto';
import { PaginatorDto } from '../common/dtos/paginator.dto';
import {
  DirectionFilter,
  GameFilter,
  GameType,
  SortFilter,
} from 'src/common/models/base';
import { TriviaEntity } from '../trivia/entities/trivia.entity';
import { MilestoneEntity } from '../milestone/entities/milestone.entity';
import { PredictionEntity } from '../prediction/entities/prediction.entity';
import { MiniGameEntity } from 'src/mini-game/entities/mini-game.entity';

@Injectable()
export class GameService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(PredictionEntity)
    private predictionRepository: Repository<PredictionEntity>,
    @InjectRepository(TriviaEntity)
    private triviaRepository: Repository<TriviaEntity>,
    @InjectRepository(MilestoneEntity)
    private milestoneRepository: Repository<MilestoneEntity>,
  ) {}

  async getJustAliveGames(
    diffMinutes: number = 10,
  ): Promise<JustOnlineGameDto[]> {
    let conditionStr = `EXTRACT(EPOCH FROM (now() - "game"."start")) > 0 and EXTRACT(EPOCH FROM (now() - "game"."start")) < ${
      diffMinutes * 60
    }`;
    conditionStr += ' and "game"."is_draft" = false';

    const predictionDB = this.dataSource
      .getRepository(PredictionEntity)
      .createQueryBuilder('game')
      .select(['"game"."id"'])
      .addSelect("'" + GameType.Prediction + "'", 'type')
      .addSelect(['"game"."team_id"'])
      .addSelect(['"game"."title"'])
      .addSelect(['"game"."description"'])
      .addSelect(['"game"."start"'])
      .addSelect(['"game"."end"'])
      .where(conditionStr);

    const triviaDB = this.dataSource
      .getRepository(TriviaEntity)
      .createQueryBuilder('game')
      .select(['"game"."id"'])
      .addSelect("'" + GameType.Trivia + "'", 'type')
      .addSelect(['"game"."team_id"'])
      .addSelect(['"game"."title"'])
      .addSelect(['"game"."description"'])
      .addSelect(['"game"."start"'])
      .addSelect(['"game"."end"'])
      .where(conditionStr);
    const milestoneDB = this.dataSource
      .getRepository(MilestoneEntity)
      .createQueryBuilder('game')
      .select(['"game"."id"'])
      .addSelect("'" + GameType.Milestone + "'", 'type')
      .addSelect(['"game"."team_id"'])
      .addSelect(['"game"."title"'])
      .addSelect(['"game"."description"'])
      .addSelect(['"game"."start"'])
      .addSelect(['"game"."end"'])
      .where(conditionStr);

    const [sql1, params1] = predictionDB.getQueryAndParameters();
    const [sql2, params2] = triviaDB.getQueryAndParameters();
    const [sql3, params3] = milestoneDB.getQueryAndParameters();

    return await this.dataSource.query(
      `select a.* from ((${sql1}) UNION (${sql2}) UNION (${sql3})) as a`,
    );
  }

  async getGamesBySide(
    side: string,
    userId: string,
    filter: GameFilter,
    search: string,
    isDraft: string,
    isEnded: string,
  ): Promise<GameListByOwnerResponseDto> {
    const searchArray =
      search === ''
        ? []
        : search.split(',').map((item) => item.replace(/\s/g, ''));
    let conditionObj = {};
    if (filter === GameFilter.Upcoming) {
      conditionObj = {
        start: MoreThan(new Date()),
      };
    } else if (filter === GameFilter.Ongoing) {
      conditionObj = {
        start: LessThanOrEqual(new Date()),
        end: MoreThanOrEqual(new Date()),
      };
    } else if (filter === GameFilter.Past) {
      conditionObj = {
        end: LessThan(new Date()),
      };
    }
    if (search) {
      conditionObj = { ...conditionObj, team: { id: In([...searchArray]) } };
    }
    if (['true', 'false'].indexOf(isDraft) > -1) {
      conditionObj = {
        ...conditionObj,
        isDraft: isDraft === 'true',
      };
    }
    if (['true', 'false'].indexOf(isEnded) > -1) {
      conditionObj = {
        ...conditionObj,
        isEnded: isEnded === 'true',
      };
    }

    let predictionCondition = {};
    predictionCondition = Object.assign(predictionCondition, conditionObj);
    if (userId) {
      predictionCondition = {
        ...predictionCondition,
        playPrediction: { userId: side === 'owner' ? userId : Not(userId) },
      };
    }
    const [predictionRes, predictionCount] =
      await this.predictionRepository.findAndCount({
        relations: {
          playPrediction: true,
          team: true,
          match: true,
        },
        where: predictionCondition,
        order: {
          start: 'DESC',
        },
      });

    let triviaCondition = {};
    triviaCondition = Object.assign(triviaCondition, conditionObj);
    if (userId) {
      triviaCondition = {
        ...triviaCondition,
        playTrivia: { userId: side === 'owner' ? userId : Not(userId) },
      };
    }
    const [triviaRes, triviaCount] = await this.triviaRepository.findAndCount({
      relations: {
        playTrivia: true,
        team: true,
        match: true,
      },
      where: triviaCondition,
      order: {
        start: 'DESC',
      },
    });

    let milestoneCondition = {};
    milestoneCondition = Object.assign(milestoneCondition, conditionObj);
    if (userId) {
      milestoneCondition = {
        ...milestoneCondition,
        playMilestone: { userId: side === 'owner' ? userId : Not(userId) },
      };
    }
    const [milestoneRes, milestoneCount] =
      await this.milestoneRepository.findAndCount({
        relations: {
          playMilestone: true,
          team: true,
          match: true,
        },
        where: milestoneCondition,
        order: {
          start: 'DESC',
        },
      });

    return {
      prediction: {
        data: predictionRes || [],
        count: predictionCount || 0,
      },
      trivia: {
        data: triviaRes || [],
        count: triviaCount || 0,
      },
      milestone: {
        data: milestoneRes || [],
        count: milestoneCount || 0,
      },
    };
  }

  async getGames(
    skip: number,
    take: number,
    filter: GameFilter,
    search: string,
    isDraft: string,
    isEnded: string,
    sort: SortFilter,
    direction: DirectionFilter,
    ownerId: string,
  ): Promise<PaginatorDto<GameItemDto>> {
    let conditionStr = '1 = 1';
    if (filter === GameFilter.Upcoming) {
      conditionStr = '"game"."start" > now() and "game"."is_ended" = false';
    } else if (filter === GameFilter.Ongoing) {
      conditionStr =
        '"game"."start" < now() and "game"."end" > now() and "game"."is_ended" = false';
    } else if (filter === GameFilter.Past) {
      conditionStr = '("game"."end" < now() or "game"."is_ended" = true)';
    }
    if (search) {
      conditionStr += ` and "game"."team_id" in ('${search
        .split(',')
        .join("','")}')`;
    }
    if (isDraft === 'true') {
      conditionStr += ' and "game"."is_draft" = true';
    } else if (isDraft === 'false') {
      conditionStr += ' and "game"."is_draft" = false';
    }
    if (isEnded === 'true') {
      conditionStr += ' and "game"."is_ended" = true';
    } else if (isEnded === 'false') {
      conditionStr += ' and "game"."is_ended" = false';
    }
    const predictionDB = this.dataSource
      .getRepository(PredictionEntity)
      .createQueryBuilder('game')
      .leftJoinAndSelect('game.team', 'team')
      .leftJoinAndSelect('game.match', 'match')
      .leftJoinAndSelect('match.homeTeam', 'homeTeam')
      .leftJoinAndSelect('match.awayTeam', 'awayTeam')
      .leftJoinAndSelect('game.rewardDistribution', 'rewardDistribution')
      .select(['"game"."id"'])
      .addSelect("'" + GameType.Prediction + "'", 'type')
      .addSelect("''", 'logo')
      .addSelect(
        `(select (case when count(*) > 0 then true else false end) as isPlayed from play_prediction where "play_prediction"."prediction_id" = "game"."id" and "play_prediction"."user_id" = '${ownerId}')`,
        'isPlayed',
      )
      .addSelect(['"game"."title"'])
      .addSelect(['"game"."description"'])
      .addSelect(['"game"."start"'])
      .addSelect(['"game"."end"'])
      .addSelect(['"game"."is_ended"'])
      .addSelect(['"team"."name" as team_name'])
      .addSelect(['"team"."description" as team_description'])
      .addSelect(['"team"."logo" as team_logo'])
      .addSelect(['"match"."title" as match_title'])
      .addSelect(['"match"."type" as match_type'])
      .addSelect(['"homeTeam"."name" as match_home_team_name'])
      .addSelect(['"homeTeam"."description" as match_home_team_description'])
      .addSelect(['"homeTeam"."logo" as match_home_team_logo'])
      .addSelect(['"awayTeam"."name" as match_away_team_name'])
      .addSelect(['"awayTeam"."description" as match_away_team_description'])
      .addSelect(['"awayTeam"."logo" as match_away_team_logo'])
      .addSelect(['"rewardDistribution"."reward_kudos" as kudos_reward_amount'])
      .addSelect(['"rewardDistribution"."reward_token" as token_reward_amount'])
      .where(conditionStr)
      .andWhere('"rewardDistribution"."winner_order" = 1');

    const triviaDB = this.dataSource
      .getRepository(TriviaEntity)
      .createQueryBuilder('game')
      .leftJoinAndSelect('game.team', 'team')
      .leftJoinAndSelect('game.match', 'match')
      .leftJoinAndSelect('match.homeTeam', 'homeTeam')
      .leftJoinAndSelect('match.awayTeam', 'awayTeam')
      .leftJoinAndSelect('game.rewardDistribution', 'rewardDistribution')
      .select(['"game"."id"'])
      .addSelect("'" + GameType.Trivia + "'", 'type')
      .addSelect("''", 'logo')
      .addSelect(
        `(select (case when count(*) > 0 then true else false end) as isPlayed from play_trivia where "play_trivia"."trivia_id" = "game"."id" and "play_trivia"."user_id" = '${ownerId}')`,
        'isPlayed',
      )
      .addSelect(['"game"."title"'])
      .addSelect(['"game"."description"'])
      .addSelect(['"game"."start"'])
      .addSelect(['"game"."end"'])
      .addSelect(['"game"."is_ended"'])
      .addSelect(['"team"."name" as team_name'])
      .addSelect(['"team"."description" as team_description'])
      .addSelect(['"team"."logo" as team_logo'])
      .addSelect(['"match"."title" as match_title'])
      .addSelect(['"match"."type" as match_type'])
      .addSelect(['"homeTeam"."name" as match_home_team_name'])
      .addSelect(['"homeTeam"."description" as match_home_team_description'])
      .addSelect(['"homeTeam"."logo" as match_home_team_logo'])
      .addSelect(['"awayTeam"."name" as match_away_team_name'])
      .addSelect(['"awayTeam"."description" as match_away_team_description'])
      .addSelect(['"awayTeam"."logo" as match_away_team_logo'])
      .addSelect(['"rewardDistribution"."reward_kudos" as kudos_reward_amount'])
      .addSelect(['"rewardDistribution"."reward_token" as token_reward_amount'])
      .where(conditionStr)
      .andWhere('"rewardDistribution"."winner_order" = 1');

    const milestoneDB = this.dataSource
      .getRepository(MilestoneEntity)
      .createQueryBuilder('game')
      .leftJoinAndSelect('game.team', 'team')
      .leftJoinAndSelect('game.match', 'match')
      .leftJoinAndSelect('match.homeTeam', 'homeTeam')
      .leftJoinAndSelect('match.awayTeam', 'awayTeam')
      .select(['"game"."id"'])
      .addSelect("'" + GameType.Milestone + "'", 'type')
      .addSelect("''", 'logo')
      .addSelect(
        `(select (case when count(*) > 0 then true else false end) as isPlayed from play_milestone where "play_milestone"."milestone_id" = "game"."id" and "play_milestone"."user_id" = '${ownerId}')`,
        'isPlayed',
      )
      .addSelect(['"game"."title"'])
      .addSelect(['"game"."description"'])
      .addSelect(['"game"."start"'])
      .addSelect(['"game"."end"'])
      .addSelect(['"game"."is_ended"'])
      .addSelect(['"team"."name" as team_name'])
      .addSelect(['"team"."description" as team_description'])
      .addSelect(['"team"."logo" as team_logo'])
      .addSelect(['"match"."title" as match_title'])
      .addSelect(['"match"."type" as match_type'])
      .addSelect(['"homeTeam"."name" as match_home_team_name'])
      .addSelect(['"homeTeam"."description" as match_home_team_description'])
      .addSelect(['"homeTeam"."logo" as match_home_team_logo'])
      .addSelect(['"awayTeam"."name" as match_away_team_name'])
      .addSelect(['"awayTeam"."description" as match_away_team_description'])
      .addSelect(['"awayTeam"."logo" as match_away_team_logo'])
      .addSelect(['"game"."reward_kudos_per_player" as kudos_reward_amount'])
      .addSelect(['"game"."reward_token_per_player" as token_reward_amount'])
      .where(conditionStr);

    const miniGameDB = this.dataSource
      .getRepository(MiniGameEntity)
      .createQueryBuilder('game')
      .leftJoinAndSelect('game.team', 'team')
      .leftJoinAndSelect('game.match', 'match')
      .leftJoinAndSelect('match.homeTeam', 'homeTeam')
      .leftJoinAndSelect('match.awayTeam', 'awayTeam')
      .leftJoinAndSelect('game.rewardDistribution', 'rewardDistribution')
      .select(['"game"."id"'])
      .addSelect("'" + GameType.MiniGame + "'", 'type')
      .addSelect(['"game"."logo"'])
      .addSelect(
        `(select (case when count(*) > 0 then true else false end) as isPlayed from play_mini_game where "play_mini_game"."mini_game_id" = "game"."id" and "play_mini_game"."user_id" = '${ownerId}')`,
        'isPlayed',
      )
      .addSelect(['"game"."title"'])
      .addSelect(['"game"."description"'])
      .addSelect(['"game"."start"'])
      .addSelect(['"game"."end"'])
      .addSelect(['"game"."is_ended"'])
      .addSelect(['"team"."name" as team_name'])
      .addSelect(['"team"."description" as team_description'])
      .addSelect(['"team"."logo" as team_logo'])
      .addSelect(['"match"."title" as match_title'])
      .addSelect(['"match"."type" as match_type'])
      .addSelect(['"homeTeam"."name" as match_home_team_name'])
      .addSelect(['"homeTeam"."description" as match_home_team_description'])
      .addSelect(['"homeTeam"."logo" as match_home_team_logo'])
      .addSelect(['"awayTeam"."name" as match_away_team_name'])
      .addSelect(['"awayTeam"."description" as match_away_team_description'])
      .addSelect(['"awayTeam"."logo" as match_away_team_logo'])
      .addSelect(['"rewardDistribution"."reward_kudos" as kudos_reward_amount'])
      .addSelect(['"rewardDistribution"."reward_token" as token_reward_amount'])
      .where(conditionStr)
      .andWhere('"rewardDistribution"."winner_order" = 1');

    const [sql1, params1] = predictionDB.getQueryAndParameters();
    const [sql2, params2] = triviaDB.getQueryAndParameters();
    const [sql3, params3] = milestoneDB.getQueryAndParameters();
    const [sql4, params4] = miniGameDB.getQueryAndParameters();
    let order = '';
    if (sort === SortFilter.Start) {
      order = `CASE WHEN "start" <= now() and "end" > now() and "is_ended" = false THEN now() - "start"
        WHEN  "start" > now() and "is_ended" = false THEN "start" - now()
        ELSE now() - "start" END ${direction}`;
    } else {
      order = `${
        sort === SortFilter.Team ? 'a.team_name' : `a.${sort}`
      } ${direction}`;
    }

    const data = await this.dataSource.query(
      `select * from ((${sql1}) UNION (${sql2}) UNION (${sql3}) UNION (${sql4})) as a order by 
        CASE 
          WHEN "start" <= now() and "end" > now() and "is_ended" = false THEN 1
          WHEN  "start" > now() and "is_ended" = false THEN 2
          ELSE 3
        END,
      ${order} limit ${take} offset ${skip}`,
    );

    const count = await this.dataSource.query(
      `select count(*) as count from ((${sql1}) UNION (${sql2}) UNION (${sql3}) UNION (${sql4})) as a`,
    );
    return {
      data: data || [],
      count: count[0].count || 0,
    };
  }

  async getUserGames(
    skip: number,
    take: number,
    filter: GameFilter,
    search: string,
    isDraft: string,
    userId: string,
  ): Promise<PaginatorDto<GameItemDto>> {
    let conditionStr = '1 = 1';
    if (filter === GameFilter.Upcoming) {
      conditionStr = '"game"."start" > now()';
    } else if (filter === GameFilter.Ongoing) {
      conditionStr =
        '"game"."start" < now() and "game"."end" > now() and "game"."is_ended" = false';
    } else if (filter === GameFilter.Past) {
      conditionStr = '("game"."end" < now() or "game"."is_ended" = true)';
    }
    if (search) {
      conditionStr += ` and "game"."team_id" in ('${search
        .split(',')
        .join("','")}')`;
    }
    if (isDraft === 'true') {
      conditionStr += ' and "game"."is_draft" = true';
    } else if (isDraft === 'false') {
      conditionStr += ' and "game"."is_draft" = false';
    }
    if (userId) {
      conditionStr += ` and "playGame"."user_id" = '${userId}'`;
    }
    const predictionDB = this.dataSource
      .getRepository(PredictionEntity)
      .createQueryBuilder('game')
      .leftJoinAndSelect('game.team', 'team')
      .leftJoinAndSelect('game.match', 'match')
      .leftJoinAndSelect('game.playPrediction', 'playGame')
      .leftJoinAndSelect('match.homeTeam', 'homeTeam')
      .leftJoinAndSelect('match.awayTeam', 'awayTeam')
      .leftJoinAndSelect('game.rewardDistribution', 'rewardDistribution')
      .select(['"game"."id"'])
      .addSelect("'" + GameType.Prediction + "'", 'type')
      .addSelect(['"game"."title"'])
      .addSelect(['"game"."description"'])
      .addSelect(['"game"."start"'])
      .addSelect(['"game"."end"'])
      .addSelect(['"team"."name" as team_name'])
      .addSelect(['"team"."description" as team_description'])
      .addSelect(['"team"."logo" as team_logo'])
      .addSelect(['"match"."title" as match_title'])
      .addSelect(['"match"."type" as match_type'])
      .addSelect(['"homeTeam"."name" as match_home_team_name'])
      .addSelect(['"homeTeam"."description" as match_home_team_description'])
      .addSelect(['"homeTeam"."logo" as match_home_team_logo'])
      .addSelect(['"awayTeam"."name" as match_away_team_name'])
      .addSelect(['"awayTeam"."description" as match_away_team_description'])
      .addSelect(['"awayTeam"."logo" as match_away_team_logo'])
      .addSelect(['"rewardDistribution"."reward_kudos" as kudos_reward_amount'])
      .addSelect(['"rewardDistribution"."reward_token" as token_reward_amount'])
      .where(conditionStr)
      .andWhere('"rewardDistribution"."winner_order" = 1');

    const triviaDB = this.dataSource
      .getRepository(TriviaEntity)
      .createQueryBuilder('game')
      .leftJoinAndSelect('game.team', 'team')
      .leftJoinAndSelect('game.match', 'match')
      .leftJoinAndSelect('game.playTrivia', 'playGame')
      .leftJoinAndSelect('match.homeTeam', 'homeTeam')
      .leftJoinAndSelect('match.awayTeam', 'awayTeam')
      .leftJoinAndSelect('game.rewardDistribution', 'rewardDistribution')
      .select(['"game"."id"'])
      .addSelect("'" + GameType.Trivia + "'", 'type')
      .addSelect(['"game"."title"'])
      .addSelect(['"game"."description"'])
      .addSelect(['"game"."start"'])
      .addSelect(['"game"."end"'])
      .addSelect(['"team"."name" as team_name'])
      .addSelect(['"team"."description" as team_description'])
      .addSelect(['"team"."logo" as team_logo'])
      .addSelect(['"match"."title" as match_title'])
      .addSelect(['"match"."type" as match_type'])
      .addSelect(['"homeTeam"."name" as match_home_team_name'])
      .addSelect(['"homeTeam"."description" as match_home_team_description'])
      .addSelect(['"homeTeam"."logo" as match_home_team_logo'])
      .addSelect(['"awayTeam"."name" as match_away_team_name'])
      .addSelect(['"awayTeam"."description" as match_away_team_description'])
      .addSelect(['"awayTeam"."logo" as match_away_team_logo'])
      .addSelect(['"rewardDistribution"."reward_kudos" as kudos_reward_amount'])
      .addSelect(['"rewardDistribution"."reward_token" as token_reward_amount'])
      .where(conditionStr)
      .andWhere('"rewardDistribution"."winner_order" = 1');

    const milestoneDB = this.dataSource
      .getRepository(MilestoneEntity)
      .createQueryBuilder('game')
      .leftJoinAndSelect('game.team', 'team')
      .leftJoinAndSelect('game.match', 'match')
      .leftJoinAndSelect('game.playMilestone', 'playGame')
      .leftJoinAndSelect('match.homeTeam', 'homeTeam')
      .leftJoinAndSelect('match.awayTeam', 'awayTeam')
      .select(['"game"."id"'])
      .addSelect("'" + GameType.Milestone + "'", 'type')
      .addSelect(['"game"."title"'])
      .addSelect(['"game"."description"'])
      .addSelect(['"game"."start"'])
      .addSelect(['"game"."end"'])
      .addSelect(['"team"."name" as team_name'])
      .addSelect(['"team"."description" as team_description'])
      .addSelect(['"team"."logo" as team_logo'])
      .addSelect(['"match"."title" as match_title'])
      .addSelect(['"match"."type" as match_type'])
      .addSelect(['"homeTeam"."name" as match_home_team_name'])
      .addSelect(['"homeTeam"."description" as match_home_team_description'])
      .addSelect(['"homeTeam"."logo" as match_home_team_logo'])
      .addSelect(['"awayTeam"."name" as match_away_team_name'])
      .addSelect(['"awayTeam"."description" as match_away_team_description'])
      .addSelect(['"awayTeam"."logo" as match_away_team_logo'])
      .addSelect(['"game"."reward_kudos_per_player" as kudos_reward_amount'])
      .addSelect(['"game"."reward_token_per_player" as token_reward_amount'])
      .where(conditionStr);

    const miniGameDB = this.dataSource
      .getRepository(MiniGameEntity)
      .createQueryBuilder('game')
      .leftJoinAndSelect('game.team', 'team')
      .leftJoinAndSelect('game.match', 'match')
      .leftJoinAndSelect('game.playMiniGame', 'playGame')
      .leftJoinAndSelect('match.homeTeam', 'homeTeam')
      .leftJoinAndSelect('match.awayTeam', 'awayTeam')
      .leftJoinAndSelect('game.rewardDistribution', 'rewardDistribution')
      .select(['"game"."id"'])
      .addSelect("'" + GameType.MiniGame + "'", 'type')
      .addSelect(['"game"."title"'])
      .addSelect(['"game"."description"'])
      .addSelect(['"game"."start"'])
      .addSelect(['"game"."end"'])
      .addSelect(['"team"."name" as team_name'])
      .addSelect(['"team"."description" as team_description'])
      .addSelect(['"team"."logo" as team_logo'])
      .addSelect(['"match"."title" as match_title'])
      .addSelect(['"match"."type" as match_type'])
      .addSelect(['"homeTeam"."name" as match_home_team_name'])
      .addSelect(['"homeTeam"."description" as match_home_team_description'])
      .addSelect(['"homeTeam"."logo" as match_home_team_logo'])
      .addSelect(['"awayTeam"."name" as match_away_team_name'])
      .addSelect(['"awayTeam"."description" as match_away_team_description'])
      .addSelect(['"awayTeam"."logo" as match_away_team_logo'])
      .addSelect(['"rewardDistribution"."reward_kudos" as kudos_reward_amount'])
      .addSelect(['"rewardDistribution"."reward_token" as token_reward_amount'])
      .where(conditionStr)
      .andWhere('"rewardDistribution"."winner_order" = 1');

    const [sql1, params1] = predictionDB.getQueryAndParameters();
    const [sql2, params2] = triviaDB.getQueryAndParameters();
    const [sql3, params3] = milestoneDB.getQueryAndParameters();
    const [sql4, params4] = miniGameDB.getQueryAndParameters();

    const data = await this.dataSource.query(
      `select * from ((${sql1}) UNION (${sql2}) UNION (${sql3}) UNION (${sql4})) as a order by 
      CASE 
        WHEN "start" <= now() and "end" > now()  THEN 1
        WHEN  "start" > now() THEN 2
      ELSE 3
      END,
      a.start asc
      limit ${take} offset ${skip}`,
    );

    const count = await this.dataSource.query(
      `select count(*) as count from ((${sql1}) UNION (${sql2}) UNION (${sql3}) UNION (${sql4})) as a`,
    );
    return {
      data: data || [],
      count: count[0].count || 0,
    };
  }

  async getGamesByMatchId(matchId: string): Promise<PaginatorDto<GameItemDto>> {
    const predictionDB = this.dataSource
      .getRepository(PredictionEntity)
      .createQueryBuilder('game')
      .leftJoinAndSelect('game.team', 'team')
      .leftJoinAndSelect('game.match', 'match')
      .leftJoinAndSelect('match.homeTeam', 'homeTeam')
      .leftJoinAndSelect('match.awayTeam', 'awayTeam')
      .leftJoinAndSelect('game.rewardDistribution', 'rewardDistribution')
      .select(['"game"."id"'])
      .addSelect("'" + GameType.Prediction + "'", 'type')
      .addSelect(['"game"."title"'])
      .addSelect(['"game"."description"'])
      .addSelect(['"game"."start"'])
      .addSelect(['"game"."end"'])
      .addSelect(['"team"."name" as team_name'])
      .addSelect(['"team"."description" as team_description'])
      .addSelect(['"team"."logo" as team_logo'])
      .addSelect(['"match"."title" as match_title'])
      .addSelect(['"match"."type" as match_type'])
      .addSelect(['"homeTeam"."name" as match_home_team_name'])
      .addSelect(['"homeTeam"."description" as match_home_team_description'])
      .addSelect(['"homeTeam"."logo" as match_home_team_logo'])
      .addSelect(['"awayTeam"."name" as match_away_team_name'])
      .addSelect(['"awayTeam"."description" as match_away_team_description'])
      .addSelect(['"awayTeam"."logo" as match_away_team_logo'])
      .addSelect(['"rewardDistribution"."reward_kudos" as kudos_reward_amount'])
      .addSelect(['"rewardDistribution"."reward_token" as token_reward_amount'])
      .where('"game"."match_id"=:id', { id: matchId })
      .andWhere('"rewardDistribution"."winner_order" = 1');

    const triviaDB = this.dataSource
      .getRepository(TriviaEntity)
      .createQueryBuilder('game')
      .leftJoinAndSelect('game.team', 'team')
      .leftJoinAndSelect('game.match', 'match')
      .leftJoinAndSelect('match.homeTeam', 'homeTeam')
      .leftJoinAndSelect('match.awayTeam', 'awayTeam')
      .leftJoinAndSelect('game.rewardDistribution', 'rewardDistribution')
      .select(['"game"."id"'])
      .addSelect("'" + GameType.Trivia + "'", 'type')
      .addSelect(['"game"."title"'])
      .addSelect(['"game"."description"'])
      .addSelect(['"game"."start"'])
      .addSelect(['"game"."end"'])
      .addSelect(['"team"."name" as team_name'])
      .addSelect(['"team"."description" as team_description'])
      .addSelect(['"team"."logo" as team_logo'])
      .addSelect(['"match"."title" as match_title'])
      .addSelect(['"match"."type" as match_type'])
      .addSelect(['"homeTeam"."name" as match_home_team_name'])
      .addSelect(['"homeTeam"."description" as match_home_team_description'])
      .addSelect(['"homeTeam"."logo" as match_home_team_logo'])
      .addSelect(['"awayTeam"."name" as match_away_team_name'])
      .addSelect(['"awayTeam"."description" as match_away_team_description'])
      .addSelect(['"awayTeam"."logo" as match_away_team_logo'])
      .addSelect(['"rewardDistribution"."reward_kudos" as kudos_reward_amount'])
      .addSelect(['"rewardDistribution"."reward_token" as token_reward_amount'])
      .where('"game"."match_id"=:id', { id: matchId })
      .andWhere('"rewardDistribution"."winner_order" = 1');

    const milestoneDB = this.dataSource
      .getRepository(MilestoneEntity)
      .createQueryBuilder('game')
      .leftJoinAndSelect('game.team', 'team')
      .leftJoinAndSelect('game.match', 'match')
      .leftJoinAndSelect('match.homeTeam', 'homeTeam')
      .leftJoinAndSelect('match.awayTeam', 'awayTeam')
      .select(['"game"."id"'])
      .addSelect("'" + GameType.Milestone + "'", 'type')
      .addSelect(['"game"."title"'])
      .addSelect(['"game"."description"'])
      .addSelect(['"game"."start"'])
      .addSelect(['"game"."end"'])
      .addSelect(['"team"."name" as team_name'])
      .addSelect(['"team"."description" as team_description'])
      .addSelect(['"team"."logo" as team_logo'])
      .addSelect(['"match"."title" as match_title'])
      .addSelect(['"match"."type" as match_type'])
      .addSelect(['"homeTeam"."name" as match_home_team_name'])
      .addSelect(['"homeTeam"."description" as match_home_team_description'])
      .addSelect(['"homeTeam"."logo" as match_home_team_logo'])
      .addSelect(['"awayTeam"."name" as match_away_team_name'])
      .addSelect(['"awayTeam"."description" as match_away_team_description'])
      .addSelect(['"awayTeam"."logo" as match_away_team_logo'])
      .addSelect(['"game"."reward_kudos_per_player" as kudos_reward_amount'])
      .addSelect(['"game"."reward_token_per_player" as token_reward_amount'])
      .where('"game"."match_id"=:id', { id: matchId });

    const miniGameDB = this.dataSource
      .getRepository(MiniGameEntity)
      .createQueryBuilder('game')
      .leftJoinAndSelect('game.team', 'team')
      .leftJoinAndSelect('game.match', 'match')
      .leftJoinAndSelect('match.homeTeam', 'homeTeam')
      .leftJoinAndSelect('match.awayTeam', 'awayTeam')
      .leftJoinAndSelect('game.rewardDistribution', 'rewardDistribution')
      .select(['"game"."id"'])
      .addSelect("'" + GameType.MiniGame + "'", 'type')
      .addSelect(['"game"."title"'])
      .addSelect(['"game"."description"'])
      .addSelect(['"game"."start"'])
      .addSelect(['"game"."end"'])
      .addSelect(['"team"."name" as team_name'])
      .addSelect(['"team"."description" as team_description'])
      .addSelect(['"team"."logo" as team_logo'])
      .addSelect(['"match"."title" as match_title'])
      .addSelect(['"match"."type" as match_type'])
      .addSelect(['"homeTeam"."name" as match_home_team_name'])
      .addSelect(['"homeTeam"."description" as match_home_team_description'])
      .addSelect(['"homeTeam"."logo" as match_home_team_logo'])
      .addSelect(['"awayTeam"."name" as match_away_team_name'])
      .addSelect(['"awayTeam"."description" as match_away_team_description'])
      .addSelect(['"awayTeam"."logo" as match_away_team_logo'])
      .addSelect(['"rewardDistribution"."reward_kudos" as kudos_reward_amount'])
      .addSelect(['"rewardDistribution"."reward_token" as token_reward_amount'])
      .where('"game"."match_id"=:id', { id: matchId })
      .andWhere('"rewardDistribution"."winner_order" = 1');

    const [sql1, params1] = predictionDB.getQueryAndParameters();
    const [sql2, params2] = triviaDB.getQueryAndParameters();
    const [sql3, params3] = milestoneDB.getQueryAndParameters();
    const [sql4, params4] = miniGameDB.getQueryAndParameters();

    const data = await this.dataSource.query(
      `select * from ((${sql1}) UNION (${sql2}) UNION (${sql3}) UNION (${sql4})) as a order by a.start desc`,
      [matchId],
    );

    const count = await this.dataSource.query(
      `select count(*) as count from ((${sql1}) UNION (${sql2}) UNION (${sql3}) UNION (${sql4})) as a`,
      [matchId],
    );
    return {
      data: data || [],
      count: count[0].count || 0,
    };
  }
}
