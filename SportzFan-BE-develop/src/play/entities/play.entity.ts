import { Column, Entity } from 'typeorm';

import { SoftDelete } from '../../common/core/soft-delete';
import { PlayDto } from '../dtos/play.dto';
import { PlayModel, OrderStatus } from '../../common/models/base';

@Entity('play')
export class PlayEntity extends SoftDelete {
  @Column()
  name: string;

  @Column()
  model: PlayModel;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.initial,
  })
  status: OrderStatus;

  toDto(): PlayDto {
    return {
      ...super.toDto(),
      name: this.name,
      model: this.model,
      status: this.status,
    };
  }
}
