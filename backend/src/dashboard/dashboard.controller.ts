/**
 * File: dashboard.controller.ts
 * Purpose: Dashboard controller for the BlickTrack backend API. Provides endpoints for fetching dashboard statistics, recent activities, and system health information. Serves data for the enterprise cybersecurity platform dashboard.
 *
 * Key Functions / Components / Classes:
 *   - DashboardController: Main dashboard controller class
 *   - getStats: Retrieves dashboard statistics
 *   - getActivity: Retrieves recent activity feed
 *   - getProjects: Retrieves top projects data
 *   - getSystemHealth: Retrieves system health information
 *   - Data aggregation: Combines data from multiple sources
 *   - Performance optimization: Efficient data retrieval
 *
 * Inputs:
 *   - HTTP GET requests for dashboard endpoints
 *   - Authentication via JWT guards
 *   - Query parameters for filtering and pagination
 *
 * Outputs:
 *   - Dashboard statistics and metrics
 *   - Recent activity feed with timestamps
 *   - Top projects with progress information
 *   - System health status and uptime
 *   - JSON responses with proper formatting
 *
 * Dependencies:
 *   - DashboardService for business logic
 *   - PrismaService for database operations
 *   - JWT authentication guards
 *   - Swagger decorators for API documentation
 *
 * Notes:
 *   - Implements comprehensive dashboard data endpoints
 *   - Includes proper error handling and validation
 *   - Supports real-time data updates
 *   - Provides enterprise-grade dashboard functionality
 *   - Optimized for frontend consumption
 */

import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../rbac/guards/roles.guard';
import { Roles } from '../rbac/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Dashboard')
@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  @Roles(UserRole.SUPER_ADMIN, UserRole.PLATFORM_ADMIN, UserRole.TENANT_ADMIN, UserRole.END_USER)
  @ApiOperation({ summary: 'Get role-based dashboard statistics' })
  @ApiResponse({ status: 200, description: 'Dashboard statistics retrieved successfully' })
  async getStats(@Request() req) {
    const user = req.user;
    return this.dashboardService.getRoleBasedStats(user);
  }

  @Get('activity')
  @Roles(UserRole.SUPER_ADMIN, UserRole.PLATFORM_ADMIN, UserRole.TENANT_ADMIN, UserRole.END_USER)
  @ApiOperation({ summary: 'Get role-based recent activity feed' })
  @ApiResponse({ status: 200, description: 'Recent activity retrieved successfully' })
  async getActivity(@Request() req, @Query('limit') limit?: string) {
    const user = req.user;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.dashboardService.getRoleBasedActivity(user, limitNum);
  }

  @Get('projects')
  @Roles(UserRole.SUPER_ADMIN, UserRole.PLATFORM_ADMIN, UserRole.TENANT_ADMIN, UserRole.END_USER)
  @ApiOperation({ summary: 'Get role-based projects data' })
  @ApiResponse({ status: 200, description: 'Projects retrieved successfully' })
  async getProjects(@Request() req, @Query('limit') limit?: string) {
    const user = req.user;
    const limitNum = limit ? parseInt(limit, 10) : 5;
    return this.dashboardService.getRoleBasedProjects(user, limitNum);
  }

  @Get('health')
  @Roles(UserRole.SUPER_ADMIN, UserRole.PLATFORM_ADMIN, UserRole.TENANT_ADMIN, UserRole.END_USER)
  @ApiOperation({ summary: 'Get role-based system health information' })
  @ApiResponse({ status: 200, description: 'System health retrieved successfully' })
  async getSystemHealth(@Request() req) {
    const user = req.user;
    return this.dashboardService.getRoleBasedSystemHealth(user);
  }

  @Get('navigation')
  @Roles(UserRole.SUPER_ADMIN, UserRole.PLATFORM_ADMIN, UserRole.TENANT_ADMIN, UserRole.END_USER)
  @ApiOperation({ summary: 'Get role-based navigation menu' })
  @ApiResponse({ status: 200, description: 'Navigation menu retrieved successfully' })
  async getNavigation(@Request() req) {
    const user = req.user;
    console.log('🔍 [DASHBOARD DEBUG] Navigation endpoint called', {
      userId: user?.id,
      userEmail: user?.email,
      userRole: user?.role,
      userTenantId: user?.tenantId
    });
    return this.dashboardService.getRoleBasedNavigation(user);
  }

  @Get('permissions')
  @Roles(UserRole.SUPER_ADMIN, UserRole.PLATFORM_ADMIN, UserRole.TENANT_ADMIN, UserRole.END_USER)
  @ApiOperation({ summary: 'Get user permissions and capabilities' })
  @ApiResponse({ status: 200, description: 'User permissions retrieved successfully' })
  async getPermissions(@Request() req) {
    const user = req.user;
    return this.dashboardService.getUserPermissions(user.id);
  }

  @Get('features')
  @Roles(UserRole.SUPER_ADMIN, UserRole.PLATFORM_ADMIN, UserRole.TENANT_ADMIN, UserRole.END_USER)
  @ApiOperation({ summary: 'Get available features for user based on role and tenant' })
  @ApiResponse({ status: 200, description: 'Available features retrieved successfully' })
  async getAvailableFeatures(@Request() req) {
    const user = req.user;
    return this.dashboardService.getAvailableFeatures(user);
  }

  @Get('features/:featureSlug/access')
  @Roles(UserRole.SUPER_ADMIN, UserRole.PLATFORM_ADMIN, UserRole.TENANT_ADMIN, UserRole.END_USER)
  @ApiOperation({ summary: 'Check if user can access a specific feature' })
  @ApiResponse({ status: 200, description: 'Feature access status retrieved successfully' })
  async checkFeatureAccess(@Request() req, @Query('featureSlug') featureSlug: string) {
    const user = req.user;
    const canAccess = await this.dashboardService.canAccessFeature(user, featureSlug);
    return { featureSlug, canAccess };
  }

  @Get('tenant-features')
  @Roles(UserRole.SUPER_ADMIN, UserRole.PLATFORM_ADMIN, UserRole.TENANT_ADMIN, UserRole.END_USER)
  @ApiOperation({ summary: 'Get tenant features (what features this tenant has access to)' })
  @ApiResponse({ status: 200, description: 'Tenant features retrieved successfully' })
  async getTenantFeatures(@Request() req) {
    const user = req.user;
    return this.dashboardService.getTenantFeatures(user.tenantId);
  }
}
