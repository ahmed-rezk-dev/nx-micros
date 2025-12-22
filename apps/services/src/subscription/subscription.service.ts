import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Subscription,
  SubscriptionPlan,
  SubscriptionStatus,
} from '../entities/subscription.entity';
import { User } from '../entities/user.entity';
import { CacheService } from '../cache/cache.service';

interface PlanDetails {
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  stripePriceId?: string;
}

@Injectable()
export class SubscriptionService {
  private readonly plans: Record<SubscriptionPlan, PlanDetails> = {
    [SubscriptionPlan.BASIC]: {
      name: 'Basic',
      price: 9.99,
      currency: 'usd',
      interval: 'month',
      features: [
        'Access to basic courses',
        'Community forum access',
        'Progress tracking',
        'Certificate of completion',
      ],
      stripePriceId: process.env.STRIPE_BASIC_PRICE_ID,
    },
    [SubscriptionPlan.PREMIUM]: {
      name: 'Premium',
      price: 19.99,
      currency: 'usd',
      interval: 'month',
      features: [
        'Access to all courses',
        'Priority support',
        'Downloadable resources',
        'Advanced analytics',
        'Team collaboration tools',
      ],
      stripePriceId: process.env.STRIPE_PREMIUM_PRICE_ID,
    },
    [SubscriptionPlan.ENTERPRISE]: {
      name: 'Enterprise',
      price: 49.99,
      currency: 'usd',
      interval: 'month',
      features: [
        'Everything in Premium',
        'Custom learning paths',
        'API access',
        'White-label solution',
        'Dedicated account manager',
        'Custom integrations',
      ],
      stripePriceId: process.env.STRIPE_ENTERPRISE_PRICE_ID,
    },
  };

  constructor(
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private cacheService: CacheService,
  ) {}

  async createSubscription(
    userId: string,
    planType: SubscriptionPlan,
    paymentMethodId?: string,
  ): Promise<{ subscription: Subscription; clientSecret?: string }> {
    // Verify user exists
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if user already has an active subscription
    const existingSubscription = await this.subscriptionRepository.findOne({
      where: { userId, status: SubscriptionStatus.ACTIVE },
    });

    if (existingSubscription) {
      throw new BadRequestException('User already has an active subscription');
    }

    const planDetails = this.plans[planType];
    if (!planDetails) {
      throw new BadRequestException('Invalid plan type');
    }

    // Create subscription record
    const subscription = this.subscriptionRepository.create({
      userId,
      planType,
      status: SubscriptionStatus.ACTIVE,
      startDate: new Date(),
      endDate: this.calculateEndDate(planType),
      autoRenew: true,
    });

    const savedSubscription =
      await this.subscriptionRepository.save(subscription);

    // Invalidate user subscription cache
    await this.cacheService.delete(`user:${userId}:subscription`);

    return { subscription: savedSubscription };
  }

  async getUserSubscription(userId: string): Promise<Subscription | null> {
    const cacheKey = `user:${userId}:subscription`;
    const cachedSubscription =
      await this.cacheService.get<Subscription>(cacheKey);

    if (cachedSubscription) {
      return cachedSubscription;
    }

    const subscription = await this.subscriptionRepository.findOne({
      where: { userId, status: SubscriptionStatus.ACTIVE },
      relations: ['user'],
    });

    if (subscription) {
      // Cache for 1 hour
      await this.cacheService.set(cacheKey, subscription, 3600);
    }

    return subscription;
  }

  async getSubscriptionById(
    id: string,
    userId?: string,
  ): Promise<Subscription> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    // If userId is provided, ensure they own this subscription
    if (userId && subscription.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return subscription;
  }

  async cancelSubscription(
    id: string,
    userId: string,
    reason?: string,
  ): Promise<Subscription> {
    const subscription = await this.getSubscriptionById(id, userId);

    if (subscription.status !== SubscriptionStatus.ACTIVE) {
      throw new BadRequestException('Subscription is not active');
    }

    subscription.status = SubscriptionStatus.CANCELLED;
    subscription.autoRenew = false;

    const updatedSubscription =
      await this.subscriptionRepository.save(subscription);

    // Invalidate cache
    await this.cacheService.delete(`user:${userId}:subscription`);

    return updatedSubscription;
  }

  async reactivateSubscription(
    id: string,
    userId: string,
  ): Promise<Subscription> {
    const subscription = await this.getSubscriptionById(id, userId);

    if (subscription.status !== SubscriptionStatus.CANCELLED) {
      throw new BadRequestException('Subscription is not cancelled');
    }

    subscription.status = SubscriptionStatus.ACTIVE;
    subscription.autoRenew = true;

    const updatedSubscription =
      await this.subscriptionRepository.save(subscription);

    // Invalidate cache
    await this.cacheService.delete(`user:${userId}:subscription`);

    return updatedSubscription;
  }

  async updateSubscriptionPlan(
    id: string,
    userId: string,
    newPlan: SubscriptionPlan,
  ): Promise<Subscription> {
    const subscription = await this.getSubscriptionById(id, userId);

    if (subscription.status !== SubscriptionStatus.ACTIVE) {
      throw new BadRequestException(
        'Subscription must be active to change plans',
      );
    }

    const oldPlan = subscription.planType;
    subscription.planType = newPlan;

    // Recalculate end date based on new plan
    if (newPlan !== oldPlan) {
      subscription.endDate = this.calculateEndDate(
        newPlan,
        subscription.startDate,
      );
    }

    const updatedSubscription =
      await this.subscriptionRepository.save(subscription);

    // Invalidate cache
    await this.cacheService.delete(`user:${userId}:subscription`);

    return updatedSubscription;
  }

  async getSubscriptionHistory(userId: string): Promise<Subscription[]> {
    return this.subscriptionRepository.find({
      where: { userId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async checkAccess(
    userId: string,
    requiredPlan?: SubscriptionPlan,
  ): Promise<boolean> {
    const subscription = await this.getUserSubscription(userId);

    if (!subscription || subscription.status !== SubscriptionStatus.ACTIVE) {
      return false;
    }

    // Check if subscription is expired
    if (subscription.endDate && new Date() > subscription.endDate) {
      return false;
    }

    if (requiredPlan) {
      const planHierarchy = {
        [SubscriptionPlan.BASIC]: 1,
        [SubscriptionPlan.PREMIUM]: 2,
        [SubscriptionPlan.ENTERPRISE]: 3,
      };

      return (
        planHierarchy[subscription.planType] >= planHierarchy[requiredPlan]
      );
    }

    return true;
  }

  getPlanDetails(planType: SubscriptionPlan): PlanDetails {
    const plan = this.plans[planType];
    if (!plan) {
      throw new BadRequestException('Invalid plan type');
    }
    return plan;
  }

  getAllPlans(): Record<SubscriptionPlan, PlanDetails> {
    return this.plans;
  }

  async getExpiringSubscriptions(
    daysAhead: number = 7,
  ): Promise<Subscription[]> {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);

    return this.subscriptionRepository
      .createQueryBuilder('subscription')
      .where('subscription.status = :status', {
        status: SubscriptionStatus.ACTIVE,
      })
      .andWhere('subscription.end_date <= :futureDate', { futureDate })
      .andWhere('subscription.auto_renew = :autoRenew', { autoRenew: true })
      .leftJoinAndSelect('subscription.user', 'user')
      .getMany();
  }

  async processExpiredSubscriptions(): Promise<void> {
    const now = new Date();

    const expiredSubscriptions = await this.subscriptionRepository
      .createQueryBuilder('subscription')
      .where('subscription.status = :status', {
        status: SubscriptionStatus.ACTIVE,
      })
      .andWhere('subscription.end_date < :now', { now })
      .getMany();

    for (const subscription of expiredSubscriptions) {
      subscription.status = SubscriptionStatus.EXPIRED;
      await this.subscriptionRepository.save(subscription);

      // Invalidate cache
      await this.cacheService.delete(
        `user:${subscription.userId}:subscription`,
      );
    }
  }

  private calculateEndDate(
    planType: SubscriptionPlan,
    startDate: Date = new Date(),
  ): Date {
    const endDate = new Date(startDate);

    // For now, all plans are monthly
    endDate.setMonth(endDate.getMonth() + 1);

    return endDate;
  }

  async handlePaymentFailed(subscriptionId: string): Promise<void> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id: subscriptionId },
    });

    if (subscription) {
      subscription.status = SubscriptionStatus.PAST_DUE;
      await this.subscriptionRepository.save(subscription);

      // Invalidate cache
      await this.cacheService.delete(
        `user:${subscription.userId}:subscription`,
      );
    }
  }

  async handleSubscriptionCancelled(subscriptionId: string): Promise<void> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id: subscriptionId },
    });

    if (subscription) {
      subscription.status = SubscriptionStatus.CANCELLED;
      subscription.autoRenew = false;
      await this.subscriptionRepository.save(subscription);

      // Invalidate cache
      await this.cacheService.delete(
        `user:${subscription.userId}:subscription`,
      );
    }
  }

  async getUserById(userId: string): Promise<any> {
    return this.userRepository.findOne({ where: { id: userId } });
  }

  async updateUserStripeCustomerId(
    userId: string,
    stripeCustomerId: string,
  ): Promise<void> {
    await this.userRepository.update(userId, { stripeCustomerId });
  }

  async updateSubscriptionWithStripeId(
    subscriptionId: string,
    stripeSubscriptionId: string,
  ): Promise<void> {
    await this.subscriptionRepository.update(subscriptionId, {
      stripeSubscriptionId,
    });
  }

  async handlePaymentSucceeded(
    subscriptionId: string,
    paymentDate: Date,
  ): Promise<void> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id: subscriptionId },
    });

    if (subscription) {
      subscription.status = SubscriptionStatus.ACTIVE;
      subscription.lastPaymentDate = paymentDate;
      await this.subscriptionRepository.save(subscription);

      // Invalidate cache
      await this.cacheService.delete(
        `user:${subscription.userId}:subscription`,
      );
    }
  }

  async handleInvoicePaymentSucceeded(
    stripeSubscriptionId: string,
    paymentDate: Date,
  ): Promise<void> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { stripeSubscriptionId },
    });

    if (subscription) {
      subscription.lastPaymentDate = paymentDate;
      await this.subscriptionRepository.save(subscription);

      // Invalidate cache
      await this.cacheService.delete(
        `user:${subscription.userId}:subscription`,
      );
    }
  }

  async handleStripeSubscriptionCancelled(
    stripeSubscriptionId: string,
    cancelledAt: Date,
  ): Promise<void> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { stripeSubscriptionId },
    });

    if (subscription) {
      subscription.status = SubscriptionStatus.CANCELLED;
      subscription.autoRenew = false;
      await this.subscriptionRepository.save(subscription);

      // Invalidate cache
      await this.cacheService.delete(
        `user:${subscription.userId}:subscription`,
      );
    }
  }
}
