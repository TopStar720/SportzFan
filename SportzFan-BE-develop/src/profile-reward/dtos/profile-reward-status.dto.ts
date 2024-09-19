import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsUUID } from 'class-validator';

import { UserDto } from '../../user/dto/user.dto';
import { CommonDto } from '../../common/dtos/common.dto';
import { ProfileRewardStatusEntity } from '../entities/profile-reward-status.entity';

export class ProfileRewardStatusDto extends CommonDto {
  @ApiProperty()
  user: UserDto;

  @ApiProperty()
  lastNameFieldFilled: boolean;

  @ApiProperty()
  birthdayFieldFilled: boolean;

  @ApiProperty()
  genderFieldFilled: boolean;

  @ApiProperty()
  emailFieldFilled: boolean;

  @ApiProperty()
  phoneFieldFilled: boolean;

  @ApiProperty()
  locationCountryFieldFilled: boolean;

  @ApiProperty()
  locationStateFieldFilled: boolean;

  @ApiProperty()
  locationCityFieldFilled: boolean;

  @ApiProperty()
  favPlayerFieldFilled: boolean;

  @ApiProperty()
  fanTypeFieldFilled: boolean;

  static toProfileRewardStatusDto(profileRewardStatus: ProfileRewardStatusEntity): ProfileRewardStatusDto {
    return {
      id: profileRewardStatus.id,
      createdAt: profileRewardStatus.createdAt,
      updatedAt: profileRewardStatus.updatedAt,
      user: profileRewardStatus.user,
      lastNameFieldFilled: profileRewardStatus.lastNameFieldFilled,
      birthdayFieldFilled: profileRewardStatus.birthdayFieldFilled,
      genderFieldFilled: profileRewardStatus.genderFieldFilled,
      emailFieldFilled: profileRewardStatus.emailFieldFilled,
      phoneFieldFilled: profileRewardStatus.phoneFieldFilled,
      locationCountryFieldFilled: profileRewardStatus.locationCountryFieldFilled,
      locationStateFieldFilled: profileRewardStatus.locationStateFieldFilled,
      locationCityFieldFilled: profileRewardStatus.locationCityFieldFilled,
      favPlayerFieldFilled: profileRewardStatus.favPlayerFieldFilled,
      fanTypeFieldFilled: profileRewardStatus.fanTypeFieldFilled
    };
  }
}

export class ProfileRewardStatusRegisterDto {
  @ApiProperty()
  @IsUUID()
  userId: string;

  @ApiProperty()
  @IsBoolean()
  lastNameFieldFilled: boolean;

  @ApiProperty()
  @IsBoolean()
  birthdayFieldFilled: boolean;

  @ApiProperty()
  @IsBoolean()
  genderFieldFilled: boolean;

  @ApiProperty()
  @IsBoolean()
  emailFieldFilled: boolean;

  @ApiProperty()
  @IsBoolean()
  phoneFieldFilled: boolean;

  @ApiProperty()
  @IsBoolean()
  locationCountryFieldFilled: boolean;

  @ApiProperty()
  @IsBoolean()
  locationStateFieldFilled: boolean;

  @ApiProperty()
  @IsBoolean()
  locationCityFieldFilled: boolean;

  @ApiProperty()
  @IsBoolean()
  favPlayerFieldFilled: boolean;

  @ApiProperty()
  @IsBoolean()
  fanTypeFieldFilled: boolean;
}
