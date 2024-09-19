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

import { RolesGuard } from 'src/auth/guards/roles.guard';
import { PaginatorDto } from 'src/common/dtos/paginator.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { MultiReferrerService } from './multi-referrer.service';
import { SuccessResponse } from '../common/models/success-response';
import { TransactionService } from '../transaction/transaction.service';
import {
  ChallengeType,
  TransactionStatus,
  TransactionType,
  UserRole,
} from 'src/common/models/base';
import {
  PlayMultiReferrerDto,
  PlayMultiReferrerRegisterDto,
} from './dtos/play-multi-referrer.dto';
import {
  MultiReferrerDto,
  MultiReferrerRegisterDto,
  MultiReferrerUpdateDto,
} from './dtos/multi-referrer.dto';
import {
  NotificationCategoryType,
  NotificationType,
} from '../notification/dtos/notification.dto';
import { SocketService } from '../socket/socket.service';

@ApiTags('Challenge / Multiple Referrer')
@Controller('challenge')
export class MultiReferrerController {
  constructor(
    private readonly socketService: SocketService,
    private readonly transactionService: TransactionService,
    private readonly multiReferrerService: MultiReferrerService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin])
  @ApiOperation({ summary: 'create a new multi referrer challenge' })
  @ApiOkResponse({ type: MultiReferrerDto })
  @Post('multi-referrer')
  async createMultiReferrer(
    @Request() req,
    @Body() dto: MultiReferrerRegisterDto,
  ): Promise<MultiReferrerDto> {
    const multiReferrer = await this.multiReferrerService.createMultiReferrer(
      dto,
    );
    return MultiReferrerDto.toMultiReferrerDto(multiReferrer);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'get all multi-referrer challenge list' })
  @ApiOkResponse({ type: MultiReferrerDto, isArray: true })
  @Get('multi-referrer')
  async getAllMultiReferrer(
    @Request() req,
    @Query() query: PaginationDto,
  ): Promise<PaginatorDto<MultiReferrerDto>> {
    const [multiReferrers, count] =
      await this.multiReferrerService.getAllMultiReferrer(
        query.skip || 0,
        query.take || 10,
      );
    return {
      data: multiReferrers.map((multiReferrer) =>
        MultiReferrerDto.toMultiReferrerDto(multiReferrer),
      ),
      count,
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'get one multi-referrer challenge list' })
  @ApiOkResponse({ type: MultiReferrerDto })
  @ApiImplicitParam({ name: 'id', required: true })
  @Get('multi-referrer/:id')
  async getOneMultiReferrer(@Param('id') id): Promise<MultiReferrerDto> {
    const multiReferrer = await this.multiReferrerService.getOneMultiReferrer(
      id,
    );
    return MultiReferrerDto.toMultiReferrerDto(multiReferrer);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'update a multi-referrer challenge' })
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({ type: MultiReferrerDto })
  @Put('multi-referrer/:id')
  async updateMultiReferrer(
    @Param('id') id,
    @Body() body: MultiReferrerUpdateDto,
  ): Promise<MultiReferrerDto> {
    return this.multiReferrerService.updateMultiReferrer(id, body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin])
  @ApiOperation({ summary: 'publish a multi-referrer challenge' })
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({ type: MultiReferrerDto })
  @Put('multi-referrer/publish/:id')
  async publishMultiReferrer(@Param('id') id): Promise<MultiReferrerDto> {
    return this.multiReferrerService.publish(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin])
  @ApiOperation({ summary: 'delete a multi-referrer challenge' })
  @Delete('multi-referrer:id')
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({ type: SuccessResponse })
  deleteMultiReferrer(@Param('id') id): Promise<SuccessResponse> {
    return this.multiReferrerService.deleteChallenge(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan])
  @ApiOperation({ summary: 'create a new play survey history' })
  @ApiOkResponse({ type: PlayMultiReferrerDto })
  @Post('multi-referrer/play')
  async createPlayMultiReferrer(
    @Request() req,
    @Body() dto: PlayMultiReferrerRegisterDto,
  ): Promise<PlayMultiReferrerDto> {
    const playMultiReferrer =
      await this.multiReferrerService.createPlayMultiReferrer(
        dto,
        req.user.teamId,
        req.user.id,
      );
    if (
      playMultiReferrer &&
      playMultiReferrer.multiReferrer.eligbleReferal ===
        playMultiReferrer.invitation.length
    ) {
      this.socketService.message$.next({
        userId: req.user.id,
        type: NotificationType.ChallengeCompleted,
        category: NotificationCategoryType.Challenge,
        section: ChallengeType.MultiReferrer,
        uniqueId: playMultiReferrer.multiReferrerId,
        content: playMultiReferrer.multiReferrer.title,
      });
      await this.transactionService.createTransaction({
        receiverId: req.user.id,
        teamId: req.user.teamId,
        type: TransactionType.MultiReferrerReward,
        uniqueId: playMultiReferrer.id,
        status: TransactionStatus.Pending,
        kudosAmount: playMultiReferrer.multiReferrer.kudosReward,
        tokenAmount: playMultiReferrer.multiReferrer.tokenReward,
        reason: playMultiReferrer.multiReferrer.title,
      });
    }
    return playMultiReferrer;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan])
  @ApiOperation({ summary: 'get one multi referrer challenge for user' })
  @ApiOkResponse({ type: MultiReferrerDto })
  @ApiImplicitParam({ name: 'id', required: true })
  @Get('multi-referrer/play/:id')
  async getOneMultiReferrerForUser(
    @Request() req,
    @Param('id') id,
  ): Promise<MultiReferrerDto> {
    const multiReferrer =
      await this.multiReferrerService.getOneMultiReferrerForUser(
        id,
        req.user.id,
      );
    return MultiReferrerDto.toMultiReferrerDto(multiReferrer);
  }
}
