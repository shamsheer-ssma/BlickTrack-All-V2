# Permission Flow Diagrams

## 1. System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    BLICKTRACK SAAS PLATFORM                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  │   PLATFORM      │    │    TENANT A     │    │    TENANT B     │
│  │    ADMIN        │    │   (Threat +     │    │   (All Features)│
│  │                 │    │    SBOM)        │    │                 │
│  │ • All Tenants   │    │                 │    │                 │
│  │ • All Features  │    │ • Threat Model  │    │ • Threat Model  │
│  │ • All Data      │    │ • SBOM Gen      │    │ • SBOM Gen      │
│  │ • User Mgmt     │    │ • 45 Users      │    │ • Security Tr.  │
│  │                 │    │ • 12 Projects   │    │ • Compliance    │
│  │                 │    │                 │    │ • 120 Users     │
│  │                 │    │                 │    │ • 28 Projects   │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘
│                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  │    TENANT C     │    │   TENANT D      │    │   TENANT E      │
│  │ (Security Tr.)  │    │  (Compliance)   │    │   (Threat +     │
│  │                 │    │                 │    │   Compliance)   │
│  │ • Security Tr.  │    │ • Compliance    │    │                 │
│  │ • 23 Users      │    │ • 67 Users      │    │ • Threat Model  │
│  │ • 8 Projects    │    │ • 19 Projects   │    │ • Compliance    │
│  │                 │    │                 │    │ • 34 Users      │
│  │                 │    │                 │    │ • 15 Projects   │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 2. Permission Flow for Different User Types

### Platform Admin Flow
```
┌─────────────────┐
│  Platform Admin │
│     Login       │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  JWT Token      │
│  Validation     │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Role: PLATFORM │
│  ADMIN          │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Access Level:  │
│  • All Tenants  │
│  • All Features │
│  • All Data     │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Dashboard      │
│  Shows:         │
│  • All Tenants  │
│  • All Features │
│  • System Stats │
└─────────────────┘
```

### Tenant Admin Flow
```
┌─────────────────┐
│  Tenant Admin   │
│     Login       │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  JWT Token      │
│  Validation     │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Role: TENANT   │
│  ADMIN          │
│  Tenant: A      │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Check Tenant   │
│  Features:      │
│  • Threat Model │
│  • SBOM Gen     │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Dashboard      │
│  Shows:         │
│  • Tenant A     │
│  • 45 Users     │
│  • 12 Projects  │
│  • 2 Features   │
└─────────────────┘
```

### User Flow
```
┌─────────────────┐
│  Regular User   │
│     Login       │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  JWT Token      │
│  Validation     │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Role: USER     │
│  Tenant: A      │
│  User ID: 123   │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Check Tenant   │
│  Features:      │
│  • Threat Model │
│  • SBOM Gen     │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Check User     │
│  Permissions:   │
│  • Can View     │
│  • Can Edit     │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Dashboard      │
│  Shows:         │
│  • My Projects  │
│  • My Tasks     │
│  • 2 Features   │
└─────────────────┘
```

## 3. Feature Access Control Matrix

```
┌─────────────────┬─────────────┬─────────────┬─────────────┬─────────────┐
│     FEATURE     │ PLATFORM    │ TENANT A    │ TENANT B    │ TENANT C    │
│                 │   ADMIN     │   ADMIN     │   ADMIN     │   ADMIN     │
├─────────────────┼─────────────┼─────────────┼─────────────┼─────────────┤
│ Threat Modeling │     ✅      │     ✅      │     ✅      │     ❌      │
│ SBOM Generation │     ✅      │     ✅      │     ✅      │     ❌      │
│ Security Train  │     ✅      │     ❌      │     ✅      │     ✅      │
│ Compliance      │     ✅      │     ❌      │     ✅      │     ❌      │
│ User Management │     ✅      │     ✅      │     ✅      │     ✅      │
│ System Health   │     ✅      │     ✅      │     ✅      │     ✅      │
└─────────────────┴─────────────┴─────────────┴─────────────┴─────────────┘
```

## 4. Database Query Flow

```
User Request: "Show me my dashboard"
    │
    ▼
┌─────────────────┐
│  Extract JWT    │
│  • User ID      │
│  • Role         │
│  • Tenant ID    │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Query 1:       │
│  Get User Info  │
│  SELECT * FROM  │
│  User WHERE     │
│  id = ?         │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Query 2:       │
│  Get Tenant     │
│  Features       │
│  SELECT f.*     │
│  FROM Feature f │
│  JOIN TenantFeature tf │
│  ON f.id = tf.featureId │
│  WHERE tf.tenantId = ?  │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Query 3:       │
│  Get User       │
│  Permissions    │
│  SELECT p.*     │
│  FROM UserFeaturePermission p │
│  WHERE p.userId = ?           │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Query 4:       │
│  Get Dashboard  │
│  Data (Role-    │
│  based)         │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Filter Data    │
│  Based on:      │
│  • Role         │
│  • Features     │
│  • Permissions  │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Return         │
│  Filtered Data  │
└─────────────────┘
```

## 5. UI Component Rendering Flow

```
Dashboard Component Load
    │
    ▼
┌─────────────────┐
│  Check User     │
│  Role           │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Load Tenant    │
│  Features       │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Load User      │
│  Permissions    │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Render         │
│  Navigation     │
│  (Role-based)   │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Render Stats   │
│  Cards (Role-   │
│  based)         │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Render Feature │
│  Cards (Feature │
│  -based)        │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Render Data    │
│  Tables (Tenant │
│  -isolated)     │
└─────────────────┘
```

## 6. Permission Check Logic

```
Function: canAccessFeature(featureSlug)
    │
    ▼
┌─────────────────┐
│  Is Platform    │
│  Admin?         │
└─────────┬───────┘
          │
    ┌─────▼─────┐
    │    YES    │
    └─────┬─────┘
          │
          ▼
┌─────────────────┐
│  Return TRUE    │
│  (Can access    │
│  everything)    │
└─────────────────┘
          │
    ┌─────▼─────┐
    │    NO     │
    └─────┬─────┘
          │
          ▼
┌─────────────────┐
│  Does Tenant    │
│  Have Feature?  │
└─────────┬───────┘
          │
    ┌─────▼─────┐
    │    NO     │
    └─────┬─────┘
          │
          ▼
┌─────────────────┐
│  Return FALSE   │
│  (No access)    │
└─────────────────┘
          │
    ┌─────▼─────┐
    │    YES    │
    └─────┬─────┘
          │
          ▼
┌─────────────────┐
│  Is Tenant      │
│  Admin?         │
└─────────┬───────┘
          │
    ┌─────▼─────┐
    │    YES    │
    └─────┬─────┘
          │
          ▼
┌─────────────────┐
│  Return TRUE    │
│  (Can access    │
│  all tenant     │
│  features)      │
└─────────────────┘
          │
    ┌─────▼─────┐
    │    NO     │
    └─────┬─────┘
          │
          ▼
┌─────────────────┐
│  Check User     │
│  Permissions    │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│  Return User    │
│  Permission     │
│  Result         │
└─────────────────┘
```

## 7. Complexity Management Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│                    COMPLEXITY MANAGEMENT                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  │   CACHING       │    │   ERROR         │    │   TESTING       │
│  │                 │    │   HANDLING      │    │                 │
│  │ • Permission    │    │                 │    │                 │
│  │   Cache         │    │ • Graceful      │    │ • Unit Tests    │
│  │ • Feature       │    │   Failures      │    │ • Integration   │
│  │   Cache         │    │ • User-friendly │    │   Tests         │
│  │ • User Data     │    │   Messages      │    │ • Permission    │
│  │   Cache         │    │ • Fallback      │    │   Tests         │
│  │                 │    │   Strategies    │    │                 │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘
│                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  │   MONITORING    │    │   DOCUMENTATION │    │   PERFORMANCE   │
│  │                 │    │                 │    │                 │
│  │ • Usage         │    │                 │    │                 │
│  │   Tracking      │    │ • Permission    │    │ • Query         │
│  │ • Permission    │    │   Matrix        │    │   Optimization  │
│  │   Analytics     │    │ • API Docs      │    │ • Lazy Loading  │
│  │ • Performance   │    │ • User Guides   │    │ • Caching       │
│  │   Metrics       │    │                 │    │                 │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘
└─────────────────────────────────────────────────────────────────┘
```

## 8. Real-World Example Scenarios

### Scenario 1: New Tenant Onboarding
```
1. Platform Admin creates new tenant
2. Assigns features: Threat Modeling + SBOM
3. Creates tenant admin user
4. Tenant admin sees only assigned features
5. Tenant admin creates regular users
6. Users see only their tenant's features
```

### Scenario 2: Feature Upgrade
```
1. Tenant A wants to add Security Training
2. Platform Admin enables feature for Tenant A
3. Tenant A admin sees new feature in dashboard
4. Tenant A admin assigns permissions to users
5. Users see new feature based on permissions
```

### Scenario 3: User Permission Change
```
1. User had "View" permission for Threat Modeling
2. Tenant admin changes to "Edit" permission
3. User dashboard updates automatically
4. User can now edit threat models
5. UI shows edit buttons and controls
```

## 9. Benefits of Single Dashboard Approach

```
┌─────────────────────────────────────────────────────────────────┐
│                    SINGLE DASHBOARD BENEFITS                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ✅ CONSISTENT UX    ✅ EASIER MAINTENANCE  ✅ BETTER PERFORMANCE │
│     • Same UI for      • One codebase        • Shared components │
│       all users        • Centralized logic   • Optimized queries │
│     • Familiar         • Single bug fixes    • Cached data      │
│       navigation       • Unified updates     • Lazy loading     │
│                                                                 │
│  ✅ SCALABLE         ✅ SECURE              ✅ COST-EFFECTIVE     │
│     • Easy to add      • Centralized         • Less development  │
│       new features     • permission checks   • time              │
│     • Dynamic UI       • Audit logging       • Single deployment │
│       rendering        • Role validation     • Shared resources  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 10. Implementation Checklist

```
┌─────────────────────────────────────────────────────────────────┐
│                    IMPLEMENTATION CHECKLIST                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  PHASE 1: CORE INFRASTRUCTURE                                  │
│  □ Database schema setup                                       │
│  □ User role system                                            │
│  □ JWT authentication                                          │
│  □ Basic permission checking                                   │
│                                                                 │
│  PHASE 2: FEATURE CONTROL                                      │
│  □ Tenant-feature mapping                                      │
│  □ User permission system                                      │
│  □ Dynamic UI rendering                                        │
│  □ Feature access validation                                   │
│                                                                 │
│  PHASE 3: ADVANCED FEATURES                                    │
│  □ Permission caching                                          │
│  □ Audit logging                                               │
│  □ Performance optimization                                    │
│  □ Error handling                                              │
│                                                                 │
│  PHASE 4: MONITORING & ANALYTICS                               │
│  □ Usage tracking                                              │
│  □ Permission analytics                                        │
│  □ Performance monitoring                                      │
│  □ User behavior analysis                                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Conclusion

This architecture provides a **robust, scalable, and maintainable** solution for multi-tenant SaaS applications. The single dashboard approach is actually **less complex** than multiple dashboards because:

1. **Centralized Logic** - All permission logic in one place
2. **Consistent UX** - Same interface for all users
3. **Easier Maintenance** - One codebase to manage
4. **Better Performance** - Shared components and caching
5. **Simpler Testing** - One set of tests for all scenarios

The key is to **start simple** and **add complexity gradually** as your application grows. This approach will scale from 10 users to 10,000 users without major architectural changes.
