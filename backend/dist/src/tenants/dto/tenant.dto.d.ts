import { TenantStatus, PlanTier } from '@prisma/client';
export declare class CreateTenantDto {
    name: string;
    slug: string;
    domain?: string;
    planId?: string;
    maxUsers?: number;
    maxProjects?: number;
    status?: TenantStatus;
    isActive?: boolean;
    isTrial?: boolean;
    trialExpiresAt?: string;
    mfaRequired?: boolean;
    passwordPolicy?: object;
    sessionTimeout?: number;
    complianceFrameworks?: string[];
    dataResidency?: string;
    apiQuotaDaily?: number;
    webhookUrl?: string;
    settings?: object;
}
export declare class UpdateTenantDto {
    name?: string;
    slug?: string;
    domain?: string;
    planId?: string;
    maxUsers?: number;
    maxProjects?: number;
    status?: TenantStatus;
    isActive?: boolean;
    isTrial?: boolean;
    trialExpiresAt?: string;
    mfaRequired?: boolean;
    passwordPolicy?: object;
    sessionTimeout?: number;
    complianceFrameworks?: string[];
    dataResidency?: string;
    apiQuotaDaily?: number;
    webhookUrl?: string;
    settings?: object;
}
export declare class TenantResponseDto {
    id: string;
    name: string;
    slug: string;
    domain?: string;
    planId?: string;
    plan?: {
        id: string;
        name: string;
        displayName: string;
        tier: PlanTier;
    };
    maxUsers?: number;
    maxProjects?: number;
    status: TenantStatus;
    isActive: boolean;
    isTrial: boolean;
    trialExpiresAt?: Date;
    mfaRequired: boolean;
    passwordPolicy: object;
    sessionTimeout: number;
    complianceFrameworks: string[];
    dataResidency?: string;
    apiQuotaDaily: number;
    webhookUrl?: string;
    settings: object;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}
export declare class TenantListDto {
    tenants: TenantResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
export declare class TenantStatsDto {
    totalUsers: number;
    totalProjects: number;
    totalThreatModels: number;
    totalSecurityProjects: number;
    activeUsers: number;
    storageUsed: number;
    apiCallsToday: number;
    complianceFrameworks: string[];
}
export declare class TenantQueryDto {
    page?: number;
    limit?: number;
    search?: string;
    status?: TenantStatus;
    isActive?: boolean;
    isTrial?: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
