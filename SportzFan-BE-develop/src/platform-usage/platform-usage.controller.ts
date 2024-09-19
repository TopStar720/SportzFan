import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { PlatformUsageService } from './platform-usage.service';
import { UserRole } from 'src/common/models/base';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  PlatformUsageDto,
  PlatformUsageRegisterDto,
} from './dtos/platform-usage.dto';
import { ApiImplicitParam } from '@nestjs/swagger/dist/decorators/api-implicit-param.decorator';

@ApiTags('Admin / Platform Usage')
@Controller('platform-usage')
export class PlatformUsageController {
  constructor(private readonly platformUsageService: PlatformUsageService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'create a new platform usage' })
  @ApiOkResponse({ type: PlatformUsageDto })
  @Post()
  async createMatch(
    @Request() req,
    @Body() dto: PlatformUsageRegisterDto,
  ): Promise<PlatformUsageDto> {
    const platformUsage = await this.platformUsageService.createPlatformUsage(
      dto,
    );
    return PlatformUsageDto.toPlatformUsageDto(platformUsage);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'get platform usage' })
  @ApiOkResponse({ type: PlatformUsageDto })
  @ApiImplicitParam({ name: 'userId', required: true })
  @Get('info/:userId')
  async refer(@Param('userId') userId, @Request() req) {
    const platformUsage = await this.platformUsageService.getPlatformUsage(
      userId,
    );
    return PlatformUsageDto.toPlatformUsageDto(platformUsage);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'update platform usage minutes' })
  @ApiOkResponse({ type: PlatformUsageDto })
  @ApiImplicitParam({ name: 'minutes', required: true })
  @Put('add-minutes/:minutes')
  async addMinutes(@Param('minutes') minutes, @Request() req) {
    const platformUsage = await this.platformUsageService.addUsageMinutes(
      req.user.id,
      minutes,
    );
    return PlatformUsageDto.toPlatformUsageDto(platformUsage);
  }
}
