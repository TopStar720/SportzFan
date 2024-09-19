import { ApiProperty } from '@nestjs/swagger';
import { TokenDto } from 'src/token/dtos/token.dto';
import { UserDto } from 'src/user/dto/user.dto';

import { CommonDto } from '../../common/dtos/common.dto';

export class BalanceDto extends CommonDto {
  @ApiProperty()
  user: UserDto;

  @ApiProperty()
  token: TokenDto;

  @ApiProperty()
  amount: number;
}
