import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { PlatformUsageRegisterDto } from './dtos/platform-usage.dto';
import { UserEntity } from '../user/entities/user.entity';
import { PlatformUsageEntity } from './entities/platform-usage.entity';
import { getFromDto } from 'src/common/utils/repository.util';

@Injectable()
export class PlatformUsageService {
  constructor(
    @InjectRepository(PlatformUsageEntity)
    private platformUsageRepository: Repository<PlatformUsageEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async createPlatformUsage(
    dto: PlatformUsageRegisterDto,
  ): Promise<PlatformUsageEntity> {
    const sender = await this.userRepository.findOneBy({
      id: dto.userId,
    });
    if (!sender) {
      throw new BadRequestException('Could not find user.');
    }

    const platformUsage = getFromDto<PlatformUsageEntity>(
      dto,
      new PlatformUsageEntity(),
    );
    return this.platformUsageRepository.save(platformUsage);
  }

  async addLoginCount(userId: string): Promise<PlatformUsageEntity> {
    let platformUsage = await this.platformUsageRepository.findOne({
      relations: {
        user: true,
      },
      where: {
        userId,
      },
    });
    if (!platformUsage) {
      platformUsage = await this.createPlatformUsage({ userId });
    }
    platformUsage.totalLoginCount++;
    if (!platformUsage.lastLoginAt) {
      platformUsage.lastMonthLoginCount = 1;
    } else {
      const currentDate = new Date();
      const lastLoginDate = new Date(platformUsage.lastLoginAt);
      if (currentDate.getMonth() === lastLoginDate.getMonth()) {
        platformUsage.lastMonthLoginCount++;
      } else {
        platformUsage.lastMonthLoginCount = 1;
      }
    }
    platformUsage.lastLoginAt = new Date().toISOString();
    return await this.platformUsageRepository.save(platformUsage);
  }

  async addUsageMinutes(
    userId: string,
    mins: number,
  ): Promise<PlatformUsageEntity> {
    const platformUsage = await this.platformUsageRepository.findOne({
      relations: {
        user: true,
      },
      where: {
        userId,
      },
    });
    if (!platformUsage) {
      throw new BadRequestException('Could not find the platform usage.');
    }
    platformUsage.totalUsageMinutes += mins;
    if (!platformUsage.lastLoginAt) {
      platformUsage.lastMonthUsageMinutes = mins;
    } else {
      const currentDate = new Date();
      const lastLoginDate = new Date(platformUsage.lastLoginAt);
      if (currentDate.getMonth() === lastLoginDate.getMonth()) {
        platformUsage.lastMonthUsageMinutes += mins;
      } else {
        platformUsage.lastMonthUsageMinutes = mins;
      }
    }
    return await this.platformUsageRepository.save(platformUsage);
  }

  async getPlatformUsage(userId: string): Promise<PlatformUsageEntity> {
    const platformUsage = await this.platformUsageRepository.findOne({
      relations: {
        user: true,
      },
      where: {
        userId,
      },
    });
    if (!platformUsage) {
      throw new BadRequestException('Could not find the platform usage.');
    }
    return platformUsage;
  }
}
