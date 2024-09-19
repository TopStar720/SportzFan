import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { PredictionDto } from '../dtos/prediction.dto';
import { SoftDelete } from '../../common/core/soft-delete';
import { TeamEntity } from 'src/team/entities/team.entity';
import { MatchEntity } from 'src/match/entities/match.entity';
import { PlayPredictionEntity } from './play-prediction.entity';
import { SponsorEntity } from 'src/sponsor/entities/sponsor.entity';
import { PredictionRewardDistributionEntity } from './prediction-reward-distribution.entity';
import { PredictionType } from '../../common/models/base';

@Entity('prediction')
export class PredictionEntity extends SoftDelete {
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
  participants: number;

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
    () => PredictionRewardDistributionEntity,
    (rewardDistribution) => rewardDistribution.prediction,
    { cascade: true },
  )
  rewardDistribution: PredictionRewardDistributionEntity[];

  @Column({ name: 'is_result', nullable: true })
  isResult: boolean;

  @Column({ name: 'result_main', nullable: true })
  resultMain: number;

  @Column({ name: 'result_opposition', nullable: true })
  resultOpposition: number;

  @OneToMany(
    () => PlayPredictionEntity,
    (playPrediction) => playPrediction.prediction,
  )
  playPrediction: PlayPredictionEntity[];

  @Column({ name: 'prediction_type', nullable: true })
  predictionType: PredictionType;

  @Column({ name: 'is_draft', default: false })
  isDraft: boolean;

  @Column({ name: 'is_ended', default: false })
  isEnded: boolean;

  toDto(): PredictionDto {
    return {
      ...super.toDto(),
      team: this.team?.toDto(),
      match: this.match?.toDto(),
      title: this.title,
      description: this.description,
      predictionType: this.predictionType,
      participants: this.participants,
      start: this.start,
      end: this.end,
      sponsor: this.sponsor,
      eligbleKudos: this.eligbleKudos,
      eligbleToken: this.eligbleToken,
      rewardKudosAll: this.rewardKudosAll,
      rewardKudosWinnerTotal: this.rewardKudosWinnerTotal,
      rewardTokenWinnerTotal: this.rewardTokenWinnerTotal,
      isResult: this.isResult,
      resultMain: this.resultMain,
      resultOpposition: this.resultOpposition,
      rewardDistribution: this.rewardDistribution?.map((distribution) =>
        distribution.toDto(),
      ),
      playPrediction: this.playPrediction,
      isDraft: this.isDraft,
      isEnded: this.isEnded,
    };
  }
}
