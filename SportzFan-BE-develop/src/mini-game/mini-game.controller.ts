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
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ApiImplicitParam } from '@nestjs/swagger/dist/decorators/api-implicit-param.decorator';

import { MiniGameService } from './mini-game.service';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { PaginatorDto } from 'src/common/dtos/paginator.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import {
  PlayMiniGameDto,
  PlayMiniGameRegisterDto,
} from './dtos/play-mini-game.dto';
import {
  MiniGameDto,
  MiniGameRegisterDto,
  PlayMiniGameQueryParamDto,
} from './dtos/mini-game.dto';
import { SuccessResponse } from '../common/models/success-response';
import { UserRole } from 'src/common/models/base';
import { PlayMiniGameEntity } from './entities/play-mini-game.entity';

@ApiTags('Game / MiniGame')
@Controller('game')
export class MiniGameController {
  constructor(private readonly miniGameService: MiniGameService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'create a new mini game' })
  @ApiOkResponse({ type: MiniGameDto })
  @Post('mini-game')
  async createMiniGame(
    @Request() req,
    @Body() dto: MiniGameRegisterDto,
  ): Promise<MiniGameDto> {
    const miniGame = await this.miniGameService.createMiniGame(dto);
    return MiniGameDto.toMiniGameDto(miniGame);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'get all mini games' })
  @ApiOkResponse({ type: MiniGameDto, isArray: true })
  @Get('mini-game')
  async getAllMiniGame(
    @Request() req,
    @Query() query: PaginationDto,
  ): Promise<PaginatorDto<MiniGameDto>> {
    const [miniGames, count] = await this.miniGameService.getAllMiniGame(
      query.skip || 0,
      query.take || 10,
    );
    return {
      data: miniGames.map((miniGame) => MiniGameDto.toMiniGameDto(miniGame)),
      count,
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'get one mini game' })
  @ApiOkResponse({ type: MiniGameDto })
  @ApiImplicitParam({ name: 'miniGameId', required: true })
  @Get('mini-game/:miniGameId')
  async getOneMiniGame(@Param('miniGameId') miniGameId): Promise<MiniGameDto> {
    const miniGame = await this.miniGameService.getOneMiniGame(miniGameId);
    if (miniGame) {
      return MiniGameDto.toMiniGameDto(miniGame);
    } else {
      throw new BadRequestException('Could not find mini game.');
    }
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.TeamAdmin, UserRole.Fan])
  @ApiOperation({ summary: 'check if fan already played this minigame' })
  @ApiOkResponse({ type: PlayMiniGameDto, isArray: true })
  @ApiImplicitParam({ name: 'miniGameId', required: true })
  @Get('mini-game/play/check/:miniGameId')
  async checkIfUserPlayedMiniGame(
    @Request() req,
    @Param('miniGameId') miniGameId,
  ): Promise<PlayMiniGameEntity> {
    const playMiniGameHistory =
      await this.miniGameService.checkIfUserPlayedMiniGame(
        req.user.id,
        miniGameId,
      );
    if (!playMiniGameHistory) {
      throw new BadRequestException("Fan didn't play this mini-game.");
    }
    return playMiniGameHistory;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'update a mini game' })
  @ApiOkResponse({ type: SuccessResponse })
  @ApiImplicitParam({ name: 'id', required: true })
  @Put('mini-game/:miniGameId')
  async updateMiniGame(
    @Param('miniGameId') miniGameId,
    @Body() dto: MiniGameRegisterDto,
  ): Promise<SuccessResponse> {
    return this.miniGameService.updateMiniGame(miniGameId, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'update a mini game' })
  @ApiOkResponse({ type: SuccessResponse })
  @ApiImplicitParam({ name: 'id', required: true })
  @Put('mini-game/reduce-life/:miniGameId')
  async reduceLife(
    @Request() req,
    @Param('miniGameId') miniGameId,
  ): Promise<SuccessResponse> {
    return this.miniGameService.reduceLife(miniGameId, req.user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'delete a mini game' })
  @ApiOkResponse({ type: SuccessResponse })
  @ApiImplicitParam({ name: 'miniGameId', required: true })
  @Delete('mini-game/:miniGameId')
  deleteMiniGame(@Param('miniGameId') miniGameId): Promise<SuccessResponse> {
    return this.miniGameService.deleteMiniGame(miniGameId);
  }

  @ApiOperation({ summary: 'create a new play miniGame history' })
  @ApiImplicitParam({ name: 'miniGameId', required: true })
  @ApiOkResponse({ type: SuccessResponse })
  @Post('mini-game/play/:miniGameId')
  async createPlayMiniGame(
    @Request() req,
    @Param('miniGameId') miniGameId,
    @Body() dto: PlayMiniGameRegisterDto,
  ): Promise<SuccessResponse> {
    return this.miniGameService.createPlayMiniGame(dto, miniGameId);
  }
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'get miniGame play for user' })
  @ApiImplicitParam({ name: 'miniGameId', required: true })
  @Get('mini-game/leaderboard/:miniGameId')
  async getLeaderboard(
    @Request() req,
    @Param('miniGameId') miniGameId,
  ): Promise<PlayMiniGameDto[]> {
    const miniGamePlayList =
      (await this.miniGameService.getLeaderboard(miniGameId)) || [];
    return miniGamePlayList.map((item) => item.toDto());
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'get miniGame play for user' })
  @ApiOkResponse({ type: PlayMiniGameDto, isArray: true })
  @Get('mini-game/play/list')
  async getOneMiniGameForUser(@Request() req): Promise<PlayMiniGameDto[]> {
    const miniGamePlayList =
      (await this.miniGameService.getMiniGamePlayListForUser(req.user.id)) ||
      [];
    return miniGamePlayList.map((item) => item.toDto());
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'get one mini game for user' })
  @ApiOkResponse({ type: MiniGameDto })
  @Get('mini-game/result/:miniGameId')
  @ApiImplicitParam({ name: 'miniGameId', required: true })
  async getMiniGameResult(
    @Request() req,
    @Param('miniGameId') miniGameId,
  ): Promise<MiniGameDto> {
    const miniGame = await this.miniGameService.getMiniGameResult(miniGameId);
    return MiniGameDto.toMiniGameDto(miniGame);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'get mini game result between specific range' })
  @ApiOkResponse({ type: PlayMiniGameDto, isArray: true })
  @ApiImplicitParam({ name: 'miniGameId', required: true })
  @Get('mini-game/:miniGameId/range-result')
  async getRangeMiniGameResult(
    @Param('miniGameId') miniGameId,
    @Query() query: PlayMiniGameQueryParamDto,
  ): Promise<PlayMiniGameDto[]> {
    const playMiniGameList = await this.miniGameService.getRangeMiniGameResult(
      miniGameId,
      query.start,
      query.end,
    );
    return playMiniGameList.map((item) => item.toDto());
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'finish mini game and send reward' })
  @ApiOkResponse({ type: SuccessResponse })
  @Post('mini-game/finish/:miniGameId')
  @ApiImplicitParam({ name: 'miniGameId', required: true })
  async finishMiniGame(
    @Request() req,
    @Param('miniGameId') miniGameId,
  ): Promise<any> {
    return this.miniGameService.endMiniGame(miniGameId);
  }
}
