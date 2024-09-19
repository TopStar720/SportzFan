import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { Min } from 'class-validator';
import { Gender, UserRole } from 'src/common/models/base';

import { UserDto } from '../dto/user.dto';
import { SoftDelete } from '../../common/core/soft-delete';
import { TeamEntity } from '../../team/entities/team.entity';
import { TokenEntity } from '../../token/entities/token.entity';
import { TransactionEntity } from '../../transaction/entities/transaction.entity';
import { ProfileRewardStatusEntity } from '../../profile-reward/entities/profile-reward-status.entity';
import { PushNotificationHistoryEntity } from '../../push-notification/entities/push-notification-history.entity';

@Entity('user')
export class UserEntity extends SoftDelete {
  @Column({ name: 'team_id' })
  teamId: string;

  @ManyToOne(() => TeamEntity, { cascade: true })
  @JoinColumn({ name: 'team_id' })
  team: TeamEntity;

  @Column({ name: 'token_id' })
  tokenId: string;

  @ManyToOne(() => TokenEntity, { cascade: true })
  @JoinColumn({ name: 'token_id' })
  token: TokenEntity;

  @OneToMany(
    () => TransactionEntity,
    (transactionEntity) => transactionEntity.sender,
  )
  senderTransactions: TransactionEntity[];

  @OneToMany(
    () => TransactionEntity,
    (transactionEntity) => transactionEntity.receiver,
  )
  receiverTransactions: TransactionEntity[];

  @Column({ name: 'profile_reward__status_id', nullable: true })
  profileRewardStatusId: string;

  @OneToOne(
    () => ProfileRewardStatusEntity,
    (profileRewardStatusEntity) => profileRewardStatusEntity.user,
  )
  @JoinColumn({ name: 'profile_reward_id' })
  profileRewardStatus: ProfileRewardStatusEntity;

  @ManyToMany(
    () => PushNotificationHistoryEntity,
    (history) => history.receivers,
  )
  pushNotificationHistories: PushNotificationHistoryEntity[];

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ name: 'avatar', nullable: true })
  avatar: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ name: 'user_name', default: '' })
  userName: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.Fan })
  role: UserRole;

  @Column({ name: 'stripe_customer_id', nullable: true, default: null })
  stripeCustomerId: string;

  @Column({ name: 'birthday', nullable: true })
  birthday: string;

  @Column({ name: 'phone', nullable: true })
  phone: string;

  @Column({ name: 'gender', type: 'enum', enum: Gender, default: Gender.Unset })
  gender: Gender;

  @Column({ name: 'location_country', nullable: true })
  locationCountry: string;

  @Column({ name: 'location_state', nullable: true })
  locationState: string;

  @Column({ name: 'location_city', nullable: true })
  locationCity: string;

  @Column({ name: 'location_postcode', nullable: true })
  locationPostcode: string;

  @Column({ name: 'fav_player', nullable: true })
  favPlayer: string;

  @Column({ name: 'fan_type', nullable: true })
  fanType: string;

  @Column({
    name: 'kudos_amount',
    type: 'decimal',
    precision: 24,
    scale: 0,
    default: 0,
  })
  @Min(0)
  kudosAmount: number;

  @Column({
    name: 'token_amount',
    type: 'decimal',
    precision: 24,
    scale: 0,
    default: 0,
  })
  @Min(0)
  tokenAmount: number;

  @Column({ name: 'last_login_at', nullable: true })
  lastLoginAt: string;

  @Column({ name: 'is_verified', default: false })
  isVerified: boolean;

  @Column({ name: 'is_activated', default: true })
  isActivated: boolean;

  toUserDto(): UserDto {
    return {
      id: this.id,
      team: this.team,
      token: this.token,
      avatar: this.avatar,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      role: this.role,
      userName: this.userName,
      birthday: this.birthday,
      phone: this.phone,
      gender: this.gender,
      locationCountry: this.locationCountry,
      locationState: this.locationState,
      locationCity: this.locationCity,
      locationPostcode: this.locationPostcode,
      favPlayer: this.favPlayer,
      fanType: this.fanType,
      kudosAmount: this.kudosAmount,
      tokenAmount: this.tokenAmount,
      lastLoginAt: this.lastLoginAt,
      isVerified: this.isVerified,
      isActivated: this.isActivated,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
