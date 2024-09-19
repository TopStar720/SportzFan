import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';

import {
  DeviceDto,
  DeviceRegisterDto,
} from './dto/device.dto';
import { UserRole } from 'src/common/models/base';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { DeviceService } from './device.service';

@ApiTags('Device')
@Controller('device')
export class DeviceController {
  constructor(
    private readonly deviceService: DeviceService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.TeamAdmin, UserRole.Fan])
  @ApiOperation({ summary: 'create a new device' })
  @ApiOkResponse({ type: DeviceDto })
  @Post()
  async createDevice(
    @Request() req,
    @Body() dto: DeviceRegisterDto,
  ): Promise<DeviceDto> {
    const res = await this.deviceService.createDevice(
      dto,
      req.user.id,
    );
    return DeviceDto.toDeviceDto(res);
  }
}
