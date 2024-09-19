import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '../user/user.module';
import { PaymentService } from './payment.service';
import { TokenModule } from '../token/token.module';
import { PaymentController } from './payment.controller';
import { UserEntity } from 'src/user/entities/user.entity';
import { TeamEntity } from 'src/team/entities/team.entity';
import { TokenEntity } from 'src/token/entities/token.entity';
import { PaymentHistoryEntity } from './entities/payment-history.entity';
import { TransactionModule } from '../transaction/transaction.module';
import { SocketModule } from '../socket/socket.module';
import { PlatformPaymentHistoryEntity } from './entities/platform-payment-history.entity';
import { PlatformUserEntity } from './entities/platform-user.entity';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService],
  imports: [
    TypeOrmModule.forFeature([
      PaymentHistoryEntity,
      UserEntity,
      TokenEntity,
      TeamEntity,
      PlatformPaymentHistoryEntity,
      PlatformUserEntity,
    ]),
    UserModule,
    TokenModule,
    TransactionModule,
    SocketModule,
  ],
})
export class PaymentModule {}
