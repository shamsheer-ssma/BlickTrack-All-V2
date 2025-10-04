/**
 * File: tenant-features.dto.ts
 * Purpose: Data Transfer Objects for tenant feature flags
 * 
 * Key Functions / Components / Classes:
 *   - TenantFeaturesDto: Response DTO for tenant features
 *   - UpdateTenantFeaturesDto: Request DTO for updating features
 *
 * Notes:
 *   - Used for API request/response validation
 *   - Provides type safety for feature flags
 */

import { IsBoolean, IsOptional, IsString } from 'class-validator';

/**
 * Tenant Feature Flags Response DTO
 * Returned when fetching tenant configuration
 */
export class TenantFeaturesDto {
  // Feature Flags
  enableRegistration: boolean;
  enable2FA: boolean;
  enableLandingPage: boolean;
  enableDarkMode: boolean;
  
  // SSO Configuration
  ssoEnabled: boolean;
  ssoProvider?: string | null;
  ssoClientId?: string | null;
  
  // UI Configuration
  theme: string;
  primaryColor: string;
  logoUrl?: string | null;
}

/**
 * Update Tenant Features DTO
 * Used for updating tenant configuration
 */
export class UpdateTenantFeaturesDto {
  @IsOptional()
  @IsBoolean()
  enableRegistration?: boolean;

  @IsOptional()
  @IsBoolean()
  enable2FA?: boolean;

  @IsOptional()
  @IsBoolean()
  enableLandingPage?: boolean;

  @IsOptional()
  @IsBoolean()
  enableDarkMode?: boolean;

  @IsOptional()
  @IsBoolean()
  ssoEnabled?: boolean;

  @IsOptional()
  @IsString()
  ssoProvider?: string;

  @IsOptional()
  @IsString()
  ssoClientId?: string;

  @IsOptional()
  @IsString()
  ssoTenantId?: string;

  @IsOptional()
  @IsString()
  ssoIssuerUrl?: string;

  @IsOptional()
  @IsString()
  theme?: string;

  @IsOptional()
  @IsString()
  primaryColor?: string;

  @IsOptional()
  @IsString()
  logoUrl?: string;
}

