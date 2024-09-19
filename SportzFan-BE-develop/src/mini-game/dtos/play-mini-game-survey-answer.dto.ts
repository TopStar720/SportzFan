import { ApiProperty } from '@nestjs/swagger';
import { CommonDto } from '../../common/dtos/common.dto';
import { IsUUID } from 'class-validator';

export class PlayMiniGameSurveyAnswerDto extends CommonDto {
  @ApiProperty()
  rewardActionId: string;
  
  @ApiProperty()
  questionId: string;

  @ApiProperty()
  optionId: string;
}

export class PlayMiniGameSurveyAnswerRegisterDto {
  @ApiProperty()
  @IsUUID()
  rewardActionId: string;

  @ApiProperty()
  @IsUUID()
  questionId: string;

  @ApiProperty()
  @IsUUID()
  optionId: string;
}
