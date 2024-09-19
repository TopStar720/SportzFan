import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { SoftDelete } from '../../common/core/soft-delete';
import { SurveyQuestionEntity } from './survey-question.entity';
import { PlaySurveyEntity } from './play-survey.entity';
import { TeamEntity } from 'src/team/entities/team.entity';
import { MatchEntity } from 'src/match/entities/match.entity';
import { SponsorEntity } from 'src/sponsor/entities/sponsor.entity';
import { SurveyDto } from '../dtos/survey.dto';
import { AssetEntity } from '../../asset/entities/asset.entity';

@Entity('survey')
export class SurveyEntity extends SoftDelete {
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

  @OneToMany(() => PlaySurveyEntity, (playSurvey) => playSurvey.survey)
  playSurvey: PlaySurveyEntity[];

  @OneToMany(
    () => SurveyQuestionEntity,
    (surveyQuestion) => surveyQuestion.survey,
    { cascade: true },
  )
  surveyQuestions: SurveyQuestionEntity[];

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

  @Column({ name: 'is_optional', default: true })
  isOptional: boolean;

  @Column({ name: 'is_draft', default: false })
  isDraft: boolean;

  toDto(): SurveyDto {
    return {
      ...super.toDto(),
      team: this.team,
      eligbleKudos: this.eligbleKudos,
      eligbleToken: this.eligbleToken,
      kudosReward: this.kudosReward,
      tokenReward: this.tokenReward,
      sponsor: this.sponsor,
      start: this.start,
      end: this.end,
      participants: this.participants,
      match: this.match,
      description: this.description,
      title: this.title,
      surveyQuestions: (this.surveyQuestions || []).map((question) =>
        question.toDto(),
      ),
      asset: this.asset,
      enableAssetReward: this.enableAssetReward,
      rewardAssetCount: this.rewardAssetCount,
      winnerLimit: this.winnerLimit,
      isOptional: this.isOptional,
      isDraft: this.isDraft,
    };
  }
}
