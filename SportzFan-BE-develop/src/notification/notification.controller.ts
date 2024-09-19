import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags, } from '@nestjs/swagger';
import { ApiImplicitParam } from '@nestjs/swagger/dist/decorators/api-implicit-param.decorator';
import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, UseGuards, } from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/models/base';
import { SuccessResponse } from 'src/common/models/success-response';
import { NotificationService } from './notification.service';
import { PaginatorDto } from '../common/dtos/paginator.dto';
import { NotificationDto, NotificationGetDto, NotificationRegisterDto } from './dtos/notification.dto';

@ApiTags('Notification')
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin])
  @ApiOperation({ summary: 'create a new notification' })
  @ApiOkResponse({ type: NotificationDto })
  @Post()
  async createNotification(
    @Request() req,
    @Body() dto: NotificationRegisterDto,
  ): Promise<NotificationDto> {
    const notification = await this.notificationService.createNotification(dto);
    return NotificationDto.toNotificationDto(notification);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin])
  @ApiOperation({ summary: 'get all notification list' })
  @ApiOkResponse({ type: PaginatorDto<NotificationDto> })
  @Get()
  async getAllNotification(@Query() query: NotificationGetDto): Promise<PaginatorDto<NotificationDto>> {
    const [notifications, count] = await this.notificationService.getAllNotification(query.skip || 0, query.take || 5, query.isSeen);
    return {
      data: notifications.map((notification) => NotificationDto.toNotificationDto(notification)) || [],
      count: count || 0,
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan])
  @ApiOperation({ summary: 'get user notification list' })
  @ApiOkResponse({ type: PaginatorDto<NotificationDto> })
  @Get('user/list')
  async getUserNotification(@Request() req, @Query() query: NotificationGetDto): Promise<PaginatorDto<NotificationDto>> {
    const [notifications, count] = await this.notificationService.getUserNotification(req.user.id, query.skip || 0, query.take || 5, query.isSeen);
    return {
      data: notifications.map((notification) => NotificationDto.toNotificationDto(notification)) || [],
      count: count || 0,
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan])
  @ApiOperation({ summary: 'get a notification list' })
  @ApiOkResponse({ type: NotificationDto, isArray: true })
  @ApiImplicitParam({ name: 'id', required: true })
  @Get(':id')
  async getOneNotification(@Param('id') id): Promise<NotificationDto> {
    const notification = await this.notificationService.getOneNotification(id);
    return NotificationDto.toNotificationDto(notification);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan])
  @ApiOperation({ summary: 'see a notification' })
  @Put('notification/:id')
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({ type: NotificationDto })
  async updateNotification(
    @Param('id') id,
  ): Promise<NotificationDto> {
    const notification = await this.notificationService.seeNotification(id);
    return notification.toDto();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin])
  @ApiOperation({ summary: 'delete a notification' })
  @Delete('notification/:id')
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({ type: SuccessResponse })
  deleteNotification(@Param('id') id): Promise<SuccessResponse> {
    return this.notificationService.deleteNotification(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan])
  @ApiOperation({ summary: 'delete all notification' })
  @Delete('delete-all')
  @ApiOkResponse({ type: SuccessResponse })
  deleteAllNotification(@Request() req): Promise<SuccessResponse> {
    return this.notificationService.deleteAllNotification(req.user.id);
  }
}
