import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ChallengeController } from './challenge.controller';
import { ChallengeService } from './challenge.service';
import { CheckInEntity } from '../check-in/entities/check-in.entity';
import { MultiCheckInEntity } from '../multi-check-in/entities/multi-check-in.entity';
import { SurveyEntity } from '../survey/entities/survey.entity';
import { MultiReferrerEntity } from '../multi-referrer/entities/multi-referrer.entity';

@Module({
  controllers: [ChallengeController],
  providers: [ChallengeService],
  imports: [
    TypeOrmModule.forFeature([
      CheckInEntity,
      MultiCheckInEntity,
      SurveyEntity,
      MultiReferrerEntity,
    ]),
  ],
  exports: [ChallengeService]
})
export class ChallengeModule {}
