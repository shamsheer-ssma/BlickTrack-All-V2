/**
 * File: auth.module.ts
 * Purpose: Authentication module for the BlickTrack backend API. Configures JWT authentication, passport strategies, guards, and authentication services. Handles user authentication, authorization, and security for the enterprise platform.
 * 
 * Key Functions / Components / Classes:
 *   - AuthModule: Authentication module class
 *   - JWT configuration: JWT token generation and validation
 *   - Passport integration: Authentication strategy setup
 *   - Guard configuration: Authentication and authorization guards
 *   - Service providers: Authentication and authorization services
 *
 * Inputs:
 *   - JWT secret and expiration configuration
 *   - Passport strategy configuration
 *   - User authentication credentials
 *   - Authorization requests
 *
 * Outputs:
 *   - JWT tokens for authenticated users
 *   - Authentication status and user data
 *   - Authorization decisions and permissions
 *   - Protected route access control
 *
 * Dependencies:
 *   - JWT module for token management
 *   - Passport module for authentication strategies
 *   - ConfigService for environment variables
 *   - Custom guards and strategies
 *
 * Notes:
 *   - Implements JWT-based authentication
 *   - Configures role-based access control
 *   - Provides comprehensive security guards
 *   - Supports token expiration and refresh
 *   - Handles enterprise-grade authentication
 */

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { HashingService } from '../common/services/hashing.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '7d',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy, JwtAuthGuard, LocalAuthGuard, RolesGuard, HashingService],
  exports: [AuthService, JwtAuthGuard, RolesGuard],
})
export class AuthModule {}