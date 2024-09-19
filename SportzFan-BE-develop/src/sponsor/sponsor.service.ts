import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';

import {
  SponsorDetailResponseDto,
  SponsorRegisterDto,
  SponsorStatisticResponseDto,
  SponsorUpdateDto
} from './dtos/sponsor.dto';
import { PollEntity } from '../poll/entities/poll.entity';
import { SponsorEntity } from './entities/sponsor.entity';
import { TeamEntity } from 'src/team/entities/team.entity';
import { PaginatorDto } from '../common/dtos/paginator.dto';
import { AssetEntity } from '../asset/entities/asset.entity';
import { getFromDto } from 'src/common/utils/repository.util';
import { TriviaEntity } from '../trivia/entities/trivia.entity';
import { SurveyEntity } from '../survey/entities/survey.entity';
import { CheckInEntity } from '../check-in/entities/check-in.entity';
import { SuccessResponse } from 'src/common/models/success-response';
import { MilestoneEntity } from '../milestone/entities/milestone.entity';
import { PredictionEntity } from '../prediction/entities/prediction.entity';
import { MultiReferrerEntity } from '../multi-referrer/entities/multi-referrer.entity';
import { MultiCheckInEntity } from '../multi-check-in/entities/multi-check-in.entity';
import { ChallengeType, GameType, MaterialType, SponsorFilter } from '../common/models/base';

@Injectable()
export class SponsorService {
  constructor(
    @InjectRepository(SponsorEntity)
    private sponsorRepository: Repository<SponsorEntity>,
    @InjectRepository(TeamEntity)
    private teamRepository: Repository<TeamEntity>,
    @InjectRepository(PredictionEntity)
    private predictionRepository: Repository<PredictionEntity>,
    @InjectRepository(TriviaEntity)
    private triviaRepository: Repository<TriviaEntity>,
    @InjectRepository(MilestoneEntity)
    private milestoneRepository: Repository<MilestoneEntity>,
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

  // Create one sponsor
  async createSponsor(dto: SponsorRegisterDto): Promise<SponsorEntity> {
    const team = await this.teamRepository.findOneBy({ id: dto.teamId });
    if (!team) {
      throw new BadRequestException('Could not find the team.');
    }
    const sponsor = getFromDto<SponsorEntity>(dto, new SponsorEntity());
    return this.sponsorRepository.save(sponsor);
  }

  //Get all Sponsor list
  async getAllSponsor(
    skip: number,
    take: number,
    search: string,
  ): Promise<[SponsorEntity[], number]> {
    const searchArray =
      search === ''
        ? []
        : search.split(',').map((item) => item.replace(/\s/g, ''));
    return this.sponsorRepository.findAndCount({
      relations: ['team'],
      where:
        search === ''
          ? {}
          : {
              team: {
                id: In([...searchArray]),
              },
            },
      skip,
      take,
    });
  }

  //Get Sponsor Detailed list
  async getSponsorDetailList(
    sponsorId: string,
    skip: number,
    take: number,
    filter: SponsorFilter,
    isDraft: string,
  ): Promise<PaginatorDto<SponsorDetailResponseDto>> {
    let conditionStr = '1 = 1';
    if (filter === SponsorFilter.Upcoming) {
      conditionStr = '"start" > now()';
    } else if (filter === SponsorFilter.Ongoing) {
      conditionStr = '"start" < now() and "end" > now()';
    } else if (filter === SponsorFilter.Past) {
      conditionStr = '"end" < now()';
    }

    let conditionDraftStr = '1 = 1';
    if (isDraft === 'true') {
      conditionDraftStr = '"is_draft" = true';
    } else if (isDraft === 'false') {
      conditionDraftStr = '"is_draft" = false';
    }

    const predictionDB = this.dataSource
      .getRepository(PredictionEntity)
      .createQueryBuilder('prediction')
      .select(['"prediction"."title"'])
      .addSelect(['"prediction"."description"'])
      .addSelect('\''+ GameType.Prediction +'\'', 'type')
      .addSelect(['"prediction"."id"'])
      .addSelect(['"prediction"."sponsor_id" as "sponsorId"'])
      .addSelect(['"prediction"."description"'])
      .addSelect(['"prediction"."start"'])
      .addSelect(['"prediction"."end"'])
      .where('prediction.sponsor_id=:id', { id: sponsorId })
      .andWhere(conditionStr)
      .andWhere(conditionDraftStr);

    const triviaDB = this.dataSource
      .getRepository(TriviaEntity)
      .createQueryBuilder('trivia')
      .select(['"trivia"."title"'])
      .addSelect(['"trivia"."description"'])
      .addSelect('\''+ GameType.Trivia +'\'', 'type')
      .addSelect(['"trivia"."id"'])
      .addSelect(['"trivia"."sponsor_id" as "sponsorId"'])
      .addSelect(['"trivia"."description"'])
      .addSelect(['"trivia"."start"'])
      .addSelect(['"trivia"."end"'])
      .where('trivia.sponsor_id=:id', { id: sponsorId })
      .andWhere(conditionStr)
      .andWhere(conditionDraftStr);

    const milestoneDB = this.dataSource
      .getRepository(MilestoneEntity)
      .createQueryBuilder('milestone')
      .select(['"milestone"."title"'])
      .addSelect(['"milestone"."description"'])
      .addSelect('\''+ GameType.Milestone +'\'', 'type')
      .addSelect(['"milestone"."id"'])
      .addSelect(['"milestone"."sponsor_id" as "sponsorId"'])
      .addSelect(['"milestone"."description"'])
      .addSelect(['"milestone"."start"'])
      .addSelect(['"milestone"."end"'])
      .where('milestone.sponsor_id=:id', { id: sponsorId })
      .andWhere('"milestone"."is_draft"=false')
      .andWhere(conditionStr)
      .andWhere(conditionDraftStr);

    const checkInDB = this.dataSource
      .getRepository(CheckInEntity)
      .createQueryBuilder('checkIn')
      .select(['"checkIn"."title"'])
      .addSelect(['"checkIn"."description"'])
      .addSelect('\''+ ChallengeType.CheckIn +'\'', 'type')
      .addSelect(['"checkIn"."id"'])
      .addSelect(['"checkIn"."sponsor_id" as "sponsorId"'])
      .addSelect(['"checkIn"."description"'])
      .addSelect(['"checkIn"."start"'])
      .addSelect(['"checkIn"."end"'])
      .where('checkIn.sponsor_id=:id', { id: sponsorId })
      .andWhere(conditionStr);

    const multiCheckInDB = this.dataSource
      .getRepository(MultiCheckInEntity)
      .createQueryBuilder('multiCheckIn')
      .select(['"multiCheckIn"."title"'])
      .addSelect(['"multiCheckIn"."description"'])
      .addSelect('\''+ ChallengeType.MultiCheckIn +'\'', 'type')
      .addSelect(['"multiCheckIn"."id"'])
      .addSelect(['"multiCheckIn"."sponsor_id" as "sponsorId"'])
      .addSelect(['"multiCheckIn"."description"'])
      .addSelect(['"multiCheckIn"."start"'])
      .addSelect(['"multiCheckIn"."end"'])
      .where('multiCheckIn.sponsor_id=:id', { id: sponsorId })
      .andWhere(conditionStr);

    const surveyDB = this.dataSource
      .getRepository(SurveyEntity)
      .createQueryBuilder('survey')
      .select(['"survey"."title"'])
      .addSelect(['"survey"."description"'])
      .addSelect('\''+ ChallengeType.Survey +'\'', 'type')
      .addSelect(['"survey"."id"'])
      .addSelect(['"survey"."sponsor_id" as "sponsorId"'])
      .addSelect(['"survey"."description"'])
      .addSelect(['"survey"."start"'])
      .addSelect(['"survey"."end"'])
      .where('survey.sponsor_id=:id', { id: sponsorId })
      .andWhere(conditionStr);

    const multiReferrerDB = this.dataSource
      .getRepository(MultiReferrerEntity)
      .createQueryBuilder('multiReferrer')
      .select(['"multiReferrer"."title"'])
      .addSelect(['"multiReferrer"."description"'])
      .addSelect('\''+ ChallengeType.MultiCheckIn +'\'', 'type')
      .addSelect(['"multiReferrer"."id"'])
      .addSelect(['"multiReferrer"."sponsor_id" as "sponsorId"'])
      .addSelect(['"multiReferrer"."description"'])
      .addSelect(['"multiReferrer"."start"'])
      .addSelect(['"multiReferrer"."end"'])
      .where('multiReferrer.sponsor_id=:id', { id: sponsorId })
      .andWhere(conditionStr);

    const pollDB = this.dataSource
      .getRepository(PollEntity)
      .createQueryBuilder('poll')
      .select(['"poll"."title"'])
      .addSelect(['"poll"."description"'])
      .addSelect('\''+ MaterialType.Poll +'\'', 'type')
      .addSelect(['"poll"."id"'])
      .addSelect(['"poll"."sponsor_id" as "sponsorId"'])
      .addSelect(['"poll"."description"'])
      .addSelect(['"poll"."start"'])
      .addSelect(['"poll"."end"'])
      .where('poll.sponsor_id=:id', { id: sponsorId })
      .andWhere(conditionStr);

    const assetDB = this.dataSource
      .getRepository(AssetEntity)
      .createQueryBuilder('asset')
      .select(['"asset"."title"'])
      .addSelect(['"asset"."description"'])
      .addSelect('\''+ MaterialType.Asset +'\'', 'type')
      .addSelect(['"asset"."id"'])
      .addSelect(['"asset"."sponsor_id" as "sponsorId"'])
      .addSelect(['"asset"."description"'])
      .addSelect(['"asset"."start"'])
      .addSelect(['"asset"."end"'])
      .where('asset.sponsor_id=:id', { id: sponsorId })
      .andWhere(conditionStr);

    const [sql1, params1] = predictionDB.getQueryAndParameters();
    const [sql2, params2] = triviaDB.getQueryAndParameters();
    const [sql3, params3] = milestoneDB.getQueryAndParameters();
    const [sql4, params4] = checkInDB.getQueryAndParameters();
    const [sql5, params5] = multiCheckInDB.getQueryAndParameters();
    const [sql6, params6] = surveyDB.getQueryAndParameters();
    const [sql7, params7] = multiReferrerDB.getQueryAndParameters();
    const [sql8, params8] = pollDB.getQueryAndParameters();
    const [sql9, params9] = assetDB.getQueryAndParameters();

    const data = await this.dataSource.query(
      `select * from ((${sql1}) UNION (${sql2}) UNION (${sql3}) UNION (${sql4}) UNION (${sql5}) UNION (${sql6}) UNION (${sql7}) UNION (${sql8}) UNION (${sql9})) as a order by a.start desc limit ${take} offset ${skip}`,
      [sponsorId]
    );

    const count = await this.dataSource.query(
      `select count(*) as count from ((${sql1}) UNION (${sql2}) UNION (${sql3}) UNION (${sql4}) UNION (${sql5}) UNION (${sql6}) UNION (${sql7}) UNION (${sql8}) UNION (${sql9})) as a`,
      [sponsorId]
    );
    return {
      data: data || [],
      count: count[0].count || 0
    }
  }

  //Get Sponsor Detailed list
  async getSponsorStatisticList(
    sponsorId: string,
    filter: SponsorFilter,
    isDraft: string,
  ): Promise<PaginatorDto<SponsorStatisticResponseDto>> {
    let conditionStr = '1 = 1';
    if (filter === SponsorFilter.Upcoming) {
      conditionStr = '"start" > now()';
    } else if (filter === SponsorFilter.Ongoing) {
      conditionStr = '"start" < now() and "end" > now()';
    } else if (filter === SponsorFilter.Past) {
      conditionStr = '"end" < now()';
    }

    if (sponsorId) {
      conditionStr += ` and "sponsor_id"='${sponsorId}'`;
    }

    let conditionDraftStr = '1 = 1';
    if (isDraft === 'true') {
      conditionDraftStr = '"is_draft" = true';
    } else if (isDraft === 'false') {
      conditionDraftStr = '"is_draft" = false';
    }

    const predictionDB = this.dataSource
      .getRepository(PredictionEntity)
      .createQueryBuilder('prediction')
      .select('count(*)', 'count')
      .addSelect('\''+ GameType.Prediction +'\'', 'type')
      .where(conditionStr)
      .andWhere(conditionDraftStr);

    const triviaDB = this.dataSource
      .getRepository(TriviaEntity)
      .createQueryBuilder('trivia')
      .select('count(*)', 'count')
      .addSelect('\''+ GameType.Trivia +'\'', 'type')
      .where(conditionStr)
      .andWhere(conditionDraftStr);

    const milestoneDB = this.dataSource
      .getRepository(MilestoneEntity)
      .createQueryBuilder('milestone')
      .select('count(*)', 'count')
      .addSelect('\''+ GameType.Milestone +'\'', 'type')
      .where(conditionStr)
      .andWhere(conditionDraftStr);

    const checkInDB = this.dataSource
      .getRepository(CheckInEntity)
      .createQueryBuilder('checkIn')
      .select('count(*)', 'count')
      .addSelect('\''+ ChallengeType.CheckIn +'\'', 'type')
      .where(conditionStr);

    const multiCheckInDB = this.dataSource
      .getRepository(MultiCheckInEntity)
      .createQueryBuilder('multiCheckIn')
      .select('count(*)', 'count')
      .addSelect('\''+ ChallengeType.MultiCheckIn +'\'', 'type')
      .where(conditionStr);

    const surveyDB = this.dataSource
      .getRepository(SurveyEntity)
      .createQueryBuilder('survey')
      .select('count(*)', 'count')
      .addSelect('\''+ ChallengeType.Survey +'\'', 'type')
      .where(conditionStr);

    const multiReferrerDB = this.dataSource
      .getRepository(MultiReferrerEntity)
      .createQueryBuilder('multiReferrer')
      .select('count(*)', 'count')
      .addSelect('\''+ ChallengeType.MultiReferrer +'\'', 'type')
      .where(conditionStr);

    const pollDB = this.dataSource
      .getRepository(PollEntity)
      .createQueryBuilder('poll')
      .select('count(*)', 'count')
      .addSelect('\''+ MaterialType.Poll +'\'', 'type')
      .where(conditionStr);

    const assetDB = this.dataSource
      .getRepository(AssetEntity)
      .createQueryBuilder('asset')
      .select('count(*)', 'count')
      .addSelect('\''+ MaterialType.Asset +'\'', 'type')
      .where(conditionStr);

    const [sql1, params1] = predictionDB.getQueryAndParameters();
    const [sql2, params2] = triviaDB.getQueryAndParameters();
    const [sql3, params3] = milestoneDB.getQueryAndParameters();
    const [sql4, params4] = checkInDB.getQueryAndParameters();
    const [sql5, params5] = multiCheckInDB.getQueryAndParameters();
    const [sql6, params6] = surveyDB.getQueryAndParameters();
    const [sql7, params7] = multiReferrerDB.getQueryAndParameters();
    const [sql8, params8] = pollDB.getQueryAndParameters();
    const [sql9, params9] = assetDB.getQueryAndParameters();

    const data = await this.dataSource.query(
      `select * from ((${sql1}) UNION (${sql2}) UNION (${sql3}) UNION (${sql4}) UNION (${sql5}) UNION (${sql6}) UNION (${sql7}) UNION (${sql8}) UNION (${sql9})) as a `,
    );

    const count = await this.dataSource.query(
      `select sum(count) as count from ((${sql1}) UNION (${sql2}) UNION (${sql3}) UNION (${sql4}) UNION (${sql5}) UNION (${sql6}) UNION (${sql7}) UNION (${sql8}) UNION (${sql9})) as a`,
    );
    return {
      data: data || [],
      count: count[0].count || 0
    }
  }

  // Get one Sponsor by id
  async getOneSponsor(id: string): Promise<SponsorEntity> {
    const sponsor = await this.sponsorRepository.findOne({
      relations: ['team'],
      where: { id },
    });

    if (!sponsor) {
      throw new BadRequestException('Could not find the sponsor item.');
    }
    return sponsor;
  }

  // Update Sponsor by id
  async updateSponsor(
    id: string,
    dto: SponsorUpdateDto,
  ): Promise<SponsorEntity> {
    let sponsor = await this.sponsorRepository.findOne({
      relations: ['team'],
      where: {
        id,
      },
    });
    if (!sponsor) {
      throw new BadRequestException('Could not find the sponsor item.');
    }
    sponsor = getFromDto(dto, sponsor);
    return this.sponsorRepository.save(sponsor);
  }

  async deleteSponsor(id: string): Promise<SuccessResponse> {
    await this.sponsorRepository.softDelete({ id });
    return new SuccessResponse(true);
  }
}
