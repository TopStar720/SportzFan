import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { PlayerDto } from '../dtos/player.dto';
import { SoftDelete } from '../../common/core/soft-delete';
import { TeamEntity } from '../../team/entities/team.entity';

@Entity('player')
export class PlayerEntity extends SoftDelete {
  @Column({ name: 'team_id' })
  teamId: string;

  @ManyToOne(() => TeamEntity, { cascade: true })
  @JoinColumn({ name: 'team_id' })
  team: TeamEntity;

  @Column()
  name: string;

  @Column()
  avatar: string;

  toDto(): PlayerDto {
    return {
      ...super.toDto(),
      name: this.name,
      avatar: this.avatar,
      team: this.team,
    };
  }
}
