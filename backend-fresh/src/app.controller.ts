/**
 * File: app.controller.ts
 * Purpose: Main application controller for the BlickTrack backend API. Provides system health checks, API information, and basic system endpoints. Handles core application status and information requests.
 * 
 * Key Functions / Components / Classes:
 *   - AppController: Main application controller class
 *   - getHealth: System health check endpoint
 *   - getInfo: API information and version endpoint
 *   - Health monitoring: System status verification
 *   - API documentation: Swagger endpoint documentation
 *
 * Inputs:
 *   - HTTP GET requests to health and info endpoints
 *   - System status queries
 *   - API information requests
 *
 * Outputs:
 *   - System health status responses
 *   - API information and version data
 *   - HTTP status codes and error responses
 *   - Swagger documentation for endpoints
 *
 * Dependencies:
 *   - AppService for business logic
 *   - Swagger decorators for API documentation
 *   - NestJS controller decorators
 *
 * Notes:
 *   - Implements system health monitoring
 *   - Provides API version and information
 *   - Includes comprehensive Swagger documentation
 *   - Handles basic system status requests
 *   - Supports monitoring and debugging
 */

import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('System')
@Controller('api/v1')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'System is healthy' })
  getHealth(): object {
    return this.appService.getHealthStatus();
  }

  @Get('info')
  @ApiOperation({ summary: 'API information' })
  @ApiResponse({ status: 200, description: 'API information' })
  getInfo(): object {
    return this.appService.getApiInfo();
  }
}
