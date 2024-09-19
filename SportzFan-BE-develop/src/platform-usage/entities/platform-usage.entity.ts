import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { PlatformUsageDto } from '../dtos/platform-usage.dto';
import { SoftDelete } from '../../common/core/soft-delete';
import { UserEntity } from '../../user/entities/user.entity';

@Entity('platform-usage')
export class PlatformUsageEntity extends SoftDelete {
  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'total_login_count', default: 0 })
  totalLoginCount: number;

  @Column({ name: 'last_month_login_count', default: 0 })
  lastMonthLoginCount: number;

  @Column({ name: 'total_usage_minutes', type: "decimal", precision: 24, scale: 0, default: 0 })
  totalUsageMinutes: number;

  @Column({ name: 'last_month_usage_minutes', type: "decimal", precision: 24, scale: 0, default: 0 })
  lastMonthUsageMinutes: number;

  @Column({ name: 'last_login_at', nullable: true })
  lastLoginAt: string;

  toDto(): PlatformUsageDto {
    return {
      ...super.toDto(),
      user: this.user,
      totalLoginCount: this.totalLoginCount,
      lastMonthLoginCount: this.lastMonthLoginCount,
      totalUsageMinutes: this.totalUsageMinutes,
      lastMonthUsageMinutes: this.lastMonthUsageMinutes,
      lastLoginAt: this.lastLoginAt,
    };
  }
}
