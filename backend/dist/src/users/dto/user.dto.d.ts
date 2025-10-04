import { UserRole, UserStatus, UserType } from '@prisma/client';
export declare class CreateUserDto {
    email: string;
    firstName: string;
    lastName: string;
    password?: string;
    role: UserRole;
    status?: UserStatus;
    type?: UserType;
    tenantId: string;
    departmentId?: string;
    position?: string;
    phone?: string;
    isActive?: boolean;
}
export declare class UpdateUserDto {
    email?: string;
    firstName?: string;
    lastName?: string;
    password?: string;
    role?: UserRole;
    status?: UserStatus;
    type?: UserType;
    departmentId?: string;
    position?: string;
    phone?: string;
    isActive?: boolean;
}
export declare class UserResponseDto {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    name: string;
    role: UserRole;
    status: UserStatus;
    type: UserType;
    tenantId: string;
    departmentId?: string;
    position?: string;
    phone?: string;
    isActive: boolean;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
    lastLoginAt?: Date;
    tenant?: any;
    department?: any;
}
