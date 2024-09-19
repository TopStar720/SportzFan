import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { TransactionDto } from '../dtos/transaction.dto';
import { SoftDelete } from '../../common/core/soft-delete';
import { UserEntity } from '../../user/entities/user.entity';
import { TeamEntity } from '../../team/entities/team.entity';
import { TransactionStatus, TransactionType } from '../../common/models/base';
import { MatchEntity } from '../../match/entities/match.entity';

@Entity('transaction')
export class TransactionEntity extends SoftDelete {
  @Column({ name: 'sender_id' })
  senderId: string;

  @ManyToOne(() => UserEntity, { cascade: true })
  @JoinColumn({ name: 'sender_id' })
  sender: UserEntity;

  @Column({ name: 'receiver_id' })
  receiverId: string;

  @ManyToOne(() => UserEntity, { cascade: true })
  @JoinColumn({ name: 'receiver_id' })
  receiver: UserEntity;

  @Column({ name: 'team_id' })
  teamId: string;

  @ManyToOne(() => TeamEntity, { cascade: true })
  @JoinColumn({ name: 'team_id' })
  team: TeamEntity;

  @Column({ name: 'match_id', nullable: true })
  matchId: string;

  @ManyToOne(() => MatchEntity, { cascade: true })
  @JoinColumn({ name: 'match_id' })
  match: MatchEntity;

  @Column({
    type: 'enum',
    enum: TransactionType,
    default: TransactionType.Deposit,
  })
  type: TransactionType;

  @Column({ name: 'unique_id', default: '' })
  uniqueId: string;

  @Column({ name: 'kudos_amount', default: 0 })
  kudosAmount: number;

  @Column({ name: 'token_amount', default: 0 })
  tokenAmount: number;

  @Column({ default: TransactionStatus.Pending })
  status: TransactionStatus;

  @Column({ name: 'is_activated' })
  isActivated: boolean;

  @Column({ name: 'reason', default: '' })
  reason: string;

  toDto(): TransactionDto {
    return {
      ...super.toDto(),
      sender: this.sender,
      receiver: this.receiver,
      team: this.team,
      match: this.match,
      type: this.type,
      uniqueId: this.uniqueId,
      kudosAmount: this.kudosAmount,
      tokenAmount: this.tokenAmount,
      status: this.status,
      isActivated: this.isActivated,
      reason: this.reason,
    };
  }
}
