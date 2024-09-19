import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { SoftDelete } from '../../common/core/soft-delete';
import { PollEntity } from './poll.entity';

@Entity('poll_option')
export class PollOptionEntity extends SoftDelete {
  @Column()
  details: string;

  @Column({ name: 'poll_id' })
  pollId: string;

  @ManyToOne(() => PollEntity, (poll) => poll.options, {
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'poll_id' })
  poll: PollEntity;

  @Column()
  order: number;
}
