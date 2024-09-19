import { In, Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SuccessResponse } from 'src/common/models/success-response';

import { UserEntity } from '../user/entities/user.entity';
import { getFromDto } from 'src/common/utils/repository.util';
import { NotificationRegisterDto } from './dtos/notification.dto';
import { NotificationEntity } from './entities/notification.entity';

export class NotificationService {
  constructor(
    @InjectRepository(NotificationEntity)
    private notificationRepository: Repository<NotificationEntity>,

    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  // Create one notification
  async createNotification(
    dto: NotificationRegisterDto,
  ): Promise<NotificationEntity> {
    const user = await this.userRepository.findOneBy({ id: dto.userId });
    if (!user) {
      throw new BadRequestException('Could not find the user.');
    }
    const notification = getFromDto<NotificationEntity>(
      dto,
      new NotificationEntity(),
    );
    notification.user = user;
    return this.notificationRepository.save(notification);
  }

  // Create one notification
  async createBulkNotification(
    dtos: NotificationRegisterDto[],
  ): Promise<NotificationEntity[]> {
    const users = await this.userRepository.find({
      where: {
        id: In(dtos.map((dto) => dto.userId)),
      },
    });
    if (users.length != dtos.length) {
      throw new BadRequestException('Could not find the user.');
    }

    const notifications = dtos.map((dto) => {
      const user = users.find((user) => user.id === dto.userId);
      return {
        ...getFromDto<NotificationEntity>(dto, new NotificationEntity()),
        user,
      };
    });

    return this.notificationRepository.save(notifications);
  }

  //Get all Notification list
  async getAllNotification(
    skip: number,
    take: number,
    isSeen: string,
  ): Promise<[NotificationEntity[], number]> {
    return this.notificationRepository.findAndCount({
      relations: ['user'],
      where:
        isSeen === undefined || isSeen === ''
          ? {}
          : { isSeen: isSeen === 'true' },
      order: {
        createdAt: 'DESC',
      },
      skip,
      take,
    });
  }

  //Get user Notification list
  async getUserNotification(
    userId: string,
    skip: number,
    take: number,
    isSeen: string,
  ): Promise<[NotificationEntity[], number]> {
    return this.notificationRepository.findAndCount({
      relations: ['user'],
      where:
        isSeen === undefined || isSeen === ''
          ? { userId }
          : { userId, isSeen: isSeen === 'true' },
      order: {
        createdAt: 'DESC',
      },
      skip,
      take,
    });
  }

  // Get one Notification by id
  async getOneNotification(id: string): Promise<NotificationEntity> {
    const notification = await this.notificationRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!notification) {
      throw new BadRequestException('Could not find the notification item.');
    }
    return notification;
  }

  // Update Notification by id
  async seeNotification(id: string): Promise<NotificationEntity> {
    const notification = await this.notificationRepository.findOneBy({
      id: id,
    });
    if (!notification) {
      throw new BadRequestException('Could not find the notification item.');
    }
    if (notification.userId) {
      const user = await this.userRepository.findOneBy({
        id: notification.userId,
      });
      if (!user) {
        throw new BadRequestException('Could not find the user.');
      }
    }
    notification.isSeen = true;
    return this.notificationRepository.save(notification);
  }

  async deleteNotification(id: string): Promise<SuccessResponse> {
    await this.notificationRepository.softDelete({ id });
    return new SuccessResponse(true);
  }

  async deleteAllNotification(userId: string): Promise<SuccessResponse> {
    const notifications = await this.notificationRepository.findBy({
      userId,
    });
    await this.notificationRepository.softDelete(
      notifications.map((item) => item.id),
    );
    return new SuccessResponse(true);
  }
}
