/**
 * File: tenant.dto.ts
 * Purpose: Data Transfer Objects for tenant management operations
 * 
 * Key Functions / Components / Classes:
 *   - CreateTenantDto: DTO for tenant creation
 *   - UpdateTenantDto: DTO for tenant updates
 *   - TenantResponseDto: DTO for tenant responses
 *   - TenantListDto: DTO for tenant listing
 *   - TenantStatsDto: DTO for tenant statistics
 *
 * Inputs:
 *   - Tenant creation and update data
 *   - Query parameters for filtering and pagination
 *
 * Outputs:
 *   - Validated tenant data
 *   - Structured response objects
 *
 * Dependencies:
 *   - class-validator for validation
 *   - class-transformer for transformation
 *   - @nestjs/swagger for API documentation
 *
 * Notes:
 *   - Comprehensive validation for all tenant fields
 *   - Swagger documentation for all DTOs
 *   - Support for multi-tenant operations
 *   - Industry-specific configuration support
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsArray, IsEnum, IsInt, IsDateString, IsUrl, Min, Max, IsUUID, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { TenantStatus, PlanTier } from '@prisma/client';

export class CreateTenantDto {
  @ApiProperty({
    description: 'Tenant name',
    example: 'Acme Corporation',
    minLength: 2,
    maxLength: 100
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Tenant slug (URL-friendly identifier)',
    example: 'acme-corp',
    minLength: 2,
    maxLength: 50
  })
  @IsString()
  slug: string;

  @ApiPropertyOptional({
    description: 'Tenant domain (optional)',
    example: 'acme.com',
    maxLength: 255
  })
  @IsOptional()
  @IsString()
  domain?: string;

  @ApiPropertyOptional({
    description: 'Feature plan ID',
    example: 'uuid-of-plan'
  })
  @IsOptional()
  @IsUUID()
  planId?: string;

  @ApiPropertyOptional({
    description: 'Maximum number of users allowed',
    example: 100,
    minimum: 1
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  maxUsers?: number;

  @ApiPropertyOptional({
    description: 'Maximum number of projects allowed',
    example: 50,
    minimum: 1
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  maxProjects?: number;

  @ApiPropertyOptional({
    description: 'Tenant status',
    enum: TenantStatus,
    example: TenantStatus.TRIAL
  })
  @IsOptional()
  @IsEnum(TenantStatus)
  status?: TenantStatus;

  @ApiPropertyOptional({
    description: 'Whether tenant is active',
    example: true
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Whether tenant is in trial period',
    example: true
  })
  @IsOptional()
  @IsBoolean()
  isTrial?: boolean;

  @ApiPropertyOptional({
    description: 'Trial expiration date',
    example: '2024-12-31T23:59:59.000Z'
  })
  @IsOptional()
  @IsDateString()
  trialExpiresAt?: string;

  @ApiPropertyOptional({
    description: 'Whether MFA is required',
    example: false
  })
  @IsOptional()
  @IsBoolean()
  mfaRequired?: boolean;

  @ApiPropertyOptional({
    description: 'Password policy configuration',
    example: { minLength: 8, requireSpecialChar: true }
  })
  @IsOptional()
  @IsObject()
  passwordPolicy?: object;

  @ApiPropertyOptional({
    description: 'Session timeout in minutes',
    example: 480,
    minimum: 15,
    maximum: 1440
  })
  @IsOptional()
  @IsInt()
  @Min(15)
  @Max(1440)
  sessionTimeout?: number;

  @ApiPropertyOptional({
    description: 'Compliance frameworks',
    example: ['NIST', 'ISO27001', 'SOC2']
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  complianceFrameworks?: string[];

  @ApiPropertyOptional({
    description: 'Data residency region',
    example: 'US',
    maxLength: 10
  })
  @IsOptional()
  @IsString()
  dataResidency?: string;

  @ApiPropertyOptional({
    description: 'Daily API quota',
    example: 10000,
    minimum: 1000
  })
  @IsOptional()
  @IsInt()
  @Min(1000)
  apiQuotaDaily?: number;

  @ApiPropertyOptional({
    description: 'Webhook URL for notifications',
    example: 'https://acme.com/webhooks/blicktrack'
  })
  @IsOptional()
  @IsUrl()
  webhookUrl?: string;

  @ApiPropertyOptional({
    description: 'Additional tenant settings',
    example: { customField: 'value' }
  })
  @IsOptional()
  @IsObject()
  settings?: object;
}

export class UpdateTenantDto {
  @ApiPropertyOptional({
    description: 'Tenant name',
    example: 'Acme Corporation Updated',
    minLength: 2,
    maxLength: 100
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Tenant slug (URL-friendly identifier)',
    example: 'acme-corp-updated',
    minLength: 2,
    maxLength: 50
  })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({
    description: 'Tenant domain',
    example: 'acme-updated.com',
    maxLength: 255
  })
  @IsOptional()
  @IsString()
  domain?: string;

  @ApiPropertyOptional({
    description: 'Feature plan ID',
    example: 'uuid-of-plan'
  })
  @IsOptional()
  @IsUUID()
  planId?: string;

  @ApiPropertyOptional({
    description: 'Maximum number of users allowed',
    example: 200,
    minimum: 1
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  maxUsers?: number;

  @ApiPropertyOptional({
    description: 'Maximum number of projects allowed',
    example: 100,
    minimum: 1
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  maxProjects?: number;

  @ApiPropertyOptional({
    description: 'Tenant status',
    enum: TenantStatus,
    example: TenantStatus.ACTIVE
  })
  @IsOptional()
  @IsEnum(TenantStatus)
  status?: TenantStatus;

  @ApiPropertyOptional({
    description: 'Whether tenant is active',
    example: true
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Whether tenant is in trial period',
    example: false
  })
  @IsOptional()
  @IsBoolean()
  isTrial?: boolean;

  @ApiPropertyOptional({
    description: 'Trial expiration date',
    example: '2024-12-31T23:59:59.000Z'
  })
  @IsOptional()
  @IsDateString()
  trialExpiresAt?: string;

  @ApiPropertyOptional({
    description: 'Whether MFA is required',
    example: true
  })
  @IsOptional()
  @IsBoolean()
  mfaRequired?: boolean;

  @ApiPropertyOptional({
    description: 'Password policy configuration',
    example: { minLength: 12, requireSpecialChar: true, requireNumbers: true }
  })
  @IsOptional()
  @IsObject()
  passwordPolicy?: object;

  @ApiPropertyOptional({
    description: 'Session timeout in minutes',
    example: 720,
    minimum: 15,
    maximum: 1440
  })
  @IsOptional()
  @IsInt()
  @Min(15)
  @Max(1440)
  sessionTimeout?: number;

  @ApiPropertyOptional({
    description: 'Compliance frameworks',
    example: ['NIST', 'ISO27001', 'SOC2', 'PCI-DSS']
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  complianceFrameworks?: string[];

  @ApiPropertyOptional({
    description: 'Data residency region',
    example: 'EU',
    maxLength: 10
  })
  @IsOptional()
  @IsString()
  dataResidency?: string;

  @ApiPropertyOptional({
    description: 'Daily API quota',
    example: 50000,
    minimum: 1000
  })
  @IsOptional()
  @IsInt()
  @Min(1000)
  apiQuotaDaily?: number;

  @ApiPropertyOptional({
    description: 'Webhook URL for notifications',
    example: 'https://acme.com/webhooks/blicktrack-updated'
  })
  @IsOptional()
  @IsUrl()
  webhookUrl?: string;

  @ApiPropertyOptional({
    description: 'Additional tenant settings',
    example: { customField: 'updatedValue', newField: 'value' }
  })
  @IsOptional()
  @IsObject()
  settings?: object;
}

export class TenantResponseDto {
  @ApiProperty({
    description: 'Tenant ID',
    example: 'uuid-tenant-id'
  })
  id: string;

  @ApiProperty({
    description: 'Tenant name',
    example: 'Acme Corporation'
  })
  name: string;

  @ApiProperty({
    description: 'Tenant slug',
    example: 'acme-corp'
  })
  slug: string;

  @ApiPropertyOptional({
    description: 'Tenant domain',
    example: 'acme.com'
  })
  domain?: string;

  @ApiPropertyOptional({
    description: 'Feature plan ID',
    example: 'uuid-of-plan'
  })
  planId?: string;

  @ApiPropertyOptional({
    description: 'Feature plan details',
    type: 'object',
    additionalProperties: true
  })
  plan?: {
    id: string;
    name: string;
    displayName: string;
    tier: PlanTier;
  };

  @ApiPropertyOptional({
    description: 'Maximum number of users allowed',
    example: 100
  })
  maxUsers?: number;

  @ApiPropertyOptional({
    description: 'Maximum number of projects allowed',
    example: 50
  })
  maxProjects?: number;

  @ApiProperty({
    description: 'Tenant status',
    enum: TenantStatus,
    example: TenantStatus.ACTIVE
  })
  status: TenantStatus;

  @ApiProperty({
    description: 'Whether tenant is active',
    example: true
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Whether tenant is in trial period',
    example: false
  })
  isTrial: boolean;

  @ApiPropertyOptional({
    description: 'Trial expiration date',
    example: '2024-12-31T23:59:59.000Z'
  })
  trialExpiresAt?: Date;

  @ApiProperty({
    description: 'Whether MFA is required',
    example: false
  })
  mfaRequired: boolean;

  @ApiProperty({
    description: 'Password policy configuration',
    example: { minLength: 8, requireSpecialChar: true }
  })
  passwordPolicy: object;

  @ApiProperty({
    description: 'Session timeout in minutes',
    example: 480
  })
  sessionTimeout: number;

  @ApiProperty({
    description: 'Compliance frameworks',
    example: ['NIST', 'ISO27001']
  })
  complianceFrameworks: string[];

  @ApiPropertyOptional({
    description: 'Data residency region',
    example: 'US'
  })
  dataResidency?: string;

  @ApiProperty({
    description: 'Daily API quota',
    example: 10000
  })
  apiQuotaDaily: number;

  @ApiPropertyOptional({
    description: 'Webhook URL for notifications',
    example: 'https://acme.com/webhooks/blicktrack'
  })
  webhookUrl?: string;

  @ApiProperty({
    description: 'Additional tenant settings',
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

  @ApiPropertyOptional({
    description: 'Deletion timestamp (soft delete)',
    example: '2024-01-01T00:00:00.000Z'
  })
  deletedAt?: Date;
}

export class TenantListDto {
  @ApiProperty({
    description: 'List of tenants',
    type: [TenantResponseDto]
  })
  tenants: TenantResponseDto[];

  @ApiProperty({
    description: 'Total number of tenants',
    example: 25
  })
  total: number;

  @ApiProperty({
    description: 'Current page number',
    example: 1
  })
  page: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10
  })
  limit: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 3
  })
  totalPages: number;
}

export class TenantStatsDto {
  @ApiProperty({
    description: 'Total number of users',
    example: 150
  })
  totalUsers: number;

  @ApiProperty({
    description: 'Total number of projects',
    example: 75
  })
  totalProjects: number;

  @ApiProperty({
    description: 'Total number of threat models',
    example: 200
  })
  totalThreatModels: number;

  @ApiProperty({
    description: 'Total number of security projects',
    example: 50
  })
  totalSecurityProjects: number;

  @ApiProperty({
    description: 'Active users in last 30 days',
    example: 120
  })
  activeUsers: number;

  @ApiProperty({
    description: 'Storage used in MB',
    example: 1024
  })
  storageUsed: number;

  @ApiProperty({
    description: 'API calls made today',
    example: 5000
  })
  apiCallsToday: number;

  @ApiProperty({
    description: 'Compliance frameworks in use',
    example: ['NIST', 'ISO27001', 'SOC2']
  })
  complianceFrameworks: string[];
}

export class TenantQueryDto {
  @ApiPropertyOptional({
    description: 'Page number',
    example: 1,
    minimum: 1
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 10,
    minimum: 1,
    maximum: 100
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Search term for tenant name or slug',
    example: 'acme'
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by tenant status',
    enum: TenantStatus,
    example: TenantStatus.ACTIVE
  })
  @IsOptional()
  @IsEnum(TenantStatus)
  status?: TenantStatus;

  @ApiPropertyOptional({
    description: 'Filter by active status',
    example: true
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Filter by trial status',
    example: false
  })
  @IsOptional()
  @IsBoolean()
  isTrial?: boolean;

  @ApiPropertyOptional({
    description: 'Sort field',
    example: 'createdAt',
    enum: ['name', 'slug', 'status', 'createdAt', 'updatedAt']
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({
    description: 'Sort order',
    example: 'desc',
    enum: ['asc', 'desc']
  })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';
}
