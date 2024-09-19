import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { TeamDto } from 'src/team/dtos/team.dto';

import { CommonDto } from '../../common/dtos/common.dto';
import { ProfileRewardEntity } from '../entities/profile-reward.entity';

export class ProfileRewardDto extends CommonDto {
  @ApiProperty()
  team: TeamDto;

  @ApiProperty()
  lastNameFieldTokenAmount: number;

  @ApiProperty()
  lastNameFieldKudosAmount: number;

  @ApiProperty()
  birthdayFieldTokenAmount: number;

  @ApiProperty()
  birthdayFieldKudosAmount: number;

  @ApiProperty()
  genderFieldTokenAmount: number;

  @ApiProperty()
  genderFieldKudosAmount: number;

  @ApiProperty()
  emailFieldTokenAmount: number;

  @ApiProperty()
  emailFieldKudosAmount: number;

  @ApiProperty()
  phoneFieldTokenAmount: number;

  @ApiProperty()
  phoneFieldKudosAmount: number;

  @ApiProperty()
  locationCountryFieldTokenAmount: number;

  @ApiProperty()
  locationCountryFieldKudosAmount: number;

  @ApiProperty()
  locationStateFieldTokenAmount: number;

  @ApiProperty()
  locationStateFieldKudosAmount: number;

  @ApiProperty()
  locationCityFieldTokenAmount: number;

  @ApiProperty()
  locationCityFieldKudosAmount: number;

  @ApiProperty()
  favPlayerFieldTokenAmount: number;

  @ApiProperty()
  favPlayerFieldKudosAmount: number;

  @ApiProperty()
  fanTypeFieldTokenAmount: number;

  @ApiProperty()
  fanTypeFieldKudosAmount: number;

  static toProfileRewardDto(profileReward: ProfileRewardEntity): ProfileRewardDto {
    return {
      id: profileReward.id,
      createdAt: profileReward.createdAt,
      updatedAt: profileReward.updatedAt,
      team: profileReward.team,
      lastNameFieldTokenAmount: profileReward.lastNameFieldTokenAmount,
      lastNameFieldKudosAmount: profileReward.lastNameFieldKudosAmount,
      birthdayFieldTokenAmount: profileReward.birthdayFieldTokenAmount,
      birthdayFieldKudosAmount: profileReward.birthdayFieldKudosAmount,
      genderFieldTokenAmount: profileReward.genderFieldTokenAmount,
      genderFieldKudosAmount: profileReward.genderFieldKudosAmount,
      emailFieldTokenAmount: profileReward.emailFieldTokenAmount,
      emailFieldKudosAmount: profileReward.emailFieldKudosAmount,
      phoneFieldTokenAmount: profileReward.phoneFieldTokenAmount,
      phoneFieldKudosAmount: profileReward.phoneFieldKudosAmount,
      locationCountryFieldTokenAmount: profileReward.locationCountryFieldTokenAmount,
      locationCountryFieldKudosAmount: profileReward.locationCountryFieldKudosAmount,
      locationStateFieldTokenAmount: profileReward.locationStateFieldTokenAmount,
      locationStateFieldKudosAmount: profileReward.locationStateFieldKudosAmount,
      locationCityFieldTokenAmount: profileReward.locationCityFieldTokenAmount,
      locationCityFieldKudosAmount: profileReward.locationCityFieldKudosAmount,
      favPlayerFieldTokenAmount: profileReward.favPlayerFieldTokenAmount,
      favPlayerFieldKudosAmount: profileReward.favPlayerFieldKudosAmount,
      fanTypeFieldTokenAmount: profileReward.fanTypeFieldTokenAmount,
      fanTypeFieldKudosAmount: profileReward.fanTypeFieldKudosAmount,
    };
  }
}

export class ProfileRewardRegisterDto {
  @ApiProperty()
  @IsUUID()
  teamId: string;

  @ApiProperty()
  @IsNumber()
  lastNameFieldTokenAmount: number;

  @ApiProperty()
  @IsNumber()
  lastNameFieldKudosAmount: number;

  @ApiProperty()
  @IsNumber()
  birthdayFieldTokenAmount: number;

  @ApiProperty()
  @IsNumber()
  birthdayFieldKudosAmount: number;

  @ApiProperty()
  @IsNumber()
  genderFieldTokenAmount: number;

  @ApiProperty()
  @IsNumber()
  genderFieldKudosAmount: number;

  @ApiProperty()
  @IsNumber()
  emailFieldTokenAmount: number;

  @ApiProperty()
  @IsNumber()
  emailFieldKudosAmount: number;

  @ApiProperty()
  @IsNumber()
  phoneFieldTokenAmount: number;

  @ApiProperty()
  @IsNumber()
  phoneFieldKudosAmount: number;

  @ApiProperty()
  @IsNumber()
  locationCountryFieldTokenAmount: number;

  @ApiProperty()
  @IsNumber()
  locationCountryFieldKudosAmount: number;

  @ApiProperty()
  @IsNumber()
  locationStateFieldTokenAmount: number;

  @ApiProperty()
  @IsNumber()
  locationStateFieldKudosAmount: number;

  @ApiProperty()
  @IsNumber()
  locationCityFieldTokenAmount: number;

  @ApiProperty()
  @IsNumber()
  locationCityFieldKudosAmount: number;

  @ApiProperty()
  @IsNumber()
  locationPostcodeFieldTokenAmount: number;

  @ApiProperty()
  @IsNumber()
  locationPostcodeFieldKudosAmount: number;

  @ApiProperty()
  @IsNumber()
  favPlayerFieldTokenAmount: number;

  @ApiProperty()
  @IsNumber()
  favPlayerFieldKudosAmount: number;

  @ApiProperty()
  @IsNumber()
  fanTypeFieldTokenAmount: number;

  @ApiProperty()
  @IsNumber()
  fanTypeFieldKudosAmount: number;
}
