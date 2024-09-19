import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

import { CommonDto } from '../../common/dtos/common.dto';
import { UserDto } from 'src/user/dto/user.dto';
import { MultiCheckInDto } from './multi-check-in.dto';
import { PlayMultiCheckInItemDto, PlayMultiCheckInItemRegisterDto, } from './play-multi-check-in-item.dto';

export class PlayMultiCheckInDto extends CommonDto {
  @ApiProperty({ description: 'the multi check-in id' })
  multiCheckIn: MultiCheckInDto;

  @ApiProperty({ description: 'the user id' })
  user: UserDto;

  @ApiProperty({
    type: () => PlayMultiCheckInItemDto,
    isArray: true,
  })
  items: PlayMultiCheckInItemDto[];
}

export class PlayMultiCheckInRegisterDto {
  @ApiProperty({ description: 'the multi check-in id' })
  @IsUUID()
  multiCheckInId: string;

  @ApiProperty({
    type: () => PlayMultiCheckInItemRegisterDto,
    isArray: false,
  })
  item: PlayMultiCheckInItemRegisterDto;
}
