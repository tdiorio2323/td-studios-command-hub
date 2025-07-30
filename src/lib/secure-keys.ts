import CryptoJS from 'crypto-js'
import { logger } from './logger'

interface EncryptedKey {
  encrypted: string
  iv: string
  tag: string
}

interface KeyRotationSchedule {
  keyId: string
  rotateAfter: number // milliseconds
  lastRotated: number
  maxUsage: number
  currentUsage: number
}

class SecureKeyManager {
  private readonly ENCRYPTION_KEY: string
  private keyRotationSchedule = new Map<string, KeyRotationSchedule>()
  private encryptedKeys = new Map<string, EncryptedKey>()

  constructor() {
    // Use a consistent encryption key from environment
    this.ENCRYPTION_KEY = process.env.MASTER_ENCRYPTION_KEY || this.generateFallbackKey()
    
    if (!process.env.MASTER_ENCRYPTION_KEY) {
      logger.ai.warn('No MASTER_ENCRYPTION_KEY found in environment. Using fallback key.')
    }

    this.initializeKeys()
  }

  private generateFallbackKey(): string {
    // Generate a consistent fallback key based on system properties
    // This is NOT recommended for production - use a proper secret manager
    const systemId = process.env.VERCEL_PROJECT_ID || 
                    process.env.NODE_ENV || 
                    'development'
    
    return CryptoJS.SHA256(`td-studios-${systemId}-encryption-key`).toString()
  }

  private initializeKeys() {
    try {
      // Initialize API keys with encryption
      const keys = {
        ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
        OPENAI_API_KEY: process.env.OPENAI_API_KEY,
        STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
        SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
        DATABASE_URL: process.env.DATABASE_URL,
        REDIS_URL: process.env.REDIS_URL || process.env.UPSTASH_REDIS_REST_URL
      }

      for (const [keyName, keyValue] of Object.entries(keys)) {
        if (keyValue) {
          this.storeEncryptedKey(keyName, keyValue)
          this.setupKeyRotation(keyName)
        }
      }

      logger.ai.info(`Secure key manager initialized with ${this.encryptedKeys.size} keys`)
    } catch (error) {
      logger.ai.error('secure-keys', error as Error)
    }
  }

  private storeEncryptedKey(keyName: string, keyValue: string): void {
    try {
      // Generate random IV for each key
      const iv = CryptoJS.lib.WordArray.random(16)
      
      // Encrypt the key
      const encrypted = CryptoJS.AES.encrypt(keyValue, this.ENCRYPTION_KEY, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      })

      // Store encrypted key with IV
      this.encryptedKeys.set(keyName, {
        encrypted: encrypted.toString(),
        iv: iv.toString(),
        tag: CryptoJS.HmacSHA256(encrypted.toString(), this.ENCRYPTION_KEY).toString()
      })

      logger.ai.info(`Key ${keyName} encrypted and stored securely`)
    } catch (error) {
      logger.ai.error('secure-keys', new Error(`Failed to encrypt key ${keyName}: ${error}`))
    }
  }

  private setupKeyRotation(keyName: string): void {
    const schedule: KeyRotationSchedule = {
      keyId: keyName,
      rotateAfter: 7 * 24 * 60 * 60 * 1000, // 7 days
      lastRotated: Date.now(),
      maxUsage: 10000, // Rotate after 10k uses
      currentUsage: 0
    }

    this.keyRotationSchedule.set(keyName, schedule)
  }

  async getDecryptedKey(keyName: string): Promise<string | null> {
    try {
      const encryptedData = this.encryptedKeys.get(keyName)
      if (!encryptedData) {
        logger.ai.warn(`Key ${keyName} not found in secure storage`)
        return null
      }

      // Verify integrity
      const expectedTag = CryptoJS.HmacSHA256(encryptedData.encrypted, this.ENCRYPTION_KEY).toString()
      if (expectedTag !== encryptedData.tag) {
        logger.ai.error('secure-keys', new Error(`Key ${keyName} integrity check failed`))
        return null
      }

      // Decrypt the key
      const decrypted = CryptoJS.AES.decrypt(encryptedData.encrypted, this.ENCRYPTION_KEY, {
        iv: CryptoJS.enc.Hex.parse(encryptedData.iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      })

      const decryptedKey = decrypted.toString(CryptoJS.enc.Utf8)
      
      if (!decryptedKey) {
        logger.ai.error('secure-keys', new Error(`Failed to decrypt key ${keyName}`))
        return null
      }

      // Track usage for rotation
      this.trackKeyUsage(keyName)

      return decryptedKey
    } catch (error) {
      logger.ai.error('secure-keys', error as Error)
      return null
    }
  }

  private trackKeyUsage(keyName: string): void {
    const schedule = this.keyRotationSchedule.get(keyName)
    if (schedule) {
      schedule.currentUsage++
      
      // Check if rotation is needed
      if (this.shouldRotateKey(schedule)) {
        logger.ai.warn(`Key ${keyName} should be rotated: ${schedule.currentUsage}/${schedule.maxUsage} uses, ${Date.now() - schedule.lastRotated}ms old`)
      }
    }
  }

  private shouldRotateKey(schedule: KeyRotationSchedule): boolean {
    const ageExceeded = (Date.now() - schedule.lastRotated) > schedule.rotateAfter
    const usageExceeded = schedule.currentUsage >= schedule.maxUsage
    
    return ageExceeded || usageExceeded
  }

  // Method to update a key (for rotation)
  async rotateKey(keyName: string, newKeyValue: string): Promise<boolean> {
    try {
      // Store the new encrypted key
      this.storeEncryptedKey(keyName, newKeyValue)
      
      // Reset rotation schedule
      const schedule = this.keyRotationSchedule.get(keyName)
      if (schedule) {
        schedule.lastRotated = Date.now()
        schedule.currentUsage = 0
      }

      logger.ai.info(`Key ${keyName} rotated successfully`)
      return true
    } catch (error) {
      logger.ai.error('secure-keys', error as Error)
      return false
    }
  }

  // Get key rotation status
  getKeyRotationStatus(): Array<{
    keyName: string
    needsRotation: boolean
    daysSinceRotation: number
    usagePercentage: number
  }> {
    const status: Array<{
      keyName: string
      needsRotation: boolean
      daysSinceRotation: number
      usagePercentage: number
    }> = []

    for (const [keyName, schedule] of this.keyRotationSchedule.entries()) {
      const daysSinceRotation = (Date.now() - schedule.lastRotated) / (24 * 60 * 60 * 1000)
      const usagePercentage = (schedule.currentUsage / schedule.maxUsage) * 100

      status.push({
        keyName,
        needsRotation: this.shouldRotateKey(schedule),
        daysSinceRotation: Math.round(daysSinceRotation * 100) / 100,
        usagePercentage: Math.round(usagePercentage * 100) / 100
      })
    }

    return status
  }

  // Health check for key manager
  async healthCheck(): Promise<{
    initialized: boolean
    keysLoaded: number
    rotationScheduled: number
    encryptionWorking: boolean
  }> {
    try {
      // Test encryption/decryption
      const testKey = 'test-key'
      const testValue = 'test-value-' + Date.now()
      
      this.storeEncryptedKey(testKey, testValue)
      const decrypted = await this.getDecryptedKey(testKey)
      const encryptionWorking = decrypted === testValue
      
      // Cleanup test key
      this.encryptedKeys.delete(testKey)
      this.keyRotationSchedule.delete(testKey)

      return {
        initialized: true,
        keysLoaded: this.encryptedKeys.size,
        rotationScheduled: this.keyRotationSchedule.size,
        encryptionWorking
      }
    } catch (error) {
      logger.ai.error('secure-keys', error as Error)
      return {
        initialized: false,
        keysLoaded: 0,
        rotationScheduled: 0,
        encryptionWorking: false
      }
    }
  }

  // Utility method to mask keys for logging
  maskKey(key: string): string {
    if (!key || key.length < 8) return '***'
    
    const start = key.slice(0, 4)
    const end = key.slice(-4)
    const middle = '*'.repeat(Math.min(key.length - 8, 20))
    
    return `${start}${middle}${end}`
  }

  // Clean up method
  clearKeys(): void {
    this.encryptedKeys.clear()
    this.keyRotationSchedule.clear()
    logger.ai.info('All encrypted keys cleared from memory')
  }
}

// Export singleton instance
export const keyManager = new SecureKeyManager()

// Utility functions for common key access patterns
export async function getAnthropicKey(): Promise<string | null> {
  return await keyManager.getDecryptedKey('ANTHROPIC_API_KEY')
}

export async function getOpenAIKey(): Promise<string | null> {
  return await keyManager.getDecryptedKey('OPENAI_API_KEY')
}

export async function getStripeKey(): Promise<string | null> {
  return await keyManager.getDecryptedKey('STRIPE_SECRET_KEY')
}

export async function getSupabaseServiceKey(): Promise<string | null> {
  return await keyManager.getDecryptedKey('SUPABASE_SERVICE_ROLE_KEY')
}

export async function getDatabaseUrl(): Promise<string | null> {
  return await keyManager.getDecryptedKey('DATABASE_URL')
}

export async function getRedisUrl(): Promise<string | null> {
  return await keyManager.getDecryptedKey('REDIS_URL')
}