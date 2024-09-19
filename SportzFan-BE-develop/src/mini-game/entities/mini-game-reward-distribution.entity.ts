import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';

import { MiniGameEntity } from './mini-game.entity';
import { SoftDelete } from '../../common/core/soft-delete';
import { MiniGameRewardDistributionDto } from '../dtos/mini-game-reward-distribution.dto';

@Entity('mini_game_reward_distribution')
export class MiniGameRewardDistributionEntity extends SoftDelete {
  @Column({ name: 'mini_game_id', nullable: true })
  miniGameId: string;

  @ManyToOne(() => MiniGameEntity, (miniGame) => miniGame.rewardDistribution)
  @JoinColumn({ name: 'mini_game_id' })
  miniGame: MiniGameEntity;

  @Column({ name: 'winner_order' })
  winnerOrder: number;

  @Column({ name: 'reward_kudos' })
  rewardKudos: number;

  @Column({ name: 'reward_token' })
  rewardToken: number;

  toDto(): MiniGameRewardDistributionDto {
    return {
      ...super.toDto(),
      winnerOrder: this.winnerOrder,
      rewardKudos: this.rewardKudos,
      rewardToken: this.rewardToken,
    };
  }
}
