import { logger } from '@/lib/logger';
export interface AnalyticsEvent {
  id: string
  type: 'ai_query' | 'task_created' | 'workflow_executed' | 'image_analyzed' | 'content_generated'
  timestamp: string
  userId?: string
  sessionId: string
  metadata: {
    model?: string
    tokensUsed?: number
    processingTime?: number
    success: boolean
    errorType?: string
    [key: string]: any
  }
}

// Helper function to track an event (can be imported and used in other APIs)
export async function trackEvent(event: Omit<AnalyticsEvent, 'id' | 'timestamp'>) {
  try {
    const response = await fetch('/api/analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        events: [{
          ...event,
          id: `event_${Date.now()}_${Math.random()}`,
          timestamp: new Date().toISOString()
        }]
      })
    })

    if (!response.ok) {
      logger.error('Failed to track analytics event')
    }
  } catch (error) {
    logger.error('Analytics tracking error:', error)
  }
}