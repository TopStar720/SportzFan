import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { SoftDelete } from '../../common/core/soft-delete';
import { SurveyOptionEntity } from './survey-option.entity';
import { SurveyQuestionDto } from '../dtos/survey-question.dto';
import { SurveyEntity } from './survey.entity';

@Entity('survey_question')
export class SurveyQuestionEntity extends SoftDelete {
  @Column({ name: 'survey_id' })
  surveyId: string;

  @Column()
  question: string;

  @ManyToOne(() => SurveyEntity, (survey) => survey.surveyQuestions)
  @JoinColumn({ name: 'survey_id' })
  survey: SurveyEntity;

  @OneToMany(
    () => SurveyOptionEntity,
    (surveyOption) => surveyOption.question,
    { cascade: true },
  )
  options: SurveyOptionEntity[];

  toDto(): SurveyQuestionDto {
    return {
      ...super.toDto(),
      question: this.question,
      options: this.options.map((option) => option.toDto()),
    };
  }
}
