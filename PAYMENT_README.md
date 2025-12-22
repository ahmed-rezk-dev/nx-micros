# Payment Processing Integration

This project includes a complete Stripe-based payment processing system for handling course subscriptions.

## Features

- ✅ **Subscription Management**: Create, update, and cancel subscriptions
- ✅ **Payment Processing**: Secure payment intent creation and confirmation
- ✅ **Stripe Integration**: Full Stripe API integration with webhooks
- ✅ **UI Components**: Pre-built React components for payment flows
- ✅ **Multi-plan Support**: Basic, Premium, and Enterprise subscription tiers

## Setup

### 1. Install Dependencies

The Stripe SDK is already installed in the services package.

### 2. Environment Configuration

Create a `.env` file in the `apps/services/` directory with your Stripe credentials:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Stripe Price IDs for subscription plans
STRIPE_BASIC_PRICE_ID=price_basic_plan_id
STRIPE_PREMIUM_PRICE_ID=price_premium_plan_id
STRIPE_ENTERPRISE_PRICE_ID=price_enterprise_plan_id
```

### 3. Get Stripe API Keys

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the Stripe Dashboard
3. Create products and prices for your subscription plans
4. Set up webhook endpoints for payment events

### 4. Database Setup

The system uses the existing subscription and user entities. Run your database migrations to ensure the `stripe_customer_id` and `stripe_subscription_id` fields are created.

## API Endpoints

### Payment Endpoints

```
POST /payments/create-payment-intent
POST /payments/create-subscription
POST /payments/confirm-payment
GET  /payments/payment-intent/:id
POST /payments/webhooks/stripe
```

### Subscription Endpoints

```
GET  /subscriptions/plans
GET  /subscriptions/plans/:planType
GET  /subscriptions/my-subscription
GET  /subscriptions/history
POST /subscriptions
PUT  /subscriptions/:id/cancel
PUT  /subscriptions/:id/reactivate
PUT  /subscriptions/:id/plan
```

## Frontend Components

### SubscriptionPlans Component

```tsx
import { SubscriptionPlans } from '@nx-micros/ui';

function MyComponent() {
  const handleSelectPlan = (plan, planType) => {
    // Handle plan selection
    console.log('Selected:', planType, plan);
  };

  return (
    <SubscriptionPlans plans={plansData} onSelectPlan={handleSelectPlan} />
  );
}
```

### PaymentDialog Component

```tsx
import { PaymentDialog } from '@nx-micros/ui';

function PaymentButton() {
  return (
    <PaymentDialog
      plan={selectedPlan}
      planType="premium"
      onPaymentSuccess={(planType) => {
        // Handle successful payment
        console.log('Payment successful for:', planType);
      }}
      trigger={<Button>Subscribe</Button>}
    />
  );
}
```

## Subscription Plans

The system includes three default subscription tiers:

### Basic Plan ($9.99/month)

- Access to basic courses
- Community forum access
- Progress tracking
- Certificate of completion

### Premium Plan ($19.99/month)

- Access to all courses
- Priority support
- Downloadable resources
- Advanced analytics
- Team collaboration tools

### Enterprise Plan ($49.99/month)

- Everything in Premium
- Custom learning paths
- API access
- White-label solution
- Dedicated account manager
- Custom integrations

## Webhook Handling

The system automatically handles Stripe webhooks for:

- `payment_intent.succeeded`
- `invoice.payment_succeeded`
- `customer.subscription.deleted`

Configure your webhook endpoint URL to: `https://your-domain.com/payments/webhooks/stripe`

## Testing

### Stripe Test Cards

Use these test card numbers in Stripe's test mode:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Require Authentication**: `4000 0025 0000 3155`

### Testing Webhooks

Use the Stripe CLI to forward webhooks locally:

```bash
stripe listen --forward-to localhost:3000/payments/webhooks/stripe
```

## Production Deployment

1. **Switch to Live Mode**: Update environment variables with live Stripe keys
2. **Configure Webhooks**: Set up production webhook endpoints
3. **SSL Certificate**: Ensure HTTPS for webhook security
4. **Monitor Payments**: Set up Stripe dashboard monitoring
5. **Backup Strategy**: Regular database backups including payment data

## Security Considerations

- ✅ **Webhook Verification**: All webhooks are cryptographically verified
- ✅ **PCI Compliance**: Stripe handles sensitive payment data
- ✅ **API Key Security**: Keys are stored as environment variables
- ✅ **Input Validation**: All payment inputs are validated
- ✅ **Error Handling**: Comprehensive error handling and logging

## Troubleshooting

### Common Issues

1. **Webhook Signature Verification Failed**
   - Ensure `STRIPE_WEBHOOK_SECRET` is correctly set
   - Check that the raw request body is passed to the webhook handler

2. **Payment Intent Creation Failed**
   - Verify `STRIPE_SECRET_KEY` is valid
   - Check Stripe dashboard for API key permissions

3. **Subscription Creation Failed**
   - Ensure price IDs are correctly configured
   - Verify customer creation succeeded

### Logs

Check the application logs for detailed error information:

- Payment service errors
- Webhook processing status
- Subscription state changes

## Support

For issues with payment processing:

1. Check Stripe dashboard for transaction details
2. Review application logs for error messages
3. Test with Stripe's test mode first
4. Contact Stripe support for API-related issues
