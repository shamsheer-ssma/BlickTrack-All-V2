/**
 * File: platform-admin.module.ts
 * Purpose: Platform admin module for the BlickTrack backend API. Configures SaaS-level administration functionality including tenant management, system-wide configuration, platform health monitoring, and global user management. Provides comprehensive platform administration capabilities.
 * 
 * Key Functions / Components / Classes:
 *   - PlatformAdminModule: Platform administration module class
 *   - PlatformAdminController: Platform administration endpoints
 *   - PlatformAdminService: Platform administration business logic
 *   - PrismaModule: Database access for platform operations
 *   - Tenant management: Cross-tenant operations
 *   - System monitoring: Platform-wide health and metrics
 *
 * Inputs:
 *   - Platform administration requests
 *   - Tenant management operations
 *   - System monitoring queries
 *   - Global user operations
 *
 * Outputs:
 *   - Platform administration functionality
 *   - Tenant management services
 *   - System monitoring capabilities
 *   - Global user management
 *
 * Dependencies:
 *   - PlatformAdminController for endpoints
 *   - PlatformAdminService for business logic
 *   - PrismaModule for database access
 *   - NestJS module system
 *
 * Notes:
 *   - Implements comprehensive platform administration
 *   - Supports cross-tenant operations
 *   - Includes system-wide monitoring
 *   - Provides global user management
 *   - Handles SaaS provider requirements
 */

import { Module } from '@nestjs/common';
import { PlatformAdminController } from './platform-admin.controller';
import { PlatformAdminService } from './platform-admin.service';
import { PrismaModule } from '../../prisma/prisma.module';

/**
 * Platform Admin Module
 * 
 * Handles SaaS-level administration tasks including:
 * - Managing all tenants
 * - System-wide configuration
 * - Platform health monitoring
 * - Global user management
 * - Billing and subscription management
 * - System maintenance and updates
 */
@Module({
  imports: [PrismaModule],
  controllers: [PlatformAdminController],
  providers: [PlatformAdminService],
  exports: [PlatformAdminService],
})
export class PlatformAdminModule {}