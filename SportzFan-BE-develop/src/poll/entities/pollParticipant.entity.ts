import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { SoftDelete } from 'src/common/core/soft-delete';
import { UserEntity } from 'src/user/entities/user.entity';
import { PollEntity } from './poll.entity';

@Entity('poll_participate')
export class PollParticipantEntity extends SoftDelete {
  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(
    () => UserEntity,
  )
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'poll_id' })
  pollId: string;

  @ManyToOne(
    () => PollEntity,
    (poll) => poll.participants,
  )
  @JoinColumn({ name: 'poll_id' })
  poll: PollEntity;

  @Column({ name: 'poll_option_id' })
  pollOptionId: string;
}