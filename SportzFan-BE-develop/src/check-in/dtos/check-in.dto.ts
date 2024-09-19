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
import { MatchDto } from 'src/match/dtos/match.dto';
import { PlayCheckInDto } from './play-check-in.dto';
import { CommonDto } from '../../common/dtos/common.dto';
import { SponsorDto } from 'src/sponsor/dtos/sponsor.dto';
import { CheckInEntity } from '../entities/check-in.entity';
import { AssetDto } from '../../asset/dtos/asset.dto';

export class CheckInDto extends CommonDto {
  @ApiProperty({
    description: 'the check-in description ',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'the check-in title',
  })
  @IsString()
  description: string;

  @ApiProperty({ description: 'the team' })
  team: TeamDto;

  @ApiProperty({ description: 'the event match/event' })
  match: MatchDto;

  @ApiProperty({
    description: 'the game sponsor',
  })
  sponsor: SponsorDto;

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

  @ApiProperty({ description: 'the challenge start date&time' })
  start: Date;

  @ApiProperty({ description: 'the challenge expiration date & time' })
  end: Date;

  @ApiProperty({ description: 'the participants type' })
  participants: number;

  @ApiProperty({
    description: 'the amount of reward Kudos points when user is out venue',
  })
  outKudosReward: number;

  @ApiProperty({
    description: 'the amount of reward token when user is out ',
  })
  outTokenReward: number;

  @ApiProperty({
    description: 'the play-check-in list',
  })
  playCheckIn: PlayCheckInDto[];

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

  static toCheckInDto(checkIn: CheckInEntity): CheckInDto {
    return {
      id: checkIn.id,
      createdAt: checkIn.createdAt,
      updatedAt: checkIn.updatedAt,
      title: checkIn.title,
      description: checkIn.description,
      team: checkIn.team,
      match: checkIn.match,
      sponsor: checkIn.sponsor,
      eligbleKudos: checkIn.eligbleKudos,
      eligbleToken: checkIn.eligbleToken,
      kudosReward: checkIn.kudosReward,
      tokenReward: checkIn.tokenReward,
      start: checkIn.start,
      end: checkIn.end,
      participants: checkIn.participants,
      outKudosReward: checkIn.outKudosReward,
      outTokenReward: checkIn.outTokenReward,
      playCheckIn: checkIn?.playCheckIn,
      asset: checkIn.asset,
      enableAssetReward: checkIn.enableAssetReward,
      rewardAssetCount: checkIn.rewardAssetCount,
      winnerLimit: checkIn.winnerLimit,
      isDraft: checkIn.isDraft,
    };
  }
}

export class CheckInRegisterDto {
  @ApiProperty({
    description: 'the check-in description ',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'the check-in title',
  })
  @IsString()
  description: string;

  @ApiProperty({ description: 'the challenge type' })
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

  @ApiProperty({ description: 'the challenge start date&time' })
  @IsDateString()
  start: Date;

  @ApiProperty({ description: 'the challenge expiration date & time' })
  @IsDateString()
  end: Date;

  @ApiProperty({ description: 'the participants type' })
  @IsNumber()
  participants: number;

  @ApiProperty({ description: 'the event match/event' })
  @IsUUID()
  matchId: string;

  @ApiProperty({
    description: 'the amount of reward Kudos points when user is out venue',
  })
  @IsNumber()
  outKudosReward: number;

  @ApiProperty({
    description: 'the amount of reward token when user is out ',
  })
  @IsNumber()
  outTokenReward: number;

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
  isDraft: boolean;
}
export class CheckInDuplicateDto {
  @ApiProperty({
    description: 'the check-in description ',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'the check-in title',
  })
  @IsString()
  description: string;

  @ApiProperty({ description: 'the challenge type' })
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

  @ApiProperty({ description: 'the challenge start date&time' })
  @IsDateString()
  start: Date;

  @ApiProperty({ description: 'the challenge expiration date & time' })
  @IsDateString()
  end: Date;

  @ApiProperty({ description: 'the participants type' })
  @IsNumber()
  participants: number;

  @ApiProperty({
    description: 'the amount of reward Kudos points when user is out venue',
  })
  @IsNumber()
  outKudosReward: number;

  @ApiProperty({
    description: 'the amount of reward token when user is out ',
  })
  @IsNumber()
  outTokenReward: number;

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
  isDraft: boolean;
}
export class CheckInUpdateDto {
  @ApiProperty({ description: 'the team' })
  @IsOptional()
  @IsUUID()
  teamId: string;

  @ApiProperty({ description: 'the eligibile Kudos point' })
  @IsOptional()
  @IsNumber()
  eligbleKudos: number;

  @ApiProperty({ description: 'the eligibile Token amount' })
  @IsOptional()
  @IsNumber()
  eligbleToken: number;

  @ApiProperty({
    description: 'the amount of reward Kudos points when user is at venue',
  })
  @IsOptional()
  @IsNumber()
  kudosReward: number;

  @ApiProperty({
    description: 'the amount of reward token when user is at venue',
  })
  @IsOptional()
  @IsNumber()
  tokenReward: number;

  @ApiProperty({
    description: 'the game sponsor',
  })
  @IsOptional()
  @IsUUID()
  sponsorId: string;

  @ApiProperty({ description: 'the challenge start date&time' })
  @IsOptional()
  @IsDateString()
  start: Date;

  @ApiProperty({ description: 'the challenge expiration date & time' })
  @IsOptional()
  @IsDateString()
  end: Date;

  @ApiProperty({ description: 'the participants type' })
  @IsOptional()
  @IsNumber()
  participants: number;

  @ApiProperty({ description: 'the event match/event' })
  @IsUUID()
  @IsOptional()
  matchId: string;

  @ApiProperty({
    description: 'the amount of reward Kudos points when user is out venue',
  })
  @IsNumber()
  @IsOptional()
  outKudosReward: number;

  @ApiProperty({
    description: 'the amount of reward token when user is out ',
  })
  @IsNumber()
  @IsOptional()
  outTokenReward: number;

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
  isDraft: boolean;
}
