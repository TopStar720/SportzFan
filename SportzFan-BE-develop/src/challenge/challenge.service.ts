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
  ChallengeItemDto,
  ChallengeListBySideResponseDto,
  JustOnlineChallengeDto,
} from './dtos/challenge.dto';
import {
  ChallengeFilter,
  ChallengeType,
  DirectionFilter,
  SortFilter,
} from 'src/common/models/base';
import { PaginatorDto } from '../common/dtos/paginator.dto';
import { SurveyEntity } from '../survey/entities/survey.entity';
import { CheckInEntity } from '../check-in/entities/check-in.entity';
import { MultiCheckInEntity } from '../multi-check-in/entities/multi-check-in.entity';
import { MultiReferrerEntity } from '../multi-referrer/entities/multi-referrer.entity';

@Injectable()
export class ChallengeService {
  constructor(
    @InjectRepository(CheckInEntity)
    private checkInRepository: Repository<CheckInEntity>,
    @InjectRepository(MultiCheckInEntity)
    private multiCheckInRepository: Repository<MultiCheckInEntity>,
    @InjectRepository(SurveyEntity)
    private surveyRepository: Repository<SurveyEntity>,
    @InjectRepository(MultiReferrerEntity)
    private multiReferrerRepository: Repository<MultiReferrerEntity>,
    private dataSource: DataSource,
  ) {}

  async getJustAliveChallenges(
    diffMinutes: number = 10,
  ): Promise<JustOnlineChallengeDto[]> {
    let conditionStr = `EXTRACT(EPOCH FROM (now() - "challenge"."start")) > 0 and EXTRACT(EPOCH FROM (now() - "challenge"."start")) < ${
      diffMinutes * 60
    }`;
    conditionStr += ' and "challenge"."is_draft" = false';

    const checkInDB = this.dataSource
      .getRepository(CheckInEntity)
      .createQueryBuilder('challenge')
      .select(['"challenge"."id"'])
      .addSelect("'" + ChallengeType.CheckIn + "'", 'type')
      .addSelect(['"challenge"."team_id"'])
      .addSelect(['"challenge"."title"'])
      .addSelect(['"challenge"."description"'])
      .addSelect(['"challenge"."start"'])
      .addSelect(['"challenge"."end"'])
      .where(conditionStr);

    const multiCheckInDB = this.dataSource
      .getRepository(MultiCheckInEntity)
      .createQueryBuilder('challenge')
      .select(['"challenge"."id"'])
      .addSelect("'" + ChallengeType.MultiCheckIn + "'", 'type')
      .addSelect(['"challenge"."team_id"'])
      .addSelect(['"challenge"."title"'])
      .addSelect(['"challenge"."description"'])
      .addSelect(['"challenge"."start"'])
      .addSelect(['"challenge"."end"'])
      .where(conditionStr);

    const surveyDB = this.dataSource
      .getRepository(SurveyEntity)
      .createQueryBuilder('challenge')
      .select(['"challenge"."id"'])
      .addSelect("'" + ChallengeType.Survey + "'", 'type')
      .addSelect(['"challenge"."team_id"'])
      .addSelect(['"challenge"."title"'])
      .addSelect(['"challenge"."description"'])
      .addSelect(['"challenge"."start"'])
      .addSelect(['"challenge"."end"'])
      .where(conditionStr);

    const multiReferrerDB = this.dataSource
      .getRepository(MultiReferrerEntity)
      .createQueryBuilder('challenge')
      .select(['"challenge"."id"'])
      .addSelect("'" + ChallengeType.MultiReferrer + "'", 'type')
      .addSelect(['"challenge"."team_id"'])
      .addSelect(['"challenge"."title"'])
      .addSelect(['"challenge"."description"'])
      .addSelect(['"challenge"."start"'])
      .addSelect(['"challenge"."end"'])
      .where(conditionStr);

    const [sql1, params1] = checkInDB.getQueryAndParameters();
    const [sql2, params2] = multiCheckInDB.getQueryAndParameters();
    const [sql3, params3] = surveyDB.getQueryAndParameters();
    const [sql4, params4] = multiReferrerDB.getQueryAndParameters();

    return await this.dataSource.query(
      `select * from ((${sql1}) UNION (${sql2}) UNION (${sql3}) UNION (${sql4})) as a order by a.start desc`,
    );
  }

  async getChallengesByOwner(
    side: string,
    userId: string,
    filter: ChallengeFilter,
    search: string,
  ): Promise<ChallengeListBySideResponseDto> {
    const searchArray =
      search === ''
        ? []
        : search.split(',').map((item) => item.replace(/\s/g, ''));
    let conditionObj = {};
    if (filter === ChallengeFilter.Upcoming) {
      conditionObj = {
        start: MoreThan(new Date()),
      };
    } else if (filter === ChallengeFilter.Ongoing) {
      conditionObj = {
        start: LessThanOrEqual(new Date()),
        end: MoreThanOrEqual(new Date()),
      };
    } else if (filter === ChallengeFilter.Past) {
      conditionObj = {
        end: LessThan(new Date()),
      };
    }
    if (search) {
      conditionObj = { ...conditionObj, team: { id: In([...searchArray]) } };
    }

    let checkInCondition = {};
    checkInCondition = Object.assign(checkInCondition, conditionObj);
    if (userId) {
      checkInCondition = {
        ...checkInCondition,
        playCheckIn: { userId: side === 'owner' ? userId : Not(userId) },
      };
    }
    const [checkInRes, checkInCount] =
      await this.checkInRepository.findAndCount({
        relations: {
          playCheckIn: true,
          team: true,
          match: true,
        },
        where: checkInCondition,
        order: {
          start: 'DESC',
        },
      });

    let multiCheckInCondition = {};
    multiCheckInCondition = Object.assign(multiCheckInCondition, conditionObj);
    if (userId) {
      multiCheckInCondition = {
        ...multiCheckInCondition,
        playMultiCheckIn: { userId: side === 'owner' ? userId : Not(userId) },
      };
    }
    const [multiCheckInRes, multiCheckInCount] =
      await this.multiCheckInRepository.findAndCount({
        relations: {
          playMultiCheckIn: true,
          team: true,
          match: true,
        },
        where: multiCheckInCondition,
        order: {
          start: 'DESC',
        },
      });

    let surveyCondition = {};
    surveyCondition = Object.assign(surveyCondition, conditionObj);
    if (userId) {
      surveyCondition = {
        ...surveyCondition,
        playSurvey: { userId: side === 'owner' ? userId : Not(userId) },
      };
    }
    const [surveyRes, surveyCount] = await this.surveyRepository.findAndCount({
      relations: {
        playSurvey: true,
        team: true,
        match: true,
      },
      where: surveyCondition,
      order: {
        start: 'DESC',
      },
    });

    let multiReferrerCondition = {};
    multiReferrerCondition = Object.assign(
      multiReferrerCondition,
      conditionObj,
    );
    if (userId) {
      multiReferrerCondition = {
        ...multiReferrerCondition,
        playMultiReferrer: { userId: side === 'owner' ? userId : Not(userId) },
      };
    }
    const [multiReferrerRes, multiReferrerCount] =
      await this.multiReferrerRepository.findAndCount({
        relations: {
          playMultiReferrer: true,
          team: true,
        },
        where: multiReferrerCondition,
        order: {
          start: 'DESC',
        },
      });

    return {
      checkIn: {
        data: checkInRes || [],
        count: checkInCount || 0,
      },
      multiCheckIn: {
        data: multiCheckInRes || [],
        count: multiCheckInCount || 0,
      },
      survey: {
        data: surveyRes || [],
        count: surveyCount || 0,
      },
      multiReferrer: {
        data: multiReferrerRes || [],
        count: multiReferrerCount || 0,
      },
    };
  }

  async getMyChallenges(
    skip: number,
    take: number,
    filter: ChallengeFilter,
    search: string,
    userId: string,
    isDraft: string,
  ): Promise<PaginatorDto<ChallengeItemDto>> {
    let conditionStr = '1 = 1';
    if (filter === ChallengeFilter.Upcoming) {
      conditionStr = '"challenge"."start" > now()';
    } else if (filter === ChallengeFilter.Ongoing) {
      conditionStr =
        '"challenge"."start" < now() and "challenge"."end" > now()';
    } else if (filter === ChallengeFilter.Past) {
      conditionStr = '"challenge"."end" < now()';
    }
    if (search) {
      conditionStr += ` and "challenge"."team_id" in ('${search
        .split(',')
        .join("','")}')`;
    }
    if (isDraft === 'true') {
      conditionStr += ' and "challenge"."is_draft" = true';
    } else if (isDraft === 'false') {
      conditionStr += ' and "challenge"."is_draft" = false';
    }
    if (userId) {
      conditionStr += ` and "playChallenge"."user_id" = '${userId}'`;
    }
    const checkInDB = this.dataSource
      .getRepository(CheckInEntity)
      .createQueryBuilder('challenge')
      .leftJoinAndSelect('challenge.team', 'team')
      .leftJoinAndSelect('challenge.match', 'match')
      .leftJoinAndSelect('challenge.playCheckIn', 'playChallenge')
      .leftJoinAndSelect('match.homeTeam', 'homeTeam')
      .leftJoinAndSelect('match.awayTeam', 'awayTeam')
      .select(['"challenge"."id"'])
      .addSelect("'" + ChallengeType.CheckIn + "'", 'type')
      .addSelect(['"challenge"."title"'])
      .addSelect(['"challenge"."description"'])
      .addSelect(['"challenge"."start"'])
      .addSelect(['"challenge"."end"'])
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
      .addSelect(['"challenge"."kudos_reward" as kudos_reward_amount'])
      .addSelect(['"challenge"."token_reward" as token_reward_amount'])
      .addSelect(['"challenge"."out_kudos_reward" as out_kudos_reward_amount'])
      .addSelect(['"challenge"."out_token_reward" as out_token_reward_amount'])
      .where(conditionStr);

    const multiCheckInDB = this.dataSource
      .getRepository(MultiCheckInEntity)
      .createQueryBuilder('challenge')
      .leftJoinAndSelect('challenge.team', 'team')
      .leftJoinAndSelect('challenge.match', 'match')
      .leftJoinAndSelect('challenge.playMultiCheckIn', 'playChallenge')
      .leftJoinAndSelect('match.homeTeam', 'homeTeam')
      .leftJoinAndSelect('match.awayTeam', 'awayTeam')
      .select(['"challenge"."id"'])
      .addSelect("'" + ChallengeType.MultiCheckIn + "'", 'type')
      .addSelect(['"challenge"."title"'])
      .addSelect(['"challenge"."description"'])
      .addSelect(['"challenge"."start"'])
      .addSelect(['"challenge"."end"'])
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
      .addSelect(['"challenge"."kudos_reward" as kudos_reward_amount'])
      .addSelect(['"challenge"."token_reward" as token_reward_amount'])
      .addSelect(['"challenge"."out_kudos_reward" as out_kudos_reward_amount'])
      .addSelect(['"challenge"."out_token_reward" as out_token_reward_amount'])
      .where(conditionStr);

    const surveyDB = this.dataSource
      .getRepository(SurveyEntity)
      .createQueryBuilder('challenge')
      .leftJoinAndSelect('challenge.team', 'team')
      .leftJoinAndSelect('challenge.match', 'match')
      .leftJoinAndSelect('challenge.playSurvey', 'playChallenge')
      .leftJoinAndSelect('match.homeTeam', 'homeTeam')
      .leftJoinAndSelect('match.awayTeam', 'awayTeam')
      .select(['"challenge"."id"'])
      .addSelect("'" + ChallengeType.Survey + "'", 'type')
      .addSelect(['"challenge"."title"'])
      .addSelect(['"challenge"."description"'])
      .addSelect(['"challenge"."start"'])
      .addSelect(['"challenge"."end"'])
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
      .addSelect(['"challenge"."kudos_reward" as kudos_reward_amount'])
      .addSelect(['"challenge"."token_reward" as token_reward_amount'])
      .addSelect("0", 'out_kudos_reward_amount')
      .addSelect("0", 'out_token_reward_amount')
      .where(conditionStr);

    const multiReferrerDB = this.dataSource
      .getRepository(MultiReferrerEntity)
      .createQueryBuilder('challenge')
      .leftJoinAndSelect('challenge.team', 'team')
      .leftJoinAndSelect('challenge.playMultiReferrer', 'playChallenge')
      .select(['"challenge"."id"'])
      .addSelect("'" + ChallengeType.MultiReferrer + "'", 'type')
      .addSelect(['"challenge"."title"'])
      .addSelect(['"challenge"."description"'])
      .addSelect(['"challenge"."start"'])
      .addSelect(['"challenge"."end"'])
      .addSelect(['"team"."name" as team_name'])
      .addSelect(['"team"."description" as team_description'])
      .addSelect(['"team"."logo" as team_logo'])
      .addSelect(["'' match_title"])
      .addSelect(["'' match_type"])
      .addSelect(["'' match_home_team_name"])
      .addSelect(["'' match_home_team_description"])
      .addSelect(["'' match_home_team_logo"])
      .addSelect(["'' match_away_team_name"])
      .addSelect(["'' match_away_team_description"])
      .addSelect(["'' match_away_team_logo"])
      .addSelect(['"challenge"."kudos_reward" as kudos_reward_amount'])
      .addSelect(['"challenge"."token_reward" as token_reward_amount'])
      .addSelect("0", 'out_kudos_reward_amount')
      .addSelect("0", 'out_token_reward_amount')
      .where(conditionStr);

    const [sql1, params1] = checkInDB.getQueryAndParameters();
    const [sql2, params2] = multiCheckInDB.getQueryAndParameters();
    const [sql3, params3] = surveyDB.getQueryAndParameters();
    const [sql4, params4] = multiReferrerDB.getQueryAndParameters();

    const data = await this.dataSource.query(
      `select * from ((${sql1}) UNION (${sql2}) UNION (${sql3}) UNION (${sql4})) as a order by 
      CASE 
        WHEN "start" <= now() and "end" > now()  THEN 1
        WHEN  "start" > now() THEN 2
      ELSE 3
      END,
      a.start asc limit ${take} offset ${skip}`,
    );

    const count = await this.dataSource.query(
      `select count(*) as count from ((${sql1}) UNION (${sql2}) UNION (${sql3}) UNION (${sql4})) as a`,
    );
    return {
      data: data || [],
      count: count[0].count || 0,
    };
  }

  async getChallenges(
    skip: number,
    take: number,
    filter: ChallengeFilter,
    search: string,
    isDraft: string,
    sort: SortFilter,
    direction: DirectionFilter,
    ownerId: string,
  ): Promise<PaginatorDto<ChallengeItemDto>> {
    let conditionStr = '1 = 1';
    if (filter === ChallengeFilter.Upcoming) {
      conditionStr = '"challenge"."start" > now()';
    } else if (filter === ChallengeFilter.Ongoing) {
      conditionStr =
        '"challenge"."start" < now() and "challenge"."end" > now()';
    } else if (filter === ChallengeFilter.Past) {
      conditionStr = '"challenge"."end" < now()';
    }
    if (search) {
      conditionStr += ` and "challenge"."team_id" in ('${search
        .split(',')
        .join("','")}')`;
    }
    if (isDraft === 'true') {
      conditionStr += ' and "challenge"."is_draft" = true';
    } else if (isDraft === 'false') {
      conditionStr += ' and "challenge"."is_draft" = false';
    }
    const checkInDB = this.dataSource
      .getRepository(CheckInEntity)
      .createQueryBuilder('challenge')
      .leftJoinAndSelect('challenge.team', 'team')
      .leftJoinAndSelect('challenge.match', 'match')
      .leftJoinAndSelect('match.homeTeam', 'homeTeam')
      .leftJoinAndSelect('match.awayTeam', 'awayTeam')
      .select(['"challenge"."id"'])
      .addSelect("'" + ChallengeType.CheckIn + "'", 'type')
      .addSelect(
        `(select (case when count(*) > 0 then true else false end) as isPlayed from play_check_in where "play_check_in"."checkin_id" = "challenge"."id" and "play_check_in"."user_id" = '${ownerId}')`,
        'isPlayed',
      )
      .addSelect(['"challenge"."title"'])
      .addSelect(['"challenge"."description"'])
      .addSelect(['"challenge"."start"'])
      .addSelect(['"challenge"."end"'])
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
      .addSelect(['"challenge"."kudos_reward" as kudos_reward_amount'])
      .addSelect(['"challenge"."token_reward" as token_reward_amount'])
      .addSelect(['"challenge"."out_kudos_reward" as out_kudos_reward_amount'])
      .addSelect(['"challenge"."out_token_reward" as out_token_reward_amount'])
      .where(conditionStr);

    const multiCheckInDB = this.dataSource
      .getRepository(MultiCheckInEntity)
      .createQueryBuilder('challenge')
      .leftJoinAndSelect('challenge.team', 'team')
      .leftJoinAndSelect('challenge.match', 'match')
      .leftJoinAndSelect('match.homeTeam', 'homeTeam')
      .leftJoinAndSelect('match.awayTeam', 'awayTeam')
      .select(['"challenge"."id"'])
      .addSelect("'" + ChallengeType.MultiCheckIn + "'", 'type')
      .addSelect(
        `(select (case when count(*) > 0 then true else false end) as isPlayed from play_multi_check_in where "play_multi_check_in"."multi_checkin_id" = "challenge"."id" and "play_multi_check_in"."user_id" = '${ownerId}')`,
        'isPlayed',
      )
      .addSelect(['"challenge"."title"'])
      .addSelect(['"challenge"."description"'])
      .addSelect(['"challenge"."start"'])
      .addSelect(['"challenge"."end"'])
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
      .addSelect(['"challenge"."kudos_reward" as kudos_reward_amount'])
      .addSelect(['"challenge"."token_reward" as token_reward_amount'])
      .addSelect(['"challenge"."out_kudos_reward" as out_kudos_reward_amount'])
      .addSelect(['"challenge"."out_token_reward" as out_token_reward_amount'])
      .where(conditionStr);

    const surveyDB = this.dataSource
      .getRepository(SurveyEntity)
      .createQueryBuilder('challenge')
      .leftJoinAndSelect('challenge.team', 'team')
      .leftJoinAndSelect('challenge.match', 'match')
      .leftJoinAndSelect('match.homeTeam', 'homeTeam')
      .leftJoinAndSelect('match.awayTeam', 'awayTeam')
      .select(['"challenge"."id"'])
      .addSelect("'" + ChallengeType.Survey + "'", 'type')
      .addSelect(
        `(select (case when count(*) > 0 then true else false end) as isPlayed from play_survey where "play_survey"."survey_id" = "challenge"."id" and "play_survey"."user_id" = '${ownerId}')`,
        'isPlayed',
      )
      .addSelect(['"challenge"."title"'])
      .addSelect(['"challenge"."description"'])
      .addSelect(['"challenge"."start"'])
      .addSelect(['"challenge"."end"'])
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
      .addSelect(['"challenge"."kudos_reward" as kudos_reward_amount'])
      .addSelect(['"challenge"."token_reward" as token_reward_amount'])
      .addSelect("0", 'out_kudos_reward_amount')
      .addSelect("0", 'out_token_reward_amount')
      .where(conditionStr);

    const multiReferrerDB = this.dataSource
      .getRepository(MultiReferrerEntity)
      .createQueryBuilder('challenge')
      .leftJoinAndSelect('challenge.team', 'team')
      .select(['"challenge"."id"'])
      .addSelect("'" + ChallengeType.MultiReferrer + "'", 'type')
      .addSelect(
        `(select (case when count(*) > 0 then true else false end) as isPlayed from play_multi_referrer where "play_multi_referrer"."multi_referrer_id" = "challenge"."id" and "play_multi_referrer"."user_id" = '${ownerId}')`,
        'isPlayed',
      )
      .addSelect(['"challenge"."title"'])
      .addSelect(['"challenge"."description"'])
      .addSelect(['"challenge"."start"'])
      .addSelect(['"challenge"."end"'])
      .addSelect(['"team"."name" as team_name'])
      .addSelect(['"team"."description" as team_description'])
      .addSelect(['"team"."logo" as team_logo'])
      .addSelect(["'' match_title"])
      .addSelect(["'' match_type"])
      .addSelect(["'' match_home_team_name"])
      .addSelect(["'' match_home_team_description"])
      .addSelect(["'' match_home_team_logo"])
      .addSelect(["'' match_away_team_name"])
      .addSelect(["'' match_away_team_description"])
      .addSelect(["'' match_away_team_logo"])
      .addSelect(['"challenge"."kudos_reward" as kudos_reward_amount'])
      .addSelect(['"challenge"."token_reward" as token_reward_amount'])
      .addSelect("0", 'out_kudos_reward_amount')
      .addSelect("0", 'out_token_reward_amount')
      .where(conditionStr);

    const [sql1, params1] = checkInDB.getQueryAndParameters();
    const [sql2, params2] = multiCheckInDB.getQueryAndParameters();
    const [sql3, params3] = surveyDB.getQueryAndParameters();
    const [sql4, params4] = multiReferrerDB.getQueryAndParameters();

    let order = '';
    if (sort === SortFilter.Start) {
      order = `CASE  WHEN "start" <= now() and "end" > now()  THEN now() - "start"
        WHEN  "start" > now() THEN "start" - now()
        ELSE now() - "start" END ASC
      `;
    } else {
      order = `${
        sort === SortFilter.Team ? 'a.team_name' : `a.${sort}`
      } ${direction}`;
    }

    const data = await this.dataSource.query(
      `select * from ((${sql1}) UNION (${sql2}) UNION (${sql3}) UNION (${sql4})) as a order by 
      CASE 
        WHEN "start" <= now() and "end" > now()  THEN 1
        WHEN  "start" > now() THEN 2
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

  async getChallengesByMatchId(
    matchId: string,
  ): Promise<PaginatorDto<ChallengeItemDto>> {
    const checkInDB = this.dataSource
      .getRepository(CheckInEntity)
      .createQueryBuilder('challenge')
      .leftJoinAndSelect('challenge.team', 'team')
      .leftJoinAndSelect('challenge.match', 'match')
      .leftJoinAndSelect('match.homeTeam', 'homeTeam')
      .leftJoinAndSelect('match.awayTeam', 'awayTeam')
      .select(['"challenge"."id"'])
      .addSelect("'" + ChallengeType.CheckIn + "'", 'type')
      .addSelect(['"challenge"."title"'])
      .addSelect(['"challenge"."description"'])
      .addSelect(['"challenge"."start"'])
      .addSelect(['"challenge"."end"'])
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
      .addSelect(['"challenge"."kudos_reward" as kudos_reward_amount'])
      .addSelect(['"challenge"."token_reward" as token_reward_amount'])
      .addSelect(['"challenge"."out_kudos_reward" as out_kudos_reward_amount'])
      .addSelect(['"challenge"."out_token_reward" as out_token_reward_amount'])
      .where('"challenge"."match_id"=:id', { id: matchId });

    const multiCheckInDB = this.dataSource
      .getRepository(MultiCheckInEntity)
      .createQueryBuilder('challenge')
      .leftJoinAndSelect('challenge.team', 'team')
      .leftJoinAndSelect('challenge.match', 'match')
      .leftJoinAndSelect('match.homeTeam', 'homeTeam')
      .leftJoinAndSelect('match.awayTeam', 'awayTeam')
      .select(['"challenge"."id"'])
      .addSelect("'" + ChallengeType.MultiCheckIn + "'", 'type')
      .addSelect(['"challenge"."title"'])
      .addSelect(['"challenge"."description"'])
      .addSelect(['"challenge"."start"'])
      .addSelect(['"challenge"."end"'])
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
      .addSelect(['"challenge"."kudos_reward" as kudos_reward_amount'])
      .addSelect(['"challenge"."token_reward" as token_reward_amount'])
      .addSelect(['"challenge"."out_kudos_reward" as out_kudos_reward_amount'])
      .addSelect(['"challenge"."out_token_reward" as out_token_reward_amount'])
      .where('"challenge"."match_id"=:id', { id: matchId });

    const surveyDB = this.dataSource
      .getRepository(SurveyEntity)
      .createQueryBuilder('challenge')
      .leftJoinAndSelect('challenge.team', 'team')
      .leftJoinAndSelect('challenge.match', 'match')
      .leftJoinAndSelect('match.homeTeam', 'homeTeam')
      .leftJoinAndSelect('match.awayTeam', 'awayTeam')
      .select(['"challenge"."id"'])
      .addSelect("'" + ChallengeType.Survey + "'", 'type')
      .addSelect(['"challenge"."title"'])
      .addSelect(['"challenge"."description"'])
      .addSelect(['"challenge"."start"'])
      .addSelect(['"challenge"."end"'])
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
      .addSelect(['"challenge"."kudos_reward" as kudos_reward_amount'])
      .addSelect(['"challenge"."token_reward" as token_reward_amount'])
      .addSelect("0", 'out_kudos_reward_amount')
      .addSelect("0", 'out_token_reward_amount')
      .where('"challenge"."match_id"=:id', { id: matchId });

    const [sql1, params1] = checkInDB.getQueryAndParameters();
    const [sql2, params2] = multiCheckInDB.getQueryAndParameters();
    const [sql3, params3] = surveyDB.getQueryAndParameters();

    const data = await this.dataSource.query(
      `select * from ((${sql1}) UNION (${sql2}) UNION (${sql3})) as a order by a.start desc`,
      [matchId],
    );

    const count = await this.dataSource.query(
      `select count(*) as count from ((${sql1}) UNION (${sql2}) UNION (${sql3})) as a`,
      [matchId],
    );
    return {
      data: data || [],
      count: count[0].count || 0,
    };
  }
}
