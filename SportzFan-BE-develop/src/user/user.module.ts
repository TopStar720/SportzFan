import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserEntity } from './entities/user.entity';
import { EmailModule } from '../email/email.module';
import { TeamModule } from '../team/team.module';
import { TeamEntity } from '../team/entities/team.entity';
import { TokenEntity } from '../token/entities/token.entity';
import { TransactionModule } from '../transaction/transaction.module';
import { ProfileRewardModule } from '../profile-reward/profile-reward.module';
import { SocketModule } from '../socket/socket.module';
import { TransactionEntity } from '../transaction/entities/transaction.entity';
import { PlayPredictionEntity } from '../prediction/entities/play-prediction.entity';
import { PlayTriviaEntity } from '../trivia/entities/play-trivia.entity';
import { PlayMilestoneEntity } from '../milestone/entities/play-milestone.entity';
import { PlayCheckInEntity } from '../check-in/entities/play-check-in.entity';
import { PlayMultiCheckInEntity } from '../multi-check-in/entities/play-multi-check-in.entity';
import { PlaySurveyEntity } from '../survey/entities/play-survey.entity';
import { PlayMultiReferrerEntity } from '../multi-referrer/entities/play-multi-referrer.entity';
import { PollParticipantEntity } from '../poll/entities/pollParticipant.entity';
import { AssetRedeemEntity } from '../asset/entities/assetRedeem.entity';

@Module({
  imports: [
    EmailModule,
    TeamModule,
    ProfileRewardModule,
    TransactionModule,
    SocketModule,
    TypeOrmModule.forFeature([
      UserEntity,
      TeamEntity,
      TokenEntity,
      TransactionEntity,
      PlayPredictionEntity,
      PlayTriviaEntity,
      PlayMilestoneEntity,
      PlayCheckInEntity,
      PlayMultiCheckInEntity,
      PlaySurveyEntity,
      PlayMultiReferrerEntity,
      PollParticipantEntity,
      AssetRedeemEntity,
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRECT,
      signOptions: { expiresIn: '30d' },
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
