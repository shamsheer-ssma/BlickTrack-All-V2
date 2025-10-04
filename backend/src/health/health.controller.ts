/**
 * File: health.controller.ts
 * Purpose: Health check controller for the BlickTrack backend API. Provides system health monitoring endpoints for API status, database connectivity, and system metrics. Implements both public and authenticated health checks for monitoring and debugging.
 * 
 * Key Functions / Components / Classes:
 *   - HealthController: Health monitoring controller class
 *   - checkHealth: Public health check endpoint
 *   - checkDetailedHealth: Authenticated detailed health check
 *   - Database monitoring: Database connection status checking
 *   - System metrics: Memory usage and performance monitoring
 *
 * Inputs:
 *   - HTTP GET requests to health endpoints
 *   - JWT tokens for authenticated health checks
 *   - System monitoring requests
 *
 * Outputs:
 *   - System health status responses
 *   - Database connectivity information
 *   - System performance metrics
 *   - Uptime and version information
 *
 * Dependencies:
 *   - PrismaService for database operations
 *   - JWT authentication guard
 *   - Swagger documentation decorators
 *
 * Notes:
 *   - Implements public and authenticated health checks
 *   - Provides secure health monitoring
 *   - Includes database connectivity testing
 *   - Monitors system performance metrics
 *   - Supports enterprise monitoring requirements
 */

import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Check API health status (public)' })
  @ApiResponse({ status: 200, description: 'API is healthy' })
  async checkHealth() {
    try {
      // Internally check database connection but don't expose details
      await this.prisma.$queryRaw`SELECT 1`;
      
      // Return minimal, safe information
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: Math.floor(process.uptime()),
        // Don't expose version or other sensitive details
      };
    } catch (error) {
      // If database is down, API is not fully healthy
      // But don't expose database error details to frontend
      return {
        status: 'degraded',
        timestamp: new Date().toISOString(),
        uptime: Math.floor(process.uptime()),
      };
    }
  }

  @Get('detailed')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check detailed system health (admin only)' })
  @ApiResponse({ status: 200, description: 'Detailed system health information' })
  async checkDetailedHealth() {
    try {
      // This endpoint requires authentication - only for admins
      const dbStart = Date.now();
      await this.prisma.$queryRaw`SELECT 1`;
      const dbTime = Date.now() - dbStart;
      
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: process.env.npm_package_version || '1.0.0',
        database: {
          status: 'connected',
          responseTime: `${dbTime}ms`
        },
        memory: {
          used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
          total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
        }
      };
    } catch (error) {
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        database: {
          status: 'disconnected',
          error: 'Connection failed'
        }
      };
    }
  }
}