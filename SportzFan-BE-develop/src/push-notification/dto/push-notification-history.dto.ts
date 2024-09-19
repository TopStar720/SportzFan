import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import {
  DirectionFilter,
  PushNotificationCriteriaType,
  PushNotificationSortFilter,
} from '../../common/models/base';
import { TeamDto } from '../../team/dtos/team.dto';
import { UserDto } from '../../user/dto/user.dto';
import { CommonDto } from '../../common/dtos/common.dto';
import { PaginationDto } from '../../common/dtos/pagination.dto';
import { PushNotificationHistoryEntity } from '../entities/push-notification-history.entity';

export class PushNotificationHistoryDto extends CommonDto {
  @ApiProperty({ description: 'the team' })
  team: TeamDto;

  @ApiProperty({ description: 'the user' })
  user: UserDto;

  @ApiProperty({ description: 'the push-notification info' })
  title: string;

  @ApiProperty({ description: 'the push-notification info' })
  message: string;

  @ApiProperty({ description: 'the push-notification info' })
  linkPage: string;

  @ApiProperty({ description: 'the push-notification info' })
  buttonLabel: string;

  @ApiProperty({ description: 'the push-notification info' })
  isSchedule: boolean;

  @ApiProperty({ description: 'the push-notification info' })
  scheduleDate: Date;

  @ApiProperty({ description: 'the push-notification info' })
  sendAll: boolean;

  @ApiProperty({ description: 'the push-notification info' })
  criteria: PushNotificationCriteriaType;

  @ApiProperty({ description: 'the push-notification info' })
  criteriaValue: string;

  @ApiProperty({ description: 'the push-notification info' })
  receivers: UserDto[];

  @ApiProperty({ description: 'the push-notification info' })
  isDraft: boolean;

  @ApiProperty({ description: 'the push-notification info' })
  isEnded: boolean;

  static toPushNotificationHistoryDto(
    object: PushNotificationHistoryEntity,
  ): PushNotificationHistoryDto {
    return {
      id: object.id,
      createdAt: object.createdAt,
      updatedAt: object.updatedAt,
      team: object.team,
      user: object.user,
      title: object.title,
      message: object.message,
      linkPage: object.linkPage,
      buttonLabel: object.buttonLabel,
      isSchedule: object.isSchedule,
      scheduleDate: object.scheduleDate,
      sendAll: object.sendAll,
      criteria: object.criteria,
      criteriaValue: object.criteriaValue,
      receivers: object.receivers,
      isDraft: object.isDraft,
      isEnded: object.isEnded,
    };
  }
}

export class PushNotificationHistoryRegisterDto {
  @ApiProperty({ description: 'the team' })
  @IsUUID()
  teamId: string;

  @ApiProperty({ description: 'the push-notification info' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'the push-notification info' })
  @IsString()
  message: string;

  @ApiProperty({ description: 'the push-notification info' })
  @IsString()
  linkPage: string;

  @ApiProperty({ description: 'the push-notification info' })
  @IsString()
  buttonLabel: string;

  @ApiProperty({ description: 'the push-notification info' })
  @IsBoolean()
  isSchedule: boolean;

  @ApiProperty({ description: 'the push-notification info' })
  @IsDateString()
  @IsOptional()
  scheduleDate?: Date;

  @ApiProperty({ description: 'the push-notification info' })
  @IsBoolean()
  sendAll: boolean;

  @ApiProperty({ description: 'the push-notification info' })
  @IsEnum(PushNotificationCriteriaType)
  criteria: PushNotificationCriteriaType;

  @ApiProperty({ description: 'the push-notification info' })
  @IsString()
  @IsOptional()
  criteriaValue?: string;

  @ApiProperty({ description: 'the draft flag' })
  @IsBoolean()
  isDraft: boolean;
}

export class PushNotificationHistoryListDto extends PaginationDto {
  @ApiProperty({
    description: 'the list search string',
    required: false,
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({
    description: 'the list team list string',
    required: false,
  })
  @IsString()
  @IsOptional()
  teams?: string;

  @ApiProperty({
    description: 'the list draft option (true/false)',
    required: false,
  })
  @IsString()
  @IsOptional()
  isDraft?: string;

  @ApiProperty({
    description: 'the list ended option (true/false)',
    required: false,
  })
  @IsString()
  @IsOptional()
  isEnded?: string;

  @ApiProperty({
    description: 'the push notification list filter',
    required: false,
  })
  @IsEnum(PushNotificationCriteriaType)
  @IsOptional()
  filter?: string;

  @ApiProperty({
    description: 'the user list team list string',
    required: false,
  })
  @IsEnum(PushNotificationSortFilter)
  @IsOptional()
  sort?: PushNotificationSortFilter;

  @ApiProperty({
    description: 'the user list team list string',
    required: false,
  })
  @IsEnum(DirectionFilter)
  @IsOptional()
  direction?: DirectionFilter;
}
