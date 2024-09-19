import { Column, Entity, OneToMany } from 'typeorm';

import { SportsDto } from '../dtos/sports.dto';
import { SoftDelete } from '../../common/core/soft-delete';
import { TeamEntity } from 'src/team/entities/team.entity';

@Entity('sports')
export class SportsEntity extends SoftDelete {
  @OneToMany(() => TeamEntity, (teamEntity) => teamEntity.sport)
  teams: TeamEntity[];

  @Column()
  name: string;

  toDto(): SportsDto {
    return {
      ...super.toDto(),
      name: this.name,
    };
  }
}
