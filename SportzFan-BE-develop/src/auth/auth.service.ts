import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, Injectable } from '@nestjs/common';

import { UserService } from '../user/user.service';
import { TeamService } from '../team/team.service';
import { EmailService } from '../email/email.service';
import { UserRegisterDto } from 'src/user/dto/user.dto';
import { SocketService } from '../socket/socket.service';
import { SuccessResponse } from '../common/models/success-response';
import {
  NotificationCategoryType,
  NotificationType,
} from '../notification/dtos/notification.dto';
import { ReferralService } from '../referral/referral.service';
import { TransactionService } from '../transaction/transaction.service';
import {
  TransactionStatus,
  TransactionType,
  UserRole,
} from '../common/models/base';
import { ErrorCode } from '../common/models/error-code';
import { PlatformUsageService } from '../platform-usage/platform-usage.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly teamService: TeamService,
    private readonly socketService: SocketService,
    private readonly referralService: ReferralService,
    private readonly transactionService: TransactionService,
    private readonly platformUsageService: PlatformUsageService,
  ) {}

  async validateUser(
    teamId: string,
    email: string,
    password: string,
    isAdminLogin = false,
  ): Promise<any> {
    let user = null;
    if (isAdminLogin) {
      user = await this.userService.findOneByRole(UserRole.SuperAdmin, email);
      if (!user) {
        user = await this.userService.findOneByRole(UserRole.TeamAdmin, email);
        if (!user) {
          throw new BadRequestException(ErrorCode.EmailNotRegisteredAsAdmin);
        }
      }
    } else {
      const team = await this.teamService.findOne(teamId);
      if (!team) {
        throw new BadRequestException(ErrorCode.TeamNotFound);
      }

      user = await this.userService.findOne(teamId, email);
      if (!user) {
        throw new BadRequestException(ErrorCode.EmailNotRegistered);
      }
    }
    if (!user.isVerified) {
      throw new BadRequestException(ErrorCode.UserNotVerified);
    }
    if (!user.isActivated) {
      throw new BadRequestException(ErrorCode.UserNotActivated);
    }
    if (isAdminLogin && user.role === UserRole.Fan) {
      throw new BadRequestException(ErrorCode.OnlyAdminAllowedSuperAdminSite);
    }
    const match = await bcrypt.compare(password, user.password);
    if (user && match) {
      return user;
    } else {
      throw new BadRequestException(ErrorCode.PasswordIncorrect);
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      id: user.id,
      role: user.role,
      email: user.email,
      teamId: user.teamId,
    };
    const updateRes = await this.userService.updateLastLoginAt(user.id);
    await this.platformUsageService.addLoginCount(user.id);
    return {
      access_token: this.jwtService.sign(payload),
      ...updateRes,
    };
  }

  async signup(dto: UserRegisterDto, token = '') {
    const team = await this.teamService.findOne(dto.teamId);
    if (!team) {
      throw new BadRequestException(ErrorCode.TeamNotFound);
    }
    if (!team.tokenId) {
      throw new BadRequestException(ErrorCode.TeamTokenNotFound);
    }
    const user = await this.userService.findOne(dto.teamId, dto.email);
    if (user) {
      throw new BadRequestException(ErrorCode.EmailTaken);
    }
    dto.password = await bcrypt.hash(dto.password, 10);
    dto.tokenId = team.tokenId;
    const userEntity = await this.userService.add(dto);
    if (userEntity) {
      this.socketService.message$.next({
        userId: userEntity.id,
        type: NotificationType.SignUp,
        category: NotificationCategoryType.Auth,
        section: '',
        uniqueId: userEntity.id,
        content: team.name,
        detailContent: userEntity.firstName,
      });
      const wholeUserEntity = await this.userService.findOne(
        dto.teamId,
        dto.email,
      );
      const payload = {
        id: wholeUserEntity.id,
        teamId: wholeUserEntity.teamId,
        email: wholeUserEntity.email,
      };
      const code = this.jwtService.sign(payload);
      await this.emailService.sendVerificationEmail(wholeUserEntity, code, dto.payload || '');
      await this.platformUsageService.createPlatformUsage({
        userId: userEntity.id,
      });

      //Referral process
      if (token) {
        const referralSenderId = this.jwtService.verify(token)?.senderId || '';
        const referral = await this.referralService.createReferral({
          senderId: referralSenderId,
          receiverId: userEntity.id,
        });
        if (team.referralSignupKudosReward > 0 || team.referralSignupTokenReward > 0) {
          await this.transactionService.createTransaction({
            senderId: null,
            receiverId: referral.senderId,
            teamId: dto.teamId,
            matchId: null,
            type: TransactionType.ReferralSignUpReward,
            uniqueId: referral.id,
            status: TransactionStatus.Pending,
            kudosAmount:
              team.referralSignupKudosReward,
            tokenAmount:
              team.referralSignupTokenReward,
          });
        }        
        await this.referralService.passedSignup(
          userEntity.id,
          team.referralSignupKudosReward,
          team.referralSignupTokenReward,
        );
      }
    } else {
      throw new BadRequestException(ErrorCode.UserCreateFailed);
    }
    return new SuccessResponse(true);
  }
}
