import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';
import { TeamService } from './team/team.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly teamService: TeamService,
  ) {}
  @Get()
  async ping() {
    return 'sportz-fannnn!';
  }

  @Get('team-list')
  async getHello() {
    const teamList = await this.teamService.getAllTeam();
    return teamList.map((item) => {
      return {
        team_unique_id: item.id,
        team_name: item.name,
        team_created_time: item.createdAt,
        is_activate: item.isActivated,
      };
    });
  }
}
