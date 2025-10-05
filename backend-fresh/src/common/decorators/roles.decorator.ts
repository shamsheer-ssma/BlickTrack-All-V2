/**
 * File: roles.decorator.ts
 * Purpose: Roles decorator for the BlickTrack backend API. Creates a decorator to specify required user roles for endpoint access. Integrates with the roles guard to implement role-based access control.
 * 
 * Key Functions / Components / Classes:
 *   - Roles: Decorator for specifying required roles
 *   - ROLES_KEY: Metadata key for role information
 *   - Role specification: Defines access requirements
 *   - Metadata storage: Stores role requirements for guards
 *
 * Inputs:
 *   - User roles from UserRole enum
 *   - Controller method decorators
 *   - Role-based access requirements
 *
 * Outputs:
 *   - Role metadata for guards
 *   - Access control configuration
 *   - Role-based authorization setup
 *
 * Dependencies:
 *   - NestJS SetMetadata decorator
 *   - UserRole enum from Prisma
 *   - Roles guard for enforcement
 *
 * Notes:
 *   - Implements role-based access control
 *   - Supports multiple role requirements
 *   - Integrates with NestJS metadata system
 *   - Provides clean role specification syntax
 *   - Enables enterprise authorization features
 */

import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@prisma/client';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);