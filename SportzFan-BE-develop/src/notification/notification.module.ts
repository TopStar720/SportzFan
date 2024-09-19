import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from '../user/entities/user.entity';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { NotificationEntity } from './entities/notification.entity';

@Module({
  controllers: [NotificationController],
  providers: [NotificationService],
  imports: [TypeOrmModule.forFeature([NotificationEntity, UserEntity])],
  exports: [NotificationService],
})
export class NotificationModule {}
