import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { SoftDelete } from '../../common/core/soft-delete';
import { UserEntity } from 'src/user/entities/user.entity';
import { PaymentHistoryDto } from '../dtos/payment-history.dto';
import { PaymentMethod } from 'src/common/models/base';
import { TokenEntity } from 'src/token/entities/token.entity';

@Entity('payment_history')
export class PaymentHistoryEntity extends SoftDelete {
  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column()
  paymentIntentId: string;

  @Column({ type: 'decimal', precision: 24, scale: 6, default: 0 })
  amount: number;

  @Column({ nullable: true, default: undefined })
  paidDate: Date;

  @Column({ type: 'decimal', precision: 24, scale: 0, default: 0 })
  tokenAmount: number;

  @Column({ name: 'token_id' })
  tokenId: string;

  @ManyToOne(() => TokenEntity)
  @JoinColumn({ name: 'token_id' })
  token: TokenEntity;

  @Column({ nullable: true })
  comment: string;

  @Column({ name: 'payment_method' })
  paymentMethod: PaymentMethod;

  toDto(): PaymentHistoryDto {
    return {
      ...super.toDto(),
      user: this.user,
      paymentIntentId: this.paymentIntentId,
      amount: this.amount,
      paidDate: this.paidDate,
      comment: this.comment,
      paymentMethod: this.paymentMethod,
    };
  }
}
