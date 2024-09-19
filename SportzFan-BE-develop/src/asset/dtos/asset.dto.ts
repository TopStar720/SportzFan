import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

import { CommonDto } from 'src/common/dtos/common.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { AssetSortFilter, DirectionFilter } from 'src/common/models/base';
import { TeamDto } from 'src/team/dtos/team.dto';
import { AssetCategory, AssetFilter, AssetType, ClaimType } from '../enums';
import { AssetCouponDto, AssetCouponRegisterDto } from './assetCoupon.dto';
import { AssetRedeemDto } from './assetRedeem.dto';

export class AssetDto extends CommonDto {
  @ApiProperty({ description: 'the type of asset' })
  type: AssetType;

  @ApiProperty({ description: 'the team id', nullable: true })
  team: TeamDto;

  @ApiProperty({ description: 'the sponsor id', nullable: true })
  sponsorId: string;

  @ApiProperty({ description: 'the category' })
  category: AssetCategory;

  @ApiProperty({ description: 'the title' })
  title: string;

  @ApiProperty({ description: 'the description' })
  description: string;

  @ApiProperty({ description: 'the image url' })
  imageUrl: string;

  @ApiProperty({ description: 'the start date & time' })
  start: Date;

  @ApiProperty({ description: 'the end date & time' })
  end: Date;

  @ApiProperty({
    description: 'the participants which shows all user or limit',
  })
  participate: number;

  @ApiProperty({
    description: 'the participants who redeemed',
    type: () => AssetRedeemDto,
    isArray: true,
  })
  participants: AssetRedeemDto[];

  @ApiProperty({
    description: 'the asset coupons',
    type: () => AssetCouponDto,
    isArray: true,
  })
  coupons: AssetCouponDto[];

  @ApiProperty({ description: 'the total asset count' })
  totalCount: number;

  @ApiProperty({ description: 'the max redeem per user' })
  maxPerUser: number;

  @ApiProperty({ description: 'the tokens required to redeem' })
  tokenRequired: number;

  @ApiProperty({ description: 'the eligible kudos point' })
  kudosEligible: number;

  @ApiProperty({ description: 'the eligible token amount' })
  tokenEligible: number;

  @ApiProperty({ description: 'the amount of reward Kudos points' })
  kudosReward: number;

  @ApiProperty({ description: 'the amount of reward token' })
  tokenReward: number;

  @ApiProperty({ description: 'the type of claim' })
  claimType: ClaimType;

  @ApiProperty({ description: 'the description of claim' })
  claimDescription: string;

  @ApiProperty()
  isDraft: boolean;

  @ApiProperty()
  claimUrl: string;

  @ApiProperty({ description: 'the flag presents this is bonus assets or not' })
  isBonus: boolean;
}

export class AssetRegisterDto {
  @ApiProperty({ description: 'the type of asset' })
  @IsEnum(AssetType)
  type: AssetType;

  @ApiProperty({ description: 'the team id', nullable: true })
  @IsUUID()
  teamId: string;

  @ApiProperty({ description: 'the sponsor id', nullable: true })
  @IsOptional()
  @IsUUID()
  sponsorId?: string;

  @ApiProperty({ description: 'the category id' })
  @IsEnum(AssetCategory)
  category: AssetCategory;

  @ApiProperty({ description: 'the title' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'the description' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'the image url' })
  @IsString()
  imageUrl: string;

  @ApiProperty({ description: 'the start date & time' })
  @IsDateString()
  start: Date;

  @ApiProperty({ description: 'the end date & time' })
  @IsDateString()
  end: Date;

  @ApiProperty({
    description: 'the participants which shows all user or limit',
  })
  @IsNumber()
  @IsOptional()
  participate?: number;

  @ApiProperty({
    description: 'the asset coupons',
    type: () => AssetCouponRegisterDto,
    isArray: true,
  })
  coupons?: AssetCouponRegisterDto[];

  @ApiProperty({ description: 'the total asset count' })
  @IsNumber()
  totalCount: number;

  @ApiProperty({ description: 'the max redeem per user' })
  @IsNumber()
  @IsOptional()
  maxPerUser?: number;

  @ApiProperty({ description: 'the tokens required to redeem' })
  @IsNumber()
  @IsOptional()
  tokenRequired?: number;

  @ApiProperty({ description: 'the eligible kudos point' })
  @IsNumber()
  @IsOptional()
  kudosEligible?: number;

  @ApiProperty({ description: 'the eligible token amount' })
  @IsNumber()
  @IsOptional()
  tokenEligible?: number;

  @ApiProperty({ description: 'the amount of reward Kudos points' })
  @IsNumber()
  @IsOptional()
  kudosReward?: number;

  @ApiProperty({ description: 'the amount of reward token' })
  @IsNumber()
  @IsOptional()
  tokenReward?: number;

  @ApiProperty({ description: 'the type of claim' })
  @IsEnum(ClaimType)
  claimType: ClaimType;

  @ApiProperty({ description: 'the description of claim' })
  @IsString()
  claimDescription: string;

  @ApiProperty()
  @IsBoolean()
  isDraft: boolean;

  @ApiProperty()
  @IsString()
  @IsOptional()
  claimUrl?: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isBonus?: boolean;
}

export class AssetUpdateDto {
  @ApiProperty({ description: 'the type of asset' })
  @IsEnum(AssetType)
  type: AssetType;

  @ApiProperty({ description: 'the team id', nullable: true })
  @IsUUID()
  teamId: string;

  @ApiProperty({ description: 'the sponsor id', nullable: true })
  @IsOptional()
  @IsUUID()
  sponsorId?: string;

  @ApiProperty({ description: 'the category id' })
  @IsEnum(AssetCategory)
  category: AssetCategory;

  @ApiProperty({ description: 'the title' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'the description' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'the image url' })
  @IsString()
  imageUrl: string;

  @ApiProperty({ description: 'the start date & time' })
  @IsDateString()
  start: Date;

  @ApiProperty({ description: 'the end date & time' })
  @IsDateString()
  end: Date;

  @ApiProperty({
    description: 'the participants which shows all user or limit',
  })
  @IsNumber()
  @IsOptional()
  participate?: number;

  @ApiProperty({
    description: 'the asset coupons',
    type: () => AssetCouponRegisterDto,
    isArray: true,
  })
  coupons?: AssetCouponRegisterDto[];

  @ApiProperty({ description: 'the total asset count' })
  @IsNumber()
  totalCount: number;

  @ApiProperty({ description: 'the max redeem per user' })
  @IsNumber()
  @IsOptional()
  maxPerUser?: number;

  @ApiProperty({ description: 'the tokens required to redeem' })
  @IsNumber()
  @IsOptional()
  tokenRequired?: number;

  @ApiProperty({ description: 'the eligible kudos point' })
  @IsNumber()
  @IsOptional()
  kudosEligible?: number;

  @ApiProperty({ description: 'the eligible token amount' })
  @IsNumber()
  @IsOptional()
  tokenEligible?: number;

  @ApiProperty({ description: 'the amount of reward Kudos points' })
  @IsNumber()
  @IsOptional()
  kudosReward?: number;

  @ApiProperty({ description: 'the amount of reward token' })
  @IsNumber()
  @IsOptional()
  tokenReward?: number;

  @ApiProperty({ description: 'the type of claim' })
  @IsEnum(ClaimType)
  claimType: ClaimType;

  @ApiProperty({ description: 'the description of claim' })
  @IsString()
  claimDescription: string;

  @ApiProperty()
  @IsBoolean()
  isDraft: boolean;

  @ApiProperty()
  @IsString()
  @IsOptional()
  claimUrl?: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isBonus?: boolean;
}

export class AssetDeleteDto {
  @ApiProperty({ description: 'the asset id' })
  id: string;
}

export class AssetListDto extends PaginationDto {
  @ApiProperty({ description: 'the asset list search', required: false })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({ description: 'the asset list filter', required: false })
  @IsEnum(AssetFilter)
  @IsOptional()
  filter: AssetFilter;

  @ApiProperty({ description: 'the asset list sort filter', required: false })
  @IsEnum(AssetSortFilter)
  @IsOptional()
  sort: AssetSortFilter;

  @ApiProperty({ description: 'the sort direction', required: false })
  @IsEnum(DirectionFilter)
  @IsOptional()
  direction: DirectionFilter;
}

export class UserAssetListDto extends PaginationDto {
  @ApiProperty({ description: 'the asset type', required: false })
  @IsEnum(AssetType)
  @IsOptional()
  readonly type: AssetType;
}

export class AssetListResultDto extends AssetDto {
  @ApiProperty({ description: 'puchase count(redeem count)' })
  purchaseCount: number;

  @ApiProperty({ description: 'claim count(redeem count)' })
  claimCount: number;
}
