import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { TriviaEntity } from './trivia.entity';
import { SoftDelete } from '../../common/core/soft-delete';
import { TriviaOptionEntity } from './trivia-option.entity';
import { TriviaQuestionDto } from '../dtos/trivia-question.dto';

@Entity('trivia_question')
export class TriviaQuestionEntity extends SoftDelete {
  @Column()
  question: string;

  @ManyToOne(() => TriviaEntity, (trivia) => trivia.triviaQuestions)
  trivia: TriviaEntity;

  @OneToMany(
    () => TriviaOptionEntity,
    (triviaOption) => triviaOption.question,
    { cascade: true },
  )
  options: TriviaOptionEntity[];

  toDto(): TriviaQuestionDto {
    return {
      ...super.toDto(),
      question: this.question,
      options: this.options.map((option) => option.toDto()),
    };
  }
}
