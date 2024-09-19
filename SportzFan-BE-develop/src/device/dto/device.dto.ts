import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

import { CommonDto } from '../../common/dtos/common.dto';
import { UserDto } from '../../user/dto/user.dto';
import { DeviceEntity } from '../entities/device.entity';
import { TeamDto } from 'src/team/dtos/team.dto';

export class DeviceDto extends CommonDto {
  @ApiProperty({ description: 'the team' })
  team: TeamDto;

  @ApiProperty({
    description: 'the project id',
  })
  @IsString()
  projectId: string;

  @ApiProperty({ description: 'the user' })
  user: UserDto;

  @ApiProperty({ description: 'the device token' })
  @IsString()
  token: string;

  static toDeviceDto(device: DeviceEntity): DeviceDto {
    return {
      id: device.id,
      createdAt: device.createdAt,
      updatedAt: device.updatedAt,
      team: device.team,
      projectId: device.projectId,
      user: device.user,
      token: device.token,
    };
  }
}

export class DeviceRegisterDto {
  @ApiProperty({
    description: 'the project id ',
  })
  @IsString()
  projectId: string;

  @ApiProperty({
    description: 'the device token',
  })
  @IsString()
  token: string;
}

export class DeviceDeleteByUserDto {
  @ApiProperty({ description: 'the user id' })
  @IsUUID()
  userId: string;
}
