import {
  Controller,
  Get,
  Param,
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

import { ChallengeService } from './challenge.service';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { PaginatorDto } from '../common/dtos/paginator.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import {
  ChallengeFilter,
  DirectionFilter,
  SortFilter,
  UserRole,
} from 'src/common/models/base';
import {
  ChallengeItemDto,
  ChallengeListBySideDto,
  ChallengeListBySideResponseDto,
  ChallengeListDto,
} from './dtos/challenge.dto';
import { ApiImplicitParam } from '@nestjs/swagger/dist/decorators/api-implicit-param.decorator';

@ApiTags('Challenge')
@Controller('challenge')
export class ChallengeController {
  constructor(private readonly challengeService: ChallengeService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'get all challenge list' })
  @ApiOkResponse({ type: PaginatorDto<ChallengeItemDto> })
  @Get('list')
  async getAllChallenges(
    @Request() req,
    @Query() query: ChallengeListDto,
  ): Promise<PaginatorDto<ChallengeItemDto>> {
    return await this.challengeService.getChallenges(
      query.skip || 0,
      query.take || 10,
      query.filter || ChallengeFilter.All,
      query.search || '',
      query.isDraft || '',
      query.sort || SortFilter.Start,
      query.direction || DirectionFilter.DESC,
      req.user.id,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan])
  @ApiOperation({ summary: 'get my challenge list' })
  @ApiOkResponse({ type: PaginatorDto<ChallengeItemDto> })
  @Get('my-list')
  async getMyChallenges(
    @Request() req,
    @Query() query: ChallengeListDto,
  ): Promise<PaginatorDto<ChallengeItemDto>> {
    return await this.challengeService.getMyChallenges(
      query.skip || 0,
      query.take || 10,
      query.filter || ChallengeFilter.All,
      query.search || '',
      req.user.id,
      query.isDraft || '',
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan])
  @ApiOperation({ summary: 'get challenge list by owner => side: other/owner' })
  @ApiOkResponse({ type: ChallengeListBySideResponseDto })
  @ApiImplicitParam({ name: 'side', required: true })
  @Get('list/:side')
  async getChallengesByOwner(
    @Request() req,
    @Query() query: ChallengeListBySideDto,
    @Param('side') side,
  ): Promise<ChallengeListBySideResponseDto> {
    return await this.challengeService.getChallengesByOwner(
      side,
      req.user.id,
      query.filter || ChallengeFilter.All,
      query.search || '',
    );
  }
}
