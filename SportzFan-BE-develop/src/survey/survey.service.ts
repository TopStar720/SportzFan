import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { getFromDto } from '../common/utils/repository.util';
import { PlaySurveyEntity } from './entities/play-survey.entity';
import { PlaySurveyRegisterDto } from './dtos/play-survey.dto';
import { SurveyRegisterDto, SurveyUpdateDto } from './dtos/survey.dto';
import { SuccessResponse } from '../common/models/success-response';
import { SurveyQuestionEntity } from './entities/survey-question.entity';
import { PlaySurveyAnswerEntity } from './entities/play-survey-answer.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { TeamEntity } from 'src/team/entities/team.entity';
import { SponsorEntity } from 'src/sponsor/entities/sponsor.entity';
import { SurveyEntity } from './entities/survey.entity';

import { AssetService } from '../asset/asset.service';
import { AssetEntity } from '../asset/entities/asset.entity';

@Injectable()
export class SurveyService {
  constructor(
    @InjectRepository(SurveyEntity)
    private surveyRepository: Repository<SurveyEntity>,
    @InjectRepository(PlaySurveyEntity)
    private playSurveyRepository: Repository<PlaySurveyEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(TeamEntity)
    private teamRepository: Repository<TeamEntity>,
    @InjectRepository(SponsorEntity)
    private sponsorRepository: Repository<SponsorEntity>,
    @InjectRepository(AssetEntity)
    private assetRepository: Repository<AssetEntity>,
    private dataSource: DataSource,
    private assetService: AssetService,
  ) {}

  async createSurvey(dto: SurveyRegisterDto): Promise<SurveyEntity> {
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
    const survey = getFromDto<SurveyEntity>(dto, new SurveyEntity());
    if (dto.assetId) survey.asset = asset;
    return this.surveyRepository.save(survey);
  }

  async getAllSurvey(
    skip: number,
    take: number,
  ): Promise<[SurveyEntity[], number]> {
    return this.surveyRepository.findAndCount({
      relations: {
        team: true,
        match: true,
        asset: true,
        sponsor: true,
        playSurvey: true,
        surveyQuestions: {
          options: true,
        },
      },
      skip,
      take,
    });
  }

  async getOneSurvey(id: string): Promise<SurveyEntity> {
    return this.surveyRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        team: true,
        match: true,
        asset: true,
        sponsor: true,
        surveyQuestions: {
          options: true,
        },
      },
    });
  }

  async updateSurvey(id: string, dto: SurveyUpdateDto): Promise<SurveyEntity> {
    let survey = await this.surveyRepository.findOneBy({
      id: id,
    });
    if (!survey) {
      throw new BadRequestException(
        'Could not find the survey challenge item.',
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
    survey = getFromDto(dto, survey);
    if (dto.assetId) survey.asset = asset;
    return this.surveyRepository.save(survey);
  }

  // publish by id
  async publish(id: string): Promise<SurveyEntity> {
    const instance = await this.surveyRepository.findOneBy({
      id: id,
    });
    if (!instance) {
      throw new BadRequestException('Could not find item.');
    }
    if (!instance.isDraft) {
      throw new BadRequestException('Could only publish for draft instance');
    }
    instance.isDraft = false;
    return await this.surveyRepository.save(instance);
  }

  async createPlaySurvey(
    dto: PlaySurveyRegisterDto,
    teamId: string,
    userId: string,
  ): Promise<PlaySurveyEntity> {
    const survey = await this.surveyRepository.findOne({
      relations: {
        team: true,
        match: true,
        asset: true,
        sponsor: true,
        playSurvey: true,
        surveyQuestions: {
          options: true,
        },
      },
      where: {
        id: dto.surveyId,
      },
    });
    if (!survey) {
      throw new BadRequestException(
        'Could not find the survey challenge item.',
      );
    }
    if (survey.teamId !== teamId) {
      throw new BadRequestException('You should only play team challenge');
    }
    if (survey.isDraft) {
      throw new BadRequestException('This is draft survey');
    }
    if (new Date(survey.end) < new Date()) {
      throw new BadRequestException('This survey challenge is expired.');
    }
    if (new Date(survey.start) > new Date()) {
      throw new BadRequestException(
        'This survey challenge is not started yet.',
      );
    }

    const playHistory = await this.playSurveyRepository.findOne({
      where: {
        userId,
        surveyId: survey.id,
      },
    });
    if (playHistory) {
      throw new BadRequestException('You already play this survey');
    }

    const user = await this.userRepository.findOneBy({
      id: userId,
    });
    if (!user) {
      throw new BadRequestException('Could not find the user.');
    }

    // Check if user is eligble for this game
    if (
      user.tokenAmount < survey.eligbleToken ||
      user.kudosAmount < survey.eligbleKudos
    ) {
      throw new BadRequestException(
        'You are not eligible because of insufficient balance',
      );
    }

    let playSurvey = getFromDto<PlaySurveyEntity>(dto, new PlaySurveyEntity());
    playSurvey.survey = survey;
    playSurvey.userId = userId;
    playSurvey.user = user;
    playSurvey = await this.playSurveyRepository.save(playSurvey);

    if (
      survey.enableAssetReward &&
      survey.playSurvey.length < survey.winnerLimit
    ) {
      try {
        await this.assetService.sendBonusAsset(
          survey.assetId,
          new Array(1).fill(userId),
          survey.rewardAssetCount,
          survey.title,
        );
      } catch (e: any) {}
    }
    return await this.playSurveyRepository.findOne({
      relations: {
        user: true,
        survey: true,
      },
      where: { id: playSurvey.id },
    });
  }

  async getOneSurveyForUser(id: string, userId: string): Promise<SurveyEntity> {
    return this.surveyRepository.findOne({
      relations: [
        'surveyQuestions',
        'surveyQuestions.options',
        'playSurvey',
        'playSurvey.answer',
        'sponsor',
        'match',
        'asset',
      ],
      where: {
        id: id,
        playSurvey: {
          userId: userId,
        },
      },
    });
  }

  async getSurveyResult(id: string): Promise<any> {
    const survey = await this.surveyRepository.findOne({
      relations: [
        'surveyQuestions',
        'surveyQuestions.options',
        'playSurvey',
        'playSurvey.answer',
        'playSurvey.user',
      ],
      where: {
        id: id,
      },
    });
    const totalPlayers = survey.playSurvey.length;

    const result = await this.dataSource
      .getRepository(SurveyQuestionEntity)
      .createQueryBuilder('surveyQuestion')
      .leftJoin('surveyQuestion.options', 'surveyOptions')
      .addSelect(['surveyOptions.id'])
      .leftJoin(
        PlaySurveyAnswerEntity,
        'playSurveyAnswer',
        '"playSurveyAnswer"."option_id" = "surveyOptions"."id"',
      )
      .addSelect(['"playSurveyAnswer"."option_id"'])
      .addSelect(['count("playSurveyAnswer"."id")'])
      .where('surveyQuestion.surveyId=:id', { id: survey.id })
      .groupBy('surveyOptions.id')
      .addGroupBy('surveyQuestion.id')
      .addGroupBy('"playSurveyAnswer"."option_id"')
      .addOrderBy('"surveyQuestion"."id"')
      .getRawMany();
    return { survey, totalPlayers, result };
  }

  async deleteChallenge(id: string): Promise<SuccessResponse> {
    await this.surveyRepository.softDelete({ id });
    return new SuccessResponse(true);
  }
}
