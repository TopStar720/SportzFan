import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { SoftDelete } from '../../common/core/soft-delete';
import { PlayMultiCheckInEntity } from './play-multi-check-in.entity';
import { TeamEntity } from 'src/team/entities/team.entity';
import { MatchEntity } from 'src/match/entities/match.entity';
import { SponsorEntity } from 'src/sponsor/entities/sponsor.entity';
import { MultiCheckInDto } from '../dtos/multi-check-in.dto';

@Entity('multi-check-in')
export class MultiCheckInEntity extends SoftDelete {
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

  @Column({ name: 'description', nullable: true })
  description: string;

  @Column({ name: 'title', nullable: true })
  title: string;

  @Column({ name: 'eligble_check_in' })
  eligbleCheckIn: number;

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

  @Column({ name: 'match_id', nullable: true })
  matchId: string;

  @ManyToOne(() => MatchEntity)
  @JoinColumn({ name: 'match_id' })
  match: MatchEntity;

  @Column({ name: 'out_kudos_reward', nullable: true })
  outKudosReward: number;

  @Column({ name: 'out_token_reward', nullable: true })
  outTokenReward: number;

  @OneToMany(
    () => PlayMultiCheckInEntity,
    (playMultiCheckIn) => playMultiCheckIn.multiCheckIn,
  )
  playMultiCheckIn: PlayMultiCheckInEntity[];

  @Column({ name: 'is_draft', default: false })
  isDraft: boolean;

  toDto(): MultiCheckInDto {
    return {
      ...super.toDto(),
      team: this.team,
      match: this.match,
      sponsor: this.sponsor,
      title: this.title,
      description: this.description,
      eligbleCheckIn: this.eligbleCheckIn,
      kudosReward: this.kudosReward,
      tokenReward: this.tokenReward,
      start: this.start,
      end: this.end,
      participants: this.participants,
      outKudosReward: this.outKudosReward,
      outTokenReward: this.outTokenReward,
      isDraft: this.isDraft,
    };
  }
}
