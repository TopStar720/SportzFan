import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DeviceService } from './device.service';
import { DeviceController } from './device.controller';
import { UserEntity } from '../user/entities/user.entity';
import { DeviceEntity } from './entities/device.entity';
import { PushNotificationModule } from '../push-notification/push-notification.module';
import { TeamEntity } from 'src/team/entities/team.entity';

@Module({
  providers: [DeviceService],
  imports: [
    TypeOrmModule.forFeature([DeviceEntity, UserEntity, TeamEntity]),
    PushNotificationModule,
  ],
  controllers: [DeviceController],
  exports: [DeviceService],
})
export class DeviceModule {}
