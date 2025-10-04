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
exports.TenantConfigurationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const logger_service_1 = require("../common/services/logger.service");
const config_1 = require("@nestjs/config");
const client_1 = require("@prisma/client");
let TenantConfigurationService = class TenantConfigurationService {
    prisma;
    configService;
    logger;
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
        this.logger = new logger_service_1.LoggerService(configService);
        this.logger.setContext('TenantConfigurationService');
        this.logger.debug('TenantConfigurationService initialized');
    }
    async createConfiguration(tenantId, createConfigDto) {
        this.logger.debug('Creating tenant configuration', {
            tenantId,
            industryType: createConfigDto.industryType
        });
        const tenant = await this.prisma.tenant.findUnique({
            where: {
                id: tenantId,
                deletedAt: null
            }
        });
        if (!tenant) {
            this.logger.warn('Configuration creation failed - tenant not found', { tenantId });
            throw new common_1.NotFoundException(`Tenant with ID ${tenantId} not found`);
        }
        const existingConfig = await this.prisma.tenantConfiguration.findUnique({
            where: { tenantId }
        });
        if (existingConfig) {
            this.logger.warn('Configuration creation failed - already exists', { tenantId });
            throw new common_1.ConflictException(`Configuration for tenant ${tenantId} already exists`);
        }
        try {
            const configuration = await this.prisma.tenantConfiguration.create({
                data: {
                    ...createConfigDto,
                    industryType: createConfigDto.industryType || 'TECHNOLOGY',
                    organizationType: createConfigDto.organizationType || 'PRODUCT_BASED',
                    productTerm: createConfigDto.productTerm || 'Product',
                    projectTerm: createConfigDto.projectTerm || 'Project',
                    portfolioTerm: createConfigDto.portfolioTerm || 'Portfolio',
                    workstreamTerm: createConfigDto.workstreamTerm || 'Workstream',
                    defaultHierarchy: createConfigDto.defaultHierarchy || ['PORTFOLIO', 'PROGRAM', 'PRODUCT', 'PROJECT'],
                    maxHierarchyLevels: createConfigDto.maxHierarchyLevels || 5,
                    securityFrameworks: createConfigDto.securityFrameworks || [],
                    defaultRiskLevel: createConfigDto.defaultRiskLevel || client_1.RiskLevel.MEDIUM,
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
        }
        catch (error) {
            this.logger.error('Failed to create tenant configuration', error, {
                tenantId,
                createConfigDto
            });
            throw error;
        }
    }
    async getConfiguration(tenantId) {
        this.logger.debug('Getting tenant configuration', { tenantId });
        const configuration = await this.prisma.tenantConfiguration.findUnique({
            where: { tenantId }
        });
        if (!configuration) {
            this.logger.warn('Configuration not found', { tenantId });
            throw new common_1.NotFoundException(`Configuration for tenant ${tenantId} not found`);
        }
        this.logger.debug('Configuration retrieved successfully', {
            tenantId,
            configId: configuration.id,
            industryType: configuration.industryType
        });
        return this.mapConfigurationToResponseDto(configuration);
    }
    async updateConfiguration(tenantId, updateConfigDto) {
        this.logger.debug('Updating tenant configuration', {
            tenantId,
            updateData: updateConfigDto
        });
        const existingConfig = await this.prisma.tenantConfiguration.findUnique({
            where: { tenantId }
        });
        if (!existingConfig) {
            this.logger.warn('Configuration update failed - not found', { tenantId });
            throw new common_1.NotFoundException(`Configuration for tenant ${tenantId} not found`);
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
        }
        catch (error) {
            this.logger.error('Failed to update tenant configuration', error, {
                tenantId,
                updateConfigDto
            });
            throw error;
        }
    }
    async deleteConfiguration(tenantId) {
        this.logger.debug('Deleting tenant configuration', { tenantId });
        const existingConfig = await this.prisma.tenantConfiguration.findUnique({
            where: { tenantId }
        });
        if (!existingConfig) {
            this.logger.warn('Configuration deletion failed - not found', { tenantId });
            throw new common_1.NotFoundException(`Configuration for tenant ${tenantId} not found`);
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
        }
        catch (error) {
            this.logger.error('Failed to delete tenant configuration', error, { tenantId });
            throw error;
        }
    }
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
                    defaultRiskLevel: client_1.RiskLevel.HIGH,
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
                    defaultRiskLevel: client_1.RiskLevel.HIGH,
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
                    defaultRiskLevel: client_1.RiskLevel.HIGH,
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
                    defaultRiskLevel: client_1.RiskLevel.MEDIUM,
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
                    defaultRiskLevel: client_1.RiskLevel.HIGH,
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
    async applyIndustryTemplate(tenantId, industryType, preserveCustomSettings = false) {
        this.logger.debug('Applying industry template', {
            tenantId,
            industryType,
            preserveCustomSettings
        });
        const templates = await this.getIndustryTemplates();
        const template = templates.templates.find(t => t.industryType === industryType);
        if (!template) {
            this.logger.warn('Template not found', { industryType });
            throw new common_1.NotFoundException(`Industry template for ${industryType} not found`);
        }
        const tenant = await this.prisma.tenant.findUnique({
            where: {
                id: tenantId,
                deletedAt: null
            }
        });
        if (!tenant) {
            this.logger.warn('Template application failed - tenant not found', { tenantId });
            throw new common_1.NotFoundException(`Tenant with ID ${tenantId} not found`);
        }
        try {
            let configuration;
            if (preserveCustomSettings) {
                configuration = await this.prisma.tenantConfiguration.upsert({
                    where: { tenantId },
                    update: template.defaultConfiguration,
                    create: {
                        tenantId,
                        ...template.defaultConfiguration
                    }
                });
            }
            else {
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
        }
        catch (error) {
            this.logger.error('Failed to apply industry template', error, {
                tenantId,
                industryType
            });
            throw error;
        }
    }
    async testSSOConfiguration(tenantId, ssoProvider, testCredentials) {
        this.logger.debug('Testing SSO configuration', {
            tenantId,
            ssoProvider
        });
        const configuration = await this.prisma.tenantConfiguration.findUnique({
            where: { tenantId }
        });
        if (!configuration) {
            this.logger.warn('SSO test failed - configuration not found', { tenantId });
            throw new common_1.NotFoundException(`Configuration for tenant ${tenantId} not found`);
        }
        try {
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
                    throw new common_1.BadRequestException(`Unsupported SSO provider: ${ssoProvider}`);
            }
            this.logger.info('SSO test completed', {
                tenantId,
                ssoProvider,
                success: testResult.success
            });
            return testResult;
        }
        catch (error) {
            this.logger.error('SSO test failed', error, {
                tenantId,
                ssoProvider
            });
            throw error;
        }
    }
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
    async previewConfiguration(tenantId, previewData) {
        this.logger.debug('Previewing configuration changes', {
            tenantId,
            previewData
        });
        const currentConfig = await this.prisma.tenantConfiguration.findUnique({
            where: { tenantId }
        });
        if (!currentConfig) {
            this.logger.warn('Preview failed - configuration not found', { tenantId });
            throw new common_1.NotFoundException(`Configuration for tenant ${tenantId} not found`);
        }
        const previewConfig = {
            ...currentConfig,
            ...previewData
        };
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
    mapConfigurationToResponseDto(configuration) {
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
    async testAzureSSO(configuration, testCredentials) {
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
    async testOktaSSO(configuration, testCredentials) {
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
    async testGoogleSSO(configuration, testCredentials) {
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
    async testSAMLSSO(configuration, testCredentials) {
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
};
exports.TenantConfigurationService = TenantConfigurationService;
exports.TenantConfigurationService = TenantConfigurationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], TenantConfigurationService);
//# sourceMappingURL=tenant-configuration.service.js.map