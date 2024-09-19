import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class PollOptionRegisterDto {
  @ApiProperty({ description: 'the option details includes the text or image/audio file path' })
  @IsString()
  details: string;

  @ApiProperty({ description: 'the order' })
  @IsNumber()
  order: number;
}