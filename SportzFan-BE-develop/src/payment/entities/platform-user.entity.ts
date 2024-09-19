import { Column, Entity } from 'typeorm';

import { SoftDelete } from '../../common/core/soft-delete';
import { PlatformUserDto } from '../dtos/platform-user.dto';

@Entity('platform-user')
export class PlatformUserEntity extends SoftDelete {
  @Column()
  email: string;

  @Column()
  name: string;

  @Column({ name: 'stripe_customer_id' })
  stripeCustomerId: string;

  toDto(): PlatformUserDto {
    return {
      ...super.toDto(),
      email: this.email,
      name: this.name,
      stripeCustomerId: this.stripeCustomerId,
    };
  }
}
