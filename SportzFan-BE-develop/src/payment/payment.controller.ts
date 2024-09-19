import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import {
  PaymentMethod,
  TransactionStatus,
  TransactionType,
  UserRole,
} from 'src/common/models/base';
import { StripePaymentIntentDto } from './dtos/stripe-payment-intent.dto';
import { PaymentService } from './payment.service';
import { UserService } from 'src/user/user.service';
import { SuccessResponse } from 'src/common/models/success-response';
import { sleep } from '../common/utils/common.util';
import { VerifyPaymentDto } from './dtos/verify-payment.dto';
import { PaymentHistoryEntity } from './entities/payment-history.entity';
import { PayWithCardDto } from './dtos/pay-with-card.dto';
import { TokenService } from 'src/token/token.service';
import { TransactionService } from '../transaction/transaction.service';
import { SocketService } from '../socket/socket.service';
import {
  NotificationCategoryType,
  NotificationType,
} from '../notification/dtos/notification.dto';
import { PlatformPaymentHistoryEntity } from './entities/platform-payment-history.entity';

@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private userService: UserService,
    private tokenService: TokenService,
    private transactionService: TransactionService,
    private socketService: SocketService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Fan])
  @Post('pay-with-card')
  @ApiOkResponse({ type: StripePaymentIntentDto })
  async payWithCard(
    @Request() req,
    @Body() body: PayWithCardDto,
  ): Promise<any> {
    const userId = req.user.id;
    const stripeCustomerId = await this.validateCustomer(userId);
    const amount = Math.round(body.amount * 100); // Convert to cent

    const userEntity = await this.userService.findUserById(userId);
    const [paymentIntentId, paymentClientSecret] =
      await this.paymentService.createPaymentIntent(
        amount,
        stripeCustomerId,
        false,
        userEntity.email,
      );
    // Get Token Price
    const token = await this.tokenService.getOneToken(userEntity.tokenId);
    const tokenAmount = body.amount / token.price;
    const log = await this.paymentService.createPaymentLog(
      userId,
      paymentIntentId,
      body.amount,
      token.id,
      tokenAmount,
      PaymentMethod.CreditCard,
    );

    return {
      logId: log.id,
      clientSecret: paymentClientSecret,
      publishableKey: process.env.STRIPE_PK,
    };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Fan])
  @Post('verify')
  async verifyCreditCardPayment(
    @Body() payload: VerifyPaymentDto,
  ): Promise<PaymentHistoryEntity> {
    let log = await this.paymentService.findLogById(payload.logId);
    let paymentIntent;
    try {
      paymentIntent = await this.paymentService.retrievePayment(
        log.paymentIntentId,
      );
    } catch (e) {
      throw new BadRequestException(
        'Error occurred while fetching payment intent from stripe service.',
      );
    }
    if (!paymentIntent) {
      throw new BadRequestException(
        'Failed to fetch payment intent from stripe service.',
      );
    }
    if (paymentIntent.error) {
      throw new BadRequestException(paymentIntent.error.message);
    }
    if (paymentIntent.status !== 'succeeded') {
      throw new BadRequestException('Failed to proceed with payment.');
    }
    if (!log.paidDate) {
      log = await this.paymentService.setLogPaidByPaymentId(
        paymentIntent.id,
        PaymentMethod.CreditCard,
      );
      const transactionEntity = await this.transactionService.createTransaction(
        {
          receiverId: log.userId,
          teamId: log.user.teamId,
          type: TransactionType.Deposit,
          uniqueId: log.id,
          status: TransactionStatus.Pending,
          kudosAmount: 0,
          tokenAmount: log.tokenAmount,
        },
      );
      this.socketService.message$.next({
        userId: log.userId,
        type: NotificationType.Deposit,
        category: NotificationCategoryType.TokenDeposit,
        section: TransactionType.Deposit,
        uniqueId: transactionEntity.id,
        content: `${log.tokenAmount}`,
      });
      // Add token amount to balance table.
      await this.paymentService.updateBalance(
        log.userId,
        log.tokenId,
        log.tokenAmount,
      );
    }
    return log;
  }

  @Post('platform-pay-with-card')
  @ApiOkResponse({ type: StripePaymentIntentDto })
  async platformPayWithCard(
    @Request() req,
    @Body() body: PayWithCardDto,
  ): Promise<any> {
    const stripeCustomerId = await this.validatePlatformCustomer(
      body.email,
      body.name,
    );
    const amount = Math.round(body.amount * 100); // Convert to cent

    const [paymentIntentId, paymentClientSecret] =
      await this.paymentService.createPaymentIntent(
        amount,
        stripeCustomerId,
        false,
        body.email,
      );
    const log = await this.paymentService.createPlatformPaymentLog(
      paymentIntentId,
      body.amount,
      PaymentMethod.CreditCard,
    );

    return {
      logId: log.id,
      clientSecret: paymentClientSecret,
      publishableKey: process.env.STRIPE_PK,
    };
  }

  @Post('platform-verify')
  async verifyPlatformCreditCardPayment(
    @Body() payload: VerifyPaymentDto,
  ): Promise<PlatformPaymentHistoryEntity> {
    let log = await this.paymentService.findPlatformLogById(payload.logId);
    let paymentIntent;
    try {
      paymentIntent = await this.paymentService.retrievePayment(
        log.paymentIntentId,
      );
    } catch (e) {
      throw new BadRequestException(
        'Error occurred while fetching payment intent from stripe service.',
      );
    }
    if (!paymentIntent) {
      throw new BadRequestException(
        'Failed to fetch payment intent from stripe service.',
      );
    }
    if (paymentIntent.error) {
      throw new BadRequestException(paymentIntent.error.message);
    }
    if (paymentIntent.status !== 'succeeded') {
      throw new BadRequestException('Failed to proceed with payment.');
    }
    if (!log.paidDate) {
      log = await this.paymentService.setPlatformLogPaidByPaymentId(
        paymentIntent.id,
        PaymentMethod.CreditCard,
      );
    }
    return log;
  }

  @Post('stripe-webhook')
  async stripeWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() request: any,
  ) {
    const event = this.paymentService.createStripeEvent(
      signature,
      request.rawBody,
    );
    const eventType = event.type;
    switch (eventType) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;
        const log = await this.paymentService.findLogByPaymentId(
          paymentIntentId,
        );
        if (!log) {
          return new SuccessResponse(true, 'Could not find the log.');
        }

        await sleep(2000);
        const paid = await this.paymentService.isLogPaidByPaymentId(
          paymentIntentId,
        );
        if (!paid) {
          const log = await this.paymentService.setLogPaidByPaymentId(
            paymentIntentId,
            PaymentMethod.CreditCard,
          );
          // Add token amount to balance table.
          await this.paymentService.updateBalance(
            log.userId,
            log.tokenId,
            log.tokenAmount,
          );
        }
        break;
      }
    }
    return new SuccessResponse(true);
  }

  private async createStripeCustomerIfNotExists(
    userId: string,
  ): Promise<string> {
    const user = await this.userService.findUserById(userId);
    if (!user.stripeCustomerId) {
      user.stripeCustomerId = await this.paymentService.createCustomer(
        `${user.firstName} ${user.lastName}`,
        user.email,
      );
      await this.userService.updateUserStripeCustomerId(
        userId,
        user.stripeCustomerId,
      );
    }
    return user.stripeCustomerId;
  }

  private async createStripePlatformCustomerIfNotExists(
    email: string,
    name: string,
  ): Promise<string> {
    const platformUser = await this.paymentService.findPlatformUserByEmail(
      email,
    );
    if (platformUser) {
      if (platformUser.stripeCustomerId) {
        return platformUser.stripeCustomerId;
      } else {
        const stripeCustomerId = await this.paymentService.createCustomer(
          platformUser.name,
          platformUser.email,
        );
        await this.paymentService.updatePlatformUserStripeCustomerId(
          platformUser.id,
          stripeCustomerId,
        );
        return stripeCustomerId;
      }
    } else {
      const stripeCustomerId = await this.paymentService.createCustomer(
        name,
        email,
      );
      await this.paymentService.addPlatformUser({
        email,
        name,
        stripeCustomerId,
      });
      return stripeCustomerId;
    }
  }

  private async validatePlatformCustomer(
    email: string,
    name: string,
  ): Promise<string> {
    return await this.createStripePlatformCustomerIfNotExists(email, name);
  }

  private async validateCustomer(userId: string): Promise<string> {
    return await this.createStripeCustomerIfNotExists(userId);
  }
}
