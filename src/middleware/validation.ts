/**
 * Input validation middleware for TD Studios API endpoints
 * Provides security against injection attacks, XSS, and malicious inputs
 */

import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

// Maximum request sizes (in bytes)
const MAX_REQUEST_SIZE = {
  chat: 100 * 1024, // 100KB for chat messages
  image: 50 * 1024,  // 50KB for image analysis prompts
  content: 200 * 1024, // 200KB for content generation
  default: 50 * 1024   // 50KB default
};

// Rate limiting (in-memory store - use Redis in production)
interface RateLimitEntry {
  count: number;
  windowStart: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Suspicious patterns that might indicate injection attempts
const SUSPICIOUS_PATTERNS = [
  /javascript:/i,
  /<script[^>]*>/i,
  /on\w+\s*=/i,
  /eval\s*\(/i,
  /document\s*\./i,
  /window\s*\./i,
  /prompt\s*\(/i,
  /alert\s*\(/i,
  /confirm\s*\(/i,
  /\${.*}/,  // Template literal injection
  /\.\.\//,  // Path traversal
  /\bUNION\b.*\bSELECT\b/i, // SQL injection patterns
  /\bDROP\b.*\bTABLE\b/i,
  /\bINSERT\b.*\bINTO\b/i,
  /\bUPDATE\b.*\bSET\b/i,
  /\bDELETE\b.*\bFROM\b/i,
];

// Known malicious prompt patterns
const PROMPT_INJECTION_PATTERNS = [
  /ignore.{0,20}previous.{0,20}instructions/i,
  /forget.{0,20}everything.{0,20}above/i,
  /disregard.{0,20}system.{0,20}prompt/i,
  /you.{0,20}are.{0,20}now.{0,20}(a|an)/i,
  /pretend.{0,20}to.{0,20}be/i,
  /act.{0,20}as.{0,20}if/i,
  /roleplay.{0,20}as/i,
  /simulate.{0,20}being/i,
  /jailbreak/i,
  /developer.{0,20}mode/i,
];

export interface ValidationConfig {
  maxSize?: number;
  rateLimit?: {
    requests: number;
    windowMs: number;
  };
  checkPromptInjection?: boolean;
  allowedFields?: string[];
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public field?: string,
    public code?: string
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function getClientId(request: NextRequest): string {
  // In production, use a more sophisticated client identification
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwarded?.split(',')[0] || realIp || 'unknown';
  
  // Add user agent for better fingerprinting
  const userAgent = request.headers.get('user-agent') || '';
  return `${ip}-${userAgent.slice(0, 50)}`;
}

export function checkRateLimit(
  clientId: string, 
  config: { requests: number; windowMs: number }
): boolean {
  const now = Date.now();
  const windowStart = Math.floor(now / config.windowMs) * config.windowMs;
  
  const entry = rateLimitStore.get(clientId);
  
  if (!entry || entry.windowStart < windowStart) {
    rateLimitStore.set(clientId, { count: 1, windowStart });
    return true;
  }
  
  if (entry.count >= config.requests) {
    return false;
  }
  
  entry.count++;
  return true;
}

export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: URLs
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
}

export function validateMessageContent(content: string): void {
  if (!content || typeof content !== 'string') {
    throw new ValidationError('Message content is required and must be a string', 'content');
  }

  if (content.length > 10000) {
    throw new ValidationError('Message content too long (max 10,000 characters)', 'content');
  }

  if (content.length < 1) {
    throw new ValidationError('Message content cannot be empty', 'content');
  }

  // Check for suspicious patterns
  for (const pattern of SUSPICIOUS_PATTERNS) {
    if (pattern.test(content)) {
      throw new ValidationError('Message contains potentially malicious content', 'content', 'SUSPICIOUS_PATTERN');
    }
  }

  // Check for prompt injection attempts
  for (const pattern of PROMPT_INJECTION_PATTERNS) {
    if (pattern.test(content)) {
      throw new ValidationError('Message contains prompt injection attempt', 'content', 'PROMPT_INJECTION');
    }
  }
}

export function validateRequestSize(request: NextRequest, maxSize: number): void {
  const contentLength = request.headers.get('content-length');
  if (contentLength && parseInt(contentLength) > maxSize) {
    throw new ValidationError(
      `Request too large (max ${Math.round(maxSize / 1024)}KB)`, 
      'size',
      'REQUEST_TOO_LARGE'
    );
  }
}

export async function validateAIRequest(
  request: NextRequest,
  config: ValidationConfig = {}
): Promise<any> {
  const clientId = getClientId(request);
  
  try {
    // Check rate limiting
    const rateLimit = config.rateLimit || { requests: 20, windowMs: 60000 }; // 20 requests per minute
    if (!checkRateLimit(clientId, rateLimit)) {
      logger.security('Rate limit exceeded', { clientId, endpoint: request.url });
      throw new ValidationError('Rate limit exceeded', 'rate_limit', 'RATE_LIMIT_EXCEEDED');
    }

    // Check request size
    const maxSize = config.maxSize || MAX_REQUEST_SIZE.default;
    validateRequestSize(request, maxSize);

    // Parse and validate JSON body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      throw new ValidationError('Invalid JSON in request body', 'body', 'INVALID_JSON');
    }

    // Validate required fields
    if (config.allowedFields) {
      const extraFields = Object.keys(body).filter(key => !config.allowedFields!.includes(key));
      if (extraFields.length > 0) {
        throw new ValidationError(
          `Unexpected fields: ${extraFields.join(', ')}`, 
          'fields',
          'UNEXPECTED_FIELDS'
        );
      }
    }

    // Validate message content if present
    if (body.messages && Array.isArray(body.messages)) {
      for (const message of body.messages) {
        if (message.content) {
          validateMessageContent(message.content);
        }
      }
    }

    // Validate single message content
    if (body.message || body.content || body.prompt) {
      const content = body.message || body.content || body.prompt;
      validateMessageContent(content);
    }

    // Sanitize string fields
    const sanitizedBody = { ...body };
    if (sanitizedBody.messages && Array.isArray(sanitizedBody.messages)) {
      sanitizedBody.messages = sanitizedBody.messages.map((msg: any) => ({
        ...msg,
        content: typeof msg.content === 'string' ? sanitizeInput(msg.content) : msg.content
      }));
    }

    logger.info('AI request validated', { 
      clientId: clientId.slice(0, 20) + '...', 
      endpoint: request.url,
      messageCount: sanitizedBody.messages?.length || 0
    });

    return sanitizedBody;

  } catch (error) {
    if (error instanceof ValidationError) {
      logger.security('Input validation failed', {
        clientId: clientId.slice(0, 20) + '...',
        error: error.message,
        field: error.field,
        code: error.code,
        endpoint: request.url
      });
      throw error;
    }
    
    logger.error('Validation error', error);
    throw new ValidationError('Validation failed', undefined, 'VALIDATION_ERROR');
  }
}

export function createValidationResponse(error: ValidationError): NextResponse {
  const statusCode = {
    'RATE_LIMIT_EXCEEDED': 429,
    'REQUEST_TOO_LARGE': 413,
    'SUSPICIOUS_PATTERN': 400,
    'PROMPT_INJECTION': 400,
    'INVALID_JSON': 400,
    'UNEXPECTED_FIELDS': 400
  }[error.code || ''] || 400;

  return NextResponse.json(
    {
      error: error.message,
      field: error.field,
      code: error.code
    },
    { status: statusCode }
  );
}