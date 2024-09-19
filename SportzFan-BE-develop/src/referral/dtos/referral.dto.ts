import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID, } from 'class-validator';

import { ReferralEntity } from '../entities/referral.entity';
import { CommonDto } from '../../common/dtos/common.dto';
import { UserDto } from '../../user/dto/user.dto';

export class ReferralDto extends CommonDto {
  @ApiProperty({ description: 'the sender' })
  sender: UserDto;

  @ApiProperty({ description: 'the receiver' })
  receiver: UserDto;

  @ApiProperty({ description: 'the flag of sign up' })
  passedSignUp: boolean;

  @ApiProperty({ description: 'the flag of play' })
  passedPlay: boolean;

  static toReferralDto(obj: ReferralEntity): ReferralDto {
    return {
      id: obj.id,
      createdAt: obj.createdAt,
      updatedAt: obj.updatedAt,
      sender: obj.sender,
      receiver: obj.receiver,
      passedSignUp: obj.passedSignUp,
      passedPlay: obj.passedPlay,
    };
  }
}

export class ReferralRegisterDto {
  @ApiProperty({ description: 'the sender id' })
  @IsUUID()
  senderId: string;

  @ApiProperty({ description: 'the receiver id' })
  @IsUUID()
  receiverId: string;

  @ApiProperty()
  @IsOptional()
  passedSignUp?: boolean;

  @ApiProperty()
  @IsOptional()
  passedPlay?: boolean;
}