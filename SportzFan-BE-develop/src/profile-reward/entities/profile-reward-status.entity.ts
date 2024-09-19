import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { SoftDelete } from '../../common/core/soft-delete';
import { UserEntity } from '../../user/entities/user.entity';
import { ProfileRewardStatusDto } from '../dtos/profile-reward-status.dto';

@Entity('profile_reward_status')
export class ProfileRewardStatusEntity extends SoftDelete {
  @Column({ name: 'user_id' })
  userId: string;

  @OneToOne(() => UserEntity, (userEntity) => userEntity.profileRewardStatus, { cascade: true })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'last_name_field_filled', default: false })
  lastNameFieldFilled: boolean;

  @Column({ name: 'birthday_field_filled', default: false })
  birthdayFieldFilled: boolean;

  @Column({ name: 'gender_field_filled', default: false })
  genderFieldFilled: boolean;

  @Column({ name: 'email_field_filled', default: false })
  emailFieldFilled: boolean;

  @Column({ name: 'phone_field_filled', default: false })
  phoneFieldFilled: boolean;

  @Column({ name: 'location_country_field_filled', default: false })
  locationCountryFieldFilled: boolean;

  @Column({ name: 'location_state_field_filled', default: false })
  locationStateFieldFilled: boolean;

  @Column({ name: 'location_city_field_filled', default: false })
  locationCityFieldFilled: boolean;

  @Column({ name: 'fav_player_field_filled', default: false })
  favPlayerFieldFilled: boolean;

  @Column({ name: 'fan_type_field_filled', default: false })
  fanTypeFieldFilled: boolean;

  toDto(): ProfileRewardStatusDto {
    return {
      ...super.toDto(),
      user: this.user,
      lastNameFieldFilled: this.lastNameFieldFilled,
      birthdayFieldFilled: this.birthdayFieldFilled,
      genderFieldFilled: this.genderFieldFilled,
      emailFieldFilled: this.emailFieldFilled,
      phoneFieldFilled: this.phoneFieldFilled,
      locationCountryFieldFilled: this.locationCountryFieldFilled,
      locationStateFieldFilled: this.locationStateFieldFilled,
      locationCityFieldFilled: this.locationCityFieldFilled,
      favPlayerFieldFilled: this.favPlayerFieldFilled,
      fanTypeFieldFilled: this.fanTypeFieldFilled
    };
  }
}
