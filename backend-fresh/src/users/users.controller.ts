/**
 * File: users.controller.ts
 * Purpose: Users controller for the BlickTrack backend API. Provides REST endpoints for comprehensive user management including internal employees, external collaborators, and user permissions. Handles all user-related operations with role-based access control.
 * 
 * Key Functions / Components / Classes:
 *   - UsersController: Main users controller class
 *   - User management: CRUD operations for all user types
 *   - External collaborators: Management of external users
 *   - User permissions: Permission management and access control
 *   - Role-based access: Role-based endpoint protection
 *   - User profiles: User profile and data management
 *
 * Inputs:
 *   - HTTP requests for user operations
 *   - User creation and update data
 *   - Permission assignment requests
 *   - External collaborator data
 *   - JWT tokens for authentication
 *
 * Outputs:
 *   - User data and profile responses
 *   - User creation and update confirmations
 *   - Permission assignment confirmations
 *   - External collaborator management
 *   - User listing and search results
 *
 * Dependencies:
 *   - UsersService for user operations
 *   - UserPermissionsService for permissions
 *   - ExternalCollaboratorService for external users
 *   - JWT and role guards for security
 *
 * Notes:
 *   - Implements comprehensive user management
 *   - Supports multiple user types and roles
 *   - Includes external collaborator management
 *   - Provides role-based access control
 *   - Handles enterprise user requirements
 */

import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole, UserType } from '@prisma/client';
import { UsersService } from './users.service';
import { UserPermissionsService } from './user-permissions.service';
import { ExternalCollaboratorService } from './external-collaborator.service';

/**
 * Users Controller
 * 
 * Comprehensive user management for all user types:
 * - Internal employees (all roles and departments)
 * - External collaborators and contractors
 * - Consultants and auditors
 * - User permissions and access control
 */
@ApiTags('User Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/v1/users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly permissionsService: UserPermissionsService,
    private readonly collaboratorService: ExternalCollaboratorService,
  ) {}

  // ========================================
  // INTERNAL USERS MANAGEMENT
  // ========================================

  @Get('internal')
  @Roles(UserRole.TENANT_ADMIN, UserRole.DEPARTMENT_HEAD, UserRole.PLATFORM_ADMIN)
  @ApiOperation({ summary: 'Get all internal users in tenant' })
  @ApiResponse({ status: 200, description: 'List of internal users' })
  async getInternalUsers(
    @CurrentUser() user: any,
    @Query('department') department?: string,
    @Query('role') role?: UserRole,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20
  ) {
    return this.usersService.getInternalUsers(user.tenantId, { department, role, page, limit });
  }

  @Post('internal')
  @Roles(UserRole.TENANT_ADMIN, UserRole.DEPARTMENT_HEAD, UserRole.PLATFORM_ADMIN)
  @ApiOperation({ summary: 'Create new internal user (employee)' })
  @ApiResponse({ status: 201, description: 'Internal user created successfully' })
  async createInternalUser(@CurrentUser() user: any, @Body() createUserDto: any) {
    return this.usersService.createInternalUser(user.tenantId, createUserDto);
  }

  // ========================================
  // EXTERNAL COLLABORATORS MANAGEMENT
  // ========================================

  @Get('external')
  @Roles(UserRole.TENANT_ADMIN, UserRole.PROJECT_MANAGER, UserRole.PLATFORM_ADMIN)
  @ApiOperation({ summary: 'Get all external collaborators' })
  @ApiResponse({ status: 200, description: 'List of external collaborators' })
  async getExternalCollaborators(
    @CurrentUser() user: any,
    @Query('status') status?: string,
    @Query('company') company?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20
  ) {
    return this.collaboratorService.getExternalCollaborators(user.tenantId, { status, company, page, limit });
  }

  @Post('external')
  @Roles(UserRole.TENANT_ADMIN, UserRole.PROJECT_MANAGER, UserRole.PLATFORM_ADMIN)
  @ApiOperation({ summary: 'Invite external collaborator' })
  @ApiResponse({ status: 201, description: 'External collaborator invited successfully' })
  async inviteExternalCollaborator(@CurrentUser() user: any, @Body() inviteDto: any) {
    return this.collaboratorService.inviteExternalCollaborator(user.tenantId, user.id, inviteDto);
  }

  @Put('external/:userId/extend')
  @Roles(UserRole.TENANT_ADMIN, UserRole.PROJECT_MANAGER, UserRole.PLATFORM_ADMIN)
  @ApiOperation({ summary: 'Extend external collaborator contract' })
  @ApiResponse({ status: 200, description: 'Contract extended successfully' })
  async extendCollaboratorContract(
    @CurrentUser() user: any,
    @Param('userId') userId: string,
    @Body() extensionDto: any
  ) {
    return this.collaboratorService.extendContract(user.tenantId, userId, extensionDto);
  }

  @Put('external/:userId/revoke')
  @Roles(UserRole.TENANT_ADMIN, UserRole.PROJECT_MANAGER, UserRole.PLATFORM_ADMIN)
  @ApiOperation({ summary: 'Revoke external collaborator access' })
  @ApiResponse({ status: 200, description: 'Access revoked successfully' })
  async revokeCollaboratorAccess(@CurrentUser() user: any, @Param('userId') userId: string) {
    return this.collaboratorService.revokeAccess(user.tenantId, userId);
  }

  // ========================================
  // USER PERMISSIONS MANAGEMENT
  // ========================================

  @Get(':userId/permissions')
  @Roles(UserRole.TENANT_ADMIN, UserRole.SECURITY_OFFICER, UserRole.PLATFORM_ADMIN)
  @ApiOperation({ summary: 'Get user permissions' })
  @ApiResponse({ status: 200, description: 'User permissions details' })
  async getUserPermissions(@CurrentUser() user: any, @Param('userId') userId: string) {
    return this.permissionsService.getUserPermissions(user.tenantId, userId);
  }

  @Put(':userId/permissions')
  @Roles(UserRole.TENANT_ADMIN, UserRole.SECURITY_OFFICER, UserRole.PLATFORM_ADMIN)
  @ApiOperation({ summary: 'Update user permissions' })
  @ApiResponse({ status: 200, description: 'Permissions updated successfully' })
  async updateUserPermissions(
    @CurrentUser() user: any,
    @Param('userId') userId: string,
    @Body() permissionsDto: any
  ) {
    return this.permissionsService.updateUserPermissions(user.tenantId, userId, permissionsDto);
  }

  // ========================================
  // DEPARTMENT & TEAM MANAGEMENT
  // ========================================

  @Get('departments/:department')
  @Roles(UserRole.TENANT_ADMIN, UserRole.DEPARTMENT_HEAD, UserRole.PLATFORM_ADMIN)
  @ApiOperation({ summary: 'Get users by department' })
  @ApiResponse({ status: 200, description: 'Department users list' })
  async getDepartmentUsers(
    @CurrentUser() user: any,
    @Param('department') department: string,
    @Query('includeExternal') includeExternal: boolean = false
  ) {
    return this.usersService.getDepartmentUsers(user.tenantId, department, includeExternal);
  }

  @Get('roles/:role')
  @Roles(UserRole.TENANT_ADMIN, UserRole.SECURITY_OFFICER, UserRole.PLATFORM_ADMIN)
  @ApiOperation({ summary: 'Get users by role' })
  @ApiResponse({ status: 200, description: 'Users with specific role' })
  async getUsersByRole(@CurrentUser() user: any, @Param('role') role: UserRole) {
    return this.usersService.getUsersByRole(user.tenantId, role);
  }

  // ========================================
  // USER LIFECYCLE MANAGEMENT
  // ========================================

  @Put(':userId/activate')
  @Roles(UserRole.TENANT_ADMIN, UserRole.DEPARTMENT_HEAD, UserRole.PLATFORM_ADMIN)
  @ApiOperation({ summary: 'Activate user account' })
  @ApiResponse({ status: 200, description: 'User activated successfully' })
  async activateUser(@CurrentUser() user: any, @Param('userId') userId: string) {
    return this.usersService.activateUser(user.tenantId, userId);
  }

  @Put(':userId/deactivate')
  @Roles(UserRole.TENANT_ADMIN, UserRole.DEPARTMENT_HEAD, UserRole.PLATFORM_ADMIN)
  @ApiOperation({ summary: 'Deactivate user account' })
  @ApiResponse({ status: 200, description: 'User deactivated successfully' })
  async deactivateUser(@CurrentUser() user: any, @Param('userId') userId: string) {
    return this.usersService.deactivateUser(user.tenantId, userId);
  }

  @Get('analytics/overview')
  @Roles(UserRole.TENANT_ADMIN, UserRole.SECURITY_OFFICER, UserRole.PLATFORM_ADMIN)
  @ApiOperation({ summary: 'Get user analytics overview' })
  @ApiResponse({ status: 200, description: 'User analytics data' })
  async getUserAnalyticsOverview(@CurrentUser() user: any) {
    return this.usersService.getUserAnalytics(user.tenantId);
  }
}