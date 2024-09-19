import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { PollModule } from '../poll/poll.module';
import { GameModule } from '../game/game.module';
import { CronJobService } from './cron-job.service';
import { SocketModule } from '../socket/socket.module';
import { TriviaModule } from '../trivia/trivia.module';
import { MilestoneModule } from '../milestone/milestone.module';
import { PredictionModule } from '../prediction/prediction.module';
import { ChallengeModule } from '../challenge/challenge.module';
import { MiniGameModule } from '../mini-game/mini-game.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MilestoneModule,
    TriviaModule,
    PredictionModule,
    PollModule,
    GameModule,
    ChallengeModule,
    SocketModule,
    MiniGameModule,
  ],
  providers: [CronJobService],
  exports: [CronJobService],
})
export class CronJobModule {}
