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
exports.TenantAdminController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const client_1 = require("@prisma/client");
const tenant_admin_service_1 = require("./tenant-admin.service");
let TenantAdminController = class TenantAdminController {
    tenantAdminService;
    constructor(tenantAdminService) {
        this.tenantAdminService = tenantAdminService;
    }
    async getTenantUsers(user, page = 1, limit = 10) {
        return this.tenantAdminService.getTenantUsers(user.tenantId, page, limit);
    }
    async createTenantUser(user, createUserDto) {
        return this.tenantAdminService.createTenantUser(user.tenantId, createUserDto);
    }
    async changeUserRole(user, userId, roleDto) {
        return this.tenantAdminService.changeUserRole(user.tenantId, userId, roleDto);
    }
    async changeUserStatus(user, userId, statusDto) {
        return this.tenantAdminService.changeUserStatus(user.tenantId, userId, statusDto);
    }
    async getTenantSettings(user) {
        return this.tenantAdminService.getTenantSettings(user.tenantId);
    }
    async updateTenantSettings(user, settingsDto) {
        return this.tenantAdminService.updateTenantSettings(user.tenantId, settingsDto);
    }
    async getDashboardStats(user) {
        return this.tenantAdminService.getDashboardStats(user.tenantId);
    }
    async getUserAnalytics(user) {
        return this.tenantAdminService.getUserAnalytics(user.tenantId);
    }
    async getDepartments(user) {
        return this.tenantAdminService.getDepartments(user.tenantId);
    }
    async createDepartment(user, deptDto) {
        return this.tenantAdminService.createDepartment(user.tenantId, deptDto);
    }
};
exports.TenantAdminController = TenantAdminController;
__decorate([
    (0, common_1.Get)('users'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all users in current tenant' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of tenant users' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], TenantAdminController.prototype, "getTenantUsers", null);
__decorate([
    (0, common_1.Post)('users'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new user in tenant' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'User created successfully' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TenantAdminController.prototype, "createTenantUser", null);
__decorate([
    (0, common_1.Put)('users/:userId/role'),
    (0, swagger_1.ApiOperation)({ summary: 'Change user role within tenant' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User role updated successfully' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('userId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], TenantAdminController.prototype, "changeUserRole", null);
__decorate([
    (0, common_1.Put)('users/:userId/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Activate/Deactivate user within tenant' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User status updated successfully' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('userId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], TenantAdminController.prototype, "changeUserStatus", null);
__decorate([
    (0, common_1.Get)('settings'),
    (0, swagger_1.ApiOperation)({ summary: 'Get tenant configuration settings' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tenant settings' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TenantAdminController.prototype, "getTenantSettings", null);
__decorate([
    (0, common_1.Put)('settings'),
    (0, swagger_1.ApiOperation)({ summary: 'Update tenant configuration settings' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Settings updated successfully' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TenantAdminController.prototype, "updateTenantSettings", null);
__decorate([
    (0, common_1.Get)('dashboard/stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get tenant dashboard statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Dashboard statistics' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TenantAdminController.prototype, "getDashboardStats", null);
__decorate([
    (0, common_1.Get)('analytics/users'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user analytics for tenant' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User analytics data' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TenantAdminController.prototype, "getUserAnalytics", null);
__decorate([
    (0, common_1.Get)('departments'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all departments in tenant' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of departments' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TenantAdminController.prototype, "getDepartments", null);
__decorate([
    (0, common_1.Post)('departments'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new department' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Department created successfully' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TenantAdminController.prototype, "createDepartment", null);
exports.TenantAdminController = TenantAdminController = __decorate([
    (0, swagger_1.ApiTags)('Tenant Administration'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.TENANT_ADMIN, client_1.UserRole.PLATFORM_ADMIN),
    (0, common_1.Controller)('api/v1/tenant-admin'),
    __metadata("design:paramtypes", [tenant_admin_service_1.TenantAdminService])
], TenantAdminController);
//# sourceMappingURL=tenant-admin.controller.js.map