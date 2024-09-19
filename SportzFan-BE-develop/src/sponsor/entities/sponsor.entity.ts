import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { SoftDelete } from '../../common/core/soft-delete';
import { SponsorDto } from '../dtos/sponsor.dto';
import { SponsorCategory } from '../../common/models/base';
import { TeamEntity } from 'src/team/entities/team.entity';

@Entity('sponsor')
export class SponsorEntity extends SoftDelete {
  @Column({ enum: SponsorCategory })
  category: SponsorCategory;

  @Column({ name: 'team_id' })
  teamId: string;

  @ManyToOne(() => TeamEntity)
  @JoinColumn({ name: 'team_id' })
  team: TeamEntity;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  logo: string;

  toDto(): SponsorDto {
    return {
      ...super.toDto(),
      category: this.category,
      team: this.team,
      title: this.title,
      description: this.description,
      logo: this.logo,
    };
  }
}
