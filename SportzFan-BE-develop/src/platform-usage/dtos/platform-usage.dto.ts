import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, } from 'class-validator';

import { PlatformUsageEntity } from '../entities/platform-usage.entity';
import { CommonDto } from '../../common/dtos/common.dto';
import { UserDto } from '../../user/dto/user.dto';

export class PlatformUsageDto extends CommonDto {
  @ApiProperty({ description: 'the user' })
  user: UserDto;

  @ApiProperty({ description: 'the total login count' })
  totalLoginCount: number;

  @ApiProperty({ description: 'the last month login count' })
  lastMonthLoginCount: number;

  @ApiProperty({ description: 'the total usage minutes' })
  totalUsageMinutes: number;

  @ApiProperty({ description: 'the last month usage minutes' })
  lastMonthUsageMinutes: number;

  @ApiProperty({ description: 'the last login date' })
  lastLoginAt: string;

  static toPlatformUsageDto(obj: PlatformUsageEntity): PlatformUsageDto {
    return {
      id: obj.id,
      createdAt: obj.createdAt,
      updatedAt: obj.updatedAt,
      user: obj.user,
      totalLoginCount: obj.totalLoginCount,
      lastMonthLoginCount: obj.lastMonthLoginCount,
      totalUsageMinutes: obj.totalUsageMinutes,
      lastMonthUsageMinutes: obj.lastMonthUsageMinutes,
      lastLoginAt: obj.lastLoginAt,
    };
  }
}

export class PlatformUsageRegisterDto {
  @ApiProperty({ description: 'the user id' })
  @IsUUID()
  userId: string;
}