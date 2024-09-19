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
  SportsDto,
  SportsListDto,
  SportsRegisterDto,
  SportsUpdateDto,
} from './dtos/sports.dto';
import { SportsService } from './sports.service';
import { UserRole } from 'src/common/models/base';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { PaginatorDto } from '../common/dtos/paginator.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { SuccessResponse } from 'src/common/models/success-response';

@ApiTags('Admin / Sports')
@Controller('sports')
export class SportsController {
  constructor(private readonly sportsService: SportsService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'create a new sport' })
  @ApiOkResponse({ type: SportsDto })
  @Post()
  async createSport(
    @Request() req,
    @Body() dto: SportsRegisterDto,
  ): Promise<SportsDto> {
    const sport = await this.sportsService.createSport(dto);
    return SportsDto.toSportsDto(sport);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'get all sport list' })
  @ApiOkResponse({ type: PaginatorDto<SportsDto> })
  @Get()
  async getAllSport(
    @Request() req,
    @Query() query: SportsListDto,
  ): Promise<PaginatorDto<SportsDto>> {
    const [sports, count] = await this.sportsService.getAllSport(
      query.skip || 0,
      query.take || 10,
    );
    return {
      data: (sports || []).map((sport) => SportsDto.toSportsDto(sport)),
      count,
    };
  }

  @ApiOperation({ summary: 'get one sport' })
  @ApiOkResponse({ type: SportsDto, isArray: true })
  @ApiImplicitParam({ name: 'id', required: true })
  @Get(':id')
  async getOneSport(@Param('id') id): Promise<SportsDto> {
    const sport = await this.sportsService.getOneSport(id);
    return SportsDto.toSportsDto(sport);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'update a sport' })
  @Put(':id')
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({ type: SuccessResponse })
  async updateSport(
    @Param('id') id,
    @Body() body: SportsUpdateDto,
  ): Promise<SuccessResponse> {
    return this.sportsService.updateSport(id, body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'delete a sport' })
  @Delete(':id')
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({ type: SuccessResponse })
  deleteSport(@Param('id') id): Promise<SuccessResponse> {
    return this.sportsService.deleteSport(id);
  }
}
