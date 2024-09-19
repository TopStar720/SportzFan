import { UserEntity } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { PredictionEntity } from './prediction.entity';
import { SoftDelete } from '../../common/core/soft-delete';
import { PlayPredictionDto } from '../dtos/play-prediction.dto';

@Entity('play_prediction')
export class PlayPredictionEntity extends SoftDelete {
  @Column({ name: 'main_predict_score' })
  mainPredictScore: number;

  @Column({ name: 'opposition_predict_score' })
  oppositionPredictScore: number;

  @Column({ nullable: true })
  rank: number;

  @Column({ name: 'is_sent', nullable: true })
  isSent: boolean;

  @Column({ name: 'reward_token', nullable: true })
  rewardToken: number;

  @Column({ name: 'reward_kudos', nullable: true })
  rewardKudos: number;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'prediction_id' })
  predictionId: string;

  @ManyToOne(() => PredictionEntity, (prediction) => prediction.playPrediction)
  @JoinColumn({ name: 'prediction_id' })
  prediction: PredictionEntity;

  toDto(): PlayPredictionDto {
    return {
      ...super.toDto(),
      mainPredictScore: this.mainPredictScore,
      oppositionPredictScore: this.oppositionPredictScore,
      rank: this.rank,
      isSent: this.isSent,
      rewardToken: this.rewardToken,
      rewardKudos: this.rewardKudos,
      user: this.user.toUserDto(),
    };
  }
}
