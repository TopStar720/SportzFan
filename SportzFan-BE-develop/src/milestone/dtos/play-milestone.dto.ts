import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString, IsUUID } from 'class-validator';
import { UserDto } from 'src/user/dto/user.dto';

import { CommonDto } from '../../common/dtos/common.dto';
import { MilestoneDto } from './milestone.dto';

export class PlayMilestoneDto extends CommonDto {
  @ApiProperty({ description: 'the user' })
  user: UserDto;

  @ApiProperty({ description: 'the milestone' })
  milestone: MilestoneDto;

  @ApiProperty({ description: 'the check in flag' })
  @IsBoolean()
  checkInFlag: boolean;

  @ApiProperty({ description: 'the balance flag' })
  @IsBoolean()
  balanceFlag: boolean;

  @ApiProperty({ description: 'the occur count' })
  @IsNumber()
  occurCount: number;
}

export class PlayMilestoneRegisterDto {
  @ApiProperty({description: 'the milestone id'})
  @IsUUID()
  milestoneId: string;
}

export class PlayMilestoneCheckDto {
  @ApiProperty({ description: 'user location coordinate' })
  @IsString()
  userCoordinates: string;
}
