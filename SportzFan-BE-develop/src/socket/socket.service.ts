import { Subject } from 'rxjs';
import { Injectable } from '@nestjs/common';

import {
  BroadCastMessageDto,
  BroadCastTeamMessageDto,
  MessageDto,
} from '../notification/dtos/notification.dto';

@Injectable()
export class SocketService {
  onlineUsers: string[] = [];
  message$: Subject<MessageDto> = new Subject<MessageDto>();
  bulkMessage$: Subject<MessageDto[]> = new Subject<MessageDto[]>();
  broadCastOnline$: Subject<BroadCastMessageDto> =
    new Subject<BroadCastMessageDto>();
  broadCastAll$: Subject<BroadCastMessageDto> =
    new Subject<BroadCastMessageDto>();
  broadCastTeam$: Subject<BroadCastTeamMessageDto> =
    new Subject<BroadCastTeamMessageDto>();
}
