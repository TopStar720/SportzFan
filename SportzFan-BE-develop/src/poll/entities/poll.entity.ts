import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { SoftDelete } from '../../common/core/soft-delete';
import { OptionType } from '../enums';
import { PollDto } from '../dtos/poll.dto';
import { PollOptionEntity } from './pollOption.entity';
import { PollParticipantEntity } from './pollParticipant.entity';
import { TeamEntity } from 'src/team/entities/team.entity';
import { SponsorEntity } from 'src/sponsor/entities/sponsor.entity';
import { MatchEntity } from 'src/match/entities/match.entity';
import { AssetEntity } from '../../asset/entities/asset.entity';

@Entity('poll')
export class PollEntity extends SoftDelete {
  @Column({ name: 'team_id' })
  teamId: string;

  @ManyToOne(() => TeamEntity)
  @JoinColumn({ name: 'team_id' })
  team: TeamEntity;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: OptionType,
    default: OptionType.Text,
  })
  optionType: OptionType;

  @OneToMany(() => PollOptionEntity, (pollOption) => pollOption.poll, {
    cascade: true,
  })
  options: PollOptionEntity[];

  @Column({ name: 'match_id', nullable: true })
  matchId: string;

  @ManyToOne(() => MatchEntity)
  @JoinColumn({ name: 'match_id' })
  match: MatchEntity;

  @Column()
  participantType: number;

  @OneToMany(
    () => PollParticipantEntity,
    (pollParticipant) => pollParticipant.poll,
  )
  participants: PollParticipantEntity[];

  @Column()
  start: Date;

  @Column()
  end: Date;

  @Column()
  kudosEligible: number;

  @Column()
  tokenEligible: number;

  @Column()
  kudosReward: number;

  @Column()
  tokenReward: number;

  @Column({ name: 'sponsor_id' })
  sponsorId: string;

  @ManyToOne(() => SponsorEntity)
  @JoinColumn({ name: 'sponsor_id' })
  sponsor: SponsorEntity;

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

  @Column({ name: 'is_ended', default: false })
  isEnded: boolean;

  toDto(): PollDto {
    return {
      ...super.toDto(),
      team: this.team,
      title: this.title,
      description: this.description,
      optionType: this.optionType,
      options: this.options,
      match: this.match,
      participantType: this.participantType,
      participants: this.participants,
      start: this.start,
      end: this.end,
      kudosEligible: this.kudosEligible,
      tokenEligible: this.tokenEligible,
      kudosReward: this.kudosReward,
      tokenReward: this.tokenReward,
      sponsor: this.sponsor,
      asset: this.asset,
      enableAssetReward: this.enableAssetReward,
      rewardAssetCount: this.rewardAssetCount,
      winnerLimit: this.winnerLimit,
      isDraft: this.isDraft,
      isEnded: this.isEnded,
    };
  }
}
