import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SurveyService } from './survey.service';
import { SurveyController } from './survey.controller';
import { SurveyOptionEntity } from './entities/survey-option.entity';
import { SurveyQuestionEntity } from './entities/survey-question.entity';
import { PlaySurveyEntity } from './entities/play-survey.entity';
import { PlaySurveyAnswerEntity } from './entities/play-survey-answer.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { TeamEntity } from 'src/team/entities/team.entity';
import { SponsorEntity } from 'src/sponsor/entities/sponsor.entity';
import { SurveyEntity } from './entities/survey.entity';
import { TransactionModule } from '../transaction/transaction.module';
import { SocketModule } from '../socket/socket.module';
import { AssetModule } from '../asset/asset.module';
import { AssetEntity } from '../asset/entities/asset.entity';

@Module({
  controllers: [SurveyController],
  providers: [SurveyService],
  imports: [
    TypeOrmModule.forFeature([
      PlaySurveyEntity,
      PlaySurveyAnswerEntity,
      SurveyQuestionEntity,
      SurveyOptionEntity,
      UserEntity,
      TeamEntity,
      SponsorEntity,
      SurveyEntity,
      AssetEntity,
    ]),
    TransactionModule,
    SocketModule,
    AssetModule,
  ],
})
export class SurveyModule {}
