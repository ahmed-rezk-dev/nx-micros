import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import {
  SubscriptionPlan,
  SubscriptionStatus,
} from '../entities/subscription.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get('plans')
  getPlans() {
    return {
      plans: this.subscriptionService.getAllPlans(),
      message: 'Available subscription plans',
    };
  }

  @Get('plans/:planType')
  getPlanDetails(@Param('planType') planType: SubscriptionPlan) {
    try {
      const plan = this.subscriptionService.getPlanDetails(planType);
      return {
        plan,
        message: 'Plan details retrieved successfully',
      };
    } catch (error) {
      throw new BadRequestException('Invalid plan type');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-subscription')
  async getMySubscription(@Request() req) {
    const userId = req.user.id;
    const subscription =
      await this.subscriptionService.getUserSubscription(userId);

    if (!subscription) {
      return {
        subscription: null,
        message: 'No active subscription found',
        hasAccess: false,
      };
    }

    return {
      subscription,
      message: 'Subscription retrieved successfully',
      hasAccess: subscription.canAccessContent(),
      daysUntilExpiry: subscription.daysUntilExpiry(),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('history')
  async getSubscriptionHistory(@Request() req) {
    const userId = req.user.id;
    const subscriptions =
      await this.subscriptionService.getSubscriptionHistory(userId);

    return {
      subscriptions,
      total: subscriptions.length,
      message: 'Subscription history retrieved successfully',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createSubscription(
    @Request() req,
    @Body() body: { planType: SubscriptionPlan; paymentMethodId?: string },
  ) {
    const userId = req.user.id;
    const { planType, paymentMethodId } = body;

    const result = await this.subscriptionService.createSubscription(
      userId,
      planType,
      paymentMethodId,
    );

    return {
      ...result,
      message: 'Subscription created successfully',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getSubscription(@Param('id') id: string, @Request() req) {
    const userId = req.user.id;
    const subscription = await this.subscriptionService.getSubscriptionById(
      id,
      userId,
    );

    return {
      subscription,
      message: 'Subscription retrieved successfully',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/cancel')
  async cancelSubscription(
    @Param('id') id: string,
    @Request() req,
    @Body() body?: { reason?: string },
  ) {
    const userId = req.user.id;
    const subscription = await this.subscriptionService.cancelSubscription(
      id,
      userId,
      body?.reason,
    );

    return {
      subscription,
      message: 'Subscription cancelled successfully',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/reactivate')
  async reactivateSubscription(@Param('id') id: string, @Request() req) {
    const userId = req.user.id;
    const subscription = await this.subscriptionService.reactivateSubscription(
      id,
      userId,
    );

    return {
      subscription,
      message: 'Subscription reactivated successfully',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/plan')
  async updatePlan(
    @Param('id') id: string,
    @Request() req,
    @Body() body: { planType: SubscriptionPlan },
  ) {
    const userId = req.user.id;
    const { planType } = body;

    const subscription = await this.subscriptionService.updateSubscriptionPlan(
      id,
      userId,
      planType,
    );

    return {
      subscription,
      message: 'Subscription plan updated successfully',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('check-access')
  async checkAccess(
    @Request() req,
    @Body() body?: { requiredPlan?: SubscriptionPlan },
  ) {
    const userId = req.user.id;
    const hasAccess = await this.subscriptionService.checkAccess(
      userId,
      body?.requiredPlan,
    );

    const subscription =
      await this.subscriptionService.getUserSubscription(userId);

    return {
      hasAccess,
      subscription,
      requiredPlan: body?.requiredPlan,
      message: hasAccess
        ? 'Access granted'
        : 'Access denied - subscription required',
    };
  }

  // Admin endpoints (would need admin guard in real implementation)
  @Get('admin/expiring')
  async getExpiringSubscriptions(@Query('days') days?: string) {
    const daysAhead = days ? parseInt(days, 10) : 7;
    const subscriptions =
      await this.subscriptionService.getExpiringSubscriptions(daysAhead);

    return {
      subscriptions,
      total: subscriptions.length,
      message: `Found ${subscriptions.length} subscriptions expiring in ${daysAhead} days`,
    };
  }

  @Post('admin/process-expired')
  async processExpiredSubscriptions() {
    await this.subscriptionService.processExpiredSubscriptions();

    return {
      message: 'Expired subscriptions processed successfully',
    };
  }

  // Webhook endpoints for Stripe integration
  @Post('webhooks/payment-succeeded')
  async handlePaymentSucceeded(
    @Body() body: { subscriptionId: string; paymentDate: string },
  ) {
    const { subscriptionId, paymentDate } = body;
    await this.subscriptionService.handlePaymentSucceeded(
      subscriptionId,
      new Date(paymentDate),
    );

    return { message: 'Payment succeeded event processed' };
  }

  @Post('webhooks/payment-failed')
  async handlePaymentFailed(@Body() body: { subscriptionId: string }) {
    const { subscriptionId } = body;
    await this.subscriptionService.handlePaymentFailed(subscriptionId);

    return { message: 'Payment failed event processed' };
  }

  @Post('webhooks/subscription-cancelled')
  async handleSubscriptionCancelled(
    @Body() body: { subscriptionId: string; cancelledAt: string },
  ) {
    const { subscriptionId, cancelledAt } = body;
    await this.subscriptionService.handleSubscriptionCancelled(
      subscriptionId,
      new Date(cancelledAt),
    );

    return { message: 'Subscription cancelled event processed' };
  }
}
