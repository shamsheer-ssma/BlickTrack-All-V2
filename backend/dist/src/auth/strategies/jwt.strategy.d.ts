import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
export interface JwtPayload {
    sub: string;
    email: string;
    role: string;
    tenantId?: string;
    iat?: number;
    exp?: number;
}
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    private prisma;
    constructor(configService: ConfigService, prisma: PrismaService);
    validate(payload: JwtPayload): Promise<{
        id: string;
        email: string;
        name: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        tenantId: string;
        tenant: {
            id: string;
            name: string;
            maxUsers: number | null;
            maxProjects: number | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            domain: string | null;
            status: import("@prisma/client").$Enums.TenantStatus;
            isTrial: boolean;
            trialExpiresAt: Date | null;
            mfaRequired: boolean;
            passwordPolicy: import("@prisma/client/runtime/library").JsonValue;
            sessionTimeout: number;
            complianceFrameworks: string[];
            dataResidency: string | null;
            apiQuotaDaily: number;
            webhookUrl: string | null;
            settings: import("@prisma/client/runtime/library").JsonValue;
            deletedAt: Date | null;
            planId: string | null;
        };
        isVerified: boolean;
        mfaEnabled: boolean;
    }>;
}
export {};
