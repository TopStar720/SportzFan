import { Column, Entity } from 'typeorm';

import { SoftDelete } from '../../common/core/soft-delete';
import { PaymentMethod } from 'src/common/models/base';
import { PlatformPaymentHistoryDto } from '../dtos/platform-payment-history.dto';

@Entity('platform-payment_history')
export class PlatformPaymentHistoryEntity extends SoftDelete {
  @Column()
  paymentIntentId: string;

  @Column({ type: 'decimal', precision: 24, scale: 6, default: 0 })
  amount: number;

  @Column({ nullable: true, default: undefined })
  paidDate: Date;

  @Column({ nullable: true })
  comment: string;

  @Column({ name: 'payment_method' })
  paymentMethod: PaymentMethod;

  toDto(): PlatformPaymentHistoryDto {
    return {
      ...super.toDto(),
      paymentIntentId: this.paymentIntentId,
      amount: this.amount,
      paidDate: this.paidDate,
      comment: this.comment,
      paymentMethod: this.paymentMethod,
    };
  }
}
