import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

import { CommonDto } from '../../common/dtos/common.dto';
import { TeamDto } from '../../team/dtos/team.dto';
import { PaginationDto } from '../../common/dtos/pagination.dto';

export class PlayerDto extends CommonDto {
  @ApiProperty({ description: 'the fan name' })
  name: string;

  @ApiProperty({ description: 'the fan avatar' })
  avatar: string;

  @ApiProperty({ description: 'the fan linking team' })
  team: TeamDto;
}

export class PlayerRegisterDto {
  @ApiProperty({ description: 'the team id' })
  @IsUUID()
  teamId: string;

  @ApiProperty({ description: 'the player name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'the player avatar' })
  @IsString()
  avatar: string;
}

export class PlayerUpdateDto {
  @ApiProperty({ description: 'the team id' })
  @IsUUID()
  teamId: string;

  @ApiProperty({ description: 'the player name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'the player avatar' })
  @IsString()
  avatar: string;
}

export class PlayerListDto extends PaginationDto {
  @ApiProperty({ description: 'the player list search', required: false })
  @IsString()
  @IsOptional()
  teams?: string;
}
