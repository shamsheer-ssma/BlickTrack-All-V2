import { PrismaService } from '../prisma/prisma.service';
export declare class HealthController {
    private prisma;
    constructor(prisma: PrismaService);
    checkHealth(): Promise<{
        status: string;
        timestamp: string;
        uptime: number;
    }>;
    checkDetailedHealth(): Promise<{
        status: string;
        timestamp: string;
        uptime: number;
        version: string;
        database: {
            status: string;
            responseTime: string;
            error?: undefined;
        };
        memory: {
            used: number;
            total: number;
        };
    } | {
        status: string;
        timestamp: string;
        database: {
            status: string;
            error: string;
            responseTime?: undefined;
        };
        uptime?: undefined;
        version?: undefined;
        memory?: undefined;
    }>;
}
