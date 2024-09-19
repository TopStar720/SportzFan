import { ApiProperty } from '@nestjs/swagger';

import { CommonDto } from '../../common/dtos/common.dto';

export class PollParticipantDto extends CommonDto {
  @ApiProperty({ description: "the user id" })
  userId: string;

  @ApiProperty({ description: "the poll id" })
  pollId: string;

  @ApiProperty({ description: "the poll option id" })
  pollOptionId: string;
}
