# BlickTrack Backend - Complete Code Flow Diagrams

## Overview
This document provides comprehensive flow diagrams showing when each page, code, and function is hit in the BlickTrack Backend API. It includes detailed call flows, request/response patterns, and system interactions.

## Table of Contents
1. [Main Application Flow](#main-application-flow)
2. [Authentication Flow](#authentication-flow)
3. [Tenant Management Flow](#tenant-management-flow)
4. [User Management Flow](#user-management-flow)
5. [Dashboard Flow](#dashboard-flow)
6. [Admin Operations Flow](#admin-operations-flow)
7. [API Request Flow](#api-request-flow)
8. [Error Handling Flow](#error-handling-flow)

---

## Main Application Flow

### Application Startup Sequence
```mermaid
graph TD
    A[main.ts - Application Bootstrap] --> B[AppModule Configuration]
    B --> C[ConfigModule - Environment Variables]
    C --> D[ThrottlerModule - Rate Limiting]
    D --> E[PrismaModule - Database Connection]
    E --> F[AuthModule - Authentication Setup]
    F --> G[AdminModule - Admin Functions]
    G --> H[DashboardModule - Dashboard APIs]
    H --> I[HealthModule - Health Checks]
    I --> J[Security Middleware - Helmet]
    J --> K[CORS Configuration]
    K --> L[Global Validation Pipe]
    L --> M[Swagger Documentation Setup]
    M --> N[Server Startup on Port 3001]
    N --> O[API Ready - /api/docs available]
```

### Request Processing Flow
```mermaid
graph TD
    A[HTTP Request] --> B[Rate Limiting Check]
    B --> C{CORS Validation}
    C -->|Pass| D[Global Validation Pipe]
    C -->|Fail| E[CORS Error Response]
    D --> F[Route Resolution]
    F --> G[Authentication Guard]
    G --> H{Valid JWT?}
    H -->|Yes| I[Role Guard Check]
    H -->|No| J[401 Unauthorized]
    I --> K{Has Required Role?}
    K -->|Yes| L[Controller Method]
    K -->|No| M[403 Forbidden]
    L --> N[Service Layer]
    N --> O[Database Operations]
    O --> P[Response Generation]
    P --> Q[JSON Response]
```

---

## Authentication Flow

### User Registration Flow
```mermaid
graph TD
    A[POST /api/v1/auth/register] --> B[AuthController.register]
    B --> C[AuthService.register]
    C --> D[Validate Input Data]
    D --> E[Check Email Uniqueness]
    E --> F{Email Exists?}
    F -->|Yes| G[409 Conflict Error]
    F -->|No| H[Hash Password with bcrypt]
    H --> I[Create User in Database]
    I --> J[Generate Email Verification Token]
    J --> K[Send Verification Email]
    K --> L[Generate JWT Tokens]
    L --> M[Return AuthResponse]
    M --> N[201 Created Response]
```

### User Login Flow
```mermaid
graph TD
    A[POST /api/v1/auth/login] --> B[AuthController.login]
    B --> C[AuthService.login]
    C --> D[Validate Credentials]
    D --> E[Check Account Status]
    E --> F{Account Active?}
    F -->|No| G[401 Unauthorized]
    F -->|Yes| H[Verify Password]
    H --> I{Password Valid?}
    I -->|No| J[Handle Failed Login]
    I -->|Yes| K[Check Account Lockout]
    K --> L{Account Locked?}
    L -->|Yes| M[423 Locked Error]
    L -->|No| N[Reset Failed Login Count]
    N --> O[Generate JWT Tokens]
    O --> P[Create Refresh Token]
    P --> Q[Return AuthResponse]
    Q --> R[200 OK Response]
```

### Password Reset Flow
```mermaid
graph TD
    A[POST /api/v1/auth/forgot-password] --> B[AuthController.forgotPassword]
    B --> C[AuthService.forgotPassword]
    C --> D[Find User by Email]
    D --> E{User Exists?}
    E -->|No| F[Return Success - Security]
    E -->|Yes| G[Generate Reset Token]
    G --> H[Store Token in Database]
    H --> I[Send Reset Email]
    I --> J[Return Success Response]
    
    K[POST /api/v1/auth/reset-password] --> L[AuthController.resetPassword]
    L --> M[AuthService.resetPassword]
    M --> N[Validate Reset Token]
    N --> O{Token Valid?}
    O -->|No| P[400 Bad Request]
    O -->|Yes| Q[Hash New Password]
    Q --> R[Update User Password]
    R --> S[Delete Reset Token]
    S --> T[Return Success Response]
```

---

## Tenant Management Flow

### Tenant Creation Flow
```mermaid
graph TD
    A[POST /api/v1/tenants] --> B[TenantsController.createTenant]
    B --> C[TenantsService.createTenant]
    C --> D[Validate Input Data]
    D --> E[Check Slug Uniqueness]
    E --> F{Slug Exists?}
    F -->|Yes| G[409 Conflict Error]
    F -->|No| H[Check Domain Uniqueness]
    H --> I{Domain Exists?}
    I -->|Yes| J[409 Conflict Error]
    I -->|No| K[Create Tenant Record]
    K --> L[Set Default Values]
    L --> M[Return TenantResponseDto]
    M --> N[201 Created Response]
```

### Tenant Configuration Flow
```mermaid
graph TD
    A[GET /api/v1/tenants/:id/configuration] --> B[TenantConfigurationController.getTenantConfiguration]
    B --> C[TenantConfigurationService.getTenantConfiguration]
    C --> D[Find Tenant by ID]
    D --> E{Tenant Exists?}
    E -->|No| F[404 Not Found]
    E -->|Yes| G[Find Configuration]
    G --> H{Config Exists?}
    H -->|No| I[Create Default Configuration]
    H -->|Yes| J[Return Configuration]
    I --> J
    J --> K[200 OK Response]
    
    L[PATCH /api/v1/tenants/:id/configuration] --> M[TenantConfigurationController.updateTenantConfiguration]
    M --> N[TenantConfigurationService.updateTenantConfiguration]
    N --> O[Validate Tenant Exists]
    O --> P[Upsert Configuration]
    P --> Q[Update Database]
    Q --> R[Return Updated Configuration]
    R --> S[200 OK Response]
```

---

## User Management Flow

### User Creation Flow
```mermaid
graph TD
    A[POST /api/v1/users] --> B[UsersController.create]
    B --> C[UsersService.create]
    C --> D[Validate Input Data]
    D --> E[Check Email Uniqueness]
    E --> F{Email Exists?}
    F -->|Yes| G[409 Conflict Error]
    F -->|No| H[Hash Password]
    H --> I[Create User Record]
    I --> J[Set Default Values]
    J --> K[Return UserResponseDto]
    K --> L[201 Created Response]
```

### User Listing Flow
```mermaid
graph TD
    A[GET /api/v1/users] --> B[UsersController.findAll]
    B --> C[UsersService.findAll]
    C --> D[Parse Query Parameters]
    D --> E[Build Prisma Query]
    E --> F[Execute Database Query]
    F --> G[Apply Pagination]
    G --> H[Format Response Data]
    H --> I[Return Paginated Results]
    I --> J[200 OK Response]
```

---

## Dashboard Flow

### Dashboard Statistics Flow
```mermaid
graph TD
    A[GET /api/v1/dashboard/stats] --> B[DashboardController.getStats]
    B --> C[DashboardService.getStats]
    C --> D[Get User Count]
    D --> E[Get Project Count]
    E --> F[Get Threat Model Count]
    F --> G[Get Security Project Count]
    G --> H[Get Recent Activities]
    H --> I[Aggregate Statistics]
    I --> J[Return DashboardStats]
    J --> K[200 OK Response]
```

### Activity Feed Flow
```mermaid
graph TD
    A[GET /api/v1/dashboard/activity] --> B[DashboardController.getActivity]
    B --> C[DashboardService.getActivity]
    C --> D[Query Recent Activities]
    D --> E[Apply Pagination]
    E --> F[Format Activity Data]
    F --> G[Return Activity Feed]
    G --> H[200 OK Response]
```

---

## Admin Operations Flow

### Platform Admin Flow
```mermaid
graph TD
    A[Platform Admin Request] --> B[PlatformAdminController]
    B --> C[PlatformAdminService]
    C --> D[Cross-Tenant Operations]
    D --> E[System Metrics Collection]
    E --> F[Global User Management]
    F --> G[Platform Health Check]
    G --> H[Return Admin Data]
    H --> I[200 OK Response]
```

### Tenant Admin Flow
```mermaid
graph TD
    A[Tenant Admin Request] --> B[TenantAdminController]
    B --> C[TenantAdminService]
    C --> D[Tenant-Scoped Operations]
    D --> E[User Management within Tenant]
    E --> F[Tenant Configuration]
    F --> G[Department Management]
    G --> H[Return Tenant Data]
    H --> I[200 OK Response]
```

---

## API Request Flow

### Complete Request Lifecycle
```mermaid
graph TD
    A[Client Request] --> B[Rate Limiting]
    B --> C[CORS Check]
    C --> D[Global Validation]
    D --> E[Route Resolution]
    E --> F[Authentication Guard]
    F --> G[Role Guard]
    G --> H[Controller Method]
    H --> I[Service Layer]
    I --> J[Database Operations]
    J --> K[Response Formatting]
    K --> L[HTTP Response]
    L --> M[Client Receives Response]
```

### Error Handling Flow
```mermaid
graph TD
    A[Error Occurs] --> B{Error Type?}
    B -->|Validation| C[400 Bad Request]
    B -->|Authentication| D[401 Unauthorized]
    B -->|Authorization| E[403 Forbidden]
    B -->|Not Found| F[404 Not Found]
    B -->|Conflict| G[409 Conflict]
    B -->|Server Error| H[500 Internal Server Error]
    C --> I[Error Response with Details]
    D --> I
    E --> I
    F --> I
    G --> I
    H --> I
    I --> J[Client Error Handling]
```

---

## File Structure and Responsibilities

### Core Files
- **main.ts**: Application bootstrap and configuration
- **app.module.ts**: Root module configuration
- **app.controller.ts**: System health and info endpoints
- **app.service.ts**: Core application services

### Authentication Files
- **auth.controller.ts**: Authentication endpoints
- **auth.service.ts**: Authentication business logic
- **jwt.strategy.ts**: JWT authentication strategy
- **local.strategy.ts**: Local authentication strategy

### Tenant Management Files
- **tenants.controller.ts**: Tenant CRUD operations
- **tenants.service.ts**: Tenant business logic
- **tenant-configuration.controller.ts**: Configuration management
- **tenant-configuration.service.ts**: Configuration business logic

### User Management Files
- **users.controller.ts**: User CRUD operations
- **users.service.ts**: User business logic
- **user-permissions.service.ts**: Permission management
- **external-collaborator.service.ts**: External user management

### Admin Files
- **platform-admin.controller.ts**: Platform administration
- **platform-admin.service.ts**: Platform admin business logic
- **tenant-admin.controller.ts**: Tenant administration
- **tenant-admin.service.ts**: Tenant admin business logic

### Dashboard Files
- **dashboard.controller.ts**: Dashboard endpoints
- **dashboard.service.ts**: Dashboard business logic

### Common Files
- **logger.service.ts**: Centralized logging
- **email.service.ts**: Email functionality
- **prisma.service.ts**: Database operations
- **rbac.service.ts**: Role-based access control

---

## When Each Function is Called

### Authentication Functions
- **register()**: Called when user creates new account
- **login()**: Called when user authenticates
- **logout()**: Called when user logs out
- **forgotPassword()**: Called when user requests password reset
- **resetPassword()**: Called when user resets password with token
- **verifyEmail()**: Called when user verifies email address

### Tenant Functions
- **createTenant()**: Called when platform admin creates new tenant
- **getTenants()**: Called when listing all tenants
- **getTenantById()**: Called when retrieving specific tenant
- **updateTenant()**: Called when updating tenant information
- **deleteTenant()**: Called when soft-deleting tenant
- **getTenantStats()**: Called when retrieving tenant statistics

### User Functions
- **create()**: Called when creating new user
- **findAll()**: Called when listing users
- **findOne()**: Called when retrieving specific user
- **update()**: Called when updating user information
- **remove()**: Called when deleting user

### Dashboard Functions
- **getStats()**: Called when loading dashboard statistics
- **getActivity()**: Called when loading activity feed
- **getProjects()**: Called when loading project data
- **getSystemHealth()**: Called when checking system health

---

## Security Flow

### JWT Token Validation
```mermaid
graph TD
    A[Request with JWT] --> B[Extract Token from Header]
    B --> C[Verify Token Signature]
    C --> D{Token Valid?}
    D -->|No| E[401 Unauthorized]
    D -->|Yes| F[Check Token Expiration]
    F --> G{Token Expired?}
    G -->|Yes| H[401 Unauthorized]
    G -->|No| I[Extract User Information]
    I --> J[Check User Status]
    J --> K{User Active?}
    K -->|No| L[401 Unauthorized]
    K -->|Yes| M[Allow Request]
```

### Role-Based Access Control
```mermaid
graph TD
    A[Authenticated Request] --> B[Extract User Role]
    B --> C[Check Required Role]
    C --> D{Has Required Role?}
    D -->|No| E[403 Forbidden]
    D -->|Yes| F[Check Tenant Access]
    F --> G{Has Tenant Access?}
    G -->|No| H[403 Forbidden]
    G -->|Yes| I[Allow Request]
```

---

## Database Operations Flow

### Prisma Service Usage
```mermaid
graph TD
    A[Service Method] --> B[PrismaService Call]
    B --> C[Database Query]
    C --> D[Query Execution]
    D --> E[Data Retrieval]
    E --> F[Data Transformation]
    F --> G[Return Formatted Data]
    G --> H[Controller Response]
```

---

This comprehensive flow diagram documentation shows exactly when each function, controller, and service is called in the BlickTrack Backend API, providing a complete understanding of the system's operation and data flow.
