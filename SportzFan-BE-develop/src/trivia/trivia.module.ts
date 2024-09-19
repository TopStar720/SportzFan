import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TriviaService } from './trivia.service';
import { UserModule } from 'src/user/user.module';
import { AssetModule } from '../asset/asset.module';
import { SocketModule } from '../socket/socket.module';
import { TriviaController } from './trivia.controller';
import { TriviaEntity } from './entities/trivia.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { TeamEntity } from 'src/team/entities/team.entity';
import { AssetEntity } from '../asset/entities/asset.entity';
import { MatchEntity } from 'src/match/entities/match.entity';
import { PlayTriviaEntity } from './entities/play-trivia.entity';
import { SponsorEntity } from 'src/sponsor/entities/sponsor.entity';
import { TriviaOptionEntity } from './entities/trivia-option.entity';
import { TransactionModule } from 'src/transaction/transaction.module';
import { TriviaQuestionEntity } from './entities/trivia-question.entity';
import { PlayTriviaAnswerEntity } from './entities/play-trivia-answer.entity';
import { TransactionEntity } from 'src/transaction/entities/transaction.entity';
import { TriviaRewardDistributionEntity } from './entities/trivia-reward-distribution.entity';
import { DeviceModule } from 'src/device/device.module';
import { PushNotificationModule } from 'src/push-notification/push-notification.module';

@Module({
  controllers: [TriviaController],
  providers: [TriviaService],
  imports: [
    TypeOrmModule.forFeature([
      TriviaOptionEntity,
      TriviaQuestionEntity,
      PlayTriviaEntity,
      PlayTriviaAnswerEntity,
      UserEntity,
      TeamEntity,
      SponsorEntity,
      MatchEntity,
      TransactionEntity,
      TriviaEntity,
      TriviaRewardDistributionEntity,
      AssetEntity,
    ]),
    TransactionModule,
    UserModule,
    AssetModule,
    SocketModule,
    DeviceModule,
    PushNotificationModule,
  ],
  exports: [TriviaService]
})
export class TriviaModule {}
