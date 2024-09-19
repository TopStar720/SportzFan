import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { TeamModule } from '../team/team.module';
import { AuthController } from './auth.controller';
import { EmailModule } from '../email/email.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { SocketModule } from '../socket/socket.module';
import { ReferralModule } from '../referral/referral.module';
import { TransactionModule } from '../transaction/transaction.module';
import { PlatformUsageModule } from '../platform-usage/platform-usage.module';

@Module({
  imports: [
    UserModule,
    PassportModule,
    EmailModule,
    TeamModule,
    SocketModule,
    ReferralModule,
    TransactionModule,
    PlatformUsageModule,
    JwtModule.register({
      secret: process.env.JWT_SECRECT,
      signOptions: { expiresIn: '30d' },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
