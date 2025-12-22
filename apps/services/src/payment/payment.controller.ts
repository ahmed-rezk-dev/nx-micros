import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Request,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SubscriptionService } from '../subscription/subscription.service';

@Controller('payments')
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);

  constructor(
    private readonly paymentService: PaymentService,
    private readonly subscriptionService: SubscriptionService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('create-payment-intent')
  async createPaymentIntent(
    @Request() req,
    @Body() body: { amount: number; currency?: string; planType?: string },
  ) {
    const userId = req.user.id;
    const { amount, currency = 'usd', planType } = body;

    if (!amount || amount <= 0) {
      throw new BadRequestException('Valid amount is required');
    }

    try {
      const paymentIntent = await this.paymentService.createPaymentIntent(
        amount,
        currency,
        {
          userId,
          planType,
        },
      );

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        message: 'Payment intent created successfully',
      };
    } catch (error) {
      this.logger.error('Failed to create payment intent', error);
      throw new BadRequestException('Failed to create payment intent');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('create-subscription')
  async createSubscription(
    @Request() req,
    @Body() body: { planType: string; paymentMethodId?: string },
  ) {
    const userId = req.user.id;
    const { planType, paymentMethodId } = body;

    try {
      // Get plan details from subscription service
      const planDetails = this.subscriptionService.getPlanDetails(
        planType as any,
      );

      // Create or get Stripe customer
      const user = await this.subscriptionService.getUserById(userId);
      let customerId = user.stripeCustomerId;

      if (!customerId) {
        const customer = await this.paymentService.createCustomer(
          user.email,
          `${user.firstName} ${user.lastName}`,
          { userId },
        );
        customerId = customer.id;

        // Update user with Stripe customer ID
        await this.subscriptionService.updateUserStripeCustomerId(
          userId,
          customerId,
        );
      }

      // Create subscription in our system first
      const subscription = await this.subscriptionService.createSubscription(
        userId,
        planType as any,
        paymentMethodId,
      );

      // Create Stripe subscription
      const stripeSubscription = await this.paymentService.createSubscription(
        customerId,
        planDetails.stripePriceId!,
        {
          subscriptionId: subscription.id,
          userId,
        },
      );

      // Update our subscription with Stripe ID
      await this.subscriptionService.updateSubscriptionWithStripeId(
        subscription.id,
        stripeSubscription.id,
      );

      return {
        subscription: subscription,
        clientSecret: (stripeSubscription.latest_invoice as any)?.payment_intent
          ?.client_secret,
        message: 'Subscription created successfully',
      };
    } catch (error) {
      this.logger.error('Failed to create subscription', error);
      throw new BadRequestException('Failed to create subscription');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('confirm-payment')
  async confirmPayment(
    @Request() req,
    @Body() body: { paymentIntentId: string; paymentMethodId?: string },
  ) {
    const { paymentIntentId, paymentMethodId } = body;

    try {
      const paymentIntent = await this.paymentService.confirmPaymentIntent(
        paymentIntentId,
        paymentMethodId,
      );

      return {
        paymentIntent,
        message: 'Payment confirmed successfully',
      };
    } catch (error) {
      this.logger.error('Failed to confirm payment', error);
      throw new BadRequestException('Failed to confirm payment');
    }
  }

  @Get('payment-intent/:id')
  async getPaymentIntent(@Param('id') paymentIntentId: string) {
    try {
      const paymentIntent =
        await this.paymentService.getPaymentIntent(paymentIntentId);
      return {
        paymentIntent,
        message: 'Payment intent retrieved successfully',
      };
    } catch (error) {
      this.logger.error('Failed to retrieve payment intent', error);
      throw new BadRequestException('Payment intent not found');
    }
  }

  @Post('webhooks/stripe')
  async handleStripeWebhook(@Body() rawBody: Buffer, @Request() req) {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!endpointSecret) {
      throw new BadRequestException('Webhook secret not configured');
    }

    try {
      const event = this.paymentService.constructEvent(
        rawBody,
        sig,
        endpointSecret,
      );

      // Handle the event
      switch (event.type) {
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object as any;
          await this.handlePaymentIntentSucceeded(paymentIntent);
          break;

        case 'invoice.payment_succeeded':
          const invoice = event.data.object as any;
          await this.handleInvoicePaymentSucceeded(invoice);
          break;

        case 'customer.subscription.deleted':
          const subscription = event.data.object as any;
          await this.subscriptionService.handleStripeSubscriptionCancelled(
            subscription.id,
            new Date(),
          );
          break;

        default:
          this.logger.log(`Unhandled event type: ${event.type}`);
      }

      return { received: true };
    } catch (error) {
      this.logger.error('Webhook signature verification failed', error);
      throw new BadRequestException('Webhook signature verification failed');
    }
  }

  private async handlePaymentIntentSucceeded(paymentIntent: any) {
    this.logger.log(`Payment intent succeeded: ${paymentIntent.id}`);

    // Find subscription by payment intent metadata
    const metadata = paymentIntent.metadata;
    if (metadata.subscriptionId) {
      await this.subscriptionService.handlePaymentSucceeded(
        metadata.subscriptionId,
        new Date(),
      );
    }
  }

  private async handleInvoicePaymentSucceeded(invoice: any) {
    this.logger.log(`Invoice payment succeeded: ${invoice.id}`);

    // Update subscription payment date
    if (invoice.subscription) {
      await this.subscriptionService.handleInvoicePaymentSucceeded(
        invoice.subscription,
        new Date(),
      );
    }
  }

  private async handleSubscriptionCancelled(stripeSubscription: any) {
    this.logger.log(`Subscription cancelled: ${stripeSubscription.id}`);

    await this.subscriptionService.handleStripeSubscriptionCancelled(
      stripeSubscription.id,
      new Date(),
    );
  }
}
