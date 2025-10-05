/**
 * File: tenant-admin.service.ts
 * Purpose: Tenant admin service for the BlickTrack backend API. Implements business logic for tenant-specific administration including user management within tenant boundaries, tenant configuration, department management, and tenant-scoped analytics. Handles all tenant-level administrative functionality.
 * 
 * Key Functions / Components / Classes:
 *   - TenantAdminService: Tenant administration service class
 *   - getTenantUsers: Tenant-scoped user listing and management
 *   - createTenantUser: User creation within tenant
 *   - updateTenantUser: User updates within tenant
 *   - deleteTenantUser: User deletion within tenant
 *   - getTenantConfig: Tenant configuration retrieval
 *   - updateTenantConfig: Tenant configuration updates
 *   - getDepartments: Department management within tenant
 *   - createDepartment: Department creation within tenant
 *   - getTenantAnalytics: Tenant-scoped analytics and reporting
 *
 * Inputs:
 *   - Tenant-scoped user operations
 *   - Tenant configuration changes
 *   - Department management requests
 *   - Analytics and reporting queries
 *   - Tenant ID for scoping operations
 *
 * Outputs:
 *   - Tenant user management results
 *   - Tenant configuration data
 *   - Department and team information
 *   - Analytics and reporting data
 *   - Administrative confirmations
 *
 * Dependencies:
 *   - PrismaService for database operations
 *   - User and tenant models
 *   - Department and team models
 *
 * Notes:
 *   - Implements tenant-scoped administration
 *   - Supports customer-specific operations
 *   - Includes internal user management
 *   - Provides tenant configuration
 *   - Handles customer administrative requirements
 */

import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserRole } from '@prisma/client';

/**
 * Tenant Admin Service
 * 
 * Business logic for tenant-specific administration:
 * - User management within tenant boundaries
 * - Tenant configuration and settings
 * - Department and team management
 * - Tenant-scoped analytics and reporting
 */
@Injectable()
export class TenantAdminService {
  constructor(private prisma: PrismaService) {}

  // User Management
  async getTenantUsers(tenantId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where: { tenantId },
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          lastLoginAt: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.user.count({
        where: { tenantId },
      }),
    ]);

    return {
      users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async createTenantUser(tenantId: string, createUserDto: any) {
    // Ensure user role is not PLATFORM_ADMIN (only platform can create those)
    if (createUserDto.role === UserRole.PLATFORM_ADMIN) {
      throw new ForbiddenException('Cannot create platform admin users');
    }

    return this.prisma.user.create({
      data: {
        ...createUserDto,
        tenantId,
        role: createUserDto.role || UserRole.END_USER,
      },
    });
  }

  async changeUserRole(tenantId: string, userId: string, roleDto: any) {
    // Verify user belongs to this tenant
    const user = await this.prisma.user.findFirst({
      where: { id: userId, tenantId },
    });

    if (!user) {
      throw new NotFoundException('User not found in this tenant');
    }

    // Prevent changing to/from PLATFORM_ADMIN
    if (roleDto.role === UserRole.PLATFORM_ADMIN || user.role === UserRole.PLATFORM_ADMIN) {
      throw new ForbiddenException('Cannot modify platform admin role');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        role: roleDto.role,
        updatedAt: new Date(),
      },
    });
  }

  async changeUserStatus(tenantId: string, userId: string, statusDto: any) {
    // Verify user belongs to this tenant
    const user = await this.prisma.user.findFirst({
      where: { id: userId, tenantId },
    });

    if (!user) {
      throw new NotFoundException('User not found in this tenant');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        isActive: statusDto.isActive,
        updatedAt: new Date(),
      },
    });
  }

  // Tenant Configuration
  async getTenantSettings(tenantId: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: {
        id: true,
        name: true,
        domain: true,
        settings: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    return tenant;
  }

  async updateTenantSettings(tenantId: string, settingsDto: any) {
    return this.prisma.tenant.update({
      where: { id: tenantId },
      data: {
        settings: settingsDto,
        updatedAt: new Date(),
      },
    });
  }

  // Analytics and Dashboard
  async getDashboardStats(tenantId: string) {
    const [userStats, recentActivity] = await Promise.all([
      this.prisma.user.groupBy({
        where: { tenantId },
        by: ['role'],
        _count: true,
      }),
      this.prisma.auditLog.findMany({
        where: { tenantId },
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          action: true,
          userId: true,
          createdAt: true,
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      }),
    ]);

    const totalUsers = await this.prisma.user.count({
      where: { tenantId },
    });

    const activeUsers = await this.prisma.user.count({
      where: { 
        tenantId,
        isActive: true,
        lastLoginAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
    });

    return {
      users: {
        total: totalUsers,
        active: activeUsers,
        byRole: userStats,
      },
      recentActivity,
      timestamp: new Date().toISOString(),
    };
  }

  async getUserAnalytics(tenantId: string) {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const [userGrowth, loginActivity] = await Promise.all([
      this.prisma.user.count({
        where: {
          tenantId,
          createdAt: {
            gte: thirtyDaysAgo,
          },
        },
      }),
      this.prisma.auditLog.count({
        where: {
          tenantId,
          action: 'USER_LOGIN',
          createdAt: {
            gte: thirtyDaysAgo,
          },
        },
      }),
    ]);

    return {
      userGrowth,
      loginActivity,
      period: '30 days',
      timestamp: new Date().toISOString(),
    };
  }

  // Department Management (if you have departments table)
  async getDepartments(tenantId: string) {
    // This would require a departments table in your schema
    // For now, returning placeholder
    return {
      departments: [],
      message: 'Department management feature coming soon',
    };
  }

  async createDepartment(tenantId: string, deptDto: any) {
    // This would require a departments table in your schema
    // For now, returning placeholder
    return {
      department: null,
      message: 'Department management feature coming soon',
    };
  }
}