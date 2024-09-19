import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MatchService } from './match.service';
import { GameModule } from '../game/game.module';
import { PollModule } from '../poll/poll.module';
import { MatchController } from './match.controller';
import { MatchEntity } from './entities/match.entity';
import { TeamEntity } from 'src/team/entities/team.entity';
import { ChallengeModule } from '../challenge/challenge.module';

@Module({
  controllers: [MatchController],
  providers: [MatchService],
  imports: [
    GameModule,
    ChallengeModule,
    PollModule,
    TypeOrmModule.forFeature([MatchEntity, TeamEntity])
  ],
})
export class MatchModule {}
