import { ApiProperty } from '@nestjs/swagger';
import { TriviaType } from 'src/common/models/base';
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

import { TeamDto } from 'src/team/dtos/team.dto';
import { PlayTriviaDto } from './play-trivia.dto';
import { MatchDto } from 'src/match/dtos/match.dto';
import { TriviaEntity } from '../entities/trivia.entity';
import { CommonDto } from '../../common/dtos/common.dto';
import { SponsorDto } from 'src/sponsor/dtos/sponsor.dto';
import {
  TriviaQuestionDto,
  TriviaQuestionRegisterDto,
} from './trivia-question.dto';
import {
  TriviaRewardDistributionDto,
  TriviaRewardDistributionRegisterDto,
} from './trivia-reward-distribution.dto';
import { AssetDto } from '../../asset/dtos/asset.dto';

export class TriviaDto extends CommonDto {
  @ApiProperty({ description: 'the team' })
  team: TeamDto;

  @ApiProperty({ description: 'the trivia type' })
  @IsEnum(TriviaType)
  triviaType: TriviaType;

  @ApiProperty({ description: 'the match' })
  match: MatchDto;

  @ApiProperty({ description: 'the trivia title' })
  title: string;

  @ApiProperty({ description: 'the trivia description' })
  description: string;

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

  @ApiProperty({
    description: 'the winner distribution',
    type: () => TriviaRewardDistributionDto,
    isArray: true,
  })
  rewardDistribution: TriviaRewardDistributionDto[];

  @ApiProperty({
    description: 'the winner distribution',
    type: () => TriviaQuestionDto,
    isArray: true,
  })
  triviaQuestions: TriviaQuestionDto[];

  @ApiProperty({
    type: () => PlayTriviaDto,
    isArray: true,
  })
  playTrivia: PlayTriviaDto[];

  @ApiProperty({ description: 'the asset' })
  asset: AssetDto;

  @ApiProperty({ description: 'the flag that enable asset reward logic' })
  enableAssetReward: boolean;

  @ApiProperty({ description: 'the asset count per player' })
  rewardAssetCount: number;

  @ApiProperty({ description: 'the maximum number of winners' })
  winnerLimit: number;

  @ApiProperty({ description: 'the draft flag' })
  isDraft: boolean;

  @ApiProperty({ description: 'the verification ended flag' })
  isEnded: boolean;

  static toTriviaDto(trivia: TriviaEntity): TriviaDto {
    return {
      id: trivia.id,
      createdAt: trivia.createdAt,
      updatedAt: trivia.updatedAt,
      team: trivia?.team,
      triviaType: trivia.triviaType,
      match: trivia?.match,
      title: trivia.title,
      description: trivia.description,
      start: trivia.start,
      end: trivia.end,
      sponsor: trivia?.sponsor,
      eligbleKudos: trivia.eligbleKudos,
      eligbleToken: trivia.eligbleToken,
      rewardKudosAll: trivia.rewardKudosAll,
      rewardKudosWinnerTotal: trivia.rewardKudosWinnerTotal,
      rewardTokenWinnerTotal: trivia.rewardTokenWinnerTotal,
      rewardDistribution: trivia?.rewardDistribution,
      triviaQuestions: trivia?.triviaQuestions,
      playTrivia: trivia?.playTrivia,
      asset: trivia.asset,
      enableAssetReward: trivia.enableAssetReward,
      rewardAssetCount: trivia.rewardAssetCount,
      winnerLimit: trivia.winnerLimit,
      isDraft: trivia.isDraft,
      isEnded: trivia.isEnded,
    };
  }
}

export class TriviaMyResultDto extends CommonDto {
  @ApiProperty({ description: 'the team' })
  team: TeamDto;

  @ApiProperty({ description: 'the trivia type' })
  @IsEnum(TriviaType)
  triviaType: TriviaType;

  @ApiProperty({ description: 'the match' })
  match: MatchDto;

  @ApiProperty({ description: 'the trivia title' })
  title: string;

  @ApiProperty({ description: 'the trivia description' })
  description: string;

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

  @ApiProperty({
    description: 'the winner distribution',
    type: () => TriviaRewardDistributionDto,
    isArray: true,
  })
  rewardDistribution: TriviaRewardDistributionDto[];

  @ApiProperty({
    description: 'the winner distribution',
    type: () => TriviaQuestionDto,
    isArray: true,
  })
  triviaQuestions: TriviaQuestionDto[];

  @ApiProperty({
    type: () => PlayTriviaDto,
    isArray: true,
  })
  playTrivia: PlayTriviaDto[];

  @ApiProperty({ description: 'the asset' })
  asset: AssetDto;

  @ApiProperty({ description: 'the flag that enable asset reward logic' })
  enableAssetReward: boolean;

  @ApiProperty({ description: 'the asset count per player' })
  rewardAssetCount: number;

  @ApiProperty({ description: 'the maximum number of winners' })
  winnerLimit: number;

  @ApiProperty({ description: 'the draft flag' })
  isDraft: boolean;

  @ApiProperty({ description: 'the verification ended flag' })
  isEnded: boolean;

  @ApiProperty({ description: 'the total number of player' })
  totalCount: number;
}

export class TriviaRegisterDto {
  @ApiProperty({ description: 'the team' })
  @IsUUID()
  teamId: string;

  @ApiProperty({ description: 'the trivia type' })
  @IsEnum(TriviaType)
  triviaType: TriviaType;

  @ApiProperty({ description: 'the match' })
  @IsUUID()
  matchId: string;

  @ApiProperty({ description: 'the trivia title' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'the trivia description' })
  @IsString()
  description: string;

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
    type: () => TriviaRewardDistributionRegisterDto,
    isArray: true,
  })
  @IsArray()
  rewardDistribution: TriviaRewardDistributionRegisterDto[];

  @ApiProperty({
    description: 'the winner distribution',
    type: () => TriviaQuestionRegisterDto,
    isArray: true,
  })
  @IsArray()
  triviaQuestions: TriviaQuestionRegisterDto[];

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

  @ApiProperty({ description: 'the draft flag' })
  @IsBoolean()
  @IsOptional()
  isDraft: boolean;
}
