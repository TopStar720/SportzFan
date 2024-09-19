import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MilestoneService } from './milestone.service';
import { MilestoneController } from './milestone.controller';
import { PlayMilestoneEntity } from './entities/play-milestone.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { TeamEntity } from 'src/team/entities/team.entity';
import { MatchEntity } from 'src/match/entities/match.entity';
import { SponsorEntity } from 'src/sponsor/entities/sponsor.entity';
import { UserModule } from 'src/user/user.module';
import { TransactionModule } from 'src/transaction/transaction.module';
import { AssetEntity } from '../asset/entities/asset.entity';
import { MilestoneEntity } from './entities/milestone.entity';
import { SocketModule } from '../socket/socket.module';
import { PlayCheckInEntity } from '../check-in/entities/play-check-in.entity';
import { CheckInEntity } from '../check-in/entities/check-in.entity';
import { AssetModule } from '../asset/asset.module';

@Module({
  controllers: [MilestoneController],
  providers: [MilestoneService],
  imports: [
    TypeOrmModule.forFeature([
      CheckInEntity,
      PlayMilestoneEntity,
      PlayCheckInEntity,
      UserEntity,
      TeamEntity,
      MatchEntity,
      SponsorEntity,
      AssetEntity,
      MilestoneEntity,
    ]),
    UserModule,
    SocketModule,
    TransactionModule,
    AssetModule,
  ],
  exports: [MilestoneService]
})
export class MilestoneModule {}
