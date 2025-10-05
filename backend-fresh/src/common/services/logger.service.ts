/**
 * File: logger.service.ts
 * Purpose: Configurable logger service for the BlickTrack backend API. 
 * Provides debug logging capabilities that can be enabled/disabled via environment configuration.
 * Supports different log levels and contextual logging for better debugging and production monitoring.
 * 
 * Key Functions / Components / Classes:
 *   - LoggerService: Main logging service class
 *   - debug: Log debug messages (can be disabled via config)
 *   - info: Log informational messages
 *   - warn: Log warning messages
 *   - error: Log error messages with stack traces
 *   - setContext: Set logging context for better traceability
 *
 * Inputs:
 *   - Log messages and optional context data
 *   - Environment configuration for log levels
 *   - Error objects with stack traces
 *
 * Outputs:
 *   - Formatted console log messages
 *   - Structured log data for monitoring
 *   - Contextual information for debugging
 *
 * Dependencies:
 *   - ConfigService for environment variables
 *   - NestJS Injectable decorator
 *
 * Environment Variables:
 *   - DEBUG_ENABLED: Enable/disable debug logging (default: false)
 *   - LOG_LEVEL: Minimum log level (debug, info, warn, error)
 *   - NODE_ENV: Environment (development, production)
 *
 * Notes:
 *   - Debug logs are automatically disabled in production unless explicitly enabled
 *   - All logs include timestamp, context, and severity level
 *   - Color-coded output for better readability in development
 *   - Supports structured logging for easy parsing and monitoring
 *   - Can be extended to support external logging services (e.g., Winston, Pino)
 */

import { Injectable, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService {
  private context?: string;
  private readonly debugEnabled: boolean;
  private readonly logLevel: LogLevel;
  private readonly isProduction: boolean;

  constructor(private configService: ConfigService) {
    // Initialize logger configuration from environment variables
    this.debugEnabled = this.configService.get<boolean>('DEBUG_ENABLED', false);
    this.isProduction = this.configService.get<string>('NODE_ENV') === 'production';
    
    // Parse log level from environment (default to INFO in production, DEBUG in development)
    const logLevelString = this.configService.get<string>('LOG_LEVEL', this.isProduction ? 'info' : 'debug');
    this.logLevel = this.parseLogLevel(logLevelString);

    // Log initialization info
    if (!this.isProduction) {
      console.log(`🔧 [Logger] Initialized - Debug: ${this.debugEnabled}, Level: ${logLevelString}, Env: ${this.configService.get('NODE_ENV')}`);
    }
  }

  /**
   * Set the logging context for this logger instance
   * Context helps identify which module/service is generating logs
   * 
   * @param context - The context name (e.g., 'AuthService', 'UserController')
   */
  setContext(context: string): void {
    this.context = context;
  }

  /**
   * Log debug-level messages
   * Only logs if DEBUG_ENABLED=true or LOG_LEVEL=debug
   * Automatically disabled in production unless explicitly enabled
   * 
   * @param message - The debug message to log
   * @param data - Optional additional data to include
   * 
   * Example:
   *   logger.debug('User validation started', { userId: '123', email: 'user@example.com' });
   */
  debug(message: string, data?: any): void {
    // Skip debug logs if disabled or log level is too high
    if (!this.shouldLog(LogLevel.DEBUG)) {
      return;
    }

    const timestamp = new Date().toISOString();
    const contextStr = this.context ? `[${this.context}]` : '';
    
    // Color-coded output for development (blue for debug)
    if (!this.isProduction) {
      console.log(`\x1b[36m🔍 [DEBUG] ${timestamp} ${contextStr}\x1b[0m ${message}`);
      if (data) {
        console.log('\x1b[36m   Data:\x1b[0m', JSON.stringify(data, null, 2));
      }
    } else {
      // Structured logging for production
      console.log(JSON.stringify({
        level: 'debug',
        timestamp,
        context: this.context,
        message,
        data,
      }));
    }
  }

  /**
   * Log info-level messages
   * Used for general informational messages about application flow
   * 
   * @param message - The info message to log
   * @param data - Optional additional data to include
   * 
   * Example:
   *   logger.info('User logged in successfully', { userId: '123' });
   */
  info(message: string, data?: any): void {
    if (!this.shouldLog(LogLevel.INFO)) {
      return;
    }

    const timestamp = new Date().toISOString();
    const contextStr = this.context ? `[${this.context}]` : '';
    
    // Color-coded output for development (green for info)
    if (!this.isProduction) {
      console.log(`\x1b[32m✅ [INFO] ${timestamp} ${contextStr}\x1b[0m ${message}`);
      if (data) {
        console.log('\x1b[32m   Data:\x1b[0m', JSON.stringify(data, null, 2));
      }
    } else {
      console.log(JSON.stringify({
        level: 'info',
        timestamp,
        context: this.context,
        message,
        data,
      }));
    }
  }

  /**
   * Log warning-level messages
   * Used for potentially problematic situations that don't prevent execution
   * 
   * @param message - The warning message to log
   * @param data - Optional additional data to include
   * 
   * Example:
   *   logger.warn('User session about to expire', { userId: '123', expiresIn: '5m' });
   */
  warn(message: string, data?: any): void {
    if (!this.shouldLog(LogLevel.WARN)) {
      return;
    }

    const timestamp = new Date().toISOString();
    const contextStr = this.context ? `[${this.context}]` : '';
    
    // Color-coded output for development (yellow for warn)
    if (!this.isProduction) {
      console.warn(`\x1b[33m⚠️  [WARN] ${timestamp} ${contextStr}\x1b[0m ${message}`);
      if (data) {
        console.warn('\x1b[33m   Data:\x1b[0m', JSON.stringify(data, null, 2));
      }
    } else {
      console.warn(JSON.stringify({
        level: 'warn',
        timestamp,
        context: this.context,
        message,
        data,
      }));
    }
  }

  /**
   * Log error-level messages
   * Used for errors and exceptions that need immediate attention
   * 
   * @param message - The error message to log
   * @param error - Error object or stack trace
   * @param data - Optional additional data to include
   * 
   * Example:
   *   logger.error('Failed to authenticate user', error, { email: 'user@example.com' });
   */
  error(message: string, error?: Error | string, data?: any): void {
    if (!this.shouldLog(LogLevel.ERROR)) {
      return;
    }

    const timestamp = new Date().toISOString();
    const contextStr = this.context ? `[${this.context}]` : '';
    
    // Color-coded output for development (red for error)
    if (!this.isProduction) {
      console.error(`\x1b[31m❌ [ERROR] ${timestamp} ${contextStr}\x1b[0m ${message}`);
      if (error) {
        if (error instanceof Error) {
          console.error('\x1b[31m   Error:\x1b[0m', error.message);
          console.error('\x1b[31m   Stack:\x1b[0m', error.stack);
        } else {
          console.error('\x1b[31m   Error:\x1b[0m', error);
        }
      }
      if (data) {
        console.error('\x1b[31m   Data:\x1b[0m', JSON.stringify(data, null, 2));
      }
    } else {
      console.error(JSON.stringify({
        level: 'error',
        timestamp,
        context: this.context,
        message,
        error: error instanceof Error ? {
          message: error.message,
          stack: error.stack,
          name: error.name,
        } : error,
        data,
      }));
    }
  }

  /**
   * Parse log level string to LogLevel enum
   * 
   * @param level - Log level string (debug, info, warn, error)
   * @returns LogLevel enum value
   */
  private parseLogLevel(level: string): LogLevel {
    switch (level.toLowerCase()) {
      case 'debug':
        return LogLevel.DEBUG;
      case 'info':
        return LogLevel.INFO;
      case 'warn':
        return LogLevel.WARN;
      case 'error':
        return LogLevel.ERROR;
      default:
        return LogLevel.INFO;
    }
  }

  /**
   * Check if a message should be logged based on current log level
   * 
   * @param messageLevel - The level of the message to log
   * @returns true if message should be logged, false otherwise
   */
  private shouldLog(messageLevel: LogLevel): boolean {
    // Special case: debug logs require explicit enabling
    if (messageLevel === LogLevel.DEBUG) {
      return this.debugEnabled || this.logLevel === LogLevel.DEBUG;
    }
    
    // For other levels, check against configured log level
    return messageLevel >= this.logLevel;
  }
}

