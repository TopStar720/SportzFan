import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  In,
  LessThanOrEqual,
  MoreThanOrEqual,
  Not,
  Repository,
} from 'typeorm';

import {
  AssetSortFilter,
  DirectionFilter,
  MaterialType,
  TransactionStatus,
  TransactionType,
} from 'src/common/models/base';
import { SuccessResponse } from 'src/common/models/success-response';
import { getFromDto } from 'src/common/utils/repository.util';
import { TeamEntity } from 'src/team/entities/team.entity';
import { TransactionService } from 'src/transaction/transaction.service';
import { UserService } from 'src/user/user.service';
import { AssetRegisterDto, AssetUpdateDto } from './dtos/asset.dto';
import { AssetEntity } from './entities/asset.entity';
import { AssetRedeemEntity } from './entities/assetRedeem.entity';
import { AssetFilter, AssetType, ClaimType } from './enums';
import { SocketService } from '../socket/socket.service';
import {
  NotificationCategoryType,
  NotificationType,
} from '../notification/dtos/notification.dto';

@Injectable()
export class AssetService {
  constructor(
    @InjectRepository(AssetEntity)
    private assetRepository: Repository<AssetEntity>,
    @InjectRepository(TeamEntity)
    private teamRepository: Repository<TeamEntity>,
    @InjectRepository(AssetRedeemEntity)
    private assetRedeemRepository: Repository<AssetRedeemEntity>,
    private transactionService: TransactionService,
    private userService: UserService,
    private socketService: SocketService,
    private dataSource: DataSource,
  ) {}

  async findById(id: string): Promise<[AssetEntity, number, number]> {
    const asset = await this.assetRepository.findOne({
      where: {
        id,
      },
      relations: ['team', 'sponsor', 'coupons'],
      order: {
        coupons: {
          order: 'ASC',
        },
      },
    });
    const purchaseCount = await this.assetRedeemRepository.count({
      where: {
        assetId: id,
      },
    });
    const claimCount = await this.assetRedeemRepository.count({
      where: {
        assetId: id,
        claimDate: Not(null),
      },
    });

    if (!asset) {
      throw new BadRequestException('Could not find the asset item.');
    }
    return [asset, purchaseCount, claimCount];
  }

  async getAssetRedeem(id: string): Promise<AssetEntity> {
    const asset = await this.assetRepository.findOne({
      where: {
        id,
      },
      relations: ['participants', 'participants.user'],
    });
    if (!asset) {
      throw new BadRequestException('Could not find the asset item.');
    }
    return asset;
  }

  async getMyAssetRedeem(
    assetId: string,
    userId: string,
  ): Promise<AssetEntity> {
    const asset = await this.assetRepository.findOne({
      relations: ['participants'],
      where: {
        id: assetId,
        participants: {
          userId,
        },
      },
    });
    if (!asset) {
      throw new BadRequestException('Could not find the asset item.');
    }
    return asset;
  }

  async find(
    skip: number,
    take: number,
    filter: AssetFilter,
    search: string,
    sort: AssetSortFilter,
    direction: DirectionFilter,
  ): Promise<[any[], number]> {
    const searchArray =
      search === ''
        ? []
        : search.split(',').map((item) => item.replace(/\s/g, ''));

    const query = this.dataSource
      .getRepository(AssetEntity)
      .createQueryBuilder('asset')
      .select(['asset.id', 'asset.title'])
      .leftJoin('asset.team', 'team')
      .addSelect('team.name', 'team')
      .leftJoin('asset.participants', 'participants')
      .addSelect('count(participants)', 'purchase_count')
      .addSelect('count(participants."claimDate")', 'claim_count');
    switch (filter) {
      case AssetFilter.Draft:
        query.where('asset.is_draft = :isDraft', { isDraft: true });
        break;
      case AssetFilter.Upcoming:
        query
          .where('asset.is_draft = :isDraft', { isDraft: false })
          .andWhere('asset.start >= now()');
        break;
      case AssetFilter.Live:
        query
          .where('asset.is_draft = :isDraft', { isDraft: false })
          .andWhere('asset.start <= now()')
          .andWhere('asset.end >= now()');
        break;
      case AssetFilter.Expired:
        query
          .where('asset.is_draft = :isDraft', { isDraft: false })
          .andWhere('asset.end <= now()');
        break;
    }
    if (search != '') {
      query.andWhere('team.id in (:...teamIds)', { teamIds: searchArray });
    }

    query.groupBy('asset.id').addGroupBy('team.id');
    query.orderBy(sort, direction);

    const count = await query.getCount();

    query.limit(take);
    query.offset(skip);

    const assetIds = await query.getRawMany();
    //
    const order = {};
    if (sort != AssetSortFilter.Team) {
      order[sort] = direction;
      order['coupons'] = { order: 'ASC' };
    } else {
      order['team'] = { name: direction };
      order['coupons'] = { order: 'ASC' };
    }

    const assets = await this.assetRepository.find({
      relations: ['team', 'sponsor', 'coupons'],
      where: {
        id: In(assetIds.map((item) => item.asset_id)),
      },
      order,
    });

    assets.map((asset) => {
      asset['purchaseCount'] = assetIds.find(
        (assetId) => assetId.asset_id === asset.id,
      ).purchase_count;
      asset['claimCount'] = assetIds.find(
        (assetId) => assetId.asset_id === asset.id,
      ).claim_count;
    });

    return [assets, count];
  }

  async findBonus(
    skip: number,
    take: number,
    filter: AssetFilter,
    search: string,
  ): Promise<[any[], number]> {
    const searchArray =
      search === ''
        ? []
        : search.split(',').map((item) => item.replace(/\s/g, ''));

    const query = this.dataSource
      .getRepository(AssetEntity)
      .createQueryBuilder('asset')
      .select(['asset.id', 'asset.title'])
      .leftJoin('asset.team', 'team')
      .addSelect('team.name', 'team')
      .leftJoin('asset.participants', 'participants')
      .addSelect('count(participants)', 'purchase_count')
      .addSelect('count(participants."claimDate")', 'claim_count')
      .where('asset.is_bonus is true');
    switch (filter) {
      case AssetFilter.Draft:
        query.andWhere('asset.is_draft = :isDraft', { isDraft: true });
        break;
      case AssetFilter.Upcoming:
        query
          .andWhere('asset.is_draft = :isDraft', { isDraft: false })
          .andWhere('asset.start >= now()');
        break;
      case AssetFilter.Live:
        query
          .andWhere('asset.is_draft = :isDraft', { isDraft: false })
          .andWhere('asset.start <= now()')
          .andWhere('asset.end >= now()');
        break;
      case AssetFilter.Expired:
        query
          .andWhere('asset.is_draft = :isDraft', { isDraft: false })
          .andWhere('asset.end <= now()');
        break;
    }
    if (search != '') {
      query.andWhere('team.id in (:...teamIds)', { teamIds: searchArray });
    }

    query.groupBy('asset.id').addGroupBy('team.id');
    query.orderBy('start', 'DESC');

    const count = await query.getCount();
    query.limit(take);
    query.offset(skip);
    const assetIds = await query.getRawMany();

    const assets = await this.assetRepository.find({
      relations: ['team', 'sponsor', 'coupons'],
      where: {
        id: In(assetIds.map((item) => item.asset_id)),
      },
      order: {
        start: 'DESC',
        coupons: {
          order: 'ASC',
        },
      },
    });

    assets.map((asset) => {
      asset['purchaseCount'] = assetIds.find(
        (assetId) => (assetId.asset_id = asset.id),
      ).purchase_count;
      asset['claimCount'] = assetIds.find(
        (assetId) => (assetId.asset_id = asset.id),
      ).claim_count;
    });

    return [assets, count];
  }

  async updateAsset(id: string, dto: AssetUpdateDto): Promise<SuccessResponse> {
    let asset = await this.assetRepository.findOneBy({
      id: id,
    });
    if (!asset) {
      throw new BadRequestException('Could not find the content item.');
    }
    if (dto.teamId) {
      const team = await this.teamRepository.findOneBy({ id: dto.teamId });
      if (!team) {
        throw new BadRequestException('Could not find the team.');
      }
    }
    asset = getFromDto(dto, asset);
    await this.assetRepository.save(asset);
    return new SuccessResponse(true);
  }

  async removeById(id: string): Promise<SuccessResponse> {
    await this.assetRepository.softDelete({ id });
    return new SuccessResponse(true);
  }

  async addAsset(dto: AssetRegisterDto): Promise<AssetEntity> {
    const asset = getFromDto<AssetEntity>(dto, new AssetEntity());
    return await this.assetRepository.save(asset);
  }

  async redeemAsset(
    teamId: string,
    userId: string,
    assetId: string,
  ): Promise<AssetRedeemEntity> {
    const superAdmin = await this.userService.findSuperAdmin();
    const asset = await this.assetRepository.findOne({
      where: {
        id: assetId,
      },
      relations: ['coupons'],
      order: {
        coupons: {
          order: 'ASC',
        },
      },
    });
    if (asset.teamId !== teamId) {
      throw new BadRequestException('You should only redeem team asset');
    }
    const currentRedeems = await this.assetRedeemRepository.find({
      where: {
        userId: userId,
        assetId: assetId,
      },
    });
    const mycurrentRedeems = await this.assetRedeemRepository.find({
      where: {
        userId: userId,
        assetId: assetId,
      },
    });
    if (asset.totalCount > currentRedeems?.length) {
      if (asset.maxPerUser > mycurrentRedeems?.length) {
        const assetRedeem = new AssetRedeemEntity();
        assetRedeem.userId = userId;
        assetRedeem.assetId = assetId;
        if (asset.claimType == ClaimType.Digital) {
          const unusedCoupon = asset.coupons.find(
            (item) => item.userId === null,
          );
          asset.coupons = asset.coupons.map((item) => {
            if (item.id === unusedCoupon?.id) {
              item.userId = userId;
              assetRedeem.couponId = item.id;
              return item;
            } else {
              return item;
            }
          });
        }
        await this.assetRepository.save(asset);
        const assetRedeemEntity = await this.assetRedeemRepository.save(
          assetRedeem,
        );
        await this.transactionService.createTransaction({
          senderId: userId,
          receiverId: superAdmin.id,
          teamId: teamId,
          matchId: null,
          type: TransactionType.AssetEligible,
          uniqueId: asset.id,
          status: TransactionStatus.Pending,
          kudosAmount: 0,
          tokenAmount: asset.tokenRequired,
          reason: asset.title,
        });
        return assetRedeemEntity;
      } else {
        throw new BadRequestException(
          'Could not redeem over max per user count',
        );
      }
    } else {
      throw new BadRequestException('Could not redeem over total count');
    }
  }

  async sendBonusAsset(
    assetId: string,
    users: string[],
    count: number,
    message: string,
  ): Promise<SuccessResponse> {
    try {
      const asset = await this.assetRepository.findOne({
        where: {
          id: assetId,
        },
        relations: ['coupons'],
        order: {
          coupons: {
            order: 'ASC',
          },
        },
      });

      const total = asset.totalCount;
      const handsOn = await this.assetRedeemRepository.count({
        where: { assetId },
      });
      if (total >= handsOn + users.length * count) {
        for (let i = 0; i < users.length; i++) {
          for (let j = 0; j < count; j++) {
            const userId = users[i];
            const assetRedeem = new AssetRedeemEntity();
            assetRedeem.userId = userId;
            assetRedeem.assetId = assetId;
            assetRedeem.message = message;
            this.socketService.message$.next({
              userId: userId,
              type: NotificationType.Reward,
              category: NotificationCategoryType.Asset,
              section: MaterialType.Asset,
              uniqueId: assetId,
              content: asset.title,
              detailContent: message,
            });

            if (asset.claimType == ClaimType.Digital) {
              const unusedCoupon = asset.coupons.find(
                (item) => item.userId === null,
              );
              asset.coupons = asset.coupons.map((item) => {
                if (item.id === unusedCoupon?.id) {
                  item.userId = userId;
                  assetRedeem.couponId = item.id;
                  return item;
                } else {
                  return item;
                }
              });
            }
            await this.assetRedeemRepository.save(assetRedeem);
          }
        }

        await this.assetRepository.save(asset);
        return new SuccessResponse(true);
      } else {
        throw new BadRequestException('Could not send assets over the total.');
      }
    } catch (ex) {
      throw new BadRequestException(
        ex.errorMessage || 'Could not send assets to user',
      );
    }
  }

  async claimAsset(assetRedeemId: string): Promise<AssetRedeemEntity> {
    const assetRedeem = await this.assetRedeemRepository.findOne({
      where: {
        id: assetRedeemId,
      },
      relations: ['asset', 'user'],
    });

    if (assetRedeem.claimDate) {
      throw new BadRequestException('Could not claim again');
    } else {
      // TODO: confirmed to remove since Luke mentioned that we don't need this logic
      // const superAdmin = await this.userService.findSuperAdmin();      
      // await this.transactionService.createTransaction({
      //   senderId: superAdmin.id,
      //   receiverId: assetRedeem.user.id,
      //   teamId: assetRedeem.asset.teamId,
      //   type: TransactionType.AssetReward,
      //   uniqueId: assetRedeem.asset.id,
      //   status: TransactionStatus.Pending,
      //   kudosAmount: assetRedeem.asset.kudosReward,
      //   tokenAmount: assetRedeem.asset.tokenReward,
      //   reason: assetRedeem.asset.title,
      // });

      assetRedeem.claimDate = new Date().toDateString();
      return this.assetRedeemRepository.save(assetRedeem);
    }
  }

  async getUserAssets(
    userId: string,
    teamId: string,
    skip: number,
    take: number,
    type: AssetType,
  ): Promise<[any[], number]> {
    try {
      const userAssetIds = (
        await this.assetRedeemRepository.find({
          select: ['assetId'],
          where: {
            userId: userId,
          },
        })
      ).map((item) => item.assetId);

      const query = this.dataSource
        .getRepository(AssetEntity)
        .createQueryBuilder('asset')
        .select(['asset.id', 'asset.title'])
        .leftJoin('asset.team', 'team')
        .addSelect('team.name', 'team')
        .leftJoin('asset.participants', 'participants')
        .addSelect('count(participants)', 'purchase_count')
        .addSelect('count(participants."claimDate")', 'claim_count')
        .where('asset.is_draft = :isDraft', { isDraft: false })
        .andWhere('asset.is_bonus = :isBonus', { isBonus: false })
        .andWhere('asset.team_id = :teamId', { teamId })
        .andWhere('asset.id not in (:...assetIds)', {
          assetIds: ['11111111-1111-1111-1111-111111111111', ...userAssetIds],
        })
        .andWhere('asset.start <= :start', { start: new Date() })
        .andWhere('asset.end >= :end', { end: new Date() })
        .groupBy('asset.id')
        .addGroupBy('team.id')
        .orderBy('start', 'DESC');

      if (!!type) query.andWhere('asset.type = :type', { type });
      const count = await query.getCount();

      query.limit(take);
      query.offset(skip);

      const assetIds = await query.getRawMany();

      const assets = await this.assetRepository.find({
        relations: ['team', 'sponsor', 'coupons'],
        where: {
          id: In([null, ...assetIds.map((item) => item.asset_id)]),
        },
        order: {
          start: 'DESC',
          coupons: {
            order: 'ASC',
          },
        },
      });

      assets.map((asset) => {
        asset['purchaseCount'] = assetIds.find(
          (assetId) => (assetId.asset_id = asset.id),
        ).purchase_count;
        asset['claimCount'] = assetIds.find(
          (assetId) => (assetId.asset_id = asset.id),
        ).claim_count;
      });

      return [assets, count];
    } catch (e) {
      console.log(e);
      throw new BadRequestException('Could not find the user asset.');
    }
  }

  async getMyAssets(
    userId: string,
    teamId: string,
    skip: number,
    take: number,
    type: AssetType,
  ): Promise<[AssetRedeemEntity[], number]> {
    const [assetRedeemIds, count] =
      await this.assetRedeemRepository.findAndCount({
        where: !!type
          ? {
              userId: userId,
              asset: {
                type: type,
                isDraft: false,
                start: LessThanOrEqual(new Date()),
                end: MoreThanOrEqual(new Date()),
                teamId,
              },
            }
          : {
              userId: userId,
              asset: {
                isDraft: false,
                start: LessThanOrEqual(new Date()),
                end: MoreThanOrEqual(new Date()),
                teamId,
              },
            },
        relations: ['asset'],
        skip,
        take,
      });

    return [
      await this.assetRedeemRepository.find({
        relations: ['user', 'asset', 'asset.coupons'],
        where: {
          id: In(assetRedeemIds.map((item) => item.id)),
        },
        order: {
          createdAt: 'ASC',
          asset: {
            coupons: {
              order: 'ASC',
            },
          },
        },
      }),
      count,
    ];
  }
}
