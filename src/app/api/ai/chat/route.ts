import { NextRequest, NextResponse } from 'next/server'
import { aiEngine, AIMessage } from '@/lib/ai-engine'
import { contextStore, getSessionId } from '@/lib/context-store'

// TD Studios System Context - Gives AI knowledge about your projects and preferences
const TD_STUDIOS_CONTEXT = `You are an AI assistant integrated into Tyler DiOrio's TD Studios Command Hub. Here's important context about this environment:

## About TD Studios
- **Owner**: Tyler DiOrio (tdiorio2323 on GitHub)
- **Current Platform**: TD Studios Command Hub - Production-ready AI dashboard
- **Domain**: tdstudioshq.com (login: tdstudios2024 or aibeast)
- **Tech Stack**: Next.js 14, TypeScript, Tailwind CSS, Supabase, Stripe
- **Business Model**: $297-$2997/month AI-powered business management platform

## Active Projects
1. **TD Studios Command Hub** (this platform) - Revenue-ready at $2997/month value
2. **TD Studios AI Command Center** - Enterprise platform in development (10.5 month roadmap, $25K+ MRR target)
3. **FansWorld Lux Starter** - React + Vite content creator platform

## Development Preferences
- Always prioritize production-ready, secure code
- TypeScript strict mode, comprehensive error handling
- Rate limiting aware (Claude: 200k tokens, GPT-4: 128k tokens)
- Follow existing patterns: components in src/components/, API routes in src/app/api/
- Core AI functionality in src/lib/ai-engine.ts

## Business Focus
- Conversion optimization and MRR growth
- Premium UI/UX with black/white color scheme and liquid glass effects
- AI-powered automation and workflow tools
- Monitor API costs and usage limits

## Current Session Context
- You're running in the TD Studios Command Hub dashboard
- User can access AI Studio, File Vault, Task Manager, Analytics, and more
- All APIs are integrated and tested (Claude, OpenAI, Stripe)
- Recent updates: Implemented liquid glass button system and black/white design

Provide helpful, contextual responses that understand Tyler's business goals and technical environment.`

export async function POST(request: NextRequest) {
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

    // Get session-specific context and memory
    const sessionId = getSessionId(request)
    const userContext = contextStore.getEnrichedContext(sessionId)
    
    // Add system context and user memory as the first message if this is a new conversation
    const isNewConversation = validMessages.length === 1
    if (isNewConversation) {
      validMessages.unshift({
        role: 'assistant',
        content: `${TD_STUDIOS_CONTEXT}\n\n${userContext}`
      })
    }
    
    // Track user's current action
    const userMessage = validMessages[validMessages.length - 1]?.content
    if (userMessage) {
      contextStore.updateContext(sessionId, {
        preferences: {
          ...contextStore.getContext(sessionId).context.preferences,
          recentActions: [
            ...contextStore.getContext(sessionId).context.preferences.recentActions.slice(-4),
            `Asked: ${userMessage.slice(0, 100)}...`
          ]
        }
      })
    }

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

    // Add conversation summary to memory for future context
    if (userMessage && response) {
      const topic = userMessage.length > 50 ? userMessage.slice(0, 50) + '...' : userMessage
      const summary = response.length > 100 ? response.slice(0, 100) + '...' : response
      contextStore.addConversationSummary(sessionId, topic, summary)
    }

    return NextResponse.json({
      success: true,
      data: {
        message: response,
        model: model,
        timestamp: new Date().toISOString(),
        sessionId: sessionId // Include session ID for debugging
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

// Subscription checks temporarily disabled for deployment

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