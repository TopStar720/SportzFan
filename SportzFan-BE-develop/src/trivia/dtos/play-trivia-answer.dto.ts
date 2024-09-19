import { ApiProperty } from '@nestjs/swagger';
import { CommonDto } from '../../common/dtos/common.dto';
import { IsUUID } from 'class-validator';

export class PlayTriviaAnswerDto extends CommonDto {
  @ApiProperty()
  questionId: string;

  @ApiProperty()
  optionId: string;
}

export class PlayTriviaAnswerRegisterDto {
  @ApiProperty()
  @IsUUID()
  questionId: string;

  @ApiProperty()
  @IsUUID()
  optionId: string;
}
