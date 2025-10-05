/**
 * File: authentication.middleware.ts
 * Purpose: Authentication middleware for the BlickTrack backend API. Validates JWT tokens, extracts user information, and enforces authentication requirements. Implements secure user context management for protected endpoints.
 *
 * Key Functions / Components / Classes:
 *   - AuthenticationMiddleware: Main authentication middleware
 *   - AuthenticatedRequest: Interface for authenticated requests
 *   - Token validation: Verifies JWT tokens
 *   - User context: Attaches user data to requests
 *   - Account security: Checks for locked accounts
 *
 * Inputs:
 *   - HTTP requests with Authorization headers
 *   - JWT tokens for validation
 *   - User data from database
 *   - Account status information
 *
 * Outputs:
 *   - Authenticated request objects
 *   - User context for controllers
 *   - Authentication errors for invalid tokens
 *   - Security enforcement for protected routes
 *
 * Dependencies:
 *   - JwtService for token validation
 *   - PrismaService for user data access
 *   - Express middleware system
 *   - User database model
 *
 * Notes:
 *   - Implements secure JWT token validation
 *   - Includes account lockout protection
 *   - Provides user context for controllers
 *   - Handles authentication errors gracefully
 *   - Supports multi-tenant user management
 */

import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
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

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedException('No valid token provided');
      }

      const token = authHeader.substring(7);
      const payload = this.jwtService.verify(token);

      // Get fresh user data
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

      // Check if account is locked
      if (user.lockedUntil && user.lockedUntil > new Date()) {
        throw new UnauthorizedException('Account is temporarily locked');
      }

      // Attach user to request
      req.user = {
        id: user.id,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId || undefined,
        isVerified: user.isVerified,
        mfaEnabled: user.mfaEnabled,
      };

      next();
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}