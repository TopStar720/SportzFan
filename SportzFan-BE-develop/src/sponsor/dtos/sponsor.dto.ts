import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

import { CommonDto } from '../../common/dtos/common.dto';
import { SponsorEntity } from '../entities/sponsor.entity';
import { MatchFilter, SponsorCategory, SponsorFilter } from '../../common/models/base';
import { TeamDto } from 'src/team/dtos/team.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

export class SponsorDto extends CommonDto {
  @ApiProperty({ description: 'the match category' })
  category: SponsorCategory;

  @ApiProperty({ description: 'the team id' })
  team: TeamDto;

  @ApiProperty({ description: 'the sponsor title' })
  title: string;

  @ApiProperty({ description: 'the sponsor description' })
  description: string;

  @ApiProperty({ description: 'the logo url' })
  logo: string;

  static toSponsorDto(match: SponsorEntity): SponsorDto {
    return {
      id: match.id,
      createdAt: match.createdAt,
      updatedAt: match.updatedAt,
      category: match.category,
      team: match.team,
      title: match.title,
      description: match.description,
      logo: match.logo,
    };
  }
}

export class SponsorDetailResponseDto {
  @ApiProperty({ description: 'the title' })
  title: string;

  @ApiProperty({ description: 'the description' })
  description: string;

  @ApiProperty({ description: 'the sponsor using type' })
  type: string;

  @ApiProperty({ description: 'the game/challenge id' })
  id: string;

  @ApiProperty({ description: 'the sponsor id' })
  sponsorId: string;

  @ApiProperty({ description: 'the sponsor start date' })
  start: string;

  @ApiProperty({ description: 'the sponsor end date' })
  end: string;
}

export class SponsorStatisticResponseDto {
  @ApiProperty({ description: 'the sponsor using type' })
  type: string;

  @ApiProperty({ description: 'the number of using' })
  count: string;
}

export class SponsorRegisterDto {
  @ApiProperty({ description: 'the sponsor team id' })
  @IsUUID()
  teamId: string;

  @ApiProperty({ description: 'the sponsor category' })
  @IsEnum(SponsorCategory)
  category: SponsorCategory;

  @ApiProperty({ description: 'the sponsor title' })
  @IsString()
  @IsOptional()
  title: string;

  @ApiProperty({ description: 'the sponsor description' })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({ description: 'the logo url' })
  @IsString()
  @IsOptional()
  logo: string;
}

export class SponsorUpdateDto {
  @ApiProperty({ description: 'the sponsor team id' })
  @IsUUID()
  @IsOptional()
  teamId: string;

  @ApiProperty({ description: 'the sponsor category' })
  @IsEnum(SponsorCategory)
  @IsOptional()
  category: SponsorCategory;

  @ApiProperty({ description: 'the sponsor title' })
  @IsString()
  @IsOptional()
  @IsOptional()
  title: string;

  @ApiProperty({ description: 'the sponsor description' })
  @IsString()
  @IsOptional()
  @IsOptional()
  description: string;

  @ApiProperty({ description: 'the logo url' })
  @IsString()
  @IsOptional()
  logo: string;
}

export class SponsorGetDto extends PaginationDto {
  @ApiProperty({ description: 'the Sponsor list filter', required: false })
  @IsString()
  @IsOptional()
  search?: string;
}

export class SponsorDetailGetDto extends PaginationDto {
  @ApiProperty({ description: 'the sponsor detail list filter', required: false })
  @IsEnum(SponsorFilter)
  @IsOptional()
  filter: SponsorFilter;

  @ApiProperty({ description: 'the sponsor detail draft option (true/false)', required: false })
  @IsString()
  @IsOptional()
  isDraft?: string;
}

export class SponsorStatisticGetDto extends PaginationDto {
  @ApiProperty({ description: 'the sponsor statistic list filter', required: false })
  @IsEnum(SponsorFilter)
  @IsOptional()
  filter: SponsorFilter;

  @ApiProperty({ description: 'the sponsor statistic draft option (true/false)', required: false })
  @IsString()
  @IsOptional()
  isDraft?: string;

  @ApiProperty({ description: 'the sponsor statistic sponsor id', required: false })
  @IsString()
  @IsOptional()
  sponsorId?: string;
}
