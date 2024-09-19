import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PlayController } from './play.controller';
import { PlayService } from './play.service';
import { PlayEntity } from './entities/play.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PlayEntity])],
  controllers: [PlayController],
  providers: [PlayService]
})
export class PlayModule {}
