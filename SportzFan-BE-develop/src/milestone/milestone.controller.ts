import {
  BadRequestException,
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

import { UserRole } from 'src/common/models/base';
import { MilestoneService } from './milestone.service';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { PaginatorDto } from 'src/common/dtos/paginator.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { SuccessResponse } from '../common/models/success-response';
import {
  MilestoneDto,
  MilestoneListDto,
  MilestoneRegisterDto,
} from './dtos/milestone.dto';
import {
  PlayMilestoneDto,
  PlayMilestoneRegisterDto,
} from './dtos/play-milestone.dto';

@ApiTags('Game / Milestone')
@Controller('milestone')
export class MilestoneController {
  constructor(private readonly milestoneService: MilestoneService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'create a new milestone game' })
  @ApiOkResponse({ type: SuccessResponse })
  @Post('milestone')
  async createMilestone(
    @Request() req,
    @Body() dto: MilestoneRegisterDto,
  ): Promise<MilestoneDto> {
    const milestone = await this.milestoneService.createMilestone(dto);
    return MilestoneDto.toMilestoneDto(milestone);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'get all milestone games' })
  @ApiOkResponse({ type: MilestoneDto, isArray: true })
  @Get('milestone')
  async getAllMilestone(
    @Request() req,
    @Query() query: MilestoneListDto,
  ): Promise<PaginatorDto<MilestoneDto>> {
    const [milestones, count] = await this.milestoneService.getAllMilestone(
      query.skip || 0,
      query.take || 10,
      query.isVerified || '',
      query.search || '',
    );
    return {
      data: (milestones || []).map((milestone) =>
        MilestoneDto.toMilestoneDto(milestone),
      ),
      count,
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'get one milestone game' })
  @ApiOkResponse({ type: MilestoneDto })
  @ApiImplicitParam({ name: 'milestoneId', required: true })
  @Get('milestone/:milestoneId')
  async getOneMilestone(
    @Param('milestoneId') milestoneId: string,
  ): Promise<MilestoneDto> {
    const milestone = await this.milestoneService.getOneMilestone(milestoneId);
    if (!milestone) {
      throw new BadRequestException('Could not find the Milestone');
    }
    return milestone.toDto();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'get one milestone game' })
  @ApiOkResponse({ type: MilestoneDto })
  @ApiImplicitParam({ name: 'milestoneId', required: true })
  @Get('milestone/result/:milestoneId')
  async getOneMilestoneResult(
    @Param('milestoneId') milestoneId: string,
  ): Promise<PlayMilestoneDto[]> {
    const playMilestones = await this.milestoneService.getMilestoneResult(
      milestoneId,
    );
    if (!playMilestones) {
      throw new BadRequestException('Could not find the result');
    }
    return playMilestones.map((playMilestone) => playMilestone.toDto());
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.TeamAdmin])
  @ApiOperation({
    summary: 'update a new milestone game',
  })
  @ApiOkResponse({ type: SuccessResponse })
  @ApiImplicitParam({ name: 'milestoneId', required: true })
  @Put('milestone/:milestoneId')
  async updateMilestone(
    @Param('milestoneId') milestoneId,
    @Body() dto: MilestoneRegisterDto,
  ): Promise<MilestoneDto> {
    const milestone = await this.milestoneService.updateMilestone(
      milestoneId,
      dto,
    );
    if (!milestone) {
      throw new BadRequestException('Could not find the Milestone');
    }
    return milestone.toDto();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.TeamAdmin])
  @ApiOperation({
    summary: 'publish draft milestone game',
  })
  @ApiOkResponse({ type: SuccessResponse })
  @ApiImplicitParam({ name: 'milestoneId', required: true })
  @Put('milestone/publish/:milestoneId')
  async publishMilestone(
    @Param('milestoneId') milestoneId,
  ): Promise<MilestoneDto> {
    const milestone = await this.milestoneService.publishMilestone(milestoneId);
    if (!milestone) {
      throw new BadRequestException('Could not find the Milestone');
    }
    return milestone.toDto();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.TeamAdmin])
  @ApiOperation({
    summary: 'occur milestone',
  })
  @ApiOkResponse({ type: SuccessResponse })
  @ApiImplicitParam({ name: 'milestoneId', required: true })
  @ApiImplicitParam({ name: 'count', required: true })
  @Put('occur-milestone/:milestoneId/count/:count')
  async occurMilestone(
    @Param('milestoneId') milestoneId,
    @Param('count') occurCount,
  ): Promise<MilestoneDto> {
    const milestone = await this.milestoneService.occurMilestone(
      milestoneId,
      parseInt(occurCount || '1'),
    );
    if (!milestone) {
      throw new BadRequestException('Could not find the Milestone');
    }
    return milestone.toDto();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'delete a milestone game' })
  @ApiOkResponse({ type: SuccessResponse })
  @ApiImplicitParam({ name: 'id', required: true })
  @Delete('milestone/:id')
  deleteMilestone(@Param('id') id): Promise<SuccessResponse> {
    return this.milestoneService.deleteMilestone(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'create a new milestone game' })
  @ApiOkResponse({ type: PlayMilestoneDto })
  @Post('milestone/play')
  async createPlayMilestone(
    @Request() req,
    @Body() dto: PlayMilestoneRegisterDto,
  ): Promise<PlayMilestoneDto> {
    return (
      await this.milestoneService.createPlayMilestone(
        dto,
        req.user.teamId,
        req.user.id,
      )
    ).toDto();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'check milestone game play' })
  @ApiOkResponse({ type: PlayMilestoneDto })
  @Post('milestone/play-check/:milestoneId')
  @ApiImplicitParam({ name: 'milestoneId', required: true })
  async checkPlayMilestone(
    @Request() req,
    @Param('milestoneId') milestoneId,
  ): Promise<PlayMilestoneDto> {
    return (
      await this.milestoneService.checkPlayMilestone(milestoneId, req.user.id)
    ).toDto();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'get one milestone play' })
  @ApiOkResponse({ type: MilestoneDto })
  @Get('milestone/play/:milestoneId')
  @ApiImplicitParam({ name: 'milestoneId', required: true })
  async getOneMilestoneForUser(
    @Request() req,
    @Param('milestoneId') milestoneId,
  ): Promise<PlayMilestoneDto> {
    const milestonePlay = await this.milestoneService.getOneMilestonePlayer(
      milestoneId,
      req.user.id,
    );
    if (!milestonePlay) {
      throw new BadRequestException('Could not find the Milestone Play');
    }
    return milestonePlay.toDto();
  }
}
