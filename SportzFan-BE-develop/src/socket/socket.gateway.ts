import { Repository } from 'typeorm';
import { Server, Socket } from 'socket.io';
import { InjectRepository } from '@nestjs/typeorm';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { SocketService } from './socket.service';
import { UserEntity } from '../user/entities/user.entity';
import { NotificationService } from '../notification/notification.service';
import {
  BroadCastMessageDto,
  BroadCastTeamMessageDto,
  MessageDto,
  NotificationType,
} from '../notification/dtos/notification.dto';
import { PushNotificationService } from 'src/push-notification/push-notification.service';

@WebSocketGateway({
  cors: '*',
})
export class SocketGateway {
  @WebSocketServer()
  private server: Server;

  constructor(
    private socketService: SocketService,
    private notificationService: NotificationService,
    private pushNotificationService: PushNotificationService,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {
    this.socketService.broadCastOnline$
      .asObservable()
      .subscribe(async (event) => {
        await this.broadCastOnline(event);
      });

    this.socketService.broadCastAll$.asObservable().subscribe(async (event) => {
      await this.broadCastAll(event);
    });

    this.socketService.broadCastTeam$
      .asObservable()
      .subscribe(async (event) => {
        await this.broadCastTeam(event);
      });

    this.socketService.message$
      .asObservable()
      .subscribe(async (data: MessageDto) => {
        await this.sendMessage(data);
      });

    this.socketService.bulkMessage$
      .asObservable()
      .subscribe(async (data: MessageDto[]) => {
        await this.sendBulkMessage(data);
      });
  }

  @SubscribeMessage('join')
  async join(client: Socket, data: any) {
    client.join(data.userId);
    const index = this.socketService.onlineUsers.indexOf(data.userId);
    if (index == -1) this.socketService.onlineUsers.push(data.userId);
  }

  @SubscribeMessage('disconnect')
  async disconnect(client: Socket, data: any) {
    client.leave(data.userId);
    const index = this.socketService.onlineUsers.indexOf(data.userId);
    this.socketService.onlineUsers.splice(index);
  }

  async sendMessage(dto: MessageDto): Promise<void> {
    await this.notificationService.createNotification(dto);
    this.server.emit('message', dto);
  }

  async sendBulkMessage(dtos: MessageDto[]): Promise<void> {
    await this.notificationService.createBulkNotification(dtos);
    for (const dto of dtos) {
      this.server.emit('message', dto);
    }
  }

  async broadCastOnline(dto: BroadCastMessageDto) {
    for (const userId of this.socketService.onlineUsers) {
      await this.sendMessage({ ...dto, userId });
    }
  }

  async broadCastTeam(dto: BroadCastTeamMessageDto) {
    const userList = await this.userRepository.find({
      where: {
        teamId: dto.teamId,
      },
    });
    for (const user of userList) {
      await this.sendMessage({ ...dto, userId: user.id });
    }

    if (dto.type === NotificationType.GameAlive) {
      this.pushNotificationService.sendTopicNotification("sportzfan", { data: { title: 'New Game Alive', body: dto.content } }, `sportzfan-${dto.teamId}`)
    }
    if (dto.type === NotificationType.ChallengeAlive) {
      this.pushNotificationService.sendTopicNotification("sportzfan", { data: { title: 'New Challenge Alive', body: dto.content } }, `sportzfan-${dto.teamId}`)
    }
    if (dto.type === NotificationType.PollAlive) {
      this.pushNotificationService.sendTopicNotification("sportzfan", { data: { title: 'New Poll Alive', body: dto.content } }, `sportzfan-${dto.teamId}`)
    }
  }

  async broadCastAll(dto: BroadCastMessageDto) {
    const userList = await this.userRepository.find();
    for (const user of userList) {
      await this.sendMessage({ ...dto, userId: user.id });
    }
  }
}
