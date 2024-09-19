import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { SoftDelete } from '../../common/core/soft-delete';
import { PlayMultiReferrerEntity } from './play-multi-referrer.entity';
import { PlayMultiReferrerInvitationDto } from '../dtos/play-multi-referrer-invitation.dto';

@Entity('play_multi_referrer_invitation')
export class PlayMultiReferrerInvitationEntity extends SoftDelete {
  @Column({ name: 'play_multi_referrer_id' })
  playMultiReferrerId: string;

  @Column({ name: 'invited_email' })
  invitedEmail: string;

  @Column({ name: 'is_signed_up' })
  isSignedUp: boolean;

  @ManyToOne(
    () => PlayMultiReferrerEntity,
    (playMultiReferrer) => playMultiReferrer.invitation,
  )
  @JoinColumn({ name: 'play_multi_referrer_id' })
  playMultiReferrer: PlayMultiReferrerEntity;

  toDto(): PlayMultiReferrerInvitationDto {
    return {
      ...super.toDto(),
      invitedEmail: this.invitedEmail,
      isSignedUp: this.isSignedUp,
    };
  }
}
