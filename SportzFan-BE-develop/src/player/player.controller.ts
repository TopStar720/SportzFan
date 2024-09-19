import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ApiImplicitParam } from '@nestjs/swagger/dist/decorators/api-implicit-param.decorator';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';

import {
  PlayerDto,
  PlayerListDto,
  PlayerRegisterDto,
  PlayerUpdateDto,
} from './dtos/player.dto';
import { PlayerService } from './player.service';
import { UserRole } from '../common/models/base';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PaginatorDto } from '../common/dtos/paginator.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { SuccessResponse } from 'src/common/models/success-response';

@ApiTags('Fan Player')
@Controller('player')
export class PlayerController {
  constructor(private playerService: PlayerService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'create a new player' })
  @ApiOkResponse({ type: PlayerDto })
  @Post()
  async createTeam(
    @Request() req,
    @Body() dto: PlayerRegisterDto,
  ): Promise<PlayerDto> {
    const player = await this.playerService.create(dto);
    return player.toDto();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'update a player' })
  @Put(':id')
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({ type: PlayerDto })
  async updateTeam(
    @Param('id') id,
    @Body() body: PlayerUpdateDto,
  ): Promise<PlayerDto> {
    const player = await this.playerService.updatePlayer(id, body);
    if (!player) {
      throw new BadRequestException('Could not find player.');
    }
    return player.toDto();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'delete a player' })
  @Delete(':id')
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({ type: PlayerDto })
  async deletePlayer(@Param('id') id): Promise<SuccessResponse> {
    return await this.playerService.deletePlayer(id);
  }

  @ApiOperation({ summary: 'return all players' })
  @ApiOkResponse({ type: PlayerDto, isArray: true })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.TeamAdmin, UserRole.Fan])
  @Get('/list')
  async getPlayerList(
    @Request() req,
    @Query() query: PlayerListDto,
  ): Promise<PaginatorDto<PlayerDto>> {
    const [playerList, count] = await this.playerService.getPlayerList(
      query.skip || 0,
      query.take || 10,
      query.teams || '',
    );
    return {
      data: (playerList || []).map((item) => item.toDto()),
      count,
    };
  }
}
