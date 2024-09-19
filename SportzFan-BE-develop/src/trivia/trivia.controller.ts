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

import { TriviaService } from './trivia.service';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { PaginatorDto } from 'src/common/dtos/paginator.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { PlayTriviaDto, PlayTriviaRegisterDto } from './dtos/play-trivia.dto';
import {
  TriviaDto,
  TriviaMyResultDto,
  TriviaRegisterDto,
} from './dtos/trivia.dto';
import { SuccessResponse } from '../common/models/success-response';
import { UserRole } from 'src/common/models/base';

@ApiTags('Game / Trivia')
@Controller('game')
export class TriviaController {
  constructor(private readonly triviaService: TriviaService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'create a new trivia game' })
  @ApiOkResponse({ type: TriviaDto })
  @Post('trivia')
  async createTrivia(
    @Request() req,
    @Body() dto: TriviaRegisterDto,
  ): Promise<TriviaDto> {
    const trivia = await this.triviaService.createTrivia(dto);
    return TriviaDto.toTriviaDto(trivia);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'get all trivia games' })
  @ApiOkResponse({ type: TriviaDto, isArray: true })
  @Get('trivia')
  async getAllTrivia(
    @Request() req,
    @Query() query: PaginationDto,
  ): Promise<PaginatorDto<TriviaDto>> {
    const [trivias, count] = await this.triviaService.getAllTrivia(
      query.skip || 0,
      query.take || 10,
    );
    return {
      data: trivias.map((trivia) => TriviaDto.toTriviaDto(trivia)),
      count,
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'get one trivia game' })
  @ApiOkResponse({ type: TriviaDto })
  @ApiImplicitParam({ name: 'triviaId', required: true })
  @Get('trivia/:triviaId')
  async getOneTrivia(@Param('triviaId') triviaId): Promise<TriviaDto> {
    const trivia = await this.triviaService.getOneTrivia(triviaId);
    if (trivia) {
      return TriviaDto.toTriviaDto(trivia);
    } else {
      throw new BadRequestException('Could not find trivia.');
    }
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.TeamAdmin, UserRole.Fan])
  @ApiOperation({ summary: 'check if fan already played this trivia' })
  @ApiOkResponse({ type: PlayTriviaDto, isArray: true })
  @ApiImplicitParam({ name: 'triviaId', required: true })
  @Get('trivia/play/check/:triviaId')
  async checkIfUserPlayedTrivia(
    @Request() req,
    @Param('triviaId') triviaId,
  ): Promise<PlayTriviaDto> {
    const playTriviaHistory = await this.triviaService.checkIfUserPlayedTrivia(
      req.user.id,
      triviaId,
    );
    if (!playTriviaHistory) {
      throw new BadRequestException("Fan didn't play this trivia.");
    }
    return playTriviaHistory;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.TeamAdmin])
  @ApiOperation({
    summary: 'update a trivia game',
  })
  @ApiOkResponse({ type: SuccessResponse })
  @ApiImplicitParam({ name: 'id', required: true })
  @Put('trivia/:triviaId')
  async updateTrivia(
    @Param('triviaId') triviaId,
    @Body() dto: TriviaRegisterDto,
  ): Promise<SuccessResponse> {
    return this.triviaService.updateTrivia(triviaId, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'delete a trivia game' })
  @ApiOkResponse({ type: SuccessResponse })
  @ApiImplicitParam({ name: 'triviaId', required: true })
  @Delete('trivia/:triviaId')
  deleteTrivia(@Param('triviaId') triviaId): Promise<SuccessResponse> {
    return this.triviaService.deleteTrivia(triviaId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'create a new play trivia history' })
  @ApiOkResponse({ type: SuccessResponse })
  @Post('trivia/play')
  async createPlayTrivia(
    @Request() req,
    @Body() dto: PlayTriviaRegisterDto,
  ): Promise<SuccessResponse> {
    return this.triviaService.createPlayTrivia(
      dto,
      req.user.teamId,
      req.user.id,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'get trivia play for user' })
  @ApiOkResponse({ type: PlayTriviaDto, isArray: true })
  @Get('trivia/play/list')
  async getOneTriviaForUser(@Request() req): Promise<PlayTriviaDto[]> {
    const triviaPlayList =
      (await this.triviaService.getTriviaPlayListForUser(req.user.id)) || [];
    return triviaPlayList.map((item) => item.toDto());
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'get one trivia game for user' })
  @ApiOkResponse({ type: TriviaDto })
  @Get('trivia/result/:triviaId')
  @ApiImplicitParam({ name: 'triviaId', required: true })
  async getTriviaResult(
    @Request() req,
    @Param('triviaId') triviaId,
  ): Promise<TriviaDto> {
    const trivia = await this.triviaService.getTriviaResult(triviaId);
    return TriviaDto.toTriviaDto(trivia);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'get trivia game result for user' })
  @ApiOkResponse({ type: TriviaDto })
  @Get('trivia/my-result/:triviaId')
  @ApiImplicitParam({ name: 'triviaId', required: true })
  async getMyTriviaResult(
    @Request() req,
    @Param('triviaId') triviaId,
  ): Promise<TriviaMyResultDto> {
    const [trivia, totalCount] = await this.triviaService.getMyTriviaResult(
      triviaId,
      req.user.id,
    );
    return { ...TriviaDto.toTriviaDto(trivia), totalCount };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'finish trivia game and send reward' })
  @ApiOkResponse({ type: SuccessResponse })
  @Post('trivia/finish/:triviaId')
  @ApiImplicitParam({ name: 'triviaId', required: true })
  async finishTrivia(
    @Request() req,
    @Param('triviaId') triviaId,
  ): Promise<any> {
    return this.triviaService.endTrivia(triviaId);
  }
}
