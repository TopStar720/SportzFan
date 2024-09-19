import { Column, Entity, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

import { MiniGameEntity } from './mini-game.entity';
import { PlayMiniGameDto } from '../dtos/play-mini-game.dto';
import { SoftDelete } from '../../common/core/soft-delete';
import { UserEntity } from 'src/user/entities/user.entity';
import { PlayMiniGameSurveyAnswerEntity } from './play-mini-game-survey-answer.entity';

@Entity('play_mini_game')
export class PlayMiniGameEntity extends SoftDelete {
  @Column({ name: 'mini_game_id' })
  miniGameId: string;

  @ManyToOne(() => MiniGameEntity, (miniGame) => miniGame.playMiniGame)
  @JoinColumn({ name: 'mini_game_id' })
  miniGame: MiniGameEntity;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'play_time', default: 0 })
  playtime: number;

  @Column({ nullable: true })
  rank: number;

  @Column({ name: 'life_count', default: 0 })
  lifeCount: number;

  @Column({ nullable: true })
  score: number;

  @Column({ name: 'reward_token', default: null })
  rewardToken: number;

  @Column({ name: 'reward_kudos', default: null })
  rewardKudos: number;

  @Column({ name: 'is_sent', default: false })
  isSent: boolean;

  @Column({ name: 'is_highest', nullable: true })
  isHighest: number;

  @OneToMany(() => PlayMiniGameSurveyAnswerEntity, (answer) => answer.playMiniGame, {
    cascade: true,
  })
  answer: PlayMiniGameSurveyAnswerEntity[];

  toDto(): PlayMiniGameDto {
    return {
      ...super.toDto(),
      user: this.user.toUserDto(),
      playtime: this.playtime,
      rank: this.rank,
      lifeCount: this.lifeCount,
      score: this.score,
      isSent: this.isSent,
      rewardToken: this.rewardToken,
      rewardKudos: this.rewardKudos,
      answer: this.answer.map(item => item.toDto()),
    };
  }
}
