import { Column, Entity, JoinColumn, ManyToOne, OneToMany, } from 'typeorm';

import { SoftDelete } from '../../common/core/soft-delete';
import { PlaySurveyDto } from '../dtos/play-survey.dto';
import { PlaySurveyAnswerEntity } from './play-survey-answer.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { SurveyEntity } from './survey.entity';

@Entity('play_survey')
export class PlaySurveyEntity extends SoftDelete {
  @Column({ name: 'survey_id' })
  surveyId: string;

  @ManyToOne(() => SurveyEntity, (survey) => survey.playSurvey)
  @JoinColumn({ name: 'survey_id' })
  survey: SurveyEntity;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @OneToMany(() => PlaySurveyAnswerEntity, (answer) => answer.playSurvey, {
    cascade: true,
  })
  answer: PlaySurveyAnswerEntity[];

  toDto(): PlaySurveyDto {
    return {
      ...super.toDto(),
      survey: this.survey.toDto(),
      user: this.user.toUserDto(),
      answer: this.answer,
    };
  }
}
