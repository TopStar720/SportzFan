import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

import { UserDto } from '../../user/dto/user.dto';
import { TeamDto } from '../../team/dtos/team.dto';
import { MatchDto } from '../../match/dtos/match.dto';
import { CommonDto } from '../../common/dtos/common.dto';
import { TransactionEntity } from '../entities/transaction.entity';
import { TransactionStatus, TransactionType } from '../../common/models/base';

export class TransactionDto extends CommonDto {
  @ApiProperty({ description: 'the sender' })
  sender: UserDto;

  @ApiProperty({ description: 'the receiver' })
  receiver: UserDto;

  @ApiProperty({ description: 'the team' })
  team: TeamDto;

  @ApiProperty({ description: 'the match' })
  match: MatchDto;

  @ApiProperty({ description: 'the transaction type' })
  type: TransactionType;

  @ApiProperty({ description: 'the unique id' })
  uniqueId: string;

  @ApiProperty({ description: 'the kudos amount' })
  kudosAmount: number;

  @ApiProperty({ description: 'the token amount' })
  tokenAmount: number;

  @ApiProperty({ description: 'the transaction status' })
  status: TransactionStatus;

  @ApiProperty({
    description: 'the flag if the transaction is active/inactive',
  })
  isActivated: boolean;

  @ApiProperty({
    description: 'reason',
  })
  reason?: string;

  static toTransactionDto(transaction: TransactionEntity): TransactionDto {
    return {
      id: transaction.id,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
      sender: transaction.sender,
      receiver: transaction.receiver,
      team: transaction.team,
      match: transaction.match,
      type: transaction.type,
      uniqueId: transaction.uniqueId,
      status: transaction.status,
      kudosAmount: transaction.kudosAmount,
      tokenAmount: transaction.tokenAmount,
      isActivated: transaction.isActivated,
      reason: transaction.reason,
    };
  }
}

export class TransactionAnalysisDto {
  @ApiProperty({ description: 'the kudos amount' })
  @IsNumber()
  kudosAmount: number;

  @ApiProperty({ description: 'the token amount' })
  @IsNumber()
  tokenAmount: number;
}

export class TransferTransactionDto {
  @ApiProperty({ description: 'the receiver id' })
  @IsUUID()
  receiverId: string;

  @ApiProperty({ description: 'the kudos amount' })
  @IsNumber()
  kudosAmount: number;

  @ApiProperty({ description: 'the token amount' })
  @IsNumber()
  tokenAmount: number;

  @ApiProperty({ description: 'reason' })
  @IsString()
  reason: string;
}

export class TransactionRegisterDto {
  @ApiProperty({ description: 'the sender id' })
  @IsUUID()
  @IsOptional()
  senderId?: string;

  @ApiProperty({ description: 'the receiver id' })
  @IsUUID()
  receiverId: string;

  @ApiProperty({ description: 'the team id' })
  @IsUUID()
  teamId: string;

  @ApiProperty({ description: 'the match id' })
  @IsUUID()
  @IsOptional()
  matchId?: string;

  @ApiProperty({ description: 'the transaction type' })
  type: TransactionType;

  @ApiProperty({ description: 'the unique id' })
  @IsUUID()
  @IsOptional()
  uniqueId?: string;

  @ApiProperty({ description: 'the unique id' })
  @IsEnum(TransactionStatus)
  @IsOptional()
  status?: TransactionStatus;

  @ApiProperty({ description: 'the kudos amount' })
  @IsNumber()
  kudosAmount: number;

  @ApiProperty({ description: 'the token amount' })
  @IsNumber()
  tokenAmount: number;

  @ApiProperty({ description: 'the reason for transaction' })
  @IsString()
  @IsOptional()
  reason?: string;
}

export class TransactionUpdateDto {
  @ApiProperty({ description: 'the sender id' })
  @IsOptional()
  @IsUUID()
  senderId?: string;

  @ApiProperty({ description: 'the receiver id' })
  @IsOptional()
  @IsUUID()
  receiverId?: string;

  @ApiProperty({ description: 'the team id' })
  @IsOptional()
  @IsUUID()
  teamId?: string;

  @ApiProperty({ description: 'the match id' })
  @IsOptional()
  @IsUUID()
  matchId?: string;

  @ApiProperty({ description: 'the transaction type' })
  @IsOptional()
  type: TransactionType;

  @ApiProperty({ description: 'the unique id' })
  @IsOptional()
  @IsUUID()
  uniqueId?: string;

  @ApiProperty({ description: 'the unique id' })
  @IsOptional()
  @IsEnum(TransactionStatus)
  status?: TransactionStatus;

  @ApiProperty({ description: 'the kudos amount' })
  @IsOptional()
  @IsNumber()
  kudosAmount?: number;

  @ApiProperty({ description: 'the token amount' })
  @IsOptional()
  @IsNumber()
  tokenAmount?: number;
}

export class ActivityItemDto {
  @ApiProperty({ description: 'the transaction id' })
  id?: string;

  @ApiProperty({ description: 'the transaction type' })
  type: TransactionType;

  @ApiProperty({ description: 'the kudos amount' })
  kudosAmount: number;

  @ApiProperty({ description: 'the token amount' })
  tokenAmount: number;

  @ApiProperty({ description: 'the created dated' })
  createdAt: string;
}
