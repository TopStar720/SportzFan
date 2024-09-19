import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { EmailService } from '../email/email.service';
import { ReferralRegisterDto } from './dtos/referral.dto';
import { UserEntity } from '../user/entities/user.entity';
import { ReferralEntity } from './entities/referral.entity';
import { getFromDto } from 'src/common/utils/repository.util';

@Injectable()
export class ReferralService {
  constructor(
    private readonly emailService: EmailService,
    @InjectRepository(ReferralEntity)
    private referralRepository: Repository<ReferralEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async createReferral(dto: ReferralRegisterDto): Promise<ReferralEntity> {
    if (dto.senderId === dto.receiverId) {
      throw new BadRequestException("Sender and Receiver can't be same");
    }
    const sender = await this.userRepository.findOneBy({
      id: dto.senderId,
    });
    if (!sender) {
      throw new BadRequestException('Could not find the sender.');
    }
    const receiver = await this.userRepository.findOneBy({
      id: dto.receiverId,
    });
    if (!receiver) {
      throw new BadRequestException('Could not find the receiver.');
    }

    const referral = getFromDto<ReferralEntity>(dto, new ReferralEntity());
    return await this.referralRepository.save(referral);
  }

  async passedSignup(
    receiverId: string,
    referralSignupKudosReward: number,
    referralSignupTokenReward: number,
  ): Promise<ReferralEntity> {
    const referral = await this.referralRepository.findOne({
      relations: {
        sender: true,
        receiver: true,
      },
      where: {
        receiverId,
      },
    });
    if (!referral) {
      throw new BadRequestException('Could not find the referral.');
    }
    if (referral.passedSignUp) {
      throw new BadRequestException('Referral already passed SignUp.');
    }
    referral.passedSignUp = true;
    await this.emailService.sendRewardRegisterEmail(
      referral.sender,
      referral.receiver,
      referralSignupKudosReward,
      referralSignupTokenReward,
    );
    return await this.referralRepository.save(referral);
  }

  async passedPlay(
    receiverId: string,
    referralPlayKudosReward: number,
    referralPlayTokenReward: number,
  ): Promise<ReferralEntity> {
    const referral = await this.referralRepository.findOne({
      relations: {
        sender: true,
        receiver: true,
      },
      where: {
        receiverId,
      },
    });
    if (!referral) {
      throw new BadRequestException('Could not find the referral.');
    }
    if (referral.passedPlay) {
      throw new BadRequestException('Referral already passed First Play.');
    }
    referral.passedPlay = true;
    await this.emailService.sendRewardPlayEmail(
      referral.sender,
      referral.receiver,
      referralPlayKudosReward,
      referralPlayTokenReward,
    );
    return await this.referralRepository.save(referral);
  }

  async getReferralByReceiver(receiverId: string): Promise<ReferralEntity> {
    return await this.referralRepository.findOne({
      relations: {
        sender: true,
        receiver: true,
      },
      where: {
        receiverId,
      },
    });
  }
}
