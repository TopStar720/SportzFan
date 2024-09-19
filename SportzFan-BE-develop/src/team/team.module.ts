import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { TeamEntity } from './entities/team.entity';
import { UserEntity } from '../user/entities/user.entity';
import { AssetEntity } from '../asset/entities/asset.entity';
import { ProfileRewardModule } from '../profile-reward/profile-reward.module';
import { TokenEntity } from '../token/entities/token.entity';
import { TokenModule } from '../token/token.module';
import { EmailModule } from '../email/email.module';

@Module({
  controllers: [TeamController],
  providers: [TeamService],
  imports: [
    ProfileRewardModule,
    TypeOrmModule.forFeature([
      TeamEntity,
      UserEntity,
      AssetEntity,
      TokenEntity,
    ]),
    TokenModule,
    EmailModule,
  ],
  exports: [TeamService],
})
export class TeamModule {}
