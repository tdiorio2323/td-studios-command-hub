/**
 * TD Studios Context Store
 * Maintains conversation context and user preferences
 */

interface UserContext {
  userId?: string
  preferences: {
    preferredModel: 'claude' | 'gpt' | 'compare'
    projectContext: string[]
    currentWorkflow?: string
    recentActions: string[]
  }
  projectState: {
    activeProjects: string[]
    recentFiles: string[]
    currentTasks: string[]
    integrations: string[]
  }
}

interface ConversationMemory {
  sessionId: string
  context: UserContext
  conversationHistory: Array<{
    timestamp: Date
    topic: string
    summary: string
  }>
  lastUpdated: Date
}

class ContextStore {
  private memory: Map<string, ConversationMemory> = new Map()
  private readonly MAX_MEMORY_AGE = 24 * 60 * 60 * 1000 // 24 hours

  // Get or create context for a session
  getContext(sessionId: string): ConversationMemory {
    let context = this.memory.get(sessionId)
    
    if (!context || this.isExpired(context)) {
      context = this.createNewContext(sessionId)
      this.memory.set(sessionId, context)
    }
    
    return context
  }

  // Update context with new information
  updateContext(sessionId: string, updates: Partial<UserContext>): void {
    const context = this.getContext(sessionId)
    context.context = { ...context.context, ...updates }
    context.lastUpdated = new Date()
    this.memory.set(sessionId, context)
  }

  // Add conversation summary for future reference
  addConversationSummary(sessionId: string, topic: string, summary: string): void {
    const context = this.getContext(sessionId)
    context.conversationHistory.push({
      timestamp: new Date(),
      topic,
      summary
    })
    
    // Keep only last 10 conversation summaries
    if (context.conversationHistory.length > 10) {
      context.conversationHistory = context.conversationHistory.slice(-10)
    }
    
    context.lastUpdated = new Date()
    this.memory.set(sessionId, context)
  }

  // Get enriched context for AI
  getEnrichedContext(sessionId: string): string {
    const context = this.getContext(sessionId)
    
    const contextString = `
## User Context for ${sessionId}
**Preferred Model**: ${context.context.preferences.preferredModel}
**Active Projects**: ${context.context.projectState.activeProjects.join(', ') || 'None specified'}
**Current Workflow**: ${context.context.preferences.currentWorkflow || 'General assistance'}
**Recent Actions**: ${context.context.preferences.recentActions.slice(-5).join(', ') || 'None'}

## Recent Conversation Topics
${context.conversationHistory.map(conv => 
  `- ${conv.topic} (${conv.timestamp.toLocaleDateString()}): ${conv.summary}`
).join('\n') || 'No previous conversations'}

## Project Context
${context.context.preferences.projectContext.join('\n') || 'No specific project context'}
`
    
    return contextString
  }

  // Clean up expired sessions
  cleanup(): void {
    const entries = Array.from(this.memory.entries())
    for (const [sessionId, context] of entries) {
      if (this.isExpired(context)) {
        this.memory.delete(sessionId)
      }
    }
  }

  private createNewContext(sessionId: string): ConversationMemory {
    return {
      sessionId,
      context: {
        preferences: {
          preferredModel: 'claude',
          projectContext: [
            'TD Studios Command Hub - Current platform',
            'Focus on business growth and conversion optimization',
            'Premium UI/UX with liquid glass effects',
            'TypeScript/Next.js development patterns'
          ],
          recentActions: []
        },
        projectState: {
          activeProjects: ['TD Studios Command Hub', 'AI Command Center'],
          recentFiles: [],
          currentTasks: [],
          integrations: ['Claude API', 'OpenAI API', 'Stripe', 'Supabase']
        }
      },
      conversationHistory: [],
      lastUpdated: new Date()
    }
  }

  private isExpired(context: ConversationMemory): boolean {
    return Date.now() - context.lastUpdated.getTime() > this.MAX_MEMORY_AGE
  }
}

// Singleton instance
export const contextStore = new ContextStore()

// Helper function to generate session ID from request
export function getSessionId(request: Request): string {
  // In production, you might use user ID or a more sophisticated session management
  const userAgent = request.headers.get('user-agent') || 'anonymous'
  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  
  // Simple hash for demo - in production use proper session management
  return `session_${Buffer.from(userAgent + ip).toString('base64').slice(0, 16)}`
}

// Cleanup expired sessions every hour
setInterval(() => {
  contextStore.cleanup()
}, 60 * 60 * 1000)