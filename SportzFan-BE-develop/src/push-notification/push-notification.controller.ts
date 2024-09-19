import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';

import {
  DirectionFilter,
  PushNotificationSortFilter,
  UserRole,
} from 'src/common/models/base';
import {
  PushNotificationRegister,
  PushTopicNotificationRegister,
  SubscribeDto,
} from './dto/push-notification.dto';
import {
  PushNotificationHistoryDto,
  PushNotificationHistoryListDto,
  PushNotificationHistoryRegisterDto,
} from './dto/push-notification-history.dto';
import { ErrorCode } from 'src/common/models/error-code';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { PaginatorDto } from '../common/dtos/paginator.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { SuccessResponse } from '../common/models/success-response';
import { PushNotificationService } from './push-notification.service';
import { ApiImplicitParam } from '@nestjs/swagger/dist/decorators/api-implicit-param.decorator';

@ApiTags('Admin / Push-Notification')
@Controller('push-notification')
export class PushNotificationController {
  constructor(
    private readonly pushNotificationService: PushNotificationService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'make a push notification' })
  @ApiOkResponse({ type: SuccessResponse })
  @Post('send-push-notification')
  async makePushNotification(
    @Request() req,
    @Body() dto: PushNotificationRegister,
  ): Promise<SuccessResponse> {
    try {
      await this.pushNotificationService.sendNotification(
        dto.projectId,
        dto.token,
        dto.notification,
      );
      return new SuccessResponse(true);
    } catch (e) {
      throw new BadRequestException(JSON.stringify(e));
    }
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'make a topic push notification' })
  @ApiOkResponse({ type: SuccessResponse })
  @Post('send-topic-push-notification')
  async makeTopicPushNotification(
    @Request() req,
    @Body() dto: PushTopicNotificationRegister,
  ): Promise<SuccessResponse> {
    try {
      await this.pushNotificationService.sendTopicNotification(
        dto.projectId,
        dto.notification,
        "sportzfan"
      );
      return new SuccessResponse(true);
    } catch (e) {
      throw new BadRequestException(JSON.stringify(e));
    }
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'subscribe to topic' })
  @ApiOkResponse({ type: SuccessResponse })
  @Post('topic-subscribe')
  async subscribe(
    @Request() req,
    @Body() dto: SubscribeDto,
  ): Promise<SuccessResponse> {
    try {
      await this.pushNotificationService.subscribe(dto.projectId, dto.token, "sportzfan");
      return new SuccessResponse(true);
    } catch (e) {
      throw new BadRequestException(JSON.stringify(e));
    }
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'add a push notification history' })
  @ApiOkResponse({ type: PushNotificationHistoryDto })
  @Post('push-notification-history')
  async addPushNotificationHistory(
    @Request() req,
    @Body() dto: PushNotificationHistoryRegisterDto,
  ): Promise<PushNotificationHistoryDto> {
    try {
      const historyEntity =
        await this.pushNotificationService.createPushNotificationHistory(
          dto,
          req.user.id,
        );
      if (!historyEntity) {
        throw new BadRequestException(
          'Could not find the Push Notification History',
        );
      }
      return PushNotificationHistoryDto.toPushNotificationHistoryDto(
        historyEntity,
      );
    } catch (e) {
      throw new BadRequestException(JSON.stringify(e));
    }
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.TeamAdmin])
  @ApiOperation({
    summary: 'update a push notification history',
  })
  @ApiOkResponse({ type: PushNotificationHistoryDto })
  @ApiImplicitParam({ name: 'historyId', required: true })
  @Put('push-notification-history/:historyId')
  async updatePushNotificationHistory(
    @Param('historyId') historyId,
    @Body() dto: PushNotificationHistoryRegisterDto,
  ): Promise<PushNotificationHistoryDto> {
    const historyEntity =
      await this.pushNotificationService.updatePushNotificationHistory(
        historyId,
        dto,
      );
    if (!historyEntity) {
      throw new BadRequestException(
        'Could not find the Push Notification History',
      );
    }
    return PushNotificationHistoryDto.toPushNotificationHistoryDto(
      historyEntity,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.TeamAdmin, UserRole.Fan])
  @ApiOperation({
    summary: 'get a push notification history',
  })
  @ApiOkResponse({ type: PushNotificationHistoryDto })
  @ApiImplicitParam({ name: 'historyId', required: true })
  @Get('push-notification-history/:historyId')
  async getPushNotificationHistory(
    @Param('historyId') historyId,
  ): Promise<PushNotificationHistoryDto> {
    const historyEntity =
      await this.pushNotificationService.getOnePushNotificationHistory(
        historyId,
      );
    if (!historyEntity) {
      throw new BadRequestException(
        'Could not find the Push Notification History',
      );
    }
    return PushNotificationHistoryDto.toPushNotificationHistoryDto(
      historyEntity,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'get all push notification history' })
  @ApiOkResponse({ type: PushNotificationHistoryDto, isArray: true })
  @Get('push-notification-history')
  async getAllMilestone(
    @Request() req,
    @Query() query: PushNotificationHistoryListDto,
  ): Promise<PaginatorDto<PushNotificationHistoryDto>> {
    const [histories, count] =
      await this.pushNotificationService.getAllPushNotificationHistory(
        query.skip || 0,
        query.take || 10,
        query.isDraft || '',
        query.isEnded || '',
        query.filter || '',
        query.search || '',
        query.teams || '',
        query.sort || PushNotificationSortFilter.Title,
        query.direction || DirectionFilter.ASC,
      );
    return {
      data: (histories || []).map((history) =>
        PushNotificationHistoryDto.toPushNotificationHistoryDto(history),
      ),
      count,
    };
  }
}
