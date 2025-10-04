import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getStats(): Promise<import("./dashboard.service").DashboardStats>;
    getActivity(limit?: string): Promise<import("./dashboard.service").RecentActivity[]>;
    getProjects(limit?: string): Promise<{
        id: string;
        name: string;
        status: string;
        progress: number;
        teamSize: number;
    }[]>;
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
}
