import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { PaginationDto } from 'src/common/dtos/pagination.dto';
import {
  DirectionFilter,
  GameFilter,
  SortFilter,
} from 'src/common/models/base';
import { PredictionDto } from '../../prediction/dtos/prediction.dto';
import { TriviaDto } from '../../trivia/dtos/trivia.dto';
import { MilestoneDto } from '../../milestone/dtos/milestone.dto';

export class GameListDto extends PaginationDto {
  @ApiProperty({ description: 'the game list search string', required: false })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({
    description: 'the game list draft option (true/false)',
    required: false,
  })
  @IsString()
  @IsOptional()
  isDraft?: string;

  @ApiProperty({
    description: 'the game list ended option (true/false)',
    required: false,
  })
  @IsString()
  @IsOptional()
  isEnded?: string;

  @ApiProperty({ description: 'the game list filter enum', required: false })
  @IsEnum(GameFilter)
  @IsOptional()
  filter: GameFilter;

  @ApiProperty({ description: 'the game list sort enum', required: false })
  @IsEnum(SortFilter)
  @IsOptional()
  sort: SortFilter;

  @ApiProperty({
    description: 'the game list sort direction enum',
    required: false,
  })
  @IsEnum(DirectionFilter)
  @IsOptional()
  direction: DirectionFilter;
}

export class GameListByOwnerRequestDto {
  @ApiProperty({ description: 'the game list search string', required: false })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({
    description: 'the game list draft option (true/false)',
    required: false,
  })
  @IsString()
  @IsOptional()
  isDraft?: string;

  @ApiProperty({
    description: 'the game list ended option (true/false)',
    required: false,
  })
  @IsString()
  @IsOptional()
  isEnded?: string;

  @ApiProperty({ description: 'the game list filter enum', required: false })
  @IsEnum(GameFilter)
  @IsOptional()
  filter: GameFilter;
}

export class GameListByOwnerResponseDto {
  @ApiProperty({ description: 'the prediction List' })
  prediction: {
    data: PredictionDto[];
    count: number;
  };

  @ApiProperty({ description: 'the trivia List' })
  trivia: {
    data: TriviaDto[];
    count: number;
  };

  @ApiProperty({ description: 'the milestone List' })
  milestone: {
    data: MilestoneDto[];
    count: number;
  };
}

export class JustOnlineGameDto {
  @ApiProperty({ description: 'the game id' })
  id: string;

  @ApiProperty({ description: 'the game type' })
  type: string;

  @ApiProperty({ description: 'the game team id' })
  team_id: string;

  @ApiProperty({ description: 'the game title' })
  title: string;

  @ApiProperty({ description: 'the game description' })
  description: string;

  @ApiProperty({ description: 'the game start date' })
  start: Date;

  @ApiProperty({ description: 'the game end date' })
  end: Date;
}

export class GameItemDto {
  @ApiProperty({ description: 'the game id' })
  id: string;

  @ApiProperty({ description: 'the game type' })
  type: string;

  @ApiProperty({ description: 'the game logo' })
  logo: string;

  @ApiProperty({ description: 'the game play flag' })
  @IsOptional()
  isPlayed?: boolean;

  @ApiProperty({ description: 'the game title' })
  title: string;

  @ApiProperty({ description: 'the game description' })
  description: string;

  @ApiProperty({ description: 'the game start date' })
  start: Date;

  @ApiProperty({ description: 'the game end date' })
  end: Date;

  @ApiProperty({ description: 'the game end flag' })
  is_ended: boolean;

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
}
