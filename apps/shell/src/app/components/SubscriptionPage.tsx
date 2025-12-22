import { SubscriptionPlans, type SubscriptionPlan } from '@nx-micros/ui';
import { CreditCard } from 'lucide-react';

// Mock data for demonstration
const mockPlans: Record<string, SubscriptionPlan> = {
  basic: {
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
  },
  premium: {
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
  },
  enterprise: {
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
  },
};

export function SubscriptionPage() {
  const handleSelectPlan = (plan: SubscriptionPlan, planType: string) => {
    console.log(`Selected plan: ${planType}`, plan);
    // In a real implementation, this would navigate to payment processing
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
              Choose Your Plan
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Unlock premium features and accelerate your learning journey
            </p>
          </div>

          {/* Subscription Plans */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-center">
              Available Plans
            </h2>
            <SubscriptionPlans
              plans={mockPlans}
              onSelectPlan={handleSelectPlan}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubscriptionPage;
