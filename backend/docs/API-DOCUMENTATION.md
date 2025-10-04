# BlickTrack Backend - Complete API Documentation

## Table of Contents
1. [Overview](#overview)
2. [Authentication](#authentication)
3. [User Management](#user-management)
4. [Error Handling](#error-handling)
5. [Rate Limiting](#rate-limiting)
6. [Postman Collection](#postman-collection)
7. [Testing Guide](#testing-guide)

## Overview

The BlickTrack Backend API provides a comprehensive set of endpoints for enterprise cybersecurity project management with multi-tenant support, advanced authentication, and security features.

**Base URL**: `http://localhost:3000/api`  
**API Version**: v1  
**Content Type**: `application/json`

## Authentication

### JWT Token System
- **Access Token**: Short-lived (15 minutes), used for API requests
- **Refresh Token**: Long-lived (7 days), used to refresh access tokens
- **Token Rotation**: New refresh token generated on each refresh

### Authentication Headers
```http
Authorization: Bearer <access_token>
```

## API Endpoints

### 1. Authentication Endpoints

#### 1.1 User Registration
```http
POST /auth/register
```

**Description**: Register a new user account. Sends verification email.

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "tenantId": "optional-tenant-id"
}
```

**Validation Rules**:
- `email`: Valid email format, unique
- `password`: Minimum 8 characters, complexity requirements
- `firstName`: Required, string
- `lastName`: Required, string
- `tenantId`: Optional, valid tenant ID

**Response**:
```json
{
  "message": "User registered successfully. Please check your email for verification.",
  "userId": "user-uuid"
}
```

**Status Codes**:
- `201` - User created successfully
- `400` - Validation error
- `409` - Email already exists
- `500` - Server error

#### 1.2 Email Verification
```http
POST /auth/verify-email
```

**Description**: Verify user email address using verification token.

**Request Body**:
```json
{
  "token": "verification-token-from-email"
}
```

**Response**:
```json
{
  "message": "Email verified successfully. You can now log in."
}
```

**Status Codes**:
- `200` - Email verified successfully
- `400` - Invalid or expired token
- `500` - Server error

#### 1.3 Resend Verification Email
```http
POST /auth/resend-verification
```

**Description**: Resend verification email to user.

**Request Body**:
```json
{
  "email": "user@example.com"
}
```

**Response**:
```json
{
  "message": "Verification email sent successfully"
}
```

**Status Codes**:
- `200` - Email sent successfully
- `404` - User not found
- `400` - Email already verified
- `500` - Server error

#### 1.4 User Login
```http
POST /auth/login
```

**Description**: Authenticate user and return access/refresh tokens.

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response**:
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

**Status Codes**:
- `200` - Login successful
- `401` - Invalid credentials
- `423` - Account locked
- `500` - Server error

#### 1.5 Token Refresh
```http
POST /auth/refresh
```

**Description**: Refresh access token using refresh token.

**Request Body**:
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Status Codes**:
- `200` - Tokens refreshed successfully
- `401` - Invalid or expired refresh token
- `500` - Server error

#### 1.6 Password Reset Request
```http
POST /auth/forgot-password
```

**Description**: Request password reset email.

**Request Body**:
```json
{
  "email": "user@example.com"
}
```

**Response**:
```json
{
  "message": "Password reset email sent successfully"
}
```

**Status Codes**:
- `200` - Reset email sent successfully
- `404` - User not found
- `500` - Server error

#### 1.7 Password Reset
```http
POST /auth/reset-password
```

**Description**: Reset password using reset token.

**Request Body**:
```json
{
  "token": "reset-token-from-email",
  "newPassword": "NewSecurePass123!"
}
```

**Response**:
```json
{
  "message": "Password reset successful. You can now log in with your new password."
}
```

**Status Codes**:
- `200` - Password reset successfully
- `400` - Invalid or expired token
- `500` - Server error

#### 1.8 Change Password
```http
POST /auth/change-password
Authorization: Bearer <access_token>
```

**Description**: Change user password (authenticated).

**Request Body**:
```json
{
  "currentPassword": "CurrentPass123!",
  "newPassword": "NewSecurePass123!"
}
```

**Response**:
```json
{
  "message": "Password changed successfully"
}
```

**Status Codes**:
- `200` - Password changed successfully
- `400` - Invalid current password
- `401` - Unauthorized
- `500` - Server error

#### 1.9 Logout
```http
POST /auth/logout
```

**Description**: Logout user and revoke refresh token.

**Request Body**:
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response**:
```json
{
  "message": "Logout successful",
  "note": "Refresh token has been revoked. Please discard your access token on the client side."
}
```

**Status Codes**:
- `200` - Logout successful
- `401` - Invalid refresh token
- `500` - Server error

### 2. User Management Endpoints

#### 2.1 Get User Profile
```http
GET /users/profile
Authorization: Bearer <access_token>
```

**Description**: Get authenticated user profile.

**Response**:
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
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "lastLoginAt": "2024-01-01T00:00:00.000Z"
}
```

**Status Codes**:
- `200` - Profile retrieved successfully
- `401` - Unauthorized
- `500` - Server error

#### 2.2 Update User Profile
```http
PUT /users/profile
Authorization: Bearer <access_token>
```

**Description**: Update authenticated user profile.

**Request Body**:
```json
{
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response**:
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

**Status Codes**:
- `200` - Profile updated successfully
- `400` - Validation error
- `401` - Unauthorized
- `500` - Server error

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

### Error Codes

#### 4xx Client Errors
- `400` - Bad Request (validation errors, invalid data)
- `401` - Unauthorized (invalid credentials, expired tokens)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (user not found, invalid token)
- `409` - Conflict (email already exists)
- `423` - Locked (account locked due to failed attempts)
- `429` - Too Many Requests (rate limiting)

#### 5xx Server Errors
- `500` - Internal Server Error (server errors)
- `502` - Bad Gateway (external service errors)
- `503` - Service Unavailable (maintenance mode)

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

## Rate Limiting

### Rate Limits
- **Authentication endpoints**: 5 requests per minute per IP
- **General API**: 100 requests per minute per IP
- **Password reset**: 3 requests per hour per email

### Rate Limit Headers
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

### Rate Limit Response
```json
{
  "statusCode": 429,
  "message": "Too Many Requests",
  "error": "Too Many Requests",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/auth/login"
}
```

## Postman Collection

### Collection Structure
```
BlickTrack API
├── Authentication
│   ├── Register User
│   ├── Verify Email
│   ├── Resend Verification
│   ├── Login User
│   ├── Refresh Token
│   ├── Forgot Password
│   ├── Reset Password
│   ├── Change Password
│   └── Logout
├── User Management
│   ├── Get Profile
│   └── Update Profile
└── Environment Variables
    ├── base_url
    ├── access_token
    └── refresh_token
```

### Environment Variables
```json
{
  "base_url": "http://localhost:3000/api",
  "access_token": "",
  "refresh_token": ""
}
```

### Pre-request Scripts
```javascript
// Auto-set authorization header
if (pm.environment.get("access_token")) {
    pm.request.headers.add({
        key: "Authorization",
        value: "Bearer " + pm.environment.get("access_token")
    });
}
```

### Test Scripts
```javascript
// Auto-save tokens after login
if (pm.response.code === 200 && pm.request.url.path.includes("login")) {
    const response = pm.response.json();
    pm.environment.set("access_token", response.access_token);
    pm.environment.set("refresh_token", response.refresh_token);
}

// Auto-refresh token on 401
if (pm.response.code === 401) {
    const refreshToken = pm.environment.get("refresh_token");
    if (refreshToken) {
        pm.sendRequest({
            url: pm.environment.get("base_url") + "/auth/refresh",
            method: "POST",
            header: {
                "Content-Type": "application/json"
            },
            body: {
                mode: "raw",
                raw: JSON.stringify({
                    refresh_token: refreshToken
                })
            }
        }, function (err, response) {
            if (response.code === 200) {
                const data = response.json();
                pm.environment.set("access_token", data.access_token);
                pm.environment.set("refresh_token", data.refresh_token);
            }
        });
    }
}
```

## Testing Guide

### 1. Manual Testing

#### Registration Flow
1. **Register User**
   ```bash
   curl -X POST http://localhost:3000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "password": "SecurePass123!",
       "firstName": "Test",
       "lastName": "User"
     }'
   ```

2. **Check Email** - Look for verification email

3. **Verify Email**
   ```bash
   curl -X POST http://localhost:3000/api/auth/verify-email \
     -H "Content-Type: application/json" \
     -d '{"token": "verification-token"}'
   ```

#### Login Flow
1. **Login User**
   ```bash
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "password": "SecurePass123!"
     }'
   ```

2. **Use Access Token**
   ```bash
   curl -X GET http://localhost:3000/api/users/profile \
     -H "Authorization: Bearer <access_token>"
   ```

3. **Refresh Token**
   ```bash
   curl -X POST http://localhost:3000/api/auth/refresh \
     -H "Content-Type: application/json" \
     -d '{"refresh_token": "<refresh_token>"}'
   ```

### 2. Automated Testing

#### Unit Tests
```bash
npm run test
```

#### E2E Tests
```bash
npm run test:e2e
```

#### API Tests
```bash
npm run test:api
```

### 3. Load Testing

#### Using Artillery
```yaml
config:
  target: 'http://localhost:3000/api'
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - name: "Login Flow"
    flow:
      - post:
          url: "/auth/login"
          json:
            email: "test@example.com"
            password: "SecurePass123!"
```

### 4. Security Testing

#### Test Cases
1. **SQL Injection**: Test with malicious input
2. **XSS**: Test with script tags
3. **CSRF**: Test without proper headers
4. **Rate Limiting**: Test with excessive requests
5. **Token Security**: Test with invalid/expired tokens

## Monitoring and Logging

### Log Levels
- `DEBUG`: Detailed information for debugging
- `INFO`: General information about operations
- `WARN`: Warning messages for potential issues
- `ERROR`: Error messages for failed operations
- `CRITICAL`: Critical errors that require immediate attention

### Log Format
```json
{
  "timestamp": "2024-01-01T00:00:00.000Z",
  "level": "info",
  "context": "AuthService",
  "message": "User login successful",
  "data": {
    "userId": "user-uuid",
    "email": "user@example.com"
  }
}
```

### Monitoring Endpoints
- **Health Check**: `GET /health`
- **Metrics**: `GET /metrics`
- **Status**: `GET /status`

## Security Considerations

### 1. Token Security
- Access tokens are short-lived (15 minutes)
- Refresh tokens are stored securely in Redis
- Token rotation on each refresh
- Secure token generation with strong secrets

### 2. Password Security
- bcrypt hashing with salt rounds
- Password strength validation
- Password change tracking
- Security alerts for password changes

### 3. Account Security
- Email verification required
- Account lockout after failed attempts
- Failed login attempt tracking
- Security notifications

### 4. API Security
- CORS protection
- Rate limiting
- Input validation
- SQL injection protection
- XSS protection

## Support and Documentation

### API Documentation
- **Swagger UI**: `http://localhost:3000/api/docs`
- **OpenAPI Spec**: `http://localhost:3000/api/docs-json`

### Additional Resources
- **Frontend Integration Guide**: `docs/FRONTEND-INTEGRATION-GUIDE.md`
- **Code Architecture**: `docs/CODE-ARCHITECTURE-DIAGRAM.md`
- **Database Schema**: `docs/SCHEMA-COMPLETE-OVERVIEW.md`

### Support
- **Issues**: GitHub Issues
- **Documentation**: `docs/` folder
- **API Reference**: Swagger UI

---

**Last Updated**: January 2024  
**Version**: 1.0.0  
**Backend Version**: NestJS 10.x, TypeScript 5.x
