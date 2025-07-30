import { logger } from '@/lib/logger'
import { NextRequest, NextResponse } from 'next/server'

interface TelegramMessage {
  id: number
  from: {
    id: number
    username?: string
    first_name: string
    last_name?: string
  }
  chat: {
    id: number
    type: string
    title?: string
  }
  text: string
  date: number
}

interface TelegramSendRequest {
  chatId: string | number
  message: string
  parseMode?: 'HTML' | 'Markdown'
  replyToMessageId?: number
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    const botToken = process.env.TELEGRAM_BOT_TOKEN
    if (!botToken) {
      return NextResponse.json({
        success: false,
        error: 'Telegram bot token not configured',
        setup: {
          message: 'Telegram Bot API integration requires a bot token',
          instructions: [
            '1. Message @BotFather on Telegram',
            '2. Create a new bot with /newbot command',
            '3. Choose a name and username for your bot',
            '4. Copy the bot token provided by BotFather',
            '5. Add TELEGRAM_BOT_TOKEN=your_token to .env.local',
            '6. Optionally set TELEGRAM_CHAT_ID for default chat'
          ]
        }
      }, { status: 400 })
    }

    // Get bot updates (messages)
    const updatesResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/getUpdates?limit=${limit}&offset=${offset}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    if (!updatesResponse.ok) {
      const error = await updatesResponse.text()
      logger.api.error('GET', '/api/messages/telegram', new Error(`Telegram API error: ${error}`))

      return NextResponse.json({
        success: false,
        error: 'Failed to fetch Telegram messages',
        details: `HTTP ${updatesResponse.status}`,
        troubleshooting: [
          'Check if your Telegram bot token is valid',
          'Verify the bot is properly configured',
          'Ensure the bot has necessary permissions',
          'Try sending a message to your bot first'
        ]
      }, { status: 500 })
    }

    const updatesData = await updatesResponse.json()
    const messages: TelegramMessage[] = updatesData.result
      .filter((update: any) => update.message)
      .map((update: any) => update.message)

    // Get bot info
    const botInfoResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/getMe`
    )
    const botInfo = botInfoResponse.ok ? await botInfoResponse.json() : null

    return NextResponse.json({
      success: true,
      messages,
      bot: botInfo?.result || null,
      total: messages.length,
      fetchedAt: new Date().toISOString()
    })

  } catch (error) {
    logger.api.error('GET', '/api/messages/telegram', error as Error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch Telegram messages',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as TelegramSendRequest
    const { chatId, message, parseMode = 'HTML', replyToMessageId } = body

    const botToken = process.env.TELEGRAM_BOT_TOKEN
    if (!botToken) {
      return NextResponse.json({
        success: false,
        error: 'Telegram bot token not configured'
      }, { status: 400 })
    }

    // Send message via Telegram Bot API
    const sendResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: parseMode,
          reply_to_message_id: replyToMessageId
        })
      }
    )

    if (!sendResponse.ok) {
      const error = await sendResponse.text()
      return NextResponse.json({
        success: false,
        error: 'Failed to send Telegram message',
        details: error
      }, { status: 500 })
    }

    const sentMessage = await sendResponse.json()

    logger.api.info('POST', '/api/messages/telegram', `Message sent to chat ${chatId}`)

    return NextResponse.json({
      success: true,
      message: 'Telegram message sent successfully',
      messageId: sentMessage.result.message_id,
      chat: sentMessage.result.chat
    })

  } catch (error) {
    logger.api.error('POST', '/api/messages/telegram', error as Error)
    return NextResponse.json({
      success: false,
      error: 'Failed to send Telegram message',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Webhook endpoint for receiving Telegram updates
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    // Process incoming Telegram webhook
    if (body.message) {
      const message = body.message
      logger.api.info('PUT', '/api/messages/telegram', `Received message from ${message.from.first_name}`)

      // Here you can process incoming messages, send auto-replies, etc.
      // For now, we'll just log it

      return NextResponse.json({
        success: true,
        message: 'Webhook processed successfully'
      })
    }

    return NextResponse.json({
      success: true,
      message: 'No message to process'
    })

  } catch (error) {
    logger.api.error('PUT', '/api/messages/telegram', error as Error)
    return NextResponse.json({
      success: false,
      error: 'Failed to process webhook'
    }, { status: 500 })
  }
}
