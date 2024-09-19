import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsUUID } from 'class-validator';

import { SurveyDto } from './survey.dto';
import { UserDto } from 'src/user/dto/user.dto';
import { CommonDto } from '../../common/dtos/common.dto';
import { PlaySurveyAnswerDto, PlaySurveyAnswerRegisterDto, } from './play-survey-answer.dto';

export class PlaySurveyDto extends CommonDto {
  @ApiProperty({ description: 'the check-in id' })
  survey: SurveyDto;

  @ApiProperty({ description: 'the user id' })
  user: UserDto;

  @ApiProperty({
    description: 'the ansers',
    type: () => PlaySurveyAnswerDto,
    isArray: true,
  })
  answer: PlaySurveyAnswerDto[];
}

export class PlaySurveyRegisterDto {
  @ApiProperty({ description: 'the survey id' })
  @IsUUID()
  surveyId: string;

  @ApiProperty({
    description: 'the answers',
    type: () => PlaySurveyAnswerRegisterDto,
    isArray: true,
  })
  @IsArray()
  answer: PlaySurveyAnswerRegisterDto[];
}
