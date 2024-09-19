import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { SoftDelete } from '../../common/core/soft-delete';
import { PlayTriviaAnswerDto } from '../dtos/play-trivia-answer.dto';
import { PlayTriviaEntity } from './play-trivia.entity';
import { TriviaOptionEntity } from './trivia-option.entity';
import { TriviaQuestionEntity } from './trivia-question.entity';

@Entity('play_trivia_answer')
export class PlayTriviaAnswerEntity extends SoftDelete {
  @Column()
  questionId: string;

  @Column()
  optionId: string;

  @ManyToOne(() => PlayTriviaEntity, (playTrivia) => playTrivia.answer)
  playTrivia: PlayTriviaEntity;

  @ManyToOne(() => TriviaOptionEntity)
  option: TriviaOptionEntity;

  @ManyToOne(() => TriviaQuestionEntity)
  @JoinColumn({ name: 'questionId' })
  question: TriviaQuestionEntity;

  toDto(): PlayTriviaAnswerDto {
    return {
      ...super.toDto(),
      questionId: this.questionId,
      optionId: this.optionId,
    };
  }
}
