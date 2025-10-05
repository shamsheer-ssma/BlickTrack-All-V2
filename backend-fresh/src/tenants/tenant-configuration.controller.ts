/**
 * File: tenant-configuration.controller.ts
 * Purpose: REST API endpoints for tenant configuration management
 * 
 * Key Functions / Components / Classes:
 *   - TenantConfigurationController: Controller for tenant configuration API endpoints
 *   - Industry-specific configuration management
 *   - SSO and security settings management
 *   - UI/UX customization endpoints
 *
 * Inputs:
 *   - Tenant configuration data
 *   - Industry-specific settings
 *   - SSO configuration
 *
 * Outputs:
 *   - Configuration responses
 *   - Updated configuration confirmations
 *
 * Dependencies:
 *   - TenantConfigurationService for business logic
 *   - JWT and role guards for security
 *   - Swagger decorators for API documentation
 *
 * Notes:
 *   - Comprehensive tenant configuration management
 *   - Industry-specific customization support
 *   - SSO and security configuration
 *   - UI/UX customization options
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
import { TenantConfigurationService } from './tenant-configuration.service';
import { 
  CreateTenantConfigurationDto, 
  UpdateTenantConfigurationDto, 
  TenantConfigurationResponseDto 
} from './dto/tenant-configuration.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Tenant Configuration')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/v1/tenants/:tenantId/configuration')
export class TenantConfigurationController {
  constructor(private readonly tenantConfigurationService: TenantConfigurationService) {}

  // ========================================
  // TENANT CONFIGURATION CRUD OPERATIONS
  // ========================================

  /**
   * Create tenant configuration
   * POST /api/v1/tenants/:tenantId/configuration
   * 
   * @param tenantId - Tenant UUID
   * @param createConfigDto - Configuration creation data
   * @returns Created configuration information
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRole.SUPER_ADMIN, UserRole.PLATFORM_ADMIN, UserRole.TENANT_ADMIN)
  @ApiOperation({ 
    summary: 'Create tenant configuration',
    description: 'Create industry-specific configuration for a tenant. Requires appropriate admin privileges.'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Configuration created successfully',
    type: TenantConfigurationResponseDto
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  @ApiResponse({ status: 409, description: 'Configuration already exists' })
  async createConfiguration(
    @Param('tenantId') tenantId: string,
    @Body() createConfigDto: CreateTenantConfigurationDto
  ): Promise<TenantConfigurationResponseDto> {
    return this.tenantConfigurationService.createConfiguration(tenantId, createConfigDto);
  }

  /**
   * Get tenant configuration
   * GET /api/v1/tenants/:tenantId/configuration
   * 
   * @param tenantId - Tenant UUID
   * @returns Tenant configuration information
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.SUPER_ADMIN, UserRole.PLATFORM_ADMIN, UserRole.TENANT_ADMIN)
  @ApiOperation({ 
    summary: 'Get tenant configuration',
    description: 'Retrieve configuration and settings for a specific tenant.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Configuration retrieved successfully',
    type: TenantConfigurationResponseDto
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Configuration not found' })
  async getConfiguration(@Param('tenantId') tenantId: string): Promise<TenantConfigurationResponseDto> {
    return this.tenantConfigurationService.getConfiguration(tenantId);
  }

  /**
   * Update tenant configuration
   * PUT /api/v1/tenants/:tenantId/configuration
   * 
   * @param tenantId - Tenant UUID
   * @param updateConfigDto - Configuration update data
   * @returns Updated configuration information
   */
  @Put()
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.SUPER_ADMIN, UserRole.PLATFORM_ADMIN, UserRole.TENANT_ADMIN)
  @ApiOperation({ 
    summary: 'Update tenant configuration',
    description: 'Update configuration and settings for a specific tenant.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Configuration updated successfully',
    type: TenantConfigurationResponseDto
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Configuration not found' })
  async updateConfiguration(
    @Param('tenantId') tenantId: string,
    @Body() updateConfigDto: UpdateTenantConfigurationDto
  ): Promise<TenantConfigurationResponseDto> {
    return this.tenantConfigurationService.updateConfiguration(tenantId, updateConfigDto);
  }

  /**
   * Delete tenant configuration
   * DELETE /api/v1/tenants/:tenantId/configuration
   * 
   * @param tenantId - Tenant UUID
   * @returns Deletion confirmation
   */
  @Delete()
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.SUPER_ADMIN, UserRole.PLATFORM_ADMIN, UserRole.TENANT_ADMIN)
  @ApiOperation({ 
    summary: 'Delete tenant configuration',
    description: 'Delete configuration for a specific tenant. This will reset to default settings.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Configuration deleted successfully',
    schema: { type: 'object', properties: { message: { type: 'string' } } }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Configuration not found' })
  async deleteConfiguration(@Param('tenantId') tenantId: string): Promise<{ message: string }> {
    return this.tenantConfigurationService.deleteConfiguration(tenantId);
  }

  // ========================================
  // INDUSTRY-SPECIFIC CONFIGURATION
  // ========================================

  /**
   * Get industry-specific templates
   * GET /api/v1/tenants/:tenantId/configuration/industry-templates
   * 
   * @param tenantId - Tenant UUID
   * @returns Available industry templates
   */
  @Get('industry-templates')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.SUPER_ADMIN, UserRole.PLATFORM_ADMIN, UserRole.TENANT_ADMIN)
  @ApiOperation({ 
    summary: 'Get industry templates',
    description: 'Retrieve available industry-specific configuration templates.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Industry templates retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        templates: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              industryType: { type: 'string' },
              displayName: { type: 'string' },
              description: { type: 'string' },
              defaultConfiguration: { type: 'object' }
            }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  async getIndustryTemplates(@Param('tenantId') tenantId: string) {
    return this.tenantConfigurationService.getIndustryTemplates();
  }

  /**
   * Apply industry template
   * POST /api/v1/tenants/:tenantId/configuration/apply-template
   * 
   * @param tenantId - Tenant UUID
   * @param body - Template application data
   * @returns Applied configuration
   */
  @Post('apply-template')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.SUPER_ADMIN, UserRole.PLATFORM_ADMIN, UserRole.TENANT_ADMIN)
  @ApiOperation({ 
    summary: 'Apply industry template',
    description: 'Apply an industry-specific configuration template to a tenant.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Template applied successfully',
    type: TenantConfigurationResponseDto
  })
  @ApiResponse({ status: 400, description: 'Invalid template or input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Template not found' })
  async applyIndustryTemplate(
    @Param('tenantId') tenantId: string,
    @Body() body: { industryType: string; preserveCustomSettings?: boolean }
  ): Promise<TenantConfigurationResponseDto> {
    return this.tenantConfigurationService.applyIndustryTemplate(
      tenantId, 
      body.industryType, 
      body.preserveCustomSettings || false
    );
  }

  // ========================================
  // SSO CONFIGURATION
  // ========================================

  /**
   * Test SSO configuration
   * POST /api/v1/tenants/:tenantId/configuration/test-sso
   * 
   * @param tenantId - Tenant UUID
   * @param body - SSO test data
   * @returns SSO test results
   */
  @Post('test-sso')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.SUPER_ADMIN, UserRole.PLATFORM_ADMIN, UserRole.TENANT_ADMIN)
  @ApiOperation({ 
    summary: 'Test SSO configuration',
    description: 'Test SSO configuration settings for a tenant.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'SSO test completed',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        details: { type: 'object' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Invalid SSO configuration' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  async testSSOConfiguration(
    @Param('tenantId') tenantId: string,
    @Body() body: { ssoProvider: string; testCredentials?: object }
  ) {
    return this.tenantConfigurationService.testSSOConfiguration(tenantId, body.ssoProvider, body.testCredentials);
  }

  // ========================================
  // UI/UX CUSTOMIZATION
  // ========================================

  /**
   * Get UI theme options
   * GET /api/v1/tenants/:tenantId/configuration/theme-options
   * 
   * @param tenantId - Tenant UUID
   * @returns Available theme options
   */
  @Get('theme-options')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.SUPER_ADMIN, UserRole.PLATFORM_ADMIN, UserRole.TENANT_ADMIN)
  @ApiOperation({ 
    summary: 'Get theme options',
    description: 'Retrieve available UI theme options for tenant customization.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Theme options retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        themes: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              displayName: { type: 'string' },
              description: { type: 'string' },
              preview: { type: 'string' }
            }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  async getThemeOptions(@Param('tenantId') tenantId: string) {
    return this.tenantConfigurationService.getThemeOptions();
  }

  /**
   * Preview configuration changes
   * POST /api/v1/tenants/:tenantId/configuration/preview
   * 
   * @param tenantId - Tenant UUID
   * @param body - Configuration preview data
   * @returns Preview information
   */
  @Post('preview')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.SUPER_ADMIN, UserRole.PLATFORM_ADMIN, UserRole.TENANT_ADMIN)
  @ApiOperation({ 
    summary: 'Preview configuration changes',
    description: 'Preview how configuration changes will look without applying them.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Preview generated successfully',
    schema: {
      type: 'object',
      properties: {
        preview: { type: 'object' },
        changes: { type: 'array', items: { type: 'string' } }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Invalid preview data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  async previewConfiguration(
    @Param('tenantId') tenantId: string,
    @Body() body: UpdateTenantConfigurationDto
  ) {
    return this.tenantConfigurationService.previewConfiguration(tenantId, body);
  }
}
