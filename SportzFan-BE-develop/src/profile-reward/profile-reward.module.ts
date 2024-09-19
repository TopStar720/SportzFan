import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from '../user/entities/user.entity';
import { TeamEntity } from 'src/team/entities/team.entity';
import { ProfileRewardService } from './profile-reward.service';
import { ProfileRewardController } from './profile-reward.controller';
import { ProfileRewardEntity } from './entities/profile-reward.entity';
import { ProfileRewardStatusEntity } from './entities/profile-reward-status.entity';
import { TransactionModule } from '../transaction/transaction.module';
import { SocketModule } from '../socket/socket.module';

@Module({
  controllers: [ProfileRewardController],
  providers: [ProfileRewardService],
  imports: [
    TransactionModule,
    SocketModule,
    TypeOrmModule.forFeature([ProfileRewardEntity, ProfileRewardStatusEntity, TeamEntity, UserEntity])
  ],
  exports: [ProfileRewardService],
})
export class ProfileRewardModule {}
