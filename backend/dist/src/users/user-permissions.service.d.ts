import { PrismaService } from '../prisma/prisma.service';
export declare class UserPermissionsService {
    private prisma;
    constructor(prisma: PrismaService);
    getUserPermissions(userId: string, tenantId?: string): Promise<any>;
    updateUserPermissions(tenantId: string, userId: string, permissionsDto: any): Promise<any>;
    private getPermissionsForRole;
    checkPermission(userId: string, permission: string): Promise<boolean>;
}
