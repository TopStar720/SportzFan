import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

import { CommonDto } from '../../common/dtos/common.dto';

export class TriviaRewardDistributionDto extends CommonDto {
  @ApiProperty({ description: 'the winner order' })
  @IsNumber()
  winnerOrder: number;

  @ApiProperty({ description: 'the reward no of kudos for winner' })
  @IsNumber()
  rewardKudos: number;

  @ApiProperty({ description: 'the reward no of token for winner' })
  @IsNumber()
  rewardToken: number;
}

export class TriviaRewardDistributionRegisterDto {
  @ApiProperty({ description: 'the winner order' })
  @IsNumber()
  winnerOrder: number;

  @ApiProperty({ description: 'the reward no of kudos for winner' })
  @IsNumber()
  rewardKudos: number;

  @ApiProperty({ description: 'the reward no of token for winner' })
  @IsNumber()
  rewardToken: number;
}
