import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

import { CommonDto } from '../../common/dtos/common.dto';

export class PlayMultiCheckInItemDto extends CommonDto {
  @ApiProperty({ description: 'user is inside or outside the stadium' })
  @IsNumber()
  location: number;

  @ApiProperty({ description: 'user location coordinate' })
  @IsString()
  userCoordinates: string;
}

export class PlayMultiCheckInItemRegisterDto {
  @ApiProperty({ description: 'user is inside or outside the stadium' })
  @IsNumber()
  location: number;

  @ApiProperty({ description: 'user location coordinate' })
  @IsString()
  userCoordinates: string;
}
