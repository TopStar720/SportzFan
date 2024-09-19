import { ApiProperty } from '@nestjs/swagger';
import { CommonDto } from '../../common/dtos/common.dto';
import { IsString, IsUUID } from 'class-validator';

export class PlaySurveyAnswerDto extends CommonDto {
  @ApiProperty()
  freeText: string;

  @ApiProperty()
  questionId: string;

  @ApiProperty()
  optionId: string;
}

export class PlaySurveyAnswerRegisterDto {
  @ApiProperty()
  @IsString()
  freeText: string;

  @ApiProperty()
  @IsUUID()
  questionId: string;

  @ApiProperty()
  @IsUUID()
  optionId: string;
}
