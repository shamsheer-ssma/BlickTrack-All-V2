import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getStats(req: any): Promise<{
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
    getActivity(req: any, limit?: string): Promise<{
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
    getProjects(req: any, limit?: string): Promise<({
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
    getSystemHealth(req: any): Promise<{
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
    getNavigation(req: any): Promise<{
        id: string;
        label: string;
        icon: string;
        path: string;
    }[]>;
    getPermissions(req: any): Promise<any>;
    getAvailableFeatures(req: any): Promise<any[]>;
    checkFeatureAccess(req: any, featureSlug: string): Promise<{
        featureSlug: string;
        canAccess: boolean;
    }>;
    getTenantFeatures(req: any): Promise<({
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
}
