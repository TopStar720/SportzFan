import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PlatformUsageService } from './platform-usage.service';
import { PlatformUsageController } from './platform-usage.controller';
import { PlatformUsageEntity } from './entities/platform-usage.entity';
import { UserEntity } from '../user/entities/user.entity';
import { SocketModule } from '../socket/socket.module';
import { EmailModule } from '../email/email.module';

@Module({
  controllers: [PlatformUsageController],
  providers: [PlatformUsageService],
  imports: [
    SocketModule,
    EmailModule,
    TypeOrmModule.forFeature([PlatformUsageEntity, UserEntity])
  ],
  exports: [PlatformUsageService]
})
export class PlatformUsageModule {}
