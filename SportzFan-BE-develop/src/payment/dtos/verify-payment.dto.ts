import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class VerifyPaymentDto {
  @ApiProperty()
  @IsUUID()
  logId: string;
}
