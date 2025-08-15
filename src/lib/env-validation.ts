import { logger } from '@/lib/logger';
/**
 * Environment Variable Validation
 * Ensures all required environment variables are present at runtime
 */

interface EnvConfig {
  // Database
  DATABASE_URL: string
  DIRECT_URL: string
  
  // Authentication
  NEXTAUTH_SECRET: string
  NEXTAUTH_URL: string
  
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: string
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string
  SUPABASE_SERVICE_ROLE_KEY: string
  
  // AI Services (Optional but recommended)
  OPENAI_API_KEY?: string
  ANTHROPIC_API_KEY?: string
  
  // Email (Optional)
  RESEND_API_KEY?: string
  
  // Payments (Optional)
  STRIPE_SECRET_KEY?: string
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?: string
  
  // App Configuration
  NEXT_PUBLIC_APP_URL: string
  NEXT_PUBLIC_PORTAL_URL: string
}

class EnvironmentValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'EnvironmentValidationError'
  }
}

function validateEnvVar(name: keyof EnvConfig, required: boolean = true): string | undefined {
  const value = process.env[name]
  
  if (!value || value.startsWith('your_') || value === 'your_' + name.toLowerCase() + '_here') {
    if (required) {
      throw new EnvironmentValidationError(
        `❌ Missing required environment variable: ${name}\n` +
        `💡 Add ${name}=<your_value> to your environment variables\n` +
        `📚 Check .env.example for more details`
      )
    }
    return undefined
  }
  
  return value
}

function validateEnvironment(): EnvConfig {
  try {
    // Required variables
    const config: EnvConfig = {
      // Database
      DATABASE_URL: validateEnvVar('DATABASE_URL')!,
      DIRECT_URL: validateEnvVar('DIRECT_URL')!,
      
      // Authentication
      NEXTAUTH_SECRET: validateEnvVar('NEXTAUTH_SECRET')!,
      NEXTAUTH_URL: validateEnvVar('NEXTAUTH_URL')!,
      
      // Supabase
      NEXT_PUBLIC_SUPABASE_URL: validateEnvVar('NEXT_PUBLIC_SUPABASE_URL')!,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: validateEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY')!,
      SUPABASE_SERVICE_ROLE_KEY: validateEnvVar('SUPABASE_SERVICE_ROLE_KEY')!,
      
      // App Configuration
      NEXT_PUBLIC_APP_URL: validateEnvVar('NEXT_PUBLIC_APP_URL')!,
      NEXT_PUBLIC_PORTAL_URL: validateEnvVar('NEXT_PUBLIC_PORTAL_URL')!,
      
      // Optional variables
      OPENAI_API_KEY: validateEnvVar('OPENAI_API_KEY', false),
      ANTHROPIC_API_KEY: validateEnvVar('ANTHROPIC_API_KEY', false),
      RESEND_API_KEY: validateEnvVar('RESEND_API_KEY', false),
      STRIPE_SECRET_KEY: validateEnvVar('STRIPE_SECRET_KEY', false),
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: validateEnvVar('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', false),
    }
    
    // Warnings for optional but important variables
    if (!config.OPENAI_API_KEY && !config.ANTHROPIC_API_KEY) {
      logger.warn('⚠️  No AI service keys found. AI features will be disabled.')
    }
    
    if (!config.STRIPE_SECRET_KEY) {
      logger.warn('⚠️  No Stripe keys found. Payment features will be disabled.')
    }
    
    if (!config.RESEND_API_KEY) {
      logger.warn('⚠️  No email service key found. Email features may not work.')
    }
    
    logger.info('✅ Environment validation passed')
    return config
    
  } catch (error) {
    logger.error('\n🚨 Environment Validation Failed:')
    logger.error('=====================================')
    
    if (error instanceof EnvironmentValidationError) {
      logger.error(error.message)
    } else {
      logger.error('❌ Unexpected error during environment validation:', error)
    }
    
    logger.error('\n🔧 Quick Fix:')
    logger.error('1. Copy .env.example to .env.local')
    logger.error('2. Replace placeholder values with real credentials')
    logger.error('3. For production, set environment variables in your hosting platform')
    logger.error('4. Run: npm run setup-env for guided setup\n')
    
    // In development, we can be more lenient, but still show the error
    if (process.env.NODE_ENV === 'development') {
      logger.error('⚠️  Continuing in development mode with missing variables...')
      return {} as EnvConfig
    }
    
    // In production, this should cause the app to fail fast
    process.exit(1)
  }
}

// Export validated environment configuration
export const env = validateEnvironment()

// Helper functions for common checks
export const hasAIServices = () => !!(env.OPENAI_API_KEY || env.ANTHROPIC_API_KEY)
export const hasPaymentServices = () => !!(env.STRIPE_SECRET_KEY)
export const hasEmailServices = () => !!(env.RESEND_API_KEY)

// Development helper - lists all missing variables
export function listMissingVariables(): string[] {
  const missing: string[] = []
  
  const requiredVars: Array<keyof EnvConfig> = [
    'DATABASE_URL',
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'NEXTAUTH_SECRET'
  ]
  
  requiredVars.forEach(varName => {
    const value = process.env[varName]
    if (!value || value.startsWith('your_')) {
      missing.push(varName)
    }
  })
  
  return missing
}