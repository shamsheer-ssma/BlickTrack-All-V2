/**
 * File: tenants.service.ts
 * Purpose: Comprehensive tenant management service for the BlickTrack backend API. Handles all tenant-related business logic including CRUD operations, feature flag management, tenant statistics, and multi-tenant data isolation. Provides enterprise-grade tenant management functionality.
 * 
 * Key Functions / Components / Classes:
 *   - TenantsService: Main tenant management service class
 *   - createTenant: Create new tenant with validation and defaults
 *   - getTenants: Retrieve paginated list of tenants with filtering
 *   - getTenantById: Get detailed tenant information by ID
 *   - getTenantBySlug: Get tenant information by slug
 *   - updateTenant: Update tenant information and configuration
 *   - deleteTenant: Soft delete tenant and associated data
 *   - getTenantStats: Retrieve tenant usage statistics and metrics
 *   - getTenantFeatures: Get tenant-specific feature flags
 *   - updateTenantFeatures: Update tenant feature configuration
 *   - mapTenantToResponseDto: Convert Prisma model to response DTO
 *
 * Inputs:
 *   - Tenant creation data (name, slug, domain, plan, etc.)
 *   - Tenant update data and configuration changes
 *   - Feature flag updates and configuration
 *   - Query parameters for filtering and pagination
 *   - Tenant IDs and slugs for lookups
 *
 * Outputs:
 *   - TenantResponseDto with complete tenant information
 *   - TenantListDto with paginated tenant results
 *   - TenantStatsDto with usage statistics
 *   - Feature configuration responses
 *   - Success/error confirmations
 *
 * Dependencies:
 *   - PrismaService for database operations
 *   - LoggerService for debug logging
 *   - ConfigService for configuration management
 *   - Tenant and related Prisma models
 *
 * Notes:
 *   - Implements comprehensive tenant CRUD operations
 *   - Supports multi-tenant data isolation
 *   - Includes feature flag management
 *   - Provides tenant statistics and analytics
 *   - Handles tenant uniqueness validation
 *   - Supports enterprise tenant management requirements
 */

import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TenantFeaturesDto, UpdateTenantFeaturesDto } from './dto/tenant-features.dto';
import { 
  CreateTenantDto, 
  UpdateTenantDto, 
  TenantResponseDto, 
  TenantListDto, 
  TenantStatsDto, 
  TenantQueryDto 
} from './dto/tenant.dto';
import { LoggerService } from '../common/services/logger.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TenantsService {
  private readonly logger: LoggerService;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.logger = new LoggerService(configService);
    this.logger.setContext('TenantsService');
    this.logger.debug('TenantsService initialized');
  }

  // ========================================
  // TENANT CRUD OPERATIONS
  // ========================================

  /**
   * Create a new tenant
   * @param createTenantDto - Tenant creation data
   * @returns Created tenant information
   */
  async createTenant(createTenantDto: CreateTenantDto): Promise<TenantResponseDto> {
    this.logger.debug('Creating new tenant', { name: createTenantDto.name, slug: createTenantDto.slug });

    // Check if tenant with slug already exists
    const existingTenant = await this.prisma.tenant.findUnique({
      where: { slug: createTenantDto.slug }
    });

    if (existingTenant) {
      this.logger.warn('Tenant creation failed - slug already exists', { slug: createTenantDto.slug });
      throw new ConflictException(`Tenant with slug '${createTenantDto.slug}' already exists`);
    }

    // Check if domain is provided and unique
    if (createTenantDto.domain) {
      const existingDomain = await this.prisma.tenant.findUnique({
        where: { domain: createTenantDto.domain }
      });

      if (existingDomain) {
        this.logger.warn('Tenant creation failed - domain already exists', { domain: createTenantDto.domain });
        throw new ConflictException(`Tenant with domain '${createTenantDto.domain}' already exists`);
      }
    }

    try {
      const tenant = await this.prisma.tenant.create({
        data: {
          ...createTenantDto,
          // Set default values
          status: createTenantDto.status || 'TRIAL',
          isActive: createTenantDto.isActive ?? true,
          isTrial: createTenantDto.isTrial ?? true,
          mfaRequired: createTenantDto.mfaRequired ?? false,
          passwordPolicy: createTenantDto.passwordPolicy || { minLength: 8, requireSpecialChar: true },
          sessionTimeout: createTenantDto.sessionTimeout || 480,
          complianceFrameworks: createTenantDto.complianceFrameworks || [],
          apiQuotaDaily: createTenantDto.apiQuotaDaily || 10000,
          settings: createTenantDto.settings || {},
        },
        include: {
          plan: true,
          configuration: true,
        }
      });

      this.logger.info('Tenant created successfully', { 
        tenantId: tenant.id, 
        name: tenant.name, 
        slug: tenant.slug 
      });

      return this.mapTenantToResponseDto(tenant);
    } catch (error) {
      this.logger.error('Failed to create tenant', error as Error, { createTenantDto });
      throw error;
    }
  }

  /**
   * Get all tenants with filtering and pagination
   * @param query - Query parameters for filtering and pagination
   * @returns Paginated list of tenants
   */
  async getTenants(query: TenantQueryDto): Promise<TenantListDto> {
    this.logger.debug('Getting tenants with query', { query });

    const {
      page = 1,
      limit = 10,
      search,
      status,
      isActive,
      isTrial,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = query;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      deletedAt: null, // Only non-deleted tenants
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
        { domain: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (status) {
      where.status = status;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (isTrial !== undefined) {
      where.isTrial = isTrial;
    }

    // Build orderBy clause
    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    try {
      const [tenants, total] = await Promise.all([
        this.prisma.tenant.findMany({
          where,
          orderBy,
          skip,
          take: limit,
          include: {
            plan: true,
            configuration: true,
            _count: {
              select: {
                users: true,
                projects: true,
              }
            }
          }
        }),
        this.prisma.tenant.count({ where })
      ]);

      const totalPages = Math.ceil(total / limit);

      this.logger.debug('Tenants retrieved successfully', { 
        count: tenants.length, 
        total, 
        page, 
        totalPages 
      });

      return {
        tenants: tenants.map(tenant => this.mapTenantToResponseDto(tenant)),
        total,
        page,
        limit,
        totalPages
      };
    } catch (error) {
      this.logger.error('Failed to get tenants', error as Error, { query });
      throw error;
    }
  }

  /**
   * Get tenant by ID
   * @param tenantId - The tenant UUID
   * @returns Tenant information
   */
  async getTenantById(tenantId: string): Promise<TenantResponseDto> {
    this.logger.debug('Getting tenant by ID', { tenantId });

    const tenant = await this.prisma.tenant.findUnique({
      where: { 
        id: tenantId,
        deletedAt: null // Only non-deleted tenants
      },
      include: {
        plan: true,
        configuration: true,
        _count: {
          select: {
            users: true,
            projects: true,
            securityProjects: true,
          }
        }
      }
    });

    if (!tenant) {
      this.logger.warn('Tenant not found', { tenantId });
      throw new NotFoundException(`Tenant with ID ${tenantId} not found`);
    }

    this.logger.debug('Tenant retrieved successfully', { 
      tenantId, 
      name: tenant.name,
      userCount: tenant._count.users,
      projectCount: tenant._count.projects
    });

    return this.mapTenantToResponseDto(tenant);
  }

  /**
   * Update tenant
   * @param tenantId - The tenant UUID
   * @param updateTenantDto - Tenant update data
   * @returns Updated tenant information
   */
  async updateTenant(tenantId: string, updateTenantDto: UpdateTenantDto): Promise<TenantResponseDto> {
    this.logger.debug('Updating tenant', { tenantId, updateData: updateTenantDto });

    // Verify tenant exists
    const existingTenant = await this.prisma.tenant.findUnique({
      where: { 
        id: tenantId,
        deletedAt: null
      }
    });

    if (!existingTenant) {
      this.logger.warn('Tenant update failed - tenant not found', { tenantId });
      throw new NotFoundException(`Tenant with ID ${tenantId} not found`);
    }

    // Check if slug is being updated and if it's unique
    if (updateTenantDto.slug && updateTenantDto.slug !== existingTenant.slug) {
      const slugExists = await this.prisma.tenant.findUnique({
        where: { slug: updateTenantDto.slug }
      });

      if (slugExists) {
        this.logger.warn('Tenant update failed - slug already exists', { 
          tenantId, 
          newSlug: updateTenantDto.slug 
        });
        throw new ConflictException(`Tenant with slug '${updateTenantDto.slug}' already exists`);
      }
    }

    // Check if domain is being updated and if it's unique
    if (updateTenantDto.domain && updateTenantDto.domain !== existingTenant.domain) {
      const domainExists = await this.prisma.tenant.findUnique({
        where: { domain: updateTenantDto.domain }
      });

      if (domainExists) {
        this.logger.warn('Tenant update failed - domain already exists', { 
          tenantId, 
          newDomain: updateTenantDto.domain 
        });
        throw new ConflictException(`Tenant with domain '${updateTenantDto.domain}' already exists`);
      }
    }

    try {
      const updatedTenant = await this.prisma.tenant.update({
        where: { id: tenantId },
        data: updateTenantDto,
        include: {
          plan: true,
          configuration: true,
        }
      });

      this.logger.info('Tenant updated successfully', { 
        tenantId, 
        name: updatedTenant.name,
        updatedFields: Object.keys(updateTenantDto)
      });

      return this.mapTenantToResponseDto(updatedTenant);
    } catch (error) {
      this.logger.error('Failed to update tenant', error as Error, { tenantId, updateTenantDto });
      throw error;
    }
  }

  /**
   * Delete tenant (soft delete)
   * @param tenantId - The tenant UUID
   * @returns Deletion confirmation
   */
  async deleteTenant(tenantId: string): Promise<{ message: string }> {
    this.logger.debug('Deleting tenant', { tenantId });

    // Verify tenant exists
    const existingTenant = await this.prisma.tenant.findUnique({
      where: { 
        id: tenantId,
        deletedAt: null
      }
    });

    if (!existingTenant) {
      this.logger.warn('Tenant deletion failed - tenant not found', { tenantId });
      throw new NotFoundException(`Tenant with ID ${tenantId} not found`);
    }

    try {
      // Soft delete the tenant
      await this.prisma.tenant.update({
        where: { id: tenantId },
        data: {
          deletedAt: new Date(),
          isActive: false, // Also deactivate
        }
      });

      this.logger.info('Tenant deleted successfully', { 
        tenantId, 
        name: existingTenant.name 
      });

      return { message: 'Tenant deleted successfully' };
    } catch (error) {
      this.logger.error('Failed to delete tenant', error as Error, { tenantId });
      throw error;
    }
  }

  /**
   * Get tenant statistics
   * @param tenantId - The tenant UUID
   * @returns Tenant usage statistics
   */
  async getTenantStats(tenantId: string): Promise<TenantStatsDto> {
    this.logger.debug('Getting tenant statistics', { tenantId });

    // Verify tenant exists
    const tenant = await this.prisma.tenant.findUnique({
      where: { 
        id: tenantId,
        deletedAt: null
      }
    });

    if (!tenant) {
      this.logger.warn('Tenant stats failed - tenant not found', { tenantId });
      throw new NotFoundException(`Tenant with ID ${tenantId} not found`);
    }

    try {
      const [
        totalUsers,
        totalProjects,
        totalThreatModels,
        totalSecurityProjects,
        activeUsers,
        complianceFrameworks
      ] = await Promise.all([
        // Total users
        this.prisma.user.count({
          where: { 
            tenantId,
            deletedAt: null
          }
        }),
        // Total projects
        this.prisma.project.count({
          where: { 
            tenantId,
            deletedAt: null
          }
        }),
        // Total threat models
        this.prisma.threatModel.count({
          where: { 
            tenantId
          }
        }),
        // Total security projects
        this.prisma.securityProject.count({
          where: { 
            tenantId,
            deletedAt: null
          }
        }),
        // Active users in last 30 days
        this.prisma.user.count({
          where: {
            tenantId,
            deletedAt: null,
            lastLoginAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
            }
          }
        }),
        // Get compliance frameworks in use
        this.prisma.project.findMany({
          where: { 
            tenantId,
            deletedAt: null
          },
          select: { complianceFrameworks: true }
        })
      ]);

      // Extract unique compliance frameworks
      const uniqueFrameworks = Array.from(
        new Set(
          complianceFrameworks
            .flatMap(p => p.complianceFrameworks)
            .filter(Boolean)
        )
      );

      const stats: TenantStatsDto = {
        totalUsers,
        totalProjects,
        totalThreatModels,
        totalSecurityProjects,
        activeUsers,
        storageUsed: 0, // TODO: Implement storage calculation
        apiCallsToday: 0, // TODO: Implement API call tracking
        complianceFrameworks: uniqueFrameworks
      };

      this.logger.debug('Tenant statistics retrieved successfully', { 
        tenantId, 
        stats 
      });

      return stats;
    } catch (error) {
      this.logger.error('Failed to get tenant statistics', error as Error, { tenantId });
      throw error;
    }
  }

  // ========================================
  // HELPER METHODS
  // ========================================

  /**
   * Map database tenant to response DTO
   * @param tenant - Database tenant object
   * @returns Tenant response DTO
   */
  private mapTenantToResponseDto(tenant: any): TenantResponseDto {
    return {
      id: tenant.id,
      name: tenant.name,
      slug: tenant.slug,
      domain: tenant.domain,
      planId: tenant.planId,
      plan: tenant.plan ? {
        id: tenant.plan.id,
        name: tenant.plan.name,
        displayName: tenant.plan.displayName,
        tier: tenant.plan.name
      } : undefined,
      maxUsers: tenant.maxUsers,
      maxProjects: tenant.maxProjects,
      status: tenant.status,
      isActive: tenant.isActive,
      isTrial: tenant.isTrial,
      trialExpiresAt: tenant.trialExpiresAt,
      mfaRequired: tenant.mfaRequired,
      passwordPolicy: tenant.passwordPolicy,
      sessionTimeout: tenant.sessionTimeout,
      complianceFrameworks: tenant.complianceFrameworks,
      dataResidency: tenant.dataResidency,
      apiQuotaDaily: tenant.apiQuotaDaily,
      webhookUrl: tenant.webhookUrl,
      settings: tenant.settings,
      createdAt: tenant.createdAt,
      updatedAt: tenant.updatedAt,
      deletedAt: tenant.deletedAt
    };
  }

  /**
   * Get tenant-specific feature flags
   * @param tenantId - The tenant UUID
   * @returns Feature configuration for the tenant
   */
  async getTenantFeatures(tenantId: string): Promise<TenantFeaturesDto> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      include: {
        configuration: true,
      },
    });

    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${tenantId} not found`);
    }

    // If no configuration exists, create default one
    if (!tenant.configuration) {
      const config = await this.prisma.tenantConfiguration.create({
        data: {
          tenantId: tenant.id,
          // Default values will be used from schema
        },
      });
      
      return this.mapConfigToDto(config);
    }

    return this.mapConfigToDto(tenant.configuration);
  }

  /**
   * Update tenant feature flags
   * @param tenantId - The tenant UUID
   * @param updateDto - Feature flags to update
   * @returns Updated feature configuration
   */
  async updateTenantFeatures(
    tenantId: string,
    updateDto: UpdateTenantFeaturesDto,
  ): Promise<TenantFeaturesDto> {
    // Verify tenant exists
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${tenantId} not found`);
    }

    // Upsert configuration
    const config = await this.prisma.tenantConfiguration.upsert({
      where: { tenantId },
      update: {
        ...updateDto,
      },
      create: {
        tenantId,
        ...updateDto,
      },
    });

    return this.mapConfigToDto(config);
  }


  /**
   * Get tenant by slug
   * @param slug - The tenant slug
   * @returns Tenant information with features
   */
  async getTenantBySlug(slug: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { slug },
      include: {
        configuration: true,
        plan: true,
      },
    });

    if (!tenant) {
      throw new NotFoundException(`Tenant with slug ${slug} not found`);
    }

    return tenant;
  }

  /**
   * Map database configuration to DTO
   * @param config - Database configuration object
   * @returns Feature flags DTO
   */
  private mapConfigToDto(config: any): TenantFeaturesDto {
    return {
      enableRegistration: config.enableRegistration ?? true,
      enable2FA: config.enable2FA ?? false,
      enableLandingPage: config.enableLandingPage ?? true,
      enableDarkMode: config.enableDarkMode ?? true,
      ssoEnabled: config.ssoEnabled ?? false,
      ssoProvider: config.ssoProvider,
      ssoClientId: config.ssoClientId,
      theme: config.theme ?? 'corporate',
      primaryColor: config.primaryColor ?? '#2563eb',
      logoUrl: config.logoUrl,
    };
  }
}

