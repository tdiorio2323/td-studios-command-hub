import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Create Supabase client with service role key for backend operations
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export interface MailingListSubscriber {
  id?: string
  email: string
  name?: string
  source: string
  status: 'active' | 'unsubscribed' | 'pending'
  subscribed_at: string
  metadata?: Record<string, any>
}

export interface CreatorLinkRequest {
  id?: string
  email: string
  name?: string
  requested_username?: string
  status: 'pending' | 'approved' | 'rejected'
  requested_at: string
  notes?: string
}

export class MailingListService {
  /**
   * Add subscriber to mailing list
   */
  static async addSubscriber(
    email: string, 
    name?: string, 
    source: string = 'tdstudiosdigital.com'
  ): Promise<{ success: boolean; data?: MailingListSubscriber; error?: string }> {
    try {
      // Check if subscriber already exists
      const { data: existing } = await supabase
        .from('mailing_list_subscribers')
        .select('*')
        .eq('email', email)
        .single()

      if (existing) {
        // Update existing subscriber if they were unsubscribed
        if (existing.status === 'unsubscribed') {
          const { data, error } = await supabase
            .from('mailing_list_subscribers')
            .update({
              status: 'active',
              name: name || existing.name,
              subscribed_at: new Date().toISOString()
            })
            .eq('email', email)
            .select()
            .single()

          if (error) throw error
          return { success: true, data }
        }
        
        return { success: true, data: existing }
      }

      // Create new subscriber
      const subscriberData: Omit<MailingListSubscriber, 'id'> = {
        email,
        name,
        source,
        status: 'active',
        subscribed_at: new Date().toISOString(),
        metadata: {
          ip: null, // Could be added from request
          user_agent: null, // Could be added from request
          signup_page: source
        }
      }

      const { data, error } = await supabase
        .from('mailing_list_subscribers')
        .insert(subscriberData)
        .select()
        .single()

      if (error) throw error

      return { success: true, data }
    } catch (error) {
      console.error('Error adding subscriber:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to add subscriber' 
      }
    }
  }

  /**
   * Create creator link page request
   */
  static async createLinkPageRequest(
    email: string,
    name?: string,
    requestedUsername?: string
  ): Promise<{ success: boolean; data?: CreatorLinkRequest; error?: string }> {
    try {
      // Check if request already exists
      const { data: existing } = await supabase
        .from('creator_link_requests')
        .select('*')
        .eq('email', email)
        .single()

      if (existing && existing.status === 'pending') {
        return { success: true, data: existing }
      }

      // Create new request
      const requestData: Omit<CreatorLinkRequest, 'id'> = {
        email,
        name,
        requested_username: requestedUsername,
        status: 'pending',
        requested_at: new Date().toISOString(),
        notes: 'Request from tdstudiosdigital.com homepage'
      }

      const { data, error } = await supabase
        .from('creator_link_requests')
        .insert(requestData)
        .select()
        .single()

      if (error) throw error

      // Also add to mailing list if not already subscribed
      await this.addSubscriber(email, name, 'creator_link_request')

      return { success: true, data }
    } catch (error) {
      console.error('Error creating link page request:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create request' 
      }
    }
  }

  /**
   * Get subscriber by email
   */
  static async getSubscriber(email: string): Promise<MailingListSubscriber | null> {
    try {
      const { data, error } = await supabase
        .from('mailing_list_subscribers')
        .select('*')
        .eq('email', email)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      return data
    } catch (error) {
      console.error('Error getting subscriber:', error)
      return null
    }
  }

  /**
   * Unsubscribe user
   */
  static async unsubscribe(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('mailing_list_subscribers')
        .update({ status: 'unsubscribed' })
        .eq('email', email)

      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('Error unsubscribing:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to unsubscribe' 
      }
    }
  }

  /**
   * Get all subscribers (admin only)
   */
  static async getAllSubscribers(): Promise<MailingListSubscriber[]> {
    try {
      const { data, error } = await supabase
        .from('mailing_list_subscribers')
        .select('*')
        .order('subscribed_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error getting all subscribers:', error)
      return []
    }
  }

  /**
   * Get subscriber count by status
   */
  static async getSubscriberStats(): Promise<{
    total: number
    active: number
    unsubscribed: number
    pending: number
  }> {
    try {
      const { data, error } = await supabase
        .from('mailing_list_subscribers')
        .select('status')

      if (error) throw error

      const stats = {
        total: data?.length || 0,
        active: data?.filter(s => s.status === 'active').length || 0,
        unsubscribed: data?.filter(s => s.status === 'unsubscribed').length || 0,
        pending: data?.filter(s => s.status === 'pending').length || 0
      }

      return stats
    } catch (error) {
      console.error('Error getting subscriber stats:', error)
      return { total: 0, active: 0, unsubscribed: 0, pending: 0 }
    }
  }
}

export default MailingListService