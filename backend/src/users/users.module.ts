/**
 * File: users.module.ts
 * Purpose: Users module for the BlickTrack backend API. Configures comprehensive user management functionality including internal employees, external collaborators, and user permissions. Provides centralized user management for the enterprise platform.
 * 
 * Key Functions / Components / Classes:
 *   - UsersModule: Main users module class
 *   - UsersController: User management endpoints
 *   - UsersService: User operations and business logic
 *   - UserPermissionsService: Permission management
 *   - ExternalCollaboratorService: External user management
 *   - PrismaModule: Database access for user operations
 *
 * Inputs:
 *   - User management requests
 *   - Permission assignment requests
 *   - External collaborator data
 *   - User lifecycle operations
 *
 * Outputs:
 *   - User management functionality
 *   - Permission management services
 *   - External collaborator management
 *   - User data and profile services
 *
 * Dependencies:
 *   - UsersController for endpoints
 *   - UsersService for business logic
 *   - UserPermissionsService for permissions
 *   - ExternalCollaboratorService for external users
 *   - PrismaModule for database access
 *
 * Notes:
 *   - Implements comprehensive user management
 *   - Supports multiple user types and roles
 *   - Includes external collaborator functionality
 *   - Provides permission management
 *   - Handles enterprise user requirements
 */

import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserPermissionsService } from './user-permissions.service';
import { ExternalCollaboratorService } from './external-collaborator.service';
import { PrismaModule } from '../prisma/prisma.module';

/**
 * Users Module
 * 
 * Comprehensive user management supporting:
 * - Internal employees (developers, QA, managers, etc.)
 * - External collaborators (contractors, partners)
 * - Consultants and auditors
 * - Role-based and permission-based access control
 * - User lifecycle management
 */
@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    UserPermissionsService,
    ExternalCollaboratorService,
  ],
  exports: [
    UsersService,
    UserPermissionsService,
    ExternalCollaboratorService,
  ],
})
export class UsersModule {}