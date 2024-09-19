import { SponsorEntity } from 'src/sponsor/entities/sponsor.entity';
import { TeamEntity } from 'src/team/entities/team.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { SoftDelete } from '../../common/core/soft-delete';
import { AssetDto } from '../dtos/asset.dto';
import { AssetType, AssetCategory, ClaimType } from '../enums';
import { AssetCouponEntity } from './assetCoupon.entity';
import { AssetRedeemEntity } from './assetRedeem.entity';

@Entity('asset')
export class AssetEntity extends SoftDelete {
  @Column({
    type: 'enum',
    enum: AssetType,
    default: AssetType.Team,
  })
  type: AssetType;

  @Column({ name: 'team_id', nullable: true })
  teamId: string;

  @ManyToOne(() => TeamEntity)
  @JoinColumn({ name: 'team_id' })
  team: TeamEntity;

  @Column({ name: 'sponsor_id', nullable: true })
  sponsorId: string;

  @ManyToOne(() => SponsorEntity)
  @JoinColumn({ name: 'sponsor_id' })
  sponsor: SponsorEntity;

  @Column({
    type: 'enum',
    enum: AssetCategory,
  })
  category: AssetCategory;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  imageUrl: string;

  @Column()
  start: Date;

  @Column()
  end: Date;

  @Column({ default: 0 })
  participate: number;

  @OneToMany(() => AssetRedeemEntity, (assetRedeem) => assetRedeem.asset, {
    cascade: true,
  })
  participants: AssetRedeemEntity[];

  @OneToMany(() => AssetCouponEntity, (assetCoupon) => assetCoupon.asset, {
    cascade: true,
    orphanedRowAction: 'soft-delete',
  })
  coupons: AssetCouponEntity[];

  @Column()
  totalCount: number;

  @Column({ default: 0 })
  maxPerUser: number;

  @Column({ default: 0 })
  tokenRequired: number;

  @Column({ default: 0 })
  kudosEligible: number;

  @Column({ default: 0 })
  tokenEligible: number;

  @Column({ default: 0 })
  kudosReward: number;

  @Column({ default: 0 })
  tokenReward: number;

  @Column({
    type: 'enum',
    enum: ClaimType,
    default: ClaimType.Physical,
  })
  claimType: ClaimType;

  @Column()
  claimDescription: string;

  @Column({ name: 'is_draft', default: false })
  isDraft: boolean;

  @Column({ name: 'claim_url', nullable: true })
  claimUrl: string;

  @Column({ name: 'is_bonus', default: false })
  isBonus: boolean;

  toDto(): AssetDto {
    return {
      ...super.toDto(),
      type: this.type,
      team: this.team,
      sponsorId: this.sponsorId,
      category: this.category,
      title: this.title,
      description: this.description,
      imageUrl: this.imageUrl,
      start: this.start,
      end: this.end,
      participate: this.participate,
      participants: this.participants,
      coupons: this.coupons,
      totalCount: this.totalCount,
      maxPerUser: this.maxPerUser,
      tokenRequired: this.tokenRequired,
      kudosEligible: this.kudosEligible,
      tokenEligible: this.tokenEligible,
      kudosReward: this.kudosReward,
      tokenReward: this.tokenReward,
      claimType: this.claimType,
      claimDescription: this.claimDescription,
      isDraft: this.isDraft,
      claimUrl: this.claimUrl,
      isBonus: this.isBonus,
    };
  }
}
