import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import {
  DetailedTeamDto,
  PlatformRegisterDto,
  TeamDto,
  TeamRegisterDto,
  TeamUpdateDto,
} from './dtos/team.dto';
import { UserRole } from '../common/models/base';
import { TeamEntity } from './entities/team.entity';
import { UserEntity } from '../user/entities/user.entity';
import { AssetEntity } from '../asset/entities/asset.entity';
import { getFromDto } from 'src/common/utils/repository.util';
import { SuccessResponse } from 'src/common/models/success-response';
import { ProfileRewardService } from '../profile-reward/profile-reward.service';
import { generateMainTeam } from '../common/utils/seed/team-seed.util';
import { TokenEntity } from '../token/entities/token.entity';
import { EmailService } from '../email/email.service';
import { generateMainToken } from 'src/common/utils/seed/token-seed.util';
import { generateAccount } from 'src/common/utils/seed/user-seed.util';
import { MembershipTier } from './enums';
import { ErrorCode } from 'src/common/models/error-code';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(TeamEntity)
    private teamRepository: Repository<TeamEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(AssetEntity)
    private assetRepository: Repository<AssetEntity>,
    @InjectRepository(TokenEntity)
    private tokenRepository: Repository<TokenEntity>,
    private readonly profileRewardService: ProfileRewardService,
    private readonly emailService: EmailService,
  ) {}

  // Create one team
  async createTeam(dto: TeamRegisterDto): Promise<TeamEntity> {
    const existTeam = await this.teamRepository.findOne({
      where: {
        platformUrl: dto.platformUrl,
      },
    });
    if (!!existTeam) {
      throw new BadRequestException(ErrorCode.DuplicatedPlatformUrl);
    }
    const oldUser = await this.userRepository.findOne({
      where: { role: UserRole.TeamAdmin, email: dto.adminEmail },
    });
    if (oldUser) {
      throw new BadRequestException(ErrorCode.DuplicatedAdminEmail);
    }
    const team = getFromDto<TeamEntity>(dto, new TeamEntity());
    team.isActivated = true;
    team.membershipTier = MembershipTier.Basic;
    team.membershipTierUpdated = new Date();
    let teamEntity = await this.teamRepository.save(team);
    await this.profileRewardService.createProfileReward({
      teamId: teamEntity.id,
    });
    const tokenDto = generateMainToken();
    tokenDto.sponsorSaleFee =
      dto.tokenSaleToSponsors || tokenDto.sponsorSaleFee;
    tokenDto.symbol = dto.tokenSymbol || tokenDto.symbol;
    tokenDto.logo = dto.tokenImage || tokenDto.logo;
    tokenDto.fanSaleFee = dto.tokenSaleToFan || tokenDto.fanSaleFee;
    tokenDto.price = dto.price || tokenDto.price;
    const token = getFromDto<TokenEntity>(tokenDto, new TokenEntity());
    token.team = team;
    const tokenEntity = await this.tokenRepository.save(token);
    const adminDto = generateAccount(
      teamEntity.id,
      tokenEntity.id,
      dto.adminEmail,
      dto.adminFirstName,
      dto.adminLastName,
      UserRole.TeamAdmin,
      true,
    );
    const defaultPassword = adminDto.password;
    adminDto.password = await bcrypt.hash(adminDto.password, 10);
    adminDto['phone'] = dto.adminPhoneNumber;
    adminDto['userName'] = `${dto.adminFirstName} ${dto.adminLastName}`;
    const user = getFromDto<UserEntity>(adminDto, new UserEntity());
    const userEntity = await this.userRepository.save(user);
    teamEntity.tokenId = tokenEntity.id;
    teamEntity.adminId = userEntity.id;
    teamEntity = await this.teamRepository.save(teamEntity);
    await this.profileRewardService.createProfileRewardStatus({
      userId: userEntity.id,
    });
    await this.emailService.sendConfirmRegisterPlatformEmail(
      dto.adminEmail,
      defaultPassword,
      dto.platformName,
      dto.platformUrl,
      dto.appLogoImage,
    );
    return teamEntity;
  }

  // Add new platform
  async addNewPlatform(dto: PlatformRegisterDto): Promise<TeamEntity> {
    const existTeam = await this.teamRepository.findOne({
      where: {
        platformUrl: dto.platformUrl,
      },
    });
    if (!!existTeam) {
      throw new BadRequestException(ErrorCode.DuplicatedPlatformUrl);
    }
    const oldUser = await this.userRepository.findOne({
      where: { role: UserRole.TeamAdmin, email: dto.adminEmail },
    });
    if (oldUser) {
      throw new BadRequestException(ErrorCode.DuplicatedAdminEmail);
    }
    const platformDto = generateMainTeam(dto.themeColor);
    platformDto.name = dto.name;
    platformDto.platformName = 'unnamed';
    platformDto.description = `${dto.name} Team`;
    platformDto.platformUrl = dto.platformUrl;
    platformDto.adminEmail = dto.adminEmail;
    platformDto.appLogoImage = dto.appLogoImage;
    platformDto.sportId = dto.sportId || null;
    const team = getFromDto<TeamEntity>(platformDto, new TeamEntity());
    team.isActivated = true;
    team.membershipTier = dto.membershipTier;
    team.membershipTierUpdated = new Date();
    let teamEntity = await this.teamRepository.save(team);
    await this.profileRewardService.createProfileReward({
      teamId: teamEntity.id,
    });

    const token = getFromDto<TokenEntity>(
      generateMainToken(),
      new TokenEntity(),
    );
    token.team = team;
    const tokenEntity = await this.tokenRepository.save(token);
    teamEntity.tokenId = tokenEntity.id;
    teamEntity = await this.teamRepository.save(teamEntity);

    const adminDto = {
      teamId: teamEntity.id,
      tokenId: tokenEntity.id,
      email: dto.adminEmail,
      password: dto.adminPassword,
      firstName: 'unnamed',
      lastName: 'unnamed',
      role: UserRole.TeamAdmin,
      isVerified: true,
    };
    adminDto.password = await bcrypt.hash(adminDto.password, 10);
    const user = getFromDto<UserEntity>(adminDto, new UserEntity());
    const userEntity = await this.userRepository.save(user);
    await this.profileRewardService.createProfileRewardStatus({
      userId: userEntity.id,
    });
    await this.emailService.sendConfirmRegisterPlatformEmail(
      dto.adminEmail,
      dto.adminPassword,
      dto.name,
      dto.platformUrl,
      dto.appLogoImage,
    );
    return teamEntity;
  }

  //Get all Team list
  async getAllTeam(): Promise<TeamEntity[]> {
    return this.teamRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  //Get all Team list
  async getDetailedTeamList(
    skip: number,
    take: number,
    search: string,
  ): Promise<[DetailedTeamDto[], number]> {
    const detailedTeamList = [];
    const [teamEntityList, count] = await this.teamRepository.findAndCount({
      where: {
        name: Like(`%${search}%`),
      },
      order: {
        createdAt: 'ASC',
      },
      take,
      skip,
    });
    await Promise.all(
      teamEntityList.map(async (entity) => {
        let adminDto = null;
        if (entity.adminId) {
          const adminEntity = await this.userRepository.findOne({
            where: {
              id: entity.adminId,
            },
          });
          adminDto = adminEntity.toUserDto();
        }
        detailedTeamList.push({
          team: entity.toDto(),
          admin: adminDto,
        });
      }),
    );
    return [detailedTeamList, count];
  }

  findOne(id: string): Promise<TeamEntity | undefined> {
    return this.teamRepository.findOneBy({ id });
  }

  // Get one Team by id
  async getOneTeam(id: string): Promise<DetailedTeamDto> {
    const team = await this.teamRepository.findOne({
      relations: {
        token: true,
        sport: true,
      },
      where: {
        id,
      },
    });
    if (!team) {
      throw new BadRequestException(ErrorCode.TeamNotFound);
    }
    const teamDto = team.toDto();
    if (teamDto.weeklyAssetId) {
      teamDto['weeklyAsset'] = await this.assetRepository.findOneBy({
        id: teamDto.weeklyAssetId,
      });
    }
    if (teamDto.earlySignupAssetId) {
      teamDto['earlySignupAsset'] = await this.assetRepository.findOneBy({
        id: teamDto.earlySignupAssetId,
      });
    }
    let adminDto = null;
    if (team.adminId) {
      const adminEntity = await this.userRepository.findOne({
        where: {
          id: team.adminId,
        },
      });
      adminDto = adminEntity.toUserDto();
    }
    return {
      team: teamDto,
      admin: adminDto,
    };
  }

  // Get one Team by id
  async getPlatformInfo(platformUrl: string): Promise<TeamDto> {
    const team = await this.teamRepository.findOne({
      relations: {
        token: true,
        sport: true,
      },
      where: {
        platformUrl: platformUrl,
      },
    });
    if (!team) {
      throw new BadRequestException(ErrorCode.TeamNotFound);
    }
    const teamDto = team.toDto();
    if (teamDto.weeklyAssetId) {
      teamDto['weeklyAsset'] = await this.assetRepository.findOneBy({
        id: teamDto.weeklyAssetId,
      });
    }
    if (teamDto.earlySignupAssetId) {
      teamDto['earlySignupAsset'] = await this.assetRepository.findOneBy({
        id: teamDto.earlySignupAssetId,
      });
    }
    return teamDto;
  }

  // Update Team by id
  async updateTeam(id: string, dto: TeamUpdateDto): Promise<TeamEntity> {
    let team = await this.teamRepository.findOneBy({
      id: id,
    });
    if (!team) {
      throw new BadRequestException(ErrorCode.TeamNotFound);
    }
    team = getFromDto(dto, team);
    team = await this.teamRepository.save(team);
    const token = await this.tokenRepository.findOneBy({
      id: team.tokenId,
    });
    if (!token) {
      throw new BadRequestException(ErrorCode.TeamTokenNotFound);
    }
    token.sponsorSaleFee = dto.tokenSaleToSponsors;
    token.symbol = dto.tokenSymbol;
    token.logo = dto.tokenImage;
    token.fanSaleFee = dto.tokenSaleToFan;
    token.price = dto.price;
    token.team = team;
    await this.tokenRepository.save(token);
    return team;
  }

  // Activate/Inactivate team
  async updateTeamActivation(
    id: string,
    activate: string,
  ): Promise<TeamEntity> {
    const team = await this.teamRepository.findOneBy({
      id: id,
    });
    if (!team) {
      throw new BadRequestException(ErrorCode.TeamNotFound);
    }
    if (activate == 'true') {
      team.isActivated = true;
    } else if (activate == 'false') {
      team.isActivated = false;
    } else {
      throw new BadRequestException(ErrorCode.OnlyBooleanActivation);
    }
    return this.teamRepository.save(team);
  }

  async deleteTeam(id: string): Promise<SuccessResponse> {
    const admin = (
      await this.userRepository.findBy({ role: UserRole.SuperAdmin })
    )[0];
    const team = await this.teamRepository.findOneBy({ id });
    if (!team) {
      return new SuccessResponse(false, ErrorCode.TeamNotFound.message);
    }
    if (team.id === admin.teamId) {
      return new SuccessResponse(false, 'Initial team could not delete');
    } else {
      await this.teamRepository.softDelete({ id });
      return new SuccessResponse(true);
    }
  }

  count(): Promise<number> {
    return this.teamRepository.count();
  }
}
