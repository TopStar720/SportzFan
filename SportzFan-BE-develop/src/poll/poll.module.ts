import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TransactionModule } from 'src/transaction/transaction.module';
import { UserModule } from 'src/user/user.module';
import { PollController } from './poll.controller';
import { PollService } from './poll.service';
import { PollEntity } from './entities/poll.entity';
import { PollOptionEntity } from './entities/pollOption.entity';
import { PollParticipantEntity } from './entities/pollParticipant.entity';
import { SocketModule } from '../socket/socket.module';
import { AssetEntity } from '../asset/entities/asset.entity';
import { AssetModule } from '../asset/asset.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PollEntity,
      PollOptionEntity,
      PollParticipantEntity,
      AssetEntity,
    ]),
    TransactionModule,
    UserModule,
    SocketModule,
    AssetModule,
  ],
  controllers: [PollController],
  providers: [PollService],
  exports: [PollService],
})
export class PollModule {}
