import { NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthenticatedRequest } from './authentication.middleware';
export declare class AuditMiddleware implements NestMiddleware {
    private prisma;
    constructor(prisma: PrismaService);
    use(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
    private shouldAudit;
    private createAuditLog;
    private getActionFromRequest;
    private getResourceFromRequest;
    private getClientIP;
}
