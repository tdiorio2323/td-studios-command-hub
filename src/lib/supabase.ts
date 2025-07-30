import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Client for browser/frontend use
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Admin client for server-side operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Database types for TypeScript
export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  stripe_customer_id?: string
  created_at: string
  updated_at: string
}

export interface Subscription {
  id: string
  user_id: string
  stripe_subscription_id: string
  stripe_price_id: string
  plan_name: string
  status: string
  current_period_start: string
  current_period_end: string
  cancel_at_period_end: boolean
  canceled_at?: string
  created_at: string
  updated_at: string
}

export interface UsageLog {
  id: string
  user_id: string
  service: string
  endpoint: string
  tokens_used: number
  cost_cents: number
  metadata?: any
  created_at: string
}

export interface Payment {
  id: string
  user_id: string
  stripe_payment_intent_id: string
  amount_cents: number
  currency: string
  status: string
  description?: string
  created_at: string
}

// Helper functions for common database operations
export const dbHelpers = {
  // Get user by ID
  async getUser(userId: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching user:', error)
      return null
    }
    return data
  },

  // Get user's active subscription
  async getUserSubscription(userId: string): Promise<Subscription | null> {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single()

    if (error) {
      console.error('Error fetching subscription:', error)
      return null
    }
    return data
  },

  // Log usage for analytics
  async logUsage(
    userId: string,
    service: string,
    endpoint: string,
    tokensUsed: number = 0,
    costCents: number = 0,
    metadata: any = {}
  ): Promise<boolean> {
    const { error } = await supabase
      .from('usage_logs')
      .insert({
        user_id: userId,
        service,
        endpoint,
        tokens_used: tokensUsed,
        cost_cents: costCents,
        metadata
      })

    if (error) {
      console.error('Error logging usage:', error)
      return false
    }
    return true
  },

  // Get usage stats for a user
  async getUserUsage(userId: string, days: number = 30): Promise<UsageLog[]> {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const { data, error } = await supabase
      .from('usage_logs')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching usage:', error)
      return []
    }
    return data || []
  }
}
