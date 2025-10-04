/**
 * File: app.module.ts
 * Purpose: Root application module for the BlickTrack backend API. Configures all core modules, services, and middleware for the enterprise cybersecurity platform. Sets up global configuration, rate limiting, and module dependencies.
 * 
 * Key Functions / Components / Classes:
 *   - AppModule: Main application module class
 *   - ConfigModule: Global configuration management
 *   - ThrottlerModule: Rate limiting and request throttling
 *   - PrismaModule: Database ORM and connection management
 *   - AuthModule: Authentication and authorization
 *   - AdminModule: Administrative functionality
 *   - HealthModule: System health monitoring
 *
 * Inputs:
 *   - Environment variables from .env file
 *   - Module configurations and dependencies
 *   - Rate limiting configuration
 *   - Database connection settings
 *
 * Outputs:
 *   - Configured NestJS application module
 *   - Global configuration service
 *   - Rate limiting middleware
 *   - Database connection service
 *   - Authentication and authorization services
 *
 * Dependencies:
 *   - NestJS core modules
 *   - Prisma for database operations
 *   - Throttler for rate limiting
 *   - ConfigModule for environment management
 *
 * Notes:
 *   - Implements modular architecture for scalability
 *   - Configures global rate limiting for security
 *   - Sets up comprehensive module dependencies
 *   - Provides centralized configuration management
 *   - Supports enterprise-grade security features
 */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { HealthModule } from './health/health.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { TenantsModule } from './tenants/tenants.module';
import { EmailModule } from './common/email/email.module';

@Module({
  imports: [
    // Configuration - Global configuration for all modules
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    // Rate limiting - Protect against brute force and DDoS attacks
    ThrottlerModule.forRoot([{
      ttl: 60000, // 1 minute
      limit: 100, // 100 requests per minute
    }]),
    
    // Global email service - Available to all modules without importing
    EmailModule,
    
    // Core modules
    PrismaModule,
    AuthModule,
    AdminModule,
    HealthModule,
    DashboardModule,
    TenantsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
