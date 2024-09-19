import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

import {
  MiniGameRewardActionOptionDto,
  MiniGameRewardActionOptionRegisterDto,
} from './mini-game-reward-action-option.dto';
import { CommonDto } from '../../common/dtos/common.dto';

export class MiniGameRewardActionQuestionDto extends CommonDto {
  @ApiProperty({ description: 'the mini game reward action question' })
  @IsString()
  question: string;

  @ApiProperty({
    description: 'the mini game reward action question options',
    type: () => MiniGameRewardActionOptionDto,
    isArray: true,
  })
  @IsArray()
  options: MiniGameRewardActionOptionDto[];
}

export class MiniGameRewardActionQuestionRegisterDto {
  @ApiProperty({ description: 'the mini game reward action question' })
  @IsString()
  question: string;

  @ApiProperty({
    description: 'the mini game reward action question options',
    type: () => MiniGameRewardActionOptionRegisterDto,
    isArray: true,
  })
  @IsArray()
  options: MiniGameRewardActionOptionRegisterDto[];
}
