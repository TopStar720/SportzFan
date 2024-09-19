import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

import { CommonDto } from 'src/common/dtos/common.dto';
import { SponsorDto } from 'src/sponsor/dtos/sponsor.dto';
import { TeamDto } from 'src/team/dtos/team.dto';
import { MultiReferrerEntity } from '../entities/multi-referrer.entity';

export class MultiReferrerDto extends CommonDto {
  @ApiProperty({ description: 'the team' })
  team: TeamDto;

  @ApiProperty({
    description: 'the game sponsor',
  })
  sponsor: SponsorDto;

  @ApiProperty({
    description: 'the amount of reward token when user is out ',
  })
  title: string;

  @ApiProperty({
    description: 'the amount of reward Kudos points when user is out venue',
  })
  description: string;

  @ApiProperty({
    description: 'the No of referrals required to complete challenge',
  })
  eligbleReferal: number;

  @ApiProperty({
    description: 'the time to complete challenge from signup',
  })
  eligbleDay: number;

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
    description: 'the amount of reward token when user is out ',
  })
  @ApiProperty({ description: 'the draft flag' })
  isDraft: boolean;

  static toMultiReferrerDto(
    multiReferrer: MultiReferrerEntity,
  ): MultiReferrerDto {
    return {
      id: multiReferrer.id,
      createdAt: multiReferrer.createdAt,
      updatedAt: multiReferrer.updatedAt,
      team: multiReferrer.team,
      eligbleReferal: multiReferrer.eligbleReferal,
      eligbleDay: multiReferrer.eligbleDay,
      kudosReward: multiReferrer.kudosReward,
      tokenReward: multiReferrer.tokenReward,
      sponsor: multiReferrer.sponsor,
      start: multiReferrer.start,
      end: multiReferrer.end,
      participants: multiReferrer.participants,
      description: multiReferrer.description,
      title: multiReferrer.title,
      isDraft: multiReferrer.isDraft,
    };
  }
}

export class MultiReferrerRegisterDto {
  @ApiProperty({ description: 'the team id' })
  @IsUUID()
  teamId: string;

  @ApiProperty({
    description: 'the No of referrals required to complete challenge',
  })
  eligbleReferal: number;

  @ApiProperty({ description: 'the time to complete challenge from signup' })
  eligbleDay: number;

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

  @ApiProperty({ description: 'the multi referrer start date&time' })
  @IsDateString()
  start: Date;

  @ApiProperty({ description: 'the multi referrer expiration date & time' })
  @IsDateString()
  end: Date;

  @ApiProperty({ description: 'the participants type' })
  @IsNumber()
  participants: number;

  @ApiProperty({
    description: 'the amount of reward Kudos points when user is out venue',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'the amount of reward token when user is out ',
  })
  @IsString()
  title: string;

  @ApiProperty({ description: 'the draft flag' })
  @IsBoolean()
  @IsOptional()
  isDraft: boolean;
}

export class MultiReferrerUpdateDto {
  @ApiProperty({ description: 'the team id' })
  @IsUUID()
  @IsOptional()
  teamId: string;

  @ApiProperty({
    description: 'the No of referrals required to complete challenge',
  })
  eligbleReferal: number;

  @ApiProperty({ description: 'the time to completee challenge from signup' })
  eligbleDay: number;

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

  @ApiProperty({ description: 'the multi referrer start date&time' })
  @IsDateString()
  @IsOptional()
  start: Date;

  @ApiProperty({ description: 'the multi referrer expiration date & time' })
  @IsDateString()
  @IsOptional()
  end: Date;

  @ApiProperty({ description: 'the participants type' })
  @IsNumber()
  @IsOptional()
  participants: number;

  @ApiProperty({
    description: 'the amount of reward Kudos points when user is out venue',
  })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    description: 'the amount of reward token when user is out ',
  })
  @IsString()
  @IsOptional()
  title: string;

  @ApiProperty({ description: 'the draft flag' })
  @IsBoolean()
  @IsOptional()
  isDraft: boolean;
}
