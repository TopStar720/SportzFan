import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

import {
  ChallengeFilter,
  DirectionFilter,
  SortFilter,
} from '../../common/models/base';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CheckInDto } from '../../check-in/dtos/check-in.dto';
import { MultiCheckInDto } from '../../multi-check-in/dtos/multi-check-in.dto';
import { SurveyDto } from '../../survey/dtos/survey.dto';
import { MultiReferrerDto } from '../../multi-referrer/dtos/multi-referrer.dto';

export class ChallengeItemDto {
  @ApiProperty({ description: 'the challenge id' })
  id: string;

  @ApiProperty({ description: 'the challenge type' })
  type: string;

  @ApiProperty({ description: 'the challenge play flag' })
  @IsOptional()
  isPlayed?: boolean;

  @ApiProperty({ description: 'the challenge title' })
  title: string;

  @ApiProperty({ description: 'the challenge description' })
  description: string;

  @ApiProperty({ description: 'the challenge start date' })
  start: Date;

  @ApiProperty({ description: 'the challenge end date' })
  end: Date;

  @ApiProperty({ description: 'the team name' })
  team_name: string;

  @ApiProperty({ description: 'the team description' })
  team_description: string;

  @ApiProperty({ description: 'the team logo' })
  team_logo: string;

  @ApiProperty({ description: 'the match title' })
  match_title: string;

  @ApiProperty({ description: 'the match type' })
  match_type: string;

  @ApiProperty({ description: 'the match home team name' })
  match_home_team_name: string;

  @ApiProperty({ description: 'the match home team description' })
  match_home_team_description: string;

  @ApiProperty({ description: 'the match home team logo' })
  match_home_team_logo: string;

  @ApiProperty({ description: 'the match away team name' })
  match_away_team_name: string;

  @ApiProperty({ description: 'the match away team description' })
  match_away_team_description: string;

  @ApiProperty({ description: 'the match away team logo' })
  match_away_team_logo: string;

  @ApiProperty({ description: 'the kudos reward amount' })
  kudos_reward_amount: number;

  @ApiProperty({ description: 'the token reward amount' })
  token_reward_amount: number;

  @ApiProperty({ description: 'the out kudos reward amount' })
  out_kudos_reward_amount: number;

  @ApiProperty({ description: 'the out token reward amount' })
  out_token_reward_amount: number;
}

export class JustOnlineChallengeDto {
  @ApiProperty({ description: 'the challenge id' })
  id: string;

  @ApiProperty({ description: 'the challenge type' })
  type: string;

  @ApiProperty({ description: 'the challenge team id' })
  team_id: string;

  @ApiProperty({ description: 'the challenge title' })
  title: string;

  @ApiProperty({ description: 'the challenge description' })
  description: string;

  @ApiProperty({ description: 'the challenge start date' })
  start: Date;

  @ApiProperty({ description: 'the challenge end date' })
  end: Date;
}

export class ChallengeListDto extends PaginationDto {
  @ApiProperty({ description: 'the challenge list search', required: false })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({
    description: 'the challenge list draft option (true/false)',
    required: false,
  })
  @IsString()
  @IsOptional()
  isDraft?: string;

  @ApiProperty({ description: 'the challenge list filter', required: false })
  @IsEnum(ChallengeFilter)
  @IsOptional()
  filter: ChallengeFilter;

  @ApiProperty({ description: 'the challenge list sort enum', required: false })
  @IsEnum(SortFilter)
  @IsOptional()
  sort: SortFilter;

  @ApiProperty({
    description: 'the challenge list sort direction enum',
    required: false,
  })
  @IsEnum(DirectionFilter)
  @IsOptional()
  direction: DirectionFilter;
}

export class ChallengeListBySideResponseDto {
  @ApiProperty({ description: 'the checkIn List' })
  checkIn: {
    data: CheckInDto[];
    count: number;
  };

  @ApiProperty({ description: 'the multi checkIn List' })
  multiCheckIn: {
    data: MultiCheckInDto[];
    count: number;
  };

  @ApiProperty({ description: 'the survey List' })
  survey: {
    data: SurveyDto[];
    count: number;
  };

  @ApiProperty({ description: 'the multi referrer List' })
  multiReferrer: {
    data: MultiReferrerDto[];
    count: number;
  };
}

export class ChallengeListBySideDto {
  @ApiProperty({ description: 'the match list search', required: false })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({ description: 'the match list filter', required: false })
  @IsEnum(ChallengeFilter)
  @IsOptional()
  filter: ChallengeFilter;
}
