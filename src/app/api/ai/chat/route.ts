import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { aiEngine, AIMessage } from '@/lib/ai-engine'

interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface ChatRequest {
  messages: ChatMessage[]
  model?: 'claude' | 'gpt' | 'compare'
  modelVariant?: string
  temperature?: number
  maxTokens?: number
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json()
    const { messages, model = 'claude', modelVariant, temperature = 0.7, maxTokens = 1000 } = body

    if (!messages || messages.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Messages are required'
      }, { status: 400 })
    }

    // Filter and convert messages to AIMessage format (excludes system messages)
    const aiMessages: AIMessage[] = messages
      .filter(m => m.role === 'user' || m.role === 'assistant')
      .map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content
      }))

    logger.api.info('AI Chat request', { model, messagesCount: aiMessages.length })

    let response: string
    let actualModel: string

    try {
      switch (model) {
        case 'claude':
          response = await aiEngine.chatWithClaude(
            aiMessages,
            modelVariant || 'claude-3-5-sonnet-20241022'
          )
          actualModel = modelVariant || 'claude-3-5-sonnet-20241022'
          break

        case 'gpt':
          response = await aiEngine.chatWithGPT(
            aiMessages,
            modelVariant || 'gpt-4'
          )
          actualModel = modelVariant || 'gpt-4'
          break

        case 'compare':
          const lastMessage = messages[messages.length - 1]?.content || ''
          const comparison = await aiEngine.compareAIResponses(lastMessage)
          return NextResponse.json({
            success: true,
            data: {
              message: `## Claude Response:\n${comparison.claude}\n\n## GPT-4 Response:\n${comparison.gpt}\n\n---\n*Comparison mode: Both responses shown above*`,
              model: 'Claude + GPT-4',
              tokensUsed: 0, // TODO: Calculate actual tokens
              timestamp: new Date().toISOString(),
              comparison: true
            }
          })

        default:
          response = await aiEngine.chatWithClaude(aiMessages)
          actualModel = 'claude-3-5-sonnet-20241022'
      }

      // Log usage for analytics
      logger.api.info('AI response generated', {
        model: actualModel,
        responseLength: response.length
      })

      return NextResponse.json({
        success: true,
        data: {
          message: response,
          model: actualModel,
          tokensUsed: 0, // TODO: Add token counting
          timestamp: new Date().toISOString()
        }
      })

    } catch (aiError: any) {
      logger.ai.error('ai-chat', aiError)

      // Return helpful error response
      const errorMessage = aiError.message || 'AI service temporarily unavailable'
      return NextResponse.json({
        success: false,
        error: errorMessage,
        fallback: "I'm having trouble connecting to the AI service right now. This could be due to:\n\n• API key configuration\n• Service rate limits\n• Network connectivity\n\nPlease check the console for more details or try again in a moment."
      }, { status: 503 })
    }

  } catch (error) {
    logger.api.error('POST', '/api/ai/chat', error as Error)
    return NextResponse.json({
      success: false,
      error: 'Invalid request format',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 400 })
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
