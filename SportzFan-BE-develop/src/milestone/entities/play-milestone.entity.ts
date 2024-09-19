import { UserEntity } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { SoftDelete } from '../../common/core/soft-delete';
import { PlayMilestoneDto } from '../dtos/play-milestone.dto';
import { MilestoneEntity } from './milestone.entity';

@Entity('play_milestone')
export class PlayMilestoneEntity extends SoftDelete {
  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'milestone_id' })
  milestoneId: string;

  @ManyToOne(() => MilestoneEntity)
  @JoinColumn({ name: 'milestone_id' })
  milestone: MilestoneEntity;

  @Column({ name: 'check_in_flag', default: false })
  checkInFlag: boolean;

  @Column({ name: 'balance_flag', default: false })
  balanceFlag: boolean;

  @Column({ name: 'occur_count', default: 0 })
  occurCount: number;

  toDto(): PlayMilestoneDto {
    return {
      ...super.toDto(),
      user: this.user?.toUserDto(),
      milestone: this.milestone?.toDto(),
      checkInFlag: this.checkInFlag,
      balanceFlag: this.balanceFlag,
      occurCount: this.occurCount,
    };
  }
}
