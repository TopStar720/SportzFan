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

import { UserRole } from 'src/common/models/base';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { TransactionService } from './transaction.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { SuccessResponse } from '../common/models/success-response';
import {
  ActivityItemDto,
  TransactionAnalysisDto,
  TransactionDto,
  TransactionRegisterDto,
  TransactionUpdateDto,
  TransferTransactionDto,
} from './dtos/transaction.dto';
import { PaginatorDto } from '../common/dtos/paginator.dto';

@ApiTags('Transaction')
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan])
  @ApiOperation({ summary: 'create a new transaction' })
  @ApiOkResponse({ type: TransactionDto })
  @Post()
  async createTransaction(
    @Request() req,
    @Body() dto: TransactionRegisterDto,
  ): Promise<TransactionDto> {
    const transaction = await this.transactionService.createTransaction(dto);
    return TransactionDto.toTransactionDto(transaction);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'transfer to others' })
  @ApiOkResponse({ type: TransactionDto })
  @Post('transfer')
  async transfer(
    @Request() req,
    @Body() dto: TransferTransactionDto,
  ): Promise<TransactionDto> {
    const transaction = await this.transactionService.transfer(
      req.user.id,
      dto,
    );
    return TransactionDto.toTransactionDto(transaction);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan])
  @ApiOperation({ summary: 'get all transaction list' })
  @ApiOkResponse({ type: PaginatorDto<TransactionDto> })
  @Get()
  async getAllTransaction(
    @Query() query: PaginationDto,
  ): Promise<PaginatorDto<TransactionDto>> {
    let transactions = [];
    let count = 0;
    if (query.take) {
      [transactions, count] = await this.transactionService.getTransactionList(
        query.skip || 0,
        query.take || 10,
        '',
      );
    } else {
      [transactions, count] = await this.transactionService.getAllTransaction(
        '',
      );
    }
    return {
      data: transactions.map((transaction) =>
        TransactionDto.toTransactionDto(transaction),
      ),
      count,
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan])
  @ApiOperation({ summary: 'get team transaction list' })
  @ApiOkResponse({ type: PaginatorDto<TransactionDto> })
  @ApiImplicitParam({ name: 'teamId', required: true })
  @Get('list/:teamId')
  async getTeamTransaction(
    @Param('teamId') teamId,
    @Query() query: PaginationDto,
  ): Promise<PaginatorDto<TransactionDto>> {
    let transactions = [];
    let count = 0;
    if (query.take) {
      [transactions, count] = await this.transactionService.getTransactionList(
        query.skip || 0,
        query.take || 10,
        teamId,
      );
    } else {
      [transactions, count] = await this.transactionService.getAllTransaction(
        teamId,
      );
    }
    return {
      data: transactions.map((transaction) =>
        TransactionDto.toTransactionDto(transaction),
      ),
      count,
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan])
  @ApiOperation({ summary: 'get user transaction list' })
  @ApiOkResponse({ type: PaginatorDto<TransactionDto> })
  @ApiImplicitParam({ name: 'teamId', required: true })
  @Get('list/user-self/:teamId')
  async getUserTransaction(
    @Param('teamId') teamId,
    @Query() query: PaginationDto,
    @Request() req,
  ): Promise<PaginatorDto<TransactionDto>> {
    const [transactions, count] =
      await this.transactionService.getUserTransactionList(
        query.skip || 0,
        query.take || 10,
        teamId,
        req.user.id,
      );
    return {
      data: transactions.map((transaction) =>
        TransactionDto.toTransactionDto(transaction),
      ),
      count,
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan])
  @ApiOperation({ summary: 'get user analysis' })
  @ApiOkResponse({ type: TransactionAnalysisDto })
  @ApiImplicitParam({ name: 'userId', required: true })
  @Get('analysis/user-self/:userId')
  async getUserAnalysis(
    @Param('userId') userId,
  ): Promise<TransactionAnalysisDto> {
    const res = await this.transactionService.getUserAnalysis(userId);
    return {
      kudosAmount: res.kudos_amount || 0,
      tokenAmount: res.token_amount || 0,
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan])
  @ApiOperation({ summary: 'get activity list' })
  @ApiOkResponse({ type: ActivityItemDto, isArray: true })
  @Get('activity/list')
  async getActivityList(
    @Query() query: PaginationDto,
    @Request() req,
  ): Promise<ActivityItemDto[]> {
    return await this.transactionService.getActivityList(
      req.user.id,
      query.skip || 0,
      query.take || 10,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'get activity list' })
  @ApiOkResponse({ type: ActivityItemDto, isArray: true })
  @ApiImplicitParam({ name: 'userId', required: true })
  @Get('activity/:userId/list')
  async getActivityListForUser(
    @Query() query: PaginationDto,
    @Param('userId') userId,
  ): Promise<ActivityItemDto[]> {
    return await this.transactionService.getActivityList(
      userId,
      query.skip || 0,
      query.take || 10,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin])
  @ApiOperation({ summary: 'process pending transactions' })
  @ApiOkResponse({ type: SuccessResponse })
  @Put('process/pending')
  async processPendingTransactions(): Promise<SuccessResponse> {
    return await this.transactionService.processPendingTransactions();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan])
  @ApiOperation({ summary: 'get one transaction' })
  @ApiOkResponse({ type: TransactionDto })
  @Get(':id')
  @ApiImplicitParam({ name: 'id', required: true })
  async getOneTransaction(@Param('id') id): Promise<TransactionDto> {
    const transaction = await this.transactionService.getOneTransaction(id);
    return TransactionDto.toTransactionDto(transaction);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin])
  @ApiOperation({ summary: 'update a transaction' })
  @Put(':id')
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({ type: TransactionDto })
  async updateTransactionActivation(
    @Param('id') id,
    @Body() body: TransactionUpdateDto,
  ): Promise<TransactionDto> {
    return this.transactionService.updateTransactionUpdate(id, body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin])
  @ApiOperation({ summary: 'delete a transaction' })
  @Delete(':id')
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({ type: SuccessResponse })
  deleteTransaction(@Param('id') id): Promise<SuccessResponse> {
    return this.transactionService.deleteTransaction(id);
  }
}
