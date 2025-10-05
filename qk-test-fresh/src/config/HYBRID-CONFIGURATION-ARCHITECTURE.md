# 🏗️ Hybrid Configuration Architecture

## Overview

Our application uses a **hybrid configuration system** that combines static and dynamic configuration layers to provide maximum flexibility and reliability.

## 🎯 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           HYBRID CONFIGURATION SYSTEM                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐        │
│  │   COMPONENT     │    │   COMPONENT     │    │   COMPONENT     │        │
│  │   (page.tsx)    │    │   (LoginPage)   │    │   (Dashboard)   │        │
│  └─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘        │
│            │                      │                      │                │
│            │                      │                      │                │
│            ▼                      ▼                      ▼                │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    useTenantFeatures() Hook                        │   │
│  │                      (Dynamic Layer)                               │   │
│  └─────────────────────┬───────────────────────────────────────────────┘   │
│                        │                                                 │
│                        │ Decision Logic:                                 │
│                        │ features?.enableLandingPage ??                  │
│                        │ shouldShowLandingPage()                         │
│                        │                                                 │
│                        ▼                                                 │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    CONFIGURATION PRIORITY                          │   │
│  │                                                                     │   │
│  │  1. 🗄️  DATABASE (TenantConfiguration) ← HIGHEST PRIORITY          │   │
│  │     ├─ Per-tenant customization                                    │   │
│  │     ├─ Runtime updates (no redeployment)                          │   │
│  │     ├─ API: /api/tenants/{id}/features                           │   │
│  │     └─ Example: Boeing wants direct login, Acme wants landing     │   │
│  │                                                                     │   │
│  │  2. 🌍 ENVIRONMENT VARIABLES (.env.local) ← FALLBACK              │   │
│  │     ├─ Platform-wide defaults                                     │   │
│  │     ├─ Build-time configuration                                   │   │
│  │     ├─ NEXT_PUBLIC_SHOW_LANDING_PAGE=true                        │   │
│  │     └─ Example: All new deployments show landing page by default │   │
│  │                                                                     │   │
│  │  3. ⚙️  DEFAULT VALUES (features.ts) ← LAST RESORT               │   │
│  │     ├─ Hardcoded fallbacks                                        │   │
│  │     ├─ When env vars not set                                      │   │
│  │     ├─ When database unavailable                                  │   │
│  │     └─ Example: If everything fails, show landing page            │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 📁 File Structure

### `features.ts` - Static Configuration Layer
```typescript
// Platform-wide defaults and environment variables
export const SHOW_LANDING_PAGE = 
  process.env.NEXT_PUBLIC_SHOW_LANDING_PAGE !== 'false';

export const FEATURE_FLAGS = {
  enableRegistration: process.env.NEXT_PUBLIC_ENABLE_REGISTRATION !== 'false',
  enable2FA: process.env.NEXT_PUBLIC_ENABLE_2FA === 'true',
  // ... more features
};
```

**Purpose:**
- ✅ Environment variable configuration
- ✅ Platform-wide defaults
- ✅ Build-time configuration
- ✅ Fallback when database unavailable

### `useTenantFeatures.ts` - Dynamic Configuration Layer
```typescript
// React hook for tenant-specific configuration
export function useTenantFeatures(tenantId?: string) {
  // 1. Try to fetch from database API
  const response = await axios.get(`/api/tenants/${tenantId}/features`);
  
  // 2. If API fails, fall back to features.ts
  if (error) {
    return getEnvironmentFeatures(); // Uses features.ts
  }
  
  return response.data; // Database configuration
}
```

**Purpose:**
- ✅ Per-tenant customization
- ✅ Runtime configuration updates
- ✅ Database API integration
- ✅ Graceful fallback to static config

## 🔄 Decision Flow

### Step-by-Step Process:

1. **Component calls `useTenantFeatures()`**
   ```typescript
   const { features, loading, error } = useTenantFeatures(tenantId);
   ```

2. **Hook tries database first**
   ```typescript
   // API call to /api/tenants/{tenantId}/features
   const response = await axios.get(endpoint);
   ```

3. **If database succeeds**
   ```typescript
   // Return tenant-specific configuration
   return response.data; // { enableLandingPage: true, theme: 'corporate' }
   ```

4. **If database fails**
   ```typescript
   // Fall back to features.ts
   return getEnvironmentFeatures(); // Reads .env.local
   ```

5. **Component uses configuration**
   ```typescript
   const showLandingPage = features?.enableLandingPage ?? shouldShowLandingPage();
   //                    ↑ Database first    ↑ Environment fallback
   ```

## 🎯 Real-World Examples

### Example 1: Acme Corporation
```typescript
// Database Configuration
{
  tenantId: 'acme-corp-uuid',
  enableLandingPage: true,     // Wants landing page
  theme: 'corporate',
  primaryColor: '#2563eb'
}

// Result: Shows landing page (database wins)
```

### Example 2: Boeing Aerospace
```typescript
// Database Configuration
{
  tenantId: 'boeing-uuid', 
  enableLandingPage: false,    // Wants direct login
  theme: 'aerospace',
  primaryColor: '#1e40af'
}

// Result: Redirects to /login (database wins)
```

### Example 3: New Visitor (No Tenant)
```typescript
// No tenant ID provided
const { features } = useTenantFeatures(); // No tenantId

// Falls back to features.ts
SHOW_LANDING_PAGE = true  // From .env.local

// Result: Shows landing page (environment fallback)
```

### Example 4: API Down
```typescript
// Database API fails
const { features, error } = useTenantFeatures('tenant-id');
// error = true

// Falls back to features.ts
SHOW_LANDING_PAGE = true  // From .env.local

// Result: Shows landing page (environment fallback)
```

## 🔧 Configuration Layers

| Layer | File | Purpose | When Used | Example |
|-------|------|---------|-----------|---------|
| **Database** | `TenantConfiguration` | Per-tenant customization | Runtime, specific tenant | Boeing wants direct login |
| **Environment** | `.env.local` | Platform defaults | Build time, all deployments | All new customers get landing page |
| **Defaults** | `features.ts` | Hardcoded fallbacks | When everything else fails | If API down, show landing page |

## 🚀 Benefits

### ✅ **Flexibility**
- Per-tenant customization
- Runtime updates without redeployment
- Platform-wide defaults

### ✅ **Reliability** 
- Graceful fallbacks
- No single point of failure
- Works even when database is down

### ✅ **Maintainability**
- Clear separation of concerns
- Easy to understand and debug
- Centralized configuration

### ✅ **Scalability**
- Supports unlimited tenants
- Each tenant can be different
- Easy to add new features

## 📝 Usage Guidelines

### For Static Configuration (`features.ts`):
- Use for platform-wide settings
- Environment variables only
- Build-time configuration
- Fallback values

### For Dynamic Configuration (`useTenantFeatures.ts`):
- Use for tenant-specific settings
- Database API integration
- Runtime configuration
- Per-customer customization

### In Components:
```typescript
// Always use the hook for configuration
const { features, loading, error } = useTenantFeatures(tenantId);

// Use fallback logic
const showLandingPage = features?.enableLandingPage ?? shouldShowLandingPage();
```

## 🔍 Debugging

### Check Configuration Priority:
1. **Database**: Check API response in network tab
2. **Environment**: Check `.env.local` file
3. **Defaults**: Check `features.ts` hardcoded values

### Common Issues:
- **Wrong configuration**: Check database vs environment priority
- **API errors**: Check backend logs and database connection
- **Environment not loading**: Check `.env.local` file and Next.js config

---

**This hybrid system provides the perfect balance of flexibility, reliability, and maintainability for enterprise applications!** 🎯
