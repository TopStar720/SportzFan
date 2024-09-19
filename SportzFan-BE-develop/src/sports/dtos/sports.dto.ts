import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { SportsEntity } from '../entities/sports.entity';
import { CommonDto } from '../../common/dtos/common.dto';
import { PaginationDto } from '../../common/dtos/pagination.dto';

export class SportsDto extends CommonDto {
  @ApiProperty()
  name: string;

  static toSportsDto(sports: SportsEntity): SportsDto {
    return {
      id: sports.id,
      createdAt: sports.createdAt,
      updatedAt: sports.updatedAt,
      name: sports.name,
    };
  }
}

export class SportsRegisterDto {
  @ApiProperty()
  @IsString()
  name: string;
}

export class SportsUpdateDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name?: string;
}

export class SportsListDto extends PaginationDto {
  @ApiProperty({ description: 'the sports list search', required: false })
  @IsString()
  @IsOptional()
  search?: string;
}
