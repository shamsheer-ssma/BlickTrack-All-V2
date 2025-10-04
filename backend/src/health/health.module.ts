/**
 * File: health.module.ts
 * Purpose: Health monitoring module for the BlickTrack backend API. Configures health check functionality, system monitoring, and database connectivity testing. Provides comprehensive health monitoring for the enterprise platform.
 * 
 * Key Functions / Components / Classes:
 *   - HealthModule: Health monitoring module class
 *   - HealthController: Health check endpoints
 *   - PrismaModule: Database connectivity testing
 *   - System monitoring: Health status and metrics
 *
 * Inputs:
 *   - Health check requests
 *   - System monitoring queries
 *   - Database connectivity tests
 *
 * Outputs:
 *   - Health status responses
 *   - System monitoring data
 *   - Database connectivity status
 *   - Performance metrics
 *
 * Dependencies:
 *   - HealthController for endpoints
 *   - PrismaModule for database access
 *   - NestJS module system
 *
 * Notes:
 *   - Implements comprehensive health monitoring
 *   - Provides both public and authenticated checks
 *   - Includes database connectivity testing
 *   - Supports enterprise monitoring requirements
 *   - Enables system health visibility
 */

import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [HealthController],
})
export class HealthModule {}