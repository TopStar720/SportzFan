import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestContext } from 'nestjs-request-context';
import { SesEmailOptions, SesService } from '@nextnm/nestjs-ses';
import { Repository } from 'typeorm';

import { Config } from 'src/config';
import { TeamEntity } from 'src/team/entities/team.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import {
  emailTemplate,
  EmailTemplateSubjects,
  emailText,
  replaceTagsOnMailString,
} from './email.template';
import { EmailType } from './enums';

@Injectable()
export class EmailService {
  constructor(
    private sesService: SesService,
    @InjectRepository(TeamEntity)
    private teamRepository: Repository<TeamEntity>,
  ) {}

  async sendVerificationEmail(
    user: UserEntity,
    token: string,
    payload: string,
  ): Promise<boolean> {
    const req: Request = RequestContext.currentContext.req;
    const appDomain = req.headers['origin'];
    const team = await this.teamRepository.findOneBy({ id: user.teamId });
    if (!team) {
      throw new BadRequestException('Could not find the team.');
    }

    return this.sendMail(EmailType.ConfirmRegister, user.email, {
      teamName: team.name,
      teamLogo: team.logo,
      activateLink: `${appDomain}/verify-email?token=${token}${!!payload ? '&payload=' + payload : '' }`,
      name: user.firstName,
    });
  }

  async sendForgotPasswordEmail(
    user: UserEntity,
    token: string,
  ): Promise<boolean> {
    const req: Request = RequestContext.currentContext.req;
    const appDomain = req.headers['origin'];
    const team = await this.teamRepository.findOneBy({ id: user.teamId });
    if (!team) {
      throw new BadRequestException('Could not find the team.');
    }

    return this.sendMail(EmailType.ForgotPassword, user.email, {
      teamName: team.name,
      teamLogo: team.logo,
      resetLink: `${appDomain}/reset-password?token=${token}`,
      name: user.firstName,
    });
  }

  async sendInvitationEmail(
    email: string,
    token: string,
    user: UserEntity,
  ): Promise<boolean> {
    const req: Request = RequestContext.currentContext.req;
    const appDomain = req.headers['origin'];
    const team = await this.teamRepository.findOneBy({ id: user.teamId });
    if (!team) {
      throw new BadRequestException('Could not find the team.');
    }

    return this.sendMail(EmailType.ConfirmInvitation, email, {
      teamName: team.name,
      teamLogo: team.logo,
      registerLink: `${appDomain}/register?token=${token}`,
      name: user.firstName,
    });
  }

  async sendRewardRegisterEmail(
    user: UserEntity,
    friend: UserEntity,
    kudosAmount: number,
    tokenAmount: number,
  ): Promise<boolean> {
    const req: Request = RequestContext.currentContext.req;
    const appDomain = req.headers['origin'];
    const team = await this.teamRepository.findOneBy({ id: user.teamId });
    if (!team) {
      throw new BadRequestException('Could not find the team.');
    }

    return this.sendMail(EmailType.ConfirmRewardRegister, user.email, {
      teamName: team.name,
      teamLogo: team.logo,
      walletLink: `${appDomain}/wallet`,
      name: user.firstName,
      friendName: friend.firstName,
      kudos: kudosAmount,
      token: tokenAmount,
    });
  }

  async sendConfirmRegisterPlatformEmail(
    adminEmail: string,
    adminPassword: string,
    platformName: string,
    platformUrl: string,
    appLogoImage: string,
  ): Promise<boolean> {
    let adminDomain = 'dev.admin-sportzfan.io';
    let appDomain = 'dev-sportzfan.io';
    if (process.env.MODE === 'PROD') {
      adminDomain = 'admin-sportzfan.io';
      appDomain = 'sportzfan.io';
    }
    return this.sendMail(EmailType.ConfirmRegisterPlatform, adminEmail, {
      adminEmail,
      adminPassword,
      platformName,
      platformUrl,
      appLogoImage,
      adminDomain,
      appDomain,
    });
  }

  async sendRewardPlayEmail(
    user: UserEntity,
    friend: UserEntity,
    kudosAmount: number,
    tokenAmount: number,
  ): Promise<boolean> {
    const req: Request = RequestContext.currentContext.req;
    const appDomain = req.headers['origin'];
    const team = await this.teamRepository.findOneBy({ id: user.teamId });
    if (!team) {
      throw new BadRequestException('Could not find the team.');
    }

    return this.sendMail(EmailType.ConfirmRewardPlay, user.email, {
      teamName: team.name,
      teamLogo: team.logo,
      referralLink: `${appDomain}/referral`,
      walletLink: `${appDomain}/wallet`,
      name: user.firstName,
      friendName: friend.firstName,
      kudos: kudosAmount,
      token: tokenAmount,
    });
  }

  async sendMail(
    code: EmailType,
    recipient: string,
    substitutes: any,
    from?: string,
  ): Promise<boolean> {
    const subject = replaceTagsOnMailString(
      EmailTemplateSubjects[code],
      substitutes,
    );
    const html = replaceTagsOnMailString(emailTemplate(code), substitutes);
    const text = replaceTagsOnMailString(emailText(code), substitutes);
    const options: SesEmailOptions = {
      from: from || `${Config.companyName} <hello@${Config.mailDomain}>`,
      to: recipient,
      subject,
      html,
      text,
    };
    await this.sesService.sendEmail(options);
    return true;
  }

  async sendMailToSupport(subject: string, text: string): Promise<boolean> {
    const options: SesEmailOptions = {
      from: `Notification <hello@${Config.mailDomain}>`,
      to: `contact@${Config.mailDomain}`,
      subject,
      text,
    };
    await this.sesService.sendEmail(options);
    return true;
  }
}
