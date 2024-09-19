import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString, IsUUID } from 'class-validator';

import { CommonDto } from '../../common/dtos/common.dto';
import { UserDto } from 'src/user/dto/user.dto';
import { CheckInDto } from './check-in.dto';

export class PlayCheckInDto extends CommonDto {
  @ApiProperty({ description: 'the check-in id' })
  checkIn: CheckInDto;

  @ApiProperty({ description: 'the user id' })
  user: UserDto;

  @ApiProperty({ description: 'user is inside or outside the stadium' })
  @IsNumber()
  location: number;

  @ApiProperty({ description: 'user location coordinate' })
  @IsString()
  userCoordinates: string;

  @ApiProperty({ description: 'receive bonus asset flag' })
  @IsBoolean()
  receiveBonus: boolean;
}

export class PlayCheckInRegisterDto {
  @ApiProperty({ description: 'the check-in id' })
  @IsUUID()
  checkInId: string;

  @ApiProperty({ description: 'user is inside or outside the stadium' })
  @IsNumber()
  location: number;

  @ApiProperty({ description: 'user location coordinate' })
  @IsString()
  userCoordinates: string;
}

export class DistanceCalculatorDto {
  @ApiProperty()
  @IsNumber()
  lat1: number;

  @ApiProperty()
  @IsNumber()
  lng1: number;

  @ApiProperty()
  @IsNumber()
  lat2: number;

  @ApiProperty()
  @IsNumber()
  lng2: number;
}
