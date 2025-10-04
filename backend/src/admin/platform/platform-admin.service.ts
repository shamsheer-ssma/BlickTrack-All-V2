/**
 * File: platform-admin.service.ts
 * Purpose: Platform admin service for the BlickTrack backend API. Implements business logic for SaaS platform administration including cross-tenant operations, system-wide monitoring, global user management, and platform health metrics. Handles all platform-level administrative functionality.
 * 
 * Key Functions / Components / Classes:
 *   - PlatformAdminService: Platform administration service class
 *   - getAllTenants: Cross-tenant tenant listing and management
 *   - getTenantById: Individual tenant retrieval and details
 *   - createTenant: New tenant creation and setup
 *   - updateTenant: Tenant configuration updates
 *   - suspendTenant: Tenant suspension and deactivation
 *   - deleteTenant: Tenant deletion and cleanup
 *   - getSystemMetrics: Platform-wide performance metrics
 *   - getGlobalUsers: Cross-tenant user management
 *   - getPlatformHealth: System health and status monitoring
 *
 * Inputs:
 *   - Tenant management requests
 *   - System monitoring queries
 *   - Global user operations
 *   - Platform configuration changes
 *   - Health check requests
 *
 * Outputs:
 *   - Tenant management results
 *   - System metrics and performance data
 *   - Global user information
 *   - Platform health status
 *   - Administrative confirmations
 *
 * Dependencies:
 *   - PrismaService for database operations
 *   - Tenant and user models
 *   - System monitoring utilities
 *
 * Notes:
 *   - Implements comprehensive platform administration
 *   - Supports cross-tenant operations
 *   - Includes system-wide monitoring
 *   - Provides global user management
 *   - Handles SaaS provider requirements
 */

import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * Platform Admin Service
 * 
 * Business logic for SaaS platform administration:
 * - Cross-tenant operations
 * - System-wide monitoring
 * - Global user management
 * - Platform health and metrics
 */
@Injectable()
export class PlatformAdminService {
  constructor(private prisma: PrismaService) {}

  // Tenant Management
  async getAllTenants(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const [tenants, total] = await Promise.all([
      this.prisma.tenant.findMany({
        skip,
        take: limit,
        include: {
          _count: {
            select: {
              users: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.tenant.count(),
    ]);

    return {
      tenants,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async createTenant(createTenantDto: any) {
    // Implementation for creating a new tenant
    return this.prisma.tenant.create({
      data: createTenantDto,
    });
  }

  async suspendTenant(tenantId: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    return this.prisma.tenant.update({
      where: { id: tenantId },
      data: {
        status: 'SUSPENDED',
        updatedAt: new Date(),
      },
    });
  }

  async activateTenant(tenantId: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    return this.prisma.tenant.update({
      where: { id: tenantId },
      data: {
        status: 'ACTIVE',
        updatedAt: new Date(),
      },
    });
  }

  // System Monitoring
  async getSystemHealth() {
    try {
      // Check database connectivity
      await this.prisma.$queryRaw`SELECT 1`;
      
      const stats = await Promise.all([
        this.prisma.tenant.count(),
        this.prisma.user.count(),
        this.prisma.auditLog.count(),
      ]);

      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        database: 'connected',
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        stats: {
          totalTenants: stats[0],
          totalUsers: stats[1],
          totalAuditLogs: stats[2],
        },
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error.message,
      };
    }
  }

  async getSystemMetrics() {
    const [tenantStats, userStats] = await Promise.all([
      this.prisma.tenant.groupBy({
        by: ['status'],
        _count: true,
      }),
      this.prisma.user.groupBy({
        by: ['role'],
        _count: true,
      }),
    ]);

    return {
      tenants: tenantStats,
      users: userStats,
      timestamp: new Date().toISOString(),
    };
  }

  // Global User Management
  async getAllUsers(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        include: {
          tenant: {
            select: {
              id: true,
              name: true,
              domain: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.user.count(),
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

  async changeUserRole(userId: string, roleDto: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        role: roleDto.role,
        updatedAt: new Date(),
      },
    });
  }
}