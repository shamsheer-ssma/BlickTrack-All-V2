/**
 * File: rbac.middleware.ts
 * Purpose: Role-Based Access Control (RBAC) middleware for the BlickTrack backend API. Implements enterprise-grade authorization with role-based permissions, tenant isolation, and resource ownership checks. Enforces security policies for multi-tenant access control.
 *
 * Key Functions / Components / Classes:
 *   - RBACMiddleware: Main RBAC middleware with configurable rules
 *   - RBACConfig: Configuration interface for access control rules
 *   - createRBACMiddleware: Factory function for custom RBAC middleware
 *   - PlatformAdminOnly: Predefined middleware for platform admin access
 *   - TenantAdminOrAbove: Predefined middleware for tenant admin access
 *   - AuthenticatedUsers: Predefined middleware for all authenticated users
 *   - TenantUsers: Predefined middleware for tenant-specific users
 *
 * Inputs:
 *   - Authenticated requests with user context
 *   - RBAC configuration for access rules
 *   - Resource ownership information
 *   - Tenant isolation requirements
 *
 * Outputs:
 *   - Access control decisions
 *   - Authorization errors for denied access
 *   - Tenant isolation enforcement
 *   - Resource ownership validation
 *
 * Dependencies:
 *   - UserRole enum from Prisma
 *   - AuthenticatedRequest interface
 *   - Express middleware system
 *   - User authentication context
 *
 * Notes:
 *   - Implements comprehensive RBAC system
 *   - Supports multi-tenant access control
 *   - Includes resource ownership checks
 *   - Provides predefined middleware for common use cases
 *   - Enforces enterprise security policies
 */

import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { UserRole } from '@prisma/client';
import { AuthenticatedRequest } from './authentication.middleware';

export interface RBACConfig {
  roles: UserRole[];
  resource?: string;
  action?: string;
  requireOwnership?: boolean;
  requireTenantMatch?: boolean;
}

@Injectable()
export class RBACMiddleware implements NestMiddleware {
  public rbacConfig: RBACConfig;

  constructor(config: RBACConfig) {
    this.rbacConfig = config;
  }

  use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const user = req.user;

    if (!user) {
      throw new ForbiddenException('Authentication required');
    }

    // Check if user has required role
    if (!this.rbacConfig.roles.includes(user.role as UserRole)) {
      throw new ForbiddenException(
        `Access denied. Required roles: ${this.rbacConfig.roles.join(', ')}`
      );
    }

    // Platform Admin has access to everything
    if (user.role === UserRole.PLATFORM_ADMIN) {
      return next();
    }

    // Tenant-specific access control
    if (this.rbacConfig.requireTenantMatch) {
      if (!user.tenantId) {
        throw new ForbiddenException('User must belong to a tenant');
      }

      // Check if the requested resource belongs to user's tenant
      const resourceTenantId = req.params.tenantId || req.body?.tenantId;
      if (resourceTenantId && resourceTenantId !== user.tenantId) {
        throw new ForbiddenException('Access denied to resources outside your tenant');
      }
    }

    // Resource ownership check
    if (this.rbacConfig.requireOwnership) {
      const resourceUserId = req.params.userId || req.body?.userId;
      if (resourceUserId && resourceUserId !== user.id) {
        // Only allow if user is tenant admin or platform admin
        if (user.role !== UserRole.TENANT_ADMIN && user.role !== UserRole.PLATFORM_ADMIN) {
          throw new ForbiddenException('Access denied to resources you do not own');
        }
      }
    }

    next();
  }
}

// Factory function to create RBAC middleware with specific configuration
export function createRBACMiddleware(config: RBACConfig) {
  @Injectable()
  class ConfiguredRBACMiddleware extends RBACMiddleware {
    constructor() {
      super(config);
    }
  }
  return ConfiguredRBACMiddleware;
}

// Predefined RBAC middlewares for common use cases
@Injectable()
export class PlatformAdminOnly extends RBACMiddleware {
  constructor() {
    super({
      roles: [UserRole.PLATFORM_ADMIN],
    });
  }
}

@Injectable()
export class TenantAdminOrAbove extends RBACMiddleware {
  constructor() {
    super({
      roles: [UserRole.PLATFORM_ADMIN, UserRole.TENANT_ADMIN],
      requireTenantMatch: true,
    });
  }
}

@Injectable()
export class AuthenticatedUsers extends RBACMiddleware {
  constructor() {
    super({
      roles: [UserRole.PLATFORM_ADMIN, UserRole.TENANT_ADMIN, UserRole.END_USER, UserRole.COLLABORATOR],
    });
  }
}

@Injectable()
export class TenantUsers extends RBACMiddleware {
  constructor() {
    super({
      roles: [UserRole.PLATFORM_ADMIN, UserRole.TENANT_ADMIN, UserRole.END_USER],
      requireTenantMatch: true,
    });
  }
}