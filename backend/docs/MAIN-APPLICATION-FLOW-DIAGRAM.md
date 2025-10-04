# BlickTrack Backend - Main Application Flow Diagram

## Complete System Flow Visualization

This document provides visual flow diagrams showing the complete application flow, request processing, and system interactions in the BlickTrack Backend API.

---

## 1. Application Startup Flow

```mermaid
graph TD
    A[main.ts - Application Bootstrap] --> B[Load Environment Variables]
    B --> C[Initialize NestJS Application]
    C --> D[Configure Security Middleware - Helmet]
    D --> E[Setup CORS Configuration]
    E --> F[Configure Global Validation Pipe]
    F --> G[Setup Swagger Documentation]
    G --> H[Initialize AppModule]
    H --> I[Load All Submodules]
    I --> J[Connect to Database - Prisma]
    J --> K[Start Server on Port 3001]
    K --> L[API Ready - /api/docs Available]
    
    style A fill:#e1f5fe
    style L fill:#c8e6c9
```

---

## 2. HTTP Request Processing Flow

```mermaid
graph TD
    A[HTTP Request Received] --> B[Rate Limiting Check - Throttler]
    B --> C{CORS Validation}
    C -->|Pass| D[Global Validation Pipe]
    C -->|Fail| E[Return CORS Error]
    D --> F[Route Resolution]
    F --> G[Authentication Guard - JWT]
    G --> H{Valid JWT Token?}
    H -->|No| I[Return 401 Unauthorized]
    H -->|Yes| J[Role Guard Check - RBAC]
    J --> K{Has Required Role?}
    K -->|No| L[Return 403 Forbidden]
    K -->|Yes| M[Controller Method Execution]
    M --> N[Service Layer Business Logic]
    N --> O[Database Operations - Prisma]
    O --> P[Response Generation]
    P --> Q[Return JSON Response]
    
    style A fill:#e3f2fd
    style Q fill:#c8e6c9
    style E fill:#ffcdd2
    style I fill:#ffcdd2
    style L fill:#ffcdd2
```

---

## 3. Authentication Flow

```mermaid
graph TD
    A[User Login Request] --> B[AuthController.login]
    B --> C[AuthService.login]
    C --> D[Validate User Credentials]
    D --> E{Valid Credentials?}
    E -->|No| F[Handle Failed Login]
    F --> G[Check Account Lockout]
    G --> H[Return 401 Unauthorized]
    E -->|Yes| I[Check Account Status]
    I --> J{Account Active?}
    J -->|No| K[Return 401 Unauthorized]
    J -->|Yes| L[Generate JWT Tokens]
    L --> M[Create Refresh Token]
    M --> N[Log Successful Login]
    N --> O[Return AuthResponse with Tokens]
    
    P[User Registration Request] --> Q[AuthController.register]
    Q --> R[AuthService.register]
    R --> S[Validate Input Data]
    S --> T[Check Email Uniqueness]
    T --> U{Email Exists?}
    U -->|Yes| V[Return 409 Conflict]
    U -->|No| W[Hash Password with bcrypt]
    W --> X[Create User in Database]
    X --> Y[Generate Email Verification Token]
    Y --> Z[Send Verification Email]
    Z --> AA[Generate JWT Tokens]
    AA --> BB[Return AuthResponse]
    
    style O fill:#c8e6c9
    style BB fill:#c8e6c9
    style H fill:#ffcdd2
    style K fill:#ffcdd2
    style V fill:#ffcdd2
```

---

## 4. Tenant Management Flow

```mermaid
graph TD
    A[Tenant Creation Request] --> B[TenantsController.createTenant]
    B --> C[TenantsService.createTenant]
    C --> D[Validate Input Data]
    D --> E[Check Slug Uniqueness]
    E --> F{Slug Exists?}
    F -->|Yes| G[Return 409 Conflict]
    F -->|No| H[Check Domain Uniqueness]
    H --> I{Domain Exists?}
    I -->|Yes| J[Return 409 Conflict]
    I -->|No| K[Create Tenant Record]
    K --> L[Set Default Configuration]
    L --> M[Create Default Feature Flags]
    M --> N[Return TenantResponseDto]
    
    O[Tenant Configuration Request] --> P[TenantConfigurationController]
    P --> Q[TenantConfigurationService]
    Q --> R[Find Tenant by ID]
    R --> S{Tenant Exists?}
    S -->|No| T[Return 404 Not Found]
    S -->|Yes| U[Get/Create Configuration]
    U --> V[Apply Configuration Updates]
    V --> W[Save to Database]
    W --> X[Return Configuration Response]
    
    style N fill:#c8e6c9
    style X fill:#c8e6c9
    style G fill:#ffcdd2
    style J fill:#ffcdd2
    style T fill:#ffcdd2
```

---

## 5. User Management Flow

```mermaid
graph TD
    A[User Management Request] --> B[UsersController]
    B --> C[UsersService]
    C --> D[Validate Request Data]
    D --> E[Check User Permissions]
    E --> F{Has Permission?}
    F -->|No| G[Return 403 Forbidden]
    F -->|Yes| H[Execute Database Operation]
    H --> I[Apply Business Logic]
    I --> J[Format Response Data]
    J --> K[Log Operation]
    K --> L[Return User Response]
    
    M[User Creation] --> N[Validate User Data]
    N --> O[Check Email Uniqueness]
    O --> P[Hash Password]
    P --> Q[Create User Record]
    Q --> R[Set Default Permissions]
    R --> S[Send Welcome Email]
    S --> T[Return User Response]
    
    style L fill:#c8e6c9
    style T fill:#c8e6c9
    style G fill:#ffcdd2
```

---

## 6. Dashboard Data Flow

```mermaid
graph TD
    A[Dashboard Request] --> B[DashboardController]
    B --> C[DashboardService]
    C --> D[Query User Statistics]
    D --> E[Query Project Statistics]
    E --> F[Query Security Statistics]
    F --> G[Query Activity Feed]
    G --> H[Aggregate Dashboard Data]
    H --> I[Format Response]
    I --> J[Return Dashboard Stats]
    
    K[Activity Feed Request] --> L[Query Recent Activities]
    L --> M[Apply Pagination]
    M --> N[Format Activity Data]
    N --> O[Return Activity Feed]
    
    style J fill:#c8e6c9
    style O fill:#c8e6c9
```

---

## 7. Admin Operations Flow

```mermaid
graph TD
    A[Platform Admin Request] --> B[PlatformAdminController]
    B --> C[PlatformAdminService]
    C --> D[Cross-Tenant Operations]
    D --> E[System Metrics Collection]
    E --> F[Global User Management]
    F --> G[Platform Health Check]
    G --> H[Return Admin Data]
    
    I[Tenant Admin Request] --> J[TenantAdminController]
    J --> K[TenantAdminService]
    K --> L[Tenant-Scoped Operations]
    L --> M[User Management within Tenant]
    M --> N[Tenant Configuration]
    N --> O[Department Management]
    O --> P[Return Tenant Data]
    
    style H fill:#c8e6c9
    style P fill:#c8e6c9
```

---

## 8. Database Operations Flow

```mermaid
graph TD
    A[Service Method Call] --> B[PrismaService]
    B --> C[Build Prisma Query]
    C --> D[Execute Database Query]
    D --> E[Database Response]
    E --> F[Data Transformation]
    F --> G[Return Formatted Data]
    G --> H[Controller Response]
    
    I[Database Connection] --> J[Prisma Client]
    J --> K[Connection Pool]
    K --> L[Query Execution]
    L --> M[Result Processing]
    M --> N[Connection Cleanup]
    
    style G fill:#c8e6c9
    style H fill:#c8e6c9
```

---

## 9. Error Handling Flow

```mermaid
graph TD
    A[Error Occurs] --> B{Error Type?}
    B -->|Validation Error| C[400 Bad Request]
    B -->|Authentication Error| D[401 Unauthorized]
    B -->|Authorization Error| E[403 Forbidden]
    B -->|Not Found Error| F[404 Not Found]
    B -->|Conflict Error| G[409 Conflict]
    B -->|Server Error| H[500 Internal Server Error]
    
    C --> I[Log Error Details]
    D --> I
    E --> I
    F --> I
    G --> I
    H --> I
    
    I --> J[Format Error Response]
    J --> K[Return Error to Client]
    
    style K fill:#ffcdd2
```

---

## 10. Email Service Flow

```mermaid
graph TD
    A[Email Request] --> B[EmailService]
    B --> C[Create SMTP Transporter]
    C --> D[Validate Email Data]
    D --> E[Apply Email Template]
    E --> F[Send Email via SMTP]
    F --> G{Email Sent Successfully?}
    G -->|Yes| H[Log Success]
    G -->|No| I[Retry Logic]
    I --> J{Max Retries Reached?}
    J -->|No| F
    J -->|Yes| K[Log Failure]
    H --> L[Return Success Response]
    K --> M[Return Error Response]
    
    style L fill:#c8e6c9
    style M fill:#ffcdd2
```

---

## 11. Logging Flow

```mermaid
graph TD
    A[Service Method] --> B[LoggerService]
    B --> C{Debug Enabled?}
    C -->|Yes| D[Log Debug Message]
    C -->|No| E[Skip Debug Log]
    D --> F[Format Log Message]
    E --> G[Check Log Level]
    F --> G
    G --> H{Log Level Met?}
    H -->|Yes| I[Output to Console]
    H -->|No| J[Skip Logging]
    I --> K[Add Context Information]
    K --> L[Log with Timestamp]
    
    style L fill:#c8e6c9
```

---

## 12. Multi-Tenant Data Flow

```mermaid
graph TD
    A[Request with Tenant Context] --> B[Extract Tenant ID]
    B --> C[Add Tenant Filter to Query]
    C --> D[Execute Database Query]
    D --> E[Filter Results by Tenant]
    E --> F[Return Tenant-Specific Data]
    
    G[Cross-Tenant Request] --> H[Check Admin Permissions]
    H --> I{Has Cross-Tenant Access?}
    I -->|No| J[Return 403 Forbidden]
    I -->|Yes| K[Execute Cross-Tenant Query]
    K --> L[Return Cross-Tenant Data]
    
    style F fill:#c8e6c9
    style L fill:#c8e6c9
    style J fill:#ffcdd2
```

---

## 13. Security Flow

```mermaid
graph TD
    A[Request with JWT] --> B[Extract Token from Header]
    B --> C[Verify Token Signature]
    C --> D{Token Valid?}
    D -->|No| E[Return 401 Unauthorized]
    D -->|Yes| F[Check Token Expiration]
    F --> G{Token Expired?}
    G -->|Yes| H[Return 401 Unauthorized]
    G -->|No| I[Extract User Information]
    I --> J[Check User Status]
    J --> K{User Active?}
    K -->|No| L[Return 401 Unauthorized]
    K -->|Yes| M[Check User Role]
    M --> N{Has Required Role?}
    N -->|No| O[Return 403 Forbidden]
    N -->|Yes| P[Allow Request]
    
    style P fill:#c8e6c9
    style E fill:#ffcdd2
    style H fill:#ffcdd2
    style L fill:#ffcdd2
    style O fill:#ffcdd2
```

---

## 14. Complete Request Lifecycle

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
    
    N[Error Handling] --> O[Error Classification]
    O --> P[Error Logging]
    P --> Q[Error Response]
    Q --> R[Client Error Handling]
    
    style M fill:#c8e6c9
    style R fill:#ffcdd2
```

---

## Key Flow Patterns

### 1. **Request Processing Pattern**
- Rate Limiting → CORS → Validation → Authentication → Authorization → Controller → Service → Database → Response

### 2. **Authentication Pattern**
- Credentials → Validation → Token Generation → Response

### 3. **Database Pattern**
- Service Method → Prisma Query → Database → Data Transformation → Response

### 4. **Error Handling Pattern**
- Error Occurrence → Classification → Logging → Response Formatting → Client Notification

### 5. **Multi-Tenant Pattern**
- Request → Tenant Extraction → Tenant Filtering → Tenant-Specific Data → Response

### 6. **Admin Pattern**
- Admin Request → Permission Check → Cross-Tenant Operations → Admin Data → Response

---

This comprehensive flow diagram documentation shows exactly how the BlickTrack Backend API processes requests, handles authentication, manages data, and provides responses. Each flow is color-coded for easy understanding and includes error handling paths.
