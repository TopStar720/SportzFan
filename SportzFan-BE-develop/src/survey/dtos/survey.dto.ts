import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { TeamDto } from 'src/team/dtos/team.dto';
import { MatchDto } from '../../match/dtos/match.dto';
import { CommonDto } from 'src/common/dtos/common.dto';
import { SponsorDto } from 'src/sponsor/dtos/sponsor.dto';
import { SurveyQuestionRegisterDto } from './survey-question.dto';
import { SurveyEntity } from '../entities/survey.entity';
import { AssetDto } from '../../asset/dtos/asset.dto';

export class SurveyDto extends CommonDto {
  @ApiProperty({ description: 'the team' })
  team: TeamDto;

  @ApiProperty({ description: 'the match' })
  match: MatchDto;

  @ApiProperty({ description: 'the eligibile Kudos point' })
  eligbleKudos: number;

  @ApiProperty({ description: 'the eligibile Token amount' })
  eligbleToken: number;

  @ApiProperty({
    description: 'the amount of reward Kudos points when user is at venue',
  })
  kudosReward: number;

  @ApiProperty({
    description: 'the amount of reward token when user is at venue',
  })
  tokenReward: number;

  @ApiProperty({
    description: 'the game sponsor',
  })
  sponsor: SponsorDto;

  @ApiProperty({ description: 'the survey start date&time' })
  start: Date;

  @ApiProperty({ description: 'the survey expiration date & time' })
  end: Date;

  @ApiProperty({ description: 'the participants type' })
  participants: number;

  @ApiProperty({ description: 'the survey description' })
  description: string;

  @ApiProperty({ description: 'the survey title' })
  title: string;

  @ApiProperty({
    description: 'the survey questions',
    type: () => SurveyQuestionRegisterDto,
    isArray: true,
  })
  surveyQuestions: SurveyQuestionRegisterDto[];

  @ApiProperty({ description: 'the asset' })
  asset: AssetDto;

  @ApiProperty({ description: 'the flag that enable asset reward logic' })
  enableAssetReward: boolean;

  @ApiProperty({ description: 'the asset count per player' })
  rewardAssetCount: number;

  @ApiProperty({ description: 'the maximum number of winners' })
  winnerLimit: number;

  @ApiProperty({ description: 'optional survey | free text survey' })
  isOptional: boolean;

  @ApiProperty({ description: 'the draft flag' })
  isDraft: boolean;

  static toSurveyDto(survey: SurveyEntity): SurveyDto {
    return {
      id: survey.id,
      createdAt: survey.createdAt,
      updatedAt: survey.updatedAt,
      team: survey.team,
      match: survey.match,
      eligbleKudos: survey.eligbleKudos,
      eligbleToken: survey.eligbleToken,
      kudosReward: survey.kudosReward,
      tokenReward: survey.tokenReward,
      sponsor: survey.sponsor,
      start: survey.start,
      end: survey.end,
      participants: survey.participants,
      description: survey.description,
      title: survey.title,
      surveyQuestions: survey.surveyQuestions,
      asset: survey.asset,
      enableAssetReward: survey.enableAssetReward,
      rewardAssetCount: survey.rewardAssetCount,
      winnerLimit: survey.winnerLimit,
      isOptional: survey.isOptional,
      isDraft: survey.isDraft,
    };
  }
}

export class SurveyRegisterDto {
  @ApiProperty({ description: 'the team id' })
  @IsUUID()
  teamId: string;

  @ApiProperty({ description: 'the eligibile Kudos point' })
  @IsNumber()
  eligbleKudos: number;

  @ApiProperty({ description: 'the eligibile Token amount' })
  @IsNumber()
  eligbleToken: number;

  @ApiProperty({
    description: 'the amount of reward Kudos points when user is at venue',
  })
  @IsNumber()
  kudosReward: number;

  @ApiProperty({
    description: 'the amount of reward token when user is at venue',
  })
  @IsNumber()
  tokenReward: number;

  @ApiProperty({
    description: 'the game sponsor',
  })
  @IsUUID()
  sponsorId: string;

  @ApiProperty({ description: 'the survey start date&time' })
  @IsDateString()
  start: Date;

  @ApiProperty({ description: 'the survey expiration date & time' })
  @IsDateString()
  end: Date;

  @ApiProperty({ description: 'the participants type' })
  @IsNumber()
  participants: number;

  @ApiProperty({ description: 'the event match/event' })
  @IsUUID()
  matchId: string;

  @ApiProperty({ description: 'the survey description' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'the survey title' })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'the survey questions',
    type: () => SurveyQuestionRegisterDto,
    isArray: true,
  })
  surveyQuestions: SurveyQuestionRegisterDto[];

  @ApiProperty({ description: 'the asset' })
  @IsUUID()
  @IsOptional()
  assetId?: string;

  @ApiProperty({ description: 'the flag that enable asset reward logic' })
  @IsBoolean()
  enableAssetReward: boolean;

  @ApiProperty({ description: 'the asset count per player' })
  @IsNumber()
  rewardAssetCount: number;

  @ApiProperty({ description: 'the maximum number of winners' })
  @IsNumber()
  winnerLimit: number;

  @ApiProperty({ description: 'optional survey | free text survey' })
  @IsBoolean()
  isOptional: boolean;

  @ApiProperty({ description: 'the draft flag' })
  @IsBoolean()
  @IsOptional()
  isDraft: boolean;
}

export class SurveyUpdateDto {
  @ApiProperty({ description: 'the team' })
  @IsUUID()
  @IsOptional()
  teamId: string;

  @ApiProperty({ description: 'the eligibile Kudos point' })
  @IsNumber()
  @IsOptional()
  eligbleKudos: number;

  @ApiProperty({ description: 'the eligibile Token amount' })
  @IsNumber()
  @IsOptional()
  eligbleToken: number;

  @ApiProperty({
    description: 'the amount of reward Kudos points when user is at venue',
  })
  @IsNumber()
  @IsOptional()
  kudosReward: number;

  @ApiProperty({
    description: 'the amount of reward token when user is at venue',
  })
  @IsNumber()
  @IsOptional()
  tokenReward: number;

  @ApiProperty({
    description: 'the game sponsor',
  })
  @IsUUID()
  @IsOptional()
  sponsorId: string;

  @ApiProperty({ description: 'the survey start date&time' })
  @IsDateString()
  @IsOptional()
  start: Date;

  @ApiProperty({ description: 'the survey expiration date & time' })
  @IsDateString()
  @IsOptional()
  end: Date;

  @ApiProperty({ description: 'the participants type' })
  @IsNumber()
  @IsOptional()
  participants: number;

  @ApiProperty({ description: 'the survey description' })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({ description: 'the survey title' })
  @IsString()
  @IsOptional()
  title: string;

  @ApiProperty({
    description: 'the survey questions',
    type: () => SurveyQuestionRegisterDto,
    isArray: true,
  })
  surveyQuestions: SurveyQuestionRegisterDto[];

  @ApiProperty({ description: 'the asset' })
  @IsUUID()
  @IsOptional()
  assetId?: string;

  @ApiProperty({ description: 'the flag that enable asset reward logic' })
  @IsBoolean()
  enableAssetReward: boolean;

  @ApiProperty({ description: 'the asset count per player' })
  @IsNumber()
  rewardAssetCount: number;

  @ApiProperty({ description: 'the maximum number of winners' })
  @IsNumber()
  winnerLimit: number;

  @ApiProperty({ description: 'optional survey | free text survey' })
  @IsBoolean()
  isOptional: boolean;

  @ApiProperty({ description: 'the draft flag' })
  @IsBoolean()
  @IsOptional()
  isDraft: boolean;
}
