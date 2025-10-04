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
exports.TenantConfigurationResponseDto = exports.UpdateTenantConfigurationDto = exports.CreateTenantConfigurationDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CreateTenantConfigurationDto {
    tenantId;
    industryType;
    organizationType;
    productTerm;
    projectTerm;
    portfolioTerm;
    workstreamTerm;
    defaultHierarchy;
    maxHierarchyLevels;
    securityFrameworks;
    defaultRiskLevel;
    theme;
    primaryColor;
    logoUrl;
    customCssUrl;
    requiresApproval;
    auditRetentionDays;
    encryptionRequired;
    ssoEnabled;
    adIntegrationEnabled;
    apiAccessEnabled;
    enableRegistration;
    enable2FA;
    enableLandingPage;
    enableDarkMode;
    ssoProvider;
    ssoClientId;
    ssoTenantId;
    ssoIssuerUrl;
    ssoMetadataUrl;
    settings;
}
exports.CreateTenantConfigurationDto = CreateTenantConfigurationDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tenant ID',
        example: 'uuid-tenant-id'
    }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateTenantConfigurationDto.prototype, "tenantId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Industry type',
        example: 'HEALTHCARE',
        enum: ['AEROSPACE', 'FINANCIAL', 'HEALTHCARE', 'TECHNOLOGY', 'GOVERNMENT', 'MANUFACTURING', 'RETAIL', 'EDUCATION']
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTenantConfigurationDto.prototype, "industryType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Organization type',
        example: 'PRODUCT_BASED',
        enum: ['PRODUCT_BASED', 'PROJECT_BASED', 'SERVICE_BASED']
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTenantConfigurationDto.prototype, "organizationType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product terminology',
        example: 'Solution',
        maxLength: 50
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTenantConfigurationDto.prototype, "productTerm", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Project terminology',
        example: 'Engagement',
        maxLength: 50
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTenantConfigurationDto.prototype, "projectTerm", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Portfolio terminology',
        example: 'Division',
        maxLength: 50
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTenantConfigurationDto.prototype, "portfolioTerm", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Workstream terminology',
        example: 'Activity',
        maxLength: 50
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTenantConfigurationDto.prototype, "workstreamTerm", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Default hierarchy structure',
        example: ['PORTFOLIO', 'PROGRAM', 'PRODUCT', 'PROJECT'],
        type: [String]
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateTenantConfigurationDto.prototype, "defaultHierarchy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Maximum hierarchy levels',
        example: 5,
        minimum: 1,
        maximum: 10
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(10),
    __metadata("design:type", Number)
], CreateTenantConfigurationDto.prototype, "maxHierarchyLevels", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Security frameworks',
        example: ['NIST', 'ISO27001', 'SOX'],
        type: [String]
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateTenantConfigurationDto.prototype, "securityFrameworks", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Default risk level',
        enum: client_1.RiskLevel,
        example: client_1.RiskLevel.MEDIUM
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.RiskLevel),
    __metadata("design:type", String)
], CreateTenantConfigurationDto.prototype, "defaultRiskLevel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'UI theme',
        example: 'aerospace',
        enum: ['corporate', 'aerospace', 'financial', 'healthcare', 'government']
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTenantConfigurationDto.prototype, "theme", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Primary color',
        example: '#1e40af',
        pattern: '^#[0-9A-Fa-f]{6}$'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTenantConfigurationDto.prototype, "primaryColor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Logo URL',
        example: 'https://example.com/logo.png'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], CreateTenantConfigurationDto.prototype, "logoUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Custom CSS URL',
        example: 'https://example.com/custom.css'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], CreateTenantConfigurationDto.prototype, "customCssUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Requires approval for changes',
        example: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateTenantConfigurationDto.prototype, "requiresApproval", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Audit retention days',
        example: 2555,
        minimum: 30,
        maximum: 3650
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(30),
    (0, class_validator_1.Max)(3650),
    __metadata("design:type", Number)
], CreateTenantConfigurationDto.prototype, "auditRetentionDays", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Encryption required',
        example: true
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateTenantConfigurationDto.prototype, "encryptionRequired", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'SSO enabled',
        example: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateTenantConfigurationDto.prototype, "ssoEnabled", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Active Directory integration enabled',
        example: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateTenantConfigurationDto.prototype, "adIntegrationEnabled", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'API access enabled',
        example: true
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateTenantConfigurationDto.prototype, "apiAccessEnabled", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Enable user registration',
        example: true
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateTenantConfigurationDto.prototype, "enableRegistration", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Enable two-factor authentication',
        example: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateTenantConfigurationDto.prototype, "enable2FA", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Enable landing page',
        example: true
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateTenantConfigurationDto.prototype, "enableLandingPage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Enable dark mode',
        example: true
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateTenantConfigurationDto.prototype, "enableDarkMode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'SSO provider',
        example: 'azure',
        enum: ['azure', 'okta', 'google', 'saml']
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTenantConfigurationDto.prototype, "ssoProvider", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'SSO client ID',
        example: 'client-id-123'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTenantConfigurationDto.prototype, "ssoClientId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'SSO tenant ID (for Azure AD)',
        example: 'tenant-id-123'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTenantConfigurationDto.prototype, "ssoTenantId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'SSO issuer URL (for SAML)',
        example: 'https://example.com/saml/metadata'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], CreateTenantConfigurationDto.prototype, "ssoIssuerUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'SSO metadata URL (for SAML)',
        example: 'https://example.com/saml/metadata.xml'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], CreateTenantConfigurationDto.prototype, "ssoMetadataUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional configuration settings',
        example: { customField: 'value' }
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateTenantConfigurationDto.prototype, "settings", void 0);
class UpdateTenantConfigurationDto {
    industryType;
    organizationType;
    productTerm;
    projectTerm;
    portfolioTerm;
    workstreamTerm;
    defaultHierarchy;
    maxHierarchyLevels;
    securityFrameworks;
    defaultRiskLevel;
    theme;
    primaryColor;
    logoUrl;
    customCssUrl;
    requiresApproval;
    auditRetentionDays;
    encryptionRequired;
    ssoEnabled;
    adIntegrationEnabled;
    apiAccessEnabled;
    enableRegistration;
    enable2FA;
    enableLandingPage;
    enableDarkMode;
    ssoProvider;
    ssoClientId;
    ssoTenantId;
    ssoIssuerUrl;
    ssoMetadataUrl;
    settings;
}
exports.UpdateTenantConfigurationDto = UpdateTenantConfigurationDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Industry type',
        example: 'FINANCIAL',
        enum: ['AEROSPACE', 'FINANCIAL', 'HEALTHCARE', 'TECHNOLOGY', 'GOVERNMENT', 'MANUFACTURING', 'RETAIL', 'EDUCATION']
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTenantConfigurationDto.prototype, "industryType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Organization type',
        example: 'SERVICE_BASED',
        enum: ['PRODUCT_BASED', 'PROJECT_BASED', 'SERVICE_BASED']
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTenantConfigurationDto.prototype, "organizationType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Product terminology',
        example: 'Service',
        maxLength: 50
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTenantConfigurationDto.prototype, "productTerm", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Project terminology',
        example: 'Initiative',
        maxLength: 50
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTenantConfigurationDto.prototype, "projectTerm", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Portfolio terminology',
        example: 'Program',
        maxLength: 50
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTenantConfigurationDto.prototype, "portfolioTerm", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Workstream terminology',
        example: 'Task',
        maxLength: 50
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTenantConfigurationDto.prototype, "workstreamTerm", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Default hierarchy structure',
        example: ['PORTFOLIO', 'PROGRAM', 'SERVICE', 'ENGAGEMENT'],
        type: [String]
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateTenantConfigurationDto.prototype, "defaultHierarchy", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Maximum hierarchy levels',
        example: 6,
        minimum: 1,
        maximum: 10
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(10),
    __metadata("design:type", Number)
], UpdateTenantConfigurationDto.prototype, "maxHierarchyLevels", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Security frameworks',
        example: ['NIST', 'ISO27001', 'PCI-DSS'],
        type: [String]
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateTenantConfigurationDto.prototype, "securityFrameworks", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Default risk level',
        enum: client_1.RiskLevel,
        example: client_1.RiskLevel.HIGH
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.RiskLevel),
    __metadata("design:type", String)
], UpdateTenantConfigurationDto.prototype, "defaultRiskLevel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'UI theme',
        example: 'financial',
        enum: ['corporate', 'aerospace', 'financial', 'healthcare', 'government']
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTenantConfigurationDto.prototype, "theme", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Primary color',
        example: '#dc2626',
        pattern: '^#[0-9A-Fa-f]{6}$'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTenantConfigurationDto.prototype, "primaryColor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Logo URL',
        example: 'https://example.com/new-logo.png'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], UpdateTenantConfigurationDto.prototype, "logoUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Custom CSS URL',
        example: 'https://example.com/new-custom.css'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], UpdateTenantConfigurationDto.prototype, "customCssUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Requires approval for changes',
        example: true
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateTenantConfigurationDto.prototype, "requiresApproval", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Audit retention days',
        example: 3650,
        minimum: 30,
        maximum: 3650
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(30),
    (0, class_validator_1.Max)(3650),
    __metadata("design:type", Number)
], UpdateTenantConfigurationDto.prototype, "auditRetentionDays", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Encryption required',
        example: true
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateTenantConfigurationDto.prototype, "encryptionRequired", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'SSO enabled',
        example: true
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateTenantConfigurationDto.prototype, "ssoEnabled", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Active Directory integration enabled',
        example: true
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateTenantConfigurationDto.prototype, "adIntegrationEnabled", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'API access enabled',
        example: true
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateTenantConfigurationDto.prototype, "apiAccessEnabled", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Enable user registration',
        example: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateTenantConfigurationDto.prototype, "enableRegistration", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Enable two-factor authentication',
        example: true
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateTenantConfigurationDto.prototype, "enable2FA", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Enable landing page',
        example: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateTenantConfigurationDto.prototype, "enableLandingPage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Enable dark mode',
        example: true
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateTenantConfigurationDto.prototype, "enableDarkMode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'SSO provider',
        example: 'okta',
        enum: ['azure', 'okta', 'google', 'saml']
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTenantConfigurationDto.prototype, "ssoProvider", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'SSO client ID',
        example: 'new-client-id-456'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTenantConfigurationDto.prototype, "ssoClientId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'SSO tenant ID (for Azure AD)',
        example: 'new-tenant-id-456'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTenantConfigurationDto.prototype, "ssoTenantId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'SSO issuer URL (for SAML)',
        example: 'https://new-example.com/saml/metadata'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], UpdateTenantConfigurationDto.prototype, "ssoIssuerUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'SSO metadata URL (for SAML)',
        example: 'https://new-example.com/saml/metadata.xml'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], UpdateTenantConfigurationDto.prototype, "ssoMetadataUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional configuration settings',
        example: { customField: 'updatedValue', newField: 'value' }
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], UpdateTenantConfigurationDto.prototype, "settings", void 0);
class TenantConfigurationResponseDto {
    id;
    tenantId;
    industryType;
    organizationType;
    productTerm;
    projectTerm;
    portfolioTerm;
    workstreamTerm;
    defaultHierarchy;
    maxHierarchyLevels;
    securityFrameworks;
    defaultRiskLevel;
    theme;
    primaryColor;
    logoUrl;
    customCssUrl;
    requiresApproval;
    auditRetentionDays;
    encryptionRequired;
    ssoEnabled;
    adIntegrationEnabled;
    apiAccessEnabled;
    enableRegistration;
    enable2FA;
    enableLandingPage;
    enableDarkMode;
    ssoProvider;
    ssoClientId;
    ssoTenantId;
    ssoIssuerUrl;
    ssoMetadataUrl;
    settings;
    createdAt;
    updatedAt;
}
exports.TenantConfigurationResponseDto = TenantConfigurationResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Configuration ID',
        example: 'uuid-config-id'
    }),
    __metadata("design:type", String)
], TenantConfigurationResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tenant ID',
        example: 'uuid-tenant-id'
    }),
    __metadata("design:type", String)
], TenantConfigurationResponseDto.prototype, "tenantId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Industry type',
        example: 'HEALTHCARE'
    }),
    __metadata("design:type", String)
], TenantConfigurationResponseDto.prototype, "industryType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Organization type',
        example: 'PRODUCT_BASED'
    }),
    __metadata("design:type", String)
], TenantConfigurationResponseDto.prototype, "organizationType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Product terminology',
        example: 'Product'
    }),
    __metadata("design:type", String)
], TenantConfigurationResponseDto.prototype, "productTerm", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Project terminology',
        example: 'Project'
    }),
    __metadata("design:type", String)
], TenantConfigurationResponseDto.prototype, "projectTerm", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Portfolio terminology',
        example: 'Portfolio'
    }),
    __metadata("design:type", String)
], TenantConfigurationResponseDto.prototype, "portfolioTerm", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Workstream terminology',
        example: 'Workstream'
    }),
    __metadata("design:type", String)
], TenantConfigurationResponseDto.prototype, "workstreamTerm", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Default hierarchy structure',
        example: ['PORTFOLIO', 'PROGRAM', 'PRODUCT', 'PROJECT']
    }),
    __metadata("design:type", Array)
], TenantConfigurationResponseDto.prototype, "defaultHierarchy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Maximum hierarchy levels',
        example: 5
    }),
    __metadata("design:type", Number)
], TenantConfigurationResponseDto.prototype, "maxHierarchyLevels", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Security frameworks',
        example: ['NIST', 'ISO27001']
    }),
    __metadata("design:type", Array)
], TenantConfigurationResponseDto.prototype, "securityFrameworks", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Default risk level',
        enum: client_1.RiskLevel,
        example: client_1.RiskLevel.MEDIUM
    }),
    __metadata("design:type", String)
], TenantConfigurationResponseDto.prototype, "defaultRiskLevel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'UI theme',
        example: 'corporate'
    }),
    __metadata("design:type", String)
], TenantConfigurationResponseDto.prototype, "theme", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Primary color',
        example: '#2563eb'
    }),
    __metadata("design:type", String)
], TenantConfigurationResponseDto.prototype, "primaryColor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Logo URL',
        example: 'https://example.com/logo.png'
    }),
    __metadata("design:type", String)
], TenantConfigurationResponseDto.prototype, "logoUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Custom CSS URL',
        example: 'https://example.com/custom.css'
    }),
    __metadata("design:type", String)
], TenantConfigurationResponseDto.prototype, "customCssUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Requires approval for changes',
        example: false
    }),
    __metadata("design:type", Boolean)
], TenantConfigurationResponseDto.prototype, "requiresApproval", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Audit retention days',
        example: 2555
    }),
    __metadata("design:type", Number)
], TenantConfigurationResponseDto.prototype, "auditRetentionDays", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Encryption required',
        example: true
    }),
    __metadata("design:type", Boolean)
], TenantConfigurationResponseDto.prototype, "encryptionRequired", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'SSO enabled',
        example: false
    }),
    __metadata("design:type", Boolean)
], TenantConfigurationResponseDto.prototype, "ssoEnabled", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Active Directory integration enabled',
        example: false
    }),
    __metadata("design:type", Boolean)
], TenantConfigurationResponseDto.prototype, "adIntegrationEnabled", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'API access enabled',
        example: true
    }),
    __metadata("design:type", Boolean)
], TenantConfigurationResponseDto.prototype, "apiAccessEnabled", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Enable user registration',
        example: true
    }),
    __metadata("design:type", Boolean)
], TenantConfigurationResponseDto.prototype, "enableRegistration", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Enable two-factor authentication',
        example: false
    }),
    __metadata("design:type", Boolean)
], TenantConfigurationResponseDto.prototype, "enable2FA", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Enable landing page',
        example: true
    }),
    __metadata("design:type", Boolean)
], TenantConfigurationResponseDto.prototype, "enableLandingPage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Enable dark mode',
        example: true
    }),
    __metadata("design:type", Boolean)
], TenantConfigurationResponseDto.prototype, "enableDarkMode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'SSO provider',
        example: 'azure'
    }),
    __metadata("design:type", String)
], TenantConfigurationResponseDto.prototype, "ssoProvider", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'SSO client ID',
        example: 'client-id-123'
    }),
    __metadata("design:type", String)
], TenantConfigurationResponseDto.prototype, "ssoClientId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'SSO tenant ID (for Azure AD)',
        example: 'tenant-id-123'
    }),
    __metadata("design:type", String)
], TenantConfigurationResponseDto.prototype, "ssoTenantId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'SSO issuer URL (for SAML)',
        example: 'https://example.com/saml/metadata'
    }),
    __metadata("design:type", String)
], TenantConfigurationResponseDto.prototype, "ssoIssuerUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'SSO metadata URL (for SAML)',
        example: 'https://example.com/saml/metadata.xml'
    }),
    __metadata("design:type", String)
], TenantConfigurationResponseDto.prototype, "ssoMetadataUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Additional configuration settings',
        example: { customField: 'value' }
    }),
    __metadata("design:type", Object)
], TenantConfigurationResponseDto.prototype, "settings", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Creation timestamp',
        example: '2024-01-01T00:00:00.000Z'
    }),
    __metadata("design:type", Date)
], TenantConfigurationResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Last update timestamp',
        example: '2024-01-01T00:00:00.000Z'
    }),
    __metadata("design:type", Date)
], TenantConfigurationResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=tenant-configuration.dto.js.map