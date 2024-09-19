import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

import { TeamDto } from 'src/team/dtos/team.dto';
import { PollDto } from '../../poll/dtos/poll.dto';
import { GameItemDto } from '../../game/dtos/game.dto';
import { MatchEntity } from '../entities/match.entity';
import { CommonDto } from '../../common/dtos/common.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { PaginatorDto } from '../../common/dtos/paginator.dto';
import {
  DirectionFilter,
  MatchFilter,
  MatchType,
  SortFilter,
} from '../../common/models/base';
import { ChallengeItemDto } from '../../challenge/dtos/challenge.dto';

export class MatchDto extends CommonDto {
  @ApiProperty({ description: 'the match title' })
  title: string;

  @ApiProperty({ description: 'the match type' })
  type: MatchType;

  @ApiProperty({ description: 'the team' })
  team: TeamDto;

  @ApiProperty({ description: 'the home team' })
  homeTeam: TeamDto;

  @ApiProperty({ description: 'the match team' })
  awayTeam: TeamDto;

  @ApiProperty({ description: 'the venue title' })
  venueTitle: string;

  @ApiProperty({ description: 'the venue address' })
  venueAddress: string;

  @ApiProperty({ description: 'the venue google coordinates' })
  venueGoogleCoordinates: string;

  @ApiProperty({ description: 'the match start date' })
  start: Date;

  @ApiProperty({ description: 'the match expiration date' })
  end: Date;

  @ApiProperty()
  isDraft: boolean;

  static toMatchDto(match: MatchEntity): MatchDto {
    return {
      id: match.id,
      createdAt: match.createdAt,
      updatedAt: match.updatedAt,
      title: match.title,
      type: match.type,
      team: match.team,
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      venueTitle: match.venueTitle,
      venueAddress: match.venueAddress,
      venueGoogleCoordinates: match.venueGoogleCoordinates,
      start: match.start,
      end: match.end,
      isDraft: match.isDraft,
    };
  }
}

export class MatchRegisterDto {
  @ApiProperty({ description: 'the match title' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'the match type' })
  @IsEnum(MatchType)
  type: MatchType;

  @ApiProperty({ description: 'the team' })
  @IsUUID()
  teamId: string;

  @ApiProperty({ description: 'the home team' })
  @IsUUID()
  homeTeamId: string;

  @ApiProperty({ description: 'the match team' })
  @IsUUID()
  awayTeamId: string;

  @ApiProperty({ description: 'the venue title' })
  @IsString()
  venueTitle: string;

  @ApiProperty({ description: 'the venue address' })
  @IsString()
  venueAddress: string;

  @ApiProperty({ description: 'the venue google coordinates' })
  @IsString()
  venueGoogleCoordinates: string;

  @ApiProperty({ description: 'the match start date' })
  @IsDateString()
  start: Date;

  @ApiProperty({ description: 'the match expiration date' })
  @IsDateString()
  end: Date;

  @ApiProperty()
  isDraft: boolean;
}

export class MatchDetailQueryDto {
  @ApiProperty({ description: 'the match' })
  match: MatchDto;

  @ApiProperty({ description: 'the game list' })
  games: PaginatorDto<GameItemDto>;

  @ApiProperty({ description: 'the challenge list' })
  challenges: PaginatorDto<ChallengeItemDto>;

  @ApiProperty({ description: 'the poll list' })
  polls: PaginatorDto<PollDto>;
}

export class MatchUpdateDto {
  @ApiProperty({ description: 'the match title' })
  @IsString()
  @IsOptional()
  title: string;

  @ApiProperty({ description: 'the match type' })
  @IsEnum(MatchType)
  @IsOptional()
  type: MatchType;

  @ApiProperty({ description: 'the team' })
  @IsUUID()
  @IsOptional()
  teamId: string;

  @ApiProperty({ description: 'the home team' })
  @IsUUID()
  @IsOptional()
  homeTeamId: string;

  @ApiProperty({ description: 'the match team' })
  @IsUUID()
  @IsOptional()
  awayTeamId: string;

  @ApiProperty({ description: 'the venue title' })
  @IsString()
  @IsOptional()
  venueTitle: string;

  @ApiProperty({ description: 'the venue address' })
  @IsString()
  @IsOptional()
  venueAddress: string;

  @ApiProperty({ description: 'the venue google coordinates' })
  @IsString()
  @IsOptional()
  venueGoogleCoordinates: string;

  @ApiProperty({ description: 'the match start date' })
  @IsDateString()
  @IsOptional()
  start: Date;

  @ApiProperty({ description: 'the match expiration date' })
  @IsDateString()
  @IsOptional()
  end: Date;

  @ApiProperty()
  @IsBoolean()
  isDraft: boolean;
}

export class MatchGetDto extends PaginationDto {
  @ApiProperty({ description: 'the match search', required: false })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({ description: 'the match list filter', required: false })
  @IsEnum(MatchFilter)
  @IsOptional()
  filter: MatchFilter;

  @ApiProperty({ description: 'the match sort filter', required: false })
  @IsEnum(SortFilter)
  @IsOptional()
  sort: SortFilter;

  @ApiProperty({ description: 'the match sort direction', required: false })
  @IsEnum(DirectionFilter)
  @IsOptional()
  direction: DirectionFilter;
}

export class MatchDetailGetDto {
  @ApiProperty({ description: 'the game flag', required: false })
  @IsString()
  @IsOptional()
  showGame?: string;

  @ApiProperty({ description: 'the challenge flag', required: false })
  @IsString()
  @IsOptional()
  showChallenge?: string;

  @ApiProperty({ description: 'the poll flag', required: false })
  @IsString()
  @IsOptional()
  showPoll?: string;
}
