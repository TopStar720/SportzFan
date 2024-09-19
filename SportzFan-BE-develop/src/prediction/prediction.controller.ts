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

import { RolesGuard } from 'src/auth/guards/roles.guard';
import { PredictionService } from './prediction.service';
import { PaginatorDto } from 'src/common/dtos/paginator.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { SuccessResponse } from '../common/models/success-response';
import {
  PlayPredictionDto,
  PlayPredictionRegisterDto,
} from './dtos/play-prediction.dto';
import { TransactionService } from 'src/transaction/transaction.service';
import {
  TransactionStatus,
  TransactionType,
  UserRole,
} from 'src/common/models/base';
import {
  PredictionDto,
  PredictionListDto,
  PredictionMyResultDto,
  PredictionRegisterDto,
  PredictionResultUpdateDto,
} from './dtos/prediction.dto';

@ApiTags('Game / Prediction')
@Controller('game')
export class PredictionController {
  constructor(
    private readonly predictionService: PredictionService,
    private transactionService: TransactionService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.TeamAdmin])
  @ApiOkResponse({ type: SuccessResponse })
  @ApiOperation({ summary: 'create a new prediction game' })
  @Post('prediction')
  async createPrediction(
    @Request() req,
    @Body() dto: PredictionRegisterDto,
  ): Promise<PredictionDto> {
    const prediction = await this.predictionService.createPrediction(dto);
    return PredictionDto.toPredictionDto(prediction);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'get all prediction games' })
  @ApiOkResponse({ type: PredictionDto, isArray: true })
  @Get('prediction')
  async getAllPrediction(
    @Request() req,
    @Query() query: PredictionListDto,
  ): Promise<PaginatorDto<PredictionDto>> {
    const [predictions, count] = await this.predictionService.getAllPrediction(
      query.skip || 0,
      query.take || 10,
      query.isVerified || '',
      query.search || '',
    );
    return {
      data: predictions.map((prediction) =>
        PredictionDto.toPredictionDto(prediction),
      ),
      count,
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'get one prediction game by prediction id' })
  @ApiOkResponse({ type: PredictionDto })
  @ApiImplicitParam({ name: 'predictionId', required: true })
  @Get('prediction/:predictionId')
  async getOnePrediction(
    @Param('predictionId') predictionId: string,
  ): Promise<PredictionDto> {
    const prediction = await this.predictionService.getOnePrediction(
      predictionId,
    );
    return PredictionDto.toPredictionDto(prediction);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.TeamAdmin])
  @ApiOperation({
    summary: 'update a prediction game to fill match result',
  })
  @ApiOkResponse({ type: SuccessResponse })
  @ApiImplicitParam({ name: 'predictionId', required: true })
  @Put('prediction/result/:predictionId')
  async updatePredictionResult(
    @Param('predictionId') predictionId: string,
    @Body() dto: PredictionResultUpdateDto,
  ): Promise<SuccessResponse> {
    return this.predictionService.updatePredictionResult(predictionId, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'update a prediction game' })
  @ApiOkResponse({ type: SuccessResponse })
  @ApiImplicitParam({ name: 'predictionId', required: true })
  @Put('prediction/:predictionId')
  async updatePrediction(
    @Param('predictionId') predictionId,
    @Body() dto: PredictionRegisterDto,
  ): Promise<SuccessResponse> {
    return this.predictionService.updatePrediction(predictionId, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'create a new user play history' })
  @ApiOkResponse({ type: SuccessResponse })
  @Post('prediction/play')
  async createPlayPrediction(
    @Request() req,
    @Body() dto: PlayPredictionRegisterDto,
  ): Promise<SuccessResponse> {
    return this.predictionService.createPlayPrediction(
      dto,
      req.user.teamId,
      req.user.id,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'get play predictions for user' })
  @ApiOkResponse({ type: PlayPredictionDto, isArray: true })
  @Get('prediction/play/list')
  async getPredictionPlayListForUser(
    @Request() req,
  ): Promise<PlayPredictionDto[]> {
    const predictionPlayList =
      (await this.predictionService.getPredictionListForUser(req.user.id)) ||
      [];
    return predictionPlayList.map((item) => item.toDto());
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'get the prediction game result: superadmin' })
  @ApiOkResponse({ type: PredictionDto })
  @Get('prediction/result/:predictionId')
  @ApiImplicitParam({ name: 'predictionId', required: true })
  async getPredictionResult(
    @Request() req,
    @Param('predictionId') predictionId,
  ): Promise<PredictionDto> {
    const prediction = await this.predictionService.getPredictionResult(
      predictionId,
    );
    return PredictionDto.toPredictionDto(prediction);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.TeamAdmin, UserRole.Fan])
  @ApiOperation({ summary: 'get the prediction game result for one user' })
  @ApiOkResponse({ type: PredictionDto })
  @Get('prediction/my-result/:predictionId')
  @ApiImplicitParam({ name: 'predictionId', required: true })
  async getMyPredictionResult(
    @Request() req,
    @Param('predictionId') predictionId,
  ): Promise<PredictionMyResultDto> {
    const [prediction, totalCount] =
      await this.predictionService.getMyPredictionResult(
        predictionId,
        req.user.id,
      );
    return { ...PredictionDto.toPredictionDto(prediction), totalCount };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'finish prediction game and send reward' })
  @ApiOkResponse({ type: SuccessResponse })
  @Post('prediction/finish/:predictionId')
  @ApiImplicitParam({ name: 'predictionId', required: true })
  async finishPrediction(
    @Request() req,
    @Param('predictionId') predictionId,
  ): Promise<any> {
    const predictionEntity = await this.predictionService.getOnePrediction(
      predictionId,
    );
    if (predictionEntity.isEnded) {
      throw new BadRequestException(
        'Could not finish for already ended prediction.',
      );
    } else if (!predictionEntity.isResult) {
      throw new BadRequestException('You should input outcome result first.');
    } else {
      const [scores, prediction] = await this.predictionService.calcRank(
        predictionId,
      );
      const rewardDistribution = prediction.rewardDistribution;

      for (const score of scores) {
        const index = scores.indexOf(score);
        const reward = rewardDistribution.find(
          (distribution) => distribution.winnerOrder === index + 1,
        );
        if (reward) {
          await this.transactionService.createTransaction({
            receiverId: score.playPrediction_user_id,
            teamId: prediction.teamId,
            matchId: prediction.matchId,
            type: TransactionType.PredictionReward,
            uniqueId: score.playPrediction_id,
            status: TransactionStatus.Pending,
            kudosAmount: reward.rewardKudos,
            tokenAmount: reward.rewardToken,
            reason: prediction.title,
          });
        }
        await this.predictionService.updateRankScore({
          playPredictionId: score.playPrediction_id,
          rank: index + 1,
          rewardToken: reward ? reward.rewardToken : 0,
          rewardKudos: reward ? reward.rewardKudos : 0,
          isSent: !!reward,
        });
      }

      await this.predictionService.endPrediction(predictionId);
      return new SuccessResponse(true);
    }
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'delete a prediction game' })
  @ApiOkResponse({ type: SuccessResponse })
  @ApiImplicitParam({ name: 'predictionId', required: true })
  @Delete('prediction/:predictionId')
  deletePrediction(
    @Param('predictionId') predictionId,
  ): Promise<SuccessResponse> {
    return this.predictionService.deletePrediction(predictionId);
  }
}
