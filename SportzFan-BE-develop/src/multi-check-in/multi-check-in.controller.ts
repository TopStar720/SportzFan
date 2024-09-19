import {
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

import { SocketService } from '../socket/socket.service';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { PaginatorDto } from 'src/common/dtos/paginator.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { MultiCheckInService } from './multi-check-in.service';
import { SuccessResponse } from '../common/models/success-response';
import { TransactionService } from '../transaction/transaction.service';
import {
  PlayMultiCheckInDto,
  PlayMultiCheckInRegisterDto,
} from './dtos/play-multi-check-in.dto';
import {
  ChallengeType,
  TransactionStatus,
  TransactionType,
  UserRole,
} from 'src/common/models/base';
import {
  MultiCheckInDto,
  MultiCheckInRegisterDto,
  MultiCheckInUpdateDto,
} from './dtos/multi-check-in.dto';
import {
  NotificationCategoryType,
  NotificationType,
} from '../notification/dtos/notification.dto';

@ApiTags('Challenge / Multiple Check-in')
@Controller('challenge')
export class MultiCheckInController {
  constructor(
    private readonly multiCheckInService: MultiCheckInService,
    private readonly transactionService: TransactionService,
    private readonly socketService: SocketService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin])
  @ApiOperation({ summary: 'create a new multi check-in challenge' })
  @ApiOkResponse({ type: MultiCheckInDto })
  @Post('multi-check-in')
  async createMultiCheckIn(
    @Request() req,
    @Body() dto: MultiCheckInRegisterDto,
  ): Promise<MultiCheckInDto> {
    const multiCheckIn = await this.multiCheckInService.createMultiCheckIn(dto);
    return MultiCheckInDto.toMultiCheckInDto(multiCheckIn);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'get all multi-check-in challenge list' })
  @ApiOkResponse({ type: MultiCheckInDto, isArray: true })
  @Get('multi-check-in')
  async getAllMultiCheckIn(
    @Request() req,
    @Query() query: PaginationDto,
  ): Promise<PaginatorDto<MultiCheckInDto>> {
    const [multiCheckIns, count] =
      await this.multiCheckInService.getAllMultiCheckIn(
        query.skip || 0,
        query.take || 10,
      );
    return {
      data: multiCheckIns.map((multiCheckIn) =>
        MultiCheckInDto.toMultiCheckInDto(multiCheckIn),
      ),
      count,
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'get one multi-check-in challenge' })
  @ApiOkResponse({ type: MultiCheckInDto })
  @ApiImplicitParam({ name: 'id', required: true })
  @Get('multi-check-in/:id')
  async getOneMultiCheckIn(@Param('id') id): Promise<MultiCheckInDto> {
    const multiCheckIn = await this.multiCheckInService.getOneMultiCheckIn(id);
    return MultiCheckInDto.toMultiCheckInDto(multiCheckIn);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'update a multi-check-in challenge' })
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({ type: MultiCheckInDto })
  @Put('multi-check-in/:id')
  async updateMultiCheckIn(
    @Param('id') id,
    @Body() body: MultiCheckInUpdateDto,
  ): Promise<MultiCheckInDto> {
    return this.multiCheckInService.updateMultiCheckIn(id, body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin])
  @ApiOperation({ summary: 'publish a multi-check-in challenge' })
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({ type: MultiCheckInDto })
  @Put('multi-check-in/publish/:id')
  async publishMultiCheckIn(@Param('id') id): Promise<MultiCheckInDto> {
    return this.multiCheckInService.publish(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin])
  @ApiOperation({ summary: 'delete a multi-check-in challenge' })
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({ type: SuccessResponse })
  @Delete('multi-check-in/:id')
  deleteMultiCheckIn(@Param('id') id): Promise<SuccessResponse> {
    return this.multiCheckInService.deleteChallenge(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Fan])
  @ApiOperation({
    summary: 'create a new play multi-check-in challenge history',
  })
  @ApiOkResponse({ type: PlayMultiCheckInDto })
  @Post('multi-check-in/play')
  async createPlayMultiCheckIn(
    @Request() req,
    @Body() dto: PlayMultiCheckInRegisterDto,
  ): Promise<PlayMultiCheckInDto> {
    const playMultiCheckIn =
      await this.multiCheckInService.createPlayMultiCheckIn(
        dto,
        req.user.teamId,
        req.user.id,
      );
    if (
      playMultiCheckIn &&
      playMultiCheckIn.items.length ===
        playMultiCheckIn.multiCheckIn.eligbleCheckIn
    ) {
      this.socketService.message$.next({
        userId: req.user.id,
        type: NotificationType.ChallengeCompleted,
        category: NotificationCategoryType.Challenge,
        section: ChallengeType.MultiCheckIn,
        uniqueId: playMultiCheckIn.multiCheckInId,
        content: playMultiCheckIn.multiCheckIn.title,
      });
      await this.transactionService.createTransaction({
        receiverId: req.user.id,
        teamId: req.user.teamId,
        matchId: playMultiCheckIn.multiCheckIn.match.id,
        type: TransactionType.MultiCheckInReward,
        uniqueId: playMultiCheckIn.id,
        status: TransactionStatus.Pending,
        kudosAmount: playMultiCheckIn.multiCheckIn.kudosReward,
        tokenAmount: playMultiCheckIn.multiCheckIn.tokenReward,
        reason: playMultiCheckIn.multiCheckIn.title,
      });
    }
    return playMultiCheckIn;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan])
  @ApiOperation({
    summary: 'get one multi-check-in challenge with play history',
  })
  @ApiOkResponse({ type: MultiCheckInDto })
  @ApiImplicitParam({ name: 'id', required: true })
  @Get('multi-check-in/play/:id')
  async getOneMultiCheckInForUser(
    @Request() req,
    @Param('id') id,
  ): Promise<MultiCheckInDto> {
    const multiCheckIn =
      await this.multiCheckInService.getOneMultiCheckInForUser(id, req.user.id);
    return MultiCheckInDto.toMultiCheckInDto(multiCheckIn);
  }
}
