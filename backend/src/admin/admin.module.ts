/**
 * File: admin.module.ts
 * Purpose: Admin module for the BlickTrack backend API. Combines platform and tenant administration functionality for comprehensive system management. Provides both SaaS provider and customer-specific administrative capabilities.
 * 
 * Key Functions / Components / Classes:
 *   - AdminModule: Main admin module class
 *   - PlatformAdminModule: SaaS provider administration
 *   - TenantAdminModule: Customer-specific administration
 *   - Cross-tenant operations: System-wide management
 *   - Tenant-scoped operations: Customer-specific management
 *
 * Inputs:
 *   - Administrative requests and operations
 *   - Platform management requests
 *   - Tenant management requests
 *   - System configuration changes
 *
 * Outputs:
 *   - Administrative functionality
 *   - Platform management services
 *   - Tenant management services
 *   - System configuration management
 *
 * Dependencies:
 *   - PlatformAdminModule for SaaS operations
 *   - TenantAdminModule for customer operations
 *   - NestJS module system
 *
 * Notes:
 *   - Implements comprehensive admin functionality
 *   - Supports both platform and tenant administration
 *   - Provides system-wide management capabilities
 *   - Handles enterprise administrative requirements
 *   - Enables multi-tenant SaaS operations
 */

import { Module } from '@nestjs/common';
import { PlatformAdminModule } from './platform/platform-admin.module';
import { TenantAdminModule } from './tenant/tenant-admin.module';

/**
 * Admin Module
 * 
 * Combines both Platform Admin and Tenant Admin modules:
 * 
 * Platform Admin:
 * - SaaS provider administration
 * - Cross-tenant operations
 * - System-wide management
 * 
 * Tenant Admin:
 * - Customer-specific administration
 * - Tenant-scoped operations
 * - Internal user management
 */
@Module({
  imports: [
    PlatformAdminModule,
    TenantAdminModule,
  ],
  exports: [
    PlatformAdminModule,
    TenantAdminModule,
  ],
})
export class AdminModule {}