import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';

import { TriviaEntity } from './trivia.entity';
import { SoftDelete } from '../../common/core/soft-delete';
import { TriviaRewardDistributionDto } from '../dtos/trivia-reward-distribution.dto';

@Entity('trivia_reward_distribution')
export class TriviaRewardDistributionEntity extends SoftDelete {
  @Column({ name: 'trivia_id', nullable: true })
  triviaId: string;

  @ManyToOne(() => TriviaEntity, (trivia) => trivia.rewardDistribution)
  @JoinColumn({ name: 'trivia_id' })
  trivia: TriviaEntity;

  @Column({ name: 'winner_order' })
  winnerOrder: number;

  @Column({ name: 'reward_kudos' })
  rewardKudos: number;

  @Column({ name: 'reward_token' })
  rewardToken: number;

  toDto(): TriviaRewardDistributionDto {
    return {
      ...super.toDto(),
      winnerOrder: this.winnerOrder,
      rewardKudos: this.rewardKudos,
      rewardToken: this.rewardToken,
    };
  }
}
