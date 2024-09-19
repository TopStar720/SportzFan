import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';

import { SoftDelete } from '../../common/core/soft-delete';
import { PlayCheckInDto } from '../dtos/play-check-in.dto';
import { CheckInEntity } from './check-in.entity';
import { UserEntity } from 'src/user/entities/user.entity';

@Entity('play_check_in')
export class PlayCheckInEntity extends SoftDelete {
  @Column({ name: 'checkin_id' })
  checkInId: string;

  @ManyToOne(() => CheckInEntity, (checkIn) => checkIn.playCheckIn)
  @JoinColumn({ name: 'checkin_id' })
  checkIn: CheckInEntity;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column()
  location: number;

  @Column({ name: 'user_coordinates' })
  userCoordinates: string;

  @Column({ name: 'receive_bonus', default: false })
  receiveBonus: boolean;

  toDto(): PlayCheckInDto {
    return {
      ...super.toDto(),
      checkIn: this?.checkIn,
      user: this?.user,
      location: this.location,
      userCoordinates: this.userCoordinates,
      receiveBonus: this.receiveBonus,
    };
  }
}
