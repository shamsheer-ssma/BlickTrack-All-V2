import { NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { UserRole } from '@prisma/client';
import { AuthenticatedRequest } from './authentication.middleware';
export interface RBACConfig {
    roles: UserRole[];
    resource?: string;
    action?: string;
    requireOwnership?: boolean;
    requireTenantMatch?: boolean;
}
export declare class RBACMiddleware implements NestMiddleware {
    rbacConfig: RBACConfig;
    constructor(config: RBACConfig);
    use(req: AuthenticatedRequest, res: Response, next: NextFunction): void;
}
export declare function createRBACMiddleware(config: RBACConfig): {
    new (): {
        rbacConfig: RBACConfig;
        use(req: AuthenticatedRequest, res: Response, next: NextFunction): void;
    };
};
export declare class PlatformAdminOnly extends RBACMiddleware {
    constructor();
}
export declare class TenantAdminOrAbove extends RBACMiddleware {
    constructor();
}
export declare class AuthenticatedUsers extends RBACMiddleware {
    constructor();
}
export declare class TenantUsers extends RBACMiddleware {
    constructor();
}
