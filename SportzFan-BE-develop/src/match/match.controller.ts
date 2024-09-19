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

import { MatchService } from './match.service';
import { DirectionFilter, SortFilter, UserRole } from 'src/common/models/base';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { PaginatorDto } from 'src/common/dtos/paginator.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { SuccessResponse } from '../common/models/success-response';
import {
  MatchDetailGetDto,
  MatchDetailQueryDto,
  MatchDto,
  MatchGetDto,
  MatchRegisterDto,
  MatchUpdateDto,
} from './dtos/match.dto';

@ApiTags('Admin / Match')
@Controller('match')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'create a new match' })
  @ApiOkResponse({ type: MatchDto })
  @Post()
  async createMatch(
    @Request() req,
    @Body() dto: MatchRegisterDto,
  ): Promise<MatchDto> {
    const match = await this.matchService.createMatch(dto);
    return MatchDto.toMatchDto(match);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'get all match list' })
  @ApiOkResponse({ type: MatchDto, isArray: true })
  @Get()
  async getAllMatch(
    @Request() req,
    @Query() query: MatchGetDto,
  ): Promise<PaginatorDto<MatchDto>> {
    const [matchs, count] = await this.matchService.getAllMatch(
      query.skip || 0,
      query.take || 10,
      query.filter,
      query.search || '',
      query.sort || SortFilter.Start,
      query.direction || DirectionFilter.DESC,
    );
    return {
      data: matchs.map((match) => MatchDto.toMatchDto(match)),
      count,
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'get one match' })
  @ApiOkResponse({ type: MatchDetailQueryDto })
  @Get(':id')
  @ApiImplicitParam({ name: 'id', required: true })
  async getOneMatch(
    @Param('id') id,
    @Query() query: MatchDetailGetDto,
  ): Promise<MatchDetailQueryDto> {
    return await this.matchService.getOneMatch(
      id,
      query.showGame || '',
      query.showChallenge || '',
      query.showPoll || '',
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'update a match' })
  @Put(':id')
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({ type: SuccessResponse })
  async updateMatch(
    @Param('id') id,
    @Body() body: MatchUpdateDto,
  ): Promise<SuccessResponse> {
    return this.matchService.updateMatch(id, body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'delete a match' })
  @Delete(':id')
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({ type: SuccessResponse })
  deleteMatch(@Param('id') id): Promise<SuccessResponse> {
    return this.matchService.deleteMatch(id);
  }
}
