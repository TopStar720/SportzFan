import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

import { CommonDto } from '../../common/dtos/common.dto';
import { UserEntity } from '../../user/entities/user.entity';
import { NotificationEntity } from '../entities/notification.entity';
import { PaginationDto } from '../../common/dtos/pagination.dto';

export enum NotificationType {
  SignUp = 'SignUp',
  GameAlive = 'GameAlive',
  ChallengeAlive = 'ChallengeAlive',
  PollAlive = 'PollAlive',
  GameEnded = 'GameEnded',
  PollEnded = 'PollEnded',
  ChallengeCompleted = 'ChallengeCompleted',
  Reward = 'Reward',
  Deposit = 'Deposit',
  Transfer = 'Transfer',
  LevelUp = 'LevelUp',
  NewAsset = 'NewAsset',
  MilestoneEligible = 'MilestoneEligible',
}

export enum NotificationCategoryType {
  Auth = 'Auth',
  Game = 'Game',
  Challenge = 'Challenge',
  Poll = 'Poll',
  Asset = 'Asset',
  TokenDeposit = 'TokenDeposit',
  LevelUp = 'LevelUp',
  TransferSent = 'TransferSent',
  TransferReceived = 'TransferReceived',
}

export class NotificationGetDto extends PaginationDto {
  @ApiProperty({ description: 'the seen flag', required: false })
  @IsString()
  @IsOptional()
  isSeen?: string;
}

export class NotificationDto extends CommonDto {
  @ApiProperty()
  user: UserEntity;

  @ApiProperty()
  type: string;

  @ApiProperty()
  category: NotificationCategoryType;

  @ApiProperty()
  section: string;

  @ApiProperty()
  uniqueId: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  detailContent: string;

  @ApiProperty()
  isSeen: boolean;

  static toNotificationDto(obj: NotificationEntity): NotificationDto {
    return {
      id: obj.id,
      createdAt: obj.createdAt,
      updatedAt: obj.updatedAt,
      user: obj.user,
      type: obj.type,
      category: obj.category,
      section: obj.section,
      uniqueId: obj.uniqueId,
      content: obj.content,
      detailContent: obj.detailContent,
      isSeen: obj.isSeen,
    };
  }
}

export class BroadCastMessageDto {
  @ApiProperty()
  @IsString()
  type: string;

  @ApiProperty()
  category: NotificationCategoryType;

  @ApiProperty()
  @IsString()
  section: string;

  @ApiProperty()
  @IsString()
  uniqueId: string;

  @ApiProperty()
  @IsString()
  content: string;
}

export class BroadCastTeamMessageDto {
  @ApiProperty()
  @IsString()
  type: string;

  @ApiProperty()
  @IsString()
  teamId: string;

  @ApiProperty()
  category: NotificationCategoryType;

  @ApiProperty()
  @IsString()
  section: string;

  @ApiProperty()
  @IsString()
  uniqueId: string;

  @ApiProperty()
  @IsString()
  content: string;
}

export class MessageDto {
  @ApiProperty()
  @IsUUID()
  userId: string;

  @ApiProperty()
  @IsString()
  type: string;

  @ApiProperty()
  category: NotificationCategoryType;

  @ApiProperty()
  @IsString()
  section: string;

  @ApiProperty()
  @IsString()
  uniqueId: string;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  detailContent?: string;
}

export class NotificationRegisterDto {
  @ApiProperty()
  @IsUUID()
  userId: string;

  @ApiProperty()
  @IsString()
  type: string;

  @ApiProperty()
  category: NotificationCategoryType;

  @ApiProperty()
  @IsString()
  section: string;

  @ApiProperty()
  @IsString()
  uniqueId: string;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  detailContent?: string;
}
