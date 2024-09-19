import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { SoftDelete } from '../../common/core/soft-delete';
import { PlayMultiReferrerInvitationEntity } from './play-multi-referrer-invitation.entity';
import { PlayMultiReferrerDto } from '../dtos/play-multi-referrer.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { MultiReferrerEntity } from './multi-referrer.entity';

@Entity('play_multi_referrer')
export class PlayMultiReferrerEntity extends SoftDelete {
  @Column({ name: 'multi_referrer_id' })
  multiReferrerId: string;

  @ManyToOne(() => MultiReferrerEntity, (multiReferrer) => multiReferrer.playMultiReferrer)
  @JoinColumn({ name: 'multi_referrer_id' })
  multiReferrer: MultiReferrerEntity;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'personal_code' })
  personalCode: string;

  @OneToMany(
    () => PlayMultiReferrerInvitationEntity,
    (invitation) => invitation.playMultiReferrer,
  )
  invitation: PlayMultiReferrerInvitationEntity[];

  toDto(): PlayMultiReferrerDto {
    return {
      ...super.toDto(),
      multiReferrer: this.multiReferrer,
      user: this.user,
      personalCode: this.personalCode,
      invitation: this.invitation.map((invite) => invite.toDto()),
    };
  }
}
