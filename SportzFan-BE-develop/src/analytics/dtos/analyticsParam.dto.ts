import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class AnalyticsQueryParamDto {
  @ApiProperty({
    description: 'team IDs that looking to analyze',
    required: false,
  })
  @IsString()
  @IsOptional()
  teamIDs?: string;

  @ApiProperty({ description: 'Start Date', required: true })
  @IsDateString()
  start: Date;

  @ApiProperty({ description: 'End Date', required: true })
  @IsDateString()
  end: Date;
}

export class TeamAnalyticsQueryParamDto {
  @ApiProperty({ description: 'Start Date', required: true })
  @IsDateString()
  start: Date;

  @ApiProperty({ description: 'End Date', required: true })
  @IsDateString()
  end: Date;
}

export class AnalyticsResultDto {
  @ApiProperty({ description: 'team IDs that looking to analyze' })
  usersRegistered: number;

  @ApiProperty({ description: 'team IDs that looking to analyze' })
  newUsers: number;

  @ApiProperty({ description: 'team IDs that looking to analyze' })
  referrals: number;

  @ApiProperty({ description: 'team IDs that looking to analyze' })
  gamesPlayed: number;

  @ApiProperty({ description: 'team IDs that looking to analyze' })
  challengesCompleted: number;

  @ApiProperty({ description: 'team IDs that looking to analyze' })
  pollsCompleted: number;

  @ApiProperty({ description: 'team IDs that looking to analyze' })
  checkins: number;

  @ApiProperty({ description: 'team IDs that looking to analyze' })
  triviaGames: number;

  @ApiProperty({ description: 'team IDs that looking to analyze' })
  predictorGames: number;

  @ApiProperty({ description: 'team IDs that looking to analyze' })
  assetsRedeemed: number;

  @ApiProperty({ description: 'team IDs that looking to analyze' })
  assetsClaimed: number;

  @ApiProperty({ description: 'team IDs that looking to analyze' })
  sponsors: number;
}
