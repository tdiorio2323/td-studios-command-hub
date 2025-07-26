# Stripe Integration Setup Guide

## Prerequisites

1. **Stripe Account**: Sign up at https://stripe.com
2. **Supabase Account**: For database and authentication
3. **Environment Variables**: Update your `.env` file

## Step 1: Configure Stripe Dashboard

### Create Products and Prices

1. Go to [Stripe Dashboard > Products](https://dashboard.stripe.com/products)
2. Create 4 products with monthly recurring prices:

#### Starter Plan
- **Name**: TD Studios Starter
- **Price**: $97/month
- **Price ID**: Copy this for `STRIPE_PRICE_STARTER`
- **Trial Period**: 7 days

#### Professional Plan
- **Name**: TD Studios Professional
- **Price**: $297/month
- **Price ID**: Copy this for `STRIPE_PRICE_PROFESSIONAL`
- **Trial Period**: 7 days

#### Enterprise Plan
- **Name**: TD Studios Enterprise
- **Price**: $997/month
- **Price ID**: Copy this for `STRIPE_PRICE_ENTERPRISE`
- **Trial Period**: 7 days

#### Custom Enterprise Plan
- **Name**: TD Studios Custom Enterprise
- **Price**: $2,997/month
- **Price ID**: Copy this for `STRIPE_PRICE_CUSTOM`
- **Trial Period**: 7 days

### Configure Webhook

1. Go to [Stripe Dashboard > Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Enter endpoint URL: `https://your-domain.com/api/stripe/webhook`
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
5. Copy the signing secret for `STRIPE_WEBHOOK_SECRET`

### Enable Customer Portal

1. Go to [Stripe Dashboard > Settings > Billing > Customer portal](https://dashboard.stripe.com/settings/billing/portal)
2. Enable the customer portal
3. Configure:
   - Allow customers to update payment methods
   - Allow customers to cancel subscriptions
   - Allow customers to view invoices

## Step 2: Update Environment Variables

```env
# Stripe Configuration
STRIPE_SECRET_KEY="sk_live_..." # Your secret key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..." # Your publishable key
STRIPE_WEBHOOK_SECRET="whsec_..." # Your webhook signing secret

# Stripe Price IDs (from products created above)
STRIPE_PRICE_STARTER="price_..." 
STRIPE_PRICE_PROFESSIONAL="price_..."
STRIPE_PRICE_ENTERPRISE="price_..."
STRIPE_PRICE_CUSTOM="price_..."
```

## Step 3: Set Up Database

Run the SQL schema in your Supabase SQL editor:

```sql
-- Execute the contents of src/lib/db/schema.sql
```

## Step 4: Deploy Webhook Handler

For local development with webhook testing:

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to localhost
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

## Step 5: Test the Integration

### Test Checkout Flow
1. Navigate to `/pricing`
2. Select a plan
3. Use test card: `4242 4242 4242 4242`
4. Complete checkout

### Test Subscription Management
1. Check database for subscription record
2. Visit `/dashboard/settings` to manage subscription
3. Test cancellation and reactivation

## Step 6: Production Deployment

### Vercel Deployment
1. Add environment variables in Vercel dashboard
2. Update webhook URL to production domain
3. Test with real payment methods

### Security Checklist
- [ ] Webhook endpoint validates signatures
- [ ] API routes check subscription status
- [ ] Usage limits are enforced
- [ ] Customer data is encrypted
- [ ] RLS policies are enabled in Supabase

## Step 7: Monitor and Maintain

### Stripe Dashboard
- Monitor failed payments
- Review subscription metrics
- Handle disputes promptly

### Application Monitoring
- Track API usage per customer
- Monitor conversion rates
- Analyze churn patterns

## Common Issues

### Webhook Failures
- Check webhook logs in Stripe Dashboard
- Verify signing secret is correct
- Ensure endpoint is publicly accessible

### Subscription Not Updating
- Check Supabase RLS policies
- Verify webhook events are processed
- Check for database connection issues

### Payment Failures
- Enable automatic retry rules in Stripe
- Set up email notifications
- Implement grace periods

## Support

For issues:
1. Check Stripe logs
2. Review Supabase logs
3. Contact support@tdstudios.com