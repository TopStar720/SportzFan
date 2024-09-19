import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { SoftDelete } from '../../common/core/soft-delete';
import { MiniGameRewardActionOptionDto } from '../dtos/mini-game-reward-action-option.dto';
import { MiniGameRewardActionQuestionEntity } from './mini-game-reward-action-question.entity';

@Entity('mini_game_reward_action_option')
export class MiniGameRewardActionOptionEntity extends SoftDelete {
  @Column()
  optionText: string;

  @Column({ name: 'question_id' })
  questionId: string;

  @ManyToOne(
    () => MiniGameRewardActionQuestionEntity,
    (miniGameRewardActionQuestion) => miniGameRewardActionQuestion.options,
  )
  @JoinColumn({ name: 'question_id' })
  question: MiniGameRewardActionQuestionEntity;

  toDto(): MiniGameRewardActionOptionDto {
    return {
      ...super.toDto(),
      optionText: this.optionText,
    };
  }
}
