# BlickTrack Backend - Complete File Headers Documentation

## Overview
This document provides a comprehensive overview of all file headers in the BlickTrack Backend API, explaining the purpose, functions, inputs, outputs, and dependencies of each file. This serves as a complete reference for understanding the codebase structure and functionality.

## Table of Contents
1. [Core Application Files](#core-application-files)
2. [Authentication Files](#authentication-files)
3. [Tenant Management Files](#tenant-management-files)
4. [User Management Files](#user-management-files)
5. [Admin Files](#admin-files)
6. [Dashboard Files](#dashboard-files)
7. [Health Monitoring Files](#health-monitoring-files)
8. [Common Services Files](#common-services-files)
9. [Database Files](#database-files)
10. [Configuration Files](#configuration-files)

---

## Core Application Files

### main.ts
**Purpose**: Application bootstrap file for the BlickTrack backend API. Initializes the NestJS application with security middleware, CORS configuration, global validation, Swagger documentation, and starts the server. This is the entry point for the entire backend application.

**Key Functions**:
- `bootstrap()`: Main application initialization function
- Security configuration: Helmet middleware for security headers
- CORS setup: Cross-origin resource sharing configuration
- Global validation: Input validation and transformation
- Swagger documentation: API documentation setup
- Server startup: Application server initialization

**When Called**: Application startup, server initialization

### app.module.ts
**Purpose**: Root application module for the BlickTrack backend API. Configures all core modules, services, and middleware for the enterprise cybersecurity platform. Sets up global configuration, rate limiting, and module dependencies.

**Key Functions**:
- `AppModule`: Main application module class
- `ConfigModule`: Global configuration management
- `ThrottlerModule`: Rate limiting and request throttling
- `PrismaModule`: Database ORM and connection management
- `AuthModule`: Authentication and authorization
- `AdminModule`: Administrative functionality
- `HealthModule`: System health monitoring

**When Called**: Module initialization, dependency injection

### app.controller.ts
**Purpose**: Main application controller for the BlickTrack backend API. Provides system health checks, API information, and basic system endpoints. Handles core application status and information requests.

**Key Functions**:
- `AppController`: Main application controller class
- `getHealth()`: System health check endpoint
- `getInfo()`: API information and version endpoint
- Health monitoring: System status verification
- API documentation: Swagger endpoint documentation

**When Called**: Health check requests, API information requests

### app.service.ts
**Purpose**: Main application service for the BlickTrack backend API. Provides system health status, API information, and core application data. Handles system monitoring and API metadata generation.

**Key Functions**:
- `AppService`: Main application service class
- `getHealthStatus()`: Returns system health and status information
- `getApiInfo()`: Returns API information and feature list
- System monitoring: Tracks uptime and environment status
- API metadata: Provides version and feature information

**When Called**: Health status requests, API info requests

---

## Authentication Files

### auth.controller.ts
**Purpose**: Authentication controller for the BlickTrack backend API. Provides REST endpoints for user authentication, registration, password management, and user profile operations. Handles HTTP requests and responses for all authentication-related functionality.

**Key Functions**:
- `AuthController`: Main authentication controller class
- `register()`: User registration endpoint
- `login()`: User authentication endpoint
- `logout()`: User logout and token invalidation
- `forgotPassword()`: Password reset request endpoint
- `resetPassword()`: Password reset with token endpoint
- `changePassword()`: Authenticated password change endpoint
- `verifyEmail()`: Email verification endpoint
- `getProfile()`: User profile retrieval endpoint

**When Called**: User registration, login, password management, profile operations

### auth.service.ts
**Purpose**: Authentication service for the BlickTrack backend API. Handles user registration, login, password management, JWT token generation, and user authentication. Provides comprehensive authentication and authorization functionality for the enterprise platform.

**Key Functions**:
- `AuthService`: Main authentication service class
- `register()`: User registration with validation and hashing
- `login()`: User authentication and JWT token generation
- `validateUser()`: User credential validation
- `generateTokens()`: JWT token generation and refresh
- `forgotPassword()`: Password reset request handling
- `resetPassword()`: Password reset with token validation
- `changePassword()`: Authenticated password change
- `verifyEmail()`: Email verification handling

**When Called**: Authentication operations, user management, token generation

### jwt.strategy.ts
**Purpose**: JWT authentication strategy for the BlickTrack backend API. Validates JWT tokens and extracts user information for authentication. Implements Passport JWT strategy for secure token validation.

**Key Functions**:
- `JwtStrategy`: JWT authentication strategy class
- `validate()`: Validates JWT token and returns user payload
- Token validation: Verifies token signature and expiration
- User extraction: Extracts user information from token

**When Called**: Every authenticated request, JWT token validation

### local.strategy.ts
**Purpose**: Local authentication strategy for the BlickTrack backend API. Handles username/password authentication using Passport local strategy. Validates user credentials during login.

**Key Functions**:
- `LocalStrategy`: Local authentication strategy class
- `validate()`: Validates username and password credentials
- Credential verification: Checks user credentials against database
- User authentication: Returns authenticated user data

**When Called**: User login requests, credential validation

---

## Tenant Management Files

### tenants.controller.ts
**Purpose**: REST API endpoints for tenant configuration and feature flag management. Provides comprehensive tenant CRUD operations, feature management, and tenant statistics. Handles all tenant-related HTTP requests.

**Key Functions**:
- `TenantsController`: Controller for tenant API endpoints
- `createTenant()`: Create new tenant endpoint
- `getTenants()`: Get all tenants with filtering and pagination
- `getTenantById()`: Get tenant by ID endpoint
- `updateTenant()`: Update tenant information endpoint
- `deleteTenant()`: Soft delete tenant endpoint
- `getTenantStats()`: Get tenant statistics endpoint
- `getTenantFeatures()`: Get tenant feature flags
- `updateTenantFeatures()`: Update tenant features
- `getTenantFeaturesBySlug()`: Get features by tenant slug

**When Called**: Tenant management requests, feature configuration, tenant statistics

### tenants.service.ts
**Purpose**: Comprehensive tenant management service for the BlickTrack backend API. Handles all tenant-related business logic including CRUD operations, feature flag management, tenant statistics, and multi-tenant data isolation. Provides enterprise-grade tenant management functionality.

**Key Functions**:
- `TenantsService`: Main tenant management service class
- `createTenant()`: Create new tenant with validation and defaults
- `getTenants()`: Retrieve paginated list of tenants with filtering
- `getTenantById()`: Get detailed tenant information by ID
- `getTenantBySlug()`: Get tenant information by slug
- `updateTenant()`: Update tenant information and configuration
- `deleteTenant()`: Soft delete tenant and associated data
- `getTenantStats()`: Retrieve tenant usage statistics and metrics
- `getTenantFeatures()`: Get tenant-specific feature flags
- `updateTenantFeatures()`: Update tenant feature configuration
- `mapTenantToResponseDto()`: Convert Prisma model to response DTO

**When Called**: Tenant business logic operations, data processing, validation

### tenant-configuration.controller.ts
**Purpose**: REST API endpoints for managing tenant-specific configurations. Provides industry-specific settings, terminology customization, UI/UX configuration, and SSO setup. Handles tenant configuration HTTP requests.

**Key Functions**:
- `TenantConfigurationController`: Controller for tenant configuration endpoints
- `getTenantConfiguration()`: Get tenant configuration by tenant ID
- `updateTenantConfiguration()`: Update tenant configuration settings

**When Called**: Tenant configuration requests, settings management

### tenant-configuration.service.ts
**Purpose**: Comprehensive tenant configuration management service for the BlickTrack backend API. Handles all tenant-specific configuration including industry settings, terminology customization, UI/UX configuration, SSO setup, security policies, and compliance frameworks. Provides enterprise-grade tenant customization functionality.

**Key Functions**:
- `TenantConfigurationService`: Main tenant configuration service class
- `getTenantConfiguration()`: Retrieve tenant configuration with defaults
- `updateTenantConfiguration()`: Update tenant-specific settings
- `createTenantConfiguration()`: Create new tenant configuration
- `mapConfigToResponseDto()`: Convert Prisma model to response DTO
- Industry customization: Industry-specific terminology and settings
- SSO configuration: Single sign-on setup and management
- Security policies: Tenant-specific security configurations
- UI/UX customization: Theme, colors, and branding settings

**When Called**: Tenant configuration business logic, settings processing

---

## User Management Files

### users.controller.ts
**Purpose**: Users controller for the BlickTrack backend API. Provides REST endpoints for comprehensive user management including internal employees, external collaborators, and user permissions. Handles all user-related operations with role-based access control.

**Key Functions**:
- `UsersController`: Main users controller class
- `create()`: User creation endpoint
- `findAll()`: User listing with pagination endpoint
- `findOne()`: Single user retrieval endpoint
- `update()`: User update endpoint
- `remove()`: User deletion endpoint
- `updatePassword()`: Password change endpoint
- `activateUser()`: User activation endpoint
- `deactivateUser()`: User deactivation endpoint

**When Called**: User management requests, user operations, profile updates

### users.service.ts
**Purpose**: Users service for the BlickTrack backend API. Handles user management operations including creation, updates, deletion, and user data retrieval. Provides comprehensive user management functionality for the enterprise platform.

**Key Functions**:
- `UsersService`: Main users service class
- `create()`: User creation with password hashing
- `findAll()`: User listing with pagination and filtering
- `findOne()`: Single user retrieval by ID
- `update()`: User data updates and modifications
- `remove()`: User deletion and deactivation
- `findByEmail()`: User lookup by email address
- `updatePassword()`: Password change functionality
- `activateUser()`: User account activation
- `deactivateUser()`: User account deactivation

**When Called**: User business logic operations, data processing, validation

### user-permissions.service.ts
**Purpose**: User permissions service for the BlickTrack backend API. Handles role-based access control, permission management, and user authorization. Provides comprehensive permission management functionality.

**Key Functions**:
- `UserPermissionsService`: Main permissions service class
- Permission management: Role and permission assignment
- Access control: Permission validation and checking
- Authorization: User authorization logic

**When Called**: Permission checks, access control, authorization

### external-collaborator.service.ts
**Purpose**: External collaborator service for the BlickTrack backend API. Handles management of external users, guest access, and collaboration features. Provides external user management functionality.

**Key Functions**:
- `ExternalCollaboratorService`: Main external collaborator service class
- External user management: Guest user creation and management
- Collaboration features: External user permissions and access
- Guest access: Temporary access management

**When Called**: External user management, guest access, collaboration

---

## Admin Files

### platform-admin.controller.ts
**Purpose**: Platform admin controller for the BlickTrack backend API. Provides SaaS provider administration endpoints for managing all tenants, system-wide monitoring, global user management, and platform configuration. Handles cross-tenant operations and system administration.

**Key Functions**:
- `PlatformAdminController`: Platform administration controller class
- Tenant management: CRUD operations for all tenants
- System monitoring: Platform-wide health and status checks
- Global user management: Cross-tenant user operations
- Billing management: Subscription and billing operations
- Platform configuration: System-wide configuration management

**When Called**: Platform administration requests, cross-tenant operations, system monitoring

### platform-admin.service.ts
**Purpose**: Platform admin service for the BlickTrack backend API. Implements business logic for SaaS platform administration including cross-tenant operations, system-wide monitoring, global user management, and platform health metrics. Handles all platform-level administrative functionality.

**Key Functions**:
- `PlatformAdminService`: Platform administration service class
- `getAllTenants()`: Cross-tenant tenant listing and management
- `getTenantById()`: Individual tenant retrieval and details
- `createTenant()`: New tenant creation and setup
- `updateTenant()`: Tenant configuration updates
- `suspendTenant()`: Tenant suspension and deactivation
- `deleteTenant()`: Tenant deletion and cleanup
- `getSystemMetrics()`: Platform-wide performance metrics
- `getGlobalUsers()`: Cross-tenant user management
- `getPlatformHealth()`: System health and status monitoring

**When Called**: Platform administration business logic, cross-tenant operations

### tenant-admin.controller.ts
**Purpose**: Tenant admin controller for the BlickTrack backend API. Provides customer-specific administration endpoints for managing users within their tenant, tenant configuration, internal dashboards, and tenant-scoped security policies. Handles tenant-level administrative operations.

**Key Functions**:
- `TenantAdminController`: Tenant administration controller class
- User management: Tenant-scoped user operations
- Tenant configuration: Tenant-specific settings management
- Department management: Team and department operations
- Security policies: Tenant-scoped security configuration
- Analytics: Internal dashboards and reporting

**When Called**: Tenant administration requests, internal user management

### tenant-admin.service.ts
**Purpose**: Tenant admin service for the BlickTrack backend API. Implements business logic for tenant-level administration including user management, configuration, and tenant-scoped operations. Handles customer administrative functionality.

**Key Functions**:
- `TenantAdminService`: Tenant administration service class
- Tenant user management: User operations within tenant scope
- Tenant configuration: Tenant-specific settings management
- Department management: Team and department operations
- Security policies: Tenant-scoped security configuration

**When Called**: Tenant administration business logic, internal operations

---

## Dashboard Files

### dashboard.controller.ts
**Purpose**: Dashboard controller for the BlickTrack backend API. Provides endpoints for fetching dashboard statistics, recent activities, and system health information. Serves data for the enterprise cybersecurity platform dashboard.

**Key Functions**:
- `DashboardController`: Main dashboard controller class
- `getStats()`: Retrieves dashboard statistics
- `getActivity()`: Retrieves recent activity feed
- `getProjects()`: Retrieves top projects data
- `getSystemHealth()`: Retrieves system health information
- Data aggregation: Combines data from multiple sources
- Performance optimization: Efficient data retrieval

**When Called**: Dashboard data requests, statistics queries, activity feeds

### dashboard.service.ts
**Purpose**: Dashboard service for the BlickTrack backend API. Implements business logic for dashboard data aggregation, statistics calculation, and system health monitoring. Provides comprehensive dashboard functionality for the enterprise cybersecurity platform.

**Key Functions**:
- `DashboardService`: Main dashboard service class
- `getDashboardStats()`: Aggregates dashboard statistics
- `getRecentActivity()`: Retrieves recent activity feed
- `getTopProjects()`: Gets top projects with progress data
- `getSystemHealth()`: Monitors system health and uptime
- Data aggregation: Combines data from multiple sources
- Performance monitoring: Tracks system metrics

**When Called**: Dashboard business logic, data aggregation, statistics calculation

---

## Health Monitoring Files

### health.controller.ts
**Purpose**: Health check controller for the BlickTrack backend API. Provides system health monitoring endpoints for API status, database connectivity, and system metrics. Implements both public and authenticated health checks for monitoring and debugging.

**Key Functions**:
- `HealthController`: Health monitoring controller class
- `checkHealth()`: Public health check endpoint
- `checkDetailedHealth()`: Authenticated detailed health check
- Database monitoring: Database connection status checking
- System metrics: Memory usage and performance monitoring

**When Called**: Health check requests, system monitoring, status verification

### health.module.ts
**Purpose**: Health module for the BlickTrack backend API. Configures health monitoring services and dependencies. Provides health check functionality for system monitoring.

**Key Functions**:
- `HealthModule`: Health monitoring module class
- Health service configuration: Sets up health monitoring services
- Dependency injection: Provides health-related services

**When Called**: Module initialization, health service setup

---

## Common Services Files

### logger.service.ts
**Purpose**: Configurable logger service for the BlickTrack backend API. Provides debug logging capabilities that can be enabled/disabled via environment configuration. Supports different log levels and contextual logging for better debugging and production monitoring.

**Key Functions**:
- `LoggerService`: Main logging service class
- `debug()`: Log debug messages (can be disabled via config)
- `info()`: Log informational messages
- `warn()`: Log warning messages
- `error()`: Log error messages with stack traces
- `setContext()`: Set logging context for better traceability

**When Called**: Throughout the application for logging, debugging, monitoring

### email.service.ts
**Purpose**: Reusable email service for the BlickTrack backend API. Provides secure, multi-tenant aware email sending capabilities with template support, retry logic, and comprehensive logging. Uses latest nodemailer library.

**Key Functions**:
- `EmailService`: Main email service class
- `sendEmail()`: Send raw email with retry logic
- `sendVerificationEmail()`: Send email verification link
- `sendPasswordResetEmail()`: Send password reset link
- `sendWelcomeEmail()`: Send welcome email to new users
- `sendSecurityAlertEmail()`: Send security notifications
- `createTransporter()`: Create SMTP transport with security

**When Called**: Email sending operations, user notifications, system alerts

### rbac.service.ts
**Purpose**: Role-based access control service for the BlickTrack backend API. Handles user roles, permissions, and authorization logic. Provides comprehensive RBAC functionality for enterprise security.

**Key Functions**:
- `RbacService`: Main RBAC service class
- Role management: User role assignment and validation
- Permission checking: Permission validation and access control
- Authorization: User authorization logic

**When Called**: Permission checks, access control, authorization

---

## Database Files

### prisma.service.ts
**Purpose**: Prisma database service for the BlickTrack backend API. Manages database connections, provides ORM functionality, and handles database lifecycle events. Extends PrismaClient with NestJS integration.

**Key Functions**:
- `PrismaService`: Main database service class
- `onModuleInit()`: Establishes database connection on module initialization
- `onModuleDestroy()`: Closes database connection on module destruction
- Database connection management: Handles connection lifecycle
- ORM operations: Provides type-safe database operations

**When Called**: Database operations, connection management, data persistence

### prisma.module.ts
**Purpose**: Prisma module for the BlickTrack backend API. Configures Prisma database service and provides it to other modules. Handles database service dependency injection.

**Key Functions**:
- `PrismaModule`: Database module class
- Service configuration: Sets up Prisma service
- Dependency injection: Provides database service to other modules

**When Called**: Module initialization, service configuration

---

## Configuration Files

### app-config.service.ts
**Purpose**: Application configuration service for the BlickTrack backend API. Manages environment variables, application settings, and configuration validation. Provides centralized configuration management.

**Key Functions**:
- `AppConfigService`: Main configuration service class
- Environment management: Handles environment variables
- Configuration validation: Validates application settings
- Settings management: Centralized configuration access

**When Called**: Configuration access, environment variable retrieval

---

## File Usage Patterns

### When Files Are Called

1. **Application Startup**:
   - `main.ts` → `app.module.ts` → All modules initialize

2. **HTTP Request Processing**:
   - Request → Controller → Service → Database (Prisma)

3. **Authentication Flow**:
   - `auth.controller.ts` → `auth.service.ts` → `jwt.strategy.ts`/`local.strategy.ts`

4. **Tenant Operations**:
   - `tenants.controller.ts` → `tenants.service.ts` → `prisma.service.ts`

5. **User Management**:
   - `users.controller.ts` → `users.service.ts` → `prisma.service.ts`

6. **Admin Operations**:
   - `platform-admin.controller.ts` → `platform-admin.service.ts`
   - `tenant-admin.controller.ts` → `tenant-admin.service.ts`

7. **Dashboard Data**:
   - `dashboard.controller.ts` → `dashboard.service.ts` → `prisma.service.ts`

8. **Health Monitoring**:
   - `health.controller.ts` → `prisma.service.ts`

9. **Logging**:
   - All services → `logger.service.ts`

10. **Email Operations**:
    - `auth.service.ts` → `email.service.ts`

---

## Security and Access Control

### Authentication Flow
1. User submits credentials → `auth.controller.ts`
2. `auth.service.ts` validates credentials
3. JWT tokens generated and returned
4. Subsequent requests use JWT strategy

### Authorization Flow
1. Request with JWT → `jwt.strategy.ts`
2. Token validated → User extracted
3. `rbac.service.ts` checks permissions
4. Access granted or denied

### Multi-Tenant Isolation
1. Tenant context extracted from request
2. All database queries filtered by tenant
3. Cross-tenant access prevented
4. Tenant-specific configurations applied

---

This comprehensive documentation provides a complete understanding of all file headers, their purposes, functions, and when they are called in the BlickTrack Backend API system.
