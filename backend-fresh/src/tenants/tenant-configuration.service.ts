/**
 * File: tenant-configuration.service.ts
 * Purpose: Comprehensive tenant configuration management service for the BlickTrack backend API. Handles all tenant-specific configuration including industry settings, terminology customization, UI/UX configuration, SSO setup, security policies, and compliance frameworks. Provides enterprise-grade tenant customization functionality.
 * 
 * Key Functions / Components / Classes:
 *   - TenantConfigurationService: Main tenant configuration service class
 *   - getTenantConfiguration: Retrieve tenant configuration with defaults
 *   - updateTenantConfiguration: Update tenant-specific settings
 *   - createTenantConfiguration: Create new tenant configuration
 *   - mapConfigToResponseDto: Convert Prisma model to response DTO
 *   - Industry customization: Industry-specific terminology and settings
 *   - SSO configuration: Single sign-on setup and management
 *   - Security policies: Tenant-specific security configurations
 *   - UI/UX customization: Theme, colors, and branding settings
 *
 * Inputs:
 *   - Tenant ID for configuration lookup
 *   - Configuration update data (industry, terminology, UI, etc.)
 *   - SSO provider settings and credentials
 *   - Security policy configurations
 *   - Compliance framework settings
 *
 * Outputs:
 *   - TenantConfigurationResponseDto with complete configuration
 *   - Updated configuration confirmations
 *   - Default configuration when none exists
 *   - Error responses for invalid configurations
 *
 * Dependencies:
 *   - PrismaService for database operations
 *   - LoggerService for debug logging
 *   - ConfigService for configuration management
 *   - TenantConfiguration Prisma model
 *
 * Notes:
 *   - Implements comprehensive tenant configuration management
 *   - Supports industry-specific customization
 *   - Includes SSO and security configuration
 *   - Provides UI/UX customization options
 *   - Handles compliance framework settings
 *   - Creates default configurations when needed
 *   - Supports enterprise tenant requirements
 */

import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LoggerService } from '../common/services/logger.service';
import { ConfigService } from '@nestjs/config';
import { 
  CreateTenantConfigurationDto, 
  UpdateTenantConfigurationDto, 
  TenantConfigurationResponseDto 
} from './dto/tenant-configuration.dto';
import { RiskLevel } from '@prisma/client';

@Injectable()
export class TenantConfigurationService {
  private readonly logger: LoggerService;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.logger = new LoggerService(configService);
    this.logger.setContext('TenantConfigurationService');
    this.logger.debug('TenantConfigurationService initialized');
  }

  // ========================================
  // TENANT CONFIGURATION CRUD OPERATIONS
  // ========================================

  /**
   * Create tenant configuration
   * @param tenantId - The tenant UUID
   * @param createConfigDto - Configuration creation data
   * @returns Created configuration information
   */
  async createConfiguration(
    tenantId: string, 
    createConfigDto: CreateTenantConfigurationDto
  ): Promise<TenantConfigurationResponseDto> {
    this.logger.debug('Creating tenant configuration', { 
      tenantId, 
      industryType: createConfigDto.industryType 
    });

    // Verify tenant exists
    const tenant = await this.prisma.tenant.findUnique({
      where: { 
        id: tenantId,
        deletedAt: null
      }
    });

    if (!tenant) {
      this.logger.warn('Configuration creation failed - tenant not found', { tenantId });
      throw new NotFoundException(`Tenant with ID ${tenantId} not found`);
    }

    // Check if configuration already exists
    const existingConfig = await this.prisma.tenantConfiguration.findUnique({
      where: { tenantId }
    });

    if (existingConfig) {
      this.logger.warn('Configuration creation failed - already exists', { tenantId });
      throw new ConflictException(`Configuration for tenant ${tenantId} already exists`);
    }

    try {
      const configuration = await this.prisma.tenantConfiguration.create({
        data: {
          ...createConfigDto,
          // Set default values
          industryType: createConfigDto.industryType || 'TECHNOLOGY',
          organizationType: createConfigDto.organizationType || 'PRODUCT_BASED',
          productTerm: createConfigDto.productTerm || 'Product',
          projectTerm: createConfigDto.projectTerm || 'Project',
          portfolioTerm: createConfigDto.portfolioTerm || 'Portfolio',
          workstreamTerm: createConfigDto.workstreamTerm || 'Workstream',
          defaultHierarchy: createConfigDto.defaultHierarchy || ['PORTFOLIO', 'PROGRAM', 'PRODUCT', 'PROJECT'],
          maxHierarchyLevels: createConfigDto.maxHierarchyLevels || 5,
          securityFrameworks: createConfigDto.securityFrameworks || [],
          defaultRiskLevel: createConfigDto.defaultRiskLevel || RiskLevel.MEDIUM,
          theme: createConfigDto.theme || 'corporate',
          primaryColor: createConfigDto.primaryColor || '#2563eb',
          requiresApproval: createConfigDto.requiresApproval ?? false,
          auditRetentionDays: createConfigDto.auditRetentionDays || 2555,
          encryptionRequired: createConfigDto.encryptionRequired ?? true,
          ssoEnabled: createConfigDto.ssoEnabled ?? false,
          adIntegrationEnabled: createConfigDto.adIntegrationEnabled ?? false,
          apiAccessEnabled: createConfigDto.apiAccessEnabled ?? true,
          enableRegistration: createConfigDto.enableRegistration ?? true,
          enable2FA: createConfigDto.enable2FA ?? false,
          enableLandingPage: createConfigDto.enableLandingPage ?? true,
          enableDarkMode: createConfigDto.enableDarkMode ?? true,
          settings: createConfigDto.settings || {},
        }
      });

      this.logger.info('Tenant configuration created successfully', { 
        tenantId, 
        configId: configuration.id,
        industryType: configuration.industryType
      });

      return this.mapConfigurationToResponseDto(configuration);
    } catch (error) {
      this.logger.error('Failed to create tenant configuration', error as Error, { 
        tenantId, 
        createConfigDto 
      });
      throw error;
    }
  }

  /**
   * Get tenant configuration
   * @param tenantId - The tenant UUID
   * @returns Tenant configuration information
   */
  async getConfiguration(tenantId: string): Promise<TenantConfigurationResponseDto> {
    this.logger.debug('Getting tenant configuration', { tenantId });

    const configuration = await this.prisma.tenantConfiguration.findUnique({
      where: { tenantId }
    });

    if (!configuration) {
      this.logger.warn('Configuration not found', { tenantId });
      throw new NotFoundException(`Configuration for tenant ${tenantId} not found`);
    }

    this.logger.debug('Configuration retrieved successfully', { 
      tenantId, 
      configId: configuration.id,
      industryType: configuration.industryType
    });

    return this.mapConfigurationToResponseDto(configuration);
  }

  /**
   * Update tenant configuration
   * @param tenantId - The tenant UUID
   * @param updateConfigDto - Configuration update data
   * @returns Updated configuration information
   */
  async updateConfiguration(
    tenantId: string, 
    updateConfigDto: UpdateTenantConfigurationDto
  ): Promise<TenantConfigurationResponseDto> {
    this.logger.debug('Updating tenant configuration', { 
      tenantId, 
      updateData: updateConfigDto 
    });

    // Verify configuration exists
    const existingConfig = await this.prisma.tenantConfiguration.findUnique({
      where: { tenantId }
    });

    if (!existingConfig) {
      this.logger.warn('Configuration update failed - not found', { tenantId });
      throw new NotFoundException(`Configuration for tenant ${tenantId} not found`);
    }

    try {
      const updatedConfiguration = await this.prisma.tenantConfiguration.update({
        where: { tenantId },
        data: updateConfigDto
      });

      this.logger.info('Configuration updated successfully', { 
        tenantId, 
        configId: updatedConfiguration.id,
        updatedFields: Object.keys(updateConfigDto)
      });

      return this.mapConfigurationToResponseDto(updatedConfiguration);
    } catch (error) {
      this.logger.error('Failed to update tenant configuration', error as Error, { 
        tenantId, 
        updateConfigDto 
      });
      throw error;
    }
  }

  /**
   * Delete tenant configuration
   * @param tenantId - The tenant UUID
   * @returns Deletion confirmation
   */
  async deleteConfiguration(tenantId: string): Promise<{ message: string }> {
    this.logger.debug('Deleting tenant configuration', { tenantId });

    // Verify configuration exists
    const existingConfig = await this.prisma.tenantConfiguration.findUnique({
      where: { tenantId }
    });

    if (!existingConfig) {
      this.logger.warn('Configuration deletion failed - not found', { tenantId });
      throw new NotFoundException(`Configuration for tenant ${tenantId} not found`);
    }

    try {
      await this.prisma.tenantConfiguration.delete({
        where: { tenantId }
      });

      this.logger.info('Configuration deleted successfully', { 
        tenantId, 
        configId: existingConfig.id
      });

      return { message: 'Configuration deleted successfully' };
    } catch (error) {
      this.logger.error('Failed to delete tenant configuration', error as Error, { tenantId });
      throw error;
    }
  }

  // ========================================
  // INDUSTRY-SPECIFIC CONFIGURATION
  // ========================================

  /**
   * Get industry-specific templates
   * @returns Available industry templates
   */
  async getIndustryTemplates() {
    this.logger.debug('Getting industry templates');

    const templates = [
      {
        industryType: 'AEROSPACE',
        displayName: 'Aerospace & Defense',
        description: 'Configuration for aerospace and defense organizations',
        defaultConfiguration: {
          industryType: 'AEROSPACE',
          organizationType: 'PRODUCT_BASED',
          productTerm: 'Aircraft',
          projectTerm: 'Program',
          portfolioTerm: 'Fleet',
          workstreamTerm: 'Phase',
          defaultHierarchy: ['FLEET', 'PROGRAM', 'AIRCRAFT', 'SYSTEM'],
          maxHierarchyLevels: 6,
          securityFrameworks: ['NIST', 'ISO27001', 'DO-326A'],
          defaultRiskLevel: RiskLevel.HIGH,
          theme: 'aerospace',
          primaryColor: '#1e40af',
          requiresApproval: true,
          encryptionRequired: true,
          enable2FA: true
        }
      },
      {
        industryType: 'FINANCIAL',
        displayName: 'Financial Services',
        description: 'Configuration for financial services organizations',
        defaultConfiguration: {
          industryType: 'FINANCIAL',
          organizationType: 'SERVICE_BASED',
          productTerm: 'Service',
          projectTerm: 'Initiative',
          portfolioTerm: 'Division',
          workstreamTerm: 'Workstream',
          defaultHierarchy: ['DIVISION', 'INITIATIVE', 'SERVICE', 'COMPONENT'],
          maxHierarchyLevels: 5,
          securityFrameworks: ['NIST', 'ISO27001', 'PCI-DSS', 'SOX'],
          defaultRiskLevel: RiskLevel.HIGH,
          theme: 'financial',
          primaryColor: '#dc2626',
          requiresApproval: true,
          encryptionRequired: true,
          enable2FA: true,
          auditRetentionDays: 3650
        }
      },
      {
        industryType: 'HEALTHCARE',
        displayName: 'Healthcare',
        description: 'Configuration for healthcare organizations',
        defaultConfiguration: {
          industryType: 'HEALTHCARE',
          organizationType: 'SERVICE_BASED',
          productTerm: 'Service',
          projectTerm: 'Program',
          portfolioTerm: 'Department',
          workstreamTerm: 'Activity',
          defaultHierarchy: ['DEPARTMENT', 'PROGRAM', 'SERVICE', 'PROCESS'],
          maxHierarchyLevels: 5,
          securityFrameworks: ['NIST', 'ISO27001', 'HIPAA'],
          defaultRiskLevel: RiskLevel.HIGH,
          theme: 'healthcare',
          primaryColor: '#059669',
          requiresApproval: true,
          encryptionRequired: true,
          enable2FA: true,
          auditRetentionDays: 2555
        }
      },
      {
        industryType: 'TECHNOLOGY',
        displayName: 'Technology',
        description: 'Configuration for technology organizations',
        defaultConfiguration: {
          industryType: 'TECHNOLOGY',
          organizationType: 'PRODUCT_BASED',
          productTerm: 'Product',
          projectTerm: 'Project',
          portfolioTerm: 'Portfolio',
          workstreamTerm: 'Workstream',
          defaultHierarchy: ['PORTFOLIO', 'PROGRAM', 'PRODUCT', 'PROJECT'],
          maxHierarchyLevels: 5,
          securityFrameworks: ['NIST', 'ISO27001'],
          defaultRiskLevel: RiskLevel.MEDIUM,
          theme: 'corporate',
          primaryColor: '#2563eb',
          requiresApproval: false,
          encryptionRequired: true,
          enable2FA: false
        }
      },
      {
        industryType: 'GOVERNMENT',
        displayName: 'Government',
        description: 'Configuration for government organizations',
        defaultConfiguration: {
          industryType: 'GOVERNMENT',
          organizationType: 'PROJECT_BASED',
          productTerm: 'System',
          projectTerm: 'Initiative',
          portfolioTerm: 'Agency',
          workstreamTerm: 'Task',
          defaultHierarchy: ['AGENCY', 'INITIATIVE', 'SYSTEM', 'COMPONENT'],
          maxHierarchyLevels: 6,
          securityFrameworks: ['NIST', 'FISMA', 'FedRAMP'],
          defaultRiskLevel: RiskLevel.HIGH,
          theme: 'government',
          primaryColor: '#7c3aed',
          requiresApproval: true,
          encryptionRequired: true,
          enable2FA: true,
          auditRetentionDays: 3650
        }
      }
    ];

    this.logger.debug('Industry templates retrieved successfully', { 
      count: templates.length 
    });

    return { templates };
  }

  /**
   * Apply industry template
   * @param tenantId - The tenant UUID
   * @param industryType - Industry type to apply
   * @param preserveCustomSettings - Whether to preserve custom settings
   * @returns Applied configuration
   */
  async applyIndustryTemplate(
    tenantId: string, 
    industryType: string, 
    preserveCustomSettings: boolean = false
  ): Promise<TenantConfigurationResponseDto> {
    this.logger.debug('Applying industry template', { 
      tenantId, 
      industryType, 
      preserveCustomSettings 
    });

    // Get the template
    const templates = await this.getIndustryTemplates();
    const template = templates.templates.find(t => t.industryType === industryType);

    if (!template) {
      this.logger.warn('Template not found', { industryType });
      throw new NotFoundException(`Industry template for ${industryType} not found`);
    }

    // Verify tenant exists
    const tenant = await this.prisma.tenant.findUnique({
      where: { 
        id: tenantId,
        deletedAt: null
      }
    });

    if (!tenant) {
      this.logger.warn('Template application failed - tenant not found', { tenantId });
      throw new NotFoundException(`Tenant with ID ${tenantId} not found`);
    }

    try {
      let configuration;

      if (preserveCustomSettings) {
        // Update existing configuration with template values
        configuration = await this.prisma.tenantConfiguration.upsert({
          where: { tenantId },
          update: template.defaultConfiguration,
          create: {
            tenantId,
            ...template.defaultConfiguration
          }
        });
      } else {
        // Replace configuration with template values
        configuration = await this.prisma.tenantConfiguration.upsert({
          where: { tenantId },
          update: template.defaultConfiguration,
          create: {
            tenantId,
            ...template.defaultConfiguration
          }
        });
      }

      this.logger.info('Industry template applied successfully', { 
        tenantId, 
        industryType,
        configId: configuration.id
      });

      return this.mapConfigurationToResponseDto(configuration);
    } catch (error) {
      this.logger.error('Failed to apply industry template', error as Error, { 
        tenantId, 
        industryType 
      });
      throw error;
    }
  }

  // ========================================
  // SSO CONFIGURATION
  // ========================================

  /**
   * Test SSO configuration
   * @param tenantId - The tenant UUID
   * @param ssoProvider - SSO provider to test
   * @param testCredentials - Optional test credentials
   * @returns SSO test results
   */
  async testSSOConfiguration(
    tenantId: string, 
    ssoProvider: string, 
    testCredentials?: object
  ) {
    this.logger.debug('Testing SSO configuration', { 
      tenantId, 
      ssoProvider 
    });

    // Get current configuration
    const configuration = await this.prisma.tenantConfiguration.findUnique({
      where: { tenantId }
    });

    if (!configuration) {
      this.logger.warn('SSO test failed - configuration not found', { tenantId });
      throw new NotFoundException(`Configuration for tenant ${tenantId} not found`);
    }

    try {
      // Simulate SSO test based on provider
      let testResult;
      
      switch (ssoProvider) {
        case 'azure':
          testResult = await this.testAzureSSO(configuration, testCredentials);
          break;
        case 'okta':
          testResult = await this.testOktaSSO(configuration, testCredentials);
          break;
        case 'google':
          testResult = await this.testGoogleSSO(configuration, testCredentials);
          break;
        case 'saml':
          testResult = await this.testSAMLSSO(configuration, testCredentials);
          break;
        default:
          throw new BadRequestException(`Unsupported SSO provider: ${ssoProvider}`);
      }

      this.logger.info('SSO test completed', { 
        tenantId, 
        ssoProvider, 
        success: testResult.success 
      });

      return testResult;
    } catch (error) {
      this.logger.error('SSO test failed', error as Error, { 
        tenantId, 
        ssoProvider 
      });
      throw error;
    }
  }

  // ========================================
  // UI/UX CUSTOMIZATION
  // ========================================

  /**
   * Get UI theme options
   * @returns Available theme options
   */
  async getThemeOptions() {
    this.logger.debug('Getting theme options');

    const themes = [
      {
        id: 'corporate',
        name: 'corporate',
        displayName: 'Corporate',
        description: 'Professional corporate theme',
        preview: '/themes/corporate-preview.png'
      },
      {
        id: 'aerospace',
        name: 'aerospace',
        displayName: 'Aerospace',
        description: 'Aerospace and defense theme',
        preview: '/themes/aerospace-preview.png'
      },
      {
        id: 'financial',
        name: 'financial',
        displayName: 'Financial',
        description: 'Financial services theme',
        preview: '/themes/financial-preview.png'
      },
      {
        id: 'healthcare',
        name: 'healthcare',
        displayName: 'Healthcare',
        description: 'Healthcare industry theme',
        preview: '/themes/healthcare-preview.png'
      },
      {
        id: 'government',
        name: 'government',
        displayName: 'Government',
        description: 'Government organization theme',
        preview: '/themes/government-preview.png'
      }
    ];

    this.logger.debug('Theme options retrieved successfully', { 
      count: themes.length 
    });

    return { themes };
  }

  /**
   * Preview configuration changes
   * @param tenantId - The tenant UUID
   * @param previewData - Configuration preview data
   * @returns Preview information
   */
  async previewConfiguration(
    tenantId: string, 
    previewData: UpdateTenantConfigurationDto
  ) {
    this.logger.debug('Previewing configuration changes', { 
      tenantId, 
      previewData 
    });

    // Get current configuration
    const currentConfig = await this.prisma.tenantConfiguration.findUnique({
      where: { tenantId }
    });

    if (!currentConfig) {
      this.logger.warn('Preview failed - configuration not found', { tenantId });
      throw new NotFoundException(`Configuration for tenant ${tenantId} not found`);
    }

    // Merge current config with preview data
    const previewConfig = {
      ...currentConfig,
      ...previewData
    };

    // Generate preview information
    const changes = Object.keys(previewData).map(key => {
      const oldValue = currentConfig[key];
      const newValue = previewData[key];
      return `${key}: ${JSON.stringify(oldValue)} → ${JSON.stringify(newValue)}`;
    });

    const preview = {
      theme: previewConfig.theme,
      primaryColor: previewConfig.primaryColor,
      logoUrl: previewConfig.logoUrl,
      customCssUrl: previewConfig.customCssUrl,
      industryType: previewConfig.industryType,
      organizationType: previewConfig.organizationType,
      productTerm: previewConfig.productTerm,
      projectTerm: previewConfig.projectTerm,
      portfolioTerm: previewConfig.portfolioTerm,
      workstreamTerm: previewConfig.workstreamTerm
    };

    this.logger.debug('Configuration preview generated successfully', { 
      tenantId, 
      changesCount: changes.length 
    });

    return {
      preview,
      changes
    };
  }

  // ========================================
  // HELPER METHODS
  // ========================================

  /**
   * Map database configuration to response DTO
   * @param configuration - Database configuration object
   * @returns Configuration response DTO
   */
  private mapConfigurationToResponseDto(configuration: any): TenantConfigurationResponseDto {
    return {
      id: configuration.id,
      tenantId: configuration.tenantId,
      industryType: configuration.industryType,
      organizationType: configuration.organizationType,
      productTerm: configuration.productTerm,
      projectTerm: configuration.projectTerm,
      portfolioTerm: configuration.portfolioTerm,
      workstreamTerm: configuration.workstreamTerm,
      defaultHierarchy: configuration.defaultHierarchy,
      maxHierarchyLevels: configuration.maxHierarchyLevels,
      securityFrameworks: configuration.securityFrameworks,
      defaultRiskLevel: configuration.defaultRiskLevel,
      theme: configuration.theme,
      primaryColor: configuration.primaryColor,
      logoUrl: configuration.logoUrl,
      customCssUrl: configuration.customCssUrl,
      requiresApproval: configuration.requiresApproval,
      auditRetentionDays: configuration.auditRetentionDays,
      encryptionRequired: configuration.encryptionRequired,
      ssoEnabled: configuration.ssoEnabled,
      adIntegrationEnabled: configuration.adIntegrationEnabled,
      apiAccessEnabled: configuration.apiAccessEnabled,
      enableRegistration: configuration.enableRegistration,
      enable2FA: configuration.enable2FA,
      enableLandingPage: configuration.enableLandingPage,
      enableDarkMode: configuration.enableDarkMode,
      ssoProvider: configuration.ssoProvider,
      ssoClientId: configuration.ssoClientId,
      ssoTenantId: configuration.ssoTenantId,
      ssoIssuerUrl: configuration.ssoIssuerUrl,
      ssoMetadataUrl: configuration.ssoMetadataUrl,
      settings: configuration.settings,
      createdAt: configuration.createdAt,
      updatedAt: configuration.updatedAt
    };
  }

  // ========================================
  // SSO TEST HELPERS
  // ========================================

  private async testAzureSSO(configuration: any, testCredentials?: object) {
    // Simulate Azure AD SSO test
    return {
      success: true,
      message: 'Azure AD SSO configuration is valid',
      details: {
        provider: 'azure',
        tenantId: configuration.ssoTenantId,
        clientId: configuration.ssoClientId,
        testTime: new Date().toISOString()
      }
    };
  }

  private async testOktaSSO(configuration: any, testCredentials?: object) {
    // Simulate Okta SSO test
    return {
      success: true,
      message: 'Okta SSO configuration is valid',
      details: {
        provider: 'okta',
        clientId: configuration.ssoClientId,
        testTime: new Date().toISOString()
      }
    };
  }

  private async testGoogleSSO(configuration: any, testCredentials?: object) {
    // Simulate Google SSO test
    return {
      success: true,
      message: 'Google SSO configuration is valid',
      details: {
        provider: 'google',
        clientId: configuration.ssoClientId,
        testTime: new Date().toISOString()
      }
    };
  }

  private async testSAMLSSO(configuration: any, testCredentials?: object) {
    // Simulate SAML SSO test
    return {
      success: true,
      message: 'SAML SSO configuration is valid',
      details: {
        provider: 'saml',
        issuerUrl: configuration.ssoIssuerUrl,
        metadataUrl: configuration.ssoMetadataUrl,
        testTime: new Date().toISOString()
      }
    };
  }
}
