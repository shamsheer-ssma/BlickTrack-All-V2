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
exports.UserPermissionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let UserPermissionsService = class UserPermissionsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getUserPermissions(userId, tenantId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                tenant: true,
            },
        });
        if (!user) {
            throw new Error('User not found');
        }
        return this.getPermissionsForRole(user.role || 'VIEWER');
    }
    async updateUserPermissions(tenantId, userId, permissionsDto) {
        return this.getUserPermissions(userId, tenantId);
    }
    getPermissionsForRole(role) {
        const permissions = {
            'SUPER_ADMIN': ['*'],
            'PLATFORM_ADMIN': ['platform:*'],
            'TENANT_ADMIN': ['tenant:*'],
            'SECURITY_LEAD': ['security:*', 'users:read', 'projects:*'],
            'SECURITY_ANALYST': ['security:read', 'threats:*', 'projects:read'],
            'PRODUCT_OWNER': ['projects:*', 'users:read'],
            'PROJECT_MANAGER': ['projects:manage', 'users:read'],
            'DEPARTMENT_HEAD': ['department:*', 'users:read'],
            'SECURITY_OFFICER': ['security:*', 'compliance:*'],
            'END_USER': ['projects:read', 'profile:manage'],
            'COLLABORATOR': ['projects:read', 'collaborate:*'],
            'VIEWER': ['read:*'],
        };
        return permissions[role] || ['read:*'];
    }
    async checkPermission(userId, permission) {
        const userPermissions = await this.getUserPermissions(userId);
        if (userPermissions.includes('*')) {
            return true;
        }
        if (userPermissions.includes(permission)) {
            return true;
        }
        const [resource, action] = permission.split(':');
        if (userPermissions.includes(`${resource}:*`)) {
            return true;
        }
        return false;
    }
};
exports.UserPermissionsService = UserPermissionsService;
exports.UserPermissionsService = UserPermissionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserPermissionsService);
//# sourceMappingURL=user-permissions.service.js.map