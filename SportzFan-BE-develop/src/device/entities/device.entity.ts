import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { SoftDelete } from '../../common/core/soft-delete';
import { UserEntity } from '../../user/entities/user.entity';
import { DeviceDto } from '../dto/device.dto';
import { TeamEntity } from 'src/team/entities/team.entity';

@Entity('device')
export class DeviceEntity extends SoftDelete {
  @Column({ name: 'team_id', nullable: true })
  teamId: string;

  @ManyToOne(() => TeamEntity)
  @JoinColumn({ name: 'team_id' })
  team: TeamEntity;

  @Column({ name: 'project_id' })
  projectId: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'token' })
  token: string;

  toDto(): DeviceDto {
    return {
      ...super.toDto(),
      projectId: this.projectId,
      team: this.team,
      user: this.user,
      token: this.token,
    };
  }
}
