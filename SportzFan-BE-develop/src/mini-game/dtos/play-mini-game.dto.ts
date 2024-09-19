import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsUUID, IsArray } from 'class-validator';

import { UserDto } from 'src/user/dto/user.dto';
import { CommonDto } from '../../common/dtos/common.dto';
import { PlayMiniGameSurveyAnswerDto, PlayMiniGameSurveyAnswerRegisterDto } from './play-mini-game-survey-answer.dto';

export class PlayMiniGameDto extends CommonDto {
  @ApiProperty({ description: 'the user id' })
  user: UserDto;

  @ApiProperty({ description: 'the taken time for game' })
  @IsNumber()
  @IsOptional()
  playtime?: number;

  @ApiProperty({ description: 'the score' })
  score: number;

  @ApiProperty({ description: 'the rank' })
  rank: number;

  @ApiProperty({ description: 'the remaining lives' })
  @IsNumber()
  lifeCount: number;

  @ApiProperty()
  isSent: boolean;

  @ApiProperty()
  rewardToken: number;

  @ApiProperty()
  rewardKudos: number;

  @ApiProperty({
    description: 'the ansers',
    type: () => PlayMiniGameSurveyAnswerDto,
    isArray: true,
  })
  answer: PlayMiniGameSurveyAnswerDto[];
}

export class PlayMiniGameRegisterDto {
  @ApiProperty({ description: 'the user id' })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'time period(seconds) which a game player played',
  })
  @IsNumber()
  playtime: number;

  @ApiProperty({ description: 'score which a game player got' })
  @IsNumber()
  score: number;

  @ApiProperty({ description: 'the remaining lives' })
  @IsNumber()
  lifeCount: number;

  @ApiProperty({
    description: 'the answers',
    type: () => PlayMiniGameSurveyAnswerRegisterDto,
    isArray: true,
  })
  @IsArray()
  answer: PlayMiniGameSurveyAnswerRegisterDto[];
}

export class PlayMiniGameUpdateScoreRankDto {
  @IsUUID()
  playMiniGameId: string;

  @IsNumber()
  rank: number;

  @IsNumber()
  rewardKudos: number;

  @IsNumber()
  rewardToken: number;

  @IsNumber()
  isSent: boolean;
}
