import { ApiProperty } from '@nestjs/swagger';

export class PollDeleteDto {
  @ApiProperty({ description: "the poll id" })
  id: string;
}
