/**
 * File: current-user.decorator.ts
 * Purpose: Current user decorator for the BlickTrack backend API. Creates a parameter decorator to extract the current authenticated user from the request context. Provides easy access to user information in controllers and services.
 * 
 * Key Functions / Components / Classes:
 *   - CurrentUser: Parameter decorator for user extraction
 *   - User context: Extracts user from request object
 *   - Property access: Supports accessing specific user properties
 *   - Request handling: Integrates with NestJS execution context
 *
 * Inputs:
 *   - HTTP requests with user context
 *   - Property names for specific user data
 *   - Execution context from NestJS
 *
 * Outputs:
 *   - Current authenticated user object
 *   - Specific user properties when requested
 *   - User context for controllers
 *   - Authentication data access
 *
 * Dependencies:
 *   - NestJS parameter decorator system
 *   - Execution context for request access
 *   - User object from authentication
 *
 * Notes:
 *   - Implements clean user context access
 *   - Supports property-specific extraction
 *   - Integrates with authentication system
 *   - Provides type-safe user access
 *   - Simplifies controller parameter handling
 */

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);