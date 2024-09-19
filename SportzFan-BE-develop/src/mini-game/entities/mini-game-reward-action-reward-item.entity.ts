import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';

import { SoftDelete } from '../../common/core/soft-delete';
import { RewardActionRewardItemType } from 'src/common/models/base';
import { MiniGameRewardActionRewardItemDto } from '../dtos/mini-game-reward-action-reward-item.dto';
import { MiniGameRewardActionEntity } from './mini-game-reward-action.entity';

@Entity('mini_game_reward_action_reward_item')
export class MiniGameRewardActionRewardItemEntity extends SoftDelete {
  @Column({ name: 'mini_game_reward_action_id' })
  miniGameRewardActionId: string;

  @ManyToOne(
    () => MiniGameRewardActionEntity,
    (rewardAction) => rewardAction.rewardActionRewardItems,
  )
  @JoinColumn({ name: 'mini_game_reward_action_id' })
  miniGameRewardAction: MiniGameRewardActionEntity;

  @Column({ default: RewardActionRewardItemType.InGameCoins })
  type: RewardActionRewardItemType;

  @Column()
  count: number;

  toDto(): MiniGameRewardActionRewardItemDto {
    return {
      ...super.toDto(),
      type: this.type,
      count: this.count,
    };
  }
}
