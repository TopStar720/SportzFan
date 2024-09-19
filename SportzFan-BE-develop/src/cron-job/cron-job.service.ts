import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { TriviaService } from '../trivia/trivia.service';
import { PollService } from '../poll/poll.service';
import { GameService } from '../game/game.service';
import { SocketService } from '../socket/socket.service';
import { ChallengeService } from '../challenge/challenge.service';
import { MilestoneService } from '../milestone/milestone.service';
import { MiniGameService } from 'src/mini-game/mini-game.service';
import {
  NotificationCategoryType,
  NotificationType,
} from '../notification/dtos/notification.dto';
import { PredictionService } from '../prediction/prediction.service';

@Injectable()
export class CronJobService {
  constructor(
    private readonly predictionService: PredictionService,
    private readonly triviaService: TriviaService,
    private readonly milestoneService: MilestoneService,
    private readonly pollService: PollService,
    private readonly gameService: GameService,
    private readonly challengeService: ChallengeService,
    private readonly socketService: SocketService,
    private readonly miniGameService: MiniGameService,
  ) {}

  @Cron('0 30 * * * *')
  // @Cron('10 * * * * *') // TODO: for testing shot time cron
  async handleCron() {
    if (process.env.MODE === 'PROD') {
      await this.predictionService.endExpiredPrediction();
      await this.triviaService.endExpiredTrivia();
      await this.pollService.endExpiredPoll();
    }
  }

  @Cron('0 */10 * * * *')
  async handle10Cron() {
    if (process.env.MODE != 'PROD') return;

    await this.miniGameService.refreshLife();
    let res = await this.gameService.getJustAliveGames(10);
    res.forEach((item) => {
      this.socketService.broadCastTeam$.next({
        type: NotificationType.GameAlive,
        teamId: item.team_id,
        category: NotificationCategoryType.Game,
        section: item.type,
        uniqueId: item.id,
        content: item.title,
      });
    });

    res = await this.challengeService.getJustAliveChallenges(10);
    res.forEach((item) => {
      this.socketService.broadCastTeam$.next({
        type: NotificationType.ChallengeAlive,
        teamId: item.team_id,
        category: NotificationCategoryType.Challenge,
        section: item.type,
        uniqueId: item.id,
        content: item.title,
      });
    });

    res = await this.pollService.findJustAlivePolls(10);
    res.forEach((item) => {
      this.socketService.broadCastTeam$.next({
        type: NotificationType.PollAlive,
        teamId: item.team_id,
        category: NotificationCategoryType.Poll,
        section: item.type,
        uniqueId: item.id,
        content: item.title,
      });
    });
  }

  // TODO: test socket system
  // @Cron('* */10 * * * *')
  // async handleTestCron() {
  //   this.socketService.broadCastAll$.next({ type: NotificationType.GameAlive, content: `Game on! *Test game* is now live` });
  // }
}
