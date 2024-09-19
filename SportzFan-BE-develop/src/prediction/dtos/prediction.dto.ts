import { ApiProperty } from '@nestjs/swagger';
import { PredictionType } from 'src/common/models/base';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

import { CommonDto } from '../../common/dtos/common.dto';
import { TeamDto } from 'src/team/dtos/team.dto';
import { MatchDto } from 'src/match/dtos/match.dto';
import { SponsorDto } from 'src/sponsor/dtos/sponsor.dto';
import { PlayPredictionDto } from './play-prediction.dto';
import { PredictionEntity } from '../entities/prediction.entity';
import {
  PredictionRewardDistributionDto,
  PredictionRewardDistributionRegisterDto,
} from './prediction-reward-distribution.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

export class PredictionDto extends CommonDto {
  @ApiProperty({ description: 'the team' })
  team: TeamDto;

  @ApiProperty({ description: 'the match' })
  match: MatchDto;

  @ApiProperty({ description: 'the prediction title' })
  title: string;

  @ApiProperty({ description: 'the prediction description' })
  description: string;

  @ApiProperty({ description: 'the prediction type' })
  @IsEnum(PredictionType)
  predictionType: PredictionType;

  @ApiProperty({ description: 'the participants type' })
  participants: number;

  @ApiProperty({ description: 'the starte date' })
  start: Date;

  @ApiProperty({ description: 'the expiration date' })
  end: Date;

  @ApiProperty({ description: 'the sponsor' })
  sponsor: SponsorDto;

  @ApiProperty({ description: 'the eligiblity no of kudos points' })
  eligbleKudos: number;

  @ApiProperty({ description: 'the eligiblity no of tokens points' })
  eligbleToken: number;

  @ApiProperty({
    description: 'the reward no of kudos points for participation(Per player)',
  })
  rewardKudosAll: number;

  @ApiProperty({ description: 'the no of kudos points total for winners' })
  rewardKudosWinnerTotal: number;

  @ApiProperty({ description: 'the no of tokes total for winners' })
  rewardTokenWinnerTotal: number;

  @ApiProperty({ description: 'the result' })
  resultMain: number;

  @ApiProperty({ description: 'the result' })
  isResult: boolean;

  @ApiProperty({ description: 'the result' })
  resultOpposition: number;

  @ApiProperty({
    description: 'the winner distribution',
    type: () => PredictionRewardDistributionDto,
    isArray: true,
  })
  rewardDistribution: PredictionRewardDistributionDto[];

  @ApiProperty({
    type: () => PlayPredictionDto,
    isArray: true,
  })
  playPrediction: PlayPredictionDto[];

  @ApiProperty({ description: 'the draft flag' })
  isDraft: boolean;

  @ApiProperty({ description: 'the verification ended flag' })
  isEnded: boolean;

  static toPredictionDto(prediction: PredictionEntity): PredictionDto {
    return {
      id: prediction.id,
      createdAt: prediction.createdAt,
      updatedAt: prediction.updatedAt,
      team: prediction?.team,
      match: prediction?.match,
      title: prediction.title,
      description: prediction.description,
      predictionType: prediction.predictionType,
      participants: prediction.participants,
      start: prediction.start,
      end: prediction.end,
      sponsor: prediction?.sponsor,
      eligbleKudos: prediction.eligbleKudos,
      eligbleToken: prediction.eligbleToken,
      rewardKudosAll: prediction.rewardKudosAll,
      rewardKudosWinnerTotal: prediction.rewardKudosWinnerTotal,
      rewardTokenWinnerTotal: prediction.rewardTokenWinnerTotal,
      resultMain: prediction.resultMain,
      isResult: prediction.isResult,
      resultOpposition: prediction.resultOpposition,
      rewardDistribution: prediction.rewardDistribution,
      playPrediction: prediction.playPrediction,
      isDraft: prediction.isDraft,
      isEnded: prediction.isEnded,
    };
  }
}

export class PredictionMyResultDto extends CommonDto {
  @ApiProperty({ description: 'the team' })
  team: TeamDto;

  @ApiProperty({ description: 'the match' })
  match: MatchDto;

  @ApiProperty({ description: 'the prediction title' })
  title: string;

  @ApiProperty({ description: 'the prediction description' })
  description: string;

  @ApiProperty({ description: 'the prediction type' })
  @IsEnum(PredictionType)
  predictionType: PredictionType;

  @ApiProperty({ description: 'the participants type' })
  participants: number;

  @ApiProperty({ description: 'the starte date' })
  start: Date;

  @ApiProperty({ description: 'the expiration date' })
  end: Date;

  @ApiProperty({ description: 'the sponsor' })
  sponsor: SponsorDto;

  @ApiProperty({ description: 'the eligiblity no of kudos points' })
  eligbleKudos: number;

  @ApiProperty({ description: 'the eligiblity no of tokens points' })
  eligbleToken: number;

  @ApiProperty({
    description: 'the reward no of kudos points for participation(Per player)',
  })
  rewardKudosAll: number;

  @ApiProperty({ description: 'the no of kudos points total for winners' })
  rewardKudosWinnerTotal: number;

  @ApiProperty({ description: 'the no of tokes total for winners' })
  rewardTokenWinnerTotal: number;

  @ApiProperty({ description: 'the result' })
  resultMain: number;

  @ApiProperty({ description: 'the result' })
  isResult: boolean;

  @ApiProperty({ description: 'the result' })
  resultOpposition: number;

  @ApiProperty({
    description: 'the winner distribution',
    type: () => PredictionRewardDistributionDto,
    isArray: true,
  })
  rewardDistribution: PredictionRewardDistributionDto[];

  @ApiProperty({
    type: () => PlayPredictionDto,
    isArray: true,
  })
  playPrediction: PlayPredictionDto[];

  @ApiProperty({ description: 'the draft flag' })
  isDraft: boolean;

  @ApiProperty({ description: 'the verification ended flag' })
  isEnded: boolean;

  @ApiProperty({ description: 'the total player count' })
  totalCount: number;
}

export class PredictionRegisterDto {
  @ApiProperty({ description: 'the team' })
  @IsUUID()
  teamId: string;

  @ApiProperty({ description: 'the prediction type' })
  @IsEnum(PredictionType)
  predictionType: PredictionType;

  @ApiProperty({ description: 'the match' })
  @IsUUID()
  matchId: string;

  @ApiProperty({ description: 'the prediction title' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'the prediction description' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'the participants type' })
  @IsNumber()
  participants: number;

  @ApiProperty({ description: 'the starte date' })
  @IsDateString()
  start: Date;

  @ApiProperty({ description: 'the expiration date' })
  @IsDateString()
  end: Date;

  @ApiProperty({ description: 'the sponsor' })
  @IsUUID()
  sponsorId: string;

  @ApiProperty({ description: 'the eligiblity no of kudos points' })
  @IsNumber()
  eligbleKudos: number;

  @ApiProperty({ description: 'the eligiblity no of tokens points' })
  @IsNumber()
  eligbleToken: number;

  @ApiProperty({
    description: 'the reward no of kudos points for participation(Per player)',
  })
  @IsNumber()
  rewardKudosAll: number;

  @ApiProperty({ description: 'the no of kudos points total for winners' })
  @IsNumber()
  rewardKudosWinnerTotal: number;

  @ApiProperty({ description: 'the no of tokes total for winners' })
  @IsNumber()
  rewardTokenWinnerTotal: number;

  @ApiProperty({
    description: 'the winner distribution',
    type: () => PredictionRewardDistributionRegisterDto,
    isArray: true,
  })
  @IsArray()
  rewardDistribution: PredictionRewardDistributionRegisterDto[];

  @ApiProperty({ description: 'the draft flag' })
  @IsBoolean()
  @IsOptional()
  isDraft: boolean;
}

export class PredictionResultUpdateDto {
  @ApiProperty({ description: 'the result' })
  @IsNumber()
  resultMain: number;

  @ApiProperty({ description: 'the result' })
  @IsNumber()
  resultOpposition: number;
}

export class PredictionListDto extends PaginationDto {
  @ApiProperty({
    description: 'the prediction list search string',
    required: false,
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({
    description: 'the prediction list verfied option (true/false)',
    required: false,
  })
  @IsString()
  @IsOptional()
  isVerified?: string;
}
