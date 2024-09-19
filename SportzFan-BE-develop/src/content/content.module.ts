import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ContentService } from './content.service';
import { ContentController } from './content.controller';
import { ContentEntity } from './entities/content.entity';
import { TeamEntity } from 'src/team/entities/team.entity';

@Module({
  controllers: [ContentController],
  providers: [ContentService],
  imports: [TypeOrmModule.forFeature([ContentEntity, TeamEntity])],
})
export class ContentModule {}
