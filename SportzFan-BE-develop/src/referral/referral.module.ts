import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReferralService } from './referral.service';
import { ReferralController } from './referral.controller';
import { ReferralEntity } from './entities/referral.entity';
import { UserEntity } from '../user/entities/user.entity';
import { SocketModule } from '../socket/socket.module';
import { EmailModule } from '../email/email.module';

@Module({
  controllers: [ReferralController],
  providers: [ReferralService],
  imports: [
    SocketModule,
    EmailModule,
    TypeOrmModule.forFeature([ReferralEntity, UserEntity])
  ],
  exports: [ReferralService]
})
export class ReferralModule {}
