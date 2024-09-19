import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';

import { CommonDto } from 'src/common/dtos/common.dto';
import { UserDto } from 'src/user/dto/user.dto';

export class AssetRedeemDto extends CommonDto {
  @ApiProperty({ description: 'the user' })
  user: UserDto;

  @ApiProperty({ description: 'the asset id' })
  assetId: string;

  @ApiProperty({ description: 'the coupon id' })
  couponId?: string;

  @ApiProperty({ description: 'the claim date' })
  claimDate?: string;

  @ApiProperty({ description: 'the message for notification' })
  message?: string;
}

export class SendBonusAssetDto {
  @ApiProperty({
    description: 'the users',
    isArray: true,
  })
  @IsArray()
  users: string[];

  @ApiProperty({ description: 'the message to send for notification' })
  @IsString()
  message: string;

  @ApiProperty({ description: 'the bonus asset count to send to per user' })
  @IsNumber()
  count: number;
}
