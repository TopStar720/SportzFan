import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SponsorService } from './sponsor.service';
import { SponsorController } from './sponsor.controller';
import { SponsorEntity } from './entities/sponsor.entity';
import { PollEntity } from '../poll/entities/poll.entity';
import { TeamEntity } from 'src/team/entities/team.entity';
import { SurveyEntity } from '../survey/entities/survey.entity';
import { TriviaEntity } from '../trivia/entities/trivia.entity';
import { CheckInEntity } from '../check-in/entities/check-in.entity';
import { MilestoneEntity } from '../milestone/entities/milestone.entity';
import { PredictionEntity } from '../prediction/entities/prediction.entity';
import { MultiReferrerEntity } from '../multi-referrer/entities/multi-referrer.entity';
import { MultiCheckInEntity } from '../multi-check-in/entities/multi-check-in.entity';

@Module({
  controllers: [SponsorController],
  providers: [SponsorService],
  imports: [
    TypeOrmModule.forFeature([
      SponsorEntity,
      TeamEntity,
      PredictionEntity,
      TriviaEntity,
      MilestoneEntity,
      CheckInEntity,
      MultiCheckInEntity,
      SurveyEntity,
      MultiReferrerEntity,
      PollEntity,
    ])
  ],
})
export class SponsorModule {}
