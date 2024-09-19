import { Column, JoinColumn, Entity, ManyToOne } from 'typeorm';

import { SoftDelete } from '../../common/core/soft-delete';
import { PlayMultiCheckInItemDto } from '../dtos/play-multi-check-in-item.dto';
import { PlayMultiCheckInEntity } from './play-multi-check-in.entity';

@Entity('play_multi_check_in_item')
export class PlayMultiCheckInItemEntity extends SoftDelete {
  @Column({ name: 'play_multi_check_in_id' })
  playMultiCheckInId: string;

  @ManyToOne(
    () => PlayMultiCheckInEntity,
    (playMultiCheckIn) => playMultiCheckIn.items,
  )
  @JoinColumn({ name: 'play_multi_check_in_id' })
  playMultiCheckIn: PlayMultiCheckInEntity;

  @Column()
  location: number;

  @Column({ name: 'user_coordinates' })
  userCoordinates: string;

  toDto(): PlayMultiCheckInItemDto {
    return {
      ...super.toDto(),
      location: this.location,
      userCoordinates: this.userCoordinates,
    };
  }
}
