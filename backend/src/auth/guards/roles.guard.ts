/**
 * File: roles.guard.ts
 * Purpose: Role-based access control guard for the BlickTrack backend API. Implements role-based authorization to control access to endpoints based on user roles. Ensures only users with appropriate roles can access protected resources.
 * 
 * Key Functions / Components / Classes:
 *   - RolesGuard: Role-based authorization guard class
 *   - canActivate: Role validation and access control logic
 *   - Role checking: Validates user roles against required roles
 *   - Permission enforcement: Enforces role-based access control
 *   - Access denial: Handles insufficient permissions
 *
 * Inputs:
 *   - HTTP requests with user context
 *   - Required roles from decorators
 *   - User role information
 *   - Execution context for route access
 *
 * Outputs:
 *   - Authorization decisions (allow/deny)
 *   - Access control enforcement
 *   - Permission error messages
 *   - Role-based access validation
 *
 * Dependencies:
 *   - Reflector for metadata access
 *   - UserRole enum from Prisma
 *   - NestJS guard system
 *
 * Notes:
 *   - Implements comprehensive role-based access control
 *   - Supports multiple role requirements
 *   - Provides detailed permission error messages
 *   - Integrates with NestJS decorator system
 *   - Handles enterprise authorization requirements
 */

import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    
    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    const hasRole = requiredRoles.some((role) => user.role === role);
    
    if (!hasRole) {
      throw new ForbiddenException(`Insufficient permissions. Required roles: ${requiredRoles.join(', ')}`);
    }

    return true;
  }
}