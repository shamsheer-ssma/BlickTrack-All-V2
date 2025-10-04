# Refresh Token Implementation Guide

## Overview

The **Refresh Token System** has been successfully implemented in the BlickTrack backend. This feature provides secure token rotation, automatic cleanup, and enhanced security for user authentication.

## Features Implemented

### ✅ 1. Configurable Debug Logger
- **File**: `src/common/services/logger.service.ts`
- **Features**:
  - Configurable logging levels (debug, info, warn, error)
  - Can be enabled/disabled via environment variables
  - Color-coded output for development
  - Structured JSON logging for production
  - Context-aware logging for better traceability
  
### ✅ 2. Token Generation & Storage
- **Access Tokens**: Short-lived (default: 7 days)
- **Refresh Tokens**: Long-lived (default: 30 days)
- **Token Rotation**: Old refresh tokens are marked as used when refreshed
- **Automatic Cleanup**: Expired tokens are automatically removed

### ✅ 3. API Endpoints

#### `POST /api/v1/auth/login`
Returns both access and refresh tokens on successful login.

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "END_USER",
    "tenantId": "tenant-id",
    "isVerified": true,
    "mfaEnabled": false
  }
}
```

#### `POST /api/v1/auth/refresh` (NEW)
Generate new tokens using a valid refresh token.

**Request:**
```json
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

#### `POST /api/v1/auth/logout` (UPDATED)
Revoke refresh token and logout user.

**Request:**
```json
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

### ✅ 4. Enhanced Security Features

#### Account Lockout Protection
- Tracks failed login attempts
- Locks account after 5 failed attempts (configurable)
- Automatic unlock after 30 minutes (configurable)
- Audit logging for failed attempts

#### Token Security
- **Token Rotation**: Each refresh generates new tokens, old ones are invalidated
- **Database Validation**: Refresh tokens are stored and validated against database
- **Automatic Expiration**: Tokens expire based on configuration
- **Revocation Support**: Tokens can be revoked on logout

## Environment Configuration

Add these to your `.env` file:

```env
# Debug Logging (NEW)
DEBUG_ENABLED=true
LOG_LEVEL=debug

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# Security Settings
MAX_FAILED_LOGIN_ATTEMPTS=5
ACCOUNT_LOCKOUT_DURATION=30
BCRYPT_ROUNDS=12
```

## Usage Examples

### Frontend Integration

```typescript
// Login and store tokens
const loginResponse = await fetch('/api/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

const { access_token, refresh_token, user } = await loginResponse.json();

// Store tokens securely
localStorage.setItem('access_token', access_token);
localStorage.setItem('refresh_token', refresh_token);

// Refresh tokens when access token expires
const refreshTokens = async () => {
  const refresh_token = localStorage.getItem('refresh_token');
  
  const response = await fetch('/api/v1/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token })
  });

  if (response.ok) {
    const { access_token: newAccessToken, refresh_token: newRefreshToken } = await response.json();
    localStorage.setItem('access_token', newAccessToken);
    localStorage.setItem('refresh_token', newRefreshToken);
    return newAccessToken;
  } else {
    // Refresh token expired or invalid - redirect to login
    window.location.href = '/login';
  }
};

// Logout and revoke tokens
const logout = async () => {
  const refresh_token = localStorage.getItem('refresh_token');
  
  await fetch('/api/v1/auth/logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token })
  });

  // Clear tokens from storage
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  
  window.location.href = '/login';
};

// Axios interceptor for automatic token refresh
axios.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshTokens();
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        // Redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
```

## Testing

### Test Login with Token Generation
```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "YourPassword123!"
  }'
```

### Test Token Refresh
```bash
curl -X POST http://localhost:3001/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refresh_token": "YOUR_REFRESH_TOKEN_HERE"
  }'
```

### Test Logout
```bash
curl -X POST http://localhost:3001/api/v1/auth/logout \
  -H "Content-Type: application/json" \
  -d '{
    "refresh_token": "YOUR_REFRESH_TOKEN_HERE"
  }'
```

## Debug Logging

When `DEBUG_ENABLED=true`, you'll see detailed logs like:

```
🔧 [Logger] Initialized - Debug: true, Level: debug, Env: development
🔍 [DEBUG] 2024-01-15T10:30:00.000Z [AuthService] Login attempt started
   Data: {
     "email": "user@example.com",
     "ipAddress": "127.0.0.1"
   }
✅ [INFO] 2024-01-15T10:30:00.123Z [AuthService] Password validation successful
   Data: {
     "userId": "user-id-123",
     "email": "user@example.com"
   }
🔍 [DEBUG] 2024-01-15T10:30:00.234Z [AuthService] Tokens generated successfully
✅ [INFO] 2024-01-15T10:30:00.345Z [AuthService] Login successful
```

To disable debug logging in production:
```env
DEBUG_ENABLED=false
LOG_LEVEL=error
NODE_ENV=production
```

## Database Schema

The refresh tokens are stored in the `verification_tokens` table:

```sql
SELECT * FROM verification_tokens WHERE type = 'REFRESH' AND used = false;
```

Columns:
- `id`: UUID primary key
- `token`: The JWT refresh token string
- `type`: 'REFRESH'
- `userId`: Reference to the user
- `expires`: Token expiration date
- `used`: Boolean flag for token rotation
- `usedAt`: Timestamp when token was used

## Security Considerations

### ✅ Implemented
1. **Token Rotation**: Old refresh tokens are invalidated when new ones are generated
2. **Database Validation**: Refresh tokens must exist in database and not be marked as used
3. **Expiration Checking**: Both JWT expiration and database expiration are checked
4. **Account Lockout**: Protects against brute force attacks
5. **Audit Logging**: All authentication events are logged
6. **Secure Token Storage**: Tokens are stored with metadata for tracking

### 🔐 Best Practices
1. **HTTPS Only**: Always use HTTPS in production
2. **Secure Storage**: Store refresh tokens securely (HttpOnly cookies preferred over localStorage)
3. **Token Rotation**: Implement on every refresh (already done)
4. **Short-lived Access Tokens**: Keep access tokens short-lived
5. **Monitor Failed Attempts**: Review audit logs regularly

## Code Changes Summary

### New Files
- `src/common/services/logger.service.ts` - Configurable debug logger
- `docs/REFRESH-TOKEN-IMPLEMENTATION.md` - This documentation

### Modified Files
- `src/auth/auth.service.ts`
  - Added logger integration
  - Implemented `generateTokens()` method
  - Implemented `storeRefreshToken()` method
  - Implemented `refreshTokens()` method
  - Implemented `revokeRefreshToken()` method
  - Enhanced `handleFailedLogin()` with account lockout
  - Updated `login()` to return refresh token
  - Added detailed comments and logging

- `src/auth/auth.controller.ts`
  - Added `/refresh` endpoint
  - Updated `/logout` endpoint to revoke tokens
  - Added comprehensive API documentation

- `src/auth/dto/auth.dto.ts`
  - Added `RefreshTokenDto` for validation

## What's Next?

The following features are pending implementation:

1. ✅ **Refresh Token System** - COMPLETED
2. ⏳ **Email Verification** - In Progress
3. ⏳ **Password Reset Flow** - Pending
4. ⏳ **Session Management** - Pending
5. ⏳ **Feature Access Control** - Pending
6. ⏳ **MFA (Multi-Factor Authentication)** - Pending
7. ⏳ **OAuth Integration** - Pending

## Support

For issues or questions about the refresh token implementation:
1. Check the debug logs (set `DEBUG_ENABLED=true`)
2. Review the audit logs in the database
3. Consult the API documentation at `/api/docs`
4. Check the code comments in `auth.service.ts`

---

**Implementation Date**: 2024
**Status**: ✅ Complete and Production Ready
**Version**: 1.0.0

