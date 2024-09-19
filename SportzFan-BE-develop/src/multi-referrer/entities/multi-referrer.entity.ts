import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { SoftDelete } from '../../common/core/soft-delete';
import { PlayMultiReferrerEntity } from './play-multi-referrer.entity';
import { TeamEntity } from 'src/team/entities/team.entity';
import { SponsorEntity } from 'src/sponsor/entities/sponsor.entity';
import { MultiReferrerDto } from '../dtos/multi-referrer.dto';

@Entity('multi-referrer')
export class MultiReferrerEntity extends SoftDelete {
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

  @Column({ name: 'title', nullable: true })
  title: string;

  @Column({ name: 'description', nullable: true })
  description: string;

  @Column({ name: 'eligble_referal' })
  eligbleReferal: number;

  @Column({ name: 'eligble_day' })
  eligbleDay: number;

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

  @OneToMany(
    () => PlayMultiReferrerEntity,
    (playMultiReferrer) => playMultiReferrer.multiReferrer,
  )
  playMultiReferrer: PlayMultiReferrerEntity[];

  @Column({ name: 'is_draft', default: false })
  isDraft: boolean;

  toDto(): MultiReferrerDto {
    return {
      ...super.toDto(),
      team: this.team,
      sponsor: this.sponsor,
      title: this.title,
      description: this.description,
      eligbleReferal: this.eligbleReferal,
      eligbleDay: this.eligbleDay,
      kudosReward: this.kudosReward,
      tokenReward: this.tokenReward,
      start: this.start,
      end: this.end,
      participants: this.participants,
      isDraft: this.isDraft,
    };
  }
}
