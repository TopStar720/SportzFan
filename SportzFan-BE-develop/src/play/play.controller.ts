import { BadRequestException, Controller, Get, Request } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { PlayService } from './play.service';
import { PlayDto } from './dtos/play.dto';

@ApiTags('Play')
@Controller('api/v0/play')
export class PlayController {
  constructor(private playService: PlayService) {}

  @ApiOperation({ summary: 'Return all play' })
  @ApiOkResponse({ type: PlayDto, isArray: true })
  @Get('')
  async getOrderList(@Request() req): Promise<PlayDto[]> {
    const orderList = (await this.playService.find()) || [];
    return orderList.map((item) => item.toDto());
  }
}
