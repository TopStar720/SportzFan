import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNumber, IsString } from 'class-validator';

import {
  MiniGameRewardActionQuestionDto,
  MiniGameRewardActionQuestionRegisterDto,
} from './mini-game-reward-action-question.dto';
import {
  MiniGameRewardActionRewardItemDto,
  MiniGameRewardActionRewardItemRegisterDto,
} from './mini-game-reward-action-reward-item.dto';
import { CommonDto } from '../../common/dtos/common.dto';
import { RewardActionType } from 'src/common/models/base';

export class MiniGameRewardActionDto extends CommonDto {
  @ApiProperty({ description: 'the reward action type' })
  @IsEnum(RewardActionType)
  type: RewardActionType;

  @ApiProperty({ description: 'the mini game reward action video url' })
  @IsString()
  videoUrl: string;

  @ApiProperty({
    description: 'the mini game reward action question list',
    type: () => MiniGameRewardActionQuestionDto,
    isArray: true,
  })
  @IsArray()
  rewardActionQuestions: MiniGameRewardActionQuestionDto[];

  @ApiProperty({
    description: 'the mini game reward action reward item list',
    type: () => MiniGameRewardActionRewardItemDto,
    isArray: true,
  })
  @IsArray()
  rewardActionRewardItems: MiniGameRewardActionRewardItemDto[];

  @ApiProperty({
    description: 'the mini game reward action maximum actions per day per user',
  })
  @IsNumber()
  maximumActionPerUserPerDay: number;
}

export class MiniGameRewardActionRegisterDto {
  @ApiProperty({ description: 'the reward action type' })
  @IsEnum(RewardActionType)
  type: RewardActionType;

  @ApiProperty({ description: 'the mini game reward action video url' })
  @IsString()
  videoUrl: string;

  @ApiProperty({
    description: 'the mini game reward action question list',
    type: () => MiniGameRewardActionQuestionRegisterDto,
    isArray: true,
  })
  @IsArray()
  rewardActionQuestions: MiniGameRewardActionQuestionRegisterDto[];

  @ApiProperty({
    description: 'the mini game reward action item reward list',
    type: () => MiniGameRewardActionRewardItemRegisterDto,
    isArray: true,
  })
  @IsArray()
  rewardActionRewardItems: MiniGameRewardActionRewardItemRegisterDto[];

  @ApiProperty({
    description: 'the mini game reward action maximum actions per day per user',
  })
  @IsNumber()
  maximumActionPerUserPerDay: number;
}
