import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { SoftDelete } from '../../common/core/soft-delete';
import { PlayMultiCheckInDto } from '../dtos/play-multi-check-in.dto';
import { MultiCheckInEntity } from './multi-check-in.entity';
import { PlayMultiCheckInItemEntity } from './play-multi-check-in-item.entity';
import { UserEntity } from 'src/user/entities/user.entity';

@Entity('play_multi_check_in')
export class PlayMultiCheckInEntity extends SoftDelete {
  @Column({ name: 'multi_checkin_id' })
  multiCheckInId: string;

  @ManyToOne(() => MultiCheckInEntity, (multiCheckIn) => multiCheckIn.playMultiCheckIn)
  @JoinColumn({ name: 'multi_checkin_id' })
  multiCheckIn: MultiCheckInEntity;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @OneToMany(() => PlayMultiCheckInItemEntity, (item) => item.playMultiCheckIn)
  items: PlayMultiCheckInItemEntity[];

  toDto(): PlayMultiCheckInDto {
    return {
      ...super.toDto(),
      multiCheckIn: this.multiCheckIn,
      user: this.user,
      items: this.items.map((item) => item.toDto()),
    };
  }
}
