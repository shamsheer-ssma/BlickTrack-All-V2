/**
 * File: index.ts
 * Purpose: Application constants for the BlickTrack backend API. Centralizes all application-wide constants including authentication settings, rate limiting, RBAC permissions, database configuration, file upload limits, email templates, and security settings. Provides consistent configuration across the entire application.
 * 
 * Key Functions / Components / Classes:
 *   - APP_CONSTANTS: Application name, version, and API configuration
 *   - AUTH_CONSTANTS: Authentication and security settings
 *   - RATE_LIMIT_CONSTANTS: Rate limiting configuration
 *   - RBAC_CONSTANTS: Role-based access control permissions
 *   - DB_CONSTANTS: Database connection and query settings
 *   - FILE_CONSTANTS: File upload and processing limits
 *   - EMAIL_CONSTANTS: Email configuration and templates
 *   - API_RESPONSES: Standardized API response messages
 *   - SECURITY_CONSTANTS: Security and CORS configuration
 *
 * Inputs:
 *   - Application configuration requirements
 *   - Security policy definitions
 *   - Rate limiting specifications
 *   - Permission definitions
 *
 * Outputs:
 *   - Centralized application constants
 *   - Consistent configuration values
 *   - Standardized response messages
 *   - Security policy definitions
 *
 * Dependencies:
 *   - UserRole enum from Prisma
 *   - Application requirements
 *
 * Notes:
 *   - Implements comprehensive application configuration
 *   - Centralizes all constants for maintainability
 *   - Provides consistent security settings
 *   - Includes enterprise-grade security policies
 *   - Supports multi-tenant RBAC system
 */

import { UserRole } from '@prisma/client';

// Application Constants
export const APP_CONSTANTS = {
  APP_NAME: 'BlickTrack',
  VERSION: '1.0.0',
  API_PREFIX: 'api/v1',
  SWAGGER_PATH: 'api/docs',
} as const;

// Authentication Constants
export const AUTH_CONSTANTS = {
  JWT_EXPIRY: '7d',
  BCRYPT_ROUNDS: 12,
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 30 * 60 * 1000, // 30 minutes
  PASSWORD_MIN_LENGTH: 12,
  TOKEN_EXPIRY: {
    EMAIL_VERIFICATION: 24 * 60 * 60 * 1000, // 24 hours
    PASSWORD_RESET: 60 * 60 * 1000, // 1 hour
    MFA_SETUP: 10 * 60 * 1000, // 10 minutes
  },
} as const;

// Rate Limiting Constants
export const RATE_LIMIT_CONSTANTS = {
  WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  MAX_REQUESTS: 100,
  AUTH_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  AUTH_MAX_REQUESTS: 5, // 5 login attempts per 15 minutes
} as const;

// RBAC Constants
export const RBAC_CONSTANTS = {
  ROLES: {
    PLATFORM_ADMIN: UserRole.PLATFORM_ADMIN,
    TENANT_ADMIN: UserRole.TENANT_ADMIN,
    END_USER: UserRole.END_USER,
    COLLABORATOR: UserRole.COLLABORATOR,
  },
  PERMISSIONS: {
    // Platform Admin Permissions
    MANAGE_ALL_TENANTS: 'manage:all:tenants',
    MANAGE_ALL_USERS: 'manage:all:users',
    VIEW_ALL_ANALYTICS: 'view:all:analytics',
    MANAGE_PLATFORM_SETTINGS: 'manage:platform:settings',

    // Tenant Admin Permissions
    MANAGE_TENANT: 'manage:tenant',
    MANAGE_TENANT_USERS: 'manage:tenant:users',
    VIEW_TENANT_ANALYTICS: 'view:tenant:analytics',
    CONFIGURE_SSO: 'configure:sso',

    // End User Permissions
    CREATE_SBOM: 'create:sbom',
    VIEW_SBOM: 'view:sbom',
    UPDATE_OWN_SBOM: 'update:own:sbom',
    CREATE_THREAT_MODEL: 'create:threat_model',
    VIEW_THREAT_MODEL: 'view:threat_model',
    UPDATE_OWN_THREAT_MODEL: 'update:own:threat_model',

    // Collaborator Permissions
    VIEW_SHARED_SBOM: 'view:shared:sbom',
    VIEW_SHARED_THREAT_MODEL: 'view:shared:threat_model',
    COMMENT_ON_SHARED: 'comment:shared',
  },
} as const;

// Database Constants
export const DB_CONSTANTS = {
  MAX_CONNECTIONS: 10,
  CONNECTION_TIMEOUT: 10000, // 10 seconds
  QUERY_TIMEOUT: 5000, // 5 seconds
} as const;

// File Upload Constants
export const FILE_CONSTANTS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_SBOM_FORMATS: ['application/json', 'application/xml', 'text/xml'],
  ALLOWED_EXTENSIONS: ['.json', '.xml', '.spdx', '.cdx'],
  UPLOAD_PATH: './uploads',
} as const;

// Email Constants
export const EMAIL_CONSTANTS = {
  FROM_ADDRESS: 'noreply@blicktrack.com',
  SUPPORT_ADDRESS: 'support@blicktrack.com',
  TEMPLATES: {
    WELCOME: 'welcome',
    EMAIL_VERIFICATION: 'email-verification',
    PASSWORD_RESET: 'password-reset',
    ACCOUNT_LOCKED: 'account-locked',
    MFA_SETUP: 'mfa-setup',
  },
} as const;

// API Response Constants
export const API_RESPONSES = {
  SUCCESS: {
    CREATED: 'Resource created successfully',
    UPDATED: 'Resource updated successfully',
    DELETED: 'Resource deleted successfully',
    RETRIEVED: 'Resource retrieved successfully',
  },
  AUTH: {
    LOGIN_SUCCESS: 'Login successful',
    LOGOUT_SUCCESS: 'Logout successful',
    REGISTER_SUCCESS: 'User registered successfully. Please verify your email.',
    EMAIL_VERIFIED: 'Email verified successfully',
    PASSWORD_RESET_SENT: 'Password reset link sent to your email',
    PASSWORD_CHANGED: 'Password changed successfully',
  },
  ERRORS: {
    UNAUTHORIZED: 'Authentication required',
    FORBIDDEN: 'Insufficient permissions',
    NOT_FOUND: 'Resource not found',
    INVALID_CREDENTIALS: 'Invalid email or password',
    ACCOUNT_LOCKED: 'Account temporarily locked due to multiple failed attempts',
    EMAIL_NOT_VERIFIED: 'Please verify your email address',
    WEAK_PASSWORD: 'Password does not meet security requirements',
    DUPLICATE_EMAIL: 'Email address already registered',
  },
} as const;

// Security Constants
export const SECURITY_CONSTANTS = {
  CORS_ORIGINS: ['http://localhost:3000', 'https://blicktrack.com'],
  CSRF_SECRET: 'blicktrack-csrf-secret',
  HELMET_CONFIG: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https:'],
        scriptSrc: ["'self'", "'unsafe-eval'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", 'https:'],
        fontSrc: ["'self'", 'https:', 'data:'],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
  },
} as const;