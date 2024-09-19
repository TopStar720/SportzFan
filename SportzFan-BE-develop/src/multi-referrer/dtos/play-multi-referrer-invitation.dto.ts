import { ApiProperty } from '@nestjs/swagger';

import { CommonDto } from '../../common/dtos/common.dto';
import { IsEmail, IsBoolean } from 'class-validator';

export class PlayMultiReferrerInvitationDto extends CommonDto {
  @ApiProperty({ description: 'the invited email' })
  @IsEmail()
  invitedEmail: string;

  @ApiProperty({ description: 'check if user is signed up or not' })
  @IsBoolean()
  isSignedUp: boolean;
}

export class PlayMultiReferrerInvitationRegisterDto {
  @ApiProperty({ description: 'the invited email' })
  @IsEmail()
  invitedEmail: string;

  @ApiProperty({ description: 'check if user is signed up or not' })
  @IsBoolean()
  isSignedUp: boolean;
}
