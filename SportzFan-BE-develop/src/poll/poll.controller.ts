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

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { PaginatorDto } from 'src/common/dtos/paginator.dto';
import { DirectionFilter, SortFilter, UserRole } from 'src/common/models/base';
import { SuccessResponse } from 'src/common/models/success-response';
import { PollService } from './poll.service';
import { PollDto, PollListDto } from './dtos/poll.dto';
import { PollRegisterDto } from './dtos/poll-register.dto';
import { PollUpdateDto } from './dtos/poll-update.dto';
import { PollParticipantRegisterDto } from './dtos/poll-participant-register.dto';
import { PollParticipantDto } from './dtos/poll-participant.dto';
import { PollParticipantEntity } from './entities/pollParticipant.entity';

@ApiTags('Poll')
@Controller('poll')
export class PollController {
  constructor(private pollService: PollService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'return poll list' })
  @ApiOkResponse({ type: PollDto, isArray: true })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan, UserRole.TeamAdmin])
  @Get('/list')
  async getPollList(
    @Request() req,
    @Query() query: PollListDto,
  ): Promise<PaginatorDto<PollDto>> {
    const [pollList, count] = await this.pollService.find(
      req.user.id,
      query.skip || 0,
      query.take || 10,
      query.filter,
      query.search || '',
      query.isEnded || '',
      query.isDraft || '',
      query.sort || SortFilter.Start,
      query.direction || DirectionFilter.DESC,
    );
    return {
      data: pollList.map((poll) => {
        return {
          ...poll.toDto(),
          isPlayed: !!poll.participants.length,
        };
      }),
      count,
    };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'return my poll list' })
  @ApiOkResponse({ type: PollDto, isArray: true })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan, UserRole.TeamAdmin])
  @Get('/my-list')
  async getMyList(
    @Request() req,
    @Query() query: PollListDto,
  ): Promise<PaginatorDto<PollDto>> {
    const [pollList, count] = await this.pollService.findMine(
      req.user.id,
      query.skip || 0,
      query.take || 10,
      query.filter,
      query.search || '',
      query.isEnded || '',
      query.isDraft || '',
    );
    return {
      data: pollList.map((poll) => poll.toDto()),
      count,
    };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Return one poll' })
  @ApiOkResponse({ type: PollDto })
  @ApiImplicitParam({ name: 'pollId', required: true })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan, UserRole.TeamAdmin])
  @Get('vote/check/:pollId')
  async checkMyPollResult(
    @Request() req,
    @Param('pollId') pollId,
  ): Promise<PollDto> {
    const poll = await this.pollService.checkMyPollResult(pollId, req.user.id);
    if (!poll) {
      throw new BadRequestException('Could not find the poll.');
    } else {
      return poll.toDto();
    }
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Return one poll' })
  @ApiOkResponse({ type: PollDto })
  @ApiImplicitParam({ name: 'id', required: true })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan, UserRole.TeamAdmin])
  @Get('/:id')
  async getPoll(@Param('id') id): Promise<PollDto> {
    const poll = await this.pollService.findById(id);
    if (!poll) {
      throw new BadRequestException('Could not find the poll.');
    } else {
      return poll.toDto();
    }
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Return one poll' })
  @ApiOkResponse({ type: PollDto })
  @ApiImplicitParam({ name: 'id', required: true })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan, UserRole.TeamAdmin])
  @Get('result/:id')
  async getPollResult(@Param('id') id): Promise<PollDto> {
    const poll = await this.pollService.getPollResult(id);
    if (!poll) {
      throw new BadRequestException('Could not find the poll.');
    } else {
      return poll.toDto();
    }
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Return one poll' })
  @ApiOkResponse({ type: PollDto })
  @ApiImplicitParam({ name: 'id', required: true })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan, UserRole.TeamAdmin])
  @Get('my-result/:id')
  async getPollMyResult(@Request() req, @Param('id') id): Promise<PollDto> {
    const poll = await this.pollService.getPollMyResult(id, req.user.id);
    if (!poll) {
      throw new BadRequestException('Could not find the poll.');
    } else {
      return poll.toDto();
    }
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'create a new poll' })
  @ApiOkResponse({ type: PollDto })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.TeamAdmin])
  @Post()
  async createPoll(
    @Request() req,
    @Body() dto: PollRegisterDto,
  ): Promise<PollDto> {
    return this.pollService.addPoll(dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update Poll' })
  @ApiOkResponse({ type: SuccessResponse })
  @ApiImplicitParam({ name: 'id', required: true })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.TeamAdmin])
  @Put('/:id')
  async updatePoll(
    @Param('id') id,
    @Body() dto: PollUpdateDto,
  ): Promise<SuccessResponse> {
    return this.pollService.updatePoll(id, dto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Publish Poll' })
  @ApiOkResponse({ type: PollDto })
  @ApiImplicitParam({ name: 'id', required: true })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.TeamAdmin])
  @Put('publish/:id')
  async publishPoll(@Param('id') id): Promise<PollDto> {
    const poll = await this.pollService.publishPoll(id);
    return poll.toDto();
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete Poll' })
  @ApiOkResponse({ type: SuccessResponse })
  @ApiImplicitParam({ name: 'id', required: true })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.TeamAdmin])
  @Delete('/:id')
  async DeletePoll(@Param('id') id): Promise<SuccessResponse> {
    return this.pollService.removeById(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Participate to Poll' })
  @ApiOkResponse({ type: PollParticipantDto })
  @ApiImplicitParam({ name: 'id', required: true })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan, UserRole.TeamAdmin])
  @Post('/:id/participate')
  async ParticipatePoll(
    @Request() req,
    @Param('id') id,
    @Body() dto: PollParticipantRegisterDto,
  ): Promise<PollParticipantEntity> {
    return this.pollService.addPollParticipant(
      req.user.teamId,
      req.user.id,
      id,
      dto,
    );
  }
}
