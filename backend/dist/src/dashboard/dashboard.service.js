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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DashboardService = class DashboardService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboardStats() {
        try {
            const projectStats = await this.prisma.project.aggregate({
                _count: {
                    id: true,
                },
                where: {},
            });
            const userStats = await this.prisma.user.aggregate({
                _count: {
                    id: true,
                },
                where: {
                    isActive: true,
                },
            });
            const recentActivity = await this.prisma.auditLog.count({
                where: {
                    createdAt: {
                        gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
                    },
                },
            });
            const uptime = 99.9;
            const systemStatus = uptime > 99 ? 'healthy' : uptime > 95 ? 'warning' : 'critical';
            return {
                totalProjects: projectStats._count.id,
                activeProjects: Math.floor(projectStats._count.id * 0.75),
                completedProjects: Math.floor(projectStats._count.id * 0.25),
                overdueProjects: Math.floor(projectStats._count.id * 0.1),
                securityAlerts: Math.floor(recentActivity * 0.3),
                activeUsers: userStats._count.id,
                reportsGenerated: Math.floor(recentActivity * 0.8),
                systemHealth: {
                    status: systemStatus,
                    uptime: uptime,
                    lastBackup: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                },
            };
        }
        catch (error) {
            console.error('Error fetching dashboard stats:', error);
            throw error;
        }
    }
    async getRecentActivity(limit = 10) {
        try {
            const auditLogs = await this.prisma.auditLog.findMany({
                take: limit,
                orderBy: {
                    createdAt: 'desc',
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            });
            return auditLogs.map((log) => ({
                id: log.id,
                type: this.mapAuditEventToActivityType(log.eventType),
                title: this.generateActivityTitle(log),
                description: this.generateActivityDescription(log),
                timestamp: log.createdAt.toISOString(),
                severity: this.mapAuditEventToSeverity(log.eventType),
            }));
        }
        catch (error) {
            console.error('Error fetching recent activity:', error);
            return [];
        }
    }
    async getTopProjects(limit = 5) {
        try {
            const projects = await this.prisma.project.findMany({
                take: limit,
                orderBy: {
                    updatedAt: 'desc',
                },
            });
            return projects.map((project) => ({
                id: project.id,
                name: project.name,
                status: project.status,
                progress: this.calculateProjectProgress(project),
                teamSize: Math.floor(Math.random() * 10) + 3,
            }));
        }
        catch (error) {
            console.error('Error fetching top projects:', error);
            return [];
        }
    }
    async getSystemHealth() {
        try {
            const uptime = 99.9;
            const status = uptime > 99 ? 'healthy' : uptime > 95 ? 'warning' : 'critical';
            return {
                status,
                uptime,
                lastBackup: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                services: {
                    database: 'healthy',
                    api: 'healthy',
                    authentication: 'healthy',
                    fileStorage: 'healthy',
                },
            };
        }
        catch (error) {
            console.error('Error fetching system health:', error);
            throw error;
        }
    }
    mapAuditEventToActivityType(eventType) {
        if (eventType.includes('PROJECT'))
            return 'project';
        if (eventType.includes('SECURITY') || eventType.includes('AUTHENTICATION'))
            return 'security';
        if (eventType.includes('USER'))
            return 'user';
        return 'system';
    }
    generateActivityTitle(log) {
        const userName = log.user?.name || log.user?.email || 'System';
        const action = log.action || 'performed action';
        switch (log.eventType) {
            case 'PROJECT_CREATED':
                return `Project created by ${userName}`;
            case 'PROJECT_UPDATED':
                return `Project updated by ${userName}`;
            case 'AUTHENTICATION_LOGIN':
                return `User ${userName} logged in`;
            case 'AUTHENTICATION_LOGOUT':
                return `User ${userName} logged out`;
            case 'SECURITY_ALERT':
                return `Security alert triggered`;
            default:
                return `${userName} ${action}`;
        }
    }
    generateActivityDescription(log) {
        return log.details || `Action performed: ${log.action}`;
    }
    mapAuditEventToSeverity(eventType) {
        if (eventType.includes('SECURITY') || eventType.includes('CRITICAL'))
            return 'critical';
        if (eventType.includes('WARNING') || eventType.includes('FAILED'))
            return 'high';
        if (eventType.includes('UPDATE') || eventType.includes('CHANGE'))
            return 'medium';
        return 'low';
    }
    calculateProjectProgress(project) {
        switch (project.status) {
            case 'COMPLETED': return 100;
            case 'ACTIVE': return 75;
            case 'PLANNING': return 25;
            default: return 50;
        }
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map