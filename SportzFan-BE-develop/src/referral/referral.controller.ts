import { Body, Controller, Post, Request, UseGuards, } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags, } from '@nestjs/swagger';

import { ReferralService } from './referral.service';
import { UserRole } from 'src/common/models/base';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ReferralDto, ReferralRegisterDto, } from './dtos/referral.dto';

@ApiTags('Admin / Referral')
@Controller('referral')
export class ReferralController {
  constructor(private readonly referralService: ReferralService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin])
  @ApiOperation({ summary: 'create a new match' })
  @ApiOkResponse({ type: ReferralDto })
  @Post()
  async createMatch(
    @Request() req,
    @Body() dto: ReferralRegisterDto,
  ): Promise<ReferralDto> {
    const referral = await this.referralService.createReferral(dto);
    return ReferralDto.toReferralDto(referral);
  }
}
