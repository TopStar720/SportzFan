import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PredictionService } from './prediction.service';
import { UserEntity } from 'src/user/entities/user.entity';
import { TeamEntity } from 'src/team/entities/team.entity';
import { MatchEntity } from 'src/match/entities/match.entity';
import { PredictionController } from './prediction.controller';
import { PredictionEntity } from './entities/prediction.entity';
import { SponsorEntity } from 'src/sponsor/entities/sponsor.entity';
import { TransactionModule } from 'src/transaction/transaction.module';
import { PlayPredictionEntity } from './entities/play-prediction.entity';
import { PredictionRewardDistributionEntity } from './entities/prediction-reward-distribution.entity';
import { SocketModule } from '../socket/socket.module';
import { DeviceModule } from 'src/device/device.module';
import { PushNotificationModule } from 'src/push-notification/push-notification.module';

@Module({
  controllers: [PredictionController],
  providers: [PredictionService],
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      TeamEntity,
      MatchEntity,
      SponsorEntity,
      PredictionEntity,
      PlayPredictionEntity,
      PredictionRewardDistributionEntity
    ]),
    TransactionModule,
    DeviceModule,
    PushNotificationModule,
    SocketModule,
  ],
  exports: [PredictionService]
})
export class PredictionModule {}
