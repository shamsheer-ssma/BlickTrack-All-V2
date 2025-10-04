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
exports.TenantAdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
let TenantAdminService = class TenantAdminService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getTenantUsers(tenantId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                where: { tenantId },
                skip,
                take: limit,
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    role: true,
                    isActive: true,
                    lastLoginAt: true,
                    createdAt: true,
                    updatedAt: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
            }),
            this.prisma.user.count({
                where: { tenantId },
            }),
        ]);
        return {
            users,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async createTenantUser(tenantId, createUserDto) {
        if (createUserDto.role === client_1.UserRole.PLATFORM_ADMIN) {
            throw new common_1.ForbiddenException('Cannot create platform admin users');
        }
        return this.prisma.user.create({
            data: {
                ...createUserDto,
                tenantId,
                role: createUserDto.role || client_1.UserRole.END_USER,
            },
        });
    }
    async changeUserRole(tenantId, userId, roleDto) {
        const user = await this.prisma.user.findFirst({
            where: { id: userId, tenantId },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found in this tenant');
        }
        if (roleDto.role === client_1.UserRole.PLATFORM_ADMIN || user.role === client_1.UserRole.PLATFORM_ADMIN) {
            throw new common_1.ForbiddenException('Cannot modify platform admin role');
        }
        return this.prisma.user.update({
            where: { id: userId },
            data: {
                role: roleDto.role,
                updatedAt: new Date(),
            },
        });
    }
    async changeUserStatus(tenantId, userId, statusDto) {
        const user = await this.prisma.user.findFirst({
            where: { id: userId, tenantId },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found in this tenant');
        }
        return this.prisma.user.update({
            where: { id: userId },
            data: {
                isActive: statusDto.isActive,
                updatedAt: new Date(),
            },
        });
    }
    async getTenantSettings(tenantId) {
        const tenant = await this.prisma.tenant.findUnique({
            where: { id: tenantId },
            select: {
                id: true,
                name: true,
                domain: true,
                settings: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (!tenant) {
            throw new common_1.NotFoundException('Tenant not found');
        }
        return tenant;
    }
    async updateTenantSettings(tenantId, settingsDto) {
        return this.prisma.tenant.update({
            where: { id: tenantId },
            data: {
                settings: settingsDto,
                updatedAt: new Date(),
            },
        });
    }
    async getDashboardStats(tenantId) {
        const [userStats, recentActivity] = await Promise.all([
            this.prisma.user.groupBy({
                where: { tenantId },
                by: ['role'],
                _count: true,
            }),
            this.prisma.auditLog.findMany({
                where: { tenantId },
                take: 10,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    action: true,
                    userId: true,
                    createdAt: true,
                    user: {
                        select: {
                            firstName: true,
                            lastName: true,
                            email: true,
                        },
                    },
                },
            }),
        ]);
        const totalUsers = await this.prisma.user.count({
            where: { tenantId },
        });
        const activeUsers = await this.prisma.user.count({
            where: {
                tenantId,
                isActive: true,
                lastLoginAt: {
                    gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                },
            },
        });
        return {
            users: {
                total: totalUsers,
                active: activeUsers,
                byRole: userStats,
            },
            recentActivity,
            timestamp: new Date().toISOString(),
        };
    }
    async getUserAnalytics(tenantId) {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const [userGrowth, loginActivity] = await Promise.all([
            this.prisma.user.count({
                where: {
                    tenantId,
                    createdAt: {
                        gte: thirtyDaysAgo,
                    },
                },
            }),
            this.prisma.auditLog.count({
                where: {
                    tenantId,
                    action: 'USER_LOGIN',
                    createdAt: {
                        gte: thirtyDaysAgo,
                    },
                },
            }),
        ]);
        return {
            userGrowth,
            loginActivity,
            period: '30 days',
            timestamp: new Date().toISOString(),
        };
    }
    async getDepartments(tenantId) {
        return {
            departments: [],
            message: 'Department management feature coming soon',
        };
    }
    async createDepartment(tenantId, deptDto) {
        return {
            department: null,
            message: 'Department management feature coming soon',
        };
    }
};
exports.TenantAdminService = TenantAdminService;
exports.TenantAdminService = TenantAdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TenantAdminService);
//# sourceMappingURL=tenant-admin.service.js.map