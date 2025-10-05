/**
 * File: tenant-configuration.dto.ts
 * Purpose: Data Transfer Objects for tenant configuration management
 * 
 * Key Functions / Components / Classes:
 *   - CreateTenantConfigurationDto: DTO for tenant configuration creation
 *   - UpdateTenantConfigurationDto: DTO for tenant configuration updates
 *   - TenantConfigurationResponseDto: DTO for tenant configuration responses
 *   - Industry-specific configuration DTOs
 *
 * Inputs:
 *   - Tenant configuration creation and update data
 *   - Industry-specific settings
 *
 * Outputs:
 *   - Validated tenant configuration data
 *   - Structured response objects
 *
 * Dependencies:
 *   - class-validator for validation
 *   - class-transformer for transformation
 *   - @nestjs/swagger for API documentation
 *
 * Notes:
 *   - Comprehensive validation for all configuration fields
 *   - Industry-specific configuration support
 *   - Swagger documentation for all DTOs
 *   - Multi-tenant configuration management
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsArray, IsEnum, IsInt, IsObject, IsUrl, Min, Max, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { RiskLevel } from '@prisma/client';

export class CreateTenantConfigurationDto {
  @ApiProperty({
    description: 'Tenant ID',
    example: 'uuid-tenant-id'
  })
  @IsUUID()
  tenantId: string;

  @ApiProperty({
    description: 'Industry type',
    example: 'HEALTHCARE',
    enum: ['AEROSPACE', 'FINANCIAL', 'HEALTHCARE', 'TECHNOLOGY', 'GOVERNMENT', 'MANUFACTURING', 'RETAIL', 'EDUCATION']
  })
  @IsString()
  industryType: string;

  @ApiProperty({
    description: 'Organization type',
    example: 'PRODUCT_BASED',
    enum: ['PRODUCT_BASED', 'PROJECT_BASED', 'SERVICE_BASED']
  })
  @IsString()
  organizationType: string;

  @ApiPropertyOptional({
    description: 'Product terminology',
    example: 'Solution',
    maxLength: 50
  })
  @IsOptional()
  @IsString()
  productTerm?: string;

  @ApiPropertyOptional({
    description: 'Project terminology',
    example: 'Engagement',
    maxLength: 50
  })
  @IsOptional()
  @IsString()
  projectTerm?: string;

  @ApiPropertyOptional({
    description: 'Portfolio terminology',
    example: 'Division',
    maxLength: 50
  })
  @IsOptional()
  @IsString()
  portfolioTerm?: string;

  @ApiPropertyOptional({
    description: 'Workstream terminology',
    example: 'Activity',
    maxLength: 50
  })
  @IsOptional()
  @IsString()
  workstreamTerm?: string;

  @ApiPropertyOptional({
    description: 'Default hierarchy structure',
    example: ['PORTFOLIO', 'PROGRAM', 'PRODUCT', 'PROJECT'],
    type: [String]
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  defaultHierarchy?: string[];

  @ApiPropertyOptional({
    description: 'Maximum hierarchy levels',
    example: 5,
    minimum: 1,
    maximum: 10
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  maxHierarchyLevels?: number;

  @ApiPropertyOptional({
    description: 'Security frameworks',
    example: ['NIST', 'ISO27001', 'SOX'],
    type: [String]
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  securityFrameworks?: string[];

  @ApiPropertyOptional({
    description: 'Default risk level',
    enum: RiskLevel,
    example: RiskLevel.MEDIUM
  })
  @IsOptional()
  @IsEnum(RiskLevel)
  defaultRiskLevel?: RiskLevel;

  @ApiPropertyOptional({
    description: 'UI theme',
    example: 'aerospace',
    enum: ['corporate', 'aerospace', 'financial', 'healthcare', 'government']
  })
  @IsOptional()
  @IsString()
  theme?: string;

  @ApiPropertyOptional({
    description: 'Primary color',
    example: '#1e40af',
    pattern: '^#[0-9A-Fa-f]{6}$'
  })
  @IsOptional()
  @IsString()
  primaryColor?: string;

  @ApiPropertyOptional({
    description: 'Logo URL',
    example: 'https://example.com/logo.png'
  })
  @IsOptional()
  @IsUrl()
  logoUrl?: string;

  @ApiPropertyOptional({
    description: 'Custom CSS URL',
    example: 'https://example.com/custom.css'
  })
  @IsOptional()
  @IsUrl()
  customCssUrl?: string;

  @ApiPropertyOptional({
    description: 'Requires approval for changes',
    example: false
  })
  @IsOptional()
  @IsBoolean()
  requiresApproval?: boolean;

  @ApiPropertyOptional({
    description: 'Audit retention days',
    example: 2555,
    minimum: 30,
    maximum: 3650
  })
  @IsOptional()
  @IsInt()
  @Min(30)
  @Max(3650)
  auditRetentionDays?: number;

  @ApiPropertyOptional({
    description: 'Encryption required',
    example: true
  })
  @IsOptional()
  @IsBoolean()
  encryptionRequired?: boolean;

  @ApiPropertyOptional({
    description: 'SSO enabled',
    example: false
  })
  @IsOptional()
  @IsBoolean()
  ssoEnabled?: boolean;

  @ApiPropertyOptional({
    description: 'Active Directory integration enabled',
    example: false
  })
  @IsOptional()
  @IsBoolean()
  adIntegrationEnabled?: boolean;

  @ApiPropertyOptional({
    description: 'API access enabled',
    example: true
  })
  @IsOptional()
  @IsBoolean()
  apiAccessEnabled?: boolean;

  @ApiPropertyOptional({
    description: 'Enable user registration',
    example: true
  })
  @IsOptional()
  @IsBoolean()
  enableRegistration?: boolean;

  @ApiPropertyOptional({
    description: 'Enable two-factor authentication',
    example: false
  })
  @IsOptional()
  @IsBoolean()
  enable2FA?: boolean;

  @ApiPropertyOptional({
    description: 'Enable landing page',
    example: true
  })
  @IsOptional()
  @IsBoolean()
  enableLandingPage?: boolean;

  @ApiPropertyOptional({
    description: 'Enable dark mode',
    example: true
  })
  @IsOptional()
  @IsBoolean()
  enableDarkMode?: boolean;

  @ApiPropertyOptional({
    description: 'SSO provider',
    example: 'azure',
    enum: ['azure', 'okta', 'google', 'saml']
  })
  @IsOptional()
  @IsString()
  ssoProvider?: string;

  @ApiPropertyOptional({
    description: 'SSO client ID',
    example: 'client-id-123'
  })
  @IsOptional()
  @IsString()
  ssoClientId?: string;

  @ApiPropertyOptional({
    description: 'SSO tenant ID (for Azure AD)',
    example: 'tenant-id-123'
  })
  @IsOptional()
  @IsString()
  ssoTenantId?: string;

  @ApiPropertyOptional({
    description: 'SSO issuer URL (for SAML)',
    example: 'https://example.com/saml/metadata'
  })
  @IsOptional()
  @IsUrl()
  ssoIssuerUrl?: string;

  @ApiPropertyOptional({
    description: 'SSO metadata URL (for SAML)',
    example: 'https://example.com/saml/metadata.xml'
  })
  @IsOptional()
  @IsUrl()
  ssoMetadataUrl?: string;

  @ApiPropertyOptional({
    description: 'Additional configuration settings',
    example: { customField: 'value' }
  })
  @IsOptional()
  @IsObject()
  settings?: object;
}

export class UpdateTenantConfigurationDto {
  @ApiPropertyOptional({
    description: 'Industry type',
    example: 'FINANCIAL',
    enum: ['AEROSPACE', 'FINANCIAL', 'HEALTHCARE', 'TECHNOLOGY', 'GOVERNMENT', 'MANUFACTURING', 'RETAIL', 'EDUCATION']
  })
  @IsOptional()
  @IsString()
  industryType?: string;

  @ApiPropertyOptional({
    description: 'Organization type',
    example: 'SERVICE_BASED',
    enum: ['PRODUCT_BASED', 'PROJECT_BASED', 'SERVICE_BASED']
  })
  @IsOptional()
  @IsString()
  organizationType?: string;

  @ApiPropertyOptional({
    description: 'Product terminology',
    example: 'Service',
    maxLength: 50
  })
  @IsOptional()
  @IsString()
  productTerm?: string;

  @ApiPropertyOptional({
    description: 'Project terminology',
    example: 'Initiative',
    maxLength: 50
  })
  @IsOptional()
  @IsString()
  projectTerm?: string;

  @ApiPropertyOptional({
    description: 'Portfolio terminology',
    example: 'Program',
    maxLength: 50
  })
  @IsOptional()
  @IsString()
  portfolioTerm?: string;

  @ApiPropertyOptional({
    description: 'Workstream terminology',
    example: 'Task',
    maxLength: 50
  })
  @IsOptional()
  @IsString()
  workstreamTerm?: string;

  @ApiPropertyOptional({
    description: 'Default hierarchy structure',
    example: ['PORTFOLIO', 'PROGRAM', 'SERVICE', 'ENGAGEMENT'],
    type: [String]
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  defaultHierarchy?: string[];

  @ApiPropertyOptional({
    description: 'Maximum hierarchy levels',
    example: 6,
    minimum: 1,
    maximum: 10
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  maxHierarchyLevels?: number;

  @ApiPropertyOptional({
    description: 'Security frameworks',
    example: ['NIST', 'ISO27001', 'PCI-DSS'],
    type: [String]
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  securityFrameworks?: string[];

  @ApiPropertyOptional({
    description: 'Default risk level',
    enum: RiskLevel,
    example: RiskLevel.HIGH
  })
  @IsOptional()
  @IsEnum(RiskLevel)
  defaultRiskLevel?: RiskLevel;

  @ApiPropertyOptional({
    description: 'UI theme',
    example: 'financial',
    enum: ['corporate', 'aerospace', 'financial', 'healthcare', 'government']
  })
  @IsOptional()
  @IsString()
  theme?: string;

  @ApiPropertyOptional({
    description: 'Primary color',
    example: '#dc2626',
    pattern: '^#[0-9A-Fa-f]{6}$'
  })
  @IsOptional()
  @IsString()
  primaryColor?: string;

  @ApiPropertyOptional({
    description: 'Logo URL',
    example: 'https://example.com/new-logo.png'
  })
  @IsOptional()
  @IsUrl()
  logoUrl?: string;

  @ApiPropertyOptional({
    description: 'Custom CSS URL',
    example: 'https://example.com/new-custom.css'
  })
  @IsOptional()
  @IsUrl()
  customCssUrl?: string;

  @ApiPropertyOptional({
    description: 'Requires approval for changes',
    example: true
  })
  @IsOptional()
  @IsBoolean()
  requiresApproval?: boolean;

  @ApiPropertyOptional({
    description: 'Audit retention days',
    example: 3650,
    minimum: 30,
    maximum: 3650
  })
  @IsOptional()
  @IsInt()
  @Min(30)
  @Max(3650)
  auditRetentionDays?: number;

  @ApiPropertyOptional({
    description: 'Encryption required',
    example: true
  })
  @IsOptional()
  @IsBoolean()
  encryptionRequired?: boolean;

  @ApiPropertyOptional({
    description: 'SSO enabled',
    example: true
  })
  @IsOptional()
  @IsBoolean()
  ssoEnabled?: boolean;

  @ApiPropertyOptional({
    description: 'Active Directory integration enabled',
    example: true
  })
  @IsOptional()
  @IsBoolean()
  adIntegrationEnabled?: boolean;

  @ApiPropertyOptional({
    description: 'API access enabled',
    example: true
  })
  @IsOptional()
  @IsBoolean()
  apiAccessEnabled?: boolean;

  @ApiPropertyOptional({
    description: 'Enable user registration',
    example: false
  })
  @IsOptional()
  @IsBoolean()
  enableRegistration?: boolean;

  @ApiPropertyOptional({
    description: 'Enable two-factor authentication',
    example: true
  })
  @IsOptional()
  @IsBoolean()
  enable2FA?: boolean;

  @ApiPropertyOptional({
    description: 'Enable landing page',
    example: false
  })
  @IsOptional()
  @IsBoolean()
  enableLandingPage?: boolean;

  @ApiPropertyOptional({
    description: 'Enable dark mode',
    example: true
  })
  @IsOptional()
  @IsBoolean()
  enableDarkMode?: boolean;

  @ApiPropertyOptional({
    description: 'SSO provider',
    example: 'okta',
    enum: ['azure', 'okta', 'google', 'saml']
  })
  @IsOptional()
  @IsString()
  ssoProvider?: string;

  @ApiPropertyOptional({
    description: 'SSO client ID',
    example: 'new-client-id-456'
  })
  @IsOptional()
  @IsString()
  ssoClientId?: string;

  @ApiPropertyOptional({
    description: 'SSO tenant ID (for Azure AD)',
    example: 'new-tenant-id-456'
  })
  @IsOptional()
  @IsString()
  ssoTenantId?: string;

  @ApiPropertyOptional({
    description: 'SSO issuer URL (for SAML)',
    example: 'https://new-example.com/saml/metadata'
  })
  @IsOptional()
  @IsUrl()
  ssoIssuerUrl?: string;

  @ApiPropertyOptional({
    description: 'SSO metadata URL (for SAML)',
    example: 'https://new-example.com/saml/metadata.xml'
  })
  @IsOptional()
  @IsUrl()
  ssoMetadataUrl?: string;

  @ApiPropertyOptional({
    description: 'Additional configuration settings',
    example: { customField: 'updatedValue', newField: 'value' }
  })
  @IsOptional()
  @IsObject()
  settings?: object;
}

export class TenantConfigurationResponseDto {
  @ApiProperty({
    description: 'Configuration ID',
    example: 'uuid-config-id'
  })
  id: string;

  @ApiProperty({
    description: 'Tenant ID',
    example: 'uuid-tenant-id'
  })
  tenantId: string;

  @ApiProperty({
    description: 'Industry type',
    example: 'HEALTHCARE'
  })
  industryType: string;

  @ApiProperty({
    description: 'Organization type',
    example: 'PRODUCT_BASED'
  })
  organizationType: string;

  @ApiProperty({
    description: 'Product terminology',
    example: 'Product'
  })
  productTerm: string;

  @ApiProperty({
    description: 'Project terminology',
    example: 'Project'
  })
  projectTerm: string;

  @ApiProperty({
    description: 'Portfolio terminology',
    example: 'Portfolio'
  })
  portfolioTerm: string;

  @ApiProperty({
    description: 'Workstream terminology',
    example: 'Workstream'
  })
  workstreamTerm: string;

  @ApiProperty({
    description: 'Default hierarchy structure',
    example: ['PORTFOLIO', 'PROGRAM', 'PRODUCT', 'PROJECT']
  })
  defaultHierarchy: string[];

  @ApiProperty({
    description: 'Maximum hierarchy levels',
    example: 5
  })
  maxHierarchyLevels: number;

  @ApiProperty({
    description: 'Security frameworks',
    example: ['NIST', 'ISO27001']
  })
  securityFrameworks: string[];

  @ApiProperty({
    description: 'Default risk level',
    enum: RiskLevel,
    example: RiskLevel.MEDIUM
  })
  defaultRiskLevel: RiskLevel;

  @ApiProperty({
    description: 'UI theme',
    example: 'corporate'
  })
  theme: string;

  @ApiProperty({
    description: 'Primary color',
    example: '#2563eb'
  })
  primaryColor: string;

  @ApiPropertyOptional({
    description: 'Logo URL',
    example: 'https://example.com/logo.png'
  })
  logoUrl?: string;

  @ApiPropertyOptional({
    description: 'Custom CSS URL',
    example: 'https://example.com/custom.css'
  })
  customCssUrl?: string;

  @ApiProperty({
    description: 'Requires approval for changes',
    example: false
  })
  requiresApproval: boolean;

  @ApiProperty({
    description: 'Audit retention days',
    example: 2555
  })
  auditRetentionDays: number;

  @ApiProperty({
    description: 'Encryption required',
    example: true
  })
  encryptionRequired: boolean;

  @ApiProperty({
    description: 'SSO enabled',
    example: false
  })
  ssoEnabled: boolean;

  @ApiProperty({
    description: 'Active Directory integration enabled',
    example: false
  })
  adIntegrationEnabled: boolean;

  @ApiProperty({
    description: 'API access enabled',
    example: true
  })
  apiAccessEnabled: boolean;

  @ApiProperty({
    description: 'Enable user registration',
    example: true
  })
  enableRegistration: boolean;

  @ApiProperty({
    description: 'Enable two-factor authentication',
    example: false
  })
  enable2FA: boolean;

  @ApiProperty({
    description: 'Enable landing page',
    example: true
  })
  enableLandingPage: boolean;

  @ApiProperty({
    description: 'Enable dark mode',
    example: true
  })
  enableDarkMode: boolean;

  @ApiPropertyOptional({
    description: 'SSO provider',
    example: 'azure'
  })
  ssoProvider?: string;

  @ApiPropertyOptional({
    description: 'SSO client ID',
    example: 'client-id-123'
  })
  ssoClientId?: string;

  @ApiPropertyOptional({
    description: 'SSO tenant ID (for Azure AD)',
    example: 'tenant-id-123'
  })
  ssoTenantId?: string;

  @ApiPropertyOptional({
    description: 'SSO issuer URL (for SAML)',
    example: 'https://example.com/saml/metadata'
  })
  ssoIssuerUrl?: string;

  @ApiPropertyOptional({
    description: 'SSO metadata URL (for SAML)',
    example: 'https://example.com/saml/metadata.xml'
  })
  ssoMetadataUrl?: string;

  @ApiProperty({
    description: 'Additional configuration settings',
    example: { customField: 'value' }
  })
  settings: object;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-01T00:00:00.000Z'
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-01T00:00:00.000Z'
  })
  updatedAt: Date;
}
