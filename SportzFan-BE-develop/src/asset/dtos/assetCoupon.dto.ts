import { ApiProperty } from '@nestjs/swagger';

import { CommonDto } from '../../common/dtos/common.dto';

export class AssetCouponDto extends CommonDto {
  @ApiProperty({ description: 'the coupon code' })
  code: string;

  @ApiProperty({ description: 'the asset id' })
  assetId: string;

  @ApiProperty({ description: 'the user id' })
  userId: string;

  @ApiProperty({ description: 'the order' })
  order: number;
}

export class AssetCouponRegisterDto {
  @ApiProperty({ description: 'the coupon code' })
  code: string;

  @ApiProperty({ description: 'the order' })
  order: number;
}
