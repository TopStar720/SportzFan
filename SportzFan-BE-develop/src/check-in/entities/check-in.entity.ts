import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { CheckInDto } from '../dtos/check-in.dto';
import { SoftDelete } from '../../common/core/soft-delete';
import { PlayCheckInEntity } from './play-check-in.entity';
import { TeamEntity } from 'src/team/entities/team.entity';
import { MatchEntity } from 'src/match/entities/match.entity';
import { SponsorEntity } from 'src/sponsor/entities/sponsor.entity';
import { AssetEntity } from '../../asset/entities/asset.entity';

@Entity('check_in')
export class CheckInEntity extends SoftDelete {
  @Column({ name: 'team_id' })
  teamId: string;

  @ManyToOne(() => TeamEntity)
  @JoinColumn({ name: 'team_id' })
  team: TeamEntity;

  @Column({ name: 'sponsor_id' })
  sponsorId: string;

  @ManyToOne(() => SponsorEntity)
  @JoinColumn({ name: 'sponsor_id' })
  sponsor: SponsorEntity;

  @Column({ name: 'match_id', nullable: true })
  matchId: string;

  @ManyToOne(() => MatchEntity)
  @JoinColumn({ name: 'match_id' })
  match: MatchEntity;

  @Column({ name: 'title', nullable: true })
  title: string;

  @Column({ name: 'description', nullable: true })
  description: string;

  @Column({ name: 'eligble_kudos' })
  eligbleKudos: number;

  @Column({ name: 'eligble_token', nullable: true })
  eligbleToken: number;

  @Column({ name: 'kudos_reward' })
  kudosReward: number;

  @Column({ name: 'token_reward' })
  tokenReward: number;

  @Column()
  start: Date;

  @Column()
  end: Date;

  @Column()
  participants: number;

  @Column({ name: 'out_kudos_reward', nullable: true })
  outKudosReward: number;

  @Column({ name: 'out_token_reward', nullable: true })
  outTokenReward: number;

  @OneToMany(() => PlayCheckInEntity, (playCheckIn) => playCheckIn.checkIn)
  playCheckIn: PlayCheckInEntity[];

  @Column({ name: 'asset_id', nullable: true })
  assetId: string;

  @ManyToOne(() => AssetEntity)
  @JoinColumn({ name: 'asset_id' })
  asset: AssetEntity;

  @Column({ name: 'enable_asset_reward', default: false })
  enableAssetReward: boolean;

  @Column({ name: 'reward_asset_count', default: 0 })
  rewardAssetCount: number;

  @Column({ name: 'winner_limit', default: 0 })
  winnerLimit: number;

  @Column({ name: 'is_draft', default: false })
  isDraft: boolean;

  toDto(): CheckInDto {
    return {
      ...super.toDto(),
      team: this.team,
      sponsor: this.sponsor,
      match: this.match,
      title: this.title,
      description: this.description,
      eligbleKudos: this.eligbleKudos,
      eligbleToken: this.eligbleToken,
      kudosReward: this.kudosReward,
      tokenReward: this.tokenReward,
      outKudosReward: this.outKudosReward,
      outTokenReward: this.outTokenReward,
      participants: this.participants,
      start: this.start,
      end: this.end,
      playCheckIn: this.playCheckIn,
      asset: this.asset,
      enableAssetReward: this.enableAssetReward,
      rewardAssetCount: this.rewardAssetCount,
      winnerLimit: this.winnerLimit,
      isDraft: this.isDraft,
    };
  }
}
