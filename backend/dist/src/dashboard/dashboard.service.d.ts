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
}
