import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AnalyticsService } from './analytics.service';
import { UserEntity } from '../user/entities/user.entity';
import { AnalyticsController } from './analytics.controller';
import { SponsorEntity } from '../sponsor/entities/sponsor.entity';
import { CheckInEntity } from '../check-in/entities/check-in.entity';
import { ReferralEntity } from '../referral/entities/referral.entity';
import { AssetRedeemEntity } from '../asset/entities/assetRedeem.entity';
import { PlayTriviaEntity } from '../trivia/entities/play-trivia.entity';
import { PlayCheckInEntity } from '../check-in/entities/play-check-in.entity';
import { PlayPredictionEntity } from '../prediction/entities/play-prediction.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      ReferralEntity,
      CheckInEntity,
      SponsorEntity,
      AssetRedeemEntity,
      PlayPredictionEntity,
      PlayTriviaEntity,
      PlayCheckInEntity,
    ]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
