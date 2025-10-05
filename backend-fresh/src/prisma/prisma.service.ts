/**
 * File: prisma.service.ts
 * Purpose: Prisma database service for the BlickTrack backend API. Manages database connections, provides ORM functionality, and handles database lifecycle events. Extends PrismaClient with NestJS integration.
 * 
 * Key Functions / Components / Classes:
 *   - PrismaService: Main database service class
 *   - onModuleInit: Establishes database connection on module initialization
 *   - onModuleDestroy: Closes database connection on module destruction
 *   - Database connection management: Handles connection lifecycle
 *   - ORM operations: Provides type-safe database operations
 *
 * Inputs:
 *   - Database connection configuration
 *   - Prisma schema definitions
 *   - Module lifecycle events
 *
 * Outputs:
 *   - Active database connections
 *   - Type-safe database operations
 *   - Connection status management
 *   - ORM query capabilities
 *
 * Dependencies:
 *   - PrismaClient for database operations
 *   - NestJS lifecycle hooks
 *   - Database connection configuration
 *
 * Notes:
 *   - Implements proper connection lifecycle management
 *   - Provides type-safe database operations
 *   - Handles connection establishment and cleanup
 *   - Extends PrismaClient with NestJS integration
 *   - Supports all database models and relationships
 */

import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}