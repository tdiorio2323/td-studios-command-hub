/**
 * TD Studios Context Store with Advanced Memory Management
 * Maintains conversation context, user preferences, and implements intelligent pruning
 */

import { logger } from './logger'

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
  memoryUsage: {
    totalSize: number
    lastPruned: Date
    priorityScore: number
  }
}

interface ConversationMemory {
  sessionId: string
  context: UserContext
  conversationHistory: Array<{
    timestamp: Date
    topic: string
    summary: string
    importance: 'low' | 'medium' | 'high'
    tokenCount: number
  }>
  lastUpdated: Date
  lastAccessed: Date
  accessCount: number
}

interface MemoryStats {
  totalSessions: number
  totalMemoryUsage: number
  averageSessionSize: number
  oldestSession: Date
  newestSession: Date
  prunedSessions: number
}

class ContextStore {
  private memory: Map<string, ConversationMemory> = new Map()
  private readonly MAX_MEMORY_AGE = 24 * 60 * 60 * 1000 // 24 hours
  private readonly MAX_TOTAL_MEMORY = 50 * 1024 * 1024 // 50MB total memory limit
  private readonly MAX_SESSION_SIZE = 1024 * 1024 // 1MB per session
  private readonly MAX_CONVERSATION_HISTORY = 20 // Maximum conversation entries per session
  private readonly PRUNE_TRIGGER_RATIO = 0.8 // Prune when memory usage exceeds 80%
  private prunedSessionsCount = 0

  // Get or create context for a session
  getContext(sessionId: string): ConversationMemory {
    let context = this.memory.get(sessionId)
    
    if (!context || this.isExpired(context)) {
      context = this.createNewContext(sessionId)
      this.memory.set(sessionId, context)
    } else {
      // Update access tracking
      context.lastAccessed = new Date()
      context.accessCount++
    }
    
    // Check if memory usage requires pruning
    this.maybePerformPruning()
    
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
  addConversationSummary(
    sessionId: string, 
    topic: string, 
    summary: string, 
    importance: 'low' | 'medium' | 'high' = 'medium'
  ): void {
    const context = this.getContext(sessionId)
    const entry = {
      timestamp: new Date(),
      topic,
      summary,
      importance,
      tokenCount: this.estimateTokenCount(topic + summary)
    }
    
    context.conversationHistory.push(entry)
    
    // Intelligent pruning of conversation history
    this.pruneConversationHistory(context)
    
    // Update memory tracking
    context.context.memoryUsage.totalSize = this.calculateContextSize(context)
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
    const now = new Date()
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
        },
        memoryUsage: {
          totalSize: 0,
          lastPruned: now,
          priorityScore: 1.0
        }
      },
      conversationHistory: [],
      lastUpdated: now,
      lastAccessed: now,
      accessCount: 1
    }
  }

  private isExpired(context: ConversationMemory): boolean {
    return Date.now() - context.lastUpdated.getTime() > this.MAX_MEMORY_AGE
  }

  // Advanced Memory Management Methods
  
  private estimateTokenCount(text: string): number {
    // Rough estimate: 1 token ≈ 4 characters for English text
    return Math.ceil(text.length / 4)
  }

  private calculateContextSize(context: ConversationMemory): number {
    const contextStr = JSON.stringify(context)
    return Buffer.byteLength(contextStr, 'utf8')
  }

  private getTotalMemoryUsage(): number {
    let total = 0
    for (const context of this.memory.values()) {
      total += context.context.memoryUsage.totalSize
    }
    return total
  }

  private maybePerformPruning(): void {
    const totalMemory = this.getTotalMemoryUsage()
    const memoryRatio = totalMemory / this.MAX_TOTAL_MEMORY

    if (memoryRatio > this.PRUNE_TRIGGER_RATIO) {
      logger.ai.info(`Memory usage at ${(memoryRatio * 100).toFixed(1)}%, starting intelligent pruning`)
      this.performIntelligentPruning()
    }
  }

  private performIntelligentPruning(): void {
    const sessions = Array.from(this.memory.entries())
    
    // Calculate priority scores for each session
    const sessionPriorities = sessions.map(([sessionId, context]) => ({
      sessionId,
      context,
      priority: this.calculateSessionPriority(context)
    }))

    // Sort by priority (lowest first = first to be removed)
    sessionPriorities.sort((a, b) => a.priority - b.priority)

    let freedMemory = 0
    const targetMemory = this.MAX_TOTAL_MEMORY * (this.PRUNE_TRIGGER_RATIO - 0.1) // Target 10% below trigger

    for (const { sessionId, context } of sessionPriorities) {
      const currentTotal = this.getTotalMemoryUsage()
      if (currentTotal <= targetMemory) break

      // Try conversation history pruning first
      const beforeSize = context.context.memoryUsage.totalSize
      this.pruneConversationHistory(context, true) // Aggressive pruning
      const afterSize = this.calculateContextSize(context)
      context.context.memoryUsage.totalSize = afterSize

      freedMemory += beforeSize - afterSize

      // If still over memory limit, remove entire session
      if (currentTotal > targetMemory && context.context.memoryUsage.priorityScore < 0.3) {
        this.memory.delete(sessionId)
        freedMemory += afterSize
        this.prunedSessionsCount++
        logger.ai.info(`Pruned session ${sessionId} (priority: ${context.context.memoryUsage.priorityScore.toFixed(2)})`)
      }
    }

    logger.ai.info(`Memory pruning completed: freed ${(freedMemory / 1024).toFixed(1)}KB`)
  }

  private calculateSessionPriority(context: ConversationMemory): number {
    const now = Date.now()
    const daysSinceAccess = (now - context.lastAccessed.getTime()) / (24 * 60 * 60 * 1000)
    const daysSinceUpdate = (now - context.lastUpdated.getTime()) / (24 * 60 * 60 * 1000)
    
    // Factors for priority calculation
    const recencyScore = Math.max(0, 1 - daysSinceAccess / 7) // Decay over 7 days
    const activityScore = Math.min(1, context.accessCount / 10) // Max at 10 accesses
    const updatesScore = Math.max(0, 1 - daysSinceUpdate / 3) // Decay over 3 days
    const sizeScore = Math.max(0, 1 - context.context.memoryUsage.totalSize / this.MAX_SESSION_SIZE)
    
    // Weighted average
    const priority = (
      recencyScore * 0.3 +
      activityScore * 0.2 +
      updatesScore * 0.3 +
      sizeScore * 0.2
    )

    context.context.memoryUsage.priorityScore = priority
    return priority
  }

  private pruneConversationHistory(context: ConversationMemory, aggressive = false): void {
    const maxEntries = aggressive ? Math.floor(this.MAX_CONVERSATION_HISTORY / 2) : this.MAX_CONVERSATION_HISTORY
    
    if (context.conversationHistory.length <= maxEntries) return

    // Sort by importance and recency
    const sorted = context.conversationHistory.sort((a, b) => {
      const importanceWeight = { high: 3, medium: 2, low: 1 }
      const aScore = importanceWeight[a.importance] + (Date.now() - a.timestamp.getTime()) / (24 * 60 * 60 * 1000)
      const bScore = importanceWeight[b.importance] + (Date.now() - b.timestamp.getTime()) / (24 * 60 * 60 * 1000)
      return bScore - aScore // Descending order
    })

    // Keep most important and recent entries
    context.conversationHistory = sorted.slice(0, maxEntries)
    context.context.memoryUsage.lastPruned = new Date()
  }

  // Public utility methods

  getMemoryStats(): MemoryStats {
    const sessions = Array.from(this.memory.values())
    const totalMemory = this.getTotalMemoryUsage()
    
    const timestamps = sessions.map(s => s.lastAccessed.getTime())
    const oldest = timestamps.length > 0 ? new Date(Math.min(...timestamps)) : new Date()
    const newest = timestamps.length > 0 ? new Date(Math.max(...timestamps)) : new Date()

    return {
      totalSessions: this.memory.size,
      totalMemoryUsage: totalMemory,
      averageSessionSize: this.memory.size > 0 ? totalMemory / this.memory.size : 0,
      oldestSession: oldest,
      newestSession: newest,
      prunedSessions: this.prunedSessionsCount
    }
  }

  forcePruning(): void {
    logger.ai.info('Force pruning initiated')
    this.performIntelligentPruning()
  }

  // Get session by priority (for debugging/monitoring)
  getSessionsByPriority(): Array<{ sessionId: string; priority: number; memoryUsage: number; lastAccessed: Date }> {
    return Array.from(this.memory.entries())
      .map(([sessionId, context]) => ({
        sessionId,
        priority: this.calculateSessionPriority(context),
        memoryUsage: context.context.memoryUsage.totalSize,
        lastAccessed: context.lastAccessed
      }))
      .sort((a, b) => b.priority - a.priority)
  }

  // Reset all memory (for testing/debugging)
  clearAllMemory(): void {
    this.memory.clear()
    this.prunedSessionsCount = 0
    logger.ai.info('All memory cleared')
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