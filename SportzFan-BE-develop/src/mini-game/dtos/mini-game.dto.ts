import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

import {
  BoosterType,
  MiniGameType,
  UnlockRewardType,
} from 'src/common/models/base';
import {
  MiniGameRewardDistributionDto,
  MiniGameRewardDistributionRegisterDto,
} from './mini-game-reward-distribution.dto';
import {
  MiniGameRewardActionDto,
  MiniGameRewardActionRegisterDto,
} from './mini-game-reward-action.dto';
import {
  MiniGameRewardMarketplaceItemDto,
  MiniGameRewardMarketplaceItemRegisterDto,
} from './mini-game-reward-marketplace-item.dto';
import { TeamDto } from 'src/team/dtos/team.dto';
import { MatchDto } from 'src/match/dtos/match.dto';
import { AssetDto } from '../../asset/dtos/asset.dto';
import { PlayMiniGameDto } from './play-mini-game.dto';
import { CommonDto } from '../../common/dtos/common.dto';
import { SponsorDto } from 'src/sponsor/dtos/sponsor.dto';
import { MiniGameEntity } from '../entities/mini-game.entity';

export class MiniGameDto extends CommonDto {
  @ApiProperty({ description: 'the team' })
  team: TeamDto;

  @ApiProperty({ description: 'the match' })
  match: MatchDto;

  @ApiProperty({ description: 'the miniGame title' })
  title: string;

  @ApiProperty({ description: 'the miniGame description' })
  description: string;

  @ApiProperty({ description: 'the mini game type' })
  type: MiniGameType;

  @ApiProperty({ description: 'the number of lives(start)' })
  lifeCount: number;

  @ApiProperty({ description: 'the life refresh time' })
  refreshTime: number;

  @ApiProperty({ description: 'the life refresh amount' })
  refreshAmount: number;

  @ApiProperty({ description: 'the starte date' })
  start: Date;

  @ApiProperty({ description: 'the expiration date' })
  end: Date;

  @ApiProperty({ description: 'the mini game logo' })
  logo: string;

  @ApiProperty({ description: 'the mini game background' })
  background: string;

  @ApiProperty({ description: 'the sponsor flag' })
  enableSponsor: boolean;

  @ApiProperty({ description: 'the sponsor' })
  sponsor: SponsorDto;

  @ApiProperty({ description: 'the sponsor logo' })
  sponsorLogo: string;

  @ApiProperty({ description: 'the booster type' })
  boosterType: BoosterType;

  @ApiProperty({ description: 'the booster logo' })
  boosterLogo: string;

  @ApiProperty({ description: 'the number of unlock reward' })
  unlockRewardNumber: number;

  @ApiProperty({ description: 'the number of reward send time' })
  rewardSendTimeNumber: number;

  @ApiProperty({ description: 'the unlock reward' })
  unlockReward: UnlockRewardType;

  @ApiProperty({ description: 'the eligiblity no of kudos points' })
  eligbleKudos: number;

  @ApiProperty({ description: 'the eligiblity no of tokens points' })
  eligbleToken: number;

  @ApiProperty({
    description: 'the reward no of kudos points for participation(Per player)',
  })
  rewardKudos: number;

  @ApiProperty({
    description: 'the reward no of token per player (Per campaign)',
  })
  rewardToken: number;

  @ApiProperty({ description: 'the no of kudos points total for winners' })
  rewardKudosWinnerTotal: number;

  @ApiProperty({ description: 'the no of tokes total for winners' })
  rewardTokenWinnerTotal: number;

  @ApiProperty({
    description: 'the winner distribution',
    type: () => MiniGameRewardDistributionDto,
    isArray: true,
  })
  rewardDistribution: MiniGameRewardDistributionDto[];

  @ApiProperty({
    description: 'the reward action',
    type: () => MiniGameRewardActionDto,
    isArray: true,
  })
  rewardAction: MiniGameRewardActionDto[];

  @ApiProperty({
    description: 'the winner marketplace item',
    type: () => MiniGameRewardMarketplaceItemDto,
    isArray: true,
  })
  rewardMarketplaceItem: MiniGameRewardMarketplaceItemDto[];

  @ApiProperty({ description: 'the asset' })
  asset: AssetDto;

  @ApiProperty({ description: 'the flag that enable asset reward logic' })
  enableAssetReward: boolean;

  @ApiProperty({ description: 'the asset count per player' })
  rewardAssetCount: number;

  @ApiProperty({ description: 'the maximum number of winners' })
  winnerLimit: number;

  @ApiProperty({
    type: () => PlayMiniGameDto,
    isArray: true,
  })
  playMiniGame: PlayMiniGameDto[];

  @ApiProperty({ description: 'the draft flag' })
  isDraft: boolean;

  @ApiProperty({ description: 'the verification ended flag' })
  isEnded: boolean;

  static toMiniGameDto(miniGame: MiniGameEntity): MiniGameDto {
    return {
      id: miniGame.id,
      createdAt: miniGame.createdAt,
      updatedAt: miniGame.updatedAt,
      team: miniGame.team,
      match: miniGame.match,
      title: miniGame.title,
      description: miniGame.description,
      type: miniGame.type,
      logo: miniGame.logo,
      background: miniGame.background,
      lifeCount: miniGame.lifeCount,
      refreshTime: miniGame.refreshTime,
      refreshAmount: miniGame.refreshAmount,
      start: miniGame.start,
      end: miniGame.end,
      enableSponsor: miniGame.enableSponsor,
      sponsor: miniGame.sponsor,
      sponsorLogo: miniGame.sponsorLogo,
      boosterType: miniGame.boosterType,
      boosterLogo: miniGame.boosterLogo,
      unlockRewardNumber: miniGame.unlockRewardNumber,
      rewardSendTimeNumber: miniGame.rewardSendTimeNumber,
      unlockReward: miniGame.unlockReward,
      eligbleKudos: miniGame.eligbleKudos,
      eligbleToken: miniGame.eligbleToken,
      rewardKudos: miniGame.rewardKudos,
      rewardToken: miniGame.rewardToken,
      rewardKudosWinnerTotal: miniGame.rewardKudosWinnerTotal,
      rewardTokenWinnerTotal: miniGame.rewardTokenWinnerTotal,
      rewardDistribution: miniGame.rewardDistribution,
      rewardAction: miniGame.rewardAction,
      rewardMarketplaceItem: miniGame.rewardMarketplaceItem,
      asset: miniGame.asset,
      enableAssetReward: miniGame.enableAssetReward,
      rewardAssetCount: miniGame.rewardAssetCount,
      winnerLimit: miniGame.winnerLimit,
      playMiniGame: miniGame.playMiniGame || [],
      isDraft: miniGame.isDraft,
      isEnded: miniGame.isEnded,
    };
  }
}

export class MiniGameRegisterDto {
  @ApiProperty({ description: 'the team' })
  @IsUUID()
  teamId: string;

  @ApiProperty({ description: 'the match' })
  @IsOptional()
  @IsUUID()
  matchId?: string;

  @ApiProperty({ description: 'the miniGame title' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'the miniGame description' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'the mini game type' })
  @IsEnum(MiniGameType)
  type: MiniGameType;

  @ApiProperty({ description: 'the number of lives(start)' })
  @IsNumber()
  lifeCount: number;

  @ApiProperty({ description: 'the life refresh time' })
  @IsNumber()
  refreshTime: number;

  @ApiProperty({ description: 'the life refresh amount' })
  @IsNumber()
  refreshAmount: number;

  @ApiProperty({ description: 'the starte date' })
  @IsDateString()
  start: Date;

  @ApiProperty({ description: 'the expiration date' })
  @IsDateString()
  end: Date;

  @ApiProperty({ description: 'the mini game logo' })
  @IsOptional()
  @IsString()
  logo?: string;

  @ApiProperty({ description: 'the mini game background' })
  @IsOptional()
  @IsString()
  background?: string;

  @ApiProperty({ description: 'the sponsor flag' })
  @IsOptional()
  @IsBoolean()
  enableSponsor?: boolean;

  @ApiProperty({ description: 'the sponsor' })
  @IsOptional()
  @IsUUID()
  sponsorId: string;

  @ApiProperty({ description: 'the sponsor logo' })
  @IsOptional()
  @IsString()
  sponsorLogo?: string;

  @ApiProperty({ description: 'the booster type' })
  @IsEnum(BoosterType)
  boosterType: BoosterType;

  @ApiProperty({ description: 'the booster logo' })
  @IsString()
  @IsOptional()
  boosterLogo: string;

  @ApiProperty({ description: 'the number of unlock reward' })
  @IsNumber()
  unlockRewardNumber: number;

  @ApiProperty({ description: 'the number of reward send time' })
  @IsNumber()
  rewardSendTimeNumber: number;

  @ApiProperty({ description: 'the unlock reward' })
  @IsEnum(UnlockRewardType)
  unlockReward: UnlockRewardType;

  @ApiProperty({ description: 'the eligiblity no of kudos points' })
  @IsNumber()
  eligbleKudos: number;

  @ApiProperty({ description: 'the eligiblity no of tokens points' })
  @IsNumber()
  eligbleToken: number;

  @ApiProperty({
    description: 'the reward no of kudos points for participation(Per player)',
  })
  @IsNumber()
  rewardKudos: number;

  @ApiProperty({
    description: 'the reward no of token per player(Per campaign)',
  })
  @IsNumber()
  rewardToken: number;

  @ApiProperty({ description: 'the no of kudos points total for winners' })
  @IsNumber()
  rewardKudosWinnerTotal: number;

  @ApiProperty({ description: 'the no of tokes total for winners' })
  @IsNumber()
  rewardTokenWinnerTotal: number;

  @ApiProperty({
    description: 'the winner distribution',
    type: () => MiniGameRewardDistributionRegisterDto,
    isArray: true,
  })
  @IsArray()
  rewardDistribution: MiniGameRewardDistributionRegisterDto[];

  @ApiProperty({
    description: 'the reward action',
    type: () => MiniGameRewardActionRegisterDto,
    isArray: true,
  })
  @IsArray()
  rewardAction: MiniGameRewardActionRegisterDto[];

  @ApiProperty({
    description: 'the reward marketplace item',
    type: () => MiniGameRewardMarketplaceItemRegisterDto,
    isArray: true,
  })
  @IsArray()
  rewardMarketplaceItem: MiniGameRewardMarketplaceItemRegisterDto[];

  @ApiProperty({ description: 'the asset' })
  @IsUUID()
  @IsOptional()
  assetId?: string;

  @ApiProperty({ description: 'the flag that enable asset reward logic' })
  @IsBoolean()
  enableAssetReward: boolean;

  @ApiProperty({ description: 'the asset count per player' })
  @IsNumber()
  rewardAssetCount: number;

  @ApiProperty({ description: 'the maximum number of winners' })
  @IsNumber()
  winnerLimit: number;

  @ApiProperty({ description: 'the draft flag' })
  @IsBoolean()
  @IsOptional()
  isDraft: boolean;
}
export class PlayMiniGameQueryParamDto {
  @ApiProperty({ description: 'Start Date', required: true })
  @IsDateString()
  start: Date;

  @ApiProperty({ description: 'End Date', required: true })
  @IsDateString()
  end: Date;
}
