/**
 * File: tenants.controller.ts
 * Purpose: REST API endpoints for tenant configuration and feature flag management
 * 
 * Key Functions / Components / Classes:
 *   - TenantsController: Controller for tenant API endpoints
 *   - GET /tenants/:id/features - Get tenant feature flags
 *   - PATCH /tenants/:id/features - Update tenant features
 *   - GET /tenants/slug/:slug/features - Get features by slug
 *
 * Inputs:
 *   - Tenant ID or slug
 *   - Feature update payload
 *
 * Outputs:
 *   - Feature configuration JSON
 *   - Updated configuration
 *
 * Dependencies:
 *   - TenantsService for business logic
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { TenantsService } from './tenants.service';
import { TenantFeaturesDto, UpdateTenantFeaturesDto } from './dto/tenant-features.dto';
import { 
  CreateTenantDto, 
  UpdateTenantDto, 
  TenantResponseDto, 
  TenantListDto, 
  TenantStatsDto, 
  TenantQueryDto 
} from './dto/tenant.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Tenant Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/v1/tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  // ========================================
  // TENANT CRUD OPERATIONS
  // ========================================

  /**
   * Create a new tenant
   * POST /api/v1/tenants
   * 
   * @param createTenantDto - Tenant creation data
   * @returns Created tenant information
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRole.SUPER_ADMIN, UserRole.PLATFORM_ADMIN)
  @ApiOperation({ 
    summary: 'Create a new tenant',
    description: 'Create a new tenant with configuration and feature settings. Requires platform admin privileges.'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Tenant created successfully',
    type: TenantResponseDto
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  @ApiResponse({ status: 409, description: 'Tenant with slug already exists' })
  async createTenant(@Body() createTenantDto: CreateTenantDto): Promise<TenantResponseDto> {
    return this.tenantsService.createTenant(createTenantDto);
  }

  /**
   * Get all tenants with filtering and pagination
   * GET /api/v1/tenants
   * 
   * @param query - Query parameters for filtering and pagination
   * @returns Paginated list of tenants
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.SUPER_ADMIN, UserRole.PLATFORM_ADMIN)
  @ApiOperation({ 
    summary: 'Get all tenants',
    description: 'Retrieve a paginated list of all tenants with filtering options. Requires platform admin privileges.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Tenants retrieved successfully',
    type: TenantListDto
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  async getTenants(@Query() query: TenantQueryDto): Promise<TenantListDto> {
    return this.tenantsService.getTenants(query);
  }

  /**
   * Get tenant by ID
   * GET /api/v1/tenants/:id
   * 
   * @param id - Tenant UUID
   * @returns Tenant information
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.SUPER_ADMIN, UserRole.PLATFORM_ADMIN, UserRole.TENANT_ADMIN)
  @ApiOperation({ 
    summary: 'Get tenant by ID',
    description: 'Retrieve detailed information about a specific tenant.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Tenant retrieved successfully',
    type: TenantResponseDto
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  async getTenant(@Param('id') id: string): Promise<TenantResponseDto> {
    return this.tenantsService.getTenantById(id);
  }

  /**
   * Update tenant
   * PUT /api/v1/tenants/:id
   * 
   * @param id - Tenant UUID
   * @param updateTenantDto - Tenant update data
   * @returns Updated tenant information
   */
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.SUPER_ADMIN, UserRole.PLATFORM_ADMIN, UserRole.TENANT_ADMIN)
  @ApiOperation({ 
    summary: 'Update tenant',
    description: 'Update tenant information and configuration. Requires appropriate admin privileges.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Tenant updated successfully',
    type: TenantResponseDto
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  @ApiResponse({ status: 409, description: 'Tenant with slug already exists' })
  async updateTenant(
    @Param('id') id: string,
    @Body() updateTenantDto: UpdateTenantDto
  ): Promise<TenantResponseDto> {
    return this.tenantsService.updateTenant(id, updateTenantDto);
  }

  /**
   * Delete tenant (soft delete)
   * DELETE /api/v1/tenants/:id
   * 
   * @param id - Tenant UUID
   * @returns Deletion confirmation
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.SUPER_ADMIN, UserRole.PLATFORM_ADMIN)
  @ApiOperation({ 
    summary: 'Delete tenant',
    description: 'Soft delete a tenant and all associated data. Requires platform admin privileges.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Tenant deleted successfully',
    schema: { type: 'object', properties: { message: { type: 'string' } } }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  async deleteTenant(@Param('id') id: string): Promise<{ message: string }> {
    return this.tenantsService.deleteTenant(id);
  }

  /**
   * Get tenant statistics
   * GET /api/v1/tenants/:id/stats
   * 
   * @param id - Tenant UUID
   * @returns Tenant usage statistics
   */
  @Get(':id/stats')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.SUPER_ADMIN, UserRole.PLATFORM_ADMIN, UserRole.TENANT_ADMIN)
  @ApiOperation({ 
    summary: 'Get tenant statistics',
    description: 'Retrieve usage statistics and metrics for a specific tenant.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Tenant statistics retrieved successfully',
    type: TenantStatsDto
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  async getTenantStats(@Param('id') id: string): Promise<TenantStatsDto> {
    return this.tenantsService.getTenantStats(id);
  }

  // ========================================
  // TENANT FEATURE MANAGEMENT
  // ========================================

  /**
   * Get tenant feature flags by ID
   * GET /api/v1/tenants/:id/features
   * 
   * @param id - Tenant UUID
   * @returns Feature configuration
   */
  @Get(':id/features')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.SUPER_ADMIN, UserRole.PLATFORM_ADMIN, UserRole.TENANT_ADMIN)
  @ApiOperation({ 
    summary: 'Get tenant feature flags',
    description: 'Retrieve feature flags and configuration for a specific tenant.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Feature flags retrieved successfully',
    type: TenantFeaturesDto
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  async getTenantFeatures(
    @Param('id') id: string,
  ): Promise<TenantFeaturesDto> {
    return this.tenantsService.getTenantFeatures(id);
  }

  /**
   * Get tenant feature flags by slug
   * GET /api/v1/tenants/slug/:slug/features
   * 
   * @param slug - Tenant slug (e.g., "acme-corp")
   * @returns Feature configuration
   */
  @Get('slug/:slug/features')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.SUPER_ADMIN, UserRole.PLATFORM_ADMIN, UserRole.TENANT_ADMIN)
  @ApiOperation({ 
    summary: 'Get tenant feature flags by slug',
    description: 'Retrieve feature flags and configuration for a tenant using its slug identifier.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Feature flags retrieved successfully',
    type: TenantFeaturesDto
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  async getTenantFeaturesBySlug(
    @Param('slug') slug: string,
  ): Promise<TenantFeaturesDto> {
    const tenant = await this.tenantsService.getTenantBySlug(slug);
    return this.tenantsService.getTenantFeatures(tenant.id);
  }

  /**
   * Update tenant feature flags
   * PATCH /api/v1/tenants/:id/features
   * 
   * @param id - Tenant UUID
   * @param updateDto - Feature flags to update
   * @returns Updated feature configuration
   */
  @Patch(':id/features')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.SUPER_ADMIN, UserRole.PLATFORM_ADMIN, UserRole.TENANT_ADMIN)
  @ApiOperation({ 
    summary: 'Update tenant feature flags',
    description: 'Update feature flags and configuration for a specific tenant.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Feature flags updated successfully',
    type: TenantFeaturesDto
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  async updateTenantFeatures(
    @Param('id') id: string,
    @Body() updateDto: UpdateTenantFeaturesDto,
  ): Promise<TenantFeaturesDto> {
    return this.tenantsService.updateTenantFeatures(id, updateDto);
  }
}

