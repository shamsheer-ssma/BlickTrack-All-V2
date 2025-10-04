# Role-Based Dashboard Architecture Documentation

## Table of Contents
1. [Overview](#overview)
2. [Architecture Decision](#architecture-decision)
3. [System Components](#system-components)
4. [Backend Implementation](#backend-implementation)
5. [Frontend Implementation](#frontend-implementation)
6. [User Roles & Permissions](#user-roles--permissions)
7. [API Endpoints](#api-endpoints)
8. [Database Schema](#database-schema)
9. [Security Considerations](#security-considerations)
10. [Deployment Guide](#deployment-guide)
11. [Testing Strategy](#testing-strategy)
12. [Troubleshooting](#troubleshooting)

## Overview

The BlickTrack platform implements a sophisticated **role-based dashboard system** that provides different user experiences based on user roles and permissions. This system ensures that users only see and can access features appropriate to their role within the organization.

### Key Features
- **Single Dashboard Component** with role-based conditional rendering
- **Dynamic Navigation** based on user permissions
- **Real-time Data Loading** with role-specific filtering
- **Responsive Design** for desktop and mobile
- **Secure Backend** with JWT authentication and role validation
- **Scalable Architecture** for easy addition of new roles

## Architecture Decision

### Why Single Dashboard vs Multiple Dashboards?

We chose a **single unified dashboard** approach over separate dashboard pages for the following reasons:

#### ✅ **Advantages of Single Dashboard:**
1. **Easier Maintenance** - One codebase, one set of components
2. **Consistent UX** - Same navigation structure, different content
3. **Better Performance** - No page reloads when switching contexts
4. **Simpler Routing** - No complex role-based routing logic
5. **Future-Proof** - Easy to add new roles or permissions
6. **Code Reusability** - Shared components and logic
7. **Unified State Management** - Single source of truth

#### ❌ **Disadvantages of Multiple Dashboards:**
1. **Code Duplication** - Similar components across different pages
2. **Maintenance Overhead** - Multiple codebases to maintain
3. **Inconsistent UX** - Different navigation patterns
4. **Complex Routing** - Role-based route protection
5. **State Synchronization** - Multiple state management systems

## System Components

### Backend Components
```
backend/src/dashboard/
├── dashboard.controller.ts    # Role-based API endpoints
├── dashboard.service.ts       # Business logic & data aggregation
└── dashboard.module.ts        # Module configuration
```

### Frontend Components
```
qk-test/src/components/dashboard/
├── UnifiedDashboard.tsx       # Main dashboard component
├── Sidebar.tsx               # Role-based navigation
├── DashboardLayout.tsx       # Layout wrapper
└── DashboardPage.tsx         # Legacy component (deprecated)
```

### API Integration
```
qk-test/src/lib/
├── api.ts                    # API service with role-based methods
└── theme.ts                  # Centralized theme system
```

## Backend Implementation

### Dashboard Controller

The `DashboardController` provides role-based API endpoints with JWT authentication and role validation:

```typescript
@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class DashboardController {
  @Get('stats')
  @Roles(UserRole.PLATFORM_ADMIN, UserRole.TENANT_ADMIN, UserRole.USER)
  async getStats(@Request() req) {
    return this.dashboardService.getRoleBasedStats(req.user);
  }
  
  @Get('navigation')
  @Roles(UserRole.PLATFORM_ADMIN, UserRole.TENANT_ADMIN, UserRole.USER)
  async getNavigation(@Request() req) {
    return this.dashboardService.getRoleBasedNavigation(req.user);
  }
  
  // ... other endpoints
}
```

### Dashboard Service

The `DashboardService` implements the core business logic with role-specific data aggregation:

```typescript
export class DashboardService {
  async getRoleBasedStats(user: any) {
    const userRole = user.role as UserRole;
    const tenantId = user.tenantId;

    switch (userRole) {
      case UserRole.PLATFORM_ADMIN:
        return this.getPlatformAdminStats();
      case UserRole.TENANT_ADMIN:
        return this.getTenantAdminStats(tenantId);
      case UserRole.USER:
        return this.getUserStats(tenantId, user.id);
      default:
        throw new Error('Invalid user role');
    }
  }
}
```

### Key Methods

#### Platform Admin Methods
- `getPlatformAdminStats()` - System-wide statistics
- `getPlatformAdminActivity()` - All tenant activities
- `getPlatformAdminProjects()` - All projects across tenants
- `getPlatformAdminSystemHealth()` - Complete system metrics

#### Tenant Admin Methods
- `getTenantAdminStats(tenantId)` - Tenant-specific statistics
- `getTenantAdminActivity(tenantId)` - Tenant activities only
- `getTenantAdminProjects(tenantId)` - Tenant projects only
- `getTenantAdminSystemHealth()` - Tenant system metrics

#### User Methods
- `getUserStats(tenantId, userId)` - Personal statistics
- `getUserActivity(tenantId, userId)` - Personal activities
- `getUserProjects(tenantId, userId)` - Assigned projects
- `getUserSystemHealth()` - Basic system status

## Frontend Implementation

### Unified Dashboard Component

The main dashboard component that adapts based on user role:

```typescript
export default function UnifiedDashboard() {
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>('');
  const [stats, setStats] = useState<DashboardStats>({});
  const [navigation, setNavigation] = useState<NavigationItem[]>([]);
  const [permissions, setPermissions] = useState<UserPermissions>({});

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    // Load all dashboard data in parallel
    const [statsData, navigationData, permissionsData] = await Promise.all([
      apiService.getRoleBasedStats(),
      apiService.getRoleBasedNavigation(),
      apiService.getUserPermissions(),
    ]);
    // ... set state
  };
}
```

### Role-Based Rendering

The dashboard renders different content based on user role:

```typescript
const renderStatsCards = () => {
  const cards = [];

  if (userRole === 'PLATFORM_ADMIN') {
    cards.push(
      { title: 'Total Tenants', value: stats.totalTenants || 0, icon: Building },
      { title: 'Total Users', value: stats.totalUsers || 0, icon: Users },
      { title: 'Security Alerts', value: stats.securityAlerts || 0, icon: AlertTriangle },
    );
  } else if (userRole === 'TENANT_ADMIN') {
    cards.push(
      { title: 'Total Users', value: stats.totalUsers || 0, icon: Users },
      { title: 'Active Projects', value: stats.activeProjects || 0, icon: TrendingUp },
    );
  } else {
    cards.push(
      { title: 'My Projects', value: stats.myProjects || 0, icon: Folder },
      { title: 'Notifications', value: stats.notifications || 0, icon: Bell },
    );
  }

  return cards.map((card, index) => (
    <div key={index} className="bg-white rounded-xl shadow-sm p-6">
      {/* Card content */}
    </div>
  ));
};
```

### Sidebar Navigation

Dynamic navigation based on user permissions:

```typescript
export default function Sidebar() {
  const [navigation, setNavigation] = useState<NavigationItem[]>([]);
  const [userRole, setUserRole] = useState<string>('');

  const loadNavigationData = async () => {
    const navigationData = await apiService.getRoleBasedNavigation();
    setNavigation(navigationData);
  };

  return (
    <nav className="flex-1 px-4 py-4 space-y-2">
      {navigation.map((item) => {
        const IconComponent = iconMap[item.icon];
        return (
          <button
            key={item.id}
            onClick={() => handleNavigation(item.path)}
            className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg"
          >
            <IconComponent className="w-5 h-5 mr-3" />
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}
```

## User Roles & Permissions

### Role Hierarchy

```
PLATFORM_ADMIN (Highest)
├── Full system access
├── Manage all tenants
├── Manage all users
└── System administration

TENANT_ADMIN (Middle)
├── Tenant-specific access
├── Manage tenant users
├── Tenant settings
└── Tenant analytics

USER (Lowest)
├── Personal dashboard
├── Assigned projects
├── Profile management
└── Notifications
```

### Permission Matrix

| Feature | Platform Admin | Tenant Admin | User |
|---------|---------------|--------------|------|
| View Dashboard | ✅ | ✅ | ✅ |
| View Projects | ✅ | ✅ | ✅ |
| View Reports | ✅ | ✅ | ✅ |
| Manage Platform | ✅ | ❌ | ❌ |
| Manage Tenants | ✅ | ❌ | ❌ |
| Manage All Users | ✅ | ❌ | ❌ |
| View System Health | ✅ | ✅ | ❌ |
| View Analytics | ✅ | ✅ | ❌ |
| Manage Tenant | ❌ | ✅ | ❌ |
| Manage Tenant Users | ❌ | ✅ | ❌ |
| Manage Profile | ✅ | ✅ | ✅ |
| View Notifications | ✅ | ✅ | ✅ |

### Navigation Menus

#### Platform Admin Navigation
```typescript
[
  { id: 'dashboard', label: 'Dashboard', icon: 'Home', path: '/dashboard' },
  { id: 'projects', label: 'Projects', icon: 'Folder', path: '/projects' },
  { id: 'reports', label: 'Reports', icon: 'FileText', path: '/reports' },
  { id: 'platform-admin', label: 'Platform Admin', icon: 'Settings', path: '/platform-admin' },
  { id: 'tenants', label: 'Tenants', icon: 'Building', path: '/tenants' },
  { id: 'users', label: 'All Users', icon: 'Users', path: '/users' },
  { id: 'system', label: 'System', icon: 'Monitor', path: '/system' },
  { id: 'analytics', label: 'Analytics', icon: 'BarChart', path: '/analytics' },
]
```

#### Tenant Admin Navigation
```typescript
[
  { id: 'dashboard', label: 'Dashboard', icon: 'Home', path: '/dashboard' },
  { id: 'projects', label: 'Projects', icon: 'Folder', path: '/projects' },
  { id: 'reports', label: 'Reports', icon: 'FileText', path: '/reports' },
  { id: 'tenant-admin', label: 'Tenant Admin', icon: 'Settings', path: '/tenant-admin' },
  { id: 'users', label: 'Users', icon: 'Users', path: '/tenant-users' },
  { id: 'settings', label: 'Settings', icon: 'Cog', path: '/settings' },
  { id: 'analytics', label: 'Analytics', icon: 'BarChart', path: '/tenant-analytics' },
]
```

#### User Navigation
```typescript
[
  { id: 'dashboard', label: 'Dashboard', icon: 'Home', path: '/dashboard' },
  { id: 'projects', label: 'Projects', icon: 'Folder', path: '/projects' },
  { id: 'reports', label: 'Reports', icon: 'FileText', path: '/reports' },
  { id: 'profile', label: 'Profile', icon: 'User', path: '/profile' },
  { id: 'notifications', label: 'Notifications', icon: 'Bell', path: '/notifications' },
]
```

## API Endpoints

### Dashboard Endpoints

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | `/api/v1/dashboard/stats` | Get role-based statistics | All |
| GET | `/api/v1/dashboard/activity` | Get role-based activity feed | All |
| GET | `/api/v1/dashboard/projects` | Get role-based projects | All |
| GET | `/api/v1/dashboard/health` | Get role-based system health | All |
| GET | `/api/v1/dashboard/navigation` | Get role-based navigation menu | All |
| GET | `/api/v1/dashboard/permissions` | Get user permissions | All |

### Request/Response Examples

#### Get Dashboard Stats
```http
GET /api/v1/dashboard/stats
Authorization: Bearer <jwt-token>
```

**Platform Admin Response:**
```json
{
  "totalTenants": 15,
  "totalUsers": 1250,
  "activeUsers": 1180,
  "totalProjects": 340,
  "activeProjects": 85,
  "completedProjects": 255,
  "securityAlerts": 12,
  "systemUptime": "99.9%",
  "dataProcessed": "2.4TB"
}
```

**Tenant Admin Response:**
```json
{
  "totalUsers": 45,
  "activeUsers": 42,
  "totalProjects": 28,
  "activeProjects": 12,
  "completedProjects": 16,
  "securityAlerts": 3,
  "tenantUptime": "99.8%",
  "dataProcessed": "156GB"
}
```

**User Response:**
```json
{
  "myProjects": 5,
  "activeProjects": 3,
  "completedProjects": 2,
  "notifications": 7,
  "tasksCompleted": 15,
  "tasksPending": 8
}
```

#### Get Navigation Menu
```http
GET /api/v1/dashboard/navigation
Authorization: Bearer <jwt-token>
```

**Response:**
```json
[
  {
    "id": "dashboard",
    "label": "Dashboard",
    "icon": "Home",
    "path": "/dashboard"
  },
  {
    "id": "projects",
    "label": "Projects",
    "icon": "Folder",
    "path": "/projects"
  }
]
```

## Database Schema

### User Role Enum
```sql
CREATE TYPE "UserRole" AS ENUM (
  'PLATFORM_ADMIN',
  'TENANT_ADMIN', 
  'USER'
);
```

### User Table
```sql
CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "firstName" TEXT NOT NULL,
  "lastName" TEXT NOT NULL,
  "role" "UserRole" NOT NULL DEFAULT 'USER',
  "tenantId" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
  "isVerified" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
```

### Tenant Table
```sql
CREATE TABLE "Tenant" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
);
```

### Project Table
```sql
CREATE TABLE "Project" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "status" TEXT NOT NULL DEFAULT 'PLANNING',
  "tenantId" TEXT NOT NULL,
  "createdById" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);
```

## Security Considerations

### Authentication & Authorization
1. **JWT Tokens** - All API requests require valid JWT tokens
2. **Role Validation** - Backend validates user roles on every request
3. **Tenant Isolation** - Users can only access their tenant's data
4. **Permission Checks** - Frontend and backend validate permissions

### Data Security
1. **SQL Injection Prevention** - Using Prisma ORM with parameterized queries
2. **XSS Protection** - React's built-in XSS protection
3. **CSRF Protection** - SameSite cookie attributes
4. **Input Validation** - Comprehensive input validation on all endpoints

### Access Control
1. **Role-Based Access Control (RBAC)** - Granular permission system
2. **Tenant Isolation** - Multi-tenant data separation
3. **API Rate Limiting** - Prevent abuse and DoS attacks
4. **Audit Logging** - Track all user actions

## Deployment Guide

### Prerequisites
- Node.js 18+ 
- PostgreSQL 13+
- Redis (optional, for caching)

### Backend Deployment
```bash
# Install dependencies
cd backend
npm install

# Set environment variables
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
npx prisma migrate deploy

# Start the server
npm run start:prod
```

### Frontend Deployment
```bash
# Install dependencies
cd qk-test
npm install

# Set environment variables
cp .env.local.example .env.local
# Edit .env.local with your configuration

# Build the application
npm run build

# Start the server
npm start
```

### Environment Variables

#### Backend (.env)
```env
DATABASE_URL="postgresql://username:password@localhost:5432/blicktrack"
JWT_SECRET="your-jwt-secret"
JWT_EXPIRES_IN="7d"
EMAIL_SMTP_HOST="smtp.example.com"
EMAIL_SMTP_PORT="587"
EMAIL_USER="noreply@blicktrack.com"
EMAIL_PASS="your-email-password"
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL="http://localhost:5000/api/v1"
NEXT_PUBLIC_SHOW_LANDING_PAGE="true"
NEXT_PUBLIC_COMPANY_NAME="BlickTrack"
NEXT_PUBLIC_SUPPORT_EMAIL="support@blicktrack.com"
NEXT_PUBLIC_API_TIMEOUT="30000"
```

## Testing Strategy

### Unit Tests
```bash
# Backend tests
cd backend
npm run test

# Frontend tests
cd qk-test
npm run test
```

### Integration Tests
```bash
# Backend integration tests
cd backend
npm run test:e2e

# Frontend integration tests
cd qk-test
npm run test:e2e
```

### Manual Testing Checklist

#### Platform Admin Testing
- [ ] Can view all tenants and users
- [ ] Can access system health metrics
- [ ] Can manage platform settings
- [ ] Can view analytics across all tenants

#### Tenant Admin Testing
- [ ] Can view tenant-specific data only
- [ ] Can manage tenant users
- [ ] Can access tenant analytics
- [ ] Cannot access other tenant data

#### User Testing
- [ ] Can view personal dashboard only
- [ ] Can see assigned projects
- [ ] Can manage profile
- [ ] Cannot access admin features

## Troubleshooting

### Common Issues

#### 1. Dashboard Not Loading
**Symptoms:** Blank dashboard or loading spinner
**Causes:**
- Invalid JWT token
- Network connectivity issues
- Backend server not running

**Solutions:**
```bash
# Check backend status
curl http://localhost:5000/api/v1/health

# Check JWT token
localStorage.getItem('token')

# Restart backend
cd backend && npm run start:dev
```

#### 2. Permission Denied Errors
**Symptoms:** 403 Forbidden errors
**Causes:**
- Insufficient user role
- Invalid permissions
- Token expired

**Solutions:**
```bash
# Check user role in database
SELECT role FROM "User" WHERE email = 'user@example.com';

# Verify JWT token
jwt.decode(token)

# Refresh token
apiService.refreshToken()
```

#### 3. Data Not Loading
**Symptoms:** Empty stats or missing data
**Causes:**
- Database connection issues
- Missing tenant data
- Incorrect user associations

**Solutions:**
```bash
# Check database connection
npx prisma db pull

# Verify tenant data
SELECT * FROM "Tenant";

# Check user-tenant association
SELECT u.email, t.name FROM "User" u 
JOIN "Tenant" t ON u."tenantId" = t.id;
```

### Debug Mode

Enable debug logging:

```typescript
// Backend
const logger = new Logger('DashboardService');
logger.debug('Loading dashboard data', { userId, role });

// Frontend
console.log('Dashboard data:', { stats, navigation, permissions });
```

### Performance Monitoring

Monitor dashboard performance:

```typescript
// API response times
const startTime = Date.now();
const data = await apiService.getRoleBasedStats();
const responseTime = Date.now() - startTime;
console.log(`API response time: ${responseTime}ms`);
```

## Future Enhancements

### Planned Features
1. **Real-time Updates** - WebSocket integration for live data
2. **Advanced Analytics** - More detailed reporting and charts
3. **Custom Dashboards** - User-configurable dashboard layouts
4. **Mobile App** - React Native mobile application
5. **API Versioning** - Backward compatibility for API changes

### Scalability Considerations
1. **Caching Layer** - Redis for frequently accessed data
2. **Database Optimization** - Indexing and query optimization
3. **CDN Integration** - Static asset delivery
4. **Load Balancing** - Multiple backend instances
5. **Microservices** - Split into smaller, focused services

---

## Conclusion

The role-based dashboard system provides a robust, scalable, and secure foundation for the BlickTrack platform. By implementing a single dashboard with conditional rendering, we've achieved the perfect balance of maintainability, user experience, and security.

For questions or support, please contact the development team or refer to the API documentation at `http://localhost:5000/api/docs`.
