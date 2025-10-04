"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantQueryDto = exports.TenantStatsDto = exports.TenantListDto = exports.TenantResponseDto = exports.UpdateTenantDto = exports.CreateTenantDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const client_1 = require("@prisma/client");
class CreateTenantDto {
    name;
    slug;
    domain;
    planId;
    maxUsers;
    maxProjects;
    status;
    isActive;
    isTrial;
    trialExpiresAt;
    mfaRequired;
    passwordPolicy;
    sessionTimeout;
    complianceFrameworks;
    dataResidency;
    apiQuotaDaily;
    webhookUrl;
    settings;
}
exports.CreateTenantDto = CreateTenantDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tenant name',
        example: 'Acme Corporation',
        minLength: 2,
        maxLength: 100
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTenantDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tenant slug (URL-friendly identifier)',
        example: 'acme-corp',
        minLength: 2,
        maxLength: 50
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTenantDto.prototype, "slug", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Tenant domain (optional)',
        example: 'acme.com',
        maxLength: 255
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTenantDto.prototype, "domain", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Feature plan ID',
        example: 'uuid-of-plan'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateTenantDto.prototype, "planId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Maximum number of users allowed',
        example: 100,
        minimum: 1
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateTenantDto.prototype, "maxUsers", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Maximum number of projects allowed',
        example: 50,
        minimum: 1
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreateTenantDto.prototype, "maxProjects", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Tenant status',
        enum: client_1.TenantStatus,
        example: client_1.TenantStatus.TRIAL
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.TenantStatus),
    __metadata("design:type", String)
], CreateTenantDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether tenant is active',
        example: true
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateTenantDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether tenant is in trial period',
        example: true
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateTenantDto.prototype, "isTrial", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Trial expiration date',
        example: '2024-12-31T23:59:59.000Z'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateTenantDto.prototype, "trialExpiresAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether MFA is required',
        example: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateTenantDto.prototype, "mfaRequired", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Password policy configuration',
        example: { minLength: 8, requireSpecialChar: true }
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateTenantDto.prototype, "passwordPolicy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Session timeout in minutes',
        example: 480,
        minimum: 15,
        maximum: 1440
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(15),
    (0, class_validator_1.Max)(1440),
    __metadata("design:type", Number)
], CreateTenantDto.prototype, "sessionTimeout", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Compliance frameworks',
        example: ['NIST', 'ISO27001', 'SOC2']
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateTenantDto.prototype, "complianceFrameworks", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Data residency region',
        example: 'US',
        maxLength: 10
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTenantDto.prototype, "dataResidency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Daily API quota',
        example: 10000,
        minimum: 1000
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1000),
    __metadata("design:type", Number)
], CreateTenantDto.prototype, "apiQuotaDaily", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Webhook URL for notifications',
        example: 'https://acme.com/webhooks/blicktrack'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], CreateTenantDto.prototype, "webhookUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional tenant settings',
        example: { customField: 'value' }
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateTenantDto.prototype, "settings", void 0);
class UpdateTenantDto {
    name;
    slug;
    domain;
    planId;
    maxUsers;
    maxProjects;
    status;
    isActive;
    isTrial;
    trialExpiresAt;
    mfaRequired;
    passwordPolicy;
    sessionTimeout;
    complianceFrameworks;
    dataResidency;
    apiQuotaDaily;
    webhookUrl;
    settings;
}
exports.UpdateTenantDto = UpdateTenantDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Tenant name',
        example: 'Acme Corporation Updated',
        minLength: 2,
        maxLength: 100
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTenantDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Tenant slug (URL-friendly identifier)',
        example: 'acme-corp-updated',
        minLength: 2,
        maxLength: 50
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTenantDto.prototype, "slug", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Tenant domain',
        example: 'acme-updated.com',
        maxLength: 255
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTenantDto.prototype, "domain", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Feature plan ID',
        example: 'uuid-of-plan'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdateTenantDto.prototype, "planId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Maximum number of users allowed',
        example: 200,
        minimum: 1
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], UpdateTenantDto.prototype, "maxUsers", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Maximum number of projects allowed',
        example: 100,
        minimum: 1
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], UpdateTenantDto.prototype, "maxProjects", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Tenant status',
        enum: client_1.TenantStatus,
        example: client_1.TenantStatus.ACTIVE
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.TenantStatus),
    __metadata("design:type", String)
], UpdateTenantDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether tenant is active',
        example: true
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateTenantDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether tenant is in trial period',
        example: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateTenantDto.prototype, "isTrial", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Trial expiration date',
        example: '2024-12-31T23:59:59.000Z'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateTenantDto.prototype, "trialExpiresAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether MFA is required',
        example: true
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateTenantDto.prototype, "mfaRequired", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Password policy configuration',
        example: { minLength: 12, requireSpecialChar: true, requireNumbers: true }
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdateTenantDto.prototype, "passwordPolicy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Session timeout in minutes',
        example: 720,
        minimum: 15,
        maximum: 1440
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(15),
    (0, class_validator_1.Max)(1440),
    __metadata("design:type", Number)
], UpdateTenantDto.prototype, "sessionTimeout", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Compliance frameworks',
        example: ['NIST', 'ISO27001', 'SOC2', 'PCI-DSS']
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateTenantDto.prototype, "complianceFrameworks", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Data residency region',
        example: 'EU',
        maxLength: 10
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTenantDto.prototype, "dataResidency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Daily API quota',
        example: 50000,
        minimum: 1000
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1000),
    __metadata("design:type", Number)
], UpdateTenantDto.prototype, "apiQuotaDaily", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Webhook URL for notifications',
        example: 'https://acme.com/webhooks/blicktrack-updated'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], UpdateTenantDto.prototype, "webhookUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional tenant settings',
        example: { customField: 'updatedValue', newField: 'value' }
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdateTenantDto.prototype, "settings", void 0);
class TenantResponseDto {
    id;
    name;
    slug;
    domain;
    planId;
    plan;
    maxUsers;
    maxProjects;
    status;
    isActive;
    isTrial;
    trialExpiresAt;
    mfaRequired;
    passwordPolicy;
    sessionTimeout;
    complianceFrameworks;
    dataResidency;
    apiQuotaDaily;
    webhookUrl;
    settings;
    createdAt;
    updatedAt;
    deletedAt;
}
exports.TenantResponseDto = TenantResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tenant ID',
        example: 'uuid-tenant-id'
    }),
    __metadata("design:type", String)
], TenantResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tenant name',
        example: 'Acme Corporation'
    }),
    __metadata("design:type", String)
], TenantResponseDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tenant slug',
        example: 'acme-corp'
    }),
    __metadata("design:type", String)
], TenantResponseDto.prototype, "slug", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Tenant domain',
        example: 'acme.com'
    }),
    __metadata("design:type", String)
], TenantResponseDto.prototype, "domain", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Feature plan ID',
        example: 'uuid-of-plan'
    }),
    __metadata("design:type", String)
], TenantResponseDto.prototype, "planId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Feature plan details',
        type: 'object',
        additionalProperties: true
    }),
    __metadata("design:type", Object)
], TenantResponseDto.prototype, "plan", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Maximum number of users allowed',
        example: 100
    }),
    __metadata("design:type", Number)
], TenantResponseDto.prototype, "maxUsers", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Maximum number of projects allowed',
        example: 50
    }),
    __metadata("design:type", Number)
], TenantResponseDto.prototype, "maxProjects", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tenant status',
        enum: client_1.TenantStatus,
        example: client_1.TenantStatus.ACTIVE
    }),
    __metadata("design:type", String)
], TenantResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether tenant is active',
        example: true
    }),
    __metadata("design:type", Boolean)
], TenantResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether tenant is in trial period',
        example: false
    }),
    __metadata("design:type", Boolean)
], TenantResponseDto.prototype, "isTrial", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Trial expiration date',
        example: '2024-12-31T23:59:59.000Z'
    }),
    __metadata("design:type", Date)
], TenantResponseDto.prototype, "trialExpiresAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Whether MFA is required',
        example: false
    }),
    __metadata("design:type", Boolean)
], TenantResponseDto.prototype, "mfaRequired", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Password policy configuration',
        example: { minLength: 8, requireSpecialChar: true }
    }),
    __metadata("design:type", Object)
], TenantResponseDto.prototype, "passwordPolicy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Session timeout in minutes',
        example: 480
    }),
    __metadata("design:type", Number)
], TenantResponseDto.prototype, "sessionTimeout", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Compliance frameworks',
        example: ['NIST', 'ISO27001']
    }),
    __metadata("design:type", Array)
], TenantResponseDto.prototype, "complianceFrameworks", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Data residency region',
        example: 'US'
    }),
    __metadata("design:type", String)
], TenantResponseDto.prototype, "dataResidency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Daily API quota',
        example: 10000
    }),
    __metadata("design:type", Number)
], TenantResponseDto.prototype, "apiQuotaDaily", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Webhook URL for notifications',
        example: 'https://acme.com/webhooks/blicktrack'
    }),
    __metadata("design:type", String)
], TenantResponseDto.prototype, "webhookUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Additional tenant settings',
        example: { customField: 'value' }
    }),
    __metadata("design:type", Object)
], TenantResponseDto.prototype, "settings", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Creation timestamp',
        example: '2024-01-01T00:00:00.000Z'
    }),
    __metadata("design:type", Date)
], TenantResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Last update timestamp',
        example: '2024-01-01T00:00:00.000Z'
    }),
    __metadata("design:type", Date)
], TenantResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Deletion timestamp (soft delete)',
        example: '2024-01-01T00:00:00.000Z'
    }),
    __metadata("design:type", Date)
], TenantResponseDto.prototype, "deletedAt", void 0);
class TenantListDto {
    tenants;
    total;
    page;
    limit;
    totalPages;
}
exports.TenantListDto = TenantListDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of tenants',
        type: [TenantResponseDto]
    }),
    __metadata("design:type", Array)
], TenantListDto.prototype, "tenants", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of tenants',
        example: 25
    }),
    __metadata("design:type", Number)
], TenantListDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Current page number',
        example: 1
    }),
    __metadata("design:type", Number)
], TenantListDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of items per page',
        example: 10
    }),
    __metadata("design:type", Number)
], TenantListDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of pages',
        example: 3
    }),
    __metadata("design:type", Number)
], TenantListDto.prototype, "totalPages", void 0);
class TenantStatsDto {
    totalUsers;
    totalProjects;
    totalThreatModels;
    totalSecurityProjects;
    activeUsers;
    storageUsed;
    apiCallsToday;
    complianceFrameworks;
}
exports.TenantStatsDto = TenantStatsDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of users',
        example: 150
    }),
    __metadata("design:type", Number)
], TenantStatsDto.prototype, "totalUsers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of projects',
        example: 75
    }),
    __metadata("design:type", Number)
], TenantStatsDto.prototype, "totalProjects", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of threat models',
        example: 200
    }),
    __metadata("design:type", Number)
], TenantStatsDto.prototype, "totalThreatModels", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Total number of security projects',
        example: 50
    }),
    __metadata("design:type", Number)
], TenantStatsDto.prototype, "totalSecurityProjects", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Active users in last 30 days',
        example: 120
    }),
    __metadata("design:type", Number)
], TenantStatsDto.prototype, "activeUsers", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Storage used in MB',
        example: 1024
    }),
    __metadata("design:type", Number)
], TenantStatsDto.prototype, "storageUsed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'API calls made today',
        example: 5000
    }),
    __metadata("design:type", Number)
], TenantStatsDto.prototype, "apiCallsToday", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Compliance frameworks in use',
        example: ['NIST', 'ISO27001', 'SOC2']
    }),
    __metadata("design:type", Array)
], TenantStatsDto.prototype, "complianceFrameworks", void 0);
class TenantQueryDto {
    page = 1;
    limit = 10;
    search;
    status;
    isActive;
    isTrial;
    sortBy = 'createdAt';
    sortOrder = 'desc';
}
exports.TenantQueryDto = TenantQueryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Page number',
        example: 1,
        minimum: 1
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], TenantQueryDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Number of items per page',
        example: 10,
        minimum: 1,
        maximum: 100
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], TenantQueryDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Search term for tenant name or slug',
        example: 'acme'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TenantQueryDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by tenant status',
        enum: client_1.TenantStatus,
        example: client_1.TenantStatus.ACTIVE
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.TenantStatus),
    __metadata("design:type", String)
], TenantQueryDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by active status',
        example: true
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], TenantQueryDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Filter by trial status',
        example: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], TenantQueryDto.prototype, "isTrial", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sort field',
        example: 'createdAt',
        enum: ['name', 'slug', 'status', 'createdAt', 'updatedAt']
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TenantQueryDto.prototype, "sortBy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sort order',
        example: 'desc',
        enum: ['asc', 'desc']
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TenantQueryDto.prototype, "sortOrder", void 0);
//# sourceMappingURL=tenant.dto.js.map