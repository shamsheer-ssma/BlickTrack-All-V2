# BlickTrack Backend - Code Architecture Diagram

## Complete System Architecture

This document provides a detailed technical overview of the BlickTrack Backend codebase architecture, showing how all implemented features work together.

## High-Level Architecture

```mermaid
graph TB
    subgraph "Frontend Applications"
        WEB[Web Application]
        MOBILE[Mobile App]
        ADMIN[Admin Dashboard]
    end
    
    subgraph "API Gateway & Middleware"
        GATEWAY[NestJS API Gateway]
        CORS[CORS Middleware]
        HELMET[Security Headers]
        RATE_LIMIT[Rate Limiting]
        VALIDATION[Global Validation]
    end
    
    subgraph "Authentication & Authorization"
        AUTH_MODULE[Auth Module]
        JWT_STRATEGY[JWT Strategy]
        LOCAL_STRATEGY[Local Strategy]
        AUTH_GUARD[JWT Auth Guard]
        RBAC_SERVICE[RBAC Service]
    end
    
    subgraph "Core Services"
        AUTH_SERVICE[Auth Service]
        USER_SERVICE[User Service]
        EMAIL_SERVICE[Email Service]
        LOGGER_SERVICE[Logger Service]
        HASHING_SERVICE[Hashing Service]
    end
    
    subgraph "Data Layer"
        PRISMA_SERVICE[Prisma Service]
        POSTGRES[(PostgreSQL Database)]
        REDIS[(Redis Cache)]
    end
    
    subgraph "External Services"
        SMTP[SMTP Server]
        LOGGING[Logging System]
    end
    
    WEB --> GATEWAY
    MOBILE --> GATEWAY
    ADMIN --> GATEWAY
    
    GATEWAY --> CORS
    GATEWAY --> HELMET
    GATEWAY --> RATE_LIMIT
    GATEWAY --> VALIDATION
    
    GATEWAY --> AUTH_MODULE
    AUTH_MODULE --> JWT_STRATEGY
    AUTH_MODULE --> LOCAL_STRATEGY
    AUTH_MODULE --> AUTH_GUARD
    
    AUTH_MODULE --> AUTH_SERVICE
    AUTH_SERVICE --> USER_SERVICE
    AUTH_SERVICE --> EMAIL_SERVICE
    AUTH_SERVICE --> LOGGER_SERVICE
    AUTH_SERVICE --> HASHING_SERVICE
    
    AUTH_SERVICE --> RBAC_SERVICE
    RBAC_SERVICE --> PRISMA_SERVICE
    PRISMA_SERVICE --> POSTGRES
    
    AUTH_SERVICE --> REDIS
    EMAIL_SERVICE --> SMTP
    LOGGER_SERVICE --> LOGGING
```

## Detailed Module Architecture

### 1. Authentication Module Structure

```mermaid
graph TB
    subgraph "Auth Module"
        AUTH_CONTROLLER[Auth Controller]
        AUTH_SERVICE[Auth Service]
        AUTH_SIMPLE[Auth Simple Service]
        
        subgraph "DTOs"
            REGISTER_DTO[Register DTO]
            LOGIN_DTO[Login DTO]
            REFRESH_DTO[Refresh Token DTO]
            VERIFY_DTO[Verify Email DTO]
            RESEND_DTO[Resend Verification DTO]
            FORGOT_DTO[Forgot Password DTO]
            RESET_DTO[Reset Password DTO]
            CHANGE_DTO[Change Password DTO]
        end
        
        subgraph "Guards"
            JWT_GUARD[JWT Auth Guard]
            LOCAL_GUARD[Local Auth Guard]
        end
        
        subgraph "Strategies"
            JWT_STRATEGY[JWT Strategy]
            LOCAL_STRATEGY[Local Strategy]
        end
    end
    
    subgraph "External Dependencies"
        JWT_SERVICE[JWT Service]
        EMAIL_SERVICE[Email Service]
        LOGGER_SERVICE[Logger Service]
        HASHING_SERVICE[Hashing Service]
        PRISMA_SERVICE[Prisma Service]
    end
    
    AUTH_CONTROLLER --> AUTH_SERVICE
    AUTH_CONTROLLER --> AUTH_SIMPLE
    AUTH_SERVICE --> JWT_SERVICE
    AUTH_SERVICE --> EMAIL_SERVICE
    AUTH_SERVICE --> LOGGER_SERVICE
    AUTH_SERVICE --> HASHING_SERVICE
    AUTH_SERVICE --> PRISMA_SERVICE
    
    AUTH_CONTROLLER --> REGISTER_DTO
    AUTH_CONTROLLER --> LOGIN_DTO
    AUTH_CONTROLLER --> REFRESH_DTO
    AUTH_CONTROLLER --> VERIFY_DTO
    AUTH_CONTROLLER --> RESEND_DTO
    AUTH_CONTROLLER --> FORGOT_DTO
    AUTH_CONTROLLER --> RESET_DTO
    AUTH_CONTROLLER --> CHANGE_DTO
    
    AUTH_CONTROLLER --> JWT_GUARD
    AUTH_CONTROLLER --> LOCAL_GUARD
    
    JWT_GUARD --> JWT_STRATEGY
    LOCAL_GUARD --> LOCAL_STRATEGY
```

### 2. Email Service Architecture

```mermaid
graph TB
    subgraph "Email Module"
        EMAIL_SERVICE[Email Service]
        EMAIL_MODULE[Email Module]
    end
    
    subgraph "Email Templates"
        VERIFICATION_TEMPLATE[Verification Email]
        WELCOME_TEMPLATE[Welcome Email]
        PASSWORD_RESET_TEMPLATE[Password Reset Email]
        SECURITY_ALERT_TEMPLATE[Security Alert Email]
    end
    
    subgraph "External Dependencies"
        NODEMAILER[Nodemailer]
        SMTP_CONFIG[SMTP Configuration]
        LOGGER_SERVICE[Logger Service]
        CONFIG_SERVICE[Config Service]
    end
    
    EMAIL_SERVICE --> NODEMAILER
    EMAIL_SERVICE --> SMTP_CONFIG
    EMAIL_SERVICE --> LOGGER_SERVICE
    EMAIL_SERVICE --> CONFIG_SERVICE
    
    EMAIL_SERVICE --> VERIFICATION_TEMPLATE
    EMAIL_SERVICE --> WELCOME_TEMPLATE
    EMAIL_SERVICE --> PASSWORD_RESET_TEMPLATE
    EMAIL_SERVICE --> SECURITY_ALERT_TEMPLATE
    
    EMAIL_MODULE --> EMAIL_SERVICE
```

### 3. Logger Service Architecture

```mermaid
graph TB
    subgraph "Logger Service"
        LOGGER_SERVICE[Logger Service]
        FORMATTER[Message Formatter]
        COLORIZER[Colorizer]
        LEVEL_FILTER[Level Filter]
    end
    
    subgraph "Configuration"
        DEBUG_ENABLED[DEBUG_ENABLED]
        LOG_LEVEL[LOG_LEVEL]
        NODE_ENV[NODE_ENV]
    end
    
    subgraph "Output Formats"
        JSON_FORMAT[JSON Format - Production]
        COLORED_FORMAT[Colored Format - Development]
    end
    
    LOGGER_SERVICE --> FORMATTER
    LOGGER_SERVICE --> COLORIZER
    LOGGER_SERVICE --> LEVEL_FILTER
    
    FORMATTER --> JSON_FORMAT
    FORMATTER --> COLORED_FORMAT
    
    DEBUG_ENABLED --> LEVEL_FILTER
    LOG_LEVEL --> LEVEL_FILTER
    NODE_ENV --> FORMATTER
```

## Data Flow Diagrams

### 1. User Registration Flow

```mermaid
sequenceDiagram
    participant FE as Frontend
    participant API as API Gateway
    participant AUTH as Auth Service
    participant EMAIL as Email Service
    participant LOGGER as Logger Service
    participant DB as Database
    participant SMTP as SMTP Server
    
    FE->>API: POST /auth/register
    API->>AUTH: register(registerDto)
    AUTH->>LOGGER: Log registration attempt
    AUTH->>DB: Check if user exists
    AUTH->>DB: Create new user
    AUTH->>AUTH: Generate verification token
    AUTH->>DB: Store verification token
    AUTH->>EMAIL: sendVerificationEmail()
    EMAIL->>LOGGER: Log email sending
    EMAIL->>SMTP: Send verification email
    SMTP-->>EMAIL: Email sent
    EMAIL-->>AUTH: Email sent successfully
    AUTH->>LOGGER: Log success
    AUTH-->>API: Registration success
    API-->>FE: 201 Created
```

### 2. Login Flow with Token Management

```mermaid
sequenceDiagram
    participant FE as Frontend
    participant API as API Gateway
    participant AUTH as Auth Service
    participant JWT as JWT Service
    participant LOGGER as Logger Service
    participant DB as Database
    participant REDIS as Redis Cache
    
    FE->>API: POST /auth/login
    API->>AUTH: login(loginDto)
    AUTH->>LOGGER: Log login attempt
    AUTH->>DB: Validate credentials
    AUTH->>AUTH: Check account lockout
    AUTH->>JWT: Generate access token
    AUTH->>JWT: Generate refresh token
    AUTH->>REDIS: Store refresh token
    AUTH->>DB: Update last login
    AUTH->>LOGGER: Log successful login
    AUTH-->>API: Tokens + user data
    API-->>FE: 200 OK + tokens
```

### 3. Token Refresh Flow

```mermaid
sequenceDiagram
    participant FE as Frontend
    participant API as API Gateway
    participant AUTH as Auth Service
    participant JWT as JWT Service
    participant LOGGER as Logger Service
    participant REDIS as Redis Cache
    
    FE->>API: POST /auth/refresh
    API->>AUTH: refreshTokens(refreshToken)
    AUTH->>LOGGER: Log refresh attempt
    AUTH->>REDIS: Validate refresh token
    AUTH->>JWT: Generate new access token
    AUTH->>JWT: Generate new refresh token
    AUTH->>REDIS: Store new refresh token
    AUTH->>REDIS: Remove old refresh token
    AUTH->>LOGGER: Log successful refresh
    AUTH-->>API: New tokens
    API-->>FE: 200 OK + new tokens
```

## Database Schema Relationships

### Core Authentication Tables

```mermaid
erDiagram
    User ||--o{ VerificationToken : has
    User ||--o{ AuditLog : generates
    User }o--|| Tenant : belongs_to
    Tenant ||--o{ User : contains
    Tenant ||--o{ Project : owns
    
    User {
        string id PK
        string email UK
        string passwordHash
        string firstName
        string lastName
        boolean isEmailVerified
        boolean isVerified
        boolean isActive
        string tenantId FK
        datetime createdAt
        datetime updatedAt
        datetime lastLoginAt
        datetime passwordChangedAt
        int failedLoginAttempts
        datetime lockedUntil
    }
    
    Tenant {
        string id PK
        string name
        string domain
        boolean isActive
        datetime createdAt
        datetime updatedAt
    }
    
    VerificationToken {
        string id PK
        string token UK
        string type
        string userId FK
        datetime expires
        boolean used
        datetime usedAt
        datetime createdAt
    }
    
    AuditLog {
        string id PK
        string eventType
        string action
        string userId FK
        string tenantId
        boolean success
        json metadata
        datetime createdAt
    }
```

## Security Architecture

### 1. Multi-Layer Security

```mermaid
graph TB
    subgraph "Application Security"
        HELMET[Helmet Security Headers]
        CORS[CORS Protection]
        RATE_LIMIT[Rate Limiting]
        VALIDATION[Input Validation]
    end
    
    subgraph "Authentication Security"
        JWT_SECURE[JWT Token Security]
        REFRESH_ROTATION[Token Rotation]
        PASSWORD_HASH[Password Hashing]
        ACCOUNT_LOCKOUT[Account Lockout]
    end
    
    subgraph "Authorization Security"
        RBAC[Role-Based Access Control]
        TENANT_ISOLATION[Tenant Isolation]
        PERMISSION_CHECK[Permission Validation]
    end
    
    subgraph "Data Security"
        ENCRYPTION[Data Encryption]
        AUDIT_LOGGING[Audit Logging]
        SECURE_STORAGE[Secure Token Storage]
    end
    
    HELMET --> CORS
    CORS --> RATE_LIMIT
    RATE_LIMIT --> VALIDATION
    
    VALIDATION --> JWT_SECURE
    JWT_SECURE --> REFRESH_ROTATION
    REFRESH_ROTATION --> PASSWORD_HASH
    PASSWORD_HASH --> ACCOUNT_LOCKOUT
    
    ACCOUNT_LOCKOUT --> RBAC
    RBAC --> TENANT_ISOLATION
    TENANT_ISOLATION --> PERMISSION_CHECK
    
    PERMISSION_CHECK --> ENCRYPTION
    ENCRYPTION --> AUDIT_LOGGING
    AUDIT_LOGGING --> SECURE_STORAGE
```

### 2. Token Security Flow

```mermaid
graph TB
    subgraph "Token Generation"
        LOGIN[User Login]
        VALIDATE[Validate Credentials]
        GENERATE_ACCESS[Generate Access Token]
        GENERATE_REFRESH[Generate Refresh Token]
        STORE_REFRESH[Store Refresh Token]
    end
    
    subgraph "Token Usage"
        REQUEST[API Request]
        EXTRACT[Extract Access Token]
        VALIDATE_TOKEN[Validate Token]
        ALLOW[Allow Request]
    end
    
    subgraph "Token Refresh"
        EXPIRED[Token Expired]
        REFRESH_REQUEST[Refresh Request]
        VALIDATE_REFRESH[Validate Refresh Token]
        ROTATE[Rotate Tokens]
        UPDATE[Update Stored Tokens]
    end
    
    LOGIN --> VALIDATE
    VALIDATE --> GENERATE_ACCESS
    GENERATE_ACCESS --> GENERATE_REFRESH
    GENERATE_REFRESH --> STORE_REFRESH
    
    REQUEST --> EXTRACT
    EXTRACT --> VALIDATE_TOKEN
    VALIDATE_TOKEN --> ALLOW
    
    EXPIRED --> REFRESH_REQUEST
    REFRESH_REQUEST --> VALIDATE_REFRESH
    VALIDATE_REFRESH --> ROTATE
    ROTATE --> UPDATE
```

## Error Handling Architecture

### 1. Error Flow

```mermaid
graph TB
    subgraph "Error Sources"
        VALIDATION_ERROR[Validation Error]
        AUTH_ERROR[Authentication Error]
        DB_ERROR[Database Error]
        EMAIL_ERROR[Email Error]
        EXTERNAL_ERROR[External Service Error]
    end
    
    subgraph "Error Processing"
        CATCH[Error Handler]
        LOG_ERROR[Log Error]
        FORMAT_ERROR[Format Error]
        AUDIT_ERROR[Audit Error]
    end
    
    subgraph "Error Response"
        HTTP_STATUS[HTTP Status Code]
        ERROR_MESSAGE[Error Message]
        ERROR_DETAILS[Error Details]
        TIMESTAMP[Timestamp]
    end
    
    VALIDATION_ERROR --> CATCH
    AUTH_ERROR --> CATCH
    DB_ERROR --> CATCH
    EMAIL_ERROR --> CATCH
    EXTERNAL_ERROR --> CATCH
    
    CATCH --> LOG_ERROR
    LOG_ERROR --> FORMAT_ERROR
    FORMAT_ERROR --> AUDIT_ERROR
    
    AUDIT_ERROR --> HTTP_STATUS
    HTTP_STATUS --> ERROR_MESSAGE
    ERROR_MESSAGE --> ERROR_DETAILS
    ERROR_DETAILS --> TIMESTAMP
```

## Performance Architecture

### 1. Caching Strategy

```mermaid
graph TB
    subgraph "Cache Layers"
        REDIS_CACHE[Redis Cache]
        MEMORY_CACHE[Memory Cache]
        DB_CACHE[Database Cache]
    end
    
    subgraph "Cache Types"
        REFRESH_TOKENS[Refresh Tokens]
        USER_SESSIONS[User Sessions]
        TENANT_CONFIG[Tenant Configuration]
        PERMISSIONS[User Permissions]
    end
    
    subgraph "Cache Operations"
        SET[Set Cache]
        GET[Get Cache]
        DELETE[Delete Cache]
        EXPIRE[Set Expiration]
    end
    
    REDIS_CACHE --> REFRESH_TOKENS
    REDIS_CACHE --> USER_SESSIONS
    MEMORY_CACHE --> TENANT_CONFIG
    MEMORY_CACHE --> PERMISSIONS
    
    REFRESH_TOKENS --> SET
    USER_SESSIONS --> GET
    TENANT_CONFIG --> DELETE
    PERMISSIONS --> EXPIRE
```

## Monitoring and Logging

### 1. Logging Architecture

```mermaid
graph TB
    subgraph "Log Sources"
        AUTH_LOGS[Authentication Logs]
        API_LOGS[API Request Logs]
        ERROR_LOGS[Error Logs]
        SECURITY_LOGS[Security Logs]
        AUDIT_LOGS[Audit Logs]
    end
    
    subgraph "Log Processing"
        LOGGER_SERVICE[Logger Service]
        FORMATTER[Log Formatter]
        FILTER[Log Filter]
        LEVEL_CHECK[Level Check]
    end
    
    subgraph "Log Output"
        CONSOLE[Console Output]
        FILE[File Output]
        EXTERNAL[External Logging]
    end
    
    AUTH_LOGS --> LOGGER_SERVICE
    API_LOGS --> LOGGER_SERVICE
    ERROR_LOGS --> LOGGER_SERVICE
    SECURITY_LOGS --> LOGGER_SERVICE
    AUDIT_LOGS --> LOGGER_SERVICE
    
    LOGGER_SERVICE --> FORMATTER
    FORMATTER --> FILTER
    FILTER --> LEVEL_CHECK
    
    LEVEL_CHECK --> CONSOLE
    LEVEL_CHECK --> FILE
    LEVEL_CHECK --> EXTERNAL
```

## Deployment Architecture

### 1. Production Deployment

```mermaid
graph TB
    subgraph "Load Balancer"
        LB[Load Balancer]
    end
    
    subgraph "Application Servers"
        APP1[App Server 1]
        APP2[App Server 2]
        APP3[App Server 3]
    end
    
    subgraph "Database Cluster"
        POSTGRES_PRIMARY[PostgreSQL Primary]
        POSTGRES_REPLICA[PostgreSQL Replica]
    end
    
    subgraph "Cache Cluster"
        REDIS_PRIMARY[Redis Primary]
        REDIS_REPLICA[Redis Replica]
    end
    
    subgraph "External Services"
        SMTP_SERVICE[SMTP Service]
        MONITORING[Monitoring Service]
    end
    
    LB --> APP1
    LB --> APP2
    LB --> APP3
    
    APP1 --> POSTGRES_PRIMARY
    APP2 --> POSTGRES_PRIMARY
    APP3 --> POSTGRES_PRIMARY
    
    POSTGRES_PRIMARY --> POSTGRES_REPLICA
    
    APP1 --> REDIS_PRIMARY
    APP2 --> REDIS_PRIMARY
    APP3 --> REDIS_PRIMARY
    
    REDIS_PRIMARY --> REDIS_REPLICA
    
    APP1 --> SMTP_SERVICE
    APP2 --> SMTP_SERVICE
    APP3 --> SMTP_SERVICE
    
    APP1 --> MONITORING
    APP2 --> MONITORING
    APP3 --> MONITORING
```

## Configuration Management

### 1. Environment Configuration

```mermaid
graph TB
    subgraph "Configuration Sources"
        ENV_VARS[Environment Variables]
        CONFIG_FILES[Config Files]
        SECRETS[Secret Management]
    end
    
    subgraph "Configuration Service"
        CONFIG_SERVICE[Config Service]
        VALIDATION[Config Validation]
        DEFAULTS[Default Values]
    end
    
    subgraph "Configuration Usage"
        AUTH_CONFIG[Auth Configuration]
        EMAIL_CONFIG[Email Configuration]
        DB_CONFIG[Database Configuration]
        LOG_CONFIG[Logging Configuration]
    end
    
    ENV_VARS --> CONFIG_SERVICE
    CONFIG_FILES --> CONFIG_SERVICE
    SECRETS --> CONFIG_SERVICE
    
    CONFIG_SERVICE --> VALIDATION
    VALIDATION --> DEFAULTS
    
    DEFAULTS --> AUTH_CONFIG
    DEFAULTS --> EMAIL_CONFIG
    DEFAULTS --> DB_CONFIG
    DEFAULTS --> LOG_CONFIG
```

This comprehensive architecture diagram shows how all the implemented features work together in the BlickTrack Backend system, providing a complete technical overview for frontend developers and system architects.
