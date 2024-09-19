import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';

import {
  MarketplaceItemSubType,
  MarketplaceItemType,
} from 'src/common/models/base';
import { CommonDto } from '../../common/dtos/common.dto';

export class MiniGameRewardMarketplaceItemDto extends CommonDto {
  @ApiProperty({ description: 'the reward marketplace item type' })
  @IsEnum(MarketplaceItemType)
  type: MarketplaceItemType;

  @ApiProperty({ description: 'the reward marketplace item sub type' })
  @IsEnum(MarketplaceItemSubType)
  subType: MarketplaceItemSubType;

  @ApiProperty({ description: 'the reward marketplace item description' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'the reward marketplace item count' })
  @IsNumber()
  itemCount: number;

  @ApiProperty({ description: 'the reward marketplace item cost' })
  @IsNumber()
  itemCost: number;
}

export class MiniGameRewardMarketplaceItemRegisterDto {
  @ApiProperty({ description: 'the reward marketplace item type' })
  @IsEnum(MarketplaceItemType)
  type: MarketplaceItemType;

  @ApiProperty({ description: 'the reward marketplace item sub type' })
  @IsEnum(MarketplaceItemSubType)
  subType: MarketplaceItemSubType;

  @ApiProperty({ description: 'the reward marketplace item description' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'the reward marketplace item count' })
  @IsNumber()
  itemCount: number;

  @ApiProperty({ description: 'the reward marketplace item cost' })
  @IsNumber()
  itemCost: number;
}
