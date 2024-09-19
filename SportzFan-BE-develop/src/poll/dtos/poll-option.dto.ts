import { ApiProperty } from '@nestjs/swagger';

import { CommonDto } from '../../common/dtos/common.dto';

export class PollOptionDto extends CommonDto {
  @ApiProperty({ description: 'the option details includes the text or image/audio file path' })
  details: string;

  @ApiProperty({ description: 'the poll id' })
  pollId: string;

  @ApiProperty({ description: 'the order' })
  order: number;
}