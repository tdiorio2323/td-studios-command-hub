import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server'
import { aiEngine } from '@/lib/ai-engine'

export async function POST(request: NextRequest) {
  try {
    const { tasks, context, model = 'claude', criteria } = await request.json()

    if (!tasks || !Array.isArray(tasks)) {
      return NextResponse.json(
        { error: 'Tasks array is required' },
        { status: 400 }
      )
    }

    if (tasks.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          prioritizedTasks: [],
          summary: 'No tasks to prioritize'
        }
      })
    }

    // Convert tasks to strings if they're objects
    const taskStrings = tasks.map(task => 
      typeof task === 'string' ? task : task.title || task.name || String(task)
    )

    // Get AI prioritization
    const prioritizedTasks = await aiEngine.prioritizeTasksWithClaude(taskStrings)

    // Generate summary insights
    const summaryPrompt = `Based on these prioritized tasks, provide a brief productivity insight (2-3 sentences):

${prioritizedTasks.map(t => `${t.task} (Priority: ${t.priority}, Urgency: ${t.urgency})`).join('\n')}

Context: ${context || 'General task management'}`

    const summary = await aiEngine.chatWithClaude([{
      role: 'user',
      content: summaryPrompt
    }])

    // Calculate productivity metrics
    const metrics = {
      totalTasks: prioritizedTasks.length,
      highPriority: prioritizedTasks.filter(t => t.priority >= 8).length,
      urgentTasks: prioritizedTasks.filter(t => t.urgency === 'urgent' || t.urgency === 'high').length,
      averagePriority: Math.round(
        prioritizedTasks.reduce((sum, t) => sum + t.priority, 0) / prioritizedTasks.length
      ),
      recommendedNext: prioritizedTasks
        .sort((a, b) => b.priority - a.priority)
        .slice(0, 3)
        .map(t => t.task)
    }

    return NextResponse.json({
      success: true,
      data: {
        prioritizedTasks: prioritizedTasks.sort((a, b) => b.priority - a.priority),
        summary: summary.trim(),
        metrics,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    logger.error('Task Prioritization API Error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to prioritize tasks',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      endpoint: '/api/ai/tasks/prioritize',
      description: 'AI-powered task prioritization using advanced reasoning',
      usage: {
        method: 'POST',
        body: {
          tasks: ['array of task strings or objects'],
          context: 'optional context for better prioritization'
        }
      },
      features: [
        'Claude-powered intelligent prioritization',
        'Urgency assessment',
        'Productivity insights',
        'Recommended next actions',
        'Performance metrics'
      ]
    }
  })
}