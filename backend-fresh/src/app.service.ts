/**
 * File: app.service.ts
 * Purpose: Main application service for the BlickTrack backend API. Provides system health status, API information, and core application data. Handles system monitoring and API metadata generation.
 * 
 * Key Functions / Components / Classes:
 *   - AppService: Main application service class
 *   - getHealthStatus: Returns system health and status information
 *   - getApiInfo: Returns API information and feature list
 *   - System monitoring: Tracks uptime and environment status
 *   - API metadata: Provides version and feature information
 *
 * Inputs:
 *   - System process information
 *   - Environment variables
 *   - Application configuration
 *
 * Outputs:
 *   - Health status objects with system metrics
 *   - API information with features and endpoints
 *   - System uptime and environment data
 *   - Version and service information
 *
 * Dependencies:
 *   - NestJS Injectable decorator
 *   - Node.js process object for system info
 *
 * Notes:
 *   - Implements comprehensive system monitoring
 *   - Provides detailed API information
 *   - Tracks system uptime and environment
 *   - Includes feature list and endpoint documentation
 *   - Supports health checks and monitoring
 */

import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealthStatus(): object {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      service: 'BlickTrack API',
      version: '1.0.0',
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    };
  }

  getApiInfo(): object {
    return {
      name: 'BlickTrack Cybersecurity Platform API',
      version: '1.0.0',
      description: 'Enterprise cybersecurity risk management and threat modeling platform',
      documentation: '/api/docs',
      features: [
        'Authentication & Authorization',
        'Multi-tenant Architecture',
        'SBOM Management',
        'Threat Modeling',
        'Audit Logging',
        'RBAC (Role-Based Access Control)',
      ],
      endpoints: {
        health: '/api/v1/health',
        docs: '/api/docs',
        auth: '/api/v1/auth/*',
      },
    };
  }
}
