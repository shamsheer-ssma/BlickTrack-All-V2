/**
 * File: tenant-admin.controller.ts
 * Purpose: Tenant admin controller for the BlickTrack backend API. Provides customer-specific administration endpoints for managing users within their tenant, tenant configuration, internal dashboards, and tenant-scoped security policies. Handles tenant-level administrative operations.
 * 
 * Key Functions / Components / Classes:
 *   - TenantAdminController: Tenant administration controller class
 *   - User management: Tenant-scoped user operations
 *   - Tenant configuration: Tenant-specific settings management
 *   - Department management: Team and department operations
 *   - Security policies: Tenant-scoped security configuration
 *   - Analytics: Internal dashboards and reporting
 *
 * Inputs:
 *   - HTTP requests for tenant administration
 *   - User management requests within tenant
 *   - Tenant configuration changes
 *   - Department and team operations
 *   - Security policy updates
 *
 * Outputs:
 *   - Tenant user management results
 *   - Tenant configuration status
 *   - Department and team information
 *   - Security policy confirmations
 *   - Analytics and reporting data
 *
 * Dependencies:
 *   - TenantAdminService for business logic
 *   - JWT and role guards for security
 *   - Swagger documentation decorators
 *
 * Notes:
 *   - Implements tenant-scoped administration
 *   - Supports customer-specific operations
 *   - Includes internal user management
 *   - Provides tenant configuration
 *   - Handles customer administrative requirements
 */

import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';
import { TenantAdminService } from './tenant-admin.service';

/**
 * Tenant Admin Controller
 * 
 * Customer Admin endpoints for:
 * - Managing users within their tenant/organization
 * - Tenant-specific configuration and settings
 * - Internal dashboards and analytics
 * - Department and team management
 * - Tenant-scoped security policies
 */
@ApiTags('Tenant Administration')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.TENANT_ADMIN, UserRole.PLATFORM_ADMIN)
@Controller('api/v1/tenant-admin')
export class TenantAdminController {
  constructor(private readonly tenantAdminService: TenantAdminService) {}

  // User Management within Tenant
  @Get('users')
  @ApiOperation({ summary: 'Get all users in current tenant' })
  @ApiResponse({ status: 200, description: 'List of tenant users' })
  async getTenantUsers(
    @CurrentUser() user: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    return this.tenantAdminService.getTenantUsers(user.tenantId, page, limit);
  }

  @Post('users')
  @ApiOperation({ summary: 'Create a new user in tenant' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  async createTenantUser(@CurrentUser() user: any, @Body() createUserDto: any) {
    return this.tenantAdminService.createTenantUser(user.tenantId, createUserDto);
  }

  @Put('users/:userId/role')
  @ApiOperation({ summary: 'Change user role within tenant' })
  @ApiResponse({ status: 200, description: 'User role updated successfully' })
  async changeUserRole(
    @CurrentUser() user: any,
    @Param('userId') userId: string,
    @Body() roleDto: any
  ) {
    return this.tenantAdminService.changeUserRole(user.tenantId, userId, roleDto);
  }

  @Put('users/:userId/status')
  @ApiOperation({ summary: 'Activate/Deactivate user within tenant' })
  @ApiResponse({ status: 200, description: 'User status updated successfully' })
  async changeUserStatus(
    @CurrentUser() user: any,
    @Param('userId') userId: string,
    @Body() statusDto: any
  ) {
    return this.tenantAdminService.changeUserStatus(user.tenantId, userId, statusDto);
  }

  // Tenant Configuration
  @Get('settings')
  @ApiOperation({ summary: 'Get tenant configuration settings' })
  @ApiResponse({ status: 200, description: 'Tenant settings' })
  async getTenantSettings(@CurrentUser() user: any) {
    return this.tenantAdminService.getTenantSettings(user.tenantId);
  }

  @Put('settings')
  @ApiOperation({ summary: 'Update tenant configuration settings' })
  @ApiResponse({ status: 200, description: 'Settings updated successfully' })
  async updateTenantSettings(@CurrentUser() user: any, @Body() settingsDto: any) {
    return this.tenantAdminService.updateTenantSettings(user.tenantId, settingsDto);
  }

  // Dashboard and Analytics
  @Get('dashboard/stats')
  @ApiOperation({ summary: 'Get tenant dashboard statistics' })
  @ApiResponse({ status: 200, description: 'Dashboard statistics' })
  async getDashboardStats(@CurrentUser() user: any) {
    return this.tenantAdminService.getDashboardStats(user.tenantId);
  }

  @Get('analytics/users')
  @ApiOperation({ summary: 'Get user analytics for tenant' })
  @ApiResponse({ status: 200, description: 'User analytics data' })
  async getUserAnalytics(@CurrentUser() user: any) {
    return this.tenantAdminService.getUserAnalytics(user.tenantId);
  }

  // Department/Team Management
  @Get('departments')
  @ApiOperation({ summary: 'Get all departments in tenant' })
  @ApiResponse({ status: 200, description: 'List of departments' })
  async getDepartments(@CurrentUser() user: any) {
    return this.tenantAdminService.getDepartments(user.tenantId);
  }

  @Post('departments')
  @ApiOperation({ summary: 'Create a new department' })
  @ApiResponse({ status: 201, description: 'Department created successfully' })
  async createDepartment(@CurrentUser() user: any, @Body() deptDto: any) {
    return this.tenantAdminService.createDepartment(user.tenantId, deptDto);
  }
}