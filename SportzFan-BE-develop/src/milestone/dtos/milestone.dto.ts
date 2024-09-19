import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

import { CommonDto } from '../../common/dtos/common.dto';
import { TeamDto } from 'src/team/dtos/team.dto';
import { MatchDto } from 'src/match/dtos/match.dto';
import { SponsorDto } from 'src/sponsor/dtos/sponsor.dto';
import { AssetDto } from '../../asset/dtos/asset.dto';
import { MilestoneEntity } from '../entities/milestone.entity';
import { PlayMilestoneDto } from './play-milestone.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

export class MilestoneDto extends CommonDto {
  @ApiProperty({ description: 'the team' })
  team: TeamDto;

  @ApiProperty({ description: 'the match' })
  match: MatchDto;

  @ApiProperty({ description: 'the sponsor' })
  sponsor: SponsorDto;

  @ApiProperty({ description: 'the asset' })
  asset: AssetDto;

  @ApiProperty({ description: 'the play milestone' })
  playMilestone: PlayMilestoneDto[];

  @ApiProperty({ description: 'the prediction title' })
  title: string;

  @ApiProperty({ description: 'the prediction description' })
  description: string;

  @ApiProperty({ description: 'the starte date' })
  start: Date;

  @ApiProperty({ description: 'the expiration date' })
  end: Date;

  @ApiProperty({ description: 'the eligiblity no of kudos points' })
  eligbleKudos: number;

  @ApiProperty({ description: 'the eligiblity no of tokens points' })
  eligbleToken: number;

  @ApiProperty({ description: 'the flag for checking in/out of venue' })
  anyWithVenue: boolean;

  @ApiProperty({ description: 'the flag for only checking in of venue' })
  onlyInVenue: boolean;

  @ApiProperty({ description: 'the reward kudos amount per player' })
  rewardKudosPerPlayer: number;

  @ApiProperty({ description: 'the reward token amount per player' })
  rewardTokenPerPlayer: number;

  @ApiProperty({ description: 'the flag that enable asset reward logic' })
  enableAssetReward: boolean;

  @ApiProperty({ description: 'the asset count per player' })
  rewardAssetCount: number;

  @ApiProperty({ description: 'the maximum number of winners' })
  winnerLimit: number;

  @ApiProperty({ description: 'the count of milestone occurs' })
  occurCount: number;

  @ApiProperty({ description: 'the draft flag' })
  isDraft: boolean;

  @ApiProperty({ description: 'the verification ended flag' })
  isEnded: boolean;

  static toMilestoneDto(milestone: MilestoneEntity): MilestoneDto {
    return {
      id: milestone.id,
      createdAt: milestone.createdAt,
      updatedAt: milestone.updatedAt,
      team: milestone.team,
      match: milestone.match,
      sponsor: milestone.sponsor,
      asset: milestone.asset,
      playMilestone: milestone.playMilestone,
      title: milestone.title,
      description: milestone.description,
      start: milestone.start,
      end: milestone.end,
      eligbleKudos: milestone.eligbleKudos,
      eligbleToken: milestone.eligbleToken,
      anyWithVenue: milestone.anyWithVenue,
      onlyInVenue: milestone.onlyInVenue,
      rewardKudosPerPlayer: milestone.rewardKudosPerPlayer,
      rewardTokenPerPlayer: milestone.rewardTokenPerPlayer,
      enableAssetReward: milestone.enableAssetReward,
      rewardAssetCount: milestone.rewardAssetCount,
      winnerLimit: milestone.winnerLimit,
      occurCount: milestone.occurCount,
      isDraft: milestone.isDraft,
      isEnded: milestone.isEnded,
    };
  }
}

export class MilestoneRegisterDto {
  @ApiProperty({ description: 'the team' })
  @IsUUID()
  teamId: string;

  @ApiProperty({ description: 'the match' })
  @IsUUID()
  matchId: string;

  @ApiProperty({ description: 'the sponsor' })
  @IsUUID()
  sponsorId: string;

  @ApiProperty({ description: 'the asset' })
  @IsUUID()
  @IsOptional()
  assetId?: string;

  @ApiProperty({ description: 'the title' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'the description' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'the start date' })
  @IsDateString()
  start: Date;

  @ApiProperty({ description: 'the expiration date' })
  @IsDateString()
  end: Date;

  @ApiProperty({ description: 'the eligiblity no of kudos points' })
  @IsNumber()
  eligbleKudos: number;

  @ApiProperty({ description: 'the eligiblity no of tokens points' })
  @IsNumber()
  eligbleToken: number;

  @ApiProperty({ description: 'the flag for checking in/out of venue' })
  @IsBoolean()
  anyWithVenue: boolean;

  @ApiProperty({ description: 'the flag for only checking in of venue' })
  @IsBoolean()
  onlyInVenue: boolean;

  @ApiProperty({ description: 'the reward kudos amount per player' })
  @IsNumber()
  rewardKudosPerPlayer: number;

  @ApiProperty({ description: 'the reward token amount per player' })
  @IsNumber()
  rewardTokenPerPlayer: number;

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
  isDraft: boolean;
}

export class MilestoneListDto extends PaginationDto {
  @ApiProperty({
    description: 'the milestone list search string',
    required: false,
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({
    description: 'the milestone list verfied option (true/false)',
    required: false,
  })
  @IsString()
  @IsOptional()
  isVerified?: string;
}
