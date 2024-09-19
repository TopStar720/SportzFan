import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';

import { TokenDto } from '../dtos/token.dto';
import { SoftDelete } from '../../common/core/soft-delete';
import { TeamEntity } from 'src/team/entities/team.entity';
import { UserEntity } from '../../user/entities/user.entity';

@Entity('token')
export class TokenEntity extends SoftDelete {
  @OneToMany(() => UserEntity, (userEntity) => userEntity.token)
  users: UserEntity[];

  @Column({ name: 'team_id' })
  teamId: string;

  @OneToOne(() => TeamEntity, (teamEntity) => teamEntity.token, { cascade: true })
  @JoinColumn({ name: 'team_id' })
  team: TeamEntity;

  @Column()
  symbol: string;

  @Column({ nullable: true })
  logo: string;

  @Column({
    name: 'fan_sale_fee',
    type: 'decimal',
    precision: 24,
    scale: 6,
    default: 0,
  })
  fanSaleFee: number;

  @Column({
    name: 'sponsor_sale_fee',
    type: 'decimal',
    precision: 24,
    scale: 6,
    default: 0,
  })
  sponsorSaleFee: number;

  @Column({ type: 'decimal', precision: 24, scale: 6, default: 0.001 })
  price: number;

  @Column({
    name: 'total_balance',
    type: 'decimal',
    precision: 24,
    scale: 0,
    default: 0,
  })
  totalBalance: number;

  toDto(): TokenDto {
    return {
      ...super.toDto(),
      team: this.team,
      symbol: this.symbol,
      logo: this.logo,
      fanSaleFee: this.fanSaleFee,
      sponsorSaleFee: this.sponsorSaleFee,
      price: this.price,
      totalBalance: this.totalBalance,
    };
  }
}
