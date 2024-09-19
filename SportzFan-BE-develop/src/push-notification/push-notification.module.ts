import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FireBase } from './core/firebase';
import { TeamEntity } from '../team/entities/team.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { PushNotificationService } from './push-notification.service';
import { PushNotificationController } from './push-notification.controller';
import { PushNotificationHistoryEntity } from './entities/push-notification-history.entity';

@Module({
  providers: [PushNotificationService, FireBase],
  imports: [
    TypeOrmModule.forFeature([
      PushNotificationHistoryEntity,
      TeamEntity,
      UserEntity,
    ]),
  ],
  controllers: [PushNotificationController],
  exports: [PushNotificationService],
})
export class PushNotificationModule {}
