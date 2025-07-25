import { NextRequest, NextResponse } from 'next/server'

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

// In-memory storage for demo - replace with database in production
let analyticsData: AnalyticsEvent[] = []

export async function POST(request: NextRequest) {
  try {
    const { events } = await request.json()

    if (!events || !Array.isArray(events)) {
      return NextResponse.json(
        { error: 'Events array is required' },
        { status: 400 }
      )
    }

    // Process and store events
    const processedEvents: AnalyticsEvent[] = events.map(event => ({
      id: event.id || `event_${Date.now()}_${Math.random()}`,
      type: event.type,
      timestamp: event.timestamp || new Date().toISOString(),
      userId: event.userId,
      sessionId: event.sessionId || 'unknown',
      metadata: {
        ...event.metadata,
        success: event.metadata?.success ?? true
      }
    }))

    // Add to in-memory storage
    analyticsData.push(...processedEvents)

    // Keep only last 1000 events to prevent memory issues
    if (analyticsData.length > 1000) {
      analyticsData = analyticsData.slice(-1000)
    }

    return NextResponse.json({
      success: true,
      data: {
        eventsProcessed: processedEvents.length,
        totalEvents: analyticsData.length
      }
    })

  } catch (error) {
    console.error('Analytics API Error:', error)
    return NextResponse.json(
      { error: 'Failed to process analytics events' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const timeframe = searchParams.get('timeframe') || '24h'
    const type = searchParams.get('type')
    const userId = searchParams.get('userId')

    // Filter events based on timeframe
    const now = new Date()
    let startTime: Date

    switch (timeframe) {
      case '1h':
        startTime = new Date(now.getTime() - 60 * 60 * 1000)
        break
      case '24h':
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        break
      case '7d':
        startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case '30d':
        startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      default:
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    }

    let filteredEvents = analyticsData.filter(event => 
      new Date(event.timestamp) >= startTime
    )

    if (type) {
      filteredEvents = filteredEvents.filter(event => event.type === type)
    }

    if (userId) {
      filteredEvents = filteredEvents.filter(event => event.userId === userId)
    }

    // Calculate metrics
    const totalEvents = filteredEvents.length
    const successfulEvents = filteredEvents.filter(e => e.metadata.success).length
    const failedEvents = totalEvents - successfulEvents
    const successRate = totalEvents > 0 ? (successfulEvents / totalEvents) * 100 : 0

    // Event type breakdown
    const eventTypeBreakdown = filteredEvents.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Model usage breakdown
    const modelUsage = filteredEvents.reduce((acc, event) => {
      const model = event.metadata.model || 'unknown'
      acc[model] = (acc[model] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Token usage (if available)
    const totalTokens = filteredEvents.reduce((sum, event) => 
      sum + (event.metadata.tokensUsed || 0), 0
    )

    // Average processing time
    const processingTimes = filteredEvents
      .map(e => e.metadata.processingTime)
      .filter(t => t !== undefined) as number[]
    
    const avgProcessingTime = processingTimes.length > 0 
      ? processingTimes.reduce((sum, time) => sum + time, 0) / processingTimes.length
      : 0

    // Error breakdown
    const errorBreakdown = filteredEvents
      .filter(e => !e.metadata.success)
      .reduce((acc, event) => {
        const errorType = event.metadata.errorType || 'unknown'
        acc[errorType] = (acc[errorType] || 0) + 1
        return acc
      }, {} as Record<string, number>)

    // Hourly activity (for charts)
    const hourlyActivity = Array.from({ length: 24 }, (_, hour) => {
      const count = filteredEvents.filter(event => {
        const eventHour = new Date(event.timestamp).getHours()
        return eventHour === hour
      }).length
      return { hour, count }
    })

    // Recent activity (last 10 events)
    const recentActivity = filteredEvents
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10)
      .map(event => ({
        type: event.type,
        timestamp: event.timestamp,
        success: event.metadata.success,
        model: event.metadata.model,
        processingTime: event.metadata.processingTime
      }))

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          timeframe,
          totalEvents,
          successfulEvents,
          failedEvents,
          successRate: Math.round(successRate * 100) / 100,
          totalTokens,
          avgProcessingTime: Math.round(avgProcessingTime * 100) / 100
        },
        breakdowns: {
          eventTypes: eventTypeBreakdown,
          modelUsage,
          errors: errorBreakdown
        },
        charts: {
          hourlyActivity,
          dailyTrends: [] // Could implement daily trends for longer timeframes
        },
        recentActivity,
        filters: {
          availableTypes: Array.from(new Set(analyticsData.map(e => e.type))),
          availableModels: Array.from(new Set(analyticsData.map(e => e.metadata.model).filter(Boolean))),
          dateRange: {
            earliest: analyticsData.length > 0 ? analyticsData[0].timestamp : null,
            latest: analyticsData.length > 0 ? analyticsData[analyticsData.length - 1].timestamp : null
          }
        }
      }
    })

  } catch (error) {
    console.error('Analytics Retrieval Error:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve analytics data' },
      { status: 500 }
    )
  }
}

