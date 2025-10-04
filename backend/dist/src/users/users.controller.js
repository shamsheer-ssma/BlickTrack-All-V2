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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const client_1 = require("@prisma/client");
const users_service_1 = require("./users.service");
const user_permissions_service_1 = require("./user-permissions.service");
const external_collaborator_service_1 = require("./external-collaborator.service");
let UsersController = class UsersController {
    usersService;
    permissionsService;
    collaboratorService;
    constructor(usersService, permissionsService, collaboratorService) {
        this.usersService = usersService;
        this.permissionsService = permissionsService;
        this.collaboratorService = collaboratorService;
    }
    async getInternalUsers(user, department, role, page = 1, limit = 20) {
        return this.usersService.getInternalUsers(user.tenantId, { department, role, page, limit });
    }
    async createInternalUser(user, createUserDto) {
        return this.usersService.createInternalUser(user.tenantId, createUserDto);
    }
    async getExternalCollaborators(user, status, company, page = 1, limit = 20) {
        return this.collaboratorService.getExternalCollaborators(user.tenantId, { status, company, page, limit });
    }
    async inviteExternalCollaborator(user, inviteDto) {
        return this.collaboratorService.inviteExternalCollaborator(user.tenantId, user.id, inviteDto);
    }
    async extendCollaboratorContract(user, userId, extensionDto) {
        return this.collaboratorService.extendContract(user.tenantId, userId, extensionDto);
    }
    async revokeCollaboratorAccess(user, userId) {
        return this.collaboratorService.revokeAccess(user.tenantId, userId);
    }
    async getUserPermissions(user, userId) {
        return this.permissionsService.getUserPermissions(user.tenantId, userId);
    }
    async updateUserPermissions(user, userId, permissionsDto) {
        return this.permissionsService.updateUserPermissions(user.tenantId, userId, permissionsDto);
    }
    async getDepartmentUsers(user, department, includeExternal = false) {
        return this.usersService.getDepartmentUsers(user.tenantId, department, includeExternal);
    }
    async getUsersByRole(user, role) {
        return this.usersService.getUsersByRole(user.tenantId, role);
    }
    async activateUser(user, userId) {
        return this.usersService.activateUser(user.tenantId, userId);
    }
    async deactivateUser(user, userId) {
        return this.usersService.deactivateUser(user.tenantId, userId);
    }
    async getUserAnalyticsOverview(user) {
        return this.usersService.getUserAnalytics(user.tenantId);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)('internal'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.TENANT_ADMIN, client_1.UserRole.DEPARTMENT_HEAD, client_1.UserRole.PLATFORM_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get all internal users in tenant' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of internal users' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('department')),
    __param(2, (0, common_1.Query)('role')),
    __param(3, (0, common_1.Query)('page')),
    __param(4, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getInternalUsers", null);
__decorate([
    (0, common_1.Post)('internal'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.TENANT_ADMIN, client_1.UserRole.DEPARTMENT_HEAD, client_1.UserRole.PLATFORM_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Create new internal user (employee)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Internal user created successfully' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "createInternalUser", null);
__decorate([
    (0, common_1.Get)('external'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.TENANT_ADMIN, client_1.UserRole.PROJECT_MANAGER, client_1.UserRole.PLATFORM_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get all external collaborators' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of external collaborators' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('company')),
    __param(3, (0, common_1.Query)('page')),
    __param(4, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getExternalCollaborators", null);
__decorate([
    (0, common_1.Post)('external'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.TENANT_ADMIN, client_1.UserRole.PROJECT_MANAGER, client_1.UserRole.PLATFORM_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Invite external collaborator' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'External collaborator invited successfully' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "inviteExternalCollaborator", null);
__decorate([
    (0, common_1.Put)('external/:userId/extend'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.TENANT_ADMIN, client_1.UserRole.PROJECT_MANAGER, client_1.UserRole.PLATFORM_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Extend external collaborator contract' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Contract extended successfully' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('userId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "extendCollaboratorContract", null);
__decorate([
    (0, common_1.Put)('external/:userId/revoke'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.TENANT_ADMIN, client_1.UserRole.PROJECT_MANAGER, client_1.UserRole.PLATFORM_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Revoke external collaborator access' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Access revoked successfully' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "revokeCollaboratorAccess", null);
__decorate([
    (0, common_1.Get)(':userId/permissions'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.TENANT_ADMIN, client_1.UserRole.SECURITY_OFFICER, client_1.UserRole.PLATFORM_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get user permissions' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User permissions details' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserPermissions", null);
__decorate([
    (0, common_1.Put)(':userId/permissions'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.TENANT_ADMIN, client_1.UserRole.SECURITY_OFFICER, client_1.UserRole.PLATFORM_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Update user permissions' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Permissions updated successfully' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('userId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateUserPermissions", null);
__decorate([
    (0, common_1.Get)('departments/:department'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.TENANT_ADMIN, client_1.UserRole.DEPARTMENT_HEAD, client_1.UserRole.PLATFORM_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get users by department' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Department users list' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('department')),
    __param(2, (0, common_1.Query)('includeExternal')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Boolean]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getDepartmentUsers", null);
__decorate([
    (0, common_1.Get)('roles/:role'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.TENANT_ADMIN, client_1.UserRole.SECURITY_OFFICER, client_1.UserRole.PLATFORM_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get users by role' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Users with specific role' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUsersByRole", null);
__decorate([
    (0, common_1.Put)(':userId/activate'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.TENANT_ADMIN, client_1.UserRole.DEPARTMENT_HEAD, client_1.UserRole.PLATFORM_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Activate user account' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User activated successfully' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "activateUser", null);
__decorate([
    (0, common_1.Put)(':userId/deactivate'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.TENANT_ADMIN, client_1.UserRole.DEPARTMENT_HEAD, client_1.UserRole.PLATFORM_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Deactivate user account' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User deactivated successfully' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deactivateUser", null);
__decorate([
    (0, common_1.Get)('analytics/overview'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.TENANT_ADMIN, client_1.UserRole.SECURITY_OFFICER, client_1.UserRole.PLATFORM_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get user analytics overview' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User analytics data' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserAnalyticsOverview", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)('User Management'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('api/v1/users'),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        user_permissions_service_1.UserPermissionsService,
        external_collaborator_service_1.ExternalCollaboratorService])
], UsersController);
//# sourceMappingURL=users.controller.js.map