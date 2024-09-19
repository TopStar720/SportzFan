import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  BadRequestException,
  Controller,
  Get,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  AnalyticsQueryParamDto,
  AnalyticsResultDto,
  TeamAnalyticsQueryParamDto,
} from './dtos/analyticsParam.dto';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../common/models/base';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @ApiOperation({ summary: 'return all analytics data for super admin' })
  @ApiOkResponse({ type: AnalyticsResultDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin])
  @Get('/admin')
  async getAdminAnalyticsData(
    @Query() query: AnalyticsQueryParamDto,
  ): Promise<AnalyticsResultDto> {
    try {
      const teams = query.teamIDs ? query.teamIDs.split(',') : null;
      const result = this.analyticsService.analyzeTeams(
        teams,
        query.start,
        query.end,
      );

      return result;
    } catch (e) {
      throw new BadRequestException('Team ID does not match');
    }
  }

  @ApiOperation({ summary: 'return all analytics data for team admin' })
  @ApiOkResponse({ type: AnalyticsResultDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.TeamAdmin])
  @Get('/team')
  async getTeamAnalyticsData(
    @Request() req,
    @Query() query: TeamAnalyticsQueryParamDto,
  ): Promise<AnalyticsResultDto> {
    try {
      const result = this.analyticsService.analyzeTeams(
        [req.user.teamId],
        query.start,
        query.end,
      );
      return result;
    } catch (e) {
      throw new BadRequestException('Team ID does not match');
    }
  }
}
