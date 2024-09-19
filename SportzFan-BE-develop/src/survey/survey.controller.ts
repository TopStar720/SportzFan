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

import { SurveyService } from './survey.service';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { PaginatorDto } from 'src/common/dtos/paginator.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PlaySurveyDto, PlaySurveyRegisterDto } from './dtos/play-survey.dto';
import { SuccessResponse } from '../common/models/success-response';
import { TransactionService } from 'src/transaction/transaction.service';
import {
  SurveyDto,
  SurveyRegisterDto,
  SurveyUpdateDto,
} from './dtos/survey.dto';
import {
  ChallengeType,
  TransactionStatus,
  TransactionType,
  UserRole,
} from 'src/common/models/base';
import { SocketService } from '../socket/socket.service';
import {
  NotificationCategoryType,
  NotificationType,
} from '../notification/dtos/notification.dto';

@ApiTags('Challenge / Survey')
@Controller('challenge')
export class SurveyController {
  constructor(
    private readonly surveyService: SurveyService,
    private readonly socketService: SocketService,
    private readonly transactionService: TransactionService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'create a new survey challenge' })
  @ApiOkResponse({ type: SurveyDto })
  @Post('survey')
  async createSurvey(
    @Request() req,
    @Body() dto: SurveyRegisterDto,
  ): Promise<SurveyDto> {
    const survey = await this.surveyService.createSurvey(dto);
    return SurveyDto.toSurveyDto(survey);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'get all survey challenge list' })
  @ApiOkResponse({ type: SurveyDto, isArray: true })
  @Get('survey')
  async getAllSurvey(
    @Request() req,
    @Query() query: PaginationDto,
  ): Promise<PaginatorDto<SurveyDto>> {
    const [surveys, count] = await this.surveyService.getAllSurvey(
      query.skip || 0,
      query.take || 10,
    );
    return {
      data: surveys.map((survey) => SurveyDto.toSurveyDto(survey)),
      count,
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'get one survey challenge list' })
  @ApiOkResponse({ type: SurveyDto })
  @Get('survey/:id')
  @ApiImplicitParam({ name: 'id', required: true })
  async getOneSurvey(@Param('id') id): Promise<SurveyDto> {
    const survey = await this.surveyService.getOneSurvey(id);
    if (!survey) {
      throw new BadRequestException('Could not find the survey.');
    } else {
      return SurveyDto.toSurveyDto(survey);
    }
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'update a survey challenge' })
  @Put('survey/:id')
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({ type: SurveyDto })
  async updateSurvey(
    @Param('id') id,
    @Body() body: SurveyUpdateDto,
  ): Promise<SurveyDto> {
    return this.surveyService.updateSurvey(id, body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'publish a survey challenge' })
  @Put('survey/publish/:id')
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({ type: SurveyDto })
  async publishSurvey(@Param('id') id): Promise<SurveyDto> {
    return this.surveyService.publish(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'delete a survey challenge' })
  @Delete('survey/:id')
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({ type: SuccessResponse })
  deleteSurvey(@Param('id') id): Promise<SuccessResponse> {
    return this.surveyService.deleteChallenge(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'create a new play survey history' })
  @ApiOkResponse({ type: PlaySurveyDto })
  @Post('survey/play')
  async createPlaySurvey(
    @Request() req,
    @Body() dto: PlaySurveyRegisterDto,
  ): Promise<PlaySurveyDto> {
    const playSurvey = await this.surveyService.createPlaySurvey(
      dto,
      req.user.teamId,
      req.user.id,
    );
    if (playSurvey) {
      this.socketService.message$.next({
        userId: req.user.id,
        type: NotificationType.ChallengeCompleted,
        category: NotificationCategoryType.Challenge,
        section: ChallengeType.Survey,
        uniqueId: playSurvey.surveyId,
        content: playSurvey.survey.title,
      });
      await this.transactionService.createTransaction({
        receiverId: req.user.id,
        teamId: req.user.teamId,
        matchId: playSurvey.survey.matchId,
        type: TransactionType.SurveyReward,
        uniqueId: playSurvey.id,
        status: TransactionStatus.Pending,
        kudosAmount: playSurvey.survey.kudosReward,
        tokenAmount: playSurvey.survey.tokenReward,
        reason: playSurvey.survey.title,
      });
    }
    return playSurvey.toDto();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'get one survey challenge for user' })
  @ApiOkResponse({ type: SurveyDto })
  @Get('survey/play/:id')
  @ApiImplicitParam({ name: 'id', required: true })
  async getOneSurveyForUser(
    @Request() req,
    @Param('id') id,
  ): Promise<SurveyDto> {
    return this.surveyService.getOneSurveyForUser(id, req.user.id);
  }

  @ApiOperation({ summary: 'get one survey challenge' })
  @ApiOkResponse({ type: SurveyDto })
  @Get('survey/result/:id')
  @ApiImplicitParam({ name: 'id', required: true })
  async getSurveyResult(@Param('id') id): Promise<any> {
    return this.surveyService.getSurveyResult(id);
  }
}
