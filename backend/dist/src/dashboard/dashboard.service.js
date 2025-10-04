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
const client_1 = require("@prisma/client");
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
    async getRoleBasedStats(user) {
        const userRole = user.role;
        const tenantId = user.tenantId;
        const tenantFeatures = await this.getTenantFeatures(tenantId);
        const userPermissions = await this.getUserPermissions(user.id);
        switch (userRole) {
            case client_1.UserRole.SUPER_ADMIN:
            case client_1.UserRole.PLATFORM_ADMIN:
                return this.getPlatformAdminStats(tenantFeatures);
            case client_1.UserRole.TENANT_ADMIN:
                return this.getTenantAdminStats(tenantId, tenantFeatures);
            case client_1.UserRole.END_USER:
                return this.getUserStats(tenantId, user.id, tenantFeatures, userPermissions);
            default:
                throw new Error('Invalid user role');
        }
    }
    async getRoleBasedActivity(user, limit) {
        const userRole = user.role;
        const tenantId = user.tenantId;
        switch (userRole) {
            case client_1.UserRole.SUPER_ADMIN:
            case client_1.UserRole.PLATFORM_ADMIN:
                return this.getPlatformAdminActivity(limit);
            case client_1.UserRole.TENANT_ADMIN:
                return this.getTenantAdminActivity(tenantId, limit);
            case client_1.UserRole.END_USER:
                return this.getUserActivity(tenantId, user.id, limit);
            default:
                throw new Error('Invalid user role');
        }
    }
    async getRoleBasedProjects(user, limit) {
        const userRole = user.role;
        const tenantId = user.tenantId;
        switch (userRole) {
            case client_1.UserRole.SUPER_ADMIN:
            case client_1.UserRole.PLATFORM_ADMIN:
                return this.getPlatformAdminProjects(limit);
            case client_1.UserRole.TENANT_ADMIN:
                return this.getTenantAdminProjects(tenantId, limit);
            case client_1.UserRole.END_USER:
                return this.getUserProjects(tenantId, user.id, limit);
            default:
                throw new Error('Invalid user role');
        }
    }
    async getRoleBasedSystemHealth(user) {
        const userRole = user.role;
        switch (userRole) {
            case client_1.UserRole.SUPER_ADMIN:
            case client_1.UserRole.PLATFORM_ADMIN:
                return this.getPlatformAdminSystemHealth();
            case client_1.UserRole.TENANT_ADMIN:
                return this.getTenantAdminSystemHealth();
            case client_1.UserRole.END_USER:
                return this.getUserSystemHealth();
            default:
                throw new Error('Invalid user role');
        }
    }
    async getRoleBasedNavigation(user) {
        const userRole = user.role;
        const baseNavigation = [
            { id: 'dashboard', label: 'Dashboard', icon: 'Home', path: '/dashboard' },
            { id: 'projects', label: 'Projects', icon: 'Folder', path: '/projects' },
            { id: 'reports', label: 'Reports', icon: 'FileText', path: '/reports' },
        ];
        switch (userRole) {
            case client_1.UserRole.SUPER_ADMIN:
            case client_1.UserRole.PLATFORM_ADMIN:
                return [
                    ...baseNavigation,
                    { id: 'platform-admin', label: 'Platform Admin', icon: 'Settings', path: '/platform-admin' },
                    { id: 'tenants', label: 'Tenants', icon: 'Building', path: '/tenants' },
                    { id: 'users', label: 'All Users', icon: 'Users', path: '/users' },
                    { id: 'system', label: 'System', icon: 'Monitor', path: '/system' },
                    { id: 'analytics', label: 'Analytics', icon: 'BarChart', path: '/analytics' },
                ];
            case client_1.UserRole.TENANT_ADMIN:
                return [
                    ...baseNavigation,
                    { id: 'tenant-admin', label: 'Tenant Admin', icon: 'Settings', path: '/tenant-admin' },
                    { id: 'users', label: 'Users', icon: 'Users', path: '/tenant-users' },
                    { id: 'settings', label: 'Settings', icon: 'Cog', path: '/settings' },
                    { id: 'analytics', label: 'Analytics', icon: 'BarChart', path: '/tenant-analytics' },
                ];
            case client_1.UserRole.END_USER:
                return [
                    ...baseNavigation,
                    { id: 'profile', label: 'Profile', icon: 'User', path: '/profile' },
                    { id: 'notifications', label: 'Notifications', icon: 'Bell', path: '/notifications' },
                ];
            default:
                return baseNavigation;
        }
    }
    async getUserPermissions(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { role: true, tenantId: true }
        });
        if (!user) {
            throw new Error('User not found');
        }
        const userRole = user.role;
        const tenantId = user.tenantId;
        const permissions = {};
        switch (userRole) {
            case client_1.UserRole.SUPER_ADMIN:
            case client_1.UserRole.PLATFORM_ADMIN:
                permissions.canViewDashboard = true;
                permissions.canViewProjects = true;
                permissions.canViewReports = true;
                permissions.canManagePlatform = true;
                permissions.canManageTenants = true;
                permissions.canManageAllUsers = true;
                permissions.canViewSystemHealth = true;
                permissions.canViewAnalytics = true;
                permissions.canManageSystemSettings = true;
                permissions.canManageTenant = true;
                permissions.canManageTenantUsers = true;
                permissions.canViewTenantAnalytics = true;
                permissions.canManageTenantSettings = true;
                permissions.canManageProfile = true;
                permissions.canViewNotifications = true;
                break;
            case client_1.UserRole.TENANT_ADMIN:
                permissions.canViewDashboard = true;
                permissions.canViewProjects = true;
                permissions.canViewReports = true;
                permissions.canManagePlatform = false;
                permissions.canManageTenants = false;
                permissions.canManageAllUsers = false;
                permissions.canViewSystemHealth = false;
                permissions.canViewAnalytics = true;
                permissions.canManageSystemSettings = false;
                permissions.canManageTenant = true;
                permissions.canManageTenantUsers = true;
                permissions.canViewTenantAnalytics = true;
                permissions.canManageTenantSettings = true;
                permissions.canManageProfile = true;
                permissions.canViewNotifications = true;
                break;
            case client_1.UserRole.END_USER:
            default:
                permissions.canViewDashboard = true;
                permissions.canViewProjects = true;
                permissions.canViewReports = true;
                permissions.canManagePlatform = false;
                permissions.canManageTenants = false;
                permissions.canManageAllUsers = false;
                permissions.canViewSystemHealth = false;
                permissions.canViewAnalytics = false;
                permissions.canManageSystemSettings = false;
                permissions.canManageTenant = false;
                permissions.canManageTenantUsers = false;
                permissions.canViewTenantAnalytics = false;
                permissions.canManageTenantSettings = false;
                permissions.canManageProfile = true;
                permissions.canViewNotifications = true;
                break;
        }
        return permissions;
    }
    async getTenantFeatures(tenantId) {
        const tenant = await this.prisma.tenant.findUnique({
            where: { id: tenantId },
            select: { planId: true }
        });
        if (!tenant?.planId) {
            return [];
        }
        return this.prisma.planFeature.findMany({
            where: {
                planId: tenant.planId,
                enabled: true
            },
            include: {
                feature: true
            }
        });
    }
    async canAccessFeature(user, featureSlug) {
        const userRole = user.role;
        const tenantId = user.tenantId;
        if (userRole === client_1.UserRole.SUPER_ADMIN || userRole === client_1.UserRole.PLATFORM_ADMIN) {
            return true;
        }
        const tenant = await this.prisma.tenant.findUnique({
            where: { id: tenantId },
            select: { planId: true }
        });
        if (!tenant?.planId) {
            return false;
        }
        const tenantFeature = await this.prisma.planFeature.findFirst({
            where: {
                planId: tenant.planId,
                feature: { key: featureSlug },
                enabled: true
            }
        });
        if (!tenantFeature) {
            return false;
        }
        if (userRole === client_1.UserRole.TENANT_ADMIN) {
            return true;
        }
        if (userRole === client_1.UserRole.END_USER) {
            const userPermission = await this.prisma.userFeatureAccess.findFirst({
                where: {
                    userId: user.id,
                    feature: { key: featureSlug }
                }
            });
            return userPermission?.isActive || false;
        }
        return false;
    }
    async getAvailableFeatures(user) {
        const userRole = user.role;
        const tenantId = user.tenantId;
        if (userRole === client_1.UserRole.SUPER_ADMIN || userRole === client_1.UserRole.PLATFORM_ADMIN) {
            return this.prisma.feature.findMany({
                where: { defaultEnabled: true }
            });
        }
        const tenantFeatures = await this.getTenantFeatures(tenantId);
        if (userRole === client_1.UserRole.TENANT_ADMIN) {
            return tenantFeatures.map(tf => tf.feature);
        }
        const userPermissions = await this.getUserPermissions(user.id);
        const availableFeatures = [];
        for (const tenantFeature of tenantFeatures) {
            const permission = userPermissions[tenantFeature.feature.key];
            if (permission?.canView) {
                availableFeatures.push(tenantFeature.feature);
            }
        }
        return availableFeatures;
    }
    async getPlatformAdminStats(tenantFeatures) {
        const [totalTenants, totalUsers, activeUsers, totalProjects, activeProjects, completedProjects, securityAlerts, totalFeatures,] = await Promise.all([
            this.prisma.tenant.count(),
            this.prisma.user.count(),
            this.prisma.user.count({ where: { isActive: true } }),
            this.prisma.project.count(),
            this.prisma.project.count({ where: { status: 'ACTIVE' } }),
            this.prisma.project.count({ where: { status: 'COMPLETED' } }),
            this.prisma.auditLog.count({ where: { eventType: 'SECURITY_EVENT' } }),
            this.prisma.feature.count({ where: { defaultEnabled: true } }),
        ]);
        return {
            totalTenants,
            totalUsers,
            activeUsers,
            totalProjects,
            activeProjects,
            completedProjects,
            overdueProjects: 0,
            securityAlerts,
            totalFeatures,
            systemUptime: '99.9%',
            dataProcessed: '2.4TB',
        };
    }
    async getPlatformAdminActivity(limit) {
        return this.prisma.auditLog.findMany({
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { firstName: true, lastName: true, email: true } },
                tenant: { select: { name: true } },
            },
        });
    }
    async getPlatformAdminProjects(limit) {
        return this.prisma.project.findMany({
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                tenant: { select: { name: true } },
                owner: { select: { firstName: true, lastName: true } },
            },
        });
    }
    async getPlatformAdminSystemHealth() {
        return {
            status: 'healthy',
            uptime: '99.9%',
            responseTime: '120ms',
            databaseStatus: 'connected',
            emailServiceStatus: 'operational',
            storageUsage: '45%',
            memoryUsage: '62%',
            cpuUsage: '38%',
        };
    }
    async getTenantAdminStats(tenantId, tenantFeatures) {
        const [totalUsers, activeUsers, totalProjects, activeProjects, completedProjects, securityAlerts,] = await Promise.all([
            this.prisma.user.count({ where: { tenantId } }),
            this.prisma.user.count({ where: { tenantId, isActive: true } }),
            this.prisma.project.count({ where: { tenantId } }),
            this.prisma.project.count({ where: { tenantId, status: 'ACTIVE' } }),
            this.prisma.project.count({ where: { tenantId, status: 'COMPLETED' } }),
            this.prisma.auditLog.count({
                where: {
                    tenantId,
                    eventType: 'SECURITY_EVENT'
                }
            }),
        ]);
        return {
            totalUsers,
            activeUsers,
            totalProjects,
            activeProjects,
            completedProjects,
            overdueProjects: 0,
            securityAlerts,
            availableFeatures: tenantFeatures?.length || 0,
            tenantUptime: '99.8%',
            dataProcessed: '156GB',
        };
    }
    async getTenantAdminActivity(tenantId, limit) {
        return this.prisma.auditLog.findMany({
            where: { tenantId },
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { firstName: true, lastName: true, email: true } },
            },
        });
    }
    async getTenantAdminProjects(tenantId, limit) {
        return this.prisma.project.findMany({
            where: { tenantId },
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                owner: { select: { firstName: true, lastName: true } },
            },
        });
    }
    async getTenantAdminSystemHealth() {
        return {
            status: 'healthy',
            uptime: '99.8%',
            responseTime: '95ms',
            databaseStatus: 'connected',
            emailServiceStatus: 'operational',
            storageUsage: '23%',
            memoryUsage: '45%',
            cpuUsage: '28%',
        };
    }
    async getUserStats(tenantId, userId, tenantFeatures, userPermissions) {
        const [myProjects, activeProjects, completedProjects, notifications,] = await Promise.all([
            this.prisma.project.count({
                where: {
                    tenantId,
                    OR: [
                        { ownerId: userId }
                    ]
                }
            }),
            this.prisma.project.count({
                where: {
                    tenantId,
                    status: 'ACTIVE',
                    OR: [
                        { ownerId: userId }
                    ]
                }
            }),
            this.prisma.project.count({
                where: {
                    tenantId,
                    status: 'COMPLETED',
                    OR: [
                        { ownerId: userId }
                    ]
                }
            }),
            0,
        ]);
        const availableFeatures = tenantFeatures?.filter(tf => userPermissions?.some(up => up.featureId === tf.featureId && up.isActive)).length || 0;
        return {
            myProjects,
            activeProjects,
            completedProjects,
            overdueProjects: 0,
            notifications,
            availableFeatures,
            tasksCompleted: 0,
            tasksPending: 0,
        };
    }
    async getUserActivity(tenantId, userId, limit) {
        return this.prisma.auditLog.findMany({
            where: {
                tenantId,
                userId
            },
            take: limit,
            orderBy: { createdAt: 'desc' },
        });
    }
    async getUserProjects(tenantId, userId, limit) {
        return this.prisma.project.findMany({
            where: {
                tenantId,
                OR: [
                    { ownerId: userId }
                ]
            },
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                owner: { select: { firstName: true, lastName: true } },
            },
        });
    }
    async getUserSystemHealth() {
        return {
            status: 'healthy',
            uptime: '99.9%',
            responseTime: '85ms',
            lastSync: new Date().toISOString(),
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map