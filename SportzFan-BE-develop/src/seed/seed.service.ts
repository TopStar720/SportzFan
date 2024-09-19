import { Injectable } from '@nestjs/common';

import { UserService } from '../user/user.service';
import { TeamService } from '../team/team.service';
import { generateSuperAdminAccounts } from '../common/utils/seed/user-seed.util';
import { generateMainTeam } from 'src/common/utils/seed/team-seed.util';
import { generateMainToken } from 'src/common/utils/seed/token-seed.util';
import { TokenService } from 'src/token/token.service';
import { BackgroundTheme } from 'src/team/enums';
import { SportsService } from 'src/sports/sports.service';
import { generateDefaultSports } from 'src/common/utils/seed/sports-seed.util';

@Injectable()
export class SeedService {
  constructor(
    private readonly userService: UserService,
    private readonly teamService: TeamService,
    private readonly tokenService: TokenService,
    private readonly sportsService: SportsService,
  ) {}

  async startDevelopmentSeed() {
    const { sportId } = await this.seedSports();
    const { teamId, tokenId } = await this.seedTeamsAndTokens(sportId);
    await this.seedUsers(teamId, tokenId);
  }

  async startProductionSeed() {
    const { sportId } = await this.seedSports();
    const { teamId, tokenId } = await this.seedTeamsAndTokens(sportId);
    await this.seedUsers(teamId, tokenId);
  }

  async seedUsers(teamId, tokenId) {
    const userCount = await this.userService.count();
    if (userCount !== 0) {
      return;
    }
    const admins = [...generateSuperAdminAccounts(teamId, tokenId)];

    await Promise.all(
      admins.map(async (admin) => {
        await this.userService.addAdmin(admin);
      }),
    );
  }

  async seedSports() {
    const sports = await this.sportsService.getAllSport(0, 999);
    if (sports[1] !== 0) {
      return { sportId: sports[0][0].id };
    }

    let sportId = null;
    generateDefaultSports().map(async (sport) => {
      const sportEntity = await this.sportsService.createSport({ name: sport });
      sportId = sportEntity.id;
    });
    return { sportId };
  }

  async seedTeamsAndTokens(sportId) {
    const teamList = await this.teamService.getAllTeam();
    if (teamList.length !== 0) {
      return { teamId: teamList[0].id, tokenId: teamList[0].tokenId };
    }
    const teamPayload = generateMainTeam(BackgroundTheme.Light);
    if (!!sportId) {
      teamPayload.sportId = sportId;
    }
    const team = await this.teamService.createTeam(teamPayload);
    const token = await this.tokenService.createToken({
      ...generateMainToken(),
      teamId: team.id,
    });
    return { teamId: team.id, tokenId: token.id };
  }
}
