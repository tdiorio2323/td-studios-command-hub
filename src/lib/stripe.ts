import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
})

export const getStripeJs = async () => {
  const { loadStripe } = await import('@stripe/stripe-js')
  return loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
}

// Pricing configuration
export const PRICING_PLANS = {
  starter: {
    name: 'Starter',
    price: 97,
    priceId: process.env.STRIPE_PRICE_STARTER!,
    features: [
      'Basic Claude AI chat (100 requests/month)',
      'GPT-4 integration (50 requests/month)',
      'Task prioritization AI',
      'Basic content generation',
      'Standard dashboard access',
      'Email support',
    ],
    limits: {
      claudeRequests: 100,
      gptRequests: 50,
      imageGeneration: 10,
      users: 3,
    },
  },
  professional: {
    name: 'Professional',
    price: 297,
    priceId: process.env.STRIPE_PRICE_PROFESSIONAL!,
    features: [
      'Unlimited Claude AI requests',
      'GPT-4 (500 requests/month)',
      'DALL-E image generation (100 images/month)',
      'Advanced workflows and automation',
      'Priority support',
      'Custom branding options',
      'Analytics dashboard',
    ],
    limits: {
      claudeRequests: -1, // unlimited
      gptRequests: 500,
      imageGeneration: 100,
      users: 25,
    },
  },
  enterprise: {
    name: 'Enterprise',
    price: 997,
    priceId: process.env.STRIPE_PRICE_ENTERPRISE!,
    features: [
      'Unlimited all AI models',
      'Custom AI workflow builder',
      'White-label dashboard options',
      'Advanced analytics and reporting',
      'Dedicated account manager',
      'API access for integrations',
      'SSO and enterprise security',
      'Custom training and onboarding',
    ],
    limits: {
      claudeRequests: -1,
      gptRequests: -1,
      imageGeneration: -1,
      users: -1,
    },
  },
  custom: {
    name: 'Custom Enterprise',
    price: 2997,
    priceId: process.env.STRIPE_PRICE_CUSTOM!,
    features: [
      'Everything in Enterprise',
      'Custom AI model training',
      'Dedicated infrastructure',
      'Full white-label rights',
      'Custom feature development',
      'SLA guarantees (99.9% uptime)',
      'On-premises deployment options',
      'Strategic consulting included',
    ],
    limits: {
      claudeRequests: -1,
      gptRequests: -1,
      imageGeneration: -1,
      users: -1,
    },
  },
}

export type PlanType = keyof typeof PRICING_PLANS