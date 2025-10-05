/**
 * File: prisma.module.ts
 * Purpose: Prisma database module for the BlickTrack backend API. Provides global database service access across the entire application. Configures PrismaService as a global provider for database operations.
 * 
 * Key Functions / Components / Classes:
 *   - PrismaModule: Database module class
 *   - Global provider: Makes PrismaService available globally
 *   - Service export: Exports PrismaService for dependency injection
 *   - Database configuration: Sets up database service
 *
 * Inputs:
 *   - PrismaService configuration
 *   - Database connection settings
 *
 * Outputs:
 *   - Global PrismaService provider
 *   - Database service exports
 *   - Module configuration for dependency injection
 *
 * Dependencies:
 *   - PrismaService for database operations
 *   - NestJS Module decorators
 *
 * Notes:
 *   - Implements global module pattern for database access
 *   - Provides centralized database service management
 *   - Enables dependency injection across all modules
 *   - Supports type-safe database operations
 *   - Handles database connection lifecycle
 */

import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}