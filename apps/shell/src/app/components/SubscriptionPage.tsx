import { useState, useEffect } from 'react';
import { SubscriptionPlans, type SubscriptionPlan } from '@nx-micros/ui';
import { CreditCard, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../stores';
import { apiClient } from '../../api';

export function SubscriptionPage() {
  const { user } = useAuthStore();
  const [plans, setPlans] = useState<Record<string, SubscriptionPlan>>({});
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const response = (await apiClient.get('/subscriptions/plans')) as any;
      setPlans(response.data.plans);
    } catch (error) {
      console.error('Failed to load plans:', error);
      // Fallback to mock data if API fails
      setPlans({
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
      });
    } finally {
      setIsLoadingPlans(false);
    }
  };

  const handleSelectPlan = async (plan: SubscriptionPlan, planType: string) => {
    try {
      // Create subscription via API
      const response = (await apiClient.post('/payments/create-subscription', {
        planType,
      })) as any;

      if (response.data.clientSecret) {
        // Handle payment success
        console.log('Subscription created successfully:', response.data);
        // Refresh subscription data
        await loadPlans();
      }
    } catch (error: any) {
      console.error('Failed to create subscription:', error);
      // Handle error (could show toast notification)
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
          <h2 className="text-2xl font-bold">Authentication Required</h2>
          <p className="text-muted-foreground">
            Please sign in to view subscription plans.
          </p>
        </div>
      </div>
    );
  }

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
              plans={plans}
              isLoading={isLoadingPlans}
              onSelectPlan={handleSelectPlan}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubscriptionPage;
