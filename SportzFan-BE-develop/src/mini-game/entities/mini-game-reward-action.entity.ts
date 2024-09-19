import { Column, Entity, ManyToOne, OneToMany, JoinColumn } from 'typeorm';

import { MiniGameEntity } from './mini-game.entity';
import { SoftDelete } from '../../common/core/soft-delete';
import { RewardActionType } from 'src/common/models/base';
import { MiniGameRewardActionQuestionEntity } from './mini-game-reward-action-question.entity';
import { MiniGameRewardActionDto } from '../dtos/mini-game-reward-action.dto';
import { MiniGameRewardActionRewardItemEntity } from './mini-game-reward-action-reward-item.entity';

@Entity('mini_game_reward_action')
export class MiniGameRewardActionEntity extends SoftDelete {
  @Column({ name: 'mini_game_id', nullable: true })
  miniGameId: string;

  @ManyToOne(() => MiniGameEntity, (miniGame) => miniGame.rewardAction)
  @JoinColumn({ name: 'mini_game_id' })
  miniGame: MiniGameEntity;

  @Column({ default: RewardActionType.WatchVideo })
  type: RewardActionType;

  @OneToMany(
    () => MiniGameRewardActionQuestionEntity,
    (rewardActionQuestions) => rewardActionQuestions.miniGameRewardAction,
    { cascade: true },
  )
  rewardActionQuestions: MiniGameRewardActionQuestionEntity[];

  @Column({ name: 'video_url' })
  videoUrl: string;

  @OneToMany(
    () => MiniGameRewardActionRewardItemEntity,
    (rewardActionRewardItems) => rewardActionRewardItems.miniGameRewardAction,
    { cascade: true },
  )
  rewardActionRewardItems: MiniGameRewardActionRewardItemEntity[];

  @Column({ name: 'maximum_action_per_user_per_day' })
  maximumActionPerUserPerDay: number;

  toDto(): MiniGameRewardActionDto {
    return {
      ...super.toDto(),
      type: this.type,
      rewardActionQuestions: this.rewardActionQuestions.map((item) =>
        item.toDto(),
      ),
      videoUrl: this.videoUrl,
      rewardActionRewardItems: this.rewardActionRewardItems.map((item) =>
        item.toDto(),
      ),
      maximumActionPerUserPerDay: this.maximumActionPerUserPerDay,
    };
  }
}
