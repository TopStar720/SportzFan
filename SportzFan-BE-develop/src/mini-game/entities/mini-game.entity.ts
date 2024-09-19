import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import {
  BoosterType,
  MiniGameType,
  UnlockRewardType,
} from 'src/common/models/base';
import { MiniGameDto } from '../dtos/mini-game.dto';
import { TeamEntity } from 'src/team/entities/team.entity';
import { SoftDelete } from '../../common/core/soft-delete';
import { MatchEntity } from 'src/match/entities/match.entity';
import { AssetEntity } from '../../asset/entities/asset.entity';
import { SponsorEntity } from 'src/sponsor/entities/sponsor.entity';
import { PlayMiniGameEntity } from 'src/mini-game/entities/play-mini-game.entity';
import { MiniGameRewardDistributionEntity } from './mini-game-reward-distribution.entity';
import { MiniGameRewardActionEntity } from './mini-game-reward-action.entity';
import { MiniGameRewardMarketplaceItemEntity } from './mini-game-reward-marketplace-item.entity';

@Entity('mini_game')
export class MiniGameEntity extends SoftDelete {
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

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ default: MiniGameType.Soccer })
  type: MiniGameType;

  @Column({ name: 'life_count' })
  lifeCount: number;

  @Column({ name: 'refresh_time' })
  refreshTime: number;

  @Column({ name: 'refresh_amount' })
  refreshAmount: number;

  @Column()
  start: Date;

  @Column()
  end: Date;

  @Column({ nullable: true })
  logo: string;

  @Column({ nullable: true })
  background: string;

  @Column({ name: 'enable_sponsor', default: false })
  enableSponsor: boolean;

  @Column({ name: 'sponsor_id', nullable: true })
  sponsorId: string;

  @ManyToOne(() => SponsorEntity)
  @JoinColumn({ name: 'sponsor_id' })
  sponsor: SponsorEntity;

  @Column({ name: 'sponsor_logo', nullable: true })
  sponsorLogo: string;

  @Column({ name: 'booster_type', default: BoosterType.Team })
  boosterType: BoosterType;

  @Column({ name: 'booster_logo', nullable: true })
  boosterLogo: string;

  @Column({ name: 'unlock_reward_number', default: 0 })
  unlockRewardNumber: number;

  @Column({ name: 'reward_send_time_number', default: 10 })
  rewardSendTimeNumber: number;

  @Column({ name: 'unlock_reward', default: UnlockRewardType.GameCoins })
  unlockReward: UnlockRewardType;

  @Column({ name: 'eligible_kudos' })
  eligbleKudos: number;

  @Column({ name: 'eligible_token' })
  eligbleToken: number;

  @Column({ name: 'reward_kudos' })
  rewardKudos: number;

  @Column({ name: 'reward_token' })
  rewardToken: number;

  @Column({ name: 'reward_kudos_winner_total' })
  rewardKudosWinnerTotal: number;

  @Column({ name: 'reward_token_winner_total' })
  rewardTokenWinnerTotal: number;

  @OneToMany(
    () => MiniGameRewardDistributionEntity,
    (rewardDistribution) => rewardDistribution.miniGame,
    { cascade: true },
  )
  rewardDistribution: MiniGameRewardDistributionEntity[];

  @OneToMany(
    () => MiniGameRewardActionEntity,
    (rewardAction) => rewardAction.miniGame,
    { cascade: true },
  )
  rewardAction: MiniGameRewardActionEntity[];

  @OneToMany(
    () => MiniGameRewardMarketplaceItemEntity,
    (rewardMarketplaceItem) => rewardMarketplaceItem.miniGame,
    { cascade: true },
  )
  rewardMarketplaceItem: MiniGameRewardMarketplaceItemEntity[];

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

  @OneToMany(() => PlayMiniGameEntity, (playMiniGame) => playMiniGame.miniGame)
  playMiniGame: PlayMiniGameEntity[];

  @Column({ name: 'is_draft', default: false })
  isDraft: boolean;

  @Column({ name: 'is_ended', default: false })
  isEnded: boolean;

  toDto(): MiniGameDto {
    return {
      ...super.toDto(),
      team: this.team,
      match: this.match,
      title: this.title,
      description: this.description,
      logo: this.logo,
      background: this.background,
      start: this.start,
      end: this.end,
      lifeCount: this.lifeCount,
      refreshTime: this.refreshTime,
      refreshAmount: this.refreshAmount,
      type: this.type,
      enableSponsor: this.enableSponsor,
      sponsor: this.sponsor,
      sponsorLogo: this.sponsorLogo,
      boosterType: this.boosterType,
      boosterLogo: this.boosterLogo,
      unlockRewardNumber: this.unlockRewardNumber,
      rewardSendTimeNumber: this.rewardSendTimeNumber,
      unlockReward: this.unlockReward,
      eligbleKudos: this.eligbleKudos,
      eligbleToken: this.eligbleToken,
      rewardKudos: this.rewardKudos,
      rewardToken: this.rewardToken,
      rewardKudosWinnerTotal: this.rewardKudosWinnerTotal,
      rewardTokenWinnerTotal: this.rewardTokenWinnerTotal,
      rewardDistribution: this.rewardDistribution.map((distribution) =>
        distribution.toDto(),
      ),
      rewardAction: this.rewardAction.map((action) => action.toDto()),
      rewardMarketplaceItem: this.rewardMarketplaceItem.map((item) =>
        item.toDto(),
      ),
      asset: this.asset,
      enableAssetReward: this.enableAssetReward,
      rewardAssetCount: this.rewardAssetCount,
      winnerLimit: this.winnerLimit,
      playMiniGame: this.playMiniGame,
      isDraft: this.isDraft,
      isEnded: this.isEnded,
    };
  }
}
