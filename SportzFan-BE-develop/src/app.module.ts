import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestContextModule } from 'nestjs-request-context';
import { ConfigModule } from '@nestjs/config';

import { AppService } from './app.service';
import { PlayModule } from './play/play.module';
import { PollModule } from './poll/poll.module';
import { TeamModule } from './team/team.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { GameModule } from './game/game.module';
import { SeedModule } from './seed/seed.module';
import { AppController } from './app.controller';
import { EmailModule } from './email/email.module';
import { MatchModule } from './match/match.module';
import { AssetModule } from './asset/asset.module';
import { TokenModule } from './token/token.module';
import { TriviaModule } from './trivia/trivia.module';
import { SurveyModule } from './survey/survey.module';
import { UploadModule } from './upload/upload.module';
import { SocketModule } from './socket/socket.module';
import { PlayerModule } from './player/player.module';
import { DeviceModule } from './device/device.module';
import { SportsModule } from './sports/sports.module';
import { configService } from './config/config.service';
import { SupportModule } from './support/support.module';
import { PaymentModule } from './payment/payment.module';
import { ContentModule } from './content/content.module';
import { SponsorModule } from './sponsor/sponsor.module';
import { CheckInModule } from './check-in/check-in.module';
import { CronJobModule } from './cron-job/cron-job.module';
import { ReferralModule } from './referral/referral.module';
import { MiniGameModule } from './mini-game/mini-game.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { MilestoneModule } from './milestone/milestone.module';
import { ChallengeModule } from './challenge/challenge.module';
import { PredictionModule } from './prediction/prediction.module';
import { TransactionModule } from './transaction/transaction.module';
import { NotificationModule } from './notification/notification.module';
import { MultiCheckInModule } from './multi-check-in/multi-check-in.module';
import { PlatformUsageModule } from './platform-usage/platform-usage.module';
import { MultiReferrerModule } from './multi-referrer/multi-referrer.module';
import { PushNotificationModule } from './push-notification/push-notification.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    ConfigModule.forRoot(),
    RequestContextModule,
    EmailModule,
    PlayModule,
    ChallengeModule,
    CheckInModule,
    MultiCheckInModule,
    SurveyModule,
    MultiReferrerModule,
    PollModule,
    TeamModule,
    MatchModule,
    UserModule,
    AuthModule,
    PredictionModule,
    GameModule,
    TriviaModule,
    ContentModule,
    SponsorModule,
    AssetModule,
    PaymentModule,
    TokenModule,
    SeedModule,
    UploadModule,
    TransactionModule,
    MilestoneModule,
    CronJobModule,
    SupportModule,
    SocketModule,
    NotificationModule,
    ReferralModule,
    PlatformUsageModule,
    PlayerModule,
    MiniGameModule,
    AnalyticsModule,
    PushNotificationModule,
    DeviceModule,
    SportsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
