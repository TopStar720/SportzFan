import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

import { CommonDto } from '../../common/dtos/common.dto';
import {
  PlayMultiReferrerInvitationDto,
  PlayMultiReferrerInvitationRegisterDto,
} from './play-multi-referrer-invitation.dto';
import { UserDto } from 'src/user/dto/user.dto';
import { MultiReferrerDto } from './multi-referrer.dto';

export class PlayMultiReferrerDto extends CommonDto {
  @ApiProperty({ description: 'the multi referrer id' })
  multiReferrer: MultiReferrerDto;

  @ApiProperty({ description: 'the user id' })
  user: UserDto;

  @ApiProperty({
    description: 'the personal code to share referral',
  })
  @IsString()
  personalCode: string;

  @ApiProperty({
    description: 'the list of invited emails',
    type: () => PlayMultiReferrerInvitationDto,
    isArray: true,
  })
  invitation: PlayMultiReferrerInvitationDto[];
}

export class PlayMultiReferrerRegisterDto {
  @ApiProperty({ description: 'the multi referrer id' })
  @IsUUID()
  multiReferrerId: string;

  @ApiProperty({
    description: 'the personal code to share referral',
  })
  @IsString()
  personalCode: string;

  @ApiProperty({
    description: 'the list of invited emails',
    type: () => PlayMultiReferrerInvitationRegisterDto,
    isArray: false,
  })
  invitation: PlayMultiReferrerInvitationRegisterDto;
}
