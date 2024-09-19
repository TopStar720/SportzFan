import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/models/base';
import { SuccessResponse } from 'src/common/models/success-response';
import { ContactDto } from './dtos/contact.dto';
import { SupportService } from './support.service';

@ApiTags('Support')
@Controller('support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan])
  @ApiOperation({ summary: 'Send message to support' })
  @ApiOkResponse({ type: SuccessResponse })
  @Post('/contact')
  async contact(@Body() body: ContactDto) {
    return this.supportService.contact(body);
  }

  @ApiOperation({ summary: 'Send message to support without auth' })
  @ApiOkResponse({ type: SuccessResponse })
  @Post('/contact-no-auth')
  async contactNoAuth(@Body() body: ContactDto) {
    return this.supportService.contact(body);
  }
}
