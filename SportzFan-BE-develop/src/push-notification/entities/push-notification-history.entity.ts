import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from 'typeorm';
import { IsEnum } from 'class-validator';

import { SoftDelete } from '../../common/core/soft-delete';
import { TeamEntity } from 'src/team/entities/team.entity';
import { PushNotificationCriteriaType } from '../../common/models/base';
import { UserEntity } from '../../user/entities/user.entity';
import { PushNotificationHistoryDto } from '../dto/push-notification-history.dto';

@Entity('push_notification_history')
export class PushNotificationHistoryEntity extends SoftDelete {
  @Column({ name: 'team_id', nullable: true })
  teamId: string;

  @ManyToOne(() => TeamEntity)
  @JoinColumn({ name: 'team_id' })
  team: TeamEntity;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'title', default: '' })
  title: string;

  @Column({ name: 'message', default: '' })
  message: string;

  @Column({ name: 'link_page', default: '' })
  linkPage: string;

  @Column({ name: 'button_label', default: '' })
  buttonLabel: string;

  @Column({ name: 'is_schedule', default: false })
  isSchedule: boolean;

  @Column({ name: 'schedule_date', nullable: true })
  scheduleDate: Date;

  @Column({ name: 'send_all', default: false })
  sendAll: boolean;

  @Column({ name: 'criteria', nullable: true })
  @IsEnum(PushNotificationCriteriaType)
  criteria: PushNotificationCriteriaType;

  @Column({ name: 'criteria_value', default: '' })
  criteriaValue: string;

  @ManyToMany(
    () => UserEntity,
    (userEntity) => userEntity.pushNotificationHistories,
  )
  @JoinTable()
  receivers: UserEntity[];

  @Column({ name: 'is_draft', default: false })
  isDraft: boolean;

  @Column({ name: 'is_ended', default: false })
  isEnded: boolean;

  toDto(): PushNotificationHistoryDto {
    return {
      ...super.toDto(),
      team: this.team,
      user: this.user,
      title: this.title,
      message: this.message,
      linkPage: this.linkPage,
      buttonLabel: this.buttonLabel,
      isSchedule: this.isSchedule,
      scheduleDate: this.scheduleDate,
      sendAll: this.sendAll,
      criteria: this.criteria,
      criteriaValue: this.criteriaValue,
      receivers: this.receivers,
      isDraft: this.isDraft,
      isEnded: this.isEnded,
    };
  }
}
