import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { SoftDelete } from '../../common/core/soft-delete';
import { UserEntity } from '../../user/entities/user.entity';
import { NotificationCategoryType, NotificationDto, NotificationType } from '../dtos/notification.dto';

@Entity('notification')
export class NotificationEntity extends SoftDelete {
  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => UserEntity, { cascade: true })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ type: 'enum', enum: NotificationType, default: NotificationType.GameAlive })
  type: NotificationType;

  @Column({ type: 'enum', enum: NotificationCategoryType, default: NotificationCategoryType.Game })
  category: NotificationCategoryType;

  @Column({ default: '' })
  section: string;

  @Column({ name: 'unique_id', default: '' })
  uniqueId: string;

  @Column({ nullable: true })
  content: string;

  @Column({ name: 'detail_content', default: '', nullable: true })
  detailContent: string;

  @Column({ name: 'is_seen', default: false })
  isSeen: boolean;

  toDto(): NotificationDto {
    return {
      ...super.toDto(),
      user: this.user,
      type: this.type,
      category: this.category,
      section: this.section,
      uniqueId: this.uniqueId,
      content: this.content,
      detailContent: this.detailContent,
      isSeen: this.isSeen,
    };
  }
}
