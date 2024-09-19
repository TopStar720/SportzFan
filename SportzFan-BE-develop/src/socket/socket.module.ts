import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { SocketService } from './socket.service';
import { SocketGateway } from './socket.gateway';
import { UserEntity } from '../user/entities/user.entity';
import { NotificationModule } from '../notification/notification.module';
import { PushNotificationModule } from 'src/push-notification/push-notification.module';

@Module({
  imports: [
    NotificationModule,
    PushNotificationModule,
    TypeOrmModule.forFeature([UserEntity]),
  ],
  providers: [SocketService, SocketGateway],
  exports: [SocketService]
})
export class SocketModule {}
