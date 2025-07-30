import { z } from 'zod'

// Base schemas for common types
export const AIMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1).max(100000)
})

export const ModelVariantSchema = z.enum([
  'claude-3-5-sonnet-20241022',
  'claude-3-opus-20240229',
  'claude-3-haiku-20240307',
  'gpt-4',
  'gpt-4-turbo',
  'gpt-3.5-turbo'
])

export const TaskComplexitySchema = z.enum(['low', 'medium', 'high'])

export const UrgencyLevelSchema = z.enum(['low', 'medium', 'high', 'urgent'])

// API Request Schemas
export const ChatRequestSchema = z.object({
  messages: z.array(AIMessageSchema).min(1).max(50),
  model: z.enum(['claude', 'gpt', 'compare']).default('claude'),
  modelVariant: ModelVariantSchema.optional(),
  complexity: TaskComplexitySchema.default('medium'),
  sessionId: z.string().uuid().optional(),
  context: z.record(z.any()).optional()
})

export const ContentGenerationRequestSchema = z.object({
  type: z.enum(['blog', 'social', 'email', 'code', 'documentation']),
  prompt: z.string().min(10).max(5000),
  tone: z.string().optional(),
  audience: z.string().optional(),
  brandVoice: z.string().optional(),
  metadata: z.record(z.any()).optional()
})

export const TaskPrioritizationRequestSchema = z.object({
  tasks: z.array(z.string().min(1).max(500)).min(1).max(20)
})

export const ImageAnalysisRequestSchema = z.object({
  imageData: z.string().refine(
    (data) => {
      try {
        // Basic base64 validation
        return Buffer.from(data, 'base64').toString('base64') === data
      } catch {
        return false
      }
    },
    { message: 'Invalid base64 image data' }
  ),
  prompt: z.string().max(1000).default('Describe this image in detail'),
  provider: z.enum(['claude', 'gpt']).default('claude')
})

export const ImageGenerationRequestSchema = z.object({
  prompt: z.string().min(10).max(1000),
  size: z.enum(['1024x1024', '1792x1024', '1024x1792']).default('1024x1024'),
  quality: z.enum(['standard', 'hd']).default('standard')
})

export const DocumentProcessingRequestSchema = z.object({
  content: z.string().min(10).max(100000),
  processingType: z.enum(['summarize', 'extract', 'analyze', 'categorize']),
  language: z.string().optional(),
  metadata: z.record(z.any()).optional()
})

export const PredictiveAnalyticsRequestSchema = z.object({
  data: z.array(z.number()).min(5).max(1000),
  metricType: z.string().min(1).max(100),
  timeLabels: z.array(z.string()).optional(),
  confidence: z.number().min(0).max(1).optional()
})

export const BusinessIntelligenceRequestSchema = z.object({
  revenue: z.array(z.number()).min(1).max(100),
  customers: z.array(z.number()).min(1).max(100),
  engagement: z.array(z.number()).min(1).max(100),
  costs: z.array(z.number()).min(1).max(100),
  timeframe: z.array(z.string()).min(1).max(100)
})

// API Response Schemas
export const APIResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
  metadata: z.object({
    timestamp: z.string(),
    requestId: z.string().uuid(),
    processingTime: z.number(),
    model: z.string().optional(),
    provider: z.string().optional(),
    rateLimitRemaining: z.number().optional()
  })
})

export const TaskPrioritySchema = z.object({
  task: z.string(),
  priority: z.number().min(1).max(10),
  reasoning: z.string(),
  urgency: UrgencyLevelSchema
})

export const ContentGenerationResponseSchema = z.object({
  type: z.enum(['blog', 'social', 'email', 'code', 'documentation']),
  content: z.string(),
  metadata: z.object({
    title: z.string().optional(),
    tags: z.array(z.string()).optional(),
    wordCount: z.number().optional(),
    seo: z.any().optional(),
    generatedAt: z.string().optional(),
    model: z.string().optional(),
    processingOptions: z.any().optional()
  }).optional()
})

export const PredictiveAnalyticsResponseSchema = z.object({
  prediction: z.any(),
  confidence: z.number().min(0).max(1),
  factors: z.array(z.string()),
  recommendation: z.string(),
  timeframe: z.string(),
  dataPoints: z.number()
})

export const TrendAnalysisResponseSchema = z.object({
  trend: z.enum(['upward', 'downward', 'stable', 'volatile']),
  strength: z.number().min(0).max(1),
  factors: z.array(z.string()),
  prediction: z.string(),
  recommendations: z.array(z.string()),
  dataRange: z.object({
    start: z.string(),
    end: z.string(),
    points: z.number()
  })
})

export const BusinessIntelligenceResponseSchema = z.object({
  insights: z.array(z.string()),
  metrics: z.record(z.number()),
  recommendations: z.array(z.string()),
  risks: z.array(z.string()),
  opportunities: z.array(z.string()),
  nextActions: z.array(z.string())
})

// Webhook schemas
export const StripeWebhookSchema = z.object({
  id: z.string(),
  object: z.literal('event'),
  api_version: z.string(),
  created: z.number(),
  data: z.object({
    object: z.any()
  }),
  livemode: z.boolean(),
  pending_webhooks: z.number(),
  request: z.object({
    id: z.string().optional(),
    idempotency_key: z.string().optional()
  }).optional(),
  type: z.string()
})

// User and Session schemas
export const SessionSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  email: z.string().email(),
  role: z.enum(['user', 'admin', 'moderator']),
  subscription: z.object({
    tier: z.enum(['starter', 'professional', 'enterprise']),
    status: z.enum(['active', 'inactive', 'cancelled', 'past_due']),
    limits: z.object({
      aiRequests: z.number(),
      users: z.number(),
      storage: z.number()
    }),
    usage: z.object({
      aiRequests: z.number(),
      users: z.number(),
      storage: z.number()
    })
  }),
  createdAt: z.string(),
  expiresAt: z.string()
})

export const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).default('system'),
  language: z.string().default('en'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(false),
    marketing: z.boolean().default(false)
  }).default({}),
  aiDefaults: z.object({
    preferredModel: z.enum(['claude', 'gpt']).default('claude'),
    complexity: TaskComplexitySchema.default('medium'),
    maxTokens: z.number().min(100).max(8000).default(4000)
  }).default({})
})

// File upload schemas
export const FileUploadSchema = z.object({
  filename: z.string().min(1).max(255),
  contentType: z.string().regex(/^[a-zA-Z0-9][a-zA-Z0-9!#$&\-\^_]*\/[a-zA-Z0-9][a-zA-Z0-9!#$&\-\^_.]*$/),
  size: z.number().min(1).max(50 * 1024 * 1024), // 50MB max
  data: z.string().refine(
    (data) => {
      try {
        Buffer.from(data, 'base64')
        return true
      } catch {
        return false
      }
    },
    { message: 'Invalid base64 file data' }
  )
})

// Analytics schemas
export const AnalyticsEventSchema = z.object({
  eventType: z.enum(['page_view', 'ai_request', 'user_action', 'error', 'performance']),
  userId: z.string().uuid().optional(),
  sessionId: z.string().uuid().optional(),
  timestamp: z.number(),
  properties: z.record(z.any()).optional(),
  metadata: z.object({
    userAgent: z.string().optional(),
    ip: z.string().optional(),
    referrer: z.string().optional(),
    path: z.string().optional()
  }).optional()
})

// Rate limiting schemas
export const RateLimitConfigSchema = z.object({
  windowMs: z.number().min(1000).max(24 * 60 * 60 * 1000), // 1 second to 24 hours
  maxRequests: z.number().min(1).max(10000),
  skipOnError: z.boolean().default(false)
})

// Health check schemas
export const HealthCheckResponseSchema = z.object({
  status: z.enum(['healthy', 'degraded', 'unhealthy']),
  timestamp: z.string(),
  services: z.record(z.object({
    status: z.enum(['up', 'down', 'degraded']),
    responseTime: z.number().optional(),
    message: z.string().optional()
  })),
  version: z.string(),
  uptime: z.number()
})

// Utility function to validate and parse data
export function validateSchema<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: true
  data: T
} | {
  success: false
  error: z.ZodError
} {
  const result = schema.safeParse(data)

  if (result.success) {
    return { success: true, data: result.data }
  } else {
    return { success: false, error: result.error }
  }
}

// Utility function to create API error responses from validation errors
export function formatValidationError(error: z.ZodError): {
  message: string
  details: Array<{
    field: string
    message: string
    received: any
  }>
} {
  return {
    message: 'Validation failed',
    details: error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message,
      received: 'received' in err ? err.received : undefined
    }))
  }
}

// Export all schema types for TypeScript inference
export type ChatRequest = z.infer<typeof ChatRequestSchema>
export type ContentGenerationRequest = z.infer<typeof ContentGenerationRequestSchema>
export type TaskPrioritizationRequest = z.infer<typeof TaskPrioritizationRequestSchema>
export type ImageAnalysisRequest = z.infer<typeof ImageAnalysisRequestSchema>
export type ImageGenerationRequest = z.infer<typeof ImageGenerationRequestSchema>
export type DocumentProcessingRequest = z.infer<typeof DocumentProcessingRequestSchema>
export type PredictiveAnalyticsRequest = z.infer<typeof PredictiveAnalyticsRequestSchema>
export type BusinessIntelligenceRequest = z.infer<typeof BusinessIntelligenceRequestSchema>
export type APIResponse = z.infer<typeof APIResponseSchema>
export type TaskPriority = z.infer<typeof TaskPrioritySchema>
export type ContentGenerationResponse = z.infer<typeof ContentGenerationResponseSchema>
export type PredictiveAnalyticsResponse = z.infer<typeof PredictiveAnalyticsResponseSchema>
export type TrendAnalysisResponse = z.infer<typeof TrendAnalysisResponseSchema>
export type BusinessIntelligenceResponse = z.infer<typeof BusinessIntelligenceResponseSchema>
export type Session = z.infer<typeof SessionSchema>
export type UserPreferences = z.infer<typeof UserPreferencesSchema>
export type FileUpload = z.infer<typeof FileUploadSchema>
export type AnalyticsEvent = z.infer<typeof AnalyticsEventSchema>
export type RateLimitConfig = z.infer<typeof RateLimitConfigSchema>
export type HealthCheckResponse = z.infer<typeof HealthCheckResponseSchema>
