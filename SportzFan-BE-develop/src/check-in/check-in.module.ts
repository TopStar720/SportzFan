import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CheckInService } from './check-in.service';
import { CheckInController } from './check-in.controller';
import { PlayCheckInEntity } from './entities/play-check-in.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { TeamEntity } from 'src/team/entities/team.entity';
import { MatchEntity } from 'src/match/entities/match.entity';
import { SponsorEntity } from 'src/sponsor/entities/sponsor.entity';
import { CheckInEntity } from './entities/check-in.entity';
import { TransactionModule } from '../transaction/transaction.module';
import { SocketModule } from '../socket/socket.module';
import { MilestoneModule } from 'src/milestone/milestone.module';
import { AssetEntity } from '../asset/entities/asset.entity';
import { AssetModule } from '../asset/asset.module';

@Module({
  controllers: [CheckInController],
  providers: [CheckInService],
  imports: [
    TypeOrmModule.forFeature([
      CheckInEntity,
      PlayCheckInEntity,
      UserEntity,
      TeamEntity,
      MatchEntity,
      SponsorEntity,
      AssetEntity,
    ]),
    TransactionModule,
    SocketModule,
    MilestoneModule,
    AssetModule,
  ],
})
export class CheckInModule {}
