import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber } from 'class-validator';

import { CommonDto } from '../../common/dtos/common.dto';
import { RewardActionRewardItemType } from 'src/common/models/base';

export class MiniGameRewardActionRewardItemDto extends CommonDto {
  @ApiProperty({ description: 'the mini game reward action reward item type' })
  @IsEnum(RewardActionRewardItemType)
  type: RewardActionRewardItemType;

  @ApiProperty({ description: 'the mini game reward action reward item count' })
  @IsNumber()
  count: number;
}

export class MiniGameRewardActionRewardItemRegisterDto {
  @ApiProperty({ description: 'the mini game reward action reward item type' })
  @IsEnum(RewardActionRewardItemType)
  type: RewardActionRewardItemType;

  @ApiProperty({ description: 'the mini game reward action reward item count' })
  @IsNumber()
  count: number;
}
