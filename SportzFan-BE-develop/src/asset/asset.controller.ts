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
import {
  AssetSortFilter,
  DirectionFilter,
  UserRole,
} from 'src/common/models/base';
import { SuccessResponse } from 'src/common/models/success-response';
import { AssetService } from './asset.service';
import {
  AssetDto,
  AssetListDto,
  AssetListResultDto,
  AssetRegisterDto,
  AssetUpdateDto,
  UserAssetListDto,
} from './dtos/asset.dto';
import { AssetRedeemDto, SendBonusAssetDto } from './dtos/assetRedeem.dto';
import { AssetRedeemEntity } from './entities/assetRedeem.entity';

@ApiTags('Asset')
@Controller('asset')
export class AssetController {
  constructor(private assetService: AssetService) {}

  @ApiOperation({ summary: 'Return all asset' })
  @ApiOkResponse({ type: AssetListResultDto, isArray: true })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.TeamAdmin])
  @Get('/list')
  async getAssetList(
    @Request() req,
    @Query() query: AssetListDto,
  ): Promise<PaginatorDto<AssetListResultDto>> {
    const [assetList, count] = await this.assetService.find(
      query.skip || 0,
      query.take || 10,
      query.filter,
      query.search || '',
      query.sort || AssetSortFilter.Start,
      query.direction || DirectionFilter.DESC,
    );
    return {
      data: assetList.map((asset) => ({
        ...asset.toDto(),
        purchaseCount: asset.purchaseCount,
        claimCount: asset.claimCount,
      })),
      count,
    };
  }

  @ApiOperation({ summary: 'Return all bonus asset' })
  @ApiOkResponse({ type: AssetDto, isArray: true })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.TeamAdmin])
  @Get('/bonus/list')
  async getBonusAssetList(
    @Request() req,
    @Query() query: AssetListDto,
  ): Promise<PaginatorDto<AssetListResultDto>> {
    const [assetList, count] = await this.assetService.findBonus(
      query.skip || 0,
      query.take || 10,
      query.filter,
      query.search || '',
    );
    return {
      data: (assetList || []).map((asset) => ({
        ...asset.toDto(),
        purchaseCount: asset.purchaseCount,
        claimCount: asset.claimCount,
      })),
      count,
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'Return one asset' })
  @ApiOkResponse({ type: AssetDto })
  @ApiImplicitParam({ name: 'id', required: true })
  @Get('/:id')
  async getAsset(@Param('id') id): Promise<AssetListResultDto> {
    const [asset, purchaseCount, claimCount] = await this.assetService.findById(
      id,
    );
    if (!asset) {
      throw new BadRequestException('Could not find the asset');
    }
    return {
      ...asset.toDto(),
      purchaseCount,
      claimCount,
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'Return asset redeem info' })
  @ApiOkResponse({ type: AssetDto })
  @ApiImplicitParam({ name: 'id', required: true })
  @Get('result/:id')
  async getAssetRedeem(@Param('id') id): Promise<AssetDto> {
    const asset = await this.assetService.getAssetRedeem(id);
    if (!asset) {
      throw new BadRequestException('Could not find the asset');
    }
    return asset.toDto();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan, UserRole.TeamAdmin])
  @ApiOperation({ summary: 'Return my asset redeem info' })
  @ApiOkResponse({ type: AssetDto })
  @ApiImplicitParam({ name: 'id', required: true })
  @Get('my-result/:id')
  async getMyAssetRedeem(@Request() req, @Param('id') id): Promise<AssetDto> {
    const asset = await this.assetService.getMyAssetRedeem(id, req.user.id);
    if (!asset) {
      throw new BadRequestException('Could not find the asset');
    }
    return asset.toDto();
  }

  @ApiOperation({ summary: 'Create a new asset' })
  @ApiOkResponse({ type: AssetDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.TeamAdmin])
  @Post()
  async createAsset(
    @Request() req,
    @Body() dto: AssetRegisterDto,
  ): Promise<AssetDto> {
    return this.assetService.addAsset(dto);
  }

  @ApiOperation({ summary: 'Update asset' })
  @ApiOkResponse({ type: SuccessResponse })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.TeamAdmin])
  @Put('/:id')
  async updateAsset(
    @Param('id') id,
    @Body() body: AssetUpdateDto,
  ): Promise<SuccessResponse> {
    return this.assetService.updateAsset(id, body);
  }

  @ApiOperation({ summary: 'Delete asset' })
  @ApiOkResponse({ type: SuccessResponse })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.TeamAdmin])
  @Delete('/:id')
  async DeleteAsset(@Param('id') id): Promise<SuccessResponse> {
    return this.assetService.removeById(id);
  }

  @ApiOperation({ summary: 'Redeem asset' })
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({ type: AssetRedeemDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan, UserRole.TeamAdmin])
  @Post('/:id/redeem')
  async redeemAsset(@Request() req, @Param('id') id): Promise<AssetRedeemDto> {
    const assetRedeem = await this.assetService.redeemAsset(
      req.user.teamId,
      req.user.id,
      id,
    );
    if (!assetRedeem) {
      throw new BadRequestException('Could not find the asset');
    }
    return assetRedeem.toDto();
  }

  @ApiOperation({ summary: 'Send bonus asset to users' })
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({ type: SuccessResponse })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.TeamAdmin])
  @Post('/:id/send-bonus')
  async sendBonusAsset(
    @Param('id') id,
    @Body() body: SendBonusAssetDto,
  ): Promise<SuccessResponse> {
    const { users, count, message } = body;
    return this.assetService.sendBonusAsset(id, users, count, message);
  }

  @ApiOperation({ summary: 'Claim asset' })
  @ApiImplicitParam({ name: 'redeemId', required: true })
  @ApiOkResponse({ type: AssetRedeemDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan, UserRole.TeamAdmin])
  @Post('/:redeemId/claim')
  async claimAsset(@Param('redeemId') redeemId): Promise<AssetRedeemDto> {
    const assetClaim = await this.assetService.claimAsset(redeemId);
    if (!assetClaim) {
      throw new BadRequestException('Could not find the asset redeem');
    }
    return assetClaim.toDto();
  }

  @ApiOperation({ summary: 'Get assets which are not redeemed' })
  @ApiOkResponse({ type: AssetListResultDto, isArray: true })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan, UserRole.TeamAdmin])
  @Get('/user/list')
  async getUserAssetList(
    @Request() req,
    @Query() query: UserAssetListDto,
  ): Promise<PaginatorDto<AssetListResultDto>> {
    const userId = req.user.id;
    const teamId = req.user.teamId;
    const [assetList, count] = await this.assetService.getUserAssets(
      userId,
      teamId,
      query.skip || 0,
      query.take || 10,
      query.type,
    );
    return {
      data: assetList.map((asset) => ({
        ...asset.toDto(),
        purchaseCount: asset.purchaseCount,
        claimCount: asset.claimCount,
      })),
      count,
    };
  }

  @ApiOperation({ summary: 'Get assets which are redeemed' })
  @ApiOkResponse({ type: AssetRedeemEntity, isArray: true })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Fan, UserRole.TeamAdmin])
  @Get('/mine/list')
  async getMyAssetList(
    @Request() req,
    @Query() query: UserAssetListDto,
  ): Promise<PaginatorDto<AssetRedeemEntity>> {
    const userId = req.user.id;
    const teamId = req.user.teamId;
    const [assetList, count] = await this.assetService.getMyAssets(
      userId,
      teamId,
      query.skip || 0,
      query.take || 10,
      query.type,
    );
    return {
      data: assetList,
      count,
    };
  }
}
