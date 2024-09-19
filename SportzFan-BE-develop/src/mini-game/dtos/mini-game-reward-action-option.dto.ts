import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { CommonDto } from '../../common/dtos/common.dto';

export class MiniGameRewardActionOptionDto extends CommonDto {
  @ApiProperty({ description: 'the option title' })
  @IsString()
  optionText: string;
}

export class MiniGameRewardActionOptionRegisterDto {
  @ApiProperty({ description: 'the option title' })
  @IsString()
  optionText: string;
}
