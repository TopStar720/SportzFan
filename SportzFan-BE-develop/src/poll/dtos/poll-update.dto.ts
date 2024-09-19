import { ApiProperty } from '@nestjs/swagger';
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

import { OptionType } from '../enums';
import { PollOptionRegisterDto } from './poll-option-register.dto';

export class PollUpdateDto {
  @ApiProperty({ description: 'the team id' })
  @IsUUID()
  teamId: string;

  @ApiProperty({ description: 'the title' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'the description' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'the poll option type' })
  @IsEnum(OptionType)
  optionType: OptionType;

  @ApiProperty({
    description: 'the poll options',
    type: () => PollOptionRegisterDto,
    isArray: true,
  })
  @IsArray()
  options: PollOptionRegisterDto[];

  @ApiProperty({ description: 'the match id' })
  @IsUUID()
  matchId: string;

  @ApiProperty({ description: 'the participant type' })
  @IsNumber()
  participantType: number;

  @ApiProperty({ description: 'the start date & time' })
  @IsDateString()
  start: Date;

  @ApiProperty({ description: 'the expiration date & time' })
  @IsDateString()
  end: Date;

  @ApiProperty({ description: 'the eligible Kudos point' })
  @IsNumber()
  kudosEligible: number;

  @ApiProperty({ description: 'the eligible Token amount' })
  @IsNumber()
  tokenEligible: number;

  @ApiProperty({ description: 'the amount of reward Kudos points' })
  @IsNumber()
  kudosReward: number;

  @ApiProperty({ description: 'the amount of reward token' })
  @IsNumber()
  tokenReward: number;

  @ApiProperty({ description: 'the sponsor id' })
  @IsUUID()
  sponsorId: string;

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
}
