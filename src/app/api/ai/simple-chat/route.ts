import { Anthropic } from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { messages } = body

    if (!messages || messages.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Messages are required'
      }, { status: 400 })
    }

    const anthropicKey = process.env.ANTHROPIC_API_KEY
    if (!anthropicKey) {
      return NextResponse.json({
        success: false,
        error: 'Anthropic API key not configured'
      }, { status: 500 })
    }

    const claude = new Anthropic({
      apiKey: anthropicKey
    })

    // Get the last user message
    const userMessages = messages.filter((m: ChatMessage) => m.role === 'user')
    const lastMessage = userMessages[userMessages.length - 1]?.content || 'Hello'

    console.log('Sending to Claude:', lastMessage)

    const response = await claude.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: lastMessage
        }
      ]
    })

    const aiResponse = response.content[0]?.type === 'text' ? response.content[0].text : 'Sorry, I could not process that request.'

    console.log('Claude response:', aiResponse)

    return NextResponse.json({
      success: true,
      response: aiResponse,
      model: 'claude-3-5-sonnet-20241022'
    })

  } catch (error) {
    console.error('AI chat error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to get AI response',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
