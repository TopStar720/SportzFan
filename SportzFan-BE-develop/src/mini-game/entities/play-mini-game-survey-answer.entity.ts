import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { SoftDelete } from '../../common/core/soft-delete';
import { PlayMiniGameSurveyAnswerDto } from '../dtos/play-mini-game-survey-answer.dto';
import { PlayMiniGameEntity } from './play-mini-game.entity';

@Entity('play_mini_game_survey_answer')
export class PlayMiniGameSurveyAnswerEntity extends SoftDelete {
  @Column({ name: 'reward_action_id', type: 'uuid' })
  rewardActionId: string;

  @Column({ name: 'question_id', type: 'uuid' })
  questionId: string;

  @Column({ name: 'option_id', type: 'uuid', nullable: true })
  optionId: string;

  @Column({ name: 'play_mini_game_id' })
  playMiniGameId: string;

  @ManyToOne(() => PlayMiniGameEntity, (playMiniGame) => playMiniGame.answer)
  @JoinColumn({ name: 'play_mini_game_id' })
  playMiniGame: PlayMiniGameEntity;

  toDto(): PlayMiniGameSurveyAnswerDto {
    return {
      ...super.toDto(),
      rewardActionId: this.rewardActionId,
      questionId: this.questionId,
      optionId: this.optionId,
    };
  }
}
