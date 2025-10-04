/**
 * File: jwt.strategy.ts
 * Purpose: JWT authentication strategy for the BlickTrack backend API. Implements Passport JWT strategy for token validation, user authentication, and authorization. Handles JWT token extraction, validation, and user context creation.
 * 
 * Key Functions / Components / Classes:
 *   - JwtStrategy: Main JWT authentication strategy class
 *   - JwtPayload: Interface for JWT token payload structure
 *   - validate: JWT token validation and user authentication
 *   - Token extraction: Extracts JWT from Authorization header
 *   - User verification: Validates user existence and status
 *   - Account security: Checks for locked or inactive accounts
 *
 * Inputs:
 *   - JWT tokens from Authorization headers
 *   - JWT payload with user information
 *   - User ID and authentication data
 *   - Tenant and role information
 *
 * Outputs:
 *   - Authenticated user context
 *   - User profile and permission data
 *   - Authentication status and errors
 *   - Tenant and role information
 *
 * Dependencies:
 *   - Passport JWT strategy
 *   - Prisma service for database operations
 *   - ConfigService for JWT secret
 *   - User model for authentication
 *
 * Notes:
 *   - Implements secure JWT token validation
 *   - Includes account lockout protection
 *   - Validates user status and permissions
 *   - Provides comprehensive user context
 *   - Supports multi-tenant authentication
 */

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

export interface JwtPayload {
  sub: string; // User ID
  email: string;
  role: string;
  tenantId?: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'fallback-secret',
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: { 
        id: payload.sub,
        isActive: true,
      },
      include: {
        tenant: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found or inactive');
    }

    // Check if user is locked
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      throw new UnauthorizedException('Account is temporarily locked');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      tenantId: user.tenantId,
      tenant: user.tenant,
      isVerified: user.isVerified,
      mfaEnabled: user.mfaEnabled,
    };
  }
}