import { Injectable } from '@nestjs/common';
import { Between, DataSource, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { AnalyticsResultDto } from './dtos/analyticsParam.dto';
import { UserEntity } from '../user/entities/user.entity';
import { ReferralEntity } from '../referral/entities/referral.entity';
import { SponsorEntity } from '../sponsor/entities/sponsor.entity';
import { AssetRedeemEntity } from '../asset/entities/assetRedeem.entity';
import { PlayCheckInEntity } from '../check-in/entities/play-check-in.entity';
import { PlayTriviaEntity } from '../trivia/entities/play-trivia.entity';
import { PlayPredictionEntity } from 'src/prediction/entities/play-prediction.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(ReferralEntity)
    private referralRepository: Repository<ReferralEntity>,
    @InjectRepository(PlayCheckInEntity)
    private playCheckinRepository: Repository<PlayCheckInEntity>,
    @InjectRepository(SponsorEntity)
    private sponsorRepository: Repository<SponsorEntity>,
    @InjectRepository(AssetRedeemEntity)
    private assetRedeemRepository: Repository<AssetRedeemEntity>,
    @InjectRepository(PlayTriviaEntity)
    private playTriviaRepository: Repository<PlayTriviaEntity>,
    @InjectRepository(PlayPredictionEntity)
    private playPredictionRepository: Repository<PlayPredictionEntity>,
  ) {}
  async analyzeTeams(
    teamIDs: Array<string>,
    start: Date,
    end: Date,
  ): Promise<AnalyticsResultDto> {
    const usersRegistered = await this.userRepository.count({
      where: {
        ...(teamIDs && { teamId: In(teamIDs) }),
      },
    });

    const newUsers = await this.userRepository.count({
      where: {
        createdAt: Between(
          new Date(start).toISOString(),
          new Date(end).toISOString(),
        ),
        ...(teamIDs && { teamId: In(teamIDs) }),
      },
    });

    const referrals = await this.referralRepository.count({
      relations: ['sender'],
      where: {
        passedSignUp: true,
        createdAt: Between(
          new Date(start).toISOString(),
          new Date(end).toISOString(),
        ),
        sender: {
          ...(teamIDs && { teamId: In(teamIDs) }),
        },
      },
    });

    const gamesPlayedResult = await this.dataSource
      .query(`SELECT COUNT( "game_played".game_id ) AS cnt 
          FROM
            (
              SELECT "play_trivia"."id" AS game_id, 'trivia' AS game_type 
              FROM "trivia" JOIN play_trivia ON trivia.ID = play_trivia.trivia_id 
              WHERE "play_trivia"."createdAt" >= '${start}' 
                AND "play_trivia"."createdAt" <= '${end}' 
                ${
                  teamIDs
                    ? `AND "trivia"."team_id" IN ( '${teamIDs.join("','")}' )`
                    : ''
                } 
                AND "trivia"."deletedAt" is null
                And "trivia"."is_draft" is false
                AND "play_trivia"."deletedAt" is null
              
              UNION
              
              SELECT  "play_prediction"."id" AS game_id, 'prediction' AS game_type 
              FROM "prediction" JOIN play_prediction ON prediction.ID = play_prediction.prediction_id 
              WHERE "play_prediction"."createdAt" >= '${start}' 
                AND "play_prediction"."createdAt" <= '${end}' 
                ${
                  teamIDs
                    ? `AND "prediction"."team_id" IN ( '${teamIDs.join(
                        "','",
                      )}' )`
                    : ''
                } 
                AND "prediction"."deletedAt" is null
                AND "prediction"."is_draft" is false
                AND "play_prediction"."deletedAt" is null
              
              UNION

              SELECT  "play_mini_game"."id" AS game_id, 'mini_game' AS game_type 
              FROM "mini_game" JOIN play_mini_game ON mini_game.ID = play_mini_game.mini_game_id 
              WHERE "play_mini_game"."createdAt" >= '${start}' 
                AND "play_mini_game"."createdAt" <= '${end}' 
                ${
                  teamIDs
                    ? `AND "mini_game"."team_id" IN ( '${teamIDs.join(
                        "','",
                      )}' )`
                    : ''
                } 
                AND "mini_game"."deletedAt" is null
                AND "play_mini_game"."is_highest" is null
                AND "mini_game"."is_draft" is false
                AND "play_mini_game"."deletedAt" is null
              
              UNION
              
              SELECT "play_milestone"."id" AS game_id, 'milestone' AS game_type 
              FROM "milestone" JOIN play_milestone ON milestone.ID = play_milestone.milestone_id 
              WHERE "play_milestone"."createdAt" >= '${start}' 
                AND "play_milestone"."createdAt" <= '${end}' 
                ${
                  teamIDs
                    ? `AND "milestone"."team_id" IN ( '${teamIDs.join(
                        "','",
                      )}' )`
                    : ''
                }
                AND "milestone"."deletedAt" is null
                AND "play_milestone"."deletedAt" is null
            ) game_played`);
    const gamesPlayed = gamesPlayedResult
      ? parseInt(gamesPlayedResult[0].cnt)
      : 0;

    const checkins = await this.playCheckinRepository.count({
      relations: ['checkIn'],
      where: {
        deletedAt: null,
        createdAt: Between(
          new Date(start).toISOString(),
          new Date(end).toISOString(),
        ),
        checkIn: {
          deletedAt: null,
          isDraft: false,
          ...(teamIDs && { teamId: In(teamIDs) }),
        },
      },
    });

    const sponsors = await this.sponsorRepository.count({
      where: {
        deletedAt: null,
        createdAt: Between(
          new Date(start).toISOString(),
          new Date(end).toISOString(),
        ),
        ...(teamIDs && { teamId: In(teamIDs) }),
      },
    });
    const assetsRedeemed = await this.assetRedeemRepository.count({
      relations: ['asset'],
      where: {
        deletedAt: null,
        createdAt: Between(
          new Date(start).toISOString(),
          new Date(end).toISOString(),
        ),
        asset: {
          deletedAt: null,
          isDraft: false,
          isBonus: false,
          ...(teamIDs && { teamId: In(teamIDs) }),
        },
      },
    });

    const assetsClaimedResult = await this.dataSource
      .query(`SELECT COUNT("asset_claimed"."asset_id") AS cnt
            from
            (
                SELECT * 
                FROM asset_redeem ar 
                LEFT JOIN asset a 
                ON a.id  = ar.asset_id 
                WHERE
                    a."deletedAt" is null 
                    AND is_draft is false 
                    AND ar."deletedAt" is null
                    AND TO_DATE(ar."claimDate", 'EEE Mon dd yyyy') >='${start}' 
                    and TO_DATE(ar."claimDate", 'EEE Mon dd yyyy') <='${end}'
                    ${
                      teamIDs
                        ? `AND a."team_id" IN ( '${teamIDs.join("','")}' )`
                        : ''
                    } 
            ) asset_claimed `);
    const assetsClaimed = assetsClaimedResult
      ? parseInt(assetsClaimedResult[0].cnt)
      : 0;

    const triviaGames = await this.playTriviaRepository.count({
      relations: ['trivia'],
      where: {
        deletedAt: null,
        createdAt: Between(
          new Date(start).toISOString(),
          new Date(end).toISOString(),
        ),
        trivia: {
          isEnded: true,
          isDraft: false,
          deletedAt: null,
          ...(teamIDs && { teamId: In(teamIDs) }),
        },
      },
    });
    const predictorGames = await this.playPredictionRepository.count({
      relations: ['prediction'],
      where: {
        createdAt: Between(
          new Date(start).toISOString(),
          new Date(end).toISOString(),
        ),
        deletedAt: null,
        prediction: {
          isDraft: false,
          isEnded: true,
          deletedAt: null,
          ...(teamIDs && { teamId: In(teamIDs) }),
        },
      },
    });
    const challengesCompletedResult = await this.dataSource
      .query(`SELECT COUNT( "challenge_played".challenge_id ) AS cnt 
            from
            (
              SELECT
                "play_multi_check_in"."id" AS challenge_id,
                'multi-check-in' AS challenge_type 
              FROM
                "multi-check-in"
                JOIN "play_multi_check_in" ON "multi-check-in"."id" = "play_multi_check_in"."multi_checkin_id"
              WHERE
                "play_multi_check_in"."createdAt" >= '${start}'  
                AND "play_multi_check_in"."createdAt" <= '${end}' 
                ${
                  teamIDs
                    ? `AND "multi-check-in"."team_id" IN ( '${teamIDs.join(
                        "','",
                      )}' )`
                    : ''
                } 
                and "multi-check-in"."deletedAt" is null
                and "play_multi_check_in"."deletedAt" is null

              union
              SELECT
                "play_check_in"."id" AS challenge_id,
                'check_in' AS challenge_type 
              FROM
                "check_in"
                JOIN "play_check_in" ON "check_in"."id" = "play_check_in"."checkin_id"
              WHERE
                "play_check_in"."createdAt" >= '${start}'  
                AND "play_check_in"."createdAt" <= '${end}' 
                ${
                  teamIDs
                    ? `AND "check_in"."team_id" IN ( '${teamIDs.join("','")}' )`
                    : ''
                } 
                and "check_in"."deletedAt" is null
                and "play_check_in"."deletedAt" is null
            
              union
            
              SELECT
                "play_survey"."id" AS challenge_id,
                'survey' AS challenge_type 
              FROM
                "survey"
                JOIN "play_survey" ON "survey"."id" = "play_survey"."survey_id"
              WHERE
                "play_survey"."createdAt" >= '${start}'  
                AND "play_survey"."createdAt" <= '${end}' 
                ${
                  teamIDs
                    ? `AND "survey"."team_id" IN ( '${teamIDs.join("','")}' )`
                    : ''
                } 
                and "survey"."deletedAt" is null
                and "play_survey"."deletedAt" is null
            
              union
            
              SELECT
                "play_multi_referrer"."id" AS challenge_id,
                'multi_referrer' AS challenge_type 
              FROM
                "multi-referrer"
                JOIN "play_multi_referrer" ON "multi-referrer"."id" = "play_multi_referrer"."multi_referrer_id"
              WHERE
                "play_multi_referrer"."createdAt" >= '${start}'  
                AND "play_multi_referrer"."createdAt" <= '${end}' 
                ${
                  teamIDs
                    ? `AND "multi-referrer"."team_id" IN ( '${teamIDs.join(
                        "','",
                      )}' )`
                    : ''
                } 
                and "multi-referrer"."deletedAt" is null
                and "play_multi_referrer"."deletedAt" is null
            ) as challenge_played`);
    const challengesCompleted = challengesCompletedResult
      ? parseInt(challengesCompletedResult[0].cnt)
      : 0;

    const pollsCompletedResult = await this.dataSource.query(`
            SELECT COUNT( "poll_played".poll_id ) AS cnt 
            FROM (
              SELECT "poll"."id" as poll_id
              FROM
                "poll"
                JOIN "poll_participate" ON "poll"."id" = "poll_participate"."poll_id"
              WHERE
                "poll_participate"."createdAt" >= '${start}'  
                AND "poll_participate"."createdAt" <= '${end}'
                ${
                  teamIDs
                    ? `AND "poll"."team_id" IN ( '${teamIDs.join("','")}' )`
                    : ''
                } 
                and "poll"."deletedAt" is null
                and "poll_participate"."deletedAt" is null
              ) poll_played`);
    const pollsCompleted = pollsCompletedResult
      ? parseInt(pollsCompletedResult[0].cnt)
      : 0;

    return {
      usersRegistered,
      newUsers,
      referrals,
      gamesPlayed,
      challengesCompleted,
      pollsCompleted,
      checkins,
      triviaGames,
      predictorGames,
      assetsRedeemed,
      assetsClaimed,
      sponsors,
    };
  }
}
