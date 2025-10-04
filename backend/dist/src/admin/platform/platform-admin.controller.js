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
exports.PlatformAdminController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const client_1 = require("@prisma/client");
const platform_admin_service_1 = require("./platform-admin.service");
let PlatformAdminController = class PlatformAdminController {
    platformAdminService;
    constructor(platformAdminService) {
        this.platformAdminService = platformAdminService;
    }
    async getAllTenants(page = 1, limit = 10) {
        return this.platformAdminService.getAllTenants(page, limit);
    }
    async createTenant(createTenantDto) {
        return this.platformAdminService.createTenant(createTenantDto);
    }
    async suspendTenant(tenantId) {
        return this.platformAdminService.suspendTenant(tenantId);
    }
    async activateTenant(tenantId) {
        return this.platformAdminService.activateTenant(tenantId);
    }
    async getSystemHealth() {
        return this.platformAdminService.getSystemHealth();
    }
    async getSystemMetrics() {
        return this.platformAdminService.getSystemMetrics();
    }
    async getAllUsers(page = 1, limit = 10) {
        return this.platformAdminService.getAllUsers(page, limit);
    }
    async changeUserRole(userId, roleDto) {
        return this.platformAdminService.changeUserRole(userId, roleDto);
    }
};
exports.PlatformAdminController = PlatformAdminController;
__decorate([
    (0, common_1.Get)('tenants'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all tenants in the system' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of all tenants' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], PlatformAdminController.prototype, "getAllTenants", null);
__decorate([
    (0, common_1.Post)('tenants'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new tenant' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Tenant created successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PlatformAdminController.prototype, "createTenant", null);
__decorate([
    (0, common_1.Put)('tenants/:tenantId/suspend'),
    (0, swagger_1.ApiOperation)({ summary: 'Suspend a tenant' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tenant suspended successfully' }),
    __param(0, (0, common_1.Param)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PlatformAdminController.prototype, "suspendTenant", null);
__decorate([
    (0, common_1.Put)('tenants/:tenantId/activate'),
    (0, swagger_1.ApiOperation)({ summary: 'Activate a tenant' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tenant activated successfully' }),
    __param(0, (0, common_1.Param)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PlatformAdminController.prototype, "activateTenant", null);
__decorate([
    (0, common_1.Get)('system/health'),
    (0, swagger_1.ApiOperation)({ summary: 'Get detailed system health status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'System health information' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PlatformAdminController.prototype, "getSystemHealth", null);
__decorate([
    (0, common_1.Get)('system/metrics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get system metrics and usage statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'System metrics' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PlatformAdminController.prototype, "getSystemMetrics", null);
__decorate([
    (0, common_1.Get)('users'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all users across all tenants' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of all users' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], PlatformAdminController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Put)('users/:userId/role'),
    (0, swagger_1.ApiOperation)({ summary: 'Change user role (cross-tenant)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User role updated successfully' }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PlatformAdminController.prototype, "changeUserRole", null);
exports.PlatformAdminController = PlatformAdminController = __decorate([
    (0, swagger_1.ApiTags)('Platform Administration'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.PLATFORM_ADMIN),
    (0, common_1.Controller)('api/v1/platform-admin'),
    __metadata("design:paramtypes", [platform_admin_service_1.PlatformAdminService])
], PlatformAdminController);
//# sourceMappingURL=platform-admin.controller.js.map