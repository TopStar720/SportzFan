import { Module } from '@nestjs/common';

import { SportsService } from './sports.service';
import { SportsController } from './sports.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SportsEntity } from './entities/sports.entity';
import { TeamEntity } from 'src/team/entities/team.entity';

@Module({
  controllers: [SportsController],
  providers: [SportsService],
  imports: [TypeOrmModule.forFeature([SportsEntity, TeamEntity])],
  exports: [SportsService],
})
export class SportsModule {}
