import {
  Controller,
  Get,
  Param,
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

import { GameService } from './game.service';
import { DirectionFilter, SortFilter, UserRole } from 'src/common/models/base';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import {
  GameItemDto,
  GameListByOwnerRequestDto,
  GameListByOwnerResponseDto,
  GameListDto,
} from './dtos/game.dto';
import { PaginatorDto } from 'src/common/dtos/paginator.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiImplicitParam } from '@nestjs/swagger/dist/decorators/api-implicit-param.decorator';

@ApiTags('Game')
@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'get all game list' })
  @ApiOkResponse({ type: PaginatorDto<GameItemDto> })
  @Get('list')
  async getAllGame(
    @Request() req,
    @Query() query: GameListDto,
  ): Promise<PaginatorDto<GameItemDto>> {
    return await this.gameService.getGames(
      query.skip || 0,
      query.take || 10,
      query.filter,
      query.search || '',
      query.isDraft || '',
      query.isEnded || '',
      query.sort || SortFilter.Start,
      query.direction || DirectionFilter.DESC,
      req.user.id,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan])
  @ApiOperation({ summary: 'get my game list' })
  @ApiOkResponse({ type: PaginatorDto<GameItemDto> })
  @Get('my-list')
  async getMyGame(
    @Request() req,
    @Query() query: GameListDto,
  ): Promise<PaginatorDto<GameItemDto>> {
    return await this.gameService.getUserGames(
      query.skip || 0,
      query.take || 10,
      query.filter,
      query.search || '',
      query.isDraft || '',
      req.user.id,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan])
  @ApiOperation({ summary: 'get game list by side' })
  @ApiOkResponse({ type: GameListByOwnerResponseDto })
  @ApiImplicitParam({ name: 'side', required: true })
  @Get('list/:side')
  async getGamesBySide(
    @Request() req,
    @Query() query: GameListByOwnerRequestDto,
    @Param('side') side,
  ): Promise<GameListByOwnerResponseDto> {
    return await this.gameService.getGamesBySide(
      side,
      req.user.id,
      query.filter,
      query.search || '',
      query.isDraft || '',
      query.isEnded || '',
    );
  }
}
