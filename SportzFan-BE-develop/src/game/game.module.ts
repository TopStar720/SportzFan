import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GameService } from './game.service';
import { GameController } from './game.controller';
import { TriviaEntity } from '../trivia/entities/trivia.entity';
import { MilestoneEntity } from '../milestone/entities/milestone.entity';
import { PredictionEntity } from '../prediction/entities/prediction.entity';
import { TeamEntity } from '../team/entities/team.entity';


@Module({
  controllers: [GameController],
  providers: [GameService],
  imports: [
    TypeOrmModule.forFeature([TriviaEntity, PredictionEntity, MilestoneEntity, TeamEntity]),
  ],
  exports: [GameService]
})
export class GameModule {}
