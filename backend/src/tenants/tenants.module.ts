/**
 * File: tenants.module.ts
 * Purpose: Tenant management module for multi-tenant configuration and feature flags
 * 
 * Key Functions / Components / Classes:
 *   - TenantsModule: Module for tenant configuration
 *   - TenantsController: API endpoints for tenant features
 *   - TenantsService: Business logic for tenant management
 *
 * Dependencies:
 *   - PrismaModule for database operations
 */

import { Module } from '@nestjs/common';
import { TenantsController } from './tenants.controller';
import { TenantsService } from './tenants.service';
import { TenantConfigurationController } from './tenant-configuration.controller';
import { TenantConfigurationService } from './tenant-configuration.service';
import { PrismaModule } from '../prisma/prisma.module';
import { LoggerService } from '../common/services/logger.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [PrismaModule],
  controllers: [TenantsController, TenantConfigurationController],
  providers: [TenantsService, TenantConfigurationService, LoggerService, ConfigService],
  exports: [TenantsService, TenantConfigurationService],
})
export class TenantsModule {}

