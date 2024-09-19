import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

import { CommonDto } from '../../common/dtos/common.dto';
import { TriviaOptionDto, TriviaOptionRegisterDto } from './trivia-option.dto';

export class TriviaQuestionDto extends CommonDto {
  @ApiProperty({ description: 'the trivia question' })
  @IsString()
  question: string;

  @ApiProperty({
    description: 'the trivia question options',
    type: () => TriviaOptionDto,
    isArray: true,
  })
  @IsArray()
  options: TriviaOptionDto[];
}

export class TriviaQuestionRegisterDto {
  @ApiProperty({ description: 'the trivia question' })
  @IsString()
  question: string;

  @ApiProperty({
    description: 'the trivia question options',
    type: () => TriviaOptionRegisterDto,
    isArray: true,
  })
  @IsArray()
  options: TriviaOptionRegisterDto[];
}
