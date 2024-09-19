import { Min } from "class-validator";
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { SoftDelete } from '../../common/core/soft-delete';
import { ProfileRewardDto } from '../dtos/profile-reward.dto';
import { TeamEntity } from 'src/team/entities/team.entity';

@Entity('profile_reward')
export class ProfileRewardEntity extends SoftDelete {
  @Column({ name: 'team_id' })
  teamId: string;

  @OneToOne(() => TeamEntity, (teamEntity) => teamEntity.profileReward, { cascade: true })
  @JoinColumn({ name: 'team_id' })
  team: TeamEntity;

  @Column({ name: 'last_name_field_token_amount', default: 100 })
  @Min(0)
  lastNameFieldTokenAmount: number;

  @Column({ name: 'last_name_field_kudos_amount', default: 50 })
  @Min(0)
  lastNameFieldKudosAmount: number;

  @Column({ name: 'birthday_field_token_amount', default: 500 })
  @Min(0)
  birthdayFieldTokenAmount: number;

  @Column({ name: 'birthday_field_kudos_amount', default: 50 })
  @Min(0)
  birthdayFieldKudosAmount: number;

  @Column({ name: 'gender_field_token_amount', default: 500 })
  @Min(0)
  genderFieldTokenAmount: number;

  @Column({ name: 'gender_field_kudos_amount', default: 50 })
  @Min(0)
  genderFieldKudosAmount: number;

  @Column({ name: 'email_field_token_amount', default: 0 })
  @Min(0)
  emailFieldTokenAmount: number;

  @Column({ name: 'email_field_kudos_amount', default: 0 })
  @Min(0)
  emailFieldKudosAmount: number;

  @Column({ name: 'phone_field_token_amount', default: 500 })
  @Min(0)
  phoneFieldTokenAmount: number;

  @Column({ name: 'phone_field_kudos_amount', default: 100 })
  @Min(0)
  phoneFieldKudosAmount: number;

  @Column({ name: 'location_country_field_token_amount', default: 100 })
  @Min(0)
  locationCountryFieldTokenAmount: number;

  @Column({ name: 'location_country_field_kudos_amount', default: 30 })
  @Min(0)
  locationCountryFieldKudosAmount: number;

  @Column({ name: 'location_state_field_token_amount', default: 150 })
  @Min(0)
  locationStateFieldTokenAmount: number;

  @Column({ name: 'location_state_field_kudos_amount', default: 40 })
  @Min(0)
  locationStateFieldKudosAmount: number;

  @Column({ name: 'location_city_field_token_amount', default: 250 })
  @Min(0)
  locationCityFieldTokenAmount: number;

  @Column({ name: 'location_city_field_kudos_amount', default: 50 })
  @Min(0)
  locationCityFieldKudosAmount: number;

  @Column({ name: 'fav_player_field_token_amount', default: 400 })
  @Min(0)
  favPlayerFieldTokenAmount: number;

  @Column({ name: 'fav_player_field_kudos_amount', default: 50 })
  @Min(0)
  favPlayerFieldKudosAmount: number;

  @Column({ name: 'fan_type_field_token_amount', default: 500 })
  @Min(0)
  fanTypeFieldTokenAmount: number;

  @Column({ name: 'fan_type_field_kudos_amount', default: 500 })
  @Min(0)
  fanTypeFieldKudosAmount: number;

  toDto(): ProfileRewardDto {
    return {
      ...super.toDto(),
      team: this.team,
      lastNameFieldTokenAmount: this.lastNameFieldTokenAmount,
      lastNameFieldKudosAmount: this.lastNameFieldKudosAmount,
      birthdayFieldTokenAmount: this.birthdayFieldTokenAmount,
      birthdayFieldKudosAmount: this.birthdayFieldKudosAmount,
      genderFieldTokenAmount: this.genderFieldTokenAmount,
      genderFieldKudosAmount: this.genderFieldKudosAmount,
      emailFieldTokenAmount: this.emailFieldTokenAmount,
      emailFieldKudosAmount: this.emailFieldKudosAmount,
      phoneFieldTokenAmount: this.phoneFieldTokenAmount,
      phoneFieldKudosAmount: this.phoneFieldKudosAmount,
      locationCountryFieldTokenAmount: this.locationCountryFieldTokenAmount,
      locationCountryFieldKudosAmount: this.locationCountryFieldKudosAmount,
      locationStateFieldTokenAmount: this.locationStateFieldTokenAmount,
      locationStateFieldKudosAmount: this.locationStateFieldKudosAmount,
      locationCityFieldTokenAmount: this.locationCityFieldTokenAmount,
      locationCityFieldKudosAmount: this.locationCityFieldKudosAmount,
      favPlayerFieldTokenAmount: this.favPlayerFieldTokenAmount,
      favPlayerFieldKudosAmount: this.favPlayerFieldKudosAmount,
      fanTypeFieldTokenAmount: this.fanTypeFieldTokenAmount,
      fanTypeFieldKudosAmount: this.fanTypeFieldKudosAmount,
    };
  }
}
