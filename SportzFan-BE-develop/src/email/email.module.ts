import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SesModule } from '@nextnm/nestjs-ses';
import * as dotenv from 'dotenv';

import { EmailService } from './email.service';
import { TeamEntity } from 'src/team/entities/team.entity';

@Module({
  imports: [
    SesModule.forRoot({
      SECRET: process.env.AWS_SECRET || dotenv.config().parsed.AWS_SECRET,
      AKI_KEY: process.env.AWS_AKI_KEY || dotenv.config().parsed.AWS_AKI_KEY,
      REGION:
        process.env.AWS_REGION ||
        dotenv.config().parsed.AWS_REGION ||
        'ap-southeast-2',
    }),
    TypeOrmModule.forFeature([TeamEntity]),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
