import { Column, Entity, ManyToOne } from 'typeorm';

import { SoftDelete } from '../../common/core/soft-delete';
import { TriviaQuestionEntity } from './trivia-question.entity';
import { TriviaOptionDto } from '../dtos/trivia-option.dto';

@Entity('trivia_option')
export class TriviaOptionEntity extends SoftDelete {
  @Column()
  optionText: string;

  @Column()
  isCorrect: boolean;

  @ManyToOne(
    () => TriviaQuestionEntity,
    (triviaQuestion) => triviaQuestion.options,
  )
  question: TriviaQuestionEntity;

  toDto(): TriviaOptionDto {
    return {
      ...super.toDto(),
      optionText: this.optionText,
      isCorrect: this.isCorrect,
    };
  }
}
