import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { ReferralDto } from '../dtos/referral.dto';
import { SoftDelete } from '../../common/core/soft-delete';
import { UserEntity } from '../../user/entities/user.entity';

@Entity('referral')
export class ReferralEntity extends SoftDelete {
  @Column({ name: 'sender_id' })
  senderId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'sender_id' })
  sender: UserEntity;

  @Column({ name: 'receiver_id' })
  receiverId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'receiver_id' })
  receiver: UserEntity;

  @Column({ name: 'passed_sign_up', default: false })
  passedSignUp: boolean;

  @Column({ name: 'passed_play', default: false })
  passedPlay: boolean;

  toDto(): ReferralDto {
    return {
      ...super.toDto(),
      sender: this.sender,
      receiver: this.receiver,
      passedSignUp: this.passedSignUp,
      passedPlay: this.passedPlay,
    };
  }
}
