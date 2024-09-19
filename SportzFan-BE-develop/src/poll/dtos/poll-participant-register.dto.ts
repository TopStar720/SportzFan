import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class PollParticipantRegisterDto {
  @ApiProperty({ description: "the poll option id" })
  @IsString()
  pollOptionId: string;
}
