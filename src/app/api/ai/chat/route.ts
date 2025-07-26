import { NextRequest, NextResponse } from 'next/server'
import { aiEngine, AIMessage } from '@/lib/ai-engine'
import { withSubscription } from '@/middleware/subscription'

async function handler(request: NextRequest) {
  try {
    const { messages, model = 'claude', modelVariant } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      )
    }

    // Validate message format
    const validMessages: AIMessage[] = messages.map(msg => ({
      role: msg.role === 'user' || msg.role === 'assistant' ? msg.role : 'user',
      content: String(msg.content || '')
    }))

    let response: string

    // Route to appropriate AI model
    switch (model.toLowerCase()) {
      case 'claude':
        response = await aiEngine.chatWithClaude(
          validMessages, 
          modelVariant || 'claude-3-5-sonnet-20241022'
        )
        break

      case 'gpt':
      case 'openai':
        response = await aiEngine.chatWithGPT(
          validMessages,
          modelVariant || 'gpt-4'
        )
        break

      case 'compare':
        const comparison = await aiEngine.compareAIResponses(
          validMessages[validMessages.length - 1]?.content || ''
        )
        return NextResponse.json({
          success: true,
          data: {
            type: 'comparison',
            responses: comparison
          }
        })

      default:
        response = await aiEngine.chatWithClaude(validMessages)
    }

    return NextResponse.json({
      success: true,
      data: {
        message: response,
        model: model,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('AI Chat API Error:', error)
    
    // Return appropriate error based on the error type
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'AI service configuration error', details: 'API key not configured' },
          { status: 500 }
        )
      }
      
      if (error.message.includes('rate limit')) {
        return NextResponse.json(
          { error: 'Rate limit exceeded', details: 'Please try again later' },
          { status: 429 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Internal server error', details: 'Failed to process AI request' },
      { status: 500 }
    )
  }
}

// Export wrapped handlers with subscription checks
export const POST = withSubscription(handler, {
  service: 'claude', // Default to claude, but it will be dynamic based on model param
})

export async function GET() {
  try {
    // Health check endpoint
    const health = await aiEngine.healthCheck()
    const capabilities = await aiEngine.getModelCapabilities()

    return NextResponse.json({
      success: true,
      data: {
        status: 'operational',
        health,
        capabilities,
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('AI Health Check Error:', error)
    return NextResponse.json(
      { error: 'Health check failed' },
      { status: 500 }
    )
  }
}