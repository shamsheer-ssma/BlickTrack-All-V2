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
exports.DashboardController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const dashboard_service_1 = require("./dashboard.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../rbac/guards/roles.guard");
const roles_decorator_1 = require("../rbac/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let DashboardController = class DashboardController {
    dashboardService;
    constructor(dashboardService) {
        this.dashboardService = dashboardService;
    }
    async getStats(req) {
        const user = req.user;
        return this.dashboardService.getRoleBasedStats(user);
    }
    async getActivity(req, limit) {
        const user = req.user;
        const limitNum = limit ? parseInt(limit, 10) : 10;
        return this.dashboardService.getRoleBasedActivity(user, limitNum);
    }
    async getProjects(req, limit) {
        const user = req.user;
        const limitNum = limit ? parseInt(limit, 10) : 5;
        return this.dashboardService.getRoleBasedProjects(user, limitNum);
    }
    async getSystemHealth(req) {
        const user = req.user;
        return this.dashboardService.getRoleBasedSystemHealth(user);
    }
    async getNavigation(req) {
        const user = req.user;
        console.log('🔍 [DASHBOARD DEBUG] Navigation endpoint called', {
            userId: user?.id,
            userEmail: user?.email,
            userRole: user?.role,
            userTenantId: user?.tenantId
        });
        return this.dashboardService.getRoleBasedNavigation(user);
    }
    async getPermissions(req) {
        const user = req.user;
        return this.dashboardService.getUserPermissions(user.id);
    }
    async getAvailableFeatures(req) {
        const user = req.user;
        return this.dashboardService.getAvailableFeatures(user);
    }
    async checkFeatureAccess(req, featureSlug) {
        const user = req.user;
        const canAccess = await this.dashboardService.canAccessFeature(user, featureSlug);
        return { featureSlug, canAccess };
    }
    async getTenantFeatures(req) {
        const user = req.user;
        return this.dashboardService.getTenantFeatures(user.tenantId);
    }
};
exports.DashboardController = DashboardController;
__decorate([
    (0, common_1.Get)('stats'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.PLATFORM_ADMIN, client_1.UserRole.TENANT_ADMIN, client_1.UserRole.END_USER),
    (0, swagger_1.ApiOperation)({ summary: 'Get role-based dashboard statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Dashboard statistics retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('activity'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.PLATFORM_ADMIN, client_1.UserRole.TENANT_ADMIN, client_1.UserRole.END_USER),
    (0, swagger_1.ApiOperation)({ summary: 'Get role-based recent activity feed' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Recent activity retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getActivity", null);
__decorate([
    (0, common_1.Get)('projects'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.PLATFORM_ADMIN, client_1.UserRole.TENANT_ADMIN, client_1.UserRole.END_USER),
    (0, swagger_1.ApiOperation)({ summary: 'Get role-based projects data' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Projects retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getProjects", null);
__decorate([
    (0, common_1.Get)('health'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.PLATFORM_ADMIN, client_1.UserRole.TENANT_ADMIN, client_1.UserRole.END_USER),
    (0, swagger_1.ApiOperation)({ summary: 'Get role-based system health information' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'System health retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getSystemHealth", null);
__decorate([
    (0, common_1.Get)('navigation'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.PLATFORM_ADMIN, client_1.UserRole.TENANT_ADMIN, client_1.UserRole.END_USER),
    (0, swagger_1.ApiOperation)({ summary: 'Get role-based navigation menu' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Navigation menu retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getNavigation", null);
__decorate([
    (0, common_1.Get)('permissions'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.PLATFORM_ADMIN, client_1.UserRole.TENANT_ADMIN, client_1.UserRole.END_USER),
    (0, swagger_1.ApiOperation)({ summary: 'Get user permissions and capabilities' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User permissions retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getPermissions", null);
__decorate([
    (0, common_1.Get)('features'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.PLATFORM_ADMIN, client_1.UserRole.TENANT_ADMIN, client_1.UserRole.END_USER),
    (0, swagger_1.ApiOperation)({ summary: 'Get available features for user based on role and tenant' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Available features retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getAvailableFeatures", null);
__decorate([
    (0, common_1.Get)('features/:featureSlug/access'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.PLATFORM_ADMIN, client_1.UserRole.TENANT_ADMIN, client_1.UserRole.END_USER),
    (0, swagger_1.ApiOperation)({ summary: 'Check if user can access a specific feature' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Feature access status retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('featureSlug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "checkFeatureAccess", null);
__decorate([
    (0, common_1.Get)('tenant-features'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.SUPER_ADMIN, client_1.UserRole.PLATFORM_ADMIN, client_1.UserRole.TENANT_ADMIN, client_1.UserRole.END_USER),
    (0, swagger_1.ApiOperation)({ summary: 'Get tenant features (what features this tenant has access to)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tenant features retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getTenantFeatures", null);
exports.DashboardController = DashboardController = __decorate([
    (0, swagger_1.ApiTags)('Dashboard'),
    (0, common_1.Controller)('dashboard'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [dashboard_service_1.DashboardService])
], DashboardController);
//# sourceMappingURL=dashboard.controller.js.map