import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { SoftDelete } from 'src/common/core/soft-delete';
import { UserEntity } from 'src/user/entities/user.entity';
import { AssetRedeemDto } from '../dtos/assetRedeem.dto';
import { AssetEntity } from './asset.entity';

@Entity('asset_redeem')
export class AssetRedeemEntity extends SoftDelete {
  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'asset_id' })
  assetId: string;

  @ManyToOne(() => AssetEntity, (asset) => asset.participants)
  @JoinColumn({ name: 'asset_id' })
  asset: AssetEntity;

  @Column({ name: 'coupon_id', nullable: true })
  couponId: string;

  @Column({ nullable: true })
  claimDate: string;

  @Column({ nullable: true })
  message: string;

  toDto(): AssetRedeemDto {
    return {
      ...super.toDto(),
      user: this.user,
      assetId: this.assetId,
      couponId: this.couponId,
      claimDate: this.claimDate,
      message: this.message,
    };
  }
}
