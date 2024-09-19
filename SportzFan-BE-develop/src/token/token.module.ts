import { Module } from '@nestjs/common';

import { TokenService } from './token.service';
import { TokenController } from './token.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenEntity } from './entities/token.entity';
import { TeamEntity } from 'src/team/entities/team.entity';

@Module({
  controllers: [TokenController],
  providers: [TokenService],
  imports: [TypeOrmModule.forFeature([TokenEntity, TeamEntity])],
  exports: [TokenService],
})
export class TokenModule {}
