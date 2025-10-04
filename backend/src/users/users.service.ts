/**
 * File: users.service.ts
 * Purpose: Users service for the BlickTrack backend API. Handles user management operations including creation, updates, deletion, and user data retrieval. Provides comprehensive user management functionality for the enterprise platform.
 * 
 * Key Functions / Components / Classes:
 *   - UsersService: Main users service class
 *   - create: User creation with password hashing
 *   - findAll: User listing with pagination and filtering
 *   - findOne: Single user retrieval by ID
 *   - update: User data updates and modifications
 *   - remove: User deletion and deactivation
 *   - findByEmail: User lookup by email address
 *   - updatePassword: Password change functionality
 *   - activateUser: User account activation
 *   - deactivateUser: User account deactivation
 *
 * Inputs:
 *   - User creation and update data
 *   - User IDs and email addresses
 *   - Password change requests
 *   - User activation/deactivation requests
 *   - Pagination and filtering parameters
 *
 * Outputs:
 *   - User data and profile information
 *   - User creation and update confirmations
 *   - Password change confirmations
 *   - User activation/deactivation status
 *   - Paginated user lists
 *
 * Dependencies:
 *   - PrismaService for database operations
 *   - Bcrypt for password hashing
 *   - User DTOs for data validation
 *   - Prisma user model
 *
 * Notes:
 *   - Implements secure password hashing with bcrypt
 *   - Provides comprehensive user management
 *   - Includes user activation/deactivation
 *   - Supports pagination and filtering
 *   - Handles enterprise user requirements
 */

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, UserRole, UserStatus, UserType } from '@prisma/client';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './dto/user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const { password, ...userData } = createUserDto;

    // Hash password if provided
    let hashedPassword: string | undefined;
    if (password) {
      hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS || '12', 10));
    }

    const user = await this.prisma.user.create({
      data: {
        ...userData,
        ...(hashedPassword && { passwordHash: hashedPassword }),
      },
      include: {
        tenant: true,
        department: true,
      },
    });

    return this.toUserResponse(user);
  }

  async findAll(tenantId: string): Promise<UserResponseDto[]> {
    const users = await this.prisma.user.findMany({
      where: { tenantId },
      include: {
        tenant: true,
        department: true,
        orgUnit: true,
      },
    });

    return users.map(user => this.toUserResponse(user));
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        tenant: true,
        department: true,
        orgUnit: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.toUserResponse(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        tenant: true,
        department: true,
        orgUnit: true,
      },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    const { password, ...updateData } = updateUserDto;
    let hashedPassword: string | undefined;

    if (password) {
      hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS || '12', 10));
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: {
        ...updateData,
        ...(hashedPassword && { 
          password: hashedPassword,
          passwordHash: hashedPassword 
        }),
        ...(updateData.firstName || updateData.lastName) && {
          name: `${updateData.firstName || existingUser.firstName} ${updateData.lastName || existingUser.lastName}`,
        },
      },
      include: {
        tenant: true,
        department: true,
        orgUnit: true,
      },
    });

    return this.toUserResponse(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.prisma.user.update({
      where: { id },
      data: {
        status: UserStatus.INACTIVE,
        isActive: false,
        deletedAt: new Date(),
      },
    });
  }

  async updateRole(id: string, role: UserRole): Promise<UserResponseDto> {
    const user = await this.prisma.user.update({
      where: { id },
      data: { role },
      include: {
        tenant: true,
        department: true,
        orgUnit: true,
      },
    });

    return this.toUserResponse(user);
  }

  async updateStatus(id: string, status: UserStatus): Promise<UserResponseDto> {
    const user = await this.prisma.user.update({
      where: { id },
      data: { 
        status,
        isActive: status === UserStatus.ACTIVE,
      },
      include: {
        tenant: true,
        department: true,
        orgUnit: true,
      },
    });

    return this.toUserResponse(user);
  }

  async getInternalUsers(tenantId: string, filters: any = {}) {
    const { department, role, page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;

    return this.prisma.user.findMany({
      where: {
        tenantId,
        userType: UserType.REGULAR,
        ...(department && { departmentId: department }),
        ...(role && { role }),
      },
      include: {
        tenant: true,
        department: true,
      },
      skip,
      take: limit,
    });
  }

  async createInternalUser(tenantId: string, createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.create({ ...createUserDto, tenantId });
  }

  async getDepartmentUsers(tenantId: string, departmentId: string, includeExternal = false) {
    return this.prisma.user.findMany({
      where: {
        tenantId,
        departmentId,
        ...(includeExternal ? {} : { userType: UserType.REGULAR }),
      },
      include: {
        tenant: true,
        department: true,
      },
    });
  }

  async getUsersByRole(tenantId: string, role: UserRole) {
    return this.prisma.user.findMany({
      where: {
        tenantId,
        role,
      },
      include: {
        tenant: true,
        department: true,
      },
    });
  }

  async activateUser(tenantId: string, userId: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
        tenantId,
      },
      data: {
        status: UserStatus.ACTIVE,
        isActive: true,
      },
      include: {
        tenant: true,
        department: true,
      },
    });

    return this.toUserResponse(user);
  }

  async deactivateUser(tenantId: string, userId: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
        tenantId,
      },
      data: {
        status: UserStatus.INACTIVE,
        isActive: false,
      },
      include: {
        tenant: true,
        department: true,
      },
    });

    return this.toUserResponse(user);
  }

  async getUserAnalytics(tenantId: string) {
    const totalUsers = await this.prisma.user.count({
      where: { tenantId },
    });

    const activeUsers = await this.prisma.user.count({
      where: { tenantId, status: UserStatus.ACTIVE },
    });

    const usersByRole = await this.prisma.user.groupBy({
      by: ['role'],
      where: { tenantId },
      _count: true,
    });

    const usersByType = await this.prisma.user.groupBy({
      by: ['userType'],
      where: { tenantId },
      _count: true,
    });

    return {
      totalUsers,
      activeUsers,
      inactiveUsers: totalUsers - activeUsers,
      usersByRole,
      usersByType,
    };
  }

  private toUserResponse(user: any): UserResponseDto {
    const { password, passwordHash, ...userResponse } = user;
    return userResponse;
  }
}