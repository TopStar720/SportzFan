import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
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
import { ApiImplicitParam } from '@nestjs/swagger/dist/decorators/api-implicit-param.decorator';

import {
  SponsorDetailGetDto,
  SponsorDetailResponseDto,
  SponsorDto,
  SponsorGetDto,
  SponsorRegisterDto,
  SponsorStatisticGetDto,
  SponsorStatisticResponseDto,
  SponsorUpdateDto,
} from './dtos/sponsor.dto';
import { UserRole } from 'src/common/models/base';
import { SponsorService } from './sponsor.service';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { PaginatorDto } from 'src/common/dtos/paginator.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { SuccessResponse } from '../common/models/success-response';

@ApiTags('Admin / Sponsor')
@Controller('sponsor')
export class SponsorController {
  constructor(private readonly sponsorService: SponsorService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'create a new sponsor' })
  @ApiOkResponse({ type: SuccessResponse })
  @Post()
  async createSponsor(
    @Request() req,
    @Body() dto: SponsorRegisterDto,
  ): Promise<SponsorDto> {
    const sponsor = await this.sponsorService.createSponsor(dto);
    return SponsorDto.toSponsorDto(sponsor);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'get all sponsor list' })
  @ApiOkResponse({ type: SponsorDto, isArray: true })
  @Get()
  async getAllSponsor(
    @Request() req,
    @Query() query: SponsorGetDto,
  ): Promise<PaginatorDto<SponsorDto>> {
    const [sponsors, count] = await this.sponsorService.getAllSponsor(
      query.skip || 0,
      query.take || 10,
      query.search || '',
    );

    return {
      data: sponsors.map((sponsor) => SponsorDto.toSponsorDto(sponsor)),
      count,
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'get sponsor detail list' })
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({ type: PaginatorDto<SponsorDetailResponseDto> })
  @Get('detail/:id')
  async getSponsorDetail(
    @Request() req,
    @Param('id') sponsorId,
    @Query() query: SponsorDetailGetDto,
  ): Promise<PaginatorDto<SponsorDetailResponseDto>> {
    return await this.sponsorService.getSponsorDetailList(
      sponsorId,
      query.skip || 0,
      query.take || 10,
      query.filter,
      query.isDraft || '',
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'get sponsor statistic' })
  @ApiOkResponse({ type: PaginatorDto<SponsorDetailResponseDto> })
  @Get('statistic/detail/list')
  async getSponsorStatistic(
    @Request() req,
    @Query() query: SponsorStatisticGetDto,
  ): Promise<PaginatorDto<SponsorStatisticResponseDto>> {
    return await this.sponsorService.getSponsorStatisticList(
      query.sponsorId || '',
      query.filter,
      query.isDraft || '',
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'get one sponsor' })
  @ApiOkResponse({ type: SponsorDto })
  @Get(':id')
  @ApiImplicitParam({ name: 'id', required: true })
  async getOneSponsor(@Param('id') id): Promise<SponsorDto> {
    const sponsor = await this.sponsorService.getOneSponsor(id);
    return SponsorDto.toSponsorDto(sponsor);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'update a sponsor' })
  @Put(':id')
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({ type: SponsorDto })
  async updateSponsor(
    @Param('id') id,
    @Body() body: SponsorUpdateDto,
  ): Promise<SponsorDto> {
    return this.sponsorService.updateSponsor(id, body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'delete a sponsor' })
  @Delete(':id')
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({ type: SuccessResponse })
  deleteSponsor(@Param('id') id): Promise<SuccessResponse> {
    return this.sponsorService.deleteSponsor(id);
  }
}
