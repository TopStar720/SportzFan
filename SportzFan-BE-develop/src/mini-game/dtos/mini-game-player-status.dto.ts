import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsString, IsUUID } from 'class-validator';

import { CommonDto } from '../../common/dtos/common.dto';
import { UserDto } from 'src/user/dto/user.dto';
import { MiniGameDto } from './mini-game.dto';
import { MiniGamePlayerStatusEntity } from '../entities/mini-game-player-status';

export class MiniGamePlayerStatusDto extends CommonDto {
  @ApiProperty({ description: 'the user' })
  user: UserDto;

  @ApiProperty({ description: 'the mini game' })
  miniGame: MiniGameDto;

  @ApiProperty({ description: 'current lives' })
  lifeCount: number;

  @ApiProperty({ description: 'daily best score' })
  dailyBestScore: number;

  @ApiProperty({ description: 'best score' })
  bestScore: number;

  @ApiProperty({ description: 'the last refresh time' })
  lastRefreshTime: Date;

  static toMiniGamePlayerStatusDto(miniGamePlayerStatus: MiniGamePlayerStatusEntity): MiniGamePlayerStatusDto {
    return {
      id: miniGamePlayerStatus.id,
      createdAt: miniGamePlayerStatus.createdAt,
      updatedAt: miniGamePlayerStatus.updatedAt,
      user: miniGamePlayerStatus.user,
      miniGame: miniGamePlayerStatus.miniGame,
      lifeCount: miniGamePlayerStatus.lifeCount,
      dailyBestScore: miniGamePlayerStatus.dailyBestScore,
      bestScore: miniGamePlayerStatus.bestScore,
      lastRefreshTime: miniGamePlayerStatus.lastRefreshTime,
    };
  }
}

export class MiniGamePlayerStatusRegisterDto {
  @ApiProperty({ description: 'the user id' })
  @IsUUID()
  userId: string;

  @ApiProperty({ description: 'the mini game id' })
  @IsUUID()
  miniGameId?: string;

  @ApiProperty({ description: 'the current life' })
  @IsString()
  lifeCount: string;

  @ApiProperty({ description: 'the daily best score' })
  @IsNumber()
  dailyBestScore: number;

  @ApiProperty({ description: 'the best score' })
  @IsNumber()
  bestScore: number;

  @ApiProperty({ description: 'the last refresh time' })
  @IsDateString()
  lastRefreshTime: Date;
}
