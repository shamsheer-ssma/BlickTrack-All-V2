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
exports.TenantsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const tenants_service_1 = require("./tenants.service");
const tenant_features_dto_1 = require("./dto/tenant-features.dto");
const tenant_dto_1 = require("./dto/tenant.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let TenantsController = class TenantsController {
    tenantsService;
    constructor(tenantsService) {
        this.tenantsService = tenantsService;
    }
    async createTenant(createTenantDto) {
        return this.tenantsService.createTenant(createTenantDto);
    }
    async getTenants(query) {
        return this.tenantsService.getTenants(query);
    }
    async getTenant(id) {
        return this.tenantsService.getTenantById(id);
    }
    async updateTenant(id, updateTenantDto) {
        return this.tenantsService.updateTenant(id, updateTenantDto);
    }
    async deleteTenant(id) {
        return this.tenantsService.deleteTenant(id);
    }
    async getTenantStats(id) {
        return this.tenantsService.getTenantStats(id);
    }
    async getTenantFeatures(id) {
        return this.tenantsService.getTenantFeatures(id);
    }
    async getTenantFeaturesBySlug(slug) {
        const tenant = await this.tenantsService.getTenantBySlug(slug);
        return this.tenantsService.getTenantFeatures(tenant.id);
    }
    async updateTenantFeatures(id, updateDto) {
        return this.tenantsService.updateTenantFeatures(id, updateDto);
    }
};
exports.TenantsController = TenantsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.PLATFORM_ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a new tenant',
        description: 'Create a new tenant with configuration and feature settings. Requires platform admin privileges.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Tenant created successfully',
        type: tenant_dto_1.TenantResponseDto
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Insufficient permissions' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Tenant with slug already exists' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [tenant_dto_1.CreateTenantDto]),
    __metadata("design:returntype", Promise)
], TenantsController.prototype, "createTenant", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.PLATFORM_ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all tenants',
        description: 'Retrieve a paginated list of all tenants with filtering options. Requires platform admin privileges.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Tenants retrieved successfully',
        type: tenant_dto_1.TenantListDto
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Insufficient permissions' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [tenant_dto_1.TenantQueryDto]),
    __metadata("design:returntype", Promise)
], TenantsController.prototype, "getTenants", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.PLATFORM_ADMIN, client_1.UserRole.TENANT_ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Get tenant by ID',
        description: 'Retrieve detailed information about a specific tenant.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Tenant retrieved successfully',
        type: tenant_dto_1.TenantResponseDto
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Insufficient permissions' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Tenant not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TenantsController.prototype, "getTenant", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.PLATFORM_ADMIN, client_1.UserRole.TENANT_ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Update tenant',
        description: 'Update tenant information and configuration. Requires appropriate admin privileges.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Tenant updated successfully',
        type: tenant_dto_1.TenantResponseDto
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Insufficient permissions' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Tenant not found' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Tenant with slug already exists' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, tenant_dto_1.UpdateTenantDto]),
    __metadata("design:returntype", Promise)
], TenantsController.prototype, "updateTenant", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.PLATFORM_ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete tenant',
        description: 'Soft delete a tenant and all associated data. Requires platform admin privileges.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Tenant deleted successfully',
        schema: { type: 'object', properties: { message: { type: 'string' } } }
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Insufficient permissions' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Tenant not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TenantsController.prototype, "deleteTenant", null);
__decorate([
    (0, common_1.Get)(':id/stats'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.PLATFORM_ADMIN, client_1.UserRole.TENANT_ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Get tenant statistics',
        description: 'Retrieve usage statistics and metrics for a specific tenant.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Tenant statistics retrieved successfully',
        type: tenant_dto_1.TenantStatsDto
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Insufficient permissions' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Tenant not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TenantsController.prototype, "getTenantStats", null);
__decorate([
    (0, common_1.Get)(':id/features'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.PLATFORM_ADMIN, client_1.UserRole.TENANT_ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Get tenant feature flags',
        description: 'Retrieve feature flags and configuration for a specific tenant.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Feature flags retrieved successfully',
        type: tenant_features_dto_1.TenantFeaturesDto
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Insufficient permissions' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Tenant not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TenantsController.prototype, "getTenantFeatures", null);
__decorate([
    (0, common_1.Get)('slug/:slug/features'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.PLATFORM_ADMIN, client_1.UserRole.TENANT_ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Get tenant feature flags by slug',
        description: 'Retrieve feature flags and configuration for a tenant using its slug identifier.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Feature flags retrieved successfully',
        type: tenant_features_dto_1.TenantFeaturesDto
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Insufficient permissions' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Tenant not found' }),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TenantsController.prototype, "getTenantFeaturesBySlug", null);
__decorate([
    (0, common_1.Patch)(':id/features'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.PLATFORM_ADMIN, client_1.UserRole.TENANT_ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Update tenant feature flags',
        description: 'Update feature flags and configuration for a specific tenant.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Feature flags updated successfully',
        type: tenant_features_dto_1.TenantFeaturesDto
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Insufficient permissions' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Tenant not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, tenant_features_dto_1.UpdateTenantFeaturesDto]),
    __metadata("design:returntype", Promise)
], TenantsController.prototype, "updateTenantFeatures", null);
exports.TenantsController = TenantsController = __decorate([
    (0, swagger_1.ApiTags)('Tenant Management'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('api/v1/tenants'),
    __metadata("design:paramtypes", [tenants_service_1.TenantsService])
], TenantsController);
//# sourceMappingURL=tenants.controller.js.map