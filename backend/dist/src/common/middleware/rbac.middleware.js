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
exports.TenantUsers = exports.AuthenticatedUsers = exports.TenantAdminOrAbove = exports.PlatformAdminOnly = exports.RBACMiddleware = void 0;
exports.createRBACMiddleware = createRBACMiddleware;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let RBACMiddleware = class RBACMiddleware {
    rbacConfig;
    constructor(config) {
        this.rbacConfig = config;
    }
    use(req, res, next) {
        const user = req.user;
        if (!user) {
            throw new common_1.ForbiddenException('Authentication required');
        }
        if (!this.rbacConfig.roles.includes(user.role)) {
            throw new common_1.ForbiddenException(`Access denied. Required roles: ${this.rbacConfig.roles.join(', ')}`);
        }
        if (user.role === client_1.UserRole.PLATFORM_ADMIN) {
            return next();
        }
        if (this.rbacConfig.requireTenantMatch) {
            if (!user.tenantId) {
                throw new common_1.ForbiddenException('User must belong to a tenant');
            }
            const resourceTenantId = req.params.tenantId || req.body?.tenantId;
            if (resourceTenantId && resourceTenantId !== user.tenantId) {
                throw new common_1.ForbiddenException('Access denied to resources outside your tenant');
            }
        }
        if (this.rbacConfig.requireOwnership) {
            const resourceUserId = req.params.userId || req.body?.userId;
            if (resourceUserId && resourceUserId !== user.id) {
                if (user.role !== client_1.UserRole.TENANT_ADMIN && user.role !== client_1.UserRole.PLATFORM_ADMIN) {
                    throw new common_1.ForbiddenException('Access denied to resources you do not own');
                }
            }
        }
        next();
    }
};
exports.RBACMiddleware = RBACMiddleware;
exports.RBACMiddleware = RBACMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object])
], RBACMiddleware);
function createRBACMiddleware(config) {
    let ConfiguredRBACMiddleware = class ConfiguredRBACMiddleware extends RBACMiddleware {
        constructor() {
            super(config);
        }
    };
    ConfiguredRBACMiddleware = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [])
    ], ConfiguredRBACMiddleware);
    return ConfiguredRBACMiddleware;
}
let PlatformAdminOnly = class PlatformAdminOnly extends RBACMiddleware {
    constructor() {
        super({
            roles: [client_1.UserRole.PLATFORM_ADMIN],
        });
    }
};
exports.PlatformAdminOnly = PlatformAdminOnly;
exports.PlatformAdminOnly = PlatformAdminOnly = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PlatformAdminOnly);
let TenantAdminOrAbove = class TenantAdminOrAbove extends RBACMiddleware {
    constructor() {
        super({
            roles: [client_1.UserRole.PLATFORM_ADMIN, client_1.UserRole.TENANT_ADMIN],
            requireTenantMatch: true,
        });
    }
};
exports.TenantAdminOrAbove = TenantAdminOrAbove;
exports.TenantAdminOrAbove = TenantAdminOrAbove = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], TenantAdminOrAbove);
let AuthenticatedUsers = class AuthenticatedUsers extends RBACMiddleware {
    constructor() {
        super({
            roles: [client_1.UserRole.PLATFORM_ADMIN, client_1.UserRole.TENANT_ADMIN, client_1.UserRole.END_USER, client_1.UserRole.COLLABORATOR],
        });
    }
};
exports.AuthenticatedUsers = AuthenticatedUsers;
exports.AuthenticatedUsers = AuthenticatedUsers = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AuthenticatedUsers);
let TenantUsers = class TenantUsers extends RBACMiddleware {
    constructor() {
        super({
            roles: [client_1.UserRole.PLATFORM_ADMIN, client_1.UserRole.TENANT_ADMIN, client_1.UserRole.END_USER],
            requireTenantMatch: true,
        });
    }
};
exports.TenantUsers = TenantUsers;
exports.TenantUsers = TenantUsers = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], TenantUsers);
//# sourceMappingURL=rbac.middleware.js.map