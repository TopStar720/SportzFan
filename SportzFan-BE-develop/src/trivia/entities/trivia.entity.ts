import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { TriviaDto } from '../dtos/trivia.dto';
import { TriviaType } from '../../common/models/base';
import { TeamEntity } from 'src/team/entities/team.entity';
import { SoftDelete } from '../../common/core/soft-delete';
import { MatchEntity } from 'src/match/entities/match.entity';
import { TriviaQuestionEntity } from './trivia-question.entity';
import { SponsorEntity } from 'src/sponsor/entities/sponsor.entity';
import { PlayTriviaEntity } from 'src/trivia/entities/play-trivia.entity';
import { TriviaRewardDistributionEntity } from './trivia-reward-distribution.entity';
import { AssetEntity } from "../../asset/entities/asset.entity";

@Entity('trivia')
export class TriviaEntity extends SoftDelete {
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

  @Column()
  start: Date;

  @Column()
  end: Date;

  @Column({ name: 'sponsor_id' })
  sponsorId: string;

  @ManyToOne(() => SponsorEntity)
  @JoinColumn({ name: 'sponsor_id' })
  sponsor: SponsorEntity;

  @Column({ name: 'eligible_kudos' })
  eligbleKudos: number;

  @Column({ name: 'eligible_token' })
  eligbleToken: number;

  @Column({ name: 'reward_kudos_all' })
  rewardKudosAll: number;

  @Column({ name: 'reward_kudos_winner_total' })
  rewardKudosWinnerTotal: number;

  @Column({ name: 'reward_token_winner_total' })
  rewardTokenWinnerTotal: number;

  @OneToMany(
    () => TriviaRewardDistributionEntity,
    (rewardDistribution) => rewardDistribution.trivia,
    { cascade: true },
  )
  rewardDistribution: TriviaRewardDistributionEntity[];

  @Column({ name: 'trivia_type', nullable: true })
  triviaType: TriviaType;

  @OneToMany(
    () => TriviaQuestionEntity,
    (triviaQuestion) => triviaQuestion.trivia,
    { cascade: true },
  )
  triviaQuestions: TriviaQuestionEntity[];

  @OneToMany(() => PlayTriviaEntity, (playTrivia) => playTrivia.trivia)
  playTrivia: PlayTriviaEntity[];

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

  toDto(): TriviaDto {
    return {
      ...super.toDto(),
      team: this.team,
      match: this.match,
      triviaType: this.triviaType,
      title: this.title,
      description: this.description,
      start: this.start,
      end: this.end,
      sponsor: this.sponsor,
      eligbleKudos: this.eligbleKudos,
      eligbleToken: this.eligbleToken,
      rewardKudosAll: this.rewardKudosAll,
      rewardKudosWinnerTotal: this.rewardKudosWinnerTotal,
      rewardTokenWinnerTotal: this.rewardTokenWinnerTotal,
      rewardDistribution: this.rewardDistribution.map((distribution) =>
        distribution.toDto(),
      ),
      triviaQuestions: this.triviaQuestions,
      playTrivia: this.playTrivia,
      asset: this.asset,
      enableAssetReward: this.enableAssetReward,
      rewardAssetCount: this.rewardAssetCount,
      winnerLimit: this.winnerLimit,
      isDraft: this.isDraft,
      isEnded: this.isEnded,
    };
  }
}
