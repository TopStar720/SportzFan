import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestContext } from 'nestjs-request-context';
import { DataSource, In, Like, Repository } from 'typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';

import {
  DirectionFilter,
  GameType,
  TransactionStatus,
  TransactionType,
  UserRole,
  UserSortFilter,
} from '../common/models/base';
import { UserEntity } from './entities/user.entity';
import { EmailService } from '../email/email.service';
import { SocketService } from '../socket/socket.service';
import { TeamEntity } from '../team/entities/team.entity';
import { TokenEntity } from '../token/entities/token.entity';
import { getFromDto } from 'src/common/utils/repository.util';
import { SuccessResponse } from '../common/models/success-response';
import { TransactionService } from '../transaction/transaction.service';
import { ProfileRewardService } from '../profile-reward/profile-reward.service';
import {
  AdminRegisterDto,
  AdminUpdateDto,
  DetailedLeaderboardListDto,
  UserRegisterDto,
  UserResetPasswordRequestDto,
  UserUpdateDto,
} from './dto/user.dto';
import {
  NotificationCategoryType,
  NotificationType,
} from '../notification/dtos/notification.dto';
import { PlayTriviaEntity } from '../trivia/entities/play-trivia.entity';
import { PlaySurveyEntity } from '../survey/entities/play-survey.entity';
import { AssetRedeemEntity } from '../asset/entities/assetRedeem.entity';
import { PlayCheckInEntity } from '../check-in/entities/play-check-in.entity';
import { TransactionEntity } from '../transaction/entities/transaction.entity';
import { PollParticipantEntity } from '../poll/entities/pollParticipant.entity';
import { PlayMilestoneEntity } from '../milestone/entities/play-milestone.entity';
import { PlayPredictionEntity } from '../prediction/entities/play-prediction.entity';
import { PlayMultiCheckInEntity } from '../multi-check-in/entities/play-multi-check-in.entity';
import { PlayMultiReferrerEntity } from '../multi-referrer/entities/play-multi-referrer.entity';
import { ErrorCode } from 'src/common/models/error-code';

@Injectable()
export class UserService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(TeamEntity)
    private teamRepository: Repository<TeamEntity>,
    @InjectRepository(PlayPredictionEntity)
    private playPredictionRepository: Repository<PlayPredictionEntity>,
    @InjectRepository(PlayTriviaEntity)
    private playTriviaRepository: Repository<PlayTriviaEntity>,
    @InjectRepository(PlayMilestoneEntity)
    private playMilestoneRepository: Repository<PlayMilestoneEntity>,
    @InjectRepository(PlayCheckInEntity)
    private playCheckInRepository: Repository<PlayCheckInEntity>,
    @InjectRepository(PlayMultiCheckInEntity)
    private playMultiCheckInRepository: Repository<PlayMultiCheckInEntity>,
    @InjectRepository(PlaySurveyEntity)
    private playSurveyRepository: Repository<PlaySurveyEntity>,
    @InjectRepository(PlayMultiReferrerEntity)
    private playMultiReferrerRepository: Repository<PlayMultiReferrerEntity>,
    @InjectRepository(PollParticipantEntity)
    private pollParticipantRepository: Repository<PollParticipantEntity>,
    @InjectRepository(AssetRedeemEntity)
    private assetRedeemRepository: Repository<AssetRedeemEntity>,
    @InjectRepository(TransactionEntity)
    private transactionRepository: Repository<TransactionEntity>,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly transactionService: TransactionService,
    private readonly profileRewardService: ProfileRewardService,
    private readonly socketService: SocketService,
  ) {}

  async create(dto: UserRegisterDto): Promise<SuccessResponse> {
    try {
      const user = getFromDto<UserEntity>(dto, new UserEntity());
      const userEntity = await this.userRepository.save(user);
      await this.profileRewardService.createProfileRewardStatus({
        userId: userEntity.id,
      });
      return new SuccessResponse(true);
    } catch (e) {
      return new SuccessResponse(false);
    }
  }

  async add(dto: UserRegisterDto): Promise<UserEntity> {
    try {
      const user = getFromDto<UserEntity>(dto, new UserEntity());
      const userEntity = await this.userRepository.save(user);
      await this.profileRewardService.createProfileRewardStatus({
        userId: userEntity.id,
      });
      return userEntity;
    } catch (e) {
      return null;
    }
  }

  async addAdmin(dto: AdminRegisterDto): Promise<SuccessResponse> {
    try {
      const oldUser = await this.userRepository.findOne({
        where: { role: dto.role, email: dto.email },
      });
      if (oldUser) {
        throw new BadRequestException(`Admin email already exist`);
      }
      const team = await this.teamRepository.findOne({
        where: { id: dto.teamId },
      });
      if (!team) {
        throw new BadRequestException(`Team not found`);
      }
      if (team.tokenId !== dto.tokenId) {
        dto.tokenId = team.tokenId;
      }
      const password = await bcrypt.hash(dto.password, 10);
      dto.password = password;
      const user = getFromDto<UserEntity>(dto, new UserEntity());
      const userEntity = await this.userRepository.save(user);
      await this.profileRewardService.createProfileRewardStatus({
        userId: userEntity.id,
      });
      return new SuccessResponse(true);
    } catch (e) {
      return new SuccessResponse(false);
    }
  }
  async updateAdmin(
    userId: string,
    dto: AdminUpdateDto,
  ): Promise<SuccessResponse> {
    try {
      let user = await this.userRepository.findOne({
        where: { id: userId },
      });
      if (!user) {
        throw new BadRequestException(ErrorCode.UserNotFound);
      }
      user = getFromDto(dto, user);
      user.id = userId;
      await this.userRepository.save(user);
    } catch (e) {
      return new SuccessResponse(false);
    }
  }
  findAll(
    skip: number,
    take: number,
    search: string,
    teams: string,
    sort: UserSortFilter,
    direction: DirectionFilter,
  ): Promise<[UserEntity[], number]> {
    let order = {};
    if (sort === UserSortFilter.Name) {
      order = { firstName: direction, lastName: direction };
    } else {
      order[sort] = direction;
    }
    const teamArray =
      teams === ''
        ? []
        : teams.split(',').map((item) => item.replace(/\s/g, ''));
    return this.userRepository.findAndCount({
      relations: {
        team: true,
      },
      where:
        teams === ''
          ? [
              { firstName: Like(`%${search}%`) },
              { lastName: Like(`%${search}%`) },
              { userName: Like(`%${search}%`) },
              { email: Like(`%${search}%`) },
              { phone: Like(`%${search}%`) },
            ]
          : [
              {
                firstName: Like(`%${search}%`),
                team: { id: In([...teamArray]) },
              },
              {
                lastName: Like(`%${search}%`),
                team: { id: In([...teamArray]) },
              },
              {
                userName: Like(`%${search}%`),
                team: { id: In([...teamArray]) },
              },
              { email: Like(`%${search}%`), team: { id: In([...teamArray]) } },
              { phone: Like(`%${search}%`), team: { id: In([...teamArray]) } },
            ],
      order,
      take,
      skip,
    });
  }

  findByRole(role: UserRole): Promise<UserEntity[]> {
    return this.userRepository.findBy({
      role,
    });
  }

  findById(id: string): Promise<UserEntity> {
    return this.userRepository.findOne({
      relations: { team: true, token: true },
      where: { id },
    });
  }

  findOneByRole(role: UserRole, email: string): Promise<UserEntity> {
    return this.userRepository.findOneBy({
      role,
      email,
    });
  }

  findOne(teamId: string, email: string): Promise<UserEntity | undefined> {
    return this.userRepository.findOneBy({
      email,
      teamId,
    });
  }

  async updateUserStripeCustomerId(id: string, stripeCustomerId: string) {
    const user = await this.userRepository.findOneBy({
      id,
    });
    if (!user) {
      throw new BadRequestException(ErrorCode.UserNotFound);
    }
    user.stripeCustomerId = stripeCustomerId;
    return this.userRepository.save(user);
  }

  async updateActivation(id: string, flag: boolean): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({
      id,
    });
    if (!user) {
      throw new BadRequestException(ErrorCode.UserNotFound);
    }
    user.isActivated = flag;
    return await this.userRepository.save(user);
  }

  async update(id: string, dto: UserUpdateDto) {
    let user = await this.userRepository.findOneBy({
      id,
    });
    if (!user) {
      throw new BadRequestException(ErrorCode.UserNotFound);
    }
    user = getFromDto(dto, user);
    user.id = id;
    delete user.kudosAmount;
    delete user.tokenAmount;
    const rewardRes =
      await this.profileRewardService.updateUserProfileStatusReward({
        userId: id,
        lastNameFieldFilled: !!dto.lastName,
        birthdayFieldFilled: !!dto.birthday,
        genderFieldFilled: !!dto.gender,
        emailFieldFilled: !!dto.email,
        phoneFieldFilled: !!dto.phone,
        locationCountryFieldFilled: !!dto.locationCountry,
        locationStateFieldFilled: !!dto.locationState,
        locationCityFieldFilled: !!dto.locationCity,
        favPlayerFieldFilled: !!dto.favPlayer,
        fanTypeFieldFilled: !!dto.fanType,
      });
    return {
      entity: await this.userRepository.save(user),
      reward: rewardRes.reward,
    };
  }

  async updateLastLoginAt(id: string) {
    const result = {
      lastLoginAt: null,
      registerRank: 0,
      id,
    };
    const user = await this.userRepository.findOne({
      relations: { team: true },
      where: { id },
    });
    if (!user) {
      throw new BadRequestException(ErrorCode.UserNotFound);
    }
    result.lastLoginAt = user.lastLoginAt;
    user.lastLoginAt = new Date().toISOString();
    await this.userRepository.save(user);

    const owner = await this.dataSource
      .createQueryBuilder()
      .select('a.*')
      .from((subQuery) => {
        return subQuery
          .select(['ROW_NUMBER() OVER(ORDER BY "user"."createdAt" asc) rank'])
          .addSelect(['"user"."id"'])
          .where('"user"."team_id"=:teamId', { teamId: user.teamId })
          .from(UserEntity, 'user');
      }, 'a')
      .where(`a.id=\'${id}\'`)
      .getRawMany();
    result.registerRank = owner[0]['rank'];
    if (!!user.team.enableEarlySignupReward && result.registerRank <= user.team.earlySignupLimitCount && !result.lastLoginAt) {
      const admin = await this.findSuperAdmin();
      if (user.team.earlySignupKudosReward > 0 || user.team.earlySignupTokenReward > 0) {
        this.socketService.message$.next({
          userId: id,
          type: NotificationType.Reward,
          category: NotificationCategoryType.Auth,
          section: TransactionType.EarlySignUpReward,
          uniqueId: id,
          content: user.team.name,
        });

        await this.transactionService.createTransaction({
          senderId: admin.id,
          receiverId: id,
          teamId: user.teamId,
          type: TransactionType.EarlySignUpReward,
          uniqueId: '',
          kudosAmount:
            user.team.earlySignupKudosReward,
          tokenAmount:
            user.team.earlySignupTokenReward,
        });
      }      
    }
    return result;
  }

  async verify(code: string) {
    try {
      const teamId = this.jwtService.verify(code)?.teamId || '';
      const email = this.jwtService.verify(code)?.email || '';
      const user = await this.findOne(teamId, email);
      if (!user) {
        return new SuccessResponse(false, 'Could not find user');
      }
      user.isVerified = true;
      await this.userRepository.save(user);
      return new SuccessResponse(true, 'User verified');
    } catch (ex) {
      return new SuccessResponse(false, 'Verification failed');
    }
  }

  async forgotPasswordPreRequest(teamId: string, email: string) {
    const superAdmin = await this.findSuperAdmin();
    let user = null;    
    if (superAdmin.email === email) {
      user = superAdmin;
    } else {      
      user = await this.findOne(teamId, email);
      if (!user) {
        const teamAdmin = await this.findTeamAdmin(email);
        if (teamAdmin) {
          user =teamAdmin; 
        } else {
          throw new BadRequestException('Could not find registered email');
        }
      } 
    }
    
    const payload = { id: user.id, email: user.email };
    const code = this.jwtService.sign(payload);
    await this.emailService.sendForgotPasswordEmail(user, code);
    return new SuccessResponse(true);
  }

  async refer(senderId: string, email: string) {
    const user = await this.findUserById(senderId);
    if (!user) {
      throw new BadRequestException('Could not find registered sender');
    }
    const payload = { senderId: senderId };
    const code = this.jwtService.sign(payload);
    await this.emailService.sendInvitationEmail(email, code, user);
    return new SuccessResponse(true);
  }

  async getReferLink(senderId: string) {
    const user = await this.findUserById(senderId);
    if (!user) {
      throw new BadRequestException('Could not find registered sender');
    }
    const payload = { senderId: senderId };
    const code = this.jwtService.sign(payload);
    const req: Request = RequestContext.currentContext.req;
    const appDomain = req.headers['origin'];
    return `${appDomain}/register?token=${code}`;
  }

  async forgotPasswordRequest(code: string, password: string) {
    const id = this.jwtService.verify(code)?.id || '';
    const email = this.jwtService.verify(code)?.email || '';
    const user = await this.userRepository.findOneBy({
      id,
      email,
    });
    if (!user) {
      throw new BadRequestException(ErrorCode.UserNotFound);
    }
    user.password = await bcrypt.hash(password, 10);
    await this.userRepository.save(user);
    return new SuccessResponse(true);
  }

  async resetPassword(id: string, dto: UserResetPasswordRequestDto) {
    const user = await this.userRepository.findOneBy({
      id,
    });
    if (!user) {
      throw new BadRequestException(ErrorCode.UserNotFound);
    }
    const match = await bcrypt.compare(dto.oldPassword, user.password);
    if (!match) {
      throw new BadRequestException(ErrorCode.PasswordIncorrect);
    }
    user.password = await bcrypt.hash(dto.newPassword, 10);
    return this.userRepository.save(user);
  }

  async leaderboard(skip: number, limit: number, ownerId: string) {
    const ownerEntity = await this.findUserById(ownerId);
    const owner = this.dataSource
      .createQueryBuilder()
      .select('a.*')
      .from((subQuery) => {
        return subQuery
          .select([
            'ROW_NUMBER() OVER(ORDER BY "user"."kudos_amount" desc) rank',
          ])
          .addSelect(['"user"."id"'])
          .addSelect(['"user"."avatar"'])
          .addSelect(['"user"."email"'])
          .addSelect(['"user"."first_name"'])
          .addSelect(['"user"."last_name"'])
          .addSelect(['"user"."kudos_amount"'])
          .addSelect(['"user"."token_amount"'])
          .addSelect(['"team"."kudos_to_tire1"'])
          .addSelect(['"team"."kudos_to_tire2"'])
          .addSelect(['"team"."kudos_to_tire3"'])
          .addSelect(['"team"."kudos_to_tire4"'])
          .addSelect(['"team"."member_level_name1"'])
          .addSelect(['"team"."member_level_name2"'])
          .addSelect(['"team"."member_level_name3"'])
          .addSelect(['"team"."member_level_name4"'])
          .from(UserEntity, 'user')
          .where(`user.team_id='${ownerEntity.teamId}'`)
          .leftJoin(TeamEntity, 'team', '"user"."team_id" = "team"."id"');
      }, 'a')
      .where(`a.id=\'${ownerId}\'`)
      .getQuery();
    const others = this.dataSource
      .getRepository(UserEntity)
      .createQueryBuilder('user')
      .leftJoin(TeamEntity, 'team', '"user"."team_id" = "team"."id"')
      .select(['ROW_NUMBER() OVER(ORDER BY "user"."kudos_amount" desc) rank'])
      .addSelect(['"user"."id"'])
      .addSelect(['"user"."avatar"'])
      .addSelect(['"user"."email"'])
      .addSelect(['"user"."first_name"'])
      .addSelect(['"user"."last_name"'])
      .addSelect(['"user"."kudos_amount"'])
      .addSelect(['"user"."token_amount"'])
      .addSelect(['"team"."kudos_to_tire1"'])
      .addSelect(['"team"."kudos_to_tire2"'])
      .addSelect(['"team"."kudos_to_tire3"'])
      .addSelect(['"team"."kudos_to_tire4"'])
      .addSelect(['"team"."member_level_name1"'])
      .addSelect(['"team"."member_level_name2"'])
      .addSelect(['"team"."member_level_name3"'])
      .addSelect(['"team"."member_level_name4"'])
      .where(`user.team_id='${ownerEntity.teamId}'`)
      .addOrderBy('"user".kudos_amount', 'DESC')
      .offset(skip)
      .limit(limit)
      .getQuery();
    return await this.dataSource.query(`(${owner}) UNION ALL (${others})`);
  }

  async detailedLeaderboard(
    query: DetailedLeaderboardListDto,
    ownerId: string,
  ) {
    const superAdmin = await this.findSuperAdmin();
    const ownerEntity = await this.findUserById(ownerId);
    const typeList = {};
    typeList[GameType.Trivia] = [
      TransactionType.TriviaReward,
      TransactionType.TriviaEligible,
      TransactionType.TriviaPlay,
    ];
    typeList[GameType.Prediction] = [
      TransactionType.PredictionReward,
      TransactionType.PredictionEligible,
      TransactionType.PredictionPlay,
    ];
    typeList[GameType.Milestone] = [
      TransactionType.MilestoneReward,
      TransactionType.MilestoneEligible,
    ];

    let conditionStr = '1 = 1';
    let conditionStrBefore = '1 = 1';
    if (query.start) {
      conditionStr += ` and "transaction"."createdAt" >= '${query.start}'`;
      conditionStrBefore += ` and "transaction"."createdAt" >= '${query.start}'`;
    }
    if (query.end) {
      conditionStr += ` and "transaction"."createdAt" <= '${query.end}'`;
    }
    const endDate = query.end ? new Date(query.end) : new Date();
    const beforeDate = new Date();
    beforeDate.setDate(endDate.getDate() - 1);
    conditionStrBefore += ` and "transaction"."createdAt" <= '${beforeDate.toISOString()}'`;

    if (query.game) {
      conditionStr += ` and "transaction"."type" in ('${typeList[
        query.game
      ].join("','")}')`;
      conditionStrBefore += ` and "transaction"."type" in ('${typeList[
        query.game
      ].join("','")}')`;
    }
    const trans = `select "transaction"."id", "transaction"."team_id", "transaction"."type", "transaction"."createdAt", "transaction"."kudos_amount" as "kudos_amount", "transaction"."token_amount" as "token_amount", "transaction"."receiver_id" as "user_id" from "transaction" where ${conditionStr} and "transaction"."status" = '${TransactionStatus.Success}' and "transaction"."receiver_id" != '${superAdmin.id}' and "transaction"."team_id" = '${ownerEntity.teamId}' and "transaction"."deletedAt" is null union all select "transaction"."id", "transaction"."team_id", "transaction"."type", "transaction"."createdAt", -1 * "transaction"."kudos_amount" as "kudos_amount", -1 * "transaction"."token_amount" as "token_amount", "transaction"."sender_id" as "user_id" from "transaction" where ${conditionStr} and "transaction"."status" = '${TransactionStatus.Success}' and "transaction"."sender_id" != '${superAdmin.id}' and "transaction"."team_id" = '${ownerEntity.teamId}' and "transaction"."deletedAt" is null`;
    const old_trans = `select "transaction"."id", "transaction"."team_id", "transaction"."type", "transaction"."createdAt", "transaction"."kudos_amount" as "kudos_amount", "transaction"."token_amount" as "token_amount", "transaction"."receiver_id" as "user_id" from "transaction" where ${conditionStrBefore} and "transaction"."status" = '${TransactionStatus.Success}' and "transaction"."receiver_id" != '${superAdmin.id}' and "transaction"."team_id" = '${ownerEntity.teamId}' and "transaction"."deletedAt" is null union all select "transaction"."id", "transaction"."team_id", "transaction"."type", "transaction"."createdAt", -1 * "transaction"."kudos_amount" as "kudos_amount", -1 * "transaction"."token_amount" as "token_amount", "transaction"."sender_id" as "user_id" from "transaction" where ${conditionStrBefore} and "transaction"."status" = '${TransactionStatus.Success}' and "transaction"."sender_id" != '${superAdmin.id}' and "transaction"."team_id" = '${ownerEntity.teamId}' and "transaction"."deletedAt" is null`;
    const commonQuery = `select
        ROW_NUMBER() OVER(ORDER BY (case when sum("trans"."kudos_amount") is null then 0 else sum("trans"."kudos_amount") end) desc, max("trans"."createdAt") asc, "u"."createdAt") rank,
        max("a"."rank") as old_rank,
        "u"."id" as "id",
        "u"."createdAt" as "registe_date",
        max("trans"."createdAt") as "last_transaction",
        max("u"."first_name") as "first_name",
        max("u"."last_name") as "last_name",
        sum("trans"."kudos_amount") as kudos_amount,
        sum("trans"."token_amount") as token_amount,
        max("team"."kudos_to_tire1") as kudos_to_tire1,
        max("team"."kudos_to_tire2") as kudos_to_tire2,
        max("team"."kudos_to_tire3") as kudos_to_tire3,
        max("team"."kudos_to_tire4") as kudos_to_tire4,
        max("team"."member_level_name1") as member_level_name1,
        max("team"."member_level_name2") as member_level_name2,
        max("team"."member_level_name3") as member_level_name3,
        max("team"."member_level_name4") as member_level_name4
      from (select * from "user" where "user"."team_id" = '${ownerEntity.teamId}' and "user"."role" = '${UserRole.Fan}' and "user"."deletedAt" is null  ) "u"
        left join (${trans}) "trans" on "trans"."user_id" = "u"."id"      
        left join "team" "team" on "u"."team_id" = "team"."id" and "team"."deletedAt" is null
        left join (
            select
              ROW_NUMBER() OVER(ORDER BY (case when sum("trans"."kudos_amount") is null then 0 else sum("trans"."kudos_amount") end) desc, max("trans"."createdAt") asc, "u1"."createdAt") rank,
              "u1"."id" as "id",
              "u1"."createdAt" as "registe_date",
              max("trans"."createdAt") as "last_transaction",
              max("u1"."first_name") as "first_name",
              max("u1"."last_name") as "last_name",
              sum("trans"."kudos_amount") as kudos_amount,
              sum("trans"."token_amount") as token_amount
            from (select * from "user" where "user"."team_id" = '${ownerEntity.teamId}' and "user"."role" = '${UserRole.Fan}' and "user"."deletedAt" is null  ) "u1"
              left join (${old_trans}) "trans" on "trans"."user_id" = "u1"."id"      
            group by  "u1"."id", "u1"."createdAt"
        ) "a" on "a"."id" = "u"."id"
      group by
        "u"."id", "u"."createdAt"
    `;
    const owner = `select b.* from (${commonQuery}) "b" where b.id = '${ownerId}'`;
    const others = `${commonQuery}
      limit ${query.take || 10}
      offset ${query.skip || 0}
    `;
    return await this.dataSource.query(`(${owner}) UNION ALL (${others})`);
  }

  async getUserBalance(userId: string) {
    return await this.dataSource
      .getRepository(UserEntity)
      .createQueryBuilder('user')
      .leftJoin(TeamEntity, 'team', '"user"."team_id" = "team"."id"')
      .select('"team"."name"', 'teamName')
      .leftJoin(TokenEntity, 'token', '"user"."token_id" = "token"."id"')
      .addSelect('"user"."email"', 'email')
      .addSelect('"user"."kudos_amount"', 'kudosAmount')
      .addSelect('"user"."token_amount"', 'tokenAmount')
      .addSelect('"token"."price"', 'price')
      .addSelect('"token"."symbol"', 'symbol')
      .where('"user".id=:id', { id: userId })
      .getRawOne();
  }

  async getUserAnalysis(userId: string) {
    let gamePlayed = 0,
      gameCompleted = 0;
    const [playPredictionRes, playPredictionCount] =
      await this.playPredictionRepository.findAndCount({
        relations: {
          prediction: true,
        },
        where: {
          userId,
        },
      });
    gamePlayed += playPredictionCount;
    gameCompleted +=
      (playPredictionRes || []).filter(
        (item) => item.prediction?.isEnded || false,
      ).length || 0;

    const [playTriviaRes, playTriviaCount] =
      await this.playTriviaRepository.findAndCount({
        relations: {
          trivia: true,
        },
        where: {
          userId,
        },
      });
    gamePlayed += playTriviaCount;
    gameCompleted +=
      (playTriviaRes || []).filter((item) => item.trivia?.isEnded || false)
        .length || 0;

    const [playMilestoneRes, playMilestoneCount] =
      await this.playMilestoneRepository.findAndCount({
        relations: {
          milestone: true,
        },
        where: {
          userId,
        },
      });
    gamePlayed += playMilestoneCount;
    gameCompleted +=
      (playMilestoneRes || []).filter(
        (item) => item.milestone?.isEnded || false,
      ).length || 0;

    let challengePlayed = 0,
      challengeCompleted = 0;
    const [playCheckInRes, playCheckInCount] =
      await this.playCheckInRepository.findAndCount({
        relations: {
          checkIn: true,
        },
        where: {
          userId,
        },
      });
    challengePlayed += playCheckInCount;
    challengeCompleted += playCheckInCount;

    const [playMultiCheckInRes, playMultiCheckInCount] =
      await this.playMultiCheckInRepository.findAndCount({
        relations: {
          multiCheckIn: true,
        },
        where: {
          userId,
        },
      });
    challengePlayed += playMultiCheckInCount;
    challengeCompleted += playMultiCheckInCount;

    const [playSurveyRes, playSurveyCount] =
      await this.playSurveyRepository.findAndCount({
        relations: {
          survey: true,
        },
        where: {
          userId,
        },
      });
    challengePlayed += playSurveyCount;
    challengeCompleted += playSurveyCount;

    const [playMultiReferrerRes, playMultiReferrerCount] =
      await this.playMultiReferrerRepository.findAndCount({
        relations: {
          multiReferrer: true,
        },
        where: {
          userId,
        },
      });
    challengePlayed += playMultiReferrerCount;
    challengeCompleted += playMultiReferrerCount;

    let pollPlayed = 0,
      pollCompleted = 0;
    const [pollParticipantRes, pollParticipantCount] =
      await this.pollParticipantRepository.findAndCount({
        relations: {
          poll: true,
        },
        where: {
          userId,
        },
      });
    pollPlayed += pollParticipantCount;
    pollCompleted +=
      pollParticipantRes.filter((item) => item.poll?.isEnded || false).length ||
      0;

    let redeemedAsset = 0,
      claimedAsset = 0,
      spentRedemptionToken = 0;
    const [assetRedeemRes, assetRedeemCount] =
      await this.assetRedeemRepository.findAndCount({
        relations: {
          asset: true,
        },
        where: {
          userId,
        },
      });

    redeemedAsset = assetRedeemCount;
    claimedAsset =
      (assetRedeemRes || []).filter((item) => item.claimDate || false).length ||
      0;

    const sumRes = await this.dataSource
      .getRepository(TransactionEntity)
      .createQueryBuilder('trans')
      .select('SUM(trans.token_amount)', 'sum')
      .where('trans.sender_id=:id', { id: userId })
      .andWhere('trans.type=:type', { type: TransactionType.AssetEligible })
      .andWhere('trans.status=:status', { status: TransactionStatus.Success })
      .getRawOne();
    spentRedemptionToken = parseFloat(sumRes.sum || '0');

    return {
      gamePlayed,
      gameCompleted,
      challengePlayed,
      challengeCompleted,
      pollPlayed,
      pollCompleted,
      redeemedAsset,
      claimedAsset,
      spentRedemptionToken,
    };
  }

  async remove(
    role: UserRole,
    teamId: string,
    id: string,
  ): Promise<SuccessResponse> {
    try {
      const userAdmin = await this.findSuperAdmin();
      if (userAdmin.id === id) {
        throw new BadRequestException('Could not delete super admin');
      }
      if (role === UserRole.TeamAdmin) {
        const user = await this.userRepository.findOneBy({ id });
        if (!(user.teamId === teamId && user.role === UserRole.TeamAdmin)) {
          throw new BadRequestException('Could not delete user');
        }
      }
      await this.userRepository.softDelete({ id });
      return new SuccessResponse(true);
    } catch (e) {
      return new SuccessResponse(false);
    }
  }

  findUserById(id: string, findRemoved = false): Promise<UserEntity> {
    return this.userRepository.findOne({
      withDeleted: findRemoved,
      where: { id },
    });
  }

  count(): Promise<number> {
    return this.userRepository.count();
  }

  async findSuperAdmin(): Promise<UserEntity> {
    return this.userRepository.findOne({
      where: { role: UserRole.SuperAdmin },
    });
  }

  async findTeamAdmin(email: string): Promise<UserEntity> {
    return this.userRepository.findOne({
      where: { role: UserRole.TeamAdmin, email: email },
    });
  }
}
