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
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import {
  AdminRegisterDto,
  AdminUpdateDto,
  DetailedLeaderboardListDto,
  LeaderboardDto,
  UserAnalysisDto,
  UserBalanceDto,
  UserDto,
  UserListDto,
  UserResetPasswordRequestDto,
  UserUpdateDto,
  UserUpdateResponseDto,
} from './dto/user.dto';
import { UserService } from './user.service';
import {
  DirectionFilter,
  UserRole,
  UserSortFilter,
} from '../common/models/base';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SuccessResponse } from 'src/common/models/success-response';
import { PaginatorDto } from '../common/dtos/paginator.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'creat team admin user' })
  @ApiOkResponse({ type: SuccessResponse })
  @Post('add-team-admin')
  async createTeamAdmin(
    @Request() req,
    @Body() adminRegisterDto: AdminRegisterDto,
  ): Promise<SuccessResponse> {
    if (
      req.user.role === UserRole.TeamAdmin &&
      req.user.teamId != adminRegisterDto.teamId
    ) {
      throw new BadRequestException('Could not add other team admin');
    }
    adminRegisterDto.role = UserRole.TeamAdmin;
    return this.userService.addAdmin(adminRegisterDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'creat team admin user' })
  @ApiOkResponse({ type: SuccessResponse })
  @Post('update-team-admin/:userId')
  async updateTeamAdmin(
    @Param('userId') userId: string,
    @Body() adminUpdateDto: AdminUpdateDto,
  ): Promise<SuccessResponse> {
    return this.userService.updateAdmin(userId, adminUpdateDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'get all users' })
  @ApiOkResponse({ type: PaginatorDto<UserDto> })
  @Get()
  async findAll(@Request() req, @Query() query: UserListDto) {
    const [userList, count] = await this.userService.findAll(
      query.skip || 0,
      query.take || 10,
      query.search || '',
      query.teams || '',
      query.sort || UserSortFilter.Name,
      query.direction || DirectionFilter.ASC,
    );

    return {
      data: (userList || []).map((item) => item.toUserDto()),
      count,
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'get a user by email, teamId' })
  @ApiOkResponse({ type: UserDto })
  @Get('get-one/:teamId/:email')
  async findOne(
    @Request() req,
    @Param('teamId') teamId: string,
    @Param('email') email: string,
  ) {
    if (req.user.role === UserRole.TeamAdmin && req.user.teamId != teamId) {
      throw new BadRequestException('Could not get other team data');
    }
    const user = await this.userService.findOne(teamId, email);
    if (!user) {
      throw new BadRequestException('Could not find user');
    }
    return user.toUserDto();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.TeamAdmin, UserRole.Fan])
  @ApiOperation({ summary: 'get a user by userId' })
  @ApiOkResponse({ type: UserDto })
  @Get('get-one/:userId')
  async findOneByUserId(@Request() req, @Param('userId') userId: string) {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new BadRequestException('Could not find user');
    }
    return user.toUserDto();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'get user profile' })
  @ApiOkResponse({ type: UserDto })
  @Get('profile')
  async getProfile(@Request() req) {
    const user = await this.userService.findUserById(req.user.id);
    if (!user) {
      throw new BadRequestException('Could not find user');
    }
    return user.toUserDto();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Fan, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'update user profile' })
  @ApiOkResponse({ type: UserUpdateResponseDto })
  @Put('profile-update')
  async update(@Request() req, @Body() updateUserDto: UserUpdateDto) {
    const userRes = await this.userService.update(req.user.id, updateUserDto);
    return {
      user: userRes.entity.toUserDto(),
      reward: userRes.reward,
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'activate user' })
  @ApiOkResponse({ type: UserDto })
  @Put('activate-user/:userId')
  async activate(@Param('userId') userId: string) {
    const userRes = await this.userService.updateActivation(userId, true);
    return userRes.toUserDto();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'inactivate user' })
  @ApiOkResponse({ type: UserDto })
  @Put('inactivate-user/:userId')
  async inactivate(@Param('userId') userId: string) {
    const userRes = await this.userService.updateActivation(userId, false);
    return userRes.toUserDto();
  }

  @ApiOperation({ summary: 'verify user' })
  @ApiOkResponse({ type: SuccessResponse })
  @Get('verify/:code')
  verify(@Param('code') code: string): Promise<SuccessResponse> {
    return this.userService.verify(code);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'reset password' })
  @ApiOkResponse({ type: UserDto })
  @Put('reset-password')
  async resetPassword(
    @Request() req,
    @Body() resetPasswordUserDto: UserResetPasswordRequestDto,
  ) {
    const user = await this.userService.resetPassword(
      req.user.id,
      resetPasswordUserDto,
    );
    return user.toUserDto();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'refer a friend' })
  @ApiParam({ name: 'email', type: 'string' })
  @ApiOkResponse({ type: SuccessResponse })
  @Get('refer/:email')
  refer(@Param('email') email: string, @Request() req) {
    return this.userService.refer(req.user.id, email);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'get referral link' })
  @ApiParam({ name: 'email', type: 'string' })
  @ApiOkResponse({ type: String })
  @Get('get-referral-link')
  getReferralLink(@Request() req) {
    return this.userService.getReferLink(req.user.id);
  }

  @ApiOperation({ summary: 'forgot password pre-request' })
  @ApiParam({ name: 'email', type: 'string' })
  @ApiParam({ name: 'teamId', type: 'string' })
  @ApiOkResponse({ type: SuccessResponse })
  @Get('forgot-password-pre-request/:teamId/:email')
  forgotPreRequest(
    @Param('teamId') teamId: string,
    @Param('email') email: string,
  ) {
    return this.userService.forgotPasswordPreRequest(teamId, email);
  }

  @ApiOperation({ summary: 'forgot password request' })
  @ApiParam({ name: 'code', type: 'string' })
  @ApiParam({ name: 'password', type: 'string' })
  @ApiOkResponse({ type: SuccessResponse })
  @Get('forgot-password-request/:code/:password')
  forgotRequest(
    @Param('code') code: string,
    @Param('password') password: string,
  ) {
    return this.userService.forgotPasswordRequest(code, password);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'get leaderboard' })
  @ApiOkResponse({ type: LeaderboardDto, isArray: true })
  @Get('leaderboard/:skip/:limit')
  leaderboard(
    @Param('skip') skip: number,
    @Param('limit') limit: number,
    @Request() req,
  ) {
    return this.userService.leaderboard(skip, limit, req.user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'get detailed leaderboard' })
  @ApiOkResponse({ type: LeaderboardDto, isArray: true })
  @Get('detailed-leaderboard')
  async detailedLeaderboard(
    @Request() req,
    @Query() query: DetailedLeaderboardListDto,
  ) {
    return await this.userService.detailedLeaderboard(query, req.user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Fan, UserRole.SuperAdmin, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'get balance' })
  @ApiOkResponse({ type: UserBalanceDto })
  @Get('balance')
  balance(@Request() req) {
    return this.userService.getUserBalance(req.user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'get use analysis' })
  @ApiOkResponse({ type: UserAnalysisDto })
  @ApiParam({ name: 'userId', type: 'string' })
  @Get('analysis-info/:userId')
  analysis(@Request() req, @Param('userId') userId: string) {
    return this.userService.getUserAnalysis(userId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'remove user' })
  @ApiOkResponse({ type: SuccessResponse })
  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.userService.remove(req.user.role, req.user.teamId, id);
  }
}
