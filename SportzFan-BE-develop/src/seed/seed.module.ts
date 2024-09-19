import { Module } from '@nestjs/common';
import { TeamModule } from 'src/team/team.module';
import { TokenModule } from 'src/token/token.module';
import { UserModule } from 'src/user/user.module';
import { SeedService } from './seed.service';
import { SportsModule } from 'src/sports/sports.module';

@Module({
  providers: [SeedService],
  imports: [UserModule, TeamModule, TokenModule, SportsModule],
  exports: [SeedService],
})
export class SeedModule {}
