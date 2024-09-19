import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { CommonDto } from '../../common/dtos/common.dto';

export class SurveyOptionDto extends CommonDto {
  @ApiProperty({ description: 'the option title' })
  @IsString()
  optionText: string;
}

export class SurveyOptionRegisterDto {
  @ApiProperty({ description: 'the option title' })
  @IsString()
  optionText: string;
}
