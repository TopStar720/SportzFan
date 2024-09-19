import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MiniGameService } from './mini-game.service';
import { UserModule } from 'src/user/user.module';
import { AssetModule } from '../asset/asset.module';
import { SocketModule } from '../socket/socket.module';
import { MiniGameController } from './mini-game.controller';
import { MiniGameEntity } from './entities/mini-game.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { TeamEntity } from 'src/team/entities/team.entity';
import { AssetEntity } from '../asset/entities/asset.entity';
import { MatchEntity } from 'src/match/entities/match.entity';
import { MiniGamePlayerStatusEntity } from './entities/mini-game-player-status';
import { PlayMiniGameEntity } from './entities/play-mini-game.entity';
import { SponsorEntity } from 'src/sponsor/entities/sponsor.entity';
import { TransactionModule } from 'src/transaction/transaction.module';
import { TransactionEntity } from 'src/transaction/entities/transaction.entity';
import { MiniGameRewardDistributionEntity } from './entities/mini-game-reward-distribution.entity';
import { MiniGameRewardActionEntity } from './entities/mini-game-reward-action.entity';
import { MiniGameRewardActionQuestionEntity } from './entities/mini-game-reward-action-question.entity';
import { MiniGameRewardActionOptionEntity } from './entities/mini-game-reward-action-option.entity';
import { MiniGameRewardActionRewardItemEntity } from './entities/mini-game-reward-action-reward-item.entity';
import { MiniGameRewardMarketplaceItemEntity } from './entities/mini-game-reward-marketplace-item.entity';
import { PlayMiniGameSurveyAnswerEntity } from './entities/play-mini-game-survey-answer.entity';
import { DeviceModule } from 'src/device/device.module';
import { PushNotificationModule } from 'src/push-notification/push-notification.module';

@Module({
  controllers: [MiniGameController],
  providers: [MiniGameService],
  imports: [
    TypeOrmModule.forFeature([
      AssetEntity,
      PlayMiniGameEntity,
      UserEntity,
      TeamEntity,
      SponsorEntity,
      MatchEntity,
      TransactionEntity,
      MiniGameEntity,
      MiniGamePlayerStatusEntity,
      MiniGameRewardDistributionEntity,
      MiniGameRewardActionEntity,
      MiniGameRewardActionQuestionEntity,
      MiniGameRewardActionOptionEntity,
      MiniGameRewardActionRewardItemEntity,
      MiniGameRewardMarketplaceItemEntity,
      PlayMiniGameSurveyAnswerEntity,
    ]),
    TransactionModule,
    UserModule,
    SocketModule,
    AssetModule,
    DeviceModule,
    PushNotificationModule,
  ],
  exports: [MiniGameService],
})
export class MiniGameModule {}
