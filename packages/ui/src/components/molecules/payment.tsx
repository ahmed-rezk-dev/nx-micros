import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@nx-micros/ui';
import { Button } from '@nx-micros/ui';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@nx-micros/ui';
import { Badge } from '@nx-micros/ui';
import { Separator } from '@nx-micros/ui';
import { CreditCard, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export interface SubscriptionPlan {
  name: string;
  price: number;
  currency: string;
  interval: string;
  features: string[];
  stripePriceId?: string;
}

export interface PaymentDialogProps {
  plan: SubscriptionPlan;
  planType: string;
  trigger: React.ReactNode;
  onPaymentSuccess?: (planType: string) => void;
  onPaymentError?: (error: string) => void;
}

export function PaymentDialog({
  plan,
  planType,
  trigger,
  onPaymentSuccess,
  onPaymentError,
}: PaymentDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<
    'idle' | 'processing' | 'success' | 'error'
  >('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePayment = async () => {
    setPaymentStatus('processing');
    setErrorMessage(null);

    try {
      // Simulate payment processing
      // In a real implementation, this would integrate with Stripe Elements
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setPaymentStatus('success');
      onPaymentSuccess?.(planType);
    } catch (error: any) {
      const message = error.message || 'Payment failed';
      setPaymentStatus('error');
      setErrorMessage(message);
      onPaymentError?.(message);
    }
  };

  const resetDialog = () => {
    setPaymentStatus('idle');
    setErrorMessage(null);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Subscribe to {plan.name}
          </DialogTitle>
          <DialogDescription>
            Complete your subscription to access premium features
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Plan Details */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{plan.name} Plan</CardTitle>
                <Badge variant="secondary">
                  ${plan.price}/{plan.interval}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Separator />

          {/* Payment Status */}
          {paymentStatus === 'idle' && (
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                You will be charged ${plan.price} for the first {plan.interval}.
                Subscription will automatically renew.
              </p>
              <Button onClick={handlePayment} className="w-full">
                Subscribe for ${plan.price}/{plan.interval}
              </Button>
            </div>
          )}

          {paymentStatus === 'processing' && (
            <div className="text-center space-y-4">
              <Loader2 className="w-8 h-8 animate-spin mx-auto" />
              <p className="text-sm text-muted-foreground">
                Processing your payment...
              </p>
            </div>
          )}

          {paymentStatus === 'success' && (
            <div className="text-center space-y-4">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
              <div>
                <h3 className="text-lg font-semibold">Payment Successful!</h3>
                <p className="text-sm text-muted-foreground">
                  Welcome to {plan.name}! Your subscription is now active.
                </p>
              </div>
              <Button onClick={resetDialog} className="w-full">
                Continue Learning
              </Button>
            </div>
          )}

          {paymentStatus === 'error' && (
            <div className="text-center space-y-4">
              <AlertCircle className="w-12 h-12 text-red-600 mx-auto" />
              <div>
                <h3 className="text-lg font-semibold">Payment Failed</h3>
                <p className="text-sm text-muted-foreground">
                  {errorMessage || 'Something went wrong. Please try again.'}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setPaymentStatus('idle')}
                  className="flex-1"
                >
                  Try Again
                </Button>
                <Button
                  variant="outline"
                  onClick={resetDialog}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export interface SubscriptionPlansProps {
  plans: Record<string, SubscriptionPlan>;
  onSelectPlan?: (plan: SubscriptionPlan, planType: string) => void;
  isLoading?: boolean;
}

export function SubscriptionPlans({
  plans,
  onSelectPlan,
  isLoading = false,
}: SubscriptionPlansProps) {
  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-6 bg-muted rounded animate-pulse" />
              <div className="h-4 bg-muted rounded w-2/3 animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded animate-pulse" />
                <div className="h-4 bg-muted rounded animate-pulse" />
                <div className="h-4 bg-muted rounded animate-pulse" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Object.entries(plans).map(([planType, plan]) => (
        <Card key={planType} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{plan.name}</CardTitle>
              <Badge variant={planType === 'premium' ? 'default' : 'secondary'}>
                ${plan.price}/{plan.interval}
              </Badge>
            </div>
            <CardDescription>
              Perfect for{' '}
              {planType === 'basic'
                ? 'getting started'
                : planType === 'premium'
                  ? 'serious learners'
                  : 'organizations'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 mb-6">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
            <PaymentDialog
              plan={plan}
              planType={planType}
              onPaymentSuccess={
                onSelectPlan
                  ? (planType) => onSelectPlan(plan, planType)
                  : undefined
              }
              trigger={<Button className="w-full">Choose {plan.name}</Button>}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
