import { logger } from '@/lib/logger'
import { NextRequest, NextResponse } from 'next/server'

interface GmailMessage {
  id: string
  threadId: string
  snippet: string
  subject: string
  from: string
  to: string
  date: string
  unread: boolean
  body: string
}

interface GmailSendRequest {
  to: string
  subject: string
  body: string
  replyToId?: string
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const unreadOnly = searchParams.get('unread') === 'true'

    const accessToken = process.env.GMAIL_ACCESS_TOKEN
    if (!accessToken) {
      return NextResponse.json({
        success: false,
        error: 'Gmail access token not configured',
        setup: {
          message: 'Gmail API integration requires authentication',
          instructions: [
            '1. Go to Google Cloud Console: https://console.cloud.google.com/',
            '2. Enable Gmail API for your project',
            '3. Create OAuth 2.0 credentials',
            '4. Get access token and refresh token',
            '5. Add GMAIL_ACCESS_TOKEN to .env.local',
            '6. Add GMAIL_REFRESH_TOKEN to .env.local',
            '7. Add GMAIL_CLIENT_ID and GMAIL_CLIENT_SECRET'
          ]
        }
      }, { status: 400 })
    }

    // Fetch messages from Gmail API
    const messagesResponse = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${limit}${unreadOnly ? '&q=is:unread' : ''}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (!messagesResponse.ok) {
      const error = await messagesResponse.text()
      logger.api.error('GET', '/api/messages/gmail', new Error(`Gmail API error: ${error}`))

      return NextResponse.json({
        success: false,
        error: 'Failed to fetch Gmail messages',
        details: `HTTP ${messagesResponse.status}`,
        troubleshooting: [
          'Check if your Gmail access token is valid',
          'Verify Gmail API is enabled in Google Cloud Console',
          'Ensure proper OAuth scopes are granted',
          'Try refreshing your access token'
        ]
      }, { status: 500 })
    }

    const messagesData = await messagesResponse.json()
    const messages: GmailMessage[] = []

    // Fetch details for each message
    for (const message of messagesData.messages || []) {
      try {
        const messageResponse = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.id}`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            }
          }
        )

        if (messageResponse.ok) {
          const messageData = await messageResponse.json()
          const headers = messageData.payload.headers

          const getHeader = (name: string) =>
            headers.find((h: any) => h.name.toLowerCase() === name.toLowerCase())?.value || ''

          messages.push({
            id: messageData.id,
            threadId: messageData.threadId,
            snippet: messageData.snippet,
            subject: getHeader('Subject'),
            from: getHeader('From'),
            to: getHeader('To'),
            date: getHeader('Date'),
            unread: messageData.labelIds?.includes('UNREAD') || false,
            body: messageData.payload.body?.data
              ? Buffer.from(messageData.payload.body.data, 'base64').toString('utf-8')
              : messageData.snippet
          })
        }
      } catch (error) {
        logger.api.warn('GET', '/api/messages/gmail', `Failed to fetch message ${message.id}`)
      }
    }

    return NextResponse.json({
      success: true,
      messages,
      total: messagesData.resultSizeEstimate || 0,
      unreadCount: messages.filter(m => m.unread).length,
      fetchedAt: new Date().toISOString()
    })

  } catch (error) {
    logger.api.error('GET', '/api/messages/gmail', error as Error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch Gmail messages',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as GmailSendRequest
    const { to, subject, body: emailBody, replyToId } = body

    const accessToken = process.env.GMAIL_ACCESS_TOKEN
    if (!accessToken) {
      return NextResponse.json({
        success: false,
        error: 'Gmail access token not configured'
      }, { status: 400 })
    }

    // Create email message
    const email = [
      `To: ${to}`,
      `Subject: ${subject}`,
      'Content-Type: text/html; charset=utf-8',
      '',
      emailBody
    ].join('\n')

    const encodedEmail = Buffer.from(email).toString('base64').replace(/\+/g, '-').replace(/\//g, '_')

    // Send email via Gmail API
    const sendResponse = await fetch(
      'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          raw: encodedEmail,
          threadId: replyToId
        })
      }
    )

    if (!sendResponse.ok) {
      const error = await sendResponse.text()
      return NextResponse.json({
        success: false,
        error: 'Failed to send email',
        details: error
      }, { status: 500 })
    }

    const sentMessage = await sendResponse.json()

    logger.api.info('POST', '/api/messages/gmail', `Email sent to ${to}`)

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully',
      messageId: sentMessage.id,
      threadId: sentMessage.threadId
    })

  } catch (error) {
    logger.api.error('POST', '/api/messages/gmail', error as Error)
    return NextResponse.json({
      success: false,
      error: 'Failed to send email',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
