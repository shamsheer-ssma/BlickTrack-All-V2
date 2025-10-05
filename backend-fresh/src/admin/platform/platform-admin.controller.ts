/**
 * File: platform-admin.controller.ts
 * Purpose: Platform admin controller for the BlickTrack backend API. Provides SaaS provider administration endpoints for managing all tenants, system-wide monitoring, global user management, and platform configuration. Handles cross-tenant operations and system administration.
 * 
 * Key Functions / Components / Classes:
 *   - PlatformAdminController: Platform administration controller class
 *   - Tenant management: CRUD operations for all tenants
 *   - System monitoring: Platform-wide health and status checks
 *   - Global user management: Cross-tenant user operations
 *   - Billing management: Subscription and billing operations
 *   - Platform configuration: System-wide configuration management
 *
 * Inputs:
 *   - HTTP requests for platform administration
 *   - Tenant management requests
 *   - System monitoring queries
 *   - Global user operations
 *   - Platform configuration changes
 *
 * Outputs:
 *   - Tenant management responses
 *   - System monitoring data
 *   - Global user management results
 *   - Billing and subscription information
 *   - Platform configuration status
 *
 * Dependencies:
 *   - PlatformAdminService for business logic
 *   - JWT and role guards for security
 *   - Swagger documentation decorators
 *
 * Notes:
 *   - Implements comprehensive platform administration
 *   - Supports cross-tenant operations
 *   - Includes system-wide monitoring
 *   - Provides global user management
 *   - Handles SaaS provider requirements
 */

import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';
import { PlatformAdminService } from './platform-admin.service';

/**
 * Platform Admin Controller
 * 
 * SaaS Provider Admin endpoints for:
 * - Managing all tenants (create, update, suspend, delete)
 * - System-wide monitoring and health checks
 * - Global user management across all tenants  
 * - Billing and subscription management
 * - Platform configuration and maintenance
 */
@ApiTags('Platform Administration')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.PLATFORM_ADMIN)
@Controller('api/v1/platform-admin')
export class PlatformAdminController {
  constructor(private readonly platformAdminService: PlatformAdminService) {}

  // Tenant Management
  @Get('tenants')
  @ApiOperation({ summary: 'Get all tenants in the system' })
  @ApiResponse({ status: 200, description: 'List of all tenants' })
  async getAllTenants(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.platformAdminService.getAllTenants(page, limit);
  }

  @Post('tenants')
  @ApiOperation({ summary: 'Create a new tenant' })
  @ApiResponse({ status: 201, description: 'Tenant created successfully' })
  async createTenant(@Body() createTenantDto: any) {
    return this.platformAdminService.createTenant(createTenantDto);
  }

  @Put('tenants/:tenantId/suspend')
  @ApiOperation({ summary: 'Suspend a tenant' })
  @ApiResponse({ status: 200, description: 'Tenant suspended successfully' })
  async suspendTenant(@Param('tenantId') tenantId: string) {
    return this.platformAdminService.suspendTenant(tenantId);
  }

  @Put('tenants/:tenantId/activate')
  @ApiOperation({ summary: 'Activate a tenant' })
  @ApiResponse({ status: 200, description: 'Tenant activated successfully' })
  async activateTenant(@Param('tenantId') tenantId: string) {
    return this.platformAdminService.activateTenant(tenantId);
  }

  // System Monitoring
  @Get('system/health')
  @ApiOperation({ summary: 'Get detailed system health status' })
  @ApiResponse({ status: 200, description: 'System health information' })
  async getSystemHealth() {
    return this.platformAdminService.getSystemHealth();
  }

  @Get('system/metrics')
  @ApiOperation({ summary: 'Get system metrics and usage statistics' })
  @ApiResponse({ status: 200, description: 'System metrics' })
  async getSystemMetrics() {
    return this.platformAdminService.getSystemMetrics();
  }

  // Global User Management
  @Get('users')
  @ApiOperation({ summary: 'Get all users across all tenants' })
  @ApiResponse({ status: 200, description: 'List of all users' })
  async getAllUsers(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.platformAdminService.getAllUsers(page, limit);
  }

  @Put('users/:userId/role')
  @ApiOperation({ summary: 'Change user role (cross-tenant)' })
  @ApiResponse({ status: 200, description: 'User role updated successfully' })
  async changeUserRole(@Param('userId') userId: string, @Body() roleDto: any) {
    return this.platformAdminService.changeUserRole(userId, roleDto);
  }
}