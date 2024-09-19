import { ApiProperty } from '@nestjs/swagger';
import { CommonDto } from '../../common/dtos/common.dto';
import {
  IsEmail,
  IsBoolean,
  IsOptional,
  IsString,
  IsEnum,
  IsNumber,
} from 'class-validator';
import { TeamDto } from '../../team/dtos/team.dto';
import { TokenDto } from '../../token/dtos/token.dto';
import {
  DirectionFilter,
  GameType,
  Gender,
  UserRole,
  UserSortFilter,
} from 'src/common/models/base';
import { UserEntity } from '../entities/user.entity';
import { PaginationDto } from '../../common/dtos/pagination.dto';

export class UserDto extends CommonDto {
  @ApiProperty({ description: 'team' })
  team: TeamDto;

  @ApiProperty({ description: 'token' })
  token: TokenDto;

  @ApiProperty({ description: 'email' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'avatar' })
  @IsString()
  @IsOptional()
  avatar?: string;

  @ApiProperty({ description: 'first name' })
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'last name' })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({ description: 'user name' })
  @IsString()
  @IsOptional()
  userName?: string;

  @ApiProperty({ description: 'role' })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({ description: 'birthday' })
  @IsString()
  @IsOptional()
  birthday?: string;

  @ApiProperty({ description: 'phone' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ description: 'gender' })
  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @ApiProperty({ description: 'country' })
  @IsOptional()
  locationCountry?: string;

  @ApiProperty({ description: 'state' })
  @IsOptional()
  locationState?: string;

  @ApiProperty({ description: 'city' })
  @IsOptional()
  locationCity?: string;

  @ApiProperty({ description: 'postcode' })
  @IsOptional()
  locationPostcode?: string;

  @ApiProperty({ description: 'favPlayer' })
  @IsOptional()
  favPlayer?: string;

  @ApiProperty({ description: 'fanType' })
  @IsOptional()
  fanType?: string;

  @ApiProperty({ description: 'kudos amount' })
  @IsNumber()
  kudosAmount: number;

  @ApiProperty({ description: 'token amount' })
  @IsNumber()
  tokenAmount: number;

  @ApiProperty({ description: 'last login date' })
  @IsOptional()
  lastLoginAt?: string;

  @ApiProperty({ description: 'flag var for verification status' })
  @IsBoolean()
  @IsOptional()
  isVerified?: boolean;

  @ApiProperty({ description: 'flag var for activation status' })
  @IsBoolean()
  @IsOptional()
  isActivated?: boolean;

  static toUserDto(user: UserEntity): UserDto {
    return {
      id: user.id,
      team: user.team,
      token: user.token,
      avatar: user.avatar,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      userName: user.userName,
      birthday: user.birthday,
      phone: user.phone,
      gender: user.gender,
      locationCountry: user.locationCountry,
      locationState: user.locationState,
      locationCity: user.locationCity,
      locationPostcode: user.locationPostcode,
      favPlayer: user.favPlayer,
      fanType: user.fanType,
      kudosAmount: user.kudosAmount,
      tokenAmount: user.tokenAmount,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      isVerified: user.isVerified,
      isActivated: user.isActivated,
    };
  }
}

export class UserListDto extends PaginationDto {
  @ApiProperty({
    description: 'the user list search string for name, email and phone',
    required: false,
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({
    description: 'the user list team list string',
    required: false,
  })
  @IsString()
  @IsOptional()
  teams?: string;

  @ApiProperty({
    description: 'the user list team list string',
    required: false,
  })
  @IsEnum(UserSortFilter)
  @IsOptional()
  sort?: UserSortFilter;

  @ApiProperty({
    description: 'the user list team list string',
    required: false,
  })
  @IsEnum(DirectionFilter)
  @IsOptional()
  direction?: DirectionFilter;
}
export class DetailedLeaderboardListDto extends PaginationDto {
  @ApiProperty({ description: 'the start date for search', required: false })
  @IsString()
  @IsOptional()
  start?: string;

  @ApiProperty({ description: 'the end date for search', required: false })
  @IsString()
  @IsOptional()
  end?: string;

  @ApiProperty({ description: 'the game enum filter', required: false })
  @IsEnum(GameType)
  @IsOptional()
  game?: GameType;
}

export class UserRewardResponseDto {
  @ApiProperty({ description: 'kudos amount' })
  kudosAmount: number;

  @ApiProperty({ description: 'token amount' })
  tokenAmount: number;
}

export class UserUpdateResponseDto {
  @ApiProperty({ description: 'user' })
  user: UserDto;

  @ApiProperty({ description: 'reward' })
  reward: UserRewardResponseDto;
}

export class UserRegisterDto {
  @ApiProperty({ description: 'team id' })
  @IsString()
  teamId: string;

  @ApiProperty({ description: 'token id' })
  @IsString()
  @IsOptional()
  tokenId?: string;

  @ApiProperty({ description: 'email' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'password' })
  @IsString()
  password: string;

  @ApiProperty({ description: 'first name' })
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'last name' })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({ description: 'payload for mini-game' })
  @IsString()
  @IsOptional()
  payload?: string;
}

export class AdminRegisterDto {
  @ApiProperty({ description: 'team id' })
  @IsString()
  teamId: string;

  @ApiProperty({ description: 'token id' })
  @IsString()
  @IsOptional()
  tokenId?: string;

  @ApiProperty({ description: 'email' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'password' })
  @IsString()
  password: string;

  @ApiProperty({ description: 'first name' })
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'last name' })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({ description: 'role' })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({ description: 'flag var for verification status' })
  @IsBoolean()
  @IsOptional()
  isVerified?: boolean;
}

export class AdminUpdateDto {
  @ApiProperty({ description: 'team id' })
  @IsString()
  @IsOptional()
  teamId?: string;

  @ApiProperty({ description: 'token id' })
  @IsString()
  @IsOptional()
  tokenId?: string;

  @ApiProperty({ description: 'email' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'password' })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty({ description: 'first name' })
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'last name' })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({ description: 'role' })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @ApiProperty({ description: 'flag var for verification status' })
  @IsBoolean()
  @IsOptional()
  isVerified?: boolean;
}

export class UserUpdateDto {
  @ApiProperty({ description: 'avatar' })
  @IsString()
  @IsOptional()
  avatar?: string;

  @ApiProperty({ description: 'email' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'first name' })
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'last name' })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({ description: 'user name' })
  @IsString()
  @IsOptional()
  userName?: string;

  @ApiProperty({ description: 'birthday' })
  @IsString()
  @IsOptional()
  birthday?: string;

  @ApiProperty({ description: 'phone' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ description: 'gender' })
  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @ApiProperty({ description: 'country' })
  @IsOptional()
  locationCountry?: string;

  @ApiProperty({ description: 'state' })
  @IsOptional()
  locationState?: string;

  @ApiProperty({ description: 'city' })
  @IsOptional()
  locationCity?: string;

  @ApiProperty({ description: 'postcode' })
  @IsOptional()
  locationPostcode?: string;

  @ApiProperty({ description: 'favPlayer' })
  @IsOptional()
  favPlayer?: string;

  @ApiProperty({ description: 'fanType' })
  @IsOptional()
  fanType?: string;
}

export class UserResetPasswordRequestDto {
  @ApiProperty({ description: 'old password' })
  @IsString()
  oldPassword: string;

  @ApiProperty({ description: 'new password' })
  @IsString()
  newPassword: string;
}

export class LeaderboardDto {
  @ApiProperty({ description: 'rank' })
  @IsString()
  rank: string;

  @ApiProperty({ description: 'old rank' })
  @IsString()
  @IsOptional()
  old_rank?: string;

  @ApiProperty({ description: 'user id' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'first name' })
  @IsString()
  first_name: string;

  @ApiProperty({ description: 'last name' })
  @IsString()
  last_name: string;

  @ApiProperty({ description: 'kudos amount' })
  @IsString()
  kudos_amount: string;

  @ApiProperty({ description: 'token amount' })
  @IsString()
  token_amount: string;

  @ApiProperty({ description: 'kudos to tire 1' })
  @IsString()
  kudos_to_tire1: string;

  @ApiProperty({ description: 'kudos to tire 2' })
  @IsString()
  kudos_to_tire2: string;

  @ApiProperty({ description: 'kudos to tire 3' })
  @IsString()
  kudos_to_tire3: string;

  @ApiProperty({ description: 'kudos to tire 4' })
  @IsString()
  kudos_to_tire4: string;

  @ApiProperty({ description: 'member level name 1' })
  @IsString()
  member_level_name1: string;

  @ApiProperty({ description: 'member level name 2' })
  @IsString()
  member_level_name2: string;

  @ApiProperty({ description: 'member level name 3' })
  @IsString()
  member_level_name3: string;

  @ApiProperty({ description: 'member level name 4' })
  @IsString()
  member_level_name4: string;
}

export class UserBalanceDto {
  @ApiProperty({ description: 'team name' })
  @IsString()
  teamName: string;

  @ApiProperty({ description: 'email address' })
  @IsString()
  email: string;

  @ApiProperty({ description: 'kudos amount' })
  @IsString()
  kudosAmount: number;

  @ApiProperty({ description: 'token amount' })
  @IsString()
  tokenAmount: number;

  @ApiProperty({ description: 'price per token' })
  @IsString()
  price: string;

  @ApiProperty({ description: 'token symbol' })
  @IsString()
  symbol: string;
}

export class UserAnalysisDto {
  @ApiProperty({ description: 'game played count' })
  @IsNumber()
  gamePlayed: number;

  @ApiProperty({ description: 'game completed count' })
  @IsNumber()
  gameCompleted: number;

  @ApiProperty({ description: 'challenge played count' })
  @IsNumber()
  challengePlayed: number;

  @ApiProperty({ description: 'challenge completed count' })
  @IsNumber()
  challengeCompleted: number;

  @ApiProperty({ description: 'poll played count' })
  @IsNumber()
  pollPlayed: number;

  @ApiProperty({ description: 'poll completed count' })
  @IsNumber()
  pollCompleted: number;

  @ApiProperty({ description: 'redeemed asset count' })
  @IsNumber()
  redeemedAsset: number;

  @ApiProperty({ description: 'claimed asset count' })
  @IsNumber()
  claimedAsset: number;

  @ApiProperty({ description: 'tokens spent ton redemption count' })
  @IsNumber()
  spentRedemptionToken: number;
}
