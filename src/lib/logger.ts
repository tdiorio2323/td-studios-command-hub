/**
 * Production-safe logging utility for TD Studios
 * Replaces console.log statements with structured logging
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: any;
  timestamp: string;
  service: string;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isTest = process.env.NODE_ENV === 'test';

  private formatLog(level: LogLevel, message: string, data?: any, service = 'td-studios'): LogEntry {
    return {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
      service
    };
  }

  private shouldLog(level: LogLevel): boolean {
    // In production, only log warn and error
    if (!this.isDevelopment && !this.isTest) {
      return level === 'warn' || level === 'error';
    }
    return true;
  }

  private writeLog(entry: LogEntry): void {
    if (!this.shouldLog(entry.level)) return;

    // In development, use console for better DX
    if (this.isDevelopment) {
      const logFunction = {
        debug: console.debug,
        info: console.log,
        warn: console.warn,
        error: console.error
      }[entry.level];

      logFunction(`[${entry.level.toUpperCase()}] ${entry.message}`, entry.data || '');
      return;
    }

    // In production, use structured JSON logging
    // This can be captured by monitoring services like DataDog, LogRocket, etc.
    const logLine = JSON.stringify(entry);

    if (entry.level === 'error') {
      console.error(logLine);
    } else if (entry.level === 'warn') {
      console.warn(logLine);
    }
  }

  debug(message: string, data?: any): void {
    this.writeLog(this.formatLog('debug', message, data));
  }

  info(message: string, data?: any): void {
    this.writeLog(this.formatLog('info', message, data));
  }

  warn(message: string, data?: any): void {
    this.writeLog(this.formatLog('warn', message, data));
  }

  error(message: string, error?: Error | any): void {
    const errorData = error instanceof Error
      ? {
          name: error.name,
          message: error.message,
          stack: error.stack
        }
      : error;

    this.writeLog(this.formatLog('error', message, errorData));
  }

  // API-specific logging methods
  apiRequest(method: string, path: string, duration?: number): void {
    this.info(`API Request: ${method} ${path}`, { duration });
  }

  apiError(method: string, path: string, error: Error, statusCode?: number): void {
    this.error(`API Error: ${method} ${path}`, {
      error: error.message,
      statusCode,
      stack: this.isDevelopment ? error.stack : undefined
    });
  }

  // AI-specific logging
  aiRequest(model: string, tokens?: number, cost?: number): void {
    this.info(`AI Request: ${model}`, { tokens, cost });
  }

  aiError(model: string, error: Error): void {
    this.error(`AI Error: ${model}`, error);
  }

  // Security logging
  securityEvent(event: string, details?: any): void {
    this.warn(`Security Event: ${event}`, details);
  }

  // Add structured logging interfaces that the codebase expects
  ai = {
    info: (message: string, data?: any) => this.info(`[AI] ${message}`, data),
    warn: (message: string, data?: any) => this.warn(`[AI] ${message}`, data),
    error: (service: string, error: Error) => this.error(`[AI:${service}] Error`, error)
  };

  api = {
    info: (message: string, data?: any) => this.info(`[API] ${message}`, data),
    warn: (message: string, data?: any) => this.warn(`[API] ${message}`, data),
    error: (method: string, path: string, error: Error) => this.error(`[API] ${method} ${path}`, error)
  };

  security = (event: string, details?: any) => this.warn(`[SECURITY] ${event}`, details);
}

// Export singleton instance
export const logger = new Logger();

// Convenience exports for common patterns
export const log = {
  debug: logger.debug.bind(logger),
  info: logger.info.bind(logger),
  warn: logger.warn.bind(logger),
  error: logger.error.bind(logger),
  api: {
    request: logger.apiRequest.bind(logger),
    error: logger.apiError.bind(logger)
  },
  ai: {
    request: logger.aiRequest.bind(logger),
    error: logger.aiError.bind(logger)
  },
  security: logger.securityEvent.bind(logger)
};
