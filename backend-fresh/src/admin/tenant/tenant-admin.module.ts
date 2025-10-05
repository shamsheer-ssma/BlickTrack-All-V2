/**
 * File: tenant-admin.module.ts
 * Purpose: Tenant admin module for the BlickTrack backend API. Configures customer-specific administration functionality including user management within tenant boundaries, tenant configuration, internal dashboards, and tenant-scoped security policies. Provides comprehensive tenant administration capabilities.
 * 
 * Key Functions / Components / Classes:
 *   - TenantAdminModule: Tenant administration module class
 *   - TenantAdminController: Tenant administration endpoints
 *   - TenantAdminService: Tenant administration business logic
 *   - PrismaModule: Database access for tenant operations
 *   - User management: Tenant-scoped user operations
 *   - Tenant configuration: Customer-specific settings
 *
 * Inputs:
 *   - Tenant administration requests
 *   - User management operations within tenant
 *   - Tenant configuration changes
 *   - Department and team operations
 *
 * Outputs:
 *   - Tenant administration functionality
 *   - User management services within tenant
 *   - Tenant configuration capabilities
 *   - Department and team management
 *
 * Dependencies:
 *   - TenantAdminController for endpoints
 *   - TenantAdminService for business logic
 *   - PrismaModule for database access
 *   - NestJS module system
 *
 * Notes:
 *   - Implements tenant-scoped administration
 *   - Supports customer-specific operations
 *   - Includes internal user management
 *   - Provides tenant configuration
 *   - Handles customer administrative requirements
 */

import { Module } from '@nestjs/common';
import { TenantAdminController } from './tenant-admin.controller';
import { TenantAdminService } from './tenant-admin.service';
import { PrismaModule } from '../../prisma/prisma.module';

/**
 * Tenant Admin Module
 * 
 * Handles customer-specific administration tasks including:
 * - Managing users within their tenant
 * - Tenant-specific configuration
 * - Internal dashboards and reports
 * - Department and team management
 * - Tenant-scoped security policies
 * - User roles and permissions within tenant
 */
@Module({
  imports: [PrismaModule],
  controllers: [TenantAdminController],
  providers: [TenantAdminService],
  exports: [TenantAdminService],
})
export class TenantAdminModule {}