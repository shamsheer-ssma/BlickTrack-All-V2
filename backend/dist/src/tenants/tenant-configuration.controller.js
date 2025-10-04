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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantConfigurationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const tenant_configuration_service_1 = require("./tenant-configuration.service");
const tenant_configuration_dto_1 = require("./dto/tenant-configuration.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let TenantConfigurationController = class TenantConfigurationController {
    tenantConfigurationService;
    constructor(tenantConfigurationService) {
        this.tenantConfigurationService = tenantConfigurationService;
    }
    async createConfiguration(tenantId, createConfigDto) {
        return this.tenantConfigurationService.createConfiguration(tenantId, createConfigDto);
    }
    async getConfiguration(tenantId) {
        return this.tenantConfigurationService.getConfiguration(tenantId);
    }
    async updateConfiguration(tenantId, updateConfigDto) {
        return this.tenantConfigurationService.updateConfiguration(tenantId, updateConfigDto);
    }
    async deleteConfiguration(tenantId) {
        return this.tenantConfigurationService.deleteConfiguration(tenantId);
    }
    async getIndustryTemplates(tenantId) {
        return this.tenantConfigurationService.getIndustryTemplates();
    }
    async applyIndustryTemplate(tenantId, body) {
        return this.tenantConfigurationService.applyIndustryTemplate(tenantId, body.industryType, body.preserveCustomSettings || false);
    }
    async testSSOConfiguration(tenantId, body) {
        return this.tenantConfigurationService.testSSOConfiguration(tenantId, body.ssoProvider, body.testCredentials);
    }
    async getThemeOptions(tenantId) {
        return this.tenantConfigurationService.getThemeOptions();
    }
    async previewConfiguration(tenantId, body) {
        return this.tenantConfigurationService.previewConfiguration(tenantId, body);
    }
};
exports.TenantConfigurationController = TenantConfigurationController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.PLATFORM_ADMIN, client_1.UserRole.TENANT_ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Create tenant configuration',
        description: 'Create industry-specific configuration for a tenant. Requires appropriate admin privileges.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Configuration created successfully',
        type: tenant_configuration_dto_1.TenantConfigurationResponseDto
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Insufficient permissions' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Tenant not found' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Configuration already exists' }),
    __param(0, (0, common_1.Param)('tenantId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, tenant_configuration_dto_1.CreateTenantConfigurationDto]),
    __metadata("design:returntype", Promise)
], TenantConfigurationController.prototype, "createConfiguration", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.PLATFORM_ADMIN, client_1.UserRole.TENANT_ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Get tenant configuration',
        description: 'Retrieve configuration and settings for a specific tenant.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Configuration retrieved successfully',
        type: tenant_configuration_dto_1.TenantConfigurationResponseDto
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Insufficient permissions' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Configuration not found' }),
    __param(0, (0, common_1.Param)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TenantConfigurationController.prototype, "getConfiguration", null);
__decorate([
    (0, common_1.Put)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.PLATFORM_ADMIN, client_1.UserRole.TENANT_ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Update tenant configuration',
        description: 'Update configuration and settings for a specific tenant.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Configuration updated successfully',
        type: tenant_configuration_dto_1.TenantConfigurationResponseDto
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Insufficient permissions' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Configuration not found' }),
    __param(0, (0, common_1.Param)('tenantId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, tenant_configuration_dto_1.UpdateTenantConfigurationDto]),
    __metadata("design:returntype", Promise)
], TenantConfigurationController.prototype, "updateConfiguration", null);
__decorate([
    (0, common_1.Delete)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.PLATFORM_ADMIN, client_1.UserRole.TENANT_ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete tenant configuration',
        description: 'Delete configuration for a specific tenant. This will reset to default settings.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Configuration deleted successfully',
        schema: { type: 'object', properties: { message: { type: 'string' } } }
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Insufficient permissions' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Configuration not found' }),
    __param(0, (0, common_1.Param)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TenantConfigurationController.prototype, "deleteConfiguration", null);
__decorate([
    (0, common_1.Get)('industry-templates'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.PLATFORM_ADMIN, client_1.UserRole.TENANT_ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Get industry templates',
        description: 'Retrieve available industry-specific configuration templates.'
    }),
    (0, swagger_1.ApiResponse)({
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
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Insufficient permissions' }),
    __param(0, (0, common_1.Param)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TenantConfigurationController.prototype, "getIndustryTemplates", null);
__decorate([
    (0, common_1.Post)('apply-template'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.PLATFORM_ADMIN, client_1.UserRole.TENANT_ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Apply industry template',
        description: 'Apply an industry-specific configuration template to a tenant.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Template applied successfully',
        type: tenant_configuration_dto_1.TenantConfigurationResponseDto
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid template or input data' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Insufficient permissions' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Template not found' }),
    __param(0, (0, common_1.Param)('tenantId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TenantConfigurationController.prototype, "applyIndustryTemplate", null);
__decorate([
    (0, common_1.Post)('test-sso'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.PLATFORM_ADMIN, client_1.UserRole.TENANT_ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Test SSO configuration',
        description: 'Test SSO configuration settings for a tenant.'
    }),
    (0, swagger_1.ApiResponse)({
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
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid SSO configuration' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Insufficient permissions' }),
    __param(0, (0, common_1.Param)('tenantId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TenantConfigurationController.prototype, "testSSOConfiguration", null);
__decorate([
    (0, common_1.Get)('theme-options'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.PLATFORM_ADMIN, client_1.UserRole.TENANT_ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Get theme options',
        description: 'Retrieve available UI theme options for tenant customization.'
    }),
    (0, swagger_1.ApiResponse)({
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
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Insufficient permissions' }),
    __param(0, (0, common_1.Param)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TenantConfigurationController.prototype, "getThemeOptions", null);
__decorate([
    (0, common_1.Post)('preview'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.PLATFORM_ADMIN, client_1.UserRole.TENANT_ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Preview configuration changes',
        description: 'Preview how configuration changes will look without applying them.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Preview generated successfully',
        schema: {
            type: 'object',
            properties: {
                preview: { type: 'object' },
                changes: { type: 'array', items: { type: 'string' } }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid preview data' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Insufficient permissions' }),
    __param(0, (0, common_1.Param)('tenantId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, tenant_configuration_dto_1.UpdateTenantConfigurationDto]),
    __metadata("design:returntype", Promise)
], TenantConfigurationController.prototype, "previewConfiguration", null);
exports.TenantConfigurationController = TenantConfigurationController = __decorate([
    (0, swagger_1.ApiTags)('Tenant Configuration'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('api/v1/tenants/:tenantId/configuration'),
    __metadata("design:paramtypes", [tenant_configuration_service_1.TenantConfigurationService])
], TenantConfigurationController);
//# sourceMappingURL=tenant-configuration.controller.js.map