import { BadRequestException, Body, Controller, Get, Param, Put, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags, } from '@nestjs/swagger';

import { UserRole } from 'src/common/models/base';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ProfileRewardService } from './profile-reward.service';
import { ProfileRewardDto, ProfileRewardRegisterDto } from './dtos/profile-reward.dto';
import { ProfileRewardStatusDto, ProfileRewardStatusRegisterDto } from './dtos/profile-reward-status.dto';
import { ApiImplicitParam } from '@nestjs/swagger/dist/decorators/api-implicit-param.decorator';

@ApiTags('Profile Reward')
@Controller('profile-reward')
export class ProfileRewardController {
  constructor(private readonly profileRewardService: ProfileRewardService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan])
  @ApiOperation({ summary: 'get team profile reward' })
  @ApiOkResponse({ type: ProfileRewardDto })
  @ApiImplicitParam({ name: 'teamId', required: true })
  @Get(':teamId')
  async getTeamProfileReward(@Param('teamId') teamId): Promise<ProfileRewardDto> {
    const profileReward = await this.profileRewardService.getTeamProfileReward(teamId);
    if (!profileReward) {
      throw new BadRequestException('Could not find the team profile reward');
    }
    return profileReward.toDto();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan])
  @ApiOperation({ summary: 'get user profile reward status' })
  @ApiOkResponse({ type: ProfileRewardStatusDto })
  @Get('status/preview')
  async getUserProfileRewardStatus(@Request() req): Promise<ProfileRewardStatusDto> {
    const profileRewardStatus = await this.profileRewardService.getUserProfileRewardStatus(req.user.id);
    if (!profileRewardStatus) {
      throw new BadRequestException('Could not find the user profile reward status');
    }
    return profileRewardStatus.toDto();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin])
  @ApiOperation({ summary: 'update team profile reward' })
  @Put('update')
  @ApiOkResponse({ type: ProfileRewardDto })
  async updateTeamProfileReward(@Body() dto: ProfileRewardRegisterDto): Promise<ProfileRewardDto> {
    return this.profileRewardService.updateTeamProfileReward(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan])
  @ApiOperation({ summary: 'update user profile reward status' })
  @Put('update-status')
  @ApiOkResponse({ type: ProfileRewardStatusDto })
  async updateUserProfileRewardStatus(@Body() dto: ProfileRewardStatusRegisterDto): Promise<ProfileRewardStatusDto> {
    const result = await this.profileRewardService.updateUserProfileStatusReward(dto);
    return result.entity;
  }
}
