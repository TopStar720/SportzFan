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

import {
  DetailedTeamDto,
  PlatformRegisterDto,
  TeamDto,
  TeamListDto,
  TeamRegisterDto,
  TeamUpdateDto,
} from './dtos/team.dto';
import { SuccessResponse } from '../common/models/success-response';
import { TeamService } from './team.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/common/models/base';
import { Roles } from 'src/common/decorators/roles.decorator';
import { PaginatorDto } from 'src/common/dtos/paginator.dto';

@ApiTags('Admin / Team')
@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin])
  @ApiOperation({ summary: 'create a new team' })
  @ApiOkResponse({ type: TeamDto })
  @Post()
  async createTeam(
    @Request() req,
    @Body() dto: TeamRegisterDto,
  ): Promise<TeamDto> {
    const team = await this.teamService.createTeam(dto);
    return TeamDto.toTeamDto(team);
  }

  @ApiOperation({ summary: 'add a new platform' })
  @ApiOkResponse({ type: TeamDto })
  @Post('new-platform')
  async addNewPlatform(
    @Request() req,
    @Body() dto: PlatformRegisterDto,
  ): Promise<TeamDto> {
    const team = await this.teamService.addNewPlatform(dto);
    return TeamDto.toTeamDto(team);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'get all team list' })
  @ApiOkResponse({ type: TeamDto, isArray: true })
  @Get()
  async getAllTeam(): Promise<TeamDto[]> {
    const teams = await this.teamService.getAllTeam();
    return teams.map((team) => TeamDto.toTeamDto(team));
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'get all detailed team list' })
  @ApiOkResponse({ type: PaginatorDto<DetailedTeamDto> })
  @Get('list/detail')
  async getDetailedTeamList(@Request() req, @Query() query: TeamListDto) {
    const [dataList, count] = await this.teamService.getDetailedTeamList(
      query.skip || 0,
      query.take || 10,
      query.search || '',
    );
    return {
      data: dataList,
      count,
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'get one team' })
  @ApiOkResponse({ type: TeamDto })
  @Get(':id')
  @ApiImplicitParam({ name: 'id', required: true })
  async getOneTeam(@Param('id') id): Promise<DetailedTeamDto> {
    return await this.teamService.getOneTeam(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'get one team' })
  @ApiOkResponse({ type: TeamDto })
  @Get('info/:platformUrl')
  @ApiImplicitParam({ name: 'platformUrl', required: true })
  async getPlatformInfo(@Param('platformUrl') platformUrl): Promise<TeamDto> {
    return await this.teamService.getPlatformInfo(platformUrl);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'update a team' })
  @Put(':id')
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({ type: TeamDto })
  async updateTeam(
    @Param('id') id,
    @Body() body: TeamUpdateDto,
  ): Promise<TeamDto> {
    return this.teamService.updateTeam(id, body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin])
  @ApiOperation({ summary: 'update a team' })
  @Put(':id/:activate')
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiImplicitParam({ name: 'activate', required: true })
  @ApiOkResponse({ type: TeamDto })
  async updateTeamActivation(
    @Param('id') id,
    @Param('activate') activate,
  ): Promise<TeamDto> {
    return this.teamService.updateTeamActivation(id, activate);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin])
  @ApiOperation({ summary: 'delete a team' })
  @Delete(':id')
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({ type: SuccessResponse })
  deleteTeam(@Param('id') id): Promise<SuccessResponse> {
    return this.teamService.deleteTeam(id);
  }
}
