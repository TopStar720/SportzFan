import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';

import {
  MarketplaceItemSubType,
  MarketplaceItemType,
} from 'src/common/models/base';
import { MiniGameEntity } from './mini-game.entity';
import { SoftDelete } from '../../common/core/soft-delete';
import { MiniGameRewardMarketplaceItemDto } from '../dtos/mini-game-reward-marketplace-item.dto';

@Entity('mini_game_reward_marketplace_item')
export class MiniGameRewardMarketplaceItemEntity extends SoftDelete {
  @Column({ name: 'mini_game_id', nullable: true })
  miniGameId: string;

  @ManyToOne(() => MiniGameEntity, (miniGame) => miniGame.rewardMarketplaceItem)
  @JoinColumn({ name: 'mini_game_id' })
  miniGame: MiniGameEntity;

  @Column({ default: MarketplaceItemType.Team })
  type: MarketplaceItemType;

  @Column({ name: 'sub_type', default: MarketplaceItemSubType.Tokens })
  subType: MarketplaceItemSubType;

  @Column({ default: '' })
  description: string;

  @Column({ name: 'item_count' })
  itemCount: number;

  @Column({ name: 'item_cost' })
  itemCost: number;

  toDto(): MiniGameRewardMarketplaceItemDto {
    return {
      ...super.toDto(),
      type: this.type,
      subType: this.subType,
      description: this.description,
      itemCount: this.itemCount,
      itemCost: this.itemCost,
    };
  }
}
