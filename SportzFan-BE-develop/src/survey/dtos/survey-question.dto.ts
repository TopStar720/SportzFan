import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

import { CommonDto } from '../../common/dtos/common.dto';
import { SurveyOptionDto, SurveyOptionRegisterDto } from './survey-option.dto';

export class SurveyQuestionDto extends CommonDto {
  @ApiProperty({ description: 'the survey question' })
  @IsString()
  question: string;

  @ApiProperty({
    description: 'the survey question options',
    type: () => SurveyOptionDto,
    isArray: true,
  })
  @IsArray()
  options: SurveyOptionDto[];
}

export class SurveyQuestionRegisterDto {
  @ApiProperty({ description: 'the survey question' })
  @IsString()
  question: string;

  @ApiProperty({
    description: 'the survey question options',
    type: () => SurveyOptionRegisterDto,
    isArray: true,
  })
  @IsArray()
  options: SurveyOptionRegisterDto[];
}
