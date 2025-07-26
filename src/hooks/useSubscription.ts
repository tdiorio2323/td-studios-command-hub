import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { PRICING_PLANS, PlanType } from '@/lib/stripe'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Subscription {
  id: string
  plan_name: string
  status: string
  current_period_end: string
  cancel_at_period_end: boolean
}

interface UsageData {
  claudeRequests: number
  gptRequests: number
  imageGeneration: number
}

export function useSubscription() {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [usage, setUsage] = useState<UsageData>({
    claudeRequests: 0,
    gptRequests: 0,
    imageGeneration: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSubscription()
    fetchUsage()
  }, [])

  const fetchSubscription = async () => {
    try {
      // Get current user (you'll need to implement auth)
      const userId = 'current-user-id' // Replace with actual user ID
      
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .single()

      if (error) throw error
      setSubscription(data)
    } catch (error) {
      console.error('Error fetching subscription:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUsage = async () => {
    try {
      const userId = 'current-user-id' // Replace with actual user ID
      
      // Get usage for current billing period
      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      startOfMonth.setHours(0, 0, 0, 0)

      const { data, error } = await supabase
        .from('usage_logs')
        .select('service')
        .eq('user_id', userId)
        .gte('created_at', startOfMonth.toISOString())

      if (error) throw error

      // Process usage data
      const usageMap = data.reduce((acc, item) => {
        acc[item.service] = (acc[item.service] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      setUsage({
        claudeRequests: usageMap.claude || 0,
        gptRequests: usageMap.gpt || 0,
        imageGeneration: usageMap.dalle || 0,
      })
    } catch (error) {
      console.error('Error fetching usage:', error)
    }
  }

  const getPlanType = (): PlanType | null => {
    if (!subscription) return null
    
    // Match plan name to plan type
    const planName = subscription.plan_name.toLowerCase()
    if (planName.includes('starter')) return 'starter'
    if (planName.includes('professional')) return 'professional'
    if (planName.includes('enterprise') && !planName.includes('custom')) return 'enterprise'
    if (planName.includes('custom')) return 'custom'
    
    return null
  }

  const checkLimit = (service: 'claudeRequests' | 'gptRequests' | 'imageGeneration'): boolean => {
    const planType = getPlanType()
    if (!planType) return false

    const limits = PRICING_PLANS[planType].limits
    const limit = limits[service]
    
    // -1 means unlimited
    if (limit === -1) return true
    
    return usage[service] < limit
  }

  const getRemainingUsage = (service: 'claudeRequests' | 'gptRequests' | 'imageGeneration'): number => {
    const planType = getPlanType()
    if (!planType) return 0

    const limits = PRICING_PLANS[planType].limits
    const limit = limits[service]
    
    if (limit === -1) return -1 // unlimited
    
    return Math.max(0, limit - usage[service])
  }

  const canAccessFeature = (feature: string): boolean => {
    const planType = getPlanType()
    if (!planType) return false

    const plan = PRICING_PLANS[planType]
    return plan.features.some(f => f.toLowerCase().includes(feature.toLowerCase()))
  }

  return {
    subscription,
    usage,
    loading,
    getPlanType,
    checkLimit,
    getRemainingUsage,
    canAccessFeature,
    refreshSubscription: fetchSubscription,
    refreshUsage: fetchUsage,
  }
}