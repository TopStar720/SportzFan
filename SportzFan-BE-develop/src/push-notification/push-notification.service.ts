import { BadRequestException, Injectable } from '@nestjs/common';
import { In, Repository, Like } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import {
  DirectionFilter,
  PushNotificationSortFilter,
} from 'src/common/models/base';
import { FireBase } from './core/firebase';
import { ErrorCode } from 'src/common/models/error-code';
import { MessageDto } from './dto/push-notification.dto';
import { TeamEntity } from '../team/entities/team.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { getFromDto } from '../common/utils/repository.util';
import { PushNotificationHistoryRegisterDto } from './dto/push-notification-history.dto';
import { PushNotificationHistoryEntity } from './entities/push-notification-history.entity';

@Injectable()
export class PushNotificationService {
  constructor(
    private readonly _firebase: FireBase,
    @InjectRepository(TeamEntity)
    private teamRepository: Repository<TeamEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(PushNotificationHistoryEntity)
    private pushNotificationHistoryRepository: Repository<PushNotificationHistoryEntity>,
  ) {
    this._firebase.configure();
  }

  async sendNotification(
    projectId: string,
    token: string,
    notification: MessageDto,
  ): Promise<any> {
    try {
      return await this._firebase.sendNotification(
        projectId,
        token,
        notification,
      );
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async sendTopicNotification(
    projectId: string,
    notification: MessageDto,
    topic: string,
  ): Promise<any> {
    try {
      return await this._firebase.sendTopicNotification(
        projectId,
        notification,
        topic,
      );
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async subscribe(projectId: string, token: string, topic: string): Promise<any> {
    try {
      return await this._firebase.subscribe(projectId, token, topic);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async unSubscribe(projectId: string, token: string, topic: string): Promise<any> {
    try {
      return await this._firebase.unSubscribe(projectId, token, topic);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async createPushNotificationHistory(
    dto: PushNotificationHistoryRegisterDto,
    userId: string,
  ): Promise<PushNotificationHistoryEntity> {
    const team = await this.teamRepository.findOneBy({ id: dto.teamId });
    if (!team) {
      throw new BadRequestException(ErrorCode.TeamNotFound);
    }
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new BadRequestException(ErrorCode.UserNotFound);
    }
    const history = getFromDto<PushNotificationHistoryEntity>(
      dto,
      new PushNotificationHistoryEntity(),
    );
    history.team = team;
    history.userId = userId;
    history.user = user;
    return await this.pushNotificationHistoryRepository.save(history);
  }

  async updatePushNotificationHistory(
    id: string,
    dto: PushNotificationHistoryRegisterDto,
  ): Promise<PushNotificationHistoryEntity> {
    let entity = await this.pushNotificationHistoryRepository.findOneBy({
      id: id,
    });
    if (!entity) {
      throw new BadRequestException(ErrorCode.PushNotificationHistoryNotFound);
    }
    entity = getFromDto(dto, entity);
    return await this.pushNotificationHistoryRepository.save(entity);
  }

  async getOnePushNotificationHistory(
    id: string,
  ): Promise<PushNotificationHistoryEntity> {
    const entity = await this.pushNotificationHistoryRepository.findOne({
      relations: {
        team: true,
        user: true,
      },
      where: {
        id: id,
      },
    });
    if (!entity) {
      throw new BadRequestException(ErrorCode.PushNotificationHistoryNotFound);
    }
    return entity;
  }

  async getAllPushNotificationHistory(
    skip: number,
    take: number,
    isDraft: string,
    isEnded: string,
    filter: string,
    search: string,
    teams: string,
    sort: PushNotificationSortFilter,
    direction: DirectionFilter,
  ): Promise<[PushNotificationHistoryEntity[], number]> {
    let order = {};
    if (sort === PushNotificationSortFilter.Team) {
      order = { team: { name: direction } };
    } else if (sort === PushNotificationSortFilter.user) {
      order = { user: { firstName: direction, lastName: direction } };
    } else {
      order[sort] = direction;
    }
    const teamArray =
      teams === ''
        ? []
        : teams.split(',').map((item) => item.replace(/\s/g, ''));
    let where = {};
    if (filter !== '') {
      where['criteria'] = filter;
    }
    if (isDraft !== '') {
      where['isDraft'] = isDraft === 'true';
    }
    if (isEnded !== '') {
      where['isEnded'] = isEnded === 'true';
    }
    if (teams !== '') {
      where['team'] = { id: In([...teamArray]) };
    }
    if (search !== '') {
      where = [
        {
          ...where,
          title: Like(`%${search}%`),
        },
        {
          ...where,
          user: {
            firstName: Like(`%${search}%`),
          },
        },
        {
          ...where,
          user: {
            lastName: Like(`%${search}%`),
          },
        },
        {
          ...where,
          user: {
            email: Like(`%${search}%`),
          },
        },
        {
          ...where,
          user: {
            phone: Like(`%${search}%`),
          },
        },
        {
          ...where,
          user: {
            firstName: Like(`%${search}%`),
          },
        },
        {
          ...where,
          team:
            teams !== ''
              ? {
                  name: Like(`%${search}%`),
                  id: In([...teamArray]),
                }
              : {
                  name: Like(`%${search}%`),
                },
        },
      ];
    }
    return this.pushNotificationHistoryRepository.findAndCount({
      relations: ['team', 'user'],
      where: where,
      order,
      skip,
      take,
    });
  }
}
