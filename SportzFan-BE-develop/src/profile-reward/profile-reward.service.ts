import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { getFromDto } from 'src/common/utils/repository.util';
import { TeamEntity } from 'src/team/entities/team.entity';
import { UserEntity } from '../user/entities/user.entity';
import { ProfileRewardEntity } from './entities/profile-reward.entity';
import { ProfileRewardStatusEntity } from './entities/profile-reward-status.entity';
import { ProfileRewardRegisterDto } from './dtos/profile-reward.dto';
import { ProfileRewardStatusRegisterDto } from './dtos/profile-reward-status.dto';
import { TransactionService } from '../transaction/transaction.service';
import {
  ChallengeType,
  TransactionType,
  UserRole,
} from '../common/models/base';
import {
  NotificationCategoryType,
  NotificationType,
} from '../notification/dtos/notification.dto';
import { SocketService } from '../socket/socket.service';

export class ProfileRewardService {
  constructor(
    @InjectRepository(ProfileRewardEntity)
    private profileRewardRepository: Repository<ProfileRewardEntity>,
    @InjectRepository(ProfileRewardStatusEntity)
    private profileRewardStatusRepository: Repository<ProfileRewardStatusEntity>,
    @InjectRepository(TeamEntity)
    private teamRepository: Repository<TeamEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private readonly transactionService: TransactionService,
    private readonly socketService: SocketService,
  ) {}

  async createProfileReward(
    dto: ProfileRewardRegisterDto | { teamId: string },
  ): Promise<ProfileRewardEntity> {
    const team = await this.teamRepository.findOneBy({ id: dto.teamId });
    if (!team) {
      throw new BadRequestException('Could not find the team.');
    }
    const existProfileReward = await this.profileRewardRepository.findOneBy({
      teamId: dto.teamId,
    });
    if (existProfileReward) {
      throw new BadRequestException('Profile Reward already exist');
    }
    const profileReward = getFromDto<ProfileRewardEntity>(
      dto,
      new ProfileRewardEntity(),
    );
    profileReward.team = team;
    const profileRewardEntity = await this.profileRewardRepository.save(
      profileReward,
    );
    team.profileRewardId = profileRewardEntity.id;
    await this.teamRepository.save(team);
    return profileRewardEntity;
  }

  async createProfileRewardStatus(
    dto: ProfileRewardStatusRegisterDto | { userId: string },
  ): Promise<ProfileRewardStatusEntity> {
    const user = await this.userRepository.findOneBy({ id: dto.userId });
    if (!user) {
      throw new BadRequestException('Could not find the user.');
    }

    const existProfileRewardStatus =
      await this.profileRewardStatusRepository.findOneBy({
        userId: dto.userId,
      });
    if (existProfileRewardStatus) {
      throw new BadRequestException('Profile Reward Status already exist');
    }

    const profileRewardStatus = getFromDto<ProfileRewardStatusEntity>(
      dto,
      new ProfileRewardStatusEntity(),
    );
    profileRewardStatus.user = user;
    const profileRewardStatusEntity =
      await this.profileRewardStatusRepository.save(profileRewardStatus);
    user.profileRewardStatusId = profileRewardStatusEntity.id;
    await this.userRepository.save(user);
    return profileRewardStatusEntity;
  }

  async getTeamProfileReward(teamId: string): Promise<ProfileRewardEntity> {
    return this.profileRewardRepository.findOne({
      where: { teamId },
      relations: ['team'],
    });
  }

  async getUserProfileRewardStatus(
    userId: string,
  ): Promise<ProfileRewardStatusEntity> {
    return this.profileRewardStatusRepository.findOne({
      where: { userId },
      relations: ['user'],
    });
  }

  async updateTeamProfileReward(
    dto: ProfileRewardRegisterDto,
  ): Promise<ProfileRewardEntity> {
    let profileReward = await this.profileRewardRepository.findOneBy({
      teamId: dto.teamId,
    });
    if (!profileReward) {
      throw new BadRequestException('Could not find the team profile reward');
    }
    profileReward = getFromDto(dto, profileReward);
    return await this.profileRewardRepository.save(profileReward);
  }

  async updateUserProfileStatusReward(
    dto: ProfileRewardStatusRegisterDto,
  ): Promise<{ entity: ProfileRewardStatusEntity; reward: any }> {
    let profileRewardStatus =
      await this.profileRewardStatusRepository.findOneBy({
        userId: dto.userId,
      });
    if (!profileRewardStatus) {
      throw new BadRequestException(
        'Could not find the user profile reward status',
      );
    }
    const transferRes = await this.transferRewards(dto, profileRewardStatus);
    profileRewardStatus = getFromDto(transferRes.dto, profileRewardStatus);
    return {
      entity: await this.profileRewardStatusRepository.save(
        profileRewardStatus,
      ),
      reward: transferRes.reward,
    };
  }

  async transferRewards(
    dto: ProfileRewardStatusRegisterDto,
    statusEntity: ProfileRewardStatusEntity,
  ): Promise<any> {
    const admin = (
      await this.userRepository.findBy({ role: UserRole.SuperAdmin })
    )[0];
    const receiver = await this.userRepository.findOne({
      where: { id: dto.userId },
    });
    const rewardEntity = await this.profileRewardRepository.findOneBy({
      teamId: receiver.teamId,
    });

    const arrayData = [
      {
        type: TransactionType.ProfileRewardLastName,
        tokenAmount: rewardEntity.lastNameFieldTokenAmount,
        kudosAmount: rewardEntity.lastNameFieldKudosAmount,
        oldFlag: statusEntity.lastNameFieldFilled,
        newFlag: dto.lastNameFieldFilled,
      },
      {
        type: TransactionType.ProfileRewardBirthday,
        tokenAmount: rewardEntity.birthdayFieldTokenAmount,
        kudosAmount: rewardEntity.birthdayFieldKudosAmount,
        oldFlag: statusEntity.birthdayFieldFilled,
        newFlag: dto.birthdayFieldFilled,
      },
      {
        type: TransactionType.ProfileRewardGender,
        tokenAmount: rewardEntity.genderFieldTokenAmount,
        kudosAmount: rewardEntity.genderFieldKudosAmount,
        oldFlag: statusEntity.genderFieldFilled,
        newFlag: dto.genderFieldFilled,
      },
      {
        type: TransactionType.ProfileRewardEmail,
        tokenAmount: rewardEntity.emailFieldTokenAmount,
        kudosAmount: rewardEntity.emailFieldKudosAmount,
        oldFlag: statusEntity.emailFieldFilled,
        newFlag: dto.emailFieldFilled,
      },
      {
        type: TransactionType.ProfileRewardPhone,
        tokenAmount: rewardEntity.phoneFieldTokenAmount,
        kudosAmount: rewardEntity.phoneFieldKudosAmount,
        oldFlag: statusEntity.phoneFieldFilled,
        newFlag: dto.phoneFieldFilled,
      },
      {
        type: TransactionType.ProfileRewardLocationCountry,
        tokenAmount: rewardEntity.locationCountryFieldTokenAmount,
        kudosAmount: rewardEntity.locationCountryFieldKudosAmount,
        oldFlag: statusEntity.locationCountryFieldFilled,
        newFlag: dto.locationCountryFieldFilled,
      },
      {
        type: TransactionType.ProfileRewardLocationState,
        tokenAmount: rewardEntity.locationStateFieldTokenAmount,
        kudosAmount: rewardEntity.locationStateFieldKudosAmount,
        oldFlag: statusEntity.locationStateFieldFilled,
        newFlag: dto.locationStateFieldFilled,
      },
      {
        type: TransactionType.ProfileRewardLocationCity,
        tokenAmount: rewardEntity.locationCityFieldTokenAmount,
        kudosAmount: rewardEntity.locationCityFieldKudosAmount,
        oldFlag: statusEntity.locationCityFieldFilled,
        newFlag: dto.locationCityFieldFilled,
      },
      {
        type: TransactionType.ProfileRewardFavPlayer,
        tokenAmount: rewardEntity.favPlayerFieldTokenAmount,
        kudosAmount: rewardEntity.favPlayerFieldKudosAmount,
        oldFlag: statusEntity.favPlayerFieldFilled,
        newFlag: dto.favPlayerFieldFilled,
      },
      {
        type: TransactionType.ProfileRewardFantype,
        tokenAmount: rewardEntity.fanTypeFieldTokenAmount,
        kudosAmount: rewardEntity.fanTypeFieldKudosAmount,
        oldFlag: statusEntity.fanTypeFieldFilled,
        newFlag: dto.fanTypeFieldFilled,
      },
    ];
    const filteredData = arrayData.filter(
      (item) => !item.oldFlag && item.newFlag,
    );
    try {
      // for (const item of filteredData) {
      //   const index = filteredData.indexOf(item);
      //   this.socketService.message$.next({
      //     userId: receiver.id,
      //     type: NotificationType.Reward,
      //     category: NotificationCategoryType.Auth,
      //     section: item.type,
      //     uniqueId: receiver.id,
      //     content: `You received reward for completing Profile`,
      //   });
      //   await this.transactionService.createTransaction({
      //     senderId: admin.id,
      //     receiverId: receiver.id,
      //     teamId: rewardEntity.teamId,
      //     type: item.type,
      //     uniqueId: '',
      //     kudosAmount: item.kudosAmount,
      //     tokenAmount: item.tokenAmount,
      //   });
      // }
      const totalReward = {
        kudosAmount: filteredData.reduce(
          (total, cur) => total + cur.kudosAmount,
          0,
        ),
        tokenAmount: filteredData.reduce(
          (total, cur) => total + cur.tokenAmount,
          0,
        ),
      };
      const transaction = await this.transactionService.createTransaction({
        senderId: admin.id,
        receiverId: receiver.id,
        teamId: rewardEntity.teamId,
        type: TransactionType.ProfileReward,
        uniqueId: '',
        kudosAmount: totalReward.kudosAmount,
        tokenAmount: totalReward.tokenAmount,
      });
      this.socketService.message$.next({
        userId: receiver.id,
        type: NotificationType.Reward,
        category: NotificationCategoryType.Auth,
        section: TransactionType.ProfileReward,
        uniqueId: transaction.id,
        content: `You received reward for completing Profile`,
      });
      dto.lastNameFieldFilled =
        statusEntity.lastNameFieldFilled || dto.lastNameFieldFilled;
      dto.lastNameFieldFilled =
        statusEntity.lastNameFieldFilled || dto.lastNameFieldFilled;
      dto.birthdayFieldFilled =
        statusEntity.birthdayFieldFilled || dto.birthdayFieldFilled;
      dto.genderFieldFilled =
        statusEntity.genderFieldFilled || dto.genderFieldFilled;
      dto.emailFieldFilled =
        statusEntity.emailFieldFilled || dto.emailFieldFilled;
      dto.phoneFieldFilled =
        statusEntity.phoneFieldFilled || dto.phoneFieldFilled;
      dto.locationCountryFieldFilled =
        statusEntity.locationCountryFieldFilled ||
        dto.locationCountryFieldFilled;
      dto.locationStateFieldFilled =
        statusEntity.locationStateFieldFilled || dto.locationStateFieldFilled;
      dto.locationCityFieldFilled =
        statusEntity.locationCityFieldFilled || dto.locationCityFieldFilled;
      dto.favPlayerFieldFilled =
        statusEntity.favPlayerFieldFilled || dto.favPlayerFieldFilled;
      dto.fanTypeFieldFilled =
        statusEntity.fanTypeFieldFilled || dto.fanTypeFieldFilled;
      return {
        dto: dto,
        reward: { ...totalReward },
      };
    } catch (e) {
      return {
        dto: dto,
        reward: {
          kudosAmount: 0,
          tokenAmount: 0,
        },
      };
    }
  }
}
