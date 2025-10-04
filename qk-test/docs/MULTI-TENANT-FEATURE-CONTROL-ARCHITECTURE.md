# Multi-Tenant Feature Control Architecture

## Table of Contents
1. [Overview](#overview)
2. [Architecture Layers](#architecture-layers)
3. [Permission Matrix](#permission-matrix)
4. [Database Schema](#database-schema)
5. [Implementation Strategy](#implementation-strategy)
6. [Code Examples](#code-examples)
7. [Complexity Management](#complexity-management)
8. [Visual Diagrams](#visual-diagrams)

## Overview

This document explains how BlickTrack handles **multi-tenant feature control** in a single dashboard while maintaining simplicity and scalability. The system supports:

- **Multiple SaaS Features**: Threat Modeling, SBOM Generation, Security Training, etc.
- **Tenant-Specific Features**: Each organization buys only what they need
- **Role-Based Access**: Platform Admin, Tenant Admin, User
- **Dynamic UI**: Features appear/disappear based on permissions
- **Data Isolation**: Users only see their tenant's data

## Architecture Layers

### Layer 1: User Role (RBAC)
```
PLATFORM_ADMIN
├── Can see ALL tenants
├── Can manage ALL features
└── Can access ALL data

TENANT_ADMIN
├── Can see ONLY their tenant
├── Can manage tenant features
└── Can access tenant data

USER
├── Can see ONLY their data
├── Can use assigned features
└── Cannot manage anything
```

### Layer 2: Tenant Features (FBAC)
```
Tenant A (Bought: Threat Modeling + SBOM)
├── Users see: Threat Modeling, SBOM
└── Users don't see: Security Training, Compliance

Tenant B (Bought: All Features)
├── Users see: All features
└── Full access to everything

Tenant C (Bought: Security Training only)
├── Users see: Security Training
└── Users don't see: Threat Modeling, SBOM, Compliance
```

### Layer 3: Data Isolation
```
Platform Admin Dashboard:
├── Tenant A: 45 users, 12 projects
├── Tenant B: 120 users, 28 projects
└── Tenant C: 23 users, 8 projects

Tenant Admin Dashboard (Tenant A):
├── Users: 45 users (only Tenant A)
├── Projects: 12 projects (only Tenant A)
└── Features: Threat Modeling, SBOM

User Dashboard (Tenant A):
├── My Projects: 3 projects (assigned to me)
├── My Tasks: 15 tasks
└── Available Features: Threat Modeling, SBOM
```

## Permission Matrix

| Feature | Platform Admin | Tenant Admin | User | Tenant A | Tenant B | Tenant C |
|---------|---------------|--------------|------|----------|----------|----------|
| **Threat Modeling** | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **SBOM Generation** | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Security Training** | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| **Compliance** | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ |
| **Manage Tenants** | ✅ | ❌ | ❌ | N/A | N/A | N/A |
| **Manage Users** | ✅ | ✅ | ❌ | N/A | N/A | N/A |
| **View All Data** | ✅ | ❌ | ❌ | N/A | N/A | N/A |

## Database Schema

### Core Tables
```sql
-- Users table
CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "role" "UserRole" NOT NULL,
  "tenantId" TEXT NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- Tenants table
CREATE TABLE "Tenant" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
);

-- Features table (available features)
CREATE TABLE "Feature" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "description" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  CONSTRAINT "Feature_pkey" PRIMARY KEY ("id")
);

-- Tenant-Feature mapping (what each tenant has access to)
CREATE TABLE "TenantFeature" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL,
  "featureId" TEXT NOT NULL,
  "isEnabled" BOOLEAN NOT NULL DEFAULT true,
  "purchasedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "expiresAt" TIMESTAMP(3),
  CONSTRAINT "TenantFeature_pkey" PRIMARY KEY ("id")
);

-- User-Feature permissions (granular control)
CREATE TABLE "UserFeaturePermission" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "featureId" TEXT NOT NULL,
  "canView" BOOLEAN NOT NULL DEFAULT false,
  "canEdit" BOOLEAN NOT NULL DEFAULT false,
  "canDelete" BOOLEAN NOT NULL DEFAULT false,
  CONSTRAINT "UserFeaturePermission_pkey" PRIMARY KEY ("id")
);
```

### Sample Data
```sql
-- Features
INSERT INTO "Feature" VALUES 
('feat-1', 'Threat Modeling', 'threat-modeling', 'Advanced threat modeling capabilities'),
('feat-2', 'SBOM Generation', 'sbom-generation', 'Software Bill of Materials generation'),
('feat-3', 'Security Training', 'security-training', 'Employee security training platform'),
('feat-4', 'Compliance', 'compliance', 'Compliance management and reporting');

-- Tenant Features
INSERT INTO "TenantFeature" VALUES 
('tf-1', 'tenant-a', 'feat-1', true, '2024-01-01', null),
('tf-2', 'tenant-a', 'feat-2', true, '2024-01-01', null),
('tf-3', 'tenant-b', 'feat-1', true, '2024-01-01', null),
('tf-4', 'tenant-b', 'feat-2', true, '2024-01-01', null),
('tf-5', 'tenant-b', 'feat-3', true, '2024-01-01', null),
('tf-6', 'tenant-b', 'feat-4', true, '2024-01-01', null),
('tf-7', 'tenant-c', 'feat-3', true, '2024-01-01', null);
```

## Implementation Strategy

### 1. Backend Service Layer

```typescript
// backend/src/dashboard/dashboard.service.ts
export class DashboardService {
  async getRoleBasedStats(user: any) {
    const userRole = user.role as UserRole;
    const tenantId = user.tenantId;

    // Get tenant features
    const tenantFeatures = await this.getTenantFeatures(tenantId);
    
    // Get user permissions
    const userPermissions = await this.getUserPermissions(user.id);

    switch (userRole) {
      case UserRole.PLATFORM_ADMIN:
        return this.getPlatformAdminStats(tenantFeatures);
      case UserRole.TENANT_ADMIN:
        return this.getTenantAdminStats(tenantId, tenantFeatures);
      case UserRole.USER:
        return this.getUserStats(tenantId, user.id, tenantFeatures, userPermissions);
    }
  }

  async getTenantFeatures(tenantId: string) {
    return this.prisma.tenantFeature.findMany({
      where: { 
        tenantId,
        isEnabled: true 
      },
      include: {
        feature: true
      }
    });
  }

  async getUserPermissions(userId: string) {
    return this.prisma.userFeaturePermission.findMany({
      where: { userId },
      include: {
        feature: true
      }
    });
  }
}
```

### 2. Frontend Permission Hook

```typescript
// qk-test/src/hooks/usePermissions.ts
export function usePermissions() {
  const [user, setUser] = useState<any>(null);
  const [tenantFeatures, setTenantFeatures] = useState<Feature[]>([]);
  const [userPermissions, setUserPermissions] = useState<Permission[]>([]);

  const canAccessFeature = (featureSlug: string) => {
    if (!user || !tenantFeatures.length) return false;
    
    // Platform admin can access everything
    if (user.role === 'PLATFORM_ADMIN') return true;
    
    // Check if tenant has this feature
    const tenantHasFeature = tenantFeatures.some(
      tf => tf.feature.slug === featureSlug && tf.isEnabled
    );
    
    if (!tenantHasFeature) return false;
    
    // For users, check individual permissions
    if (user.role === 'USER') {
      const permission = userPermissions.find(
        p => p.feature.slug === featureSlug
      );
      return permission?.canView || false;
    }
    
    // Tenant admin can access all tenant features
    return true;
  };

  const canEditFeature = (featureSlug: string) => {
    if (!user || !tenantFeatures.length) return false;
    
    if (user.role === 'PLATFORM_ADMIN') return true;
    if (user.role === 'TENANT_ADMIN') return true;
    
    if (user.role === 'USER') {
      const permission = userPermissions.find(
        p => p.feature.slug === featureSlug
      );
      return permission?.canEdit || false;
    }
    
    return false;
  };

  return {
    canAccessFeature,
    canEditFeature,
    tenantFeatures,
    userPermissions
  };
}
```

### 3. Dynamic Dashboard Component

```typescript
// qk-test/src/components/dashboard/UnifiedDashboard.tsx
export default function UnifiedDashboard() {
  const { canAccessFeature, tenantFeatures } = usePermissions();
  const [user, setUser] = useState<any>(null);

  const renderFeatureCards = () => {
    const availableFeatures = tenantFeatures.filter(tf => 
      canAccessFeature(tf.feature.slug)
    );

    return availableFeatures.map(feature => (
      <FeatureCard
        key={feature.feature.id}
        title={feature.feature.name}
        description={feature.feature.description}
        icon={getFeatureIcon(feature.feature.slug)}
        href={`/${feature.feature.slug}`}
        canEdit={canEditFeature(feature.feature.slug)}
      />
    ));
  };

  const renderNavigation = () => {
    const navigationItems = [
      { id: 'dashboard', label: 'Dashboard', icon: 'Home', path: '/dashboard' },
      { id: 'projects', label: 'Projects', icon: 'Folder', path: '/projects' },
      { id: 'reports', label: 'Reports', icon: 'FileText', path: '/reports' },
    ];

    // Add feature-specific navigation
    tenantFeatures.forEach(tf => {
      if (canAccessFeature(tf.feature.slug)) {
        navigationItems.push({
          id: tf.feature.slug,
          label: tf.feature.name,
          icon: getFeatureIcon(tf.feature.slug),
          path: `/${tf.feature.slug}`
        });
      }
    });

    // Add role-specific navigation
    if (user?.role === 'PLATFORM_ADMIN') {
      navigationItems.push(
        { id: 'platform-admin', label: 'Platform Admin', icon: 'Settings', path: '/platform-admin' },
        { id: 'tenants', label: 'Tenants', icon: 'Building', path: '/tenants' }
      );
    } else if (user?.role === 'TENANT_ADMIN') {
      navigationItems.push(
        { id: 'tenant-admin', label: 'Tenant Admin', icon: 'Settings', path: '/tenant-admin' }
      );
    }

    return navigationItems;
  };

  return (
    <div className="flex h-screen">
      <Sidebar navigation={renderNavigation()} />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {renderStatsCards()}
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {renderFeatureCards()}
        </div>
      </main>
    </div>
  );
}
```

## Complexity Management

### 1. **Separation of Concerns**
- **Backend**: Handles business logic and data filtering
- **Frontend**: Handles UI rendering and user interactions
- **Database**: Stores permissions and feature mappings

### 2. **Layered Architecture**
```
┌─────────────────────────────────────┐
│           Frontend Layer            │
│  - Dynamic UI Rendering             │
│  - Permission Hooks                 │
│  - Component Logic                  │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│           Service Layer             │
│  - Permission Logic                 │
│  - Feature Filtering                │
│  - Data Aggregation                 │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│           Data Layer                │
│  - User Roles                       │
│  - Tenant Features                  │
│  - User Permissions                 │
└─────────────────────────────────────┘
```

### 3. **Caching Strategy**
```typescript
// Cache permissions to avoid repeated database calls
const [permissionsCache, setPermissionsCache] = useState<Map<string, any>>(new Map());

const getCachedPermissions = (userId: string) => {
  if (permissionsCache.has(userId)) {
    return permissionsCache.get(userId);
  }
  
  const permissions = fetchUserPermissions(userId);
  setPermissionsCache(prev => new Map(prev).set(userId, permissions));
  return permissions;
};
```

### 4. **Error Handling**
```typescript
const handleFeatureAccess = (featureSlug: string) => {
  try {
    if (!canAccessFeature(featureSlug)) {
      throw new Error('You do not have access to this feature');
    }
    // Proceed with feature access
  } catch (error) {
    showErrorToast('Access denied: ' + error.message);
  }
};
```

## Visual Diagrams

### System Architecture Flow
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Login    │───▶│  Role Check     │───▶│  Permission     │
│                 │    │                 │    │  Calculation    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Tenant Feature │◀───│  Feature Check  │◀───│  UI Rendering   │
│  Validation     │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Data Flow
```
User Request
    │
    ▼
┌─────────────────┐
│  JWT Token      │
│  Validation     │
└─────────────────┘
    │
    ▼
┌─────────────────┐
│  User Role      │
│  Extraction     │
└─────────────────┘
    │
    ▼
┌─────────────────┐
│  Tenant ID      │
│  Extraction     │
└─────────────────┘
    │
    ▼
┌─────────────────┐
│  Feature        │
│  Permissions    │
│  Lookup         │
└─────────────────┘
    │
    ▼
┌─────────────────┐
│  Filtered       │
│  Data Return    │
└─────────────────┘
```

### UI Component Hierarchy
```
UnifiedDashboard
├── Sidebar
│   ├── Navigation Items (Role-based)
│   └── Feature Links (Permission-based)
├── Header
│   ├── User Info
│   └── Tenant Info
└── Main Content
    ├── Stats Cards (Role-based)
    ├── Feature Cards (Permission-based)
    └── Data Tables (Tenant-isolated)
```

## Benefits of This Approach

### ✅ **Advantages**
1. **Single Codebase** - One dashboard, multiple configurations
2. **Scalable** - Easy to add new features and tenants
3. **Secure** - Multiple layers of permission checking
4. **Maintainable** - Clear separation of concerns
5. **Flexible** - Granular control over user access
6. **Cost-Effective** - Tenants only pay for what they use

### ⚠️ **Complexity Management**
1. **Caching** - Reduces database calls
2. **Error Handling** - Graceful permission failures
3. **Testing** - Comprehensive permission testing
4. **Documentation** - Clear permission matrix
5. **Monitoring** - Track permission usage

## Implementation Timeline

### Phase 1: Core Infrastructure
- [ ] Database schema setup
- [ ] Permission service layer
- [ ] Basic role-based access

### Phase 2: Feature Control
- [ ] Tenant-feature mapping
- [ ] User permission system
- [ ] Dynamic UI rendering

### Phase 3: Advanced Features
- [ ] Permission caching
- [ ] Audit logging
- [ ] Performance optimization

### Phase 4: Monitoring & Analytics
- [ ] Usage tracking
- [ ] Permission analytics
- [ ] Performance monitoring

---

## Conclusion

This architecture provides a **scalable, secure, and maintainable** solution for multi-tenant feature control. By using layered permissions and dynamic UI rendering, we can support complex SaaS scenarios while keeping the codebase manageable.

The key is to **start simple** and **add complexity gradually** as needed. The single dashboard approach is actually **less complex** than multiple dashboards because it provides a consistent user experience and centralized permission management.
