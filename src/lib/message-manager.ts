import { logger } from '@/lib/logger';
interface UnifiedMessage {
  id: string
  platform: 'gmail' | 'telegram' | 'ai'
  type: 'email' | 'chat' | 'notification'
  subject?: string
  content: string
  from: {
    id: string
    name: string
    email?: string
    username?: string
  }
  to?: {
    id: string
    name: string
    email?: string
  }
  timestamp: Date
  unread: boolean
  threadId?: string
  chatId?: string
  attachments?: Array<{
    name: string
    type: string
    url: string
  }>
}

interface SendMessageRequest {
  platform: 'gmail' | 'telegram'
  to: string
  subject?: string
  content: string
  replyTo?: string
}

export class MessageManager {
  private static instance: MessageManager

  static getInstance(): MessageManager {
    if (!MessageManager.instance) {
      MessageManager.instance = new MessageManager()
    }
    return MessageManager.instance
  }

  async getAllMessages(limit: number = 50): Promise<UnifiedMessage[]> {
    const messages: UnifiedMessage[] = []

    try {
      // Fetch Gmail messages
      const gmailResponse = await fetch(`/api/messages/gmail?limit=${Math.floor(limit / 2)}`)
      if (gmailResponse.ok) {
        const gmailData = await gmailResponse.json()
        const gmailMessages = gmailData.messages?.map((msg: any) => ({
          id: `gmail-${msg.id}`,
          platform: 'gmail' as const,
          type: 'email' as const,
          subject: msg.subject,
          content: msg.snippet || msg.body,
          from: {
            id: msg.from,
            name: this.extractNameFromEmail(msg.from),
            email: msg.from
          },
          to: {
            id: msg.to,
            name: this.extractNameFromEmail(msg.to),
            email: msg.to
          },
          timestamp: new Date(msg.date),
          unread: msg.unread,
          threadId: msg.threadId
        })) || []

        messages.push(...gmailMessages)
      }
    } catch (error) {
      logger.warn('Failed to fetch Gmail messages:', error)
    }

    try {
      // Fetch Telegram messages
      const telegramResponse = await fetch(`/api/messages/telegram?limit=${Math.floor(limit / 2)}`)
      if (telegramResponse.ok) {
        const telegramData = await telegramResponse.json()
        const telegramMessages = telegramData.messages?.map((msg: any) => ({
          id: `telegram-${msg.id}`,
          platform: 'telegram' as const,
          type: 'chat' as const,
          content: msg.text,
          from: {
            id: msg.from.id.toString(),
            name: `${msg.from.first_name} ${msg.from.last_name || ''}`.trim(),
            username: msg.from.username
          },
          timestamp: new Date(msg.date * 1000),
          unread: false, // Telegram doesn't have unread status in this context
          chatId: msg.chat.id.toString()
        })) || []

        messages.push(...telegramMessages)
      }
    } catch (error) {
      logger.warn('Failed to fetch Telegram messages:', error)
    }

    // Sort by timestamp (newest first)
    return messages.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }

  async sendMessage(request: SendMessageRequest): Promise<{
    success: boolean
    messageId?: string
    error?: string
  }> {
    try {
      if (request.platform === 'gmail') {
        const response = await fetch('/api/messages/gmail', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            to: request.to,
            subject: request.subject || 'Message from TD Studios',
            body: request.content,
            replyToId: request.replyTo
          })
        })

        const data = await response.json()
        return {
          success: data.success,
          messageId: data.messageId,
          error: data.error
        }
      }

      if (request.platform === 'telegram') {
        const response = await fetch('/api/messages/telegram', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            chatId: request.to,
            message: request.content,
            replyToMessageId: request.replyTo ? parseInt(request.replyTo) : undefined
          })
        })

        const data = await response.json()
        return {
          success: data.success,
          messageId: data.messageId?.toString(),
          error: data.error
        }
      }

      return {
        success: false,
        error: 'Unsupported platform'
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  async getUnreadCount(): Promise<{
    gmail: number
    telegram: number
    total: number
  }> {
    let gmailUnread = 0
    let telegramUnread = 0

    try {
      const gmailResponse = await fetch('/api/messages/gmail?unread=true&limit=100')
      if (gmailResponse.ok) {
        const data = await gmailResponse.json()
        gmailUnread = data.unreadCount || 0
      }
    } catch (error) {
      logger.warn('Failed to get Gmail unread count:', error)
    }

    try {
      // For Telegram, we'll count recent messages as "unread"
      const telegramResponse = await fetch('/api/messages/telegram?limit=50')
      if (telegramResponse.ok) {
        const data = await telegramResponse.json()
        // Consider messages from last hour as potentially unread
        const oneHourAgo = Date.now() - (60 * 60 * 1000)
        telegramUnread = data.messages?.filter((msg: any) =>
          msg.date * 1000 > oneHourAgo
        ).length || 0
      }
    } catch (error) {
      logger.warn('Failed to get Telegram message count:', error)
    }

    return {
      gmail: gmailUnread,
      telegram: telegramUnread,
      total: gmailUnread + telegramUnread
    }
  }

  private extractNameFromEmail(email: string): string {
    if (!email) return 'Unknown'

    // Extract name from "Name <email>" format
    const match = email.match(/^(.+?)\s*</)
    if (match) {
      return match[1].trim().replace(/['"]/g, '')
    }

    // If no name found, use email prefix
    return email.split('@')[0]
  }

  async searchMessages(query: string, platform?: 'gmail' | 'telegram'): Promise<UnifiedMessage[]> {
    const allMessages = await this.getAllMessages(200)

    return allMessages.filter(message => {
      if (platform && message.platform !== platform) return false

      const searchText = `${message.subject || ''} ${message.content} ${message.from.name}`.toLowerCase()
      return searchText.includes(query.toLowerCase())
    })
  }
}

export const messageManager = MessageManager.getInstance()
