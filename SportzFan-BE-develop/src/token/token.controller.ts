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

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/models/base';
import { SuccessResponse } from 'src/common/models/success-response';
import {
  TokenDto,
  TokenListDto,
  TokenRegisterDto,
  TokenUpdateDto,
} from './dtos/token.dto';
import { TokenService } from './token.service';
import { PaginatorDto } from '../common/dtos/paginator.dto';

@ApiTags('Admin / Token')
@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'create a new token' })
  @ApiOkResponse({ type: TokenDto })
  @Post()
  async createToken(
    @Request() req,
    @Body() dto: TokenRegisterDto,
  ): Promise<TokenDto> {
    const token = await this.tokenService.createToken(dto);
    return TokenDto.toTokenDto(token);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'get all token list' })
  @ApiOkResponse({ type: PaginatorDto<TokenDto> })
  @Get()
  async getAllToken(
    @Request() req,
    @Query() query: TokenListDto,
  ): Promise<PaginatorDto<TokenDto>> {
    const [tokens, count] = await this.tokenService.getAllToken(
      query.skip || 0,
      query.take || 10,
      query.search || '',
    );
    return {
      data: (tokens || []).map((token) => TokenDto.toTokenDto(token)),
      count,
    };
  }

  @ApiOperation({ summary: 'get a token list' })
  @ApiOkResponse({ type: TokenDto, isArray: true })
  @ApiImplicitParam({ name: 'id', required: true })
  @Get(':id')
  async getOneToken(@Param('id') id): Promise<TokenDto> {
    const token = await this.tokenService.getOneToken(id);
    return TokenDto.toTokenDto(token);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'update a token' })
  @Put(':id')
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({ type: SuccessResponse })
  async updateToken(
    @Param('id') id,
    @Body() body: TokenUpdateDto,
  ): Promise<SuccessResponse> {
    return this.tokenService.updateToken(id, body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'delete a token' })
  @Delete(':id')
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({ type: SuccessResponse })
  deleteToken(@Param('id') id): Promise<SuccessResponse> {
    return this.tokenService.deleteToken(id);
  }
}
