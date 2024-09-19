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

import { CheckInService } from './check-in.service';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { PaginatorDto } from 'src/common/dtos/paginator.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { SuccessResponse } from '../common/models/success-response';
import { TransactionService } from 'src/transaction/transaction.service';
import {
  TransactionStatus,
  TransactionType,
  UserRole,
} from 'src/common/models/base';
import {
  DistanceCalculatorDto,
  PlayCheckInDto,
  PlayCheckInRegisterDto,
} from './dtos/play-check-in.dto';
import {
  CheckInDto,
  CheckInDuplicateDto,
  CheckInRegisterDto,
  CheckInUpdateDto,
} from './dtos/check-in.dto';
import { SocketService } from '../socket/socket.service';

@ApiTags('Challenge / Check-In')
@Controller('challenge')
export class CheckInController {
  constructor(
    private readonly checkInService: CheckInService,
    private readonly socketService: SocketService,
    private readonly transactionService: TransactionService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'create a new check-in challenge' })
  @ApiOkResponse({ type: CheckInDto })
  @Post('check-in')
  async createCheckIn(
    @Request() req,
    @Body() dto: CheckInRegisterDto,
  ): Promise<CheckInDto> {
    const checkIn = await this.checkInService.createCheckIn(dto);
    return CheckInDto.toCheckInDto(checkIn);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'duplicate a new check-in challenge' })
  @ApiOkResponse({ type: CheckInDto })
  @Post('check-in/duplicate')
  async duplicateCheckIn(
    @Request() req,
    @Body() dto: CheckInDuplicateDto,
  ): Promise<CheckInDto> {
    const checkIn = await this.checkInService.duplicateCheckIn(dto);
    return CheckInDto.toCheckInDto(checkIn);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'get all check-in challenge list' })
  @ApiOkResponse({ type: CheckInDto, isArray: true })
  @Get('check-in')
  async getAllCheckIn(
    @Request() req,
    @Query() query: PaginationDto,
  ): Promise<PaginatorDto<CheckInDto>> {
    const [checkIns, count] = await this.checkInService.getAllCheckIn(
      query.skip || 0,
      query.take || 10,
    );
    return {
      data: checkIns.map((checkIn) => CheckInDto.toCheckInDto(checkIn)),
      count,
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'get one check-in challenge' })
  @ApiOkResponse({ type: CheckInDto })
  @Get('check-in/:id')
  @ApiImplicitParam({ name: 'id', required: true })
  async getOneCheckIn(@Param('id') id): Promise<CheckInDto> {
    const checkIn = await this.checkInService.getOneCheckIn(id);
    return CheckInDto.toCheckInDto(checkIn);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'get one check-in challenge' })
  @ApiOkResponse({ type: CheckInDto })
  @Get('check-in/result/:id')
  @ApiImplicitParam({ name: 'id', required: true })
  async getOneCheckInResult(@Param('id') id): Promise<PlayCheckInDto[]> {
    return this.checkInService.getOneCheckInResult(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'get one check-in challenge' })
  @ApiOkResponse({ type: CheckInDto })
  @Get('check-in/my-result/:id')
  @ApiImplicitParam({ name: 'id', required: true })
  async getOneCheckInResultForUser(
    @Request() req,
    @Param('id') id,
  ): Promise<PlayCheckInDto> {
    return this.checkInService.getOneCheckInResultForUser(id, req.user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'update a check-in challenge' })
  @Put('check-in/:id')
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({ type: CheckInDto })
  async updateCheckIn(
    @Param('id') id,
    @Body() body: CheckInUpdateDto,
  ): Promise<CheckInDto> {
    return this.checkInService.updateCheckIn(id, body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'publish a check-in challenge' })
  @Put('check-in/publish/:id')
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({ type: CheckInDto })
  async publishCheckIn(@Param('id') id): Promise<CheckInDto> {
    return this.checkInService.publish(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'delete a check-in challenge' })
  @Delete('check-in/:id')
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({ type: SuccessResponse })
  deleteCheckIn(@Param('id') id): Promise<SuccessResponse> {
    return this.checkInService.deleteCheckIn(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Fan])
  @ApiOperation({ summary: 'create a new play check-in history' })
  @ApiOkResponse({ type: PlayCheckInDto })
  @Post('check-in/play')
  async createPlayCheckIn(
    @Request() req,
    @Body() dto: PlayCheckInRegisterDto,
  ): Promise<PlayCheckInDto> {
    const playCheckIn = await this.checkInService.createPlayCheckIn(
      req.user.teamId,
      req.user.id,
      dto,
    );
    if (playCheckIn) {
      await this.transactionService.createTransaction({
        receiverId: req.user.id,
        teamId: req.user.teamId,
        matchId: playCheckIn.checkIn.match.id,
        type: TransactionType.CheckInReward,
        uniqueId: playCheckIn.id,
        status: TransactionStatus.Pending,
        kudosAmount:
          dto.location === 0
            ? playCheckIn.checkIn.kudosReward
            : playCheckIn.checkIn.outKudosReward,
        tokenAmount:
          dto.location === 0
            ? playCheckIn.checkIn.tokenReward
            : playCheckIn.checkIn.outTokenReward,
        reason: playCheckIn.checkIn.title,
      });
    }
    return playCheckIn;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'get one check-in challenge list' })
  @ApiOkResponse({ type: CheckInDto })
  @Get('check-in/play/:id')
  @ApiImplicitParam({ name: 'id', required: true })
  async getOneCheckInForUser(
    @Request() req,
    @Param('id') id,
  ): Promise<CheckInDto> {
    return this.checkInService.getOneCheckInForUser(id, req.user.id);
  }

  @ApiOperation({ summary: 'get distance between two location' })
  @Post('check-in/distance')
  async getDistance(
    @Request() req,
    @Body() dto: DistanceCalculatorDto,
  ): Promise<number> {
    return this.checkInService.getDistance(dto);
  }
}
