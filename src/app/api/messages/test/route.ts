import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('📧 Testing TD Studios messaging integrations...')

    const integrations = []

    // Test Gmail
    try {
      const gmailToken = process.env.GMAIL_ACCESS_TOKEN
      if (gmailToken) {
        const response = await fetch('/api/messages/gmail?limit=1', {
          headers: {
            'Content-Type': 'application/json'
          }
        })

        integrations.push({
          platform: 'Gmail',
          status: response.ok ? 'connected' : 'error',
          details: response.ok ? 'Gmail API connected' : `HTTP ${response.status}`,
          apiKeyPresent: true,
          capabilities: ['read_emails', 'send_emails', 'manage_threads']
        })
      } else {
        integrations.push({
          platform: 'Gmail',
          status: 'disconnected',
          details: 'Access token not configured',
          apiKeyPresent: false,
          capabilities: []
        })
      }
    } catch (error) {
      integrations.push({
        platform: 'Gmail',
        status: 'error',
        details: error instanceof Error ? error.message : 'Unknown error',
        apiKeyPresent: !!process.env.GMAIL_ACCESS_TOKEN,
        capabilities: []
      })
    }

    // Test Telegram
    try {
      const telegramToken = process.env.TELEGRAM_BOT_TOKEN
      if (telegramToken) {
        const response = await fetch(`https://api.telegram.org/bot${telegramToken}/getMe`)

        integrations.push({
          platform: 'Telegram',
          status: response.ok ? 'connected' : 'error',
          details: response.ok ? 'Telegram Bot API connected' : `HTTP ${response.status}`,
          apiKeyPresent: true,
          capabilities: ['send_messages', 'receive_webhooks', 'group_management']
        })
      } else {
        integrations.push({
          platform: 'Telegram',
          status: 'disconnected',
          details: 'Bot token not configured',
          apiKeyPresent: false,
          capabilities: []
        })
      }
    } catch (error) {
      integrations.push({
        platform: 'Telegram',
        status: 'error',
        details: error instanceof Error ? error.message : 'Unknown error',
        apiKeyPresent: !!process.env.TELEGRAM_BOT_TOKEN,
        capabilities: []
      })
    }

    const summary = {
      total: integrations.length,
      connected: integrations.filter(i => i.status === 'connected').length,
      disconnected: integrations.filter(i => i.status === 'disconnected').length,
      errors: integrations.filter(i => i.status === 'error').length
    }

    return NextResponse.json({
      success: true,
      message: 'Message integration test completed',
      summary,
      integrations,
      testedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('Message integration test error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to test message integrations',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
