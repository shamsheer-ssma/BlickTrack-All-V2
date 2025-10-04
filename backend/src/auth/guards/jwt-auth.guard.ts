/**
 * File: jwt-auth.guard.ts
 * Purpose: JWT authentication guard for the BlickTrack backend API. Extends Passport AuthGuard to protect routes requiring JWT authentication. Ensures only authenticated users with valid JWT tokens can access protected endpoints.
 * 
 * Key Functions / Components / Classes:
 *   - JwtAuthGuard: JWT authentication guard class
 *   - Route protection: Protects endpoints requiring authentication
 *   - Token validation: Validates JWT tokens for access control
 *   - Authentication enforcement: Enforces user authentication
 *
 * Inputs:
 *   - HTTP requests with JWT tokens
 *   - Authorization headers with Bearer tokens
 *   - Route access attempts
 *
 * Outputs:
 *   - Authentication decisions (allow/deny)
 *   - User context for authenticated requests
 *   - Authentication errors for invalid tokens
 *   - Protected route access control
 *
 * Dependencies:
 *   - Passport AuthGuard for authentication
 *   - JWT strategy for token validation
 *   - NestJS guard system
 *
 * Notes:
 *   - Implements JWT-based route protection
 *   - Extends Passport authentication system
 *   - Provides seamless authentication integration
 *   - Supports enterprise security requirements
 *   - Handles authentication errors gracefully
 */

import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}