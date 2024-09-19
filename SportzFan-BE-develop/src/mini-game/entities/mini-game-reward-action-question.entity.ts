import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { SoftDelete } from '../../common/core/soft-delete';
import { MiniGameRewardActionEntity } from './mini-game-reward-action.entity';
import { MiniGameRewardActionOptionEntity } from './mini-game-reward-action-option.entity';
import { MiniGameRewardActionQuestionDto } from '../dtos/mini-game-reward-action-question.dto';

@Entity('mini_game_reward_action_question')
export class MiniGameRewardActionQuestionEntity extends SoftDelete {
  @Column({ name: 'mini_game_reward_action_id' })
  miniGameRewardActionId: string;

  @ManyToOne(
    () => MiniGameRewardActionEntity,
    (rewardAction) => rewardAction.rewardActionQuestions,
  )
  @JoinColumn({ name: 'mini_game_reward_action_id' })
  miniGameRewardAction: MiniGameRewardActionEntity;

  @Column()
  question: string;

  @OneToMany(
    () => MiniGameRewardActionOptionEntity,
    (miniGameRewardActionOption) => miniGameRewardActionOption.question,
    { cascade: true },
  )
  options: MiniGameRewardActionOptionEntity[];

  toDto(): MiniGameRewardActionQuestionDto {
    return {
      ...super.toDto(),
      question: this.question,
      options: this.options.map((option) => option.toDto()),
    };
  }
}
