import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsUUID } from 'class-validator';

import { UserDto } from 'src/user/dto/user.dto';
import { CommonDto } from '../../common/dtos/common.dto';
import { PlayTriviaAnswerDto, PlayTriviaAnswerRegisterDto, } from './play-trivia-answer.dto';

export class PlayTriviaDto extends CommonDto {
  @ApiProperty({ description: 'the user id' })
  user: UserDto;

  @ApiProperty({
    description: 'the answer',
    type: () => PlayTriviaAnswerDto,
    isArray: true,
  })
  answer: PlayTriviaAnswerDto[];

  @ApiProperty({ description: 'the taken time for game' })
  @IsNumber()
  @IsOptional()
  takenTime?: number;

  @ApiProperty({ description: 'the score' })
  score: number;

  @ApiProperty({ description: 'the rank' })
  rank: number;

  @ApiProperty()
  isSent: boolean;

  @ApiProperty()
  rewardToken: number;

  @ApiProperty()
  rewardKudos: number;
}

export class PlayTriviaRegisterDto {
  @ApiProperty({ description: 'the check-in id' })
  @IsUUID()
  triviaId: string;

  @ApiProperty({
    description: 'the answers',
    type: () => PlayTriviaAnswerRegisterDto,
    isArray: true,
  })
  @IsArray()
  answer: PlayTriviaAnswerRegisterDto[];

  @ApiProperty({ description: 'the time taken' })
  takenTime: number;
}

export class PlayTriviaUpdateScoreRankDto {
  @IsUUID()
  playTriviaId: string;

  @IsNumber()
  score: number;

  @IsNumber()
  rank: number;

  @IsNumber()
  rewardKudos: number;

  @IsNumber()
  rewardToken: number;

  @IsNumber()
  isSent: boolean;
}
