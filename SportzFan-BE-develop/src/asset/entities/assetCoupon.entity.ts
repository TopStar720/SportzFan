import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { SoftDelete } from '../../common/core/soft-delete';
import { AssetEntity } from './asset.entity';

@Entity('asset_coupon')
export class AssetCouponEntity extends SoftDelete {
  @Column()
  code: string;

  @Column({ name: 'asset_id' })
  assetId: string;

  @ManyToOne(() => AssetEntity, (asset) => asset.coupons, {
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'asset_id' })
  asset: AssetEntity;

  @Column({ name: 'user_id', nullable: true })
  userId: string;

  @Column({ default: 0 })
  order: number;
}
