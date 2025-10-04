import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: string;
        tenantId?: string;
        isVerified: boolean;
        mfaEnabled: boolean;
    };
}
export declare class AuthenticationMiddleware implements NestMiddleware {
    private jwtService;
    private prisma;
    constructor(jwtService: JwtService, prisma: PrismaService);
    use(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
}
