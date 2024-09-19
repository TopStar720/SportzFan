import { Column, Entity, ManyToOne, OneToMany, JoinColumn } from 'typeorm';

import { TriviaEntity } from './trivia.entity';
import { PlayTriviaDto } from '../dtos/play-trivia.dto';
import { SoftDelete } from '../../common/core/soft-delete';
import { UserEntity } from 'src/user/entities/user.entity';
import { PlayTriviaAnswerEntity } from './play-trivia-answer.entity';

@Entity('play_trivia')
export class PlayTriviaEntity extends SoftDelete {
  @Column({ name: 'trivia_id' })
  triviaId: string;

  @ManyToOne(() => TriviaEntity, (trivia) => trivia.playTrivia)
  @JoinColumn({ name: 'trivia_id' })
  trivia: TriviaEntity;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @OneToMany(() => PlayTriviaAnswerEntity, (answer) => answer.playTrivia, {
    cascade: true,
  })
  answer: PlayTriviaAnswerEntity[];

  @Column({ name: 'taken_time', default: 0 })
  takenTime: number;

  @Column({ nullable: true })
  rank: number;

  @Column({ nullable: true })
  score: number;

  @Column({ name: 'reward_token', default: null })
  rewardToken: number;

  @Column({ name: 'reward_kudos', default: null })
  rewardKudos: number;

  @Column({ name: 'is_sent', default: false })
  isSent: boolean;

  toDto(): PlayTriviaDto {
    return {
      ...super.toDto(),
      user: this.user.toUserDto(),
      takenTime: this.takenTime,
      rank: this.rank,
      score: this.score,
      isSent: this.isSent,
      rewardToken: this.rewardToken,
      rewardKudos: this.rewardKudos,
      answer: this.answer.map((item) => item.toDto()),
    };
  }
}
