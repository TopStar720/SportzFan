import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SocketModule } from '../socket/socket.module';
import { UserEntity } from 'src/user/entities/user.entity';
import { TeamEntity } from 'src/team/entities/team.entity';
import { MatchEntity } from 'src/match/entities/match.entity';
import { MultiCheckInService } from './multi-check-in.service';
import { SponsorEntity } from 'src/sponsor/entities/sponsor.entity';
import { MultiCheckInController } from './multi-check-in.controller';
import { MultiCheckInEntity } from './entities/multi-check-in.entity';
import { TransactionModule } from '../transaction/transaction.module';
import { PlayMultiCheckInEntity } from './entities/play-multi-check-in.entity';
import { PlayMultiCheckInItemEntity } from './entities/play-multi-check-in-item.entity';

@Module({
  controllers: [MultiCheckInController],
  providers: [MultiCheckInService],
  imports: [
    TypeOrmModule.forFeature([
      PlayMultiCheckInEntity,
      PlayMultiCheckInItemEntity,
      UserEntity,
      TeamEntity,
      SponsorEntity,
      MatchEntity,
      MultiCheckInEntity,
    ]),
    TransactionModule,
    SocketModule,
  ],
})
export class MultiCheckInModule {}
