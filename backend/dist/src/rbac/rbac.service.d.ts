import { PrismaService } from '../prisma/prisma.service';
export declare class RbacService {
    private prisma;
    constructor(prisma: PrismaService);
    hasPermission(userId: string, resource: string, action: string): Promise<boolean>;
}
