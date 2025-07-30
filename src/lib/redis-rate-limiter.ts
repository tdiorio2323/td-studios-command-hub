import Redis from 'ioredis'
import { logger } from './logger'

interface RateLimitConfig {
  windowMs: number
  maxRequests: number
  skipOnError?: boolean
}

interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetTime: number
  totalHits: number
}

class RedisRateLimiter {
  private redis: Redis | null = null
  private fallbackStore = new Map<string, { count: number; resetTime: number }>()

  constructor() {
    this.initializeRedis()
  }

  private async initializeRedis() {
    try {
      // Initialize Redis connection
      const redisUrl = process.env.REDIS_URL || process.env.UPSTASH_REDIS_REST_URL

      if (redisUrl) {
        // For Upstash Redis (recommended for production)
        if (redisUrl.includes('upstash')) {
          this.redis = new Redis(redisUrl, {
            tls: {},
            maxRetriesPerRequest: 3,
          })
        } else {
          // For standard Redis
          this.redis = new Redis(redisUrl)
        }

        this.redis.on('error', (error) => {
          logger.ai.error('redis', new Error(`Redis connection error: ${error.message}`))
          this.redis = null // Fall back to in-memory
        })

        this.redis.on('connect', () => {
          logger.ai.info('Redis connected successfully')
        })

        // Test connection
        await this.redis.ping()
      } else {
        logger.ai.warn('No Redis URL configured, using in-memory fallback')
      }
    } catch (error) {
      logger.ai.error('redis', error as Error)
      this.redis = null // Use fallback
    }
  }

  async checkRateLimit(
    identifier: string,
    config: RateLimitConfig
  ): Promise<RateLimitResult> {
    const key = `rate_limit:${identifier}`
    const now = Date.now()
    const windowStart = now - config.windowMs

    try {
      if (this.redis) {
        return await this.checkRedisRateLimit(key, config, now, windowStart)
      } else {
        return this.checkMemoryRateLimit(key, config, now, windowStart)
      }
    } catch (error) {
      logger.ai.error('rate-limiter', error as Error)

      if (config.skipOnError) {
        return {
          allowed: true,
          remaining: config.maxRequests,
          resetTime: now + config.windowMs,
          totalHits: 0
        }
      }

      // If skipOnError is false, be restrictive
      return {
        allowed: false,
        remaining: 0,
        resetTime: now + config.windowMs,
        totalHits: config.maxRequests
      }
    }
  }

  private async checkRedisRateLimit(
    key: string,
    config: RateLimitConfig,
    now: number,
    windowStart: number
  ): Promise<RateLimitResult> {
    const pipeline = this.redis!.pipeline()

    // Remove expired entries
    pipeline.zremrangebyscore(key, 0, windowStart)

    // Count current entries in window
    pipeline.zcard(key)

    // Add current request
    pipeline.zadd(key, now, `${now}-${Math.random()}`)

    // Set expiration
    pipeline.expire(key, Math.ceil(config.windowMs / 1000))

    const results = await pipeline.exec()

    if (!results) {
      throw new Error('Redis pipeline execution failed')
    }

    const totalHits = (results[2][1] as number) || 0
    const allowed = totalHits <= config.maxRequests
    const remaining = Math.max(0, config.maxRequests - totalHits)
    const resetTime = now + config.windowMs

    // If rate limit exceeded, remove the request we just added
    if (!allowed) {
      await this.redis!.zpopmax(key)
    }

    return {
      allowed,
      remaining,
      resetTime,
      totalHits
    }
  }

  private checkMemoryRateLimit(
    key: string,
    config: RateLimitConfig,
    now: number,
    windowStart: number
  ): RateLimitResult {
    const entry = this.fallbackStore.get(key)

    // Clean up expired entries periodically
    if (Math.random() < 0.01) { // 1% chance to cleanup
      this.cleanupExpiredEntries()
    }

    if (!entry || entry.resetTime <= now) {
      // New window
      const newEntry = {
        count: 1,
        resetTime: now + config.windowMs
      }
      this.fallbackStore.set(key, newEntry)

      return {
        allowed: true,
        remaining: config.maxRequests - 1,
        resetTime: newEntry.resetTime,
        totalHits: 1
      }
    }

    // Existing window
    entry.count++
    const allowed = entry.count <= config.maxRequests
    const remaining = Math.max(0, config.maxRequests - entry.count)

    if (!allowed) {
      entry.count-- // Don't count this request if it's over the limit
    }

    return {
      allowed,
      remaining,
      resetTime: entry.resetTime,
      totalHits: entry.count
    }
  }

  private cleanupExpiredEntries() {
    const now = Date.now()
    for (const [key, entry] of this.fallbackStore.entries()) {
      if (entry.resetTime <= now) {
        this.fallbackStore.delete(key)
      }
    }
  }

  // Utility method to generate fingerprint from request
  generateFingerprint(req: Request): string {
    const headers = {
      'user-agent': req.headers.get('user-agent') || '',
      'accept-language': req.headers.get('accept-language') || '',
      'accept-encoding': req.headers.get('accept-encoding') || ''
    }

    const ip = req.headers.get('x-forwarded-for') ||
               req.headers.get('x-real-ip') ||
               'unknown'

    // Create a more sophisticated fingerprint
    const fingerprint = `${ip}:${JSON.stringify(headers)}`

    // Hash it to keep it reasonably sized
    return Buffer.from(fingerprint).toString('base64').slice(0, 32)
  }

  // Health check
  async healthCheck(): Promise<{ redis: boolean; fallback: boolean }> {
    let redisHealthy = false

    try {
      if (this.redis) {
        await this.redis.ping()
        redisHealthy = true
      }
    } catch (error) {
      redisHealthy = false
    }

    return {
      redis: redisHealthy,
      fallback: !redisHealthy
    }
  }

  // For testing - reset rate limits
  async resetRateLimit(identifier: string): Promise<void> {
    const key = `rate_limit:${identifier}`

    try {
      if (this.redis) {
        await this.redis.del(key)
      } else {
        this.fallbackStore.delete(key)
      }
    } catch (error) {
      logger.ai.error('rate-limiter', error as Error)
    }
  }

  // Get current stats for an identifier
  async getRateLimitStats(identifier: string): Promise<{
    currentRequests: number
    windowStart: number
    windowEnd: number
  } | null> {
    const key = `rate_limit:${identifier}`
    const now = Date.now()

    try {
      if (this.redis) {
        const count = await this.redis.zcard(key)
        const ttl = await this.redis.ttl(key)

        return {
          currentRequests: count,
          windowStart: now - (ttl * 1000),
          windowEnd: now + (ttl * 1000)
        }
      } else {
        const entry = this.fallbackStore.get(key)
        if (!entry) return null

        return {
          currentRequests: entry.count,
          windowStart: entry.resetTime - 60000, // Assume 1 minute window
          windowEnd: entry.resetTime
        }
      }
    } catch (error) {
      logger.ai.error('rate-limiter', error as Error)
      return null
    }
  }
}

// Export singleton instance
export const rateLimiter = new RedisRateLimiter()

// Export types and rate limit configurations
export type { RateLimitConfig, RateLimitResult }

// Predefined rate limit configurations
export const RATE_LIMITS = {
  AI_REQUESTS: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 30, // 30 requests per minute
    skipOnError: false
  },
  API_GENERAL: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100, // 100 requests per minute
    skipOnError: true
  },
  UPLOAD_FILES: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10, // 10 uploads per minute
    skipOnError: false
  },
  STRIPE_WEBHOOK: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 1000, // High limit for webhooks
    skipOnError: true
  }
} as const
