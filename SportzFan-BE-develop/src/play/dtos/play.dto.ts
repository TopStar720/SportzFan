import { ApiProperty } from '@nestjs/swagger';

import { CommonDto } from '../../common/dtos/common.dto';
import { PlayModel, OrderStatus } from '../../common/models/base';

export class PlayDto extends CommonDto {
  @ApiProperty({ description: 'the play name' })
  name: string;

  @ApiProperty({ description: 'the play model' })
  model: PlayModel;

  @ApiProperty({ description: 'the status' })
  status: OrderStatus;
}
