# BlickTrack Backend - Frontend Integration Guide

## Table of Contents
1. [Overview](#overview)
2. [Architecture Diagrams](#architecture-diagrams)
3. [Authentication Flow](#authentication-flow)
4. [API Endpoints](#api-endpoints)
5. [Data Models](#data-models)
6. [Error Handling](#error-handling)
7. [Security Features](#security-features)
8. [Frontend Integration Examples](#frontend-integration-examples)
9. [Environment Configuration](#environment-configuration)
10. [Testing](#testing)

## Overview

This guide provides complete documentation for frontend developers to integrate with the BlickTrack Backend API. The backend is built with NestJS, TypeScript, and PostgreSQL, featuring multi-tenant architecture, advanced security, and comprehensive authentication flows.

### Key Features Implemented
- ✅ **Refresh Token System** - Secure token rotation
- ✅ **Email Verification** - Complete verification flow
- ✅ **Password Reset** - Secure password reset with email
- ✅ **Account Lockout** - Brute force protection
- ✅ **Multi-tenant Support** - Complete tenant isolation
- ✅ **Configurable Debug Logging** - Development-friendly logging
- ✅ **Modular Architecture** - Reusable services and modules

## Architecture Diagrams

### System Architecture
```mermaid
graph TB
    subgraph "Frontend Layer"
        FE[React/Vue/Angular Frontend]
        FE_AUTH[Authentication Components]
        FE_DASH[Dashboard Components]
        FE_PROJ[Project Management]
    end
    
    subgraph "API Gateway Layer"
        API[NestJS API Gateway]
        AUTH_GUARD[JWT Auth Guards]
        RATE_LIMIT[Rate Limiting]
        CORS[CORS Middleware]
    end
    
    subgraph "Authentication Layer"
        AUTH_SERVICE[Auth Service]
        JWT_SERVICE[JWT Service]
        REFRESH_SERVICE[Refresh Token Service]
        EMAIL_SERVICE[Email Service]
    end
    
    subgraph "Business Logic Layer"
        USER_SERVICE[User Service]
        TENANT_SERVICE[Tenant Service]
        PROJECT_SERVICE[Project Service]
        RBAC_SERVICE[RBAC Service]
    end
    
    subgraph "Data Layer"
        PRISMA[Prisma ORM]
        POSTGRES[(PostgreSQL)]
        REDIS[(Redis Cache)]
    end
    
    subgraph "External Services"
        SMTP[SMTP Server]
        LOGGER[Logger Service]
    end
    
    FE --> API
    API --> AUTH_GUARD
    AUTH_GUARD --> AUTH_SERVICE
    AUTH_SERVICE --> JWT_SERVICE
    AUTH_SERVICE --> REFRESH_SERVICE
    AUTH_SERVICE --> EMAIL_SERVICE
    AUTH_SERVICE --> USER_SERVICE
    USER_SERVICE --> TENANT_SERVICE
    TENANT_SERVICE --> PROJECT_SERVICE
    PROJECT_SERVICE --> RBAC_SERVICE
    RBAC_SERVICE --> PRISMA
    PRISMA --> POSTGRES
    EMAIL_SERVICE --> SMTP
    AUTH_SERVICE --> REDIS
    API --> LOGGER
```

### Authentication Flow Architecture
```mermaid
sequenceDiagram
    participant FE as Frontend
    participant API as API Gateway
    participant AUTH as Auth Service
    participant JWT as JWT Service
    participant EMAIL as Email Service
    participant DB as Database
    participant REDIS as Redis Cache
    
    Note over FE,REDIS: User Registration Flow
    FE->>API: POST /auth/register
    API->>AUTH: register(registerDto)
    AUTH->>DB: Create user
    AUTH->>AUTH: Generate verification token
    AUTH->>EMAIL: Send verification email
    EMAIL->>FE: Verification email sent
    AUTH->>API: Registration success
    API->>FE: 201 Created
    
    Note over FE,REDIS: Email Verification Flow
    FE->>API: POST /auth/verify-email
    API->>AUTH: verifyEmail(verifyEmailDto)
    AUTH->>DB: Validate token
    AUTH->>DB: Update user status
    AUTH->>EMAIL: Send welcome email
    AUTH->>API: Verification success
    API->>FE: 200 OK
    
    Note over FE,REDIS: Login Flow
    FE->>API: POST /auth/login
    API->>AUTH: login(loginDto)
    AUTH->>DB: Validate credentials
    AUTH->>JWT: Generate access token
    AUTH->>JWT: Generate refresh token
    AUTH->>REDIS: Store refresh token
    AUTH->>API: Tokens + user data
    API->>FE: 200 OK + tokens
    
    Note over FE,REDIS: Token Refresh Flow
    FE->>API: POST /auth/refresh
    API->>AUTH: refreshTokens(refreshToken)
    AUTH->>REDIS: Validate refresh token
    AUTH->>JWT: Generate new access token
    AUTH->>JWT: Generate new refresh token
    AUTH->>REDIS: Store new refresh token
    AUTH->>API: New tokens
    API->>FE: 200 OK + new tokens
```

### Multi-Tenant Architecture
```mermaid
graph TB
    subgraph "Tenant A - Healthcare"
        TA_USERS[Healthcare Users]
        TA_PROJECTS[Healthcare Projects]
        TA_CONFIG[Healthcare Config]
    end
    
    subgraph "Tenant B - Finance"
        TB_USERS[Finance Users]
        TB_PROJECTS[Finance Projects]
        TB_CONFIG[Finance Config]
    end
    
    subgraph "Tenant C - Government"
        TC_USERS[Government Users]
        TC_PROJECTS[Government Projects]
        TC_CONFIG[Government Config]
    end
    
    subgraph "Shared Infrastructure"
        AUTH_SERVICE[Auth Service]
        EMAIL_SERVICE[Email Service]
        LOGGER[Logger Service]
        DB[(PostgreSQL)]
    end
    
    TA_USERS --> AUTH_SERVICE
    TB_USERS --> AUTH_SERVICE
    TC_USERS --> AUTH_SERVICE
    
    AUTH_SERVICE --> EMAIL_SERVICE
    AUTH_SERVICE --> LOGGER
    AUTH_SERVICE --> DB
    
    TA_PROJECTS --> DB
    TB_PROJECTS --> DB
    TC_PROJECTS --> DB
```

## Authentication Flow

### 1. User Registration Flow
```mermaid
flowchart TD
    A[User fills registration form] --> B[Frontend validates form]
    B --> C[POST /auth/register]
    C --> D[Backend validates data]
    D --> E[Create user in database]
    E --> F[Generate verification token]
    F --> G[Send verification email]
    G --> H[Return success response]
    H --> I[User receives email]
    I --> J[User clicks verification link]
    J --> K[POST /auth/verify-email]
    K --> L[Validate token]
    L --> M[Update user status]
    M --> N[Send welcome email]
    N --> O[User can now login]
```

### 2. Login Flow
```mermaid
flowchart TD
    A[User enters credentials] --> B[Frontend validates form]
    B --> C[POST /auth/login]
    C --> D[Backend validates credentials]
    D --> E{Valid credentials?}
    E -->|No| F[Return error]
    E -->|Yes| G[Generate access token]
    G --> H[Generate refresh token]
    H --> I[Store refresh token in Redis]
    I --> J[Return tokens + user data]
    J --> K[Frontend stores tokens]
    K --> L[User authenticated]
```

### 3. Token Refresh Flow
```mermaid
flowchart TD
    A[Access token expires] --> B[Frontend detects 401]
    B --> C[POST /auth/refresh]
    C --> D[Backend validates refresh token]
    D --> E{Valid refresh token?}
    E -->|No| F[Redirect to login]
    E -->|Yes| G[Generate new access token]
    G --> H[Generate new refresh token]
    H --> I[Store new refresh token]
    I --> J[Return new tokens]
    J --> K[Frontend updates tokens]
    K --> L[Continue with new tokens]
```

## API Endpoints

### Authentication Endpoints

#### 1. User Registration
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "tenantId": "optional-tenant-id"
}
```

**Response:**
```json
{
  "message": "User registered successfully. Please check your email for verification.",
  "userId": "user-uuid"
}
```

#### 2. Email Verification
```http
POST /auth/verify-email
Content-Type: application/json

{
  "token": "verification-token-from-email"
}
```

**Response:**
```json
{
  "message": "Email verified successfully. You can now log in."
}
```

#### 3. Resend Verification Email
```http
POST /auth/resend-verification
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "message": "Verification email sent successfully"
}
```

#### 4. User Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "isEmailVerified": true,
    "isVerified": true,
    "tenantId": "tenant-uuid",
    "tenant": {
      "id": "tenant-uuid",
      "name": "Healthcare Corp"
    }
  }
}
```

#### 5. Token Refresh
```http
POST /auth/refresh
Content-Type: application/json

{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 6. Password Reset Request
```http
POST /auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "message": "Password reset email sent successfully"
}
```

#### 7. Password Reset
```http
POST /auth/reset-password
Content-Type: application/json

{
  "token": "reset-token-from-email",
  "newPassword": "NewSecurePass123!"
}
```

**Response:**
```json
{
  "message": "Password reset successful. You can now log in with your new password."
}
```

#### 8. Change Password
```http
POST /auth/change-password
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "currentPassword": "CurrentPass123!",
  "newPassword": "NewSecurePass123!"
}
```

**Response:**
```json
{
  "message": "Password changed successfully"
}
```

#### 9. Logout
```http
POST /auth/logout
Content-Type: application/json

{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "message": "Logout successful",
  "note": "Refresh token has been revoked. Please discard your access token on the client side."
}
```

### User Management Endpoints

#### 1. Get User Profile
```http
GET /users/profile
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "id": "user-uuid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "isEmailVerified": true,
  "isVerified": true,
  "tenantId": "tenant-uuid",
  "tenant": {
    "id": "tenant-uuid",
    "name": "Healthcare Corp"
  },
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

#### 2. Update User Profile
```http
PUT /users/profile
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": "user-uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "isEmailVerified": true,
    "isVerified": true,
    "tenantId": "tenant-uuid",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## Data Models

### User Model
```typescript
interface User {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  isEmailVerified: boolean;
  isVerified: boolean;
  isActive: boolean;
  tenantId: string;
  tenant?: Tenant;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  passwordChangedAt?: Date;
  failedLoginAttempts: number;
  lockedUntil?: Date;
}
```

### Tenant Model
```typescript
interface Tenant {
  id: string;
  name: string;
  domain: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  users: User[];
  projects: Project[];
}
```

### Verification Token Model
```typescript
interface VerificationToken {
  id: string;
  token: string;
  type: TokenType;
  userId: string;
  user: User;
  expires: Date;
  used: boolean;
  usedAt?: Date;
  createdAt: Date;
}
```

### Token Types
```typescript
enum TokenType {
  EMAIL_VERIFICATION = 'EMAIL_VERIFICATION',
  PASSWORD_RESET = 'PASSWORD_RESET'
}
```

## Error Handling

### Standard Error Response Format
```json
{
  "statusCode": 400,
  "message": "Error description",
  "error": "Bad Request",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/auth/login"
}
```

### Common Error Codes
- `400` - Bad Request (validation errors, invalid data)
- `401` - Unauthorized (invalid credentials, expired tokens)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (user not found, invalid token)
- `409` - Conflict (email already exists)
- `429` - Too Many Requests (rate limiting, account lockout)
- `500` - Internal Server Error (server errors)

### Validation Error Example
```json
{
  "statusCode": 400,
  "message": [
    "email must be an email",
    "password must be longer than or equal to 8 characters"
  ],
  "error": "Bad Request",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/auth/register"
}
```

## Security Features

### 1. JWT Token Security
- **Access Token**: Short-lived (15 minutes), contains user info
- **Refresh Token**: Long-lived (7 days), stored in Redis
- **Token Rotation**: New refresh token on each refresh
- **Secure Storage**: Refresh tokens stored in Redis with expiration

### 2. Password Security
- **Hashing**: bcrypt with salt rounds
- **Strength Validation**: Minimum 8 characters, complexity requirements
- **Change Tracking**: Password change timestamps
- **Security Alerts**: Email notifications for password changes

### 3. Account Security
- **Email Verification**: Required for account activation
- **Account Lockout**: Protection against brute force attacks
- **Failed Login Tracking**: Automatic lockout after 5 attempts
- **Security Notifications**: Email alerts for security events

### 4. Multi-Tenant Security
- **Tenant Isolation**: Complete data separation
- **Tenant-Specific Branding**: Customized emails and UI
- **Tenant Validation**: All operations validated against tenant
- **Cross-Tenant Protection**: No data leakage between tenants

## Frontend Integration Examples

### 1. Authentication Service (TypeScript)
```typescript
class AuthService {
  private baseUrl = 'http://localhost:3000/api';
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  // Register user
  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
    
    return response.json();
  }

  // Login user
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }
    
    const data = await response.json();
    this.accessToken = data.access_token;
    this.refreshToken = data.refresh_token;
    
    // Store tokens in localStorage
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
    
    return data;
  }

  // Refresh tokens
  async refreshTokens(): Promise<TokenResponse> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const response = await fetch(`${this.baseUrl}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: this.refreshToken })
    });
    
    if (!response.ok) {
      // Refresh failed, redirect to login
      this.logout();
      throw new Error('Token refresh failed');
    }
    
    const data = await response.json();
    this.accessToken = data.access_token;
    this.refreshToken = data.refresh_token;
    
    // Update stored tokens
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
    
    return data;
  }

  // Logout user
  async logout(): Promise<void> {
    if (this.refreshToken) {
      try {
        await fetch(`${this.baseUrl}/auth/logout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh_token: this.refreshToken })
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  // Get authenticated user profile
  async getProfile(): Promise<User> {
    const response = await this.authenticatedRequest(`${this.baseUrl}/users/profile`);
    return response.json();
  }

  // Make authenticated request with automatic token refresh
  private async authenticatedRequest(url: string, options: RequestInit = {}): Promise<Response> {
    if (!this.accessToken) {
      throw new Error('No access token available');
    }
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${this.accessToken}`
      }
    });
    
    if (response.status === 401) {
      // Token expired, try to refresh
      try {
        await this.refreshTokens();
        
        // Retry the request with new token
        return fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            'Authorization': `Bearer ${this.accessToken}`
          }
        });
      } catch (error) {
        // Refresh failed, redirect to login
        this.logout();
        throw new Error('Authentication failed');
      }
    }
    
    return response;
  }
}
```

### 2. React Hook Example
```typescript
import { useState, useEffect, useCallback } from 'react';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  const authService = new AuthService();

  // Initialize auth state from stored tokens
  useEffect(() => {
    const initAuth = async () => {
      const accessToken = localStorage.getItem('access_token');
      const refreshToken = localStorage.getItem('refresh_token');
      
      if (accessToken && refreshToken) {
        try {
          const user = await authService.getProfile();
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false
          });
        } catch (error) {
          // Tokens invalid, clear them
          authService.logout();
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false
          });
        }
      } else {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false
        });
      }
    };

    initAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);
      setAuthState({
        user: response.user,
        isAuthenticated: true,
        isLoading: false
      });
      return response;
    } catch (error) {
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
  }, []);

  const register = useCallback(async (userData: RegisterData) => {
    try {
      const response = await authService.register(userData);
      return response;
    } catch (error) {
      throw error;
    }
  }, []);

  return {
    ...authState,
    login,
    logout,
    register
  };
};
```

### 3. Vue.js Composition API Example
```typescript
import { ref, computed, onMounted } from 'vue';
import { AuthService } from './services/AuthService';

export const useAuth = () => {
  const user = ref<User | null>(null);
  const isLoading = ref(true);
  const authService = new AuthService();

  const isAuthenticated = computed(() => !!user.value);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);
      user.value = response.user;
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    await authService.logout();
    user.value = null;
  };

  const register = async (userData: RegisterData) => {
    try {
      const response = await authService.register(userData);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const initAuth = async () => {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (accessToken && refreshToken) {
      try {
        const userProfile = await authService.getProfile();
        user.value = userProfile;
      } catch (error) {
        authService.logout();
      }
    }
    
    isLoading.value = false;
  };

  onMounted(() => {
    initAuth();
  });

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    register
  };
};
```

## Environment Configuration

### Required Environment Variables
```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/blicktrack"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="15m"
REFRESH_TOKEN_SECRET="your-super-secret-refresh-key"
REFRESH_TOKEN_EXPIRES_IN="7d"

# Email Configuration
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER="your-email@example.com"
SMTP_PASSWORD="your-app-password"
SMTP_FROM_EMAIL="noreply@blicktrack.com"
SMTP_FROM_NAME="BlickTrack Security Platform"

# Frontend URL
FRONTEND_URL="http://localhost:3000"

# Token Expiration (in hours)
EMAIL_VERIFICATION_TOKEN_EXPIRATION=24
PASSWORD_RESET_TOKEN_EXPIRATION=60

# Security
BCRYPT_ROUNDS=12
MAX_FAILED_LOGIN_ATTEMPTS=5
ACCOUNT_LOCKOUT_DURATION=30

# Debug Configuration
DEBUG_ENABLED=true
LOG_LEVEL="debug"

# Redis (for refresh tokens)
REDIS_HOST="localhost"
REDIS_PORT=6379
REDIS_PASSWORD=""
```

## Testing

### API Testing with Postman
1. **Import the collection** from `docs/postman-collection.json`
2. **Set up environment variables**:
   - `base_url`: `http://localhost:3000/api`
   - `access_token`: (will be set automatically)
   - `refresh_token`: (will be set automatically)

### Test Scenarios
1. **Registration Flow**:
   - Register new user
   - Check email for verification
   - Verify email
   - Login with verified account

2. **Login Flow**:
   - Login with valid credentials
   - Test token refresh
   - Test logout

3. **Password Reset Flow**:
   - Request password reset
   - Check email for reset link
   - Reset password
   - Login with new password

4. **Security Testing**:
   - Test account lockout
   - Test invalid token handling
   - Test rate limiting

## Troubleshooting

### Common Issues

1. **Email not sending**:
   - Check SMTP configuration
   - Verify email credentials
   - Check firewall settings

2. **Token refresh failing**:
   - Check Redis connection
   - Verify refresh token storage
   - Check token expiration

3. **Database connection issues**:
   - Verify DATABASE_URL
   - Check PostgreSQL service
   - Run database migrations

4. **CORS errors**:
   - Check CORS configuration
   - Verify frontend URL
   - Check preflight requests

### Debug Mode
Enable debug mode by setting `DEBUG_ENABLED=true` in environment variables. This will provide detailed logging for all operations.

## Support

For technical support or questions about the API integration, please refer to:
- API Documentation: `http://localhost:3000/api/docs`
- Backend Repository: [GitHub Repository]
- Technical Documentation: `docs/` folder

---

**Last Updated**: January 2024  
**Version**: 1.0.0  
**Backend Version**: NestJS 10.x, TypeScript 5.x
