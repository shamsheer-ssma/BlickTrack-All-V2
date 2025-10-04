import { PrismaService } from '../prisma/prisma.service';
export interface DashboardStats {
    totalProjects: number;
    activeProjects: number;
    completedProjects: number;
    overdueProjects: number;
    securityAlerts: number;
    activeUsers: number;
    reportsGenerated: number;
    systemHealth: {
        status: 'healthy' | 'warning' | 'critical';
        uptime: number;
        lastBackup?: string;
    };
}
export interface RecentActivity {
    id: string;
    type: 'project' | 'security' | 'user' | 'system';
    title: string;
    description: string;
    timestamp: string;
    severity?: 'low' | 'medium' | 'high' | 'critical';
}
export declare class DashboardService {
    private prisma;
    constructor(prisma: PrismaService);
    getDashboardStats(): Promise<DashboardStats>;
    getRecentActivity(limit?: number): Promise<RecentActivity[]>;
    getTopProjects(limit?: number): Promise<Array<{
        id: string;
        name: string;
        status: string;
        progress: number;
        teamSize: number;
    }>>;
    getSystemHealth(): Promise<{
        status: string;
        uptime: number;
        lastBackup: string;
        services: {
            database: string;
            api: string;
            authentication: string;
            fileStorage: string;
        };
    }>;
    private mapAuditEventToActivityType;
    private generateActivityTitle;
    private generateActivityDescription;
    private mapAuditEventToSeverity;
    private calculateProjectProgress;
    getRoleBasedStats(user: any): Promise<{
        totalTenants: number;
        totalUsers: number;
        activeUsers: number;
        totalProjects: number;
        activeProjects: number;
        completedProjects: number;
        overdueProjects: number;
        securityAlerts: number;
        totalFeatures: number;
        systemUptime: string;
        dataProcessed: string;
    } | {
        totalUsers: number;
        activeUsers: number;
        totalProjects: number;
        activeProjects: number;
        completedProjects: number;
        overdueProjects: number;
        securityAlerts: number;
        availableFeatures: number;
        tenantUptime: string;
        dataProcessed: string;
    } | {
        myProjects: number;
        activeProjects: number;
        completedProjects: number;
        overdueProjects: number;
        notifications: number;
        availableFeatures: number;
        tasksCompleted: number;
        tasksPending: number;
    }>;
    getRoleBasedActivity(user: any, limit: number): Promise<{
        id: string;
        createdAt: Date;
        eventType: import("@prisma/client").$Enums.AuditEventType;
        tenantId: string;
        action: string;
        resource: string | null;
        resourceId: string | null;
        userId: string | null;
        sessionId: string | null;
        ipAddress: string | null;
        userAgent: string | null;
        location: string | null;
        oldValues: import("@prisma/client/runtime/library").JsonValue | null;
        newValues: import("@prisma/client/runtime/library").JsonValue | null;
        riskLevel: import("@prisma/client").$Enums.RiskLevel;
        severity: import("@prisma/client").$Enums.AuditSeverity;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        tags: string[];
        isAnomaly: boolean;
        isReviewed: boolean;
        reviewedBy: string | null;
        reviewedAt: Date | null;
        timestamp: Date;
        method: string | null;
        endpoint: string | null;
        success: boolean;
        errorMessage: string | null;
    }[]>;
    getRoleBasedProjects(user: any, limit: number): Promise<({
        owner: {
            firstName: string;
            lastName: string;
        } | null;
    } & {
        id: string;
        name: string;
        status: import("@prisma/client").$Enums.ProjectStatus;
        complianceFrameworks: string[];
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        tenantId: string;
        riskLevel: import("@prisma/client").$Enums.RiskLevel;
        metadata: import("@prisma/client/runtime/library").JsonValue;
        tags: string[];
        departmentId: string | null;
        description: string | null;
        parentId: string | null;
        level: number;
        path: string | null;
        isRoot: boolean;
        isLeaf: boolean;
        type: import("@prisma/client").$Enums.ProjectType;
        classification: string | null;
        hierarchyType: import("@prisma/client").$Enums.ProjectHierarchyType;
        priority: import("@prisma/client").$Enums.Priority;
        ownerId: string | null;
        inheritCompliance: boolean;
        startDate: Date | null;
        endDate: Date | null;
    })[]>;
    getRoleBasedSystemHealth(user: any): Promise<{
        status: string;
        uptime: string;
        responseTime: string;
        databaseStatus: string;
        emailServiceStatus: string;
        storageUsage: string;
        memoryUsage: string;
        cpuUsage: string;
    } | {
        status: string;
        uptime: string;
        responseTime: string;
        lastSync: string;
    }>;
    getRoleBasedNavigation(user: any): Promise<{
        id: string;
        label: string;
        icon: string;
        path: string;
    }[]>;
    getUserPermissions(userId: string): Promise<any>;
    getTenantFeatures(tenantId: string): Promise<({
        feature: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            defaultEnabled: boolean;
            description: string | null;
            type: import("@prisma/client").$Enums.FeatureType;
            key: string;
            category: import("@prisma/client").$Enums.FeatureCategory;
            defaultConfig: import("@prisma/client/runtime/library").JsonValue;
        };
    } & {
        id: string;
        planId: string;
        featureId: string;
        enabled: boolean;
        config: import("@prisma/client/runtime/library").JsonValue;
        limits: import("@prisma/client/runtime/library").JsonValue | null;
        maxUsers: number | null;
        currentUsers: number;
    })[]>;
    canAccessFeature(user: any, featureSlug: string): Promise<boolean>;
    getAvailableFeatures(user: any): Promise<any[]>;
    private getPlatformAdminStats;
    private getPlatformAdminActivity;
    private getPlatformAdminProjects;
    private getPlatformAdminSystemHealth;
    private getTenantAdminStats;
    private getTenantAdminActivity;
    private getTenantAdminProjects;
    private getTenantAdminSystemHealth;
    getUserProfile(userId: string): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        displayName: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        tenantId: string;
        tenantName: string;
        tenantSlug: string;
    }>;
    private getUserStats;
    private getUserActivity;
    private getUserProjects;
    private getUserSystemHealth;
}
