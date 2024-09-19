import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod } from 'src/common/models/base';
import { UserDto } from 'src/user/dto/user.dto';

import { CommonDto } from '../../common/dtos/common.dto';

export class PaymentHistoryDto extends CommonDto {
  @ApiProperty()
  user: UserDto;

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
