import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

import { CommonDto } from 'src/common/dtos/common.dto';
import { MatchDto } from 'src/match/dtos/match.dto';
import { SponsorDto } from 'src/sponsor/dtos/sponsor.dto';
import { TeamDto } from 'src/team/dtos/team.dto';
import { PlayMultiCheckInDto } from './play-multi-check-in.dto';
import { MultiCheckInEntity } from '../entities/multi-check-in.entity';

export class MultiCheckInDto extends CommonDto {
  @ApiProperty({
    description: 'the multi-check-in title',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'the multi-check-in description ',
  })
  @IsString()
  title: string;

  @ApiProperty({ description: 'the team' })
  team: TeamDto;

  @ApiProperty({ description: 'the eligibile Kudos point' })
  eligbleCheckIn: number;

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

  @ApiProperty({ description: 'the multi-check-in start date&time' })
  start: Date;

  @ApiProperty({ description: 'the multi-check-in expiration date & time' })
  end: Date;

  @ApiProperty({ description: 'the participants type' })
  participants: number;

  @ApiProperty({ description: 'the event match/event' })
  match: MatchDto;

  @ApiProperty({
    description: 'the amount of reward Kudos points when user is out venue',
  })
  outKudosReward: number;

  @ApiProperty({
    description: 'the amount of reward token when user is out ',
  })
  outTokenReward: number;

  @ApiProperty({ description: 'the draft flag' })
  isDraft: boolean;

  static toMultiCheckInDto(multCheckIn: MultiCheckInEntity): MultiCheckInDto {
    return {
      id: multCheckIn.id,
      title: multCheckIn.title,
      description: multCheckIn.description,
      createdAt: multCheckIn.createdAt,
      updatedAt: multCheckIn.updatedAt,
      team: multCheckIn.team,
      eligbleCheckIn: multCheckIn.eligbleCheckIn,
      kudosReward: multCheckIn.kudosReward,
      tokenReward: multCheckIn.tokenReward,
      sponsor: multCheckIn.sponsor,
      start: multCheckIn.start,
      end: multCheckIn.end,
      participants: multCheckIn.participants,
      match: multCheckIn.match,
      outKudosReward: multCheckIn.outKudosReward,
      outTokenReward: multCheckIn.outTokenReward,
      isDraft: multCheckIn.isDraft,
    };
  }
}

export class MultiCheckInRegisterDto {
  @ApiProperty({
    description: 'the multi-check-in title',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'the multi-check-in description ',
  })
  @IsString()
  title: string;

  @ApiProperty({ description: 'the team id' })
  @IsUUID()
  teamId: string;

  @Transform(({ value, key, obj }) => {
    obj.eligbleKudos = value;
  })
  @ApiProperty({
    description: 'the amount of reward Kudos points when user is at venue',
  })
  eligbleCheckIn: number;

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

  @ApiProperty({ description: 'the multi check in start date&time' })
  @IsDateString()
  start: Date;

  @ApiProperty({ description: 'the multi check in expiration date & time' })
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

  @ApiProperty({ description: 'the draft flag' })
  @IsBoolean()
  @IsOptional()
  isDraft: boolean;
}

export class MultiCheckInUpdateDto {
  @ApiProperty({
    description: 'the multi-check-in title',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'the multi-check-in description ',
  })
  @IsString()
  title: string;

  @ApiProperty({ description: 'the team id' })
  @IsUUID()
  @IsOptional()
  teamId: string;

  @Transform(({ value, key, obj }) => {
    obj.eligbleKudos = value;
  })
  eligbleCheckIn: number;

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

  @ApiProperty({ description: 'the multi check in start date&time' })
  @IsDateString()
  @IsOptional()
  start: Date;

  @ApiProperty({ description: 'the multi check in expiration date & time' })
  @IsDateString()
  @IsOptional()
  end: Date;

  @ApiProperty({ description: 'the participants type' })
  @IsNumber()
  @IsOptional()
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

  @ApiProperty({ description: 'the draft flag' })
  @IsBoolean()
  @IsOptional()
  isDraft: boolean;
}
