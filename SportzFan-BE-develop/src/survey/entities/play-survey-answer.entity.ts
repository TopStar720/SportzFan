import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { SoftDelete } from '../../common/core/soft-delete';
import { PlaySurveyAnswerDto } from '../dtos/play-survey-answer.dto';
import { PlaySurveyEntity } from './play-survey.entity';

@Entity('play_survey_answer')
export class PlaySurveyAnswerEntity extends SoftDelete {
  @Column({ name: 'question_id', type: 'uuid' })
  questionId: string;

  @Column({ name: 'option_id', type: 'uuid', nullable: true })
  optionId: string;

  @Column({ name: 'free_text', nullable: true })
  freeText: string;

  @Column({ name: 'play_survey_id' })
  playSurveyId: string;

  @ManyToOne(() => PlaySurveyEntity, (playSurvey) => playSurvey.answer)
  @JoinColumn({ name: 'play_survey_id' })
  playSurvey: PlaySurveyEntity;

  toDto(): PlaySurveyAnswerDto {
    return {
      ...super.toDto(),
      questionId: this.questionId,
      optionId: this.optionId,
      freeText: this.freeText,
    };
  }
}
