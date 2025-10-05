/**
 * File: app-config.service.ts
 * Purpose: Application configuration service for the BlickTrack backend API. Centralizes all configuration management including environment variables, feature flags, database settings, JWT configuration, and external service integrations. Provides type-safe configuration access throughout the application.
 *
 * Key Functions / Components / Classes:
 *   - AppConfigService: Main configuration service class
 *   - Environment Configuration: Port, NODE_ENV, and environment detection
 *   - Feature Flags: Debug features, health endpoints, logging configuration
 *   - Database Configuration: Database URL, Redis URL configuration
 *   - JWT Configuration: Secret, expiration, and authentication settings
 *   - CORS Configuration: Cross-origin resource sharing settings
 *   - Rate Limiting: Request rate limiting configuration
 *   - Password Configuration: Bcrypt rounds and security settings
 *   - Email Configuration: SMTP settings for email services
 *   - External APIs: Third-party service API keys and configuration
 *   - Validation: Configuration validation and error handling
 *
 * Inputs:
 *   - Environment variables from process.env
 *   - Configuration service from NestJS
 *   - Default values for configuration options
 *
 * Outputs:
 *   - Type-safe configuration values
 *   - Environment-specific settings
 *   - Feature flag configurations
 *   - Validation errors for missing required config
 *
 * Dependencies:
 *   - @nestjs/common for Injectable decorator
 *   - @nestjs/config for ConfigService
 *   - Environment variables
 *
 * Notes:
 *   - Implements comprehensive configuration management
 *   - Provides type-safe configuration access
 *   - Includes feature flags for development
 *   - Validates required configuration on startup
 *   - Supports multiple environments and external services
 */

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  // App Configuration
  get port(): number {
    return this.configService.get<number>('PORT') || 3001;
  }

  get nodeEnv(): string {
    return this.configService.get<string>('NODE_ENV') || 'development';
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  // Development Features Configuration
  get enableDebugFeatures(): boolean {
    return this.configService.get<string>('ENABLE_DEBUG_FEATURES') === 'true' || this.isDevelopment;
  }

  get enableHealthEndpoints(): boolean {
    return this.configService.get<string>('ENABLE_HEALTH_ENDPOINTS') === 'true' || this.isDevelopment;
  }

  get enableVerboseLogging(): boolean {
    return this.configService.get<string>('ENABLE_VERBOSE_LOGGING') === 'true' || this.isDevelopment;
  }

  get enableConsoleLogging(): boolean {
    return this.configService.get<string>('ENABLE_CONSOLE_LOGGING') === 'true' || this.isDevelopment;
  }

  // Database Configuration
  get databaseUrl(): string {
    return this.configService.get<string>('DATABASE_URL') || '';
  }

  get redisUrl(): string {
    return this.configService.get<string>('REDIS_URL') || 'redis://localhost:6379';
  }

  // JWT Configuration
  get jwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET') || 'fallback-secret';
  }

  get jwtExpiresIn(): string {
    return this.configService.get<string>('JWT_EXPIRES_IN') || '7d';
  }

  // CORS Configuration
  get corsOrigin(): string | string[] {
    const origin = this.configService.get<string>('CORS_ORIGIN');
    if (!origin) return 'http://localhost:3000';
    
    // Support multiple origins separated by comma
    return origin.includes(',') ? origin.split(',').map(o => o.trim()) : origin;
  }

  // Rate Limiting Configuration
  get rateLimitWindowMs(): number {
    return this.configService.get<number>('RATE_LIMIT_WINDOW_MS') || 900000; // 15 minutes
  }

  get rateLimitMaxRequests(): number {
    return this.configService.get<number>('RATE_LIMIT_MAX_REQUESTS') || 100;
  }

  // Password Configuration
  get bcryptRounds(): number {
    return this.configService.get<number>('BCRYPT_ROUNDS') || 12;
  }

  // Email Configuration
  get smtpHost(): string {
    return this.configService.get<string>('EMAIL_SMTP_HOST') || 'smtp.gmail.com';
  }

  get smtpPort(): number {
    return this.configService.get<number>('EMAIL_SMTP_PORT') || 587;
  }

  get smtpUser(): string {
    return this.configService.get<string>('EMAIL_USER') || '';
  }

  get smtpPass(): string {
    return this.configService.get<string>('EMAIL_PASS') || '';
  }

  // External APIs
  get haveibeenpwnedApiKey(): string {
    return this.configService.get<string>('HAVEIBEENPWNED_API_KEY') || '';
  }

  get twilioAccountSid(): string {
    return this.configService.get<string>('TWILIO_ACCOUNT_SID') || '';
  }

  get twilioAuthToken(): string {
    return this.configService.get<string>('TWILIO_AUTH_TOKEN') || '';
  }

  // Validation
  validateConfig(): void {
    const requiredConfigs = [
      { key: 'DATABASE_URL', value: this.databaseUrl },
      { key: 'JWT_SECRET', value: this.jwtSecret },
    ];

    const missing = requiredConfigs.filter(config => !config.value);
    
    if (missing.length > 0) {
      throw new Error(
        `Missing required configuration: ${missing.map(c => c.key).join(', ')}`
      );
    }
  }
}