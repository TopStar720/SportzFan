import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { SoftDelete } from '../../common/core/soft-delete';
import { UserEntity } from 'src/user/entities/user.entity';
import { MiniGameEntity } from './mini-game.entity';
import { MiniGamePlayerStatusDto } from '../dtos/mini-game-player-status.dto';

@Entity('mini_game_player_status')
export class MiniGamePlayerStatusEntity extends SoftDelete {
  @Column({ name: 'use_id' })
  userId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'mini_game_id' })
  miniGameId: string;

  @ManyToOne(() => MiniGameEntity)
  @JoinColumn({ name: 'mini_game_id' })
  miniGame: MiniGameEntity;

  @Column({ name: 'life_count' })
  lifeCount: number;

  @Column({ name: 'daily_best_score', default: 0 })
  dailyBestScore: number;

  @Column({ name: 'best_score', default: 0 })
  bestScore: number;

  @Column({ name: 'last_refresh_time' })
  lastRefreshTime: Date;

  toDto(): MiniGamePlayerStatusDto {
    return {
      ...super.toDto(),
      user: this.user,
      miniGame: this.miniGame,
      lifeCount: this.lifeCount,
      dailyBestScore: this.dailyBestScore,
      bestScore: this.bestScore,
      lastRefreshTime: this.lastRefreshTime,
    };
  }
}
