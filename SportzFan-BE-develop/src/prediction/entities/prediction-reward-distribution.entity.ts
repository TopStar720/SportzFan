import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';

import { SoftDelete } from '../../common/core/soft-delete';
import { PredictionEntity } from './prediction.entity';
import { PredictionRewardDistributionDto } from '../dtos/prediction-reward-distribution.dto';

@Entity('prediction_reward_distribution')
export class PredictionRewardDistributionEntity extends SoftDelete {
  @Column({ name: 'prediction_id', nullable: true })
  predictionId: string;

  @ManyToOne(() => PredictionEntity, (prediction) => prediction.rewardDistribution)
  @JoinColumn({ name: 'prediction_id' })
  prediction: PredictionEntity;

  @Column({ name: 'winner_order' })
  winnerOrder: number;

  @Column({ name: 'reward_kudos' })
  rewardKudos: number;

  @Column({ name: 'reward_token' })
  rewardToken: number;

  toDto(): PredictionRewardDistributionDto {
    return {
      ...super.toDto(),
      winnerOrder: this.winnerOrder,
      rewardKudos: this.rewardKudos,
      rewardToken: this.rewardToken,
    };
  }
}
