import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { TeamDto } from 'src/team/dtos/team.dto';

import { TokenEntity } from '../entities/token.entity';
import { CommonDto } from '../../common/dtos/common.dto';
import { PaginationDto } from '../../common/dtos/pagination.dto';

export class TokenDto extends CommonDto {
  @ApiProperty()
  team: TeamDto;

  @ApiProperty()
  symbol: string;

  @ApiProperty()
  logo: string;

  @ApiProperty()
  fanSaleFee: number;

  @ApiProperty()
  sponsorSaleFee: number;

  @ApiProperty()
  price: number;

  @ApiProperty()
  totalBalance: number;

  static toTokenDto(token: TokenEntity): TokenDto {
    return {
      id: token.id,
      createdAt: token.createdAt,
      updatedAt: token.updatedAt,
      team: token.team,
      symbol: token.symbol,
      logo: token.logo,
      fanSaleFee: token.fanSaleFee,
      sponsorSaleFee: token.sponsorSaleFee,
      price: token.price,
      totalBalance: token.totalBalance,
    };
  }
}

export class TokenRegisterDto {
  @ApiProperty()
  @IsUUID()
  teamId: string;

  @ApiProperty()
  @IsString()
  symbol: string;

  @ApiProperty()
  @IsString()
  logo: string;

  @ApiProperty()
  @IsNumber()
  fanSaleFee: number;

  @ApiProperty()
  @IsNumber()
  sponsorSaleFee: number;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  totalBalance: number;
}

export class TokenUpdateDto {
  @ApiProperty()
  @IsUUID()
  @IsOptional()
  teamId?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  symbol?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  logo?: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  fanSaleFee?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  sponsorSaleFee?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  totalBalance?: number;
}

export class TokenListDto extends PaginationDto {
  @ApiProperty({ description: 'the match list search', required: false })
  @IsString()
  @IsOptional()
  search?: string;
}
