import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  ManyToOne,
} from 'typeorm';

import { MembershipTier } from '../enums';
import { TeamDto } from '../dtos/team.dto';
import { SoftDelete } from '../../common/core/soft-delete';
import { UserEntity } from '../../user/entities/user.entity';
import { TokenEntity } from '../../token/entities/token.entity';
import { TransactionEntity } from '../../transaction/entities/transaction.entity';
import { ProfileRewardEntity } from '../../profile-reward/entities/profile-reward.entity';
import { PlayerEntity } from '../../player/entities/player.entity';
import { SportsEntity } from 'src/sports/entities/sports.entity';
import { FontType } from 'src/common/models/base';

@Entity('team')
export class TeamEntity extends SoftDelete {
  @OneToMany(() => UserEntity, (userEntity) => userEntity.team)
  users: UserEntity[];

  @OneToMany(
    () => TransactionEntity,
    (transactionEntity) => transactionEntity.team,
  )
  transactions: TransactionEntity[];

  @OneToMany(() => PlayerEntity, (playerEntity) => playerEntity.team)
  players: PlayerEntity[];

  @Column({ name: 'token_id', nullable: true })
  tokenId: string;

  @OneToOne(() => TokenEntity, (tokenEntity) => tokenEntity.team)
  @JoinColumn({ name: 'token_id' })
  token: TokenEntity;

  @Column({ name: 'sport_id', nullable: true })
  sportId: string;

  @ManyToOne(() => SportsEntity, { cascade: true })
  @JoinColumn({ name: 'sport_id' })
  sport: SportsEntity;

  @Column({ name: 'profile_reward_id', nullable: true })
  profileRewardId: string;

  @OneToOne(
    () => ProfileRewardEntity,
    (profileRewardEntity) => profileRewardEntity.team,
  )
  @JoinColumn({ name: 'profile_reward_id' })
  profileReward: ProfileRewardEntity;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  logo: string;

  @Column({ name: 'app_logo_image', default: '' })
  appLogoImage: string;

  @Column({ nullable: true })
  platformName: string;

  @Column({ nullable: true })
  platformUrl: string;

  @Column({ name: 'admin_id', nullable: true })
  adminId: string;

  @Column({ name: 'kudos_to_tire1', nullable: true })
  kudosToTire1: number;

  @Column({ name: 'kudos_to_tire2', nullable: true })
  kudosToTire2: number;

  @Column({ name: 'kudos_to_tire3', nullable: true })
  kudosToTire3: number;

  @Column({ name: 'kudos_to_tire4', nullable: true })
  kudosToTire4: number;

  @Column({ name: 'member_level_name1', nullable: true })
  memberLevelName1: string;

  @Column({ name: 'member_level_name2', nullable: true })
  memberLevelName2: string;

  @Column({ name: 'member_level_name3', nullable: true })
  memberLevelName3: string;

  @Column({ name: 'member_level_name4', nullable: true })
  memberLevelName4: string;

  @Column({ name: 'background_theme', nullable: true })
  backgroundTheme: string;

  @Column({ name: 'landing_page_bg_color', nullable: true })
  landingPageBackgroundColor: string;

  @Column({ name: 'landing_page_bg_top_layer_color', nullable: true })
  landingPageBackgroundTopLayerColor: string;

  @Column({ name: 'landing_page_bg_bottom_layer_color', nullable: true })
  landingPageBackgroundBottomLayerColor: string;

  @Column({ name: 'landing_page_text_color', nullable: true })
  landingPageTextColor: string;

  @Column({ name: 'auth_input_bg_color', nullable: true })
  authInputBackgroundColor: string;

  @Column({ name: 'primary_text_color', nullable: true })
  primaryTextColor: string;

  @Column({ name: 'heading_text_color', nullable: true })
  headingTextColor: string;

  @Column({ name: 'menu_text_color', nullable: true })
  menuTextColor: string;

  @Column({ name: 'secondary_text_color', nullable: true })
  secondaryTextColor: string;

  @Column({ name: 'primary_button_color', nullable: true })
  primaryButtonColor: string;

  @Column({ name: 'secondary_button_color', nullable: true })
  secondaryButtonColor: string;

  @Column({ name: 'modal_bg_color', nullable: true })
  modalBackgroundColor: string;

  @Column({ name: 'tab_highlight_color', nullable: true })
  tabHighlightColor: string;

  @Column({ name: 'button_text_color', nullable: true })
  buttonTextColor: string;

  @Column({ name: 'token_text_color', nullable: true })
  tokenTextColor: string;

  @Column({ name: 'kudos_text_color', nullable: true })
  kudosTextColor: string;

  @Column({ name: 'kudos_icon_color', nullable: true })
  kudosIconColor: string;

  @Column({ name: 'date_text_color', nullable: true })
  dateTextColor: string;

  @Column({ name: 'success_color', nullable: true })
  successColor: string;

  @Column({ name: 'error_color', nullable: true })
  errorColor: string;

  @Column({ name: 'warning_color', nullable: true })
  warningColor: string;

  @Column({ name: 'icon_color', nullable: true })
  iconColor: string;

  @Column({ name: 'landing_page_card_color', nullable: true })
  landingPageCardColor: string;

  @Column({ name: 'main_page_card_color', nullable: true })
  mainPageCardColor: string;

  @Column({ name: 'main_page_bg_color', nullable: true })
  mainPageBackgroundColor: string;

  @Column({ name: 'main_page_header_color', nullable: true })
  mainPageHeaderColor: string;

  @Column({ name: 'main_page_sidebar_color', nullable: true })
  mainPageSidebarColor: string;

  @Column({ name: 'membership_tier_one_color', nullable: true })
  membershipTierOneColor: string;

  @Column({ name: 'membership_tier_two_color', nullable: true })
  membershipTierTwoColor: string;

  @Column({ name: 'membership_tier_three_color', nullable: true })
  membershipTierThreeColor: string;

  @Column({ name: 'membership_tier_four_color', nullable: true })
  membershipTierFourColor: string;

  @Column({ name: 'landing_page_hero_img', nullable: true })
  landingPageHeroImage: string;

  @Column({ name: 'primary_font', default: FontType.Goldman })
  primaryFont: FontType;

  @Column({ name: 'secondary_font', default: FontType.Goldman })
  secondaryFont: FontType;

  @Column({ name: 'referral_signup_token_reward', default: 0 })
  referralSignupTokenReward: number;

  @Column({ name: 'referral_signup_kudos_reward', default: 0 })
  referralSignupKudosReward: number;

  @Column({ name: 'referral_play_token_reward', default: 0 })
  referralPlayTokenReward: number;

  @Column({ name: 'referral_play_kudos_reward', default: 0 })
  referralPlayKudosReward: number;

  @Column({ name: 'enable_early_signup_reward', default: false })
  enableEarlySignupReward: boolean;

  @Column({ name: 'early_signup_limit_count', default: 0 })
  earlySignupLimitCount: number;

  @Column({ name: 'early_signup_token_reward', default: 0 })
  earlySignupTokenReward: number;

  @Column({ name: 'early_signup_kudos_reward', default: 0 })
  earlySignupKudosReward: number;

  @Column({ name: 'early_signup_asset_id', nullable: true })
  earlySignupAssetId: string;

  @Column({ name: 'enable_weekly_reward', default: false })
  enableWeeklyReward: boolean;

  @Column({ name: 'weekly_reward_limit_count', default: 0 })
  weeklyRewardLimitCount: number;

  @Column({ name: 'weekly_token_reward', default: 0 })
  weeklyTokenReward: number;

  @Column({ name: 'weekly_kudos_reward', default: 0 })
  weeklyKudosReward: number;

  @Column({ name: 'weekly_asset_id', nullable: true })
  weeklyAssetId: string;

  @Column({ name: 'membership_tier', nullable: true })
  membershipTier: MembershipTier;

  @Column({ name: 'membership_tier_updated', nullable: true })
  membershipTierUpdated: Date;

  @Column({ name: 'pwa_icon', default: '' })
  pwaIcon: string;

  @Column({ name: 'is_activated' })
  isActivated: boolean;

  toDto(): TeamDto {
    return {
      ...super.toDto(),
      name: this.name,
      description: this.description,
      logo: this.logo,
      appLogoImage: this.appLogoImage,
      tokenId: this.tokenId,
      sportId: this.sportId,
      platformName: this.platformName,
      platformUrl: this.platformUrl,
      adminId: this.adminId,
      kudosToTire1: this.kudosToTire1,
      kudosToTire2: this.kudosToTire2,
      kudosToTire3: this.kudosToTire3,
      kudosToTire4: this.kudosToTire4,
      memberLevelName1: this.memberLevelName1,
      memberLevelName2: this.memberLevelName2,
      memberLevelName3: this.memberLevelName3,
      memberLevelName4: this.memberLevelName4,
      backgroundTheme: this.backgroundTheme,
      landingPageBackgroundColor: this.landingPageBackgroundColor,
      landingPageBackgroundTopLayerColor:
        this.landingPageBackgroundTopLayerColor,
      landingPageBackgroundBottomLayerColor:
        this.landingPageBackgroundBottomLayerColor,
      landingPageTextColor: this.landingPageTextColor,
      authInputBackgroundColor: this.authInputBackgroundColor,
      primaryTextColor: this.primaryTextColor,
      headingTextColor: this.headingTextColor,
      menuTextColor: this.menuTextColor,
      secondaryTextColor: this.secondaryTextColor,
      primaryButtonColor: this.primaryButtonColor,
      secondaryButtonColor: this.secondaryButtonColor,
      modalBackgroundColor: this.modalBackgroundColor,
      tabHighlightColor: this.tabHighlightColor,
      buttonTextColor: this.buttonTextColor,
      tokenTextColor: this.tokenTextColor,
      kudosTextColor: this.kudosTextColor,
      kudosIconColor: this.kudosIconColor,
      dateTextColor: this.dateTextColor,
      successColor: this.successColor,
      errorColor: this.errorColor,
      warningColor: this.warningColor,
      iconColor: this.iconColor,
      landingPageCardColor: this.landingPageCardColor,
      mainPageCardColor: this.mainPageCardColor,
      mainPageBackgroundColor: this.mainPageBackgroundColor,
      mainPageHeaderColor: this.mainPageHeaderColor,
      mainPageSidebarColor: this.mainPageSidebarColor,
      membershipTierOneColor: this.membershipTierOneColor,
      membershipTierTwoColor: this.membershipTierTwoColor,
      membershipTierThreeColor: this.membershipTierThreeColor,
      membershipTierFourColor: this.membershipTierFourColor,
      landingPageHeroImage: this.landingPageHeroImage,
      primaryFont: this.primaryFont,
      secondaryFont: this.secondaryFont,
      referralSignupTokenReward: this.referralSignupTokenReward,
      referralSignupKudosReward: this.referralSignupKudosReward,
      referralPlayTokenReward: this.referralPlayTokenReward,
      referralPlayKudosReward: this.referralPlayKudosReward,
      enableEarlySignupReward: this.enableEarlySignupReward,
      earlySignupLimitCount: this.earlySignupLimitCount,
      earlySignupTokenReward: this.earlySignupTokenReward,
      earlySignupKudosReward: this.earlySignupKudosReward,
      earlySignupAssetId: this.earlySignupAssetId,
      enableWeeklyReward: this.enableWeeklyReward,
      weeklyRewardLimitCount: this.weeklyRewardLimitCount,
      weeklyTokenReward: this.weeklyTokenReward,
      weeklyKudosReward: this.weeklyKudosReward,
      weeklyAssetId: this.weeklyAssetId,
      membershipTier: this.membershipTier,
      membershipTierUpdated: this.membershipTierUpdated,
      pwaIcon: this.pwaIcon,
      isActivated: this.isActivated,
    };
  }
}
