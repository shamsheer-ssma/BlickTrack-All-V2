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
exports.PlatformAdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let PlatformAdminService = class PlatformAdminService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAllTenants(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [tenants, total] = await Promise.all([
            this.prisma.tenant.findMany({
                skip,
                take: limit,
                include: {
                    _count: {
                        select: {
                            users: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            }),
            this.prisma.tenant.count(),
        ]);
        return {
            tenants,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async createTenant(createTenantDto) {
        return this.prisma.tenant.create({
            data: createTenantDto,
        });
    }
    async suspendTenant(tenantId) {
        const tenant = await this.prisma.tenant.findUnique({
            where: { id: tenantId },
        });
        if (!tenant) {
            throw new common_1.NotFoundException('Tenant not found');
        }
        return this.prisma.tenant.update({
            where: { id: tenantId },
            data: {
                status: 'SUSPENDED',
                updatedAt: new Date(),
            },
        });
    }
    async activateTenant(tenantId) {
        const tenant = await this.prisma.tenant.findUnique({
            where: { id: tenantId },
        });
        if (!tenant) {
            throw new common_1.NotFoundException('Tenant not found');
        }
        return this.prisma.tenant.update({
            where: { id: tenantId },
            data: {
                status: 'ACTIVE',
                updatedAt: new Date(),
            },
        });
    }
    async getSystemHealth() {
        try {
            await this.prisma.$queryRaw `SELECT 1`;
            const stats = await Promise.all([
                this.prisma.tenant.count(),
                this.prisma.user.count(),
                this.prisma.auditLog.count(),
            ]);
            return {
                status: 'healthy',
                timestamp: new Date().toISOString(),
                database: 'connected',
                uptime: process.uptime(),
                memory: process.memoryUsage(),
                stats: {
                    totalTenants: stats[0],
                    totalUsers: stats[1],
                    totalAuditLogs: stats[2],
                },
            };
        }
        catch (error) {
            return {
                status: 'unhealthy',
                timestamp: new Date().toISOString(),
                error: error.message,
            };
        }
    }
    async getSystemMetrics() {
        const [tenantStats, userStats] = await Promise.all([
            this.prisma.tenant.groupBy({
                by: ['status'],
                _count: true,
            }),
            this.prisma.user.groupBy({
                by: ['role'],
                _count: true,
            }),
        ]);
        return {
            tenants: tenantStats,
            users: userStats,
            timestamp: new Date().toISOString(),
        };
    }
    async getAllUsers(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                skip,
                take: limit,
                include: {
                    tenant: {
                        select: {
                            id: true,
                            name: true,
                            domain: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            }),
            this.prisma.user.count(),
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
    async changeUserRole(userId, roleDto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return this.prisma.user.update({
            where: { id: userId },
            data: {
                role: roleDto.role,
                updatedAt: new Date(),
            },
        });
    }
};
exports.PlatformAdminService = PlatformAdminService;
exports.PlatformAdminService = PlatformAdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PlatformAdminService);
//# sourceMappingURL=platform-admin.service.js.map