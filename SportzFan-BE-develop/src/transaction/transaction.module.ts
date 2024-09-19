import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from '../user/entities/user.entity';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TransactionEntity } from './entities/transaction.entity';
import { TokenEntity } from '../token/entities/token.entity';
import { SocketModule } from '../socket/socket.module';
import { ReferralModule } from '../referral/referral.module';
import { PlayMilestoneEntity } from 'src/milestone/entities/play-milestone.entity';
import { TeamEntity } from 'src/team/entities/team.entity';

@Module({
  controllers: [TransactionController],
  providers: [TransactionService],
  imports: [
    SocketModule,
    ReferralModule,
    TypeOrmModule.forFeature([
      TransactionEntity,
      UserEntity,
      TokenEntity,
      PlayMilestoneEntity,
      TeamEntity,
    ]),
  ],
  exports: [TransactionService],
})
export class TransactionModule {}
