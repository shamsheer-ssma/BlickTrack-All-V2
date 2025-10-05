/**
 * File: user.dto.ts
 * Purpose: User Data Transfer Objects (DTOs) for the BlickTrack backend API. Defines request and response schemas for user management operations including creation, updates, and data validation. Provides type-safe data structures for user-related API endpoints.
 *
 * Key Functions / Components / Classes:
 *   - CreateUserDto: DTO for user creation requests
 *   - UpdateUserDto: DTO for user update requests
 *   - UserResponseDto: DTO for user response data
 *   - Validation decorators: Input validation and sanitization
 *   - API documentation: Swagger/OpenAPI schema definitions
 *
 * Inputs:
 *   - User creation and update data
 *   - Email addresses and personal information
 *   - Role and status assignments
 *   - Tenant and department associations
 *
 * Outputs:
 *   - Validated user data structures
 *   - API response schemas
 *   - Type-safe data transfer objects
 *   - Swagger documentation
 *
 * Dependencies:
 *   - class-validator for input validation
 *   - @nestjs/swagger for API documentation
 *   - @prisma/client for type definitions
 *
 * Notes:
 *   - Implements comprehensive input validation
 *   - Includes Swagger/OpenAPI documentation
 *   - Supports all user types and roles
 *   - Provides type-safe data structures
 *   - Handles optional and required fields
 */

import { IsEmail, IsString, IsOptional, IsEnum, IsBoolean, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { UserRole, UserStatus, UserType } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({ enum: UserRole })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiPropertyOptional({ enum: UserStatus })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @ApiPropertyOptional({ enum: UserType })
  @IsOptional()
  @IsEnum(UserType)
  type?: UserType;

  @ApiProperty()
  @IsString()
  tenantId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  departmentId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  position?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  password?: string;

  @ApiPropertyOptional({ enum: UserRole })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({ enum: UserStatus })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @ApiPropertyOptional({ enum: UserType })
  @IsOptional()
  @IsEnum(UserType)
  type?: UserType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  departmentId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  position?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ enum: UserRole })
  role: UserRole;

  @ApiProperty({ enum: UserStatus })
  status: UserStatus;

  @ApiProperty({ enum: UserType })
  type: UserType;

  @ApiProperty()
  tenantId: string;

  @ApiPropertyOptional()
  departmentId?: string;

  @ApiPropertyOptional()
  position?: string;

  @ApiPropertyOptional()
  phone?: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  isVerified: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiPropertyOptional()
  lastLoginAt?: Date;

  @ApiPropertyOptional()
  tenant?: any;

  @ApiPropertyOptional()
  department?: any;
}