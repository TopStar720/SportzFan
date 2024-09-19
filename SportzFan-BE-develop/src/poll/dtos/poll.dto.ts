import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { CommonDto } from 'src/common/dtos/common.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { DirectionFilter, SortFilter } from 'src/common/models/base';
import { MatchDto } from 'src/match/dtos/match.dto';
import { SponsorDto } from 'src/sponsor/dtos/sponsor.dto';
import { TeamDto } from 'src/team/dtos/team.dto';
import { OptionType, PollFilter } from '../enums';
import { PollOptionDto } from './poll-option.dto';
import { PollParticipantDto } from './poll-participant.dto';
import { AssetDto } from '../../asset/dtos/asset.dto';

export class PollDto extends CommonDto {
  @ApiProperty({ description: 'the team' })
  team: TeamDto;

  @ApiProperty({ description: 'the title' })
  title: string;

  @ApiProperty({ description: 'the description' })
  description: string;

  @ApiProperty({ description: 'the poll option type' })
  optionType: OptionType;

  @ApiProperty({
    description: 'the poll options',
    type: () => PollOptionDto,
    isArray: true,
  })
  options: PollOptionDto[];

  @ApiProperty({ description: 'the match' })
  match: MatchDto;

  @ApiProperty({ description: 'the participant type' })
  participantType: number;

  @ApiProperty({
    description: 'the poll participants',
    type: () => PollParticipantDto,
    isArray: true,
  })
  participants: PollParticipantDto[];

  @ApiProperty({ description: 'the start date&time' })
  start: Date;

  @ApiProperty({ description: 'the expiration date & time' })
  end: Date;

  @ApiProperty({ description: 'the eligible Kudos point' })
  kudosEligible: number;

  @ApiProperty({ description: 'the eligible Token amount' })
  tokenEligible: number;

  @ApiProperty({ description: 'the amount of reward Kudos points' })
  kudosReward: number;

  @ApiProperty({ description: 'the amount of reward token' })
  tokenReward: number;

  @ApiProperty({ description: 'the sponsor' })
  sponsor: SponsorDto;

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

  @ApiProperty({ description: 'the poll play flag' })
  @IsOptional()
  isPlayed?: boolean;
}

export class PollItemDto {
  @ApiProperty({ description: 'the poll id' })
  id: string;

  @ApiProperty({ description: 'the poll type' })
  type: string;

  @ApiProperty({ description: 'the poll team id' })
  team_id: string;

  @ApiProperty({ description: 'the poll title' })
  title: string;

  @ApiProperty({ description: 'the poll description' })
  description: string;

  @ApiProperty({ description: 'the poll start date' })
  start: Date;

  @ApiProperty({ description: 'the poll end date' })
  end: Date;
}

export class PollListDto extends PaginationDto {
  @ApiProperty({ description: 'the poll list search', required: false })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({
    description: 'the poll list draft option (true/false)',
    required: false,
  })
  @IsString()
  @IsOptional()
  isDraft?: string;

  @ApiProperty({
    description: 'the poll list ended option (true/false)',
    required: false,
  })
  @IsString()
  @IsOptional()
  isEnded?: string;

  @ApiProperty({ description: 'the poll list filter', required: false })
  @IsEnum(PollFilter)
  @IsOptional()
  filter: PollFilter;

  @ApiProperty({ description: 'the poll list sort filter', required: false })
  @IsEnum(SortFilter)
  @IsOptional()
  sort: SortFilter;

  @ApiProperty({ description: 'the poll sort direction', required: false })
  @IsEnum(DirectionFilter)
  @IsOptional()
  direction: DirectionFilter;
}
