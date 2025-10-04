/**
 * File: auth.dto.ts
 * Purpose: Data Transfer Objects (DTOs) for authentication operations in the BlickTrack backend API. Defines request and response schemas for user registration, login, password management, and authentication operations. Ensures data validation and type safety.
 * 
 * Key Functions / Components / Classes:
 *   - RegisterDto: User registration request validation
 *   - LoginDto: User login request validation
 *   - ForgotPasswordDto: Password reset request validation
 *   - ResetPasswordDto: Password reset with token validation
 *   - ChangePasswordDto: Authenticated password change validation
 *   - VerifyEmailDto: Email verification token validation
 *   - Validation decorators: Input validation and sanitization
 *
 * Inputs:
 *   - User registration data (email, password, name)
 *   - Login credentials (email, password)
 *   - Password reset requests and tokens
 *   - Email verification tokens
 *   - Password change requests
 *
 * Outputs:
 *   - Validated and sanitized request data
 *   - Swagger API documentation schemas
 *   - Type-safe data structures
 *   - Validation error messages
 *
 * Dependencies:
 *   - class-validator for input validation
 *   - Swagger decorators for API documentation
 *   - NestJS validation pipes
 *
 * Notes:
 *   - Implements comprehensive input validation
 *   - Includes Swagger documentation for all DTOs
 *   - Enforces password strength requirements
 *   - Provides clear validation error messages
 *   - Supports enterprise security standards
 */

import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'john.doe@company.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'SecurePassword123!' })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @ApiProperty({ example: 'John Doe', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'company-slug', required: false })
  @IsOptional()
  @IsString()
  tenantSlug?: string;
}

export class LoginDto {
  @ApiProperty({ example: 'john.doe@company.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'SecurePassword123!' })
  @IsString()
  password: string;
}

export class ForgotPasswordDto {
  @ApiProperty({ example: 'john.doe@company.com' })
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty({ example: 'reset-token-here' })
  @IsString()
  token: string;

  @ApiProperty({ example: 'NewSecurePassword123!' })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  newPassword: string;
}

export class ChangePasswordDto {
  @ApiProperty({ example: 'CurrentPassword123!' })
  @IsString()
  currentPassword: string;

  @ApiProperty({ example: 'NewSecurePassword123!' })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  newPassword: string;
}

export class VerifyEmailDto {
  @ApiProperty({ example: 'verification-token-here' })
  @IsString()
  token: string;
}

/**
 * DTO for refreshing access tokens using a valid refresh token
 * Used in /auth/refresh endpoint for token rotation
 */
export class RefreshTokenDto {
  @ApiProperty({ 
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Valid refresh token obtained from login' 
  })
  @IsString()
  refresh_token: string;
}

/**
 * DTO for resending email verification
 * Used when verification email expires or user didn't receive it
 */
export class ResendVerificationDto {
  @ApiProperty({ 
    example: 'user@example.com',
    description: 'Email address to resend verification to'
  })
  @IsEmail()
  email: string;
}