import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ChallengeService } from '../challenge/challenge.service';
import { MultiReferrerService } from './multi-referrer.service';
import { MultiReferrerController } from './multi-referrer.controller';
import { PlayMultiReferrerEntity } from './entities/play-multi-referrer.entity';
import { PlayMultiReferrerInvitationEntity } from './entities/play-multi-referrer-invitation.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { TeamEntity } from 'src/team/entities/team.entity';
import { SponsorEntity } from 'src/sponsor/entities/sponsor.entity';
import { MultiReferrerEntity } from './entities/multi-referrer.entity';
import { TransactionModule } from '../transaction/transaction.module';
import { SocketModule } from '../socket/socket.module';

@Module({
  controllers: [MultiReferrerController],
  providers: [MultiReferrerService],
  imports: [
    TypeOrmModule.forFeature([
      PlayMultiReferrerEntity,
      PlayMultiReferrerInvitationEntity,
      UserEntity,
      TeamEntity,
      SponsorEntity,
      MultiReferrerEntity,
    ]),
    TransactionModule,
    SocketModule,
  ],
})
export class MultiReferrerModule {}
