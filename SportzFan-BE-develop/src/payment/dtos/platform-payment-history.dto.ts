import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod } from 'src/common/models/base';

import { CommonDto } from '../../common/dtos/common.dto';

export class PlatformPaymentHistoryDto extends CommonDto {
  @ApiProperty()
  paymentIntentId: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  paidDate: Date;

  @ApiProperty()
  comment: string;

  @ApiProperty()
  paymentMethod: PaymentMethod;
}
