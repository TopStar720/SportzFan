import Stripe from 'stripe';
import { Repository } from 'typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { PaymentMethod } from 'src/common/models/base';
import { UserEntity } from '../user/entities/user.entity';
import { getFromDto } from 'src/common/utils/repository.util';
import { PaymentHistoryEntity } from './entities/payment-history.entity';
import { PlatformPaymentHistoryEntity } from './entities/platform-payment-history.entity';
import { PlatformUserEntity } from './entities/platform-user.entity';
import { AddPlatformUserDto } from './dtos/platform-user.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(PaymentHistoryEntity)
    private paymentHistoryRepository: Repository<PaymentHistoryEntity>,
    @InjectRepository(PlatformPaymentHistoryEntity)
    private platformPaymentHistoryRepository: Repository<PlatformPaymentHistoryEntity>,
    @InjectRepository(PlatformUserEntity)
    private platformUserRepository: Repository<PlatformUserEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  stripe = null;

  async createCustomer(name: string, email: string): Promise<string> {
    this.initStripe();
    const customer = await this.stripe.customers.create({ name, email });
    return customer.id;
  }

  async createPaymentIntent(
    amount: number,
    customer: string,
    confirm = false,
    receiptEmail: string,
  ): Promise<[string, string]> {
    this.initStripe();
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: amount,
        currency: 'aud',
        customer,
        confirm,
        receipt_email: receiptEmail,
      });
      return [paymentIntent.id, paymentIntent.client_secret];
    } catch (e) {
      throw e;
    }
  }

  async createPlatformPaymentLog(
    paymentIntentId: string,
    amount: number,
    paymentMethod: PaymentMethod,
  ): Promise<any> {
    const data = {
      paymentIntentId,
      amount,
      paymentMethod,
    };

    const log = getFromDto<PlatformPaymentHistoryEntity>(
      data,
      new PlatformPaymentHistoryEntity(),
    );
    return this.platformPaymentHistoryRepository.save(log);
  }

  async createPaymentLog(
    userId: string,
    paymentIntentId: string,
    amount: number,
    tokenId: string,
    tokenAmount: number,
    paymentMethod: PaymentMethod,
  ): Promise<any> {
    const data = {
      userId,
      paymentIntentId,
      amount,
      tokenId,
      tokenAmount,
      paymentMethod,
    };

    const log = getFromDto<PaymentHistoryEntity>(
      data,
      new PaymentHistoryEntity(),
    );
    return this.paymentHistoryRepository.save(log);
  }

  async updateBalance(
    userId: string,
    tokenId: string,
    amount: number,
  ): Promise<any> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    user.tokenAmount =
      parseFloat(`${user.tokenAmount}`) + parseFloat(`${amount}`);
    return await this.userRepository.save(user);
  }

  async findLogByPaymentId(
    paymentIntentId: string,
  ): Promise<PaymentHistoryEntity> {
    return this.paymentHistoryRepository.findOne({
      relations: ['user'],
      where: { paymentIntentId },
    });
  }

  async findPlatformLogByPaymentId(
    paymentIntentId: string,
  ): Promise<PlatformPaymentHistoryEntity> {
    return this.platformPaymentHistoryRepository.findOne({
      where: { paymentIntentId },
    });
  }

  async findPlatformLogById(id: string): Promise<PlatformPaymentHistoryEntity> {
    return this.platformPaymentHistoryRepository.findOne({
      where: { id },
    });
  }

  async findLogById(id: string): Promise<PaymentHistoryEntity> {
    return this.paymentHistoryRepository.findOne({
      relations: ['user'],
      where: { id },
    });
  }

  async isLogPaidByPaymentId(paymentIntentId: string): Promise<boolean> {
    const log = await this.findLogByPaymentId(paymentIntentId);
    return Boolean(log.paidDate);
  }

  async setPlatformLogPaidByPaymentId(
    paymentId: string,
    paymentMethod: PaymentMethod,
  ): Promise<PlatformPaymentHistoryEntity> {
    const log = await this.findPlatformLogByPaymentId(paymentId);

    log.paidDate = new Date();
    log.paymentMethod = paymentMethod;

    return this.platformPaymentHistoryRepository.save(log);
  }

  async setLogPaidByPaymentId(
    paymentId: string,
    paymentMethod: PaymentMethod,
  ): Promise<PaymentHistoryEntity> {
    const log = await this.findLogByPaymentId(paymentId);

    log.paidDate = new Date();
    log.paymentMethod = paymentMethod;

    return this.paymentHistoryRepository.save(log);
  }

  createStripeEvent(signature: string, requestBody: any): any {
    this.initStripe();
    return this.stripe.webhooks.constructEvent(
      requestBody,
      signature,
      process.env.STRIPE_WEB_HOOK_SECRET,
    );
  }

  validateStripeAccount(account: any): boolean {
    return account.charges_enabled && account.payouts_enabled;
  }

  retrievePayment(paymentIntentId: string): Promise<any> {
    return this.stripe.paymentIntents.retrieve(paymentIntentId);
  }

  private initStripe() {
    if (!this.stripe) {
      this.stripe = new Stripe(process.env.STRIPE_SK, {
        apiVersion: '2022-08-01',
        typescript: true,
      });
    }
  }

  findPlatformUserByEmail(
    email: string,
    findRemoved = false,
  ): Promise<PlatformUserEntity> {
    return this.platformUserRepository.findOne({
      withDeleted: findRemoved,
      where: { email },
    });
  }

  async updatePlatformUserStripeCustomerId(
    id: string,
    stripeCustomerId: string,
  ) {
    const platformUser = await this.platformUserRepository.findOneBy({
      id,
    });
    if (!platformUser) {
      throw new BadRequestException('Could not find platformUser');
    }
    platformUser.stripeCustomerId = stripeCustomerId;
    return this.platformUserRepository.save(platformUser);
  }

  async addPlatformUser(dto: AddPlatformUserDto): Promise<PlatformUserEntity> {
    try {
      const platformUser = getFromDto<UserEntity>(
        dto,
        new PlatformUserEntity(),
      );
      return await this.platformUserRepository.save(platformUser);
    } catch (e) {
      return null;
    }
  }
}
