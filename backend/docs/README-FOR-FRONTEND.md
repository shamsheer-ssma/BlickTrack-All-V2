# BlickTrack Backend - Frontend Developer Guide

## 🚀 Quick Start

Welcome to the BlickTrack Backend! This guide will help you integrate your frontend application with our comprehensive API.

## 📋 What's Been Implemented

### ✅ Core Authentication Features
- **User Registration** with email verification
- **Secure Login** with JWT tokens
- **Token Refresh** system for seamless UX
- **Password Reset** via email
- **Account Security** with lockout protection
- **Multi-tenant Support** for enterprise clients

### ✅ Security Features
- **JWT Access Tokens** (15 minutes) + **Refresh Tokens** (7 days)
- **Token Rotation** for enhanced security
- **Account Lockout** after failed login attempts
- **Password Strength Validation**
- **Email Verification** required for account activation
- **Security Email Notifications**

### ✅ Developer Experience
- **Configurable Debug Logging** (can be disabled in production)
- **Comprehensive API Documentation**
- **Postman Collection** for testing
- **TypeScript Support** with full type definitions
- **Error Handling** with detailed error messages

## 🏗️ Architecture Overview

```mermaid
graph TB
    subgraph "Your Frontend"
        REACT[React/Vue/Angular App]
        AUTH_COMPONENTS[Auth Components]
        API_CLIENT[API Client]
    end
    
    subgraph "BlickTrack Backend"
        API_GATEWAY[API Gateway]
        AUTH_SERVICE[Auth Service]
        EMAIL_SERVICE[Email Service]
        DATABASE[(PostgreSQL)]
        REDIS[(Redis Cache)]
    end
    
    REACT --> API_CLIENT
    API_CLIENT --> API_GATEWAY
    API_GATEWAY --> AUTH_SERVICE
    AUTH_SERVICE --> EMAIL_SERVICE
    AUTH_SERVICE --> DATABASE
    AUTH_SERVICE --> REDIS
```

## 🔗 API Base URL

```
http://localhost:3000/api
```

## 📚 Documentation Files

### 1. **Frontend Integration Guide** (`docs/FRONTEND-INTEGRATION-GUIDE.md`)
- Complete API endpoint documentation
- Frontend integration examples (React, Vue, Angular)
- Authentication flow diagrams
- Error handling patterns
- Security best practices

### 2. **API Documentation** (`docs/API-DOCUMENTATION.md`)
- Detailed endpoint specifications
- Request/response examples
- Error codes and messages
- Rate limiting information
- Testing guide

### 3. **Code Architecture** (`docs/CODE-ARCHITECTURE-DIAGRAM.md`)
- System architecture diagrams
- Module relationships
- Data flow diagrams
- Security architecture
- Performance considerations

### 4. **Postman Collection** (`docs/postman-collection.json`)
- Ready-to-import Postman collection
- Pre-configured environment variables
- Auto-token management
- Complete test scenarios

## 🚀 Quick Integration

### 1. Import Postman Collection
1. Open Postman
2. Import `docs/postman-collection.json`
3. Set environment variables:
   - `base_url`: `http://localhost:3000/api`
   - `access_token`: (auto-filled after login)
   - `refresh_token`: (auto-filled after login)

### 2. Test Authentication Flow
1. **Register User** → Check email for verification
2. **Verify Email** → Use token from email
3. **Login User** → Get access and refresh tokens
4. **Get Profile** → Test authenticated request
5. **Refresh Token** → Test token refresh
6. **Logout** → Test logout flow

### 3. Frontend Integration Example

#### TypeScript Auth Service
```typescript
class AuthService {
  private baseUrl = 'http://localhost:3000/api';
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  async login(email: string, password: string) {
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
    
    // Store tokens
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
    
    return data;
  }

  async refreshTokens() {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const response = await fetch(`${this.baseUrl}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: this.refreshToken })
    });
    
    if (!response.ok) {
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

  async logout() {
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
}
```

#### React Hook Example
```typescript
import { useState, useEffect, useCallback } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const authService = new AuthService();

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);
      setUser(response.user);
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  return { user, isAuthenticated, isLoading, login, logout };
};
```

## 🔐 Security Features

### Token Management
- **Access Tokens**: Short-lived (15 minutes), used for API requests
- **Refresh Tokens**: Long-lived (7 days), stored securely in Redis
- **Token Rotation**: New refresh token generated on each refresh
- **Automatic Refresh**: Handle token expiration seamlessly

### Account Security
- **Email Verification**: Required for account activation
- **Account Lockout**: Protection against brute force attacks
- **Password Strength**: Minimum 8 characters with complexity requirements
- **Security Alerts**: Email notifications for account changes

### Multi-Tenant Support
- **Tenant Isolation**: Complete data separation
- **Tenant Branding**: Customized emails and UI
- **Tenant Validation**: All operations validated against tenant

## 📊 API Endpoints Summary

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/verify-email` | Verify email address | No |
| POST | `/auth/resend-verification` | Resend verification email | No |
| POST | `/auth/login` | User login | No |
| POST | `/auth/refresh` | Refresh access token | No |
| POST | `/auth/forgot-password` | Request password reset | No |
| POST | `/auth/reset-password` | Reset password | No |
| POST | `/auth/change-password` | Change password | Yes |
| POST | `/auth/logout` | Logout user | No |

### User Management
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/users/profile` | Get user profile | Yes |
| PUT | `/users/profile` | Update user profile | Yes |

## 🧪 Testing

### 1. Postman Testing
- Import the collection and test all endpoints
- Verify authentication flows
- Test error handling
- Validate token refresh

### 2. Frontend Testing
- Test login/logout flows
- Verify token refresh
- Test error handling
- Validate user experience

## 🔧 Configuration

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

# Debug Configuration
DEBUG_ENABLED=true
LOG_LEVEL="debug"
```

## 🚀 Getting Started

### 1. Start the Backend
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Run database migrations
npx prisma migrate dev

# Start the application
npm run start:dev
```

### 2. Test the API
- Open Postman
- Import the collection
- Test the authentication flow
- Verify all endpoints work

### 3. Integrate with Frontend
- Use the provided examples
- Implement error handling
- Add token refresh logic
- Test thoroughly

## 📞 Support

### Documentation
- **Complete Guide**: `docs/FRONTEND-INTEGRATION-GUIDE.md`
- **API Reference**: `docs/API-DOCUMENTATION.md`
- **Architecture**: `docs/CODE-ARCHITECTURE-DIAGRAM.md`

### API Documentation
- **Swagger UI**: `http://localhost:3000/api/docs`
- **OpenAPI Spec**: `http://localhost:3000/api/docs-json`

### Troubleshooting
- Check the logs for detailed error information
- Verify environment variables are set correctly
- Test with Postman collection first
- Check database and Redis connections

## 🎉 What's Next?

The backend is ready for frontend integration! You can now:

1. **Build your authentication UI** using the provided examples
2. **Implement token management** with automatic refresh
3. **Add error handling** for all API responses
4. **Test thoroughly** with the Postman collection
5. **Deploy to production** with proper environment configuration

## 📝 Notes

- All API responses follow consistent error format
- Debug logging can be disabled in production
- Token refresh is handled automatically
- Multi-tenant support is built-in
- Security best practices are implemented

---

**Happy Coding! 🚀**

For any questions or issues, please refer to the comprehensive documentation in the `docs/` folder.
