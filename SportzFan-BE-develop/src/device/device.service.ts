import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';

import { DeviceDeleteByUserDto, DeviceRegisterDto } from './dto/device.dto';
import { DeviceEntity } from './entities/device.entity';
import { getFromDto } from '../common/utils/repository.util';
import { UserEntity } from '../user/entities/user.entity';
import { SuccessResponse } from '../common/models/success-response';
import { ErrorCode } from 'src/common/models/error-code';
import { TeamEntity } from 'src/team/entities/team.entity';
import { PushNotificationService } from 'src/push-notification/push-notification.service';

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(DeviceEntity)
    private deviceRepository: Repository<DeviceEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(TeamEntity)
    private teamRepository: Repository<TeamEntity>,
    private readonly pushNotificationService: PushNotificationService,
  ) {}

  async createDevice(dto: DeviceRegisterDto, userId): Promise<DeviceEntity> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new BadRequestException(ErrorCode.UserNotFound);
    }

    const team = await this.teamRepository.findOneBy({ id: user.teamId });
    if (!team) {
      throw new BadRequestException(ErrorCode.TeamNotFound);
    } 

    const sameDevice = await this.deviceRepository.findOne({
      relations: ['user', 'team'],
      where: {
        projectId: dto.projectId,
        token: dto.token,
        userId: userId,
        teamId: team.id,
      },
    });

    if (sameDevice) {
      return sameDevice;
    }
        
    const device = getFromDto<DeviceEntity>(dto, new DeviceEntity());
    device.userId = user.id;
    device.user = user;
    device.teamId = team.id;
    device.team = team;
    await this.pushNotificationService.subscribe("sportzfan", dto.token, `sportzfan-${team.id}`);
    return this.deviceRepository.save(device);
  }

  async getDeviceForUser(
    projectId: string,
    userId: string,
  ): Promise<DeviceEntity[]> {
    return this.deviceRepository.find({
      relations: ['user', 'team'],
      where: {
        projectId,
        userId,
      },
    });
  }

  async deleteDeviceByUser(
    dto: DeviceDeleteByUserDto,
  ): Promise<SuccessResponse> {
    await this.deviceRepository.softDelete({ userId: dto.userId });
    return new SuccessResponse(true);
  }
}
