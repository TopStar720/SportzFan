import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { MilestoneDto } from '../dtos/milestone.dto';
import { SoftDelete } from '../../common/core/soft-delete';
import { TeamEntity } from 'src/team/entities/team.entity';
import { MatchEntity } from 'src/match/entities/match.entity';
import { SponsorEntity } from 'src/sponsor/entities/sponsor.entity';
import { AssetEntity } from '../../asset/entities/asset.entity';
import { PlayMilestoneEntity } from './play-milestone.entity';

@Entity('milestone')
export class MilestoneEntity extends SoftDelete {
  @Column({ name: 'team_id' })
  teamId: string;

  @ManyToOne(() => TeamEntity)
  @JoinColumn({ name: 'team_id' })
  team: TeamEntity;

  @Column({ name: 'match_id', nullable: true })
  matchId: string;

  @ManyToOne(() => MatchEntity)
  @JoinColumn({ name: 'match_id' })
  match: MatchEntity;

  @Column({ name: 'sponsor_id' })
  sponsorId: string;

  @ManyToOne(() => SponsorEntity)
  @JoinColumn({ name: 'sponsor_id' })
  sponsor: SponsorEntity;

  @OneToMany(
    () => PlayMilestoneEntity,
    (playMilestone) => playMilestone.milestone,
  )
  playMilestone: PlayMilestoneEntity[];

  @Column({ name: 'asset_id', nullable: true })
  assetId: string;

  @ManyToOne(() => AssetEntity)
  @JoinColumn({ name: 'asset_id' })
  asset: AssetEntity;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  start: Date;

  @Column()
  end: Date;

  @Column({ name: 'eligible_kudos' })
  eligbleKudos: number;

  @Column({ name: 'eligible_token' })
  eligbleToken: number;

  @Column({ name: 'any_with_venue', default: true })
  anyWithVenue: boolean;

  @Column({ name: 'only_in_venue', default: false })
  onlyInVenue: boolean;

  @Column({ name: 'reward_kudos_per_player' })
  rewardKudosPerPlayer: number;

  @Column({ name: 'reward_token_per_player' })
  rewardTokenPerPlayer: number;

  @Column({ name: 'enable_asset_reward', default: false })
  enableAssetReward: boolean;

  @Column({ name: 'reward_asset_count' })
  rewardAssetCount: number;

  @Column({ name: 'winner_limit' })
  winnerLimit: number;

  @Column({ name: 'occur_count', default: 0 })
  occurCount: number;

  @Column({ name: 'is_draft', default: false })
  isDraft: boolean;

  @Column({ name: 'is_ended', default: false })
  isEnded: boolean;

  toDto(): MilestoneDto {
    return {
      ...super.toDto(),
      team: this.team,
      match: this.match,
      sponsor: this.sponsor,
      asset: this.asset,
      playMilestone: this.playMilestone,
      title: this.title,
      description: this.description,
      start: this.start,
      end: this.end,
      eligbleKudos: this.eligbleKudos,
      eligbleToken: this.eligbleToken,
      anyWithVenue: this.anyWithVenue,
      onlyInVenue: this.onlyInVenue,
      rewardKudosPerPlayer: this.rewardKudosPerPlayer,
      rewardTokenPerPlayer: this.rewardTokenPerPlayer,
      enableAssetReward: this.enableAssetReward,
      rewardAssetCount: this.rewardAssetCount,
      winnerLimit: this.winnerLimit,
      occurCount: this.occurCount,
      isDraft: this.isDraft,
      isEnded: this.isEnded
    };
  }
}
