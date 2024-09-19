import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { SoftDelete } from '../../common/core/soft-delete';
import { MatchDto } from '../dtos/match.dto';
import { MatchType } from '../../common/models/base';
import { TeamEntity } from 'src/team/entities/team.entity';

@Entity('match')
export class MatchEntity extends SoftDelete {
  @Column({ name: 'team_id', nullable: true })
  teamId: string;

  @ManyToOne(() => TeamEntity)
  @JoinColumn({ name: 'team_id' })
  team: TeamEntity;

  @Column({ name: 'title', nullable: true })
  title: string;

  @Column({ enum: MatchType })
  type: MatchType;

  @Column({ name: 'home_team_id' })
  homeTeamId: string;

  @ManyToOne(() => TeamEntity)
  @JoinColumn({ name: 'home_team_id' })
  homeTeam: TeamEntity;

  @Column({ name: 'away_team_id' })
  awayTeamId: string;

  @ManyToOne(() => TeamEntity)
  @JoinColumn({ name: 'away_team_id' })
  awayTeam: TeamEntity;

  @Column({ name: 'venue_title' })
  venueTitle: string;

  @Column({ name: 'venue_address' })
  venueAddress: string;

  @Column({ name: 'venue_google_coordinates' })
  venueGoogleCoordinates: string;

  @Column({ name: 'is_draft', default: false })
  isDraft: boolean;

  @Column()
  start: Date;

  @Column()
  end: Date;

  toDto(): MatchDto {
    return {
      ...super.toDto(),
      title: this.title,
      type: this.type,
      team: this.team,
      homeTeam: this.homeTeam,
      awayTeam: this.awayTeam,
      venueTitle: this.venueTitle,
      venueAddress: this.venueAddress,
      venueGoogleCoordinates: this.venueGoogleCoordinates,
      start: this.start,
      end: this.end,
      isDraft: this.isDraft,
    };
  }
}
