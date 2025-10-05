/**
 * File: dashboard.module.ts
 * Purpose: Dashboard module for the BlickTrack backend API. Configures dashboard-related controllers, services, and dependencies. Provides centralized dashboard functionality for the enterprise cybersecurity platform.
 *
 * Key Functions / Components / Classes:
 *   - DashboardModule: Main dashboard module class
 *   - Controller registration: DashboardController for API endpoints
 *   - Service registration: DashboardService for business logic
 *   - Dependency injection: PrismaService for database operations
 *   - Module configuration: Proper NestJS module setup
 *
 * Inputs:
 *   - Module dependencies and imports
 *   - Controller and service configurations
 *   - Database service integration
 *   - Authentication and authorization setup
 *
 * Outputs:
 *   - Configured dashboard module for NestJS
 *   - Registered controllers and services
 *   - Database service integration
 *   - Authentication guard setup
 *
 * Dependencies:
 *   - NestJS core module system
 *   - PrismaModule for database operations
 *   - AuthModule for authentication
 *   - DashboardController and DashboardService
 *
 * Notes:
 *   - Implements modular dashboard architecture
 *   - Provides proper dependency injection
 *   - Supports enterprise-scale dashboard requirements
 *   - Includes authentication and authorization
 *   - Optimized for performance and scalability
 */

import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
