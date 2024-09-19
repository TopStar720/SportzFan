import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsUUID } from 'class-validator';

import { UserDto } from 'src/user/dto/user.dto';
import { CommonDto } from '../../common/dtos/common.dto';

export class PlayPredictionDto extends CommonDto {
  @ApiProperty({ description: 'the main team predict score' })
  @IsNumber()
  mainPredictScore: number;

  @ApiProperty({ description: 'the opposition team predict score' })
  @IsNumber()
  oppositionPredictScore: number;

  @ApiProperty({ description: 'the user id' })
  user: UserDto;

  @ApiProperty({ description: 'the prediction rank' })
  @IsNumber()
  rank: number;

  @ApiProperty({ description: 'the flag if reward is sent or not' })
  @IsBoolean()
  isSent: boolean;

  @ApiProperty({ description: 'the reward token amount' })
  @IsNumber()
  rewardToken: number;

  @ApiProperty({ description: 'the reward Kudos amount' })
  @IsNumber()
  rewardKudos: number;
}

export class PlayPredictionRegisterDto {
  @ApiProperty({ description: 'the prediction id' })
  @IsUUID()
  predictionId: string;

  @ApiProperty({ description: 'the main team predict score' })
  @IsNumber()
  mainPredictScore: number;

  @ApiProperty({ description: 'the opposition team predict score' })
  @IsNumber()
  oppositionPredictScore: number;
}

export class PlayPredictionUpdateDto {
  @ApiProperty({ description: 'the prediction id' })
  @IsUUID()
  playPredictionId: string;

  @ApiProperty({ description: 'the prediction rank' })
  @IsNumber()
  rank: number;

  @ApiProperty({ description: 'the flag if reward is sent or not' })
  @IsBoolean()
  isSent: boolean;

  @ApiProperty({ description: 'the reward token amount' })
  @IsNumber()
  rewardToken: number;

  @ApiProperty({ description: 'the reward Kudos amount' })
  @IsNumber()
  rewardKudos: number;
}
