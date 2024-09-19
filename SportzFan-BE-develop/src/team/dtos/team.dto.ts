import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

import { CommonDto } from '../../common/dtos/common.dto';
import { TeamEntity } from '../entities/team.entity';
import { BackgroundTheme, MembershipTier } from '../enums';
import { UserDto } from 'src/user/dto/user.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { FontType } from 'src/common/models/base';

export class TeamDto extends CommonDto {
  @ApiProperty({ description: 'the team name' })
  name: string;

  @ApiProperty({ description: 'the team description' })
  description: string;

  @ApiProperty({ description: 'the team logo URL' })
  logo: string;

  @ApiProperty({ description: 'the app logo URL' })
  appLogoImage: string;

  @ApiProperty({ description: 'the token id' })
  tokenId: string;

  @ApiProperty({ description: 'the sport id' })
  sportId: string;

  @ApiProperty({ description: 'the team platform Name' })
  platformName: string;

  @ApiProperty({ description: 'the team platform URL' })
  platformUrl: string;

  @ApiProperty({ description: 'the initial admin user id' })
  adminId: string;

  @ApiProperty({ description: 'the required kudos amount to hit Tire1' })
  kudosToTire1?: number;

  @ApiProperty({ description: 'the required kudos amount to hit Tire2' })
  kudosToTire2?: number;

  @ApiProperty({ description: 'the required kudos amount to hit Tire3' })
  kudosToTire3?: number;

  @ApiProperty({ description: 'the required kudos amount to hit Tire4' })
  kudosToTire4?: number;

  @ApiProperty({ description: 'the name of member tier level1' })
  memberLevelName1?: string;

  @ApiProperty({ description: 'the name of member tier level2' })
  memberLevelName2?: string;

  @ApiProperty({ description: 'the name of member tier level3' })
  memberLevelName3?: string;

  @ApiProperty({ description: 'the name of member tier level4' })
  memberLevelName4?: string;

  @ApiProperty({ description: 'the theme configuration' })
  backgroundTheme?: string;

  @ApiProperty({ description: 'the theme configuration' })
  landingPageBackgroundColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  landingPageBackgroundTopLayerColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  landingPageBackgroundBottomLayerColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  landingPageTextColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  authInputBackgroundColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  primaryTextColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  headingTextColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  menuTextColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  secondaryTextColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  primaryButtonColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  secondaryButtonColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  modalBackgroundColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  tabHighlightColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  buttonTextColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  tokenTextColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  kudosTextColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  kudosIconColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  dateTextColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  successColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  errorColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  warningColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  iconColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  landingPageCardColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  mainPageCardColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  mainPageBackgroundColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  mainPageHeaderColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  mainPageSidebarColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  membershipTierOneColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  membershipTierTwoColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  membershipTierThreeColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  membershipTierFourColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  landingPageHeroImage?: string;

  @ApiProperty({ description: 'the theme configuration' })
  primaryFont?: FontType;

  @ApiProperty({ description: 'the theme configuration' })
  secondaryFont?: FontType;

  @ApiProperty({ description: 'the reward configuration' })
  referralSignupTokenReward?: number;

  @ApiProperty({ description: 'the reward configuration' })
  referralSignupKudosReward?: number;

  @ApiProperty({ description: 'the reward configuration' })
  referralPlayTokenReward?: number;

  @ApiProperty({ description: 'the reward configuration' })
  referralPlayKudosReward?: number;

  @ApiProperty({ description: 'the reward configuration' })
  enableEarlySignupReward?: boolean;

  @ApiProperty({ description: 'the reward configuration' })
  earlySignupLimitCount?: number;

  @ApiProperty({ description: 'the reward configuration' })
  earlySignupTokenReward?: number;

  @ApiProperty({ description: 'the reward configuration' })
  earlySignupKudosReward?: number;

  @ApiProperty({ description: 'the reward configuration' })
  earlySignupAssetId?: string;

  @ApiProperty({ description: 'the reward configuration' })
  enableWeeklyReward?: boolean;

  @ApiProperty({ description: 'the reward configuration' })
  weeklyRewardLimitCount?: number;

  @ApiProperty({ description: 'the reward configuration' })
  weeklyTokenReward?: number;

  @ApiProperty({ description: 'the reward configuration' })
  weeklyKudosReward?: number;

  @ApiProperty({ description: 'the reward configuration' })
  weeklyAssetId?: string;

  @ApiProperty({ description: 'the membership tier' })
  membershipTier?: MembershipTier;

  @ApiProperty({ description: 'the membership tier updated' })
  membershipTierUpdated?: Date;

  @ApiProperty({ description: 'the pwa icon' })
  pwaIcon?: string;

  @ApiProperty({ description: 'the flag if the team is active/inactive' })
  isActivated: boolean;

  static toTeamDto(team: TeamEntity): TeamDto {
    return {
      id: team.id,
      createdAt: team.createdAt,
      updatedAt: team.updatedAt,
      name: team.name,
      description: team.description,
      logo: team.logo,
      appLogoImage: team.appLogoImage,
      tokenId: team.tokenId,
      sportId: team.sportId,
      platformName: team.platformName,
      platformUrl: team.platformUrl,
      adminId: team.adminId,
      kudosToTire1: team.kudosToTire1,
      kudosToTire2: team.kudosToTire2,
      kudosToTire3: team.kudosToTire3,
      kudosToTire4: team.kudosToTire4,
      memberLevelName1: team.memberLevelName1,
      memberLevelName2: team.memberLevelName2,
      memberLevelName3: team.memberLevelName3,
      memberLevelName4: team.memberLevelName4,
      backgroundTheme: team.backgroundTheme,
      landingPageBackgroundColor: team.landingPageBackgroundColor,
      landingPageBackgroundTopLayerColor:
        team.landingPageBackgroundTopLayerColor,
      landingPageBackgroundBottomLayerColor:
        team.landingPageBackgroundBottomLayerColor,
      landingPageTextColor: team.landingPageTextColor,
      authInputBackgroundColor: team.authInputBackgroundColor,
      primaryTextColor: team.primaryTextColor,
      headingTextColor: team.headingTextColor,
      menuTextColor: team.menuTextColor,
      secondaryTextColor: team.secondaryTextColor,
      primaryButtonColor: team.primaryButtonColor,
      secondaryButtonColor: team.secondaryButtonColor,
      modalBackgroundColor: team.modalBackgroundColor,
      tabHighlightColor: team.tabHighlightColor,
      buttonTextColor: team.buttonTextColor,
      tokenTextColor: team.tokenTextColor,
      kudosTextColor: team.kudosTextColor,
      kudosIconColor: team.kudosIconColor,
      dateTextColor: team.dateTextColor,
      successColor: team.successColor,
      errorColor: team.errorColor,
      warningColor: team.warningColor,
      iconColor: team.iconColor,
      landingPageCardColor: team.landingPageCardColor,
      mainPageCardColor: team.mainPageCardColor,
      mainPageBackgroundColor: team.mainPageBackgroundColor,
      mainPageHeaderColor: team.mainPageHeaderColor,
      mainPageSidebarColor: team.mainPageSidebarColor,
      membershipTierOneColor: team.membershipTierOneColor,
      membershipTierTwoColor: team.membershipTierTwoColor,
      membershipTierThreeColor: team.membershipTierThreeColor,
      membershipTierFourColor: team.membershipTierFourColor,
      landingPageHeroImage: team.landingPageHeroImage,
      primaryFont: team.primaryFont,
      secondaryFont: team.secondaryFont,
      referralSignupTokenReward: team.referralSignupTokenReward,
      referralSignupKudosReward: team.referralSignupKudosReward,
      referralPlayTokenReward: team.referralPlayTokenReward,
      referralPlayKudosReward: team.referralPlayKudosReward,
      enableEarlySignupReward: team.enableEarlySignupReward,
      earlySignupLimitCount: team.earlySignupLimitCount,
      earlySignupTokenReward: team.earlySignupTokenReward,
      earlySignupKudosReward: team.earlySignupKudosReward,
      earlySignupAssetId: team.earlySignupAssetId,
      enableWeeklyReward: team.enableWeeklyReward,
      weeklyRewardLimitCount: team.weeklyRewardLimitCount,
      weeklyTokenReward: team.weeklyTokenReward,
      weeklyKudosReward: team.weeklyKudosReward,
      weeklyAssetId: team.weeklyAssetId,
      membershipTier: team.membershipTier,
      membershipTierUpdated: team.membershipTierUpdated,
      pwaIcon: team.pwaIcon,
      isActivated: team.isActivated,
    };
  }
}

export class TeamRegisterDto {
  @ApiProperty({ description: 'the team name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'the team description' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'the team logo URL' })
  @IsString()
  logo: string;

  @ApiProperty({ description: 'the app logo URL' })
  @IsString()
  appLogoImage: string;

  @ApiProperty({ description: 'the team platform Name' })
  @IsString()
  platformName: string;

  @ApiProperty({ description: 'the team platform URL' })
  @IsString()
  platformUrl: string;

  @ApiProperty({ description: 'the team admins firstName' })
  @IsString()
  adminFirstName: string;

  @ApiProperty({ description: 'the team admin lastName' })
  @IsString()
  adminLastName: string;

  @ApiProperty({ description: 'the team admin email' })
  @IsEmail()
  adminEmail: string;

  @ApiProperty({ description: 'the team admin phone number' })
  @IsString()
  adminPhoneNumber: string;

  @ApiProperty({ description: 'the token symbol' })
  @IsString()
  @IsOptional()
  tokenSymbol?: string;

  @ApiProperty({ description: 'the token sale to fan(commission %)' })
  @IsNumber()
  @IsOptional()
  tokenSaleToFan?: number;

  @ApiProperty({ description: 'the token sale to sponsors(commission %)' })
  @IsNumber()
  @IsOptional()
  tokenSaleToSponsors?: number;

  @ApiProperty({ description: 'the price per token' })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiProperty({ description: 'the required kudos amount to hit Tire1' })
  @IsNumber()
  @IsOptional()
  kudosToTire1?: number;

  @ApiProperty({ description: 'the required kudos amount to hit Tire2' })
  @IsNumber()
  @IsOptional()
  kudosToTire2?: number;

  @ApiProperty({ description: 'the required kudos amount to hit Tire3' })
  @IsNumber()
  @IsOptional()
  kudosToTire3?: number;

  @ApiProperty({ description: 'the required kudos amount to hit Tire4' })
  @IsNumber()
  @IsOptional()
  kudosToTire4?: number;

  @ApiProperty({ description: 'the name of member tier level1' })
  @IsString()
  @IsOptional()
  memberLevelName1?: string;

  @ApiProperty({ description: 'the name of member tier level2' })
  @IsString()
  @IsOptional()
  memberLevelName2?: string;

  @ApiProperty({ description: 'the name of member tier level3' })
  @IsString()
  @IsOptional()
  memberLevelName3?: string;

  @ApiProperty({ description: 'the name of member tier level4' })
  @IsString()
  @IsOptional()
  memberLevelName4?: string;

  @ApiProperty({ description: 'the theme configuration' })
  @IsEnum(BackgroundTheme)
  @IsOptional()
  backgroundTheme?: BackgroundTheme;

  @ApiProperty({ description: 'the theme configuration' })
  @IsString()
  @IsOptional()
  landingPageBackgroundColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  @IsString()
  @IsOptional()
  landingPageBackgroundTopLayerColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  @IsString()
  @IsOptional()
  landingPageBackgroundBottomLayerColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  @IsString()
  @IsOptional()
  landingPageTextColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  @IsString()
  @IsOptional()
  authInputBackgroundColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  @IsString()
  @IsOptional()
  primaryTextColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  @IsString()
  @IsOptional()
  headingTextColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  @IsString()
  @IsOptional()
  menuTextColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  @IsString()
  @IsOptional()
  secondaryTextColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  @IsString()
  @IsOptional()
  primaryButtonColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  @IsString()
  @IsOptional()
  secondaryButtonColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  @IsString()
  @IsOptional()
  modalBackgroundColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  @IsString()
  @IsOptional()
  tabHighlightColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  @IsString()
  @IsOptional()
  buttonTextColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  @IsString()
  @IsOptional()
  tokenTextColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  @IsString()
  @IsOptional()
  kudosTextColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  @IsString()
  @IsOptional()
  kudosIconColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  @IsString()
  @IsOptional()
  dateTextColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  @IsString()
  @IsOptional()
  successColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  @IsString()
  @IsOptional()
  errorColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  @IsString()
  @IsOptional()
  warningColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  @IsString()
  @IsOptional()
  iconColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  @IsString()
  @IsOptional()
  landingPageCardColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  @IsString()
  @IsOptional()
  mainPageCardColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  @IsString()
  @IsOptional()
  mainPageBackgroundColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  @IsString()
  @IsOptional()
  mainPageHeaderColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  @IsString()
  @IsOptional()
  mainPageSidebarColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  @IsString()
  @IsOptional()
  membershipTierOneColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  @IsString()
  @IsOptional()
  membershipTierTwoColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  @IsString()
  @IsOptional()
  membershipTierThreeColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  @IsString()
  @IsOptional()
  membershipTierFourColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  @IsString()
  @IsOptional()
  landingPageHeroImage?: string;

  @ApiProperty({ description: 'the theme configuration' })
  @IsString()
  @IsOptional()
  tokenImage?: string;

  @ApiProperty({ description: 'the theme configuration' })
  @IsEnum(FontType)
  @IsOptional()
  primaryFont?: FontType;

  @ApiProperty({ description: 'the theme configuration' })
  @IsEnum(FontType)
  @IsOptional()
  secondaryFont?: FontType;

  @ApiProperty({ description: 'the reward configuration' })
  @IsNumber()
  @IsOptional()
  referralSignupTokenReward?: number;

  @ApiProperty({ description: 'the reward configuration' })
  @IsNumber()
  @IsOptional()
  referralSignupKudosReward?: number;

  @ApiProperty({ description: 'the reward configuration' })
  @IsNumber()
  @IsOptional()
  referralPlayTokenReward?: number;

  @ApiProperty({ description: 'the reward configuration' })
  @IsNumber()
  @IsOptional()
  referralPlayKudosReward?: number;

  @ApiProperty({ description: 'the reward configuration' })
  @IsBoolean()
  @IsOptional()
  enableEarlySignupReward?: boolean;

  @ApiProperty({ description: 'the reward configuration' })
  @IsNumber()
  @IsOptional()
  earlySignupLimitCount?: number;

  @ApiProperty({ description: 'the reward configuration' })
  @IsNumber()
  @IsOptional()
  earlySignupTokenReward?: number;

  @ApiProperty({ description: 'the reward configuration' })
  @IsNumber()
  @IsOptional()
  earlySignupKudosReward?: number;

  @ApiProperty({ description: 'the reward configuration' })
  @IsOptional()
  @IsUUID()
  earlySignupAssetId?: string;

  @ApiProperty({ description: 'the reward configuration' })
  @IsBoolean()
  @IsOptional()
  enableWeeklyReward?: boolean;

  @ApiProperty({ description: 'the reward configuration' })
  @IsNumber()
  @IsOptional()
  weeklyRewardLimitCount?: number;

  @ApiProperty({ description: 'the reward configuration' })
  @IsNumber()
  @IsOptional()
  weeklyTokenReward?: number;

  @ApiProperty({ description: 'the reward configuration' })
  @IsNumber()
  @IsOptional()
  weeklyKudosReward?: number;

  @ApiProperty({ description: 'the reward configuration' })
  @IsOptional()
  @IsUUID()
  weeklyAssetId?: string;

  @ApiProperty({ description: 'the sport id' })
  @IsOptional()
  @IsUUID()
  sportId?: string;

  @ApiProperty({ description: 'the pwa Icon' })
  @IsString()
  @IsOptional()
  pwaIcon?: string;
}

export class TeamUpdateDto {
  @ApiProperty({ description: 'the team name' })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({ description: 'the team description' })
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty({ description: 'the team logo URL' })
  @IsOptional()
  @IsString()
  logo: string;

  @ApiProperty({ description: 'the app logo URL' })
  @IsOptional()
  @IsString()
  appLogoImage: string;

  @ApiProperty({ description: 'the team platform Name' })
  @IsOptional()
  @IsString()
  platformName: string;

  @ApiProperty({ description: 'the team platform URL' })
  @IsOptional()
  @IsString()
  platformUrl: string;

  @ApiProperty({ description: 'the token symbol' })
  @IsString()
  @IsOptional()
  tokenSymbol?: string;

  @ApiProperty({ description: 'the token sale to fan(commission %)' })
  @IsOptional()
  @IsNumber()
  tokenSaleToFan: number;

  @ApiProperty({ description: 'the token sale to sponsors(commission %)' })
  @IsOptional()
  @IsNumber()
  tokenSaleToSponsors: number;

  @ApiProperty({ description: 'the price per token' })
  @IsOptional()
  @IsNumber()
  price: number;

  @ApiProperty({ description: 'the required kudos amount to hit Tire1' })
  @IsOptional()
  @IsNumber()
  kudosToTire1: number;

  @ApiProperty({ description: 'the required kudos amount to hit Tire2' })
  @IsOptional()
  @IsNumber()
  kudosToTire2: number;

  @ApiProperty({ description: 'the required kudos amount to hit Tire3' })
  @IsOptional()
  @IsNumber()
  kudosToTire3: number;

  @ApiProperty({ description: 'the required kudos amount to hit Tire4' })
  @IsOptional()
  @IsNumber()
  kudosToTire4: number;

  @ApiProperty({ description: 'the name of member tier level1' })
  @IsOptional()
  @IsString()
  memberLevelName1: string;

  @ApiProperty({ description: 'the name of member tier level2' })
  @IsOptional()
  @IsString()
  memberLevelName2: string;

  @ApiProperty({ description: 'the name of member tier level3' })
  @IsOptional()
  @IsString()
  memberLevelName3: string;

  @ApiProperty({ description: 'the name of member tier level4' })
  @IsOptional()
  @IsString()
  memberLevelName4: string;

  @ApiProperty({ description: 'the theme configuration' })
  @IsEnum(BackgroundTheme)
  @IsOptional()
  backgroundTheme?: BackgroundTheme;

  @ApiProperty({ description: 'the theme configuration' })
  @IsString()
  @IsOptional()
  landingPageBackgroundColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  @IsString()
  @IsOptional()
  landingPageBackgroundTopLayerColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  @IsString()
  @IsOptional()
  landingPageBackgroundBottomLayerColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  @IsString()
  @IsOptional()
  landingPageTextColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  @IsString()
  @IsOptional()
  authInputBackgroundColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  @IsString()
  @IsOptional()
  primaryTextColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  @IsString()
  @IsOptional()
  headingTextColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  @IsString()
  @IsOptional()
  menuTextColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  @IsString()
  @IsOptional()
  secondaryTextColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  @IsString()
  @IsOptional()
  primaryButtonColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  @IsString()
  @IsOptional()
  secondaryButtonColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  @IsString()
  @IsOptional()
  modalBackgroundColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  @IsString()
  @IsOptional()
  tabHighlightColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  @IsString()
  @IsOptional()
  buttonTextColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  @IsString()
  @IsOptional()
  tokenTextColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  @IsString()
  @IsOptional()
  kudosTextColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  @IsString()
  @IsOptional()
  kudosIconColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  @IsString()
  @IsOptional()
  dateTextColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  @IsString()
  @IsOptional()
  successColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  @IsString()
  @IsOptional()
  errorColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  @IsString()
  @IsOptional()
  warningColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  @IsString()
  @IsOptional()
  iconColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  @IsString()
  @IsOptional()
  landingPageCardColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  @IsString()
  @IsOptional()
  mainPageCardColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  @IsString()
  @IsOptional()
  mainPageBackgroundColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  @IsString()
  @IsOptional()
  mainPageHeaderColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  @IsString()
  @IsOptional()
  mainPageSidebarColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  @IsString()
  @IsOptional()
  membershipTierOneColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  @IsString()
  @IsOptional()
  membershipTierTwoColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  @IsString()
  @IsOptional()
  membershipTierThreeColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  @IsString()
  @IsOptional()
  membershipTierFourColor?: string;

  @ApiProperty({ description: 'the theme configuration' })
  @IsString()
  @IsOptional()
  landingPageHeroImage?: string;

  @ApiProperty({ description: 'the theme configuration' })
  @IsString()
  @IsOptional()
  tokenImage?: string;

  @ApiProperty({ description: 'the theme configuration' })
  @IsEnum(FontType)
  @IsOptional()
  primaryFont?: FontType;

  @ApiProperty({ description: 'the theme configuration' })
  @IsEnum(FontType)
  @IsOptional()
  secondaryFont?: FontType;

  @ApiProperty({ description: 'the reward configuration' })
  @IsNumber()
  @IsOptional()
  referralSignupTokenReward?: number;

  @ApiProperty({ description: 'the reward configuration' })
  @IsNumber()
  @IsOptional()
  referralSignupKudosReward?: number;

  @ApiProperty({ description: 'the reward configuration' })
  @IsNumber()
  @IsOptional()
  referralPlayTokenReward?: number;

  @ApiProperty({ description: 'the reward configuration' })
  @IsNumber()
  @IsOptional()
  referralPlayKudosReward?: number;

  @ApiProperty({ description: 'the reward configuration' })
  @IsBoolean()
  @IsOptional()
  enableEarlySignupReward?: boolean;

  @ApiProperty({ description: 'the reward configuration' })
  @IsNumber()
  @IsOptional()
  earlySignupLimitCount?: number;

  @ApiProperty({ description: 'the reward configuration' })
  @IsNumber()
  @IsOptional()
  earlySignupTokenReward?: number;

  @ApiProperty({ description: 'the reward configuration' })
  @IsNumber()
  @IsOptional()
  earlySignupKudosReward?: number;

  @ApiProperty({ description: 'the reward configuration' })
  @IsOptional()
  @IsUUID()
  earlySignupAssetId?: string;

  @ApiProperty({ description: 'the reward configuration' })
  @IsBoolean()
  @IsOptional()
  enableWeeklyReward?: boolean;

  @ApiProperty({ description: 'the reward configuration' })
  @IsNumber()
  @IsOptional()
  weeklyRewardLimitCount?: number;

  @ApiProperty({ description: 'the reward configuration' })
  @IsNumber()
  @IsOptional()
  weeklyTokenReward?: number;

  @ApiProperty({ description: 'the reward configuration' })
  @IsNumber()
  @IsOptional()
  weeklyKudosReward?: number;

  @ApiProperty({ description: 'the reward configuration' })
  @IsOptional()
  @IsUUID()
  weeklyAssetId?: string;

  @ApiProperty({ description: 'the sport id' })
  @IsOptional()
  @IsUUID()
  sportId?: string;

  @ApiProperty({ description: 'the pwa Icon' })
  @IsString()
  @IsOptional()
  pwaIcon?: string;
}

export class PlatformRegisterDto {
  @ApiProperty({ description: 'the team name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'the team admin email' })
  @IsEmail()
  adminEmail: string;

  @ApiProperty({ description: 'the team admin password' })
  @IsString()
  @IsNotEmpty()
  adminPassword: string;

  @ApiProperty({ description: 'the team platform URL' })
  @IsString()
  platformUrl: string;

  @ApiProperty({ description: 'the team theme color' })
  @IsEnum(BackgroundTheme)
  themeColor: BackgroundTheme;

  @ApiProperty({ description: 'the team app logo URL' })
  @IsString()
  appLogoImage: string;

  @ApiProperty({ description: 'the team membership tier' })
  @IsEnum(MembershipTier)
  membershipTier: MembershipTier;

  @ApiProperty({ description: 'the sport id' })
  @IsOptional()
  @IsUUID()
  sportId?: string;
}

export class TeamListDto extends PaginationDto {
  @ApiProperty({
    description: 'the team list search string',
    required: false,
  })
  @IsString()
  @IsOptional()
  search?: string;
}

export class DetailedTeamDto {
  @ApiProperty({ description: 'team info' })
  team: TeamDto;

  @ApiProperty({ description: 'admin info' })
  admin: UserDto;
}
