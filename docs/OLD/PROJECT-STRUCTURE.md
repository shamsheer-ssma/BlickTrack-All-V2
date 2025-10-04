# BlickTrack Backend - Project Structure

## 📁 **COMPLETE FOLDER STRUCTURE**

```
backend/src/
├── 🔐 auth/                           # Authentication Module
│   ├── dto/                           # Data Transfer Objects
│   │   └── auth.dto.ts               # Login, Register, Reset DTOs
│   ├── guards/                        # Authentication Guards
│   │   ├── jwt-auth.guard.ts         # JWT Authentication Guard
│   │   └── roles.guard.ts            # Role-Based Access Guard
│   ├── strategies/                    # Passport Strategies
│   │   └── jwt.strategy.ts           # JWT Strategy Implementation
│   ├── auth.controller.ts             # Auth API Endpoints
│   ├── auth.service.ts               # Auth Business Logic
│   └── auth.module.ts                # Auth Module Configuration
│
├── 👥 users/                          # User Management Module
│   ├── dto/                          # User-related DTOs
│   ├── users.controller.ts           # User API Endpoints
│   ├── users.service.ts              # User Business Logic
│   └── users.module.ts               # User Module Configuration
│
├── 🏢 tenants/                        # Multi-Tenant Module
│   ├── dto/                          # Tenant-related DTOs
│   ├── tenants.controller.ts         # Tenant API Endpoints
│   ├── tenants.service.ts            # Tenant Business Logic
│   └── tenants.module.ts             # Tenant Module Configuration
│
├── 👑 admin/                          # Platform Admin Module
│   ├── dto/                          # Admin-related DTOs
│   ├── admin.controller.ts           # Admin API Endpoints
│   ├── admin.service.ts              # Admin Business Logic
│   └── admin.module.ts               # Admin Module Configuration
│
├── 📦 sbom/                           # SBOM Management Module (Phase 1)
│   ├── dto/                          # SBOM-related DTOs
│   ├── sbom.controller.ts            # SBOM API Endpoints
│   ├── sbom.service.ts               # SBOM Business Logic
│   └── sbom.module.ts                # SBOM Module Configuration
│
├── 🎯 threat-modeling/                # Threat Modeling Module (Phase 1)
│   ├── dto/                          # Threat Model DTOs
│   ├── threat-modeling.controller.ts # Threat Model API Endpoints
│   ├── threat-modeling.service.ts    # Threat Model Business Logic
│   └── threat-modeling.module.ts     # Threat Model Module Configuration
│
├── 📊 audit/                          # Audit Logging Module
│   ├── dto/                          # Audit-related DTOs
│   ├── audit.controller.ts           # Audit API Endpoints
│   ├── audit.service.ts              # Audit Business Logic
│   └── audit.module.ts               # Audit Module Configuration
│
├── 📧 email/                          # Email Service Module
│   ├── templates/                    # Email Templates
│   ├── email.service.ts              # Email Business Logic
│   └── email.module.ts               # Email Module Configuration
│
├── 🔧 common/                         # Shared Common Module
│   ├── constants/                    # Application Constants
│   │   └── index.ts                  # All constants (AUTH, RBAC, API, etc.)
│   │
│   ├── decorators/                   # Custom Decorators
│   │   ├── current-user.decorator.ts # Get current user from request
│   │   └── roles.decorator.ts        # Role-based access decorator
│   │
│   ├── filters/                      # Exception Filters
│   │   └── http-exception.filter.ts  # Global exception handling
│   │
│   ├── guards/                       # Custom Guards (if needed)
│   │
│   ├── interceptors/                 # Request/Response Interceptors
│   │   └── logging.interceptor.ts    # Request/response logging
│   │
│   ├── middleware/                   # Custom Middleware
│   │   ├── authentication.middleware.ts # JWT authentication
│   │   ├── rbac.middleware.ts        # Role-based access control
│   │   └── audit.middleware.ts       # Audit logging middleware
│   │
│   ├── pipes/                        # Validation Pipes
│   │   └── validation.pipes.ts       # Custom validation pipes
│   │
│   └── utils/                        # Utility Functions
│       └── index.ts                  # Password, Token, Validation utils
│
├── 🗄️ prisma/                        # Database Module
│   ├── prisma.service.ts             # Prisma Client Service
│   └── prisma.module.ts              # Prisma Module Configuration
│
├── ⚙️ config/                         # Configuration Module
│   └── app-config.service.ts         # Environment configuration service
│
├── 📱 main.ts                         # Application Bootstrap
├── app.module.ts                     # Root Application Module
├── app.controller.ts                 # Root Controller
└── app.service.ts                    # Root Service
```

## 🔍 **MODULE RESPONSIBILITIES**

### **🔐 Authentication Module (`/auth`)**
- User registration, login, logout
- Password reset & email verification
- JWT token generation & validation
- Account lockout & security policies
- MFA setup & validation (future)

### **👥 User Management Module (`/users`)**
- User CRUD operations
- Profile management
- User search & filtering
- User role assignment

### **🏢 Tenant Management Module (`/tenants`)**
- Multi-tenant CRUD operations
- Tenant configuration management
- SSO setup & management
- User-tenant associations

### **👑 Platform Admin Module (`/admin`)**
- Cross-tenant user management
- Platform analytics & reporting
- System configuration
- License & feature management

### **📦 SBOM Module (`/sbom`)**
- SBOM file upload & parsing
- Component vulnerability analysis
- SBOM visualization & reporting
- Risk scoring & assessment

### **🎯 Threat Modeling Module (`/threat-modeling`)**
- Threat model creation & management
- Risk assessment workflows
- Collaborative threat analysis
- Integration with SBOM data

### **📊 Audit Module (`/audit`)**
- Security event logging
- User activity tracking
- Compliance reporting
- Audit trail management

### **📧 Email Module (`/email`)**
- Transactional email sending
- Email template management
- Email verification workflows
- Notification preferences

### **🔧 Common Module (`/common`)**
- Shared utilities & constants
- Authentication & authorization middleware
- Global exception handling
- Request/response transformation

## 🛡️ **SECURITY LAYERS**

### **1. Authentication Middleware**
```typescript
// Validates JWT tokens on protected routes
AuthenticationMiddleware → JwtStrategy → User Context
```

### **2. RBAC Middleware**
```typescript
// Enforces role-based permissions
RBACMiddleware → Role Check → Resource Access Control
```

### **3. Audit Middleware** 
```typescript
// Logs all security-relevant actions
AuditMiddleware → Action Logging → Compliance Trail
```

### **4. Global Exception Filter**
```typescript
// Handles all errors securely
GlobalExceptionFilter → Error Sanitization → Safe Responses
```

## 🚀 **API STRUCTURE**

### **Base URL:** `http://localhost:3001/api/v1`

### **Authentication Endpoints:**
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `POST /auth/forgot-password` - Password reset request
- `POST /auth/reset-password` - Password reset with token
- `POST /auth/verify-email` - Email verification
- `PATCH /auth/change-password` - Change password
- `GET /auth/profile` - Get user profile

### **Admin Endpoints (Future):**
- `GET /admin/users` - List all users
- `POST /admin/tenants` - Create tenant
- `GET /admin/analytics` - Platform analytics

### **SBOM Endpoints (Future):**
- `POST /sbom/upload` - Upload SBOM file
- `GET /sbom` - List user's SBOMs
- `GET /sbom/:id` - Get SBOM details
- `GET /sbom/:id/vulnerabilities` - Get vulnerabilities

## 📋 **IMPLEMENTATION STATUS**

### ✅ **COMPLETED:**
- Complete folder structure
- Authentication system with JWT
- RBAC middleware & guards
- Audit logging middleware
- Global exception handling
- Utility functions & constants
- Database schema (Prisma)
- API documentation (Swagger)
- Security middleware (Helmet, CORS, Rate Limiting)

### 🚧 **NEXT PHASE:**
- User management endpoints
- Tenant management endpoints  
- Platform admin endpoints
- SBOM upload & analysis
- Threat modeling workflows
- Email service integration
- MFA implementation

## 🎯 **ARCHITECTURE BENEFITS**

1. **Modular Design** - Each feature is self-contained
2. **Scalable Structure** - Easy to add new modules
3. **Security First** - Multiple security layers
4. **Enterprise Ready** - Professional error handling
5. **Maintainable** - Clear separation of concerns
6. **Testable** - Each module can be tested independently

This structure follows NestJS best practices and enterprise-grade architecture patterns. Each module is independent, secure, and ready for scaling.