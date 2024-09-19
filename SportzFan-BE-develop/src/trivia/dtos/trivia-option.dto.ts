import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

import { CommonDto } from '../../common/dtos/common.dto';

export class TriviaOptionDto extends CommonDto {
  @ApiProperty({ description: 'the option title' })
  @IsString()
  optionText: string;

  @ApiProperty()
  @IsBoolean()
  isCorrect: boolean;
}

export class TriviaOptionRegisterDto {
  @ApiProperty({ description: 'the option title' })
  @IsString()
  optionText: string;

  @ApiProperty()
  @IsBoolean()
  isCorrect: boolean;
}
