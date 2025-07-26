import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { PRICING_PLANS } from '@/lib/stripe'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function checkSubscriptionAccess(
  userId: string,
  requiredFeature?: string,
  service?: 'claude' | 'gpt' | 'dalle'
) {
  try {
    // Get user's active subscription
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single()

    if (subError || !subscription) {
      return {
        hasAccess: false,
        error: 'No active subscription found',
        requiresUpgrade: true,
      }
    }

    // Determine plan type
    const planName = subscription.plan_name.toLowerCase()
    let planType: keyof typeof PRICING_PLANS = 'starter'
    
    if (planName.includes('professional')) planType = 'professional'
    else if (planName.includes('enterprise') && !planName.includes('custom')) planType = 'enterprise'
    else if (planName.includes('custom')) planType = 'custom'

    const plan = PRICING_PLANS[planType]

    // Check feature access
    if (requiredFeature) {
      const hasFeature = plan.features.some(f => 
        f.toLowerCase().includes(requiredFeature.toLowerCase())
      )
      
      if (!hasFeature) {
        return {
          hasAccess: false,
          error: `Feature "${requiredFeature}" not available in ${plan.name} plan`,
          requiresUpgrade: true,
          currentPlan: planType,
        }
      }
    }

    // Check usage limits
    if (service) {
      const limitKey = `${service}Requests` as keyof typeof plan.limits
      const limit = plan.limits[limitKey]
      
      // Get current usage
      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      startOfMonth.setHours(0, 0, 0, 0)

      const { data: usage, error: usageError } = await supabase
        .from('usage_logs')
        .select('id')
        .eq('user_id', userId)
        .eq('service', service)
        .gte('created_at', startOfMonth.toISOString())

      if (!usageError && usage) {
        const currentUsage = usage.length
        
        if (limit !== -1 && currentUsage >= limit) {
          return {
            hasAccess: false,
            error: `Monthly ${service} limit reached (${currentUsage}/${limit})`,
            requiresUpgrade: true,
            currentPlan: planType,
            usage: {
              current: currentUsage,
              limit: limit,
            },
          }
        }

        // Log the usage
        await supabase
          .from('usage_logs')
          .insert({
            user_id: userId,
            service: service,
            endpoint: 'api_call',
            tokens_used: 0, // You can calculate actual tokens
            cost_cents: 0, // You can calculate actual cost
          })
      }
    }

    return {
      hasAccess: true,
      currentPlan: planType,
      subscription: subscription,
    }
  } catch (error) {
    console.error('Subscription check error:', error)
    return {
      hasAccess: false,
      error: 'Failed to verify subscription',
    }
  }
}

// Middleware function for API routes
export function withSubscription(
  handler: Function,
  options?: {
    requiredFeature?: string
    service?: 'claude' | 'gpt' | 'dalle'
  }
) {
  return async (req: Request, ...args: any[]) => {
    // Get user ID from auth (you'll need to implement this)
    const userId = 'current-user-id' // Replace with actual auth check
    
    const access = await checkSubscriptionAccess(
      userId,
      options?.requiredFeature,
      options?.service
    )

    if (!access.hasAccess) {
      return NextResponse.json(
        {
          error: access.error,
          requiresUpgrade: access.requiresUpgrade,
          currentPlan: access.currentPlan,
        },
        { status: 403 }
      )
    }

    // Add subscription info to request
    const modifiedReq = Object.assign(req, { subscription: access.subscription })
    
    return handler(modifiedReq, ...args)
  }
}