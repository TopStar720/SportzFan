import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { SoftDelete } from '../../common/core/soft-delete';
import { SurveyQuestionEntity } from './survey-question.entity';
import { SurveyOptionDto } from '../dtos/survey-option.dto';

@Entity('survey_option')
export class SurveyOptionEntity extends SoftDelete {
  @Column()
  optionText: string;

  @Column({ name: 'question_id' })
  questionId: string;

  @ManyToOne(
    () => SurveyQuestionEntity,
    (surveyQuestion) => surveyQuestion.options,
  )
  @JoinColumn({ name: 'question_id' })
  question: SurveyQuestionEntity;

  toDto(): SurveyOptionDto {
    return {
      ...super.toDto(),
      optionText: this.optionText,
    };
  }
}
