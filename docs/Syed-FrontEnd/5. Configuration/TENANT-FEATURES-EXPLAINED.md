# 🏢 Tenant Feature Flags System - Complete Guide

## 📋 Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Backend Implementation](#backend-implementation)
4. [Frontend Implementation](#frontend-implementation)
5. [Usage Examples](#usage-examples)
6. [Testing](#testing)
7. [Deployment](#deployment)

---

## 🎯 Overview

### What Problem Does This Solve?

In a **multi-tenant SaaS application**, different customers (tenants) need different features:

| Customer | Registration | SSO | 2FA | Landing Page |
|----------|--------------|-----|-----|--------------|
| **Acme Corp** | ✅ Enabled | ❌ Disabled | ❌ Optional | ✅ Show |
| **TechStart** | ✅ Enabled | ❌ Disabled | ❌ Optional | ✅ Show |
| **Gov Agency** | ❌ Disabled | ✅ Azure AD | ✅ Required | ❌ Skip (direct login) |

### The Solution: Hybrid Configuration

```
┌─────────────────────────────────────────────────────────────┐
│  Level 1: Platform-Wide (Environment Variables)             │
│  ─────────────────────────────────────────────────────────  │
│  • Is dark mode available on this deployment?               │
│  • Which API server to connect to?                          │
│  • Platform-level features                                  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  Level 2: Tenant-Specific (Database)                        │
│  ─────────────────────────────────────────────────────────  │
│  • Does THIS tenant allow registration?                     │
│  • Does THIS tenant require 2FA?                            │
│  • Does THIS tenant use SSO?                                │
└─────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Architecture

### System Flow

```
┌─────────────────────────────────────────────────────────────┐
│  Frontend (Next.js) - http://localhost:4000                 │
│                                                              │
│  1. User visits: http://localhost:4000?tenant=acme-corp     │
│     OR subdomain: acme.blicktrack.com                       │
│                                                              │
│  2. Extract tenant identifier:                              │
│     getTenantIdentifier() → "acme-corp"                     │
│                                                              │
│  3. Fetch tenant features:                                  │
│     useTenantFeatures("acme-corp") → API call               │
│                                                              │
│  4. Apply features:                                         │
│     - Show/hide registration button                         │
│     - Show/hide SSO button                                  │
│     - Redirect to login or show landing page                │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTP GET
                     │ /api/v1/tenants/slug/acme-corp/features
                     ↓
┌─────────────────────────────────────────────────────────────┐
│  Backend (NestJS) - http://localhost:5000                   │
│                                                              │
│  1. TenantsController receives request                      │
│     GET /api/v1/tenants/slug/:slug/features                 │
│                                                              │
│  2. TenantsService queries database                         │
│     - Find tenant by slug                                   │
│     - Get TenantConfiguration                               │
│                                                              │
│  3. Return feature flags JSON:                              │
│     {                                                        │
│       "enableRegistration": true,                           │
│       "enable2FA": false,                                   │
│       "enableLandingPage": true,                            │
│       "ssoEnabled": false                                   │
│     }                                                        │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ SQL Query
                     ↓
┌─────────────────────────────────────────────────────────────┐
│  Database (PostgreSQL)                                       │
│                                                              │
│  Table: tenants                                              │
│  ┌──────────┬──────────────┬────────┐                       │
│  │ id       │ name         │ slug   │                       │
│  ├──────────┼──────────────┼────────┤                       │
│  │ uuid-1   │ Acme Corp    │ acme   │                       │
│  └──────────┴──────────────┴────────┘                       │
│                                                              │
│  Table: tenant_configurations                                │
│  ┌──────────┬──────┬────────┬──────────┬─────────┐         │
│  │ tenantId │ reg  │ 2FA    │ landing  │ sso     │         │
│  ├──────────┼──────┼────────┼──────────┼─────────┤         │
│  │ uuid-1   │ true │ false  │ true     │ false   │         │
│  └──────────┴──────┴────────┴──────────┴─────────┘         │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 Backend Implementation

### 1. Database Schema (`backend/prisma/schema.prisma`)

```prisma
model TenantConfiguration {
  id       String @id @default(uuid())
  tenantId String @unique
  tenant   Tenant @relation(fields: [tenantId], references: [id])
  
  // Feature Flags - Control tenant-specific features
  enableRegistration   Boolean @default(true)   // Allow new user registration
  enable2FA            Boolean @default(false)  // Require two-factor authentication
  enableLandingPage    Boolean @default(true)   // Show landing page (false = direct to login)
  enableDarkMode       Boolean @default(true)   // Allow dark mode toggle
  
  // SSO Configuration (when ssoEnabled = true)
  ssoEnabled           Boolean @default(false)
  ssoProvider          String? // "azure", "okta", "google", "saml"
  ssoClientId          String? // OAuth Client ID
  ssoTenantId          String? // For Azure AD
  ssoIssuerUrl         String? // For SAML
  ssoMetadataUrl       String? // For SAML metadata
  
  // ... other fields
}
```

### 2. API Endpoints (`backend/src/tenants/tenants.controller.ts`)

#### GET `/api/v1/tenants/:id/features`
Get features by tenant UUID

```typescript
// Request
GET http://localhost:5000/api/v1/tenants/123e4567-e89b-12d3-a456-426614174000/features

// Response
{
  "enableRegistration": true,
  "enable2FA": false,
  "enableLandingPage": true,
  "enableDarkMode": true,
  "ssoEnabled": false,
  "ssoProvider": null,
  "theme": "corporate",
  "primaryColor": "#2563eb"
}
```

#### GET `/api/v1/tenants/slug/:slug/features`
Get features by tenant slug (e.g., "acme-corp")

```typescript
// Request
GET http://localhost:5000/api/v1/tenants/slug/acme-corp/features

// Response (same as above)
```

#### PATCH `/api/v1/tenants/:id/features`
Update tenant features (Admin only)

```typescript
// Request
PATCH http://localhost:5000/api/v1/tenants/123e4567/features
Content-Type: application/json

{
  "enableRegistration": false,
  "enable2FA": true,
  "ssoEnabled": true,
  "ssoProvider": "azure",
  "ssoClientId": "your-client-id"
}

// Response
{
  "enableRegistration": false,
  "enable2FA": true,
  "enableLandingPage": true,
  "enableDarkMode": true,
  "ssoEnabled": true,
  "ssoProvider": "azure",
  "theme": "corporate",
  "primaryColor": "#2563eb"
}
```

---

## 💻 Frontend Implementation

### 1. Configuration (`qk-test/src/config/features.ts`)

```typescript
// Platform-wide settings (Environment Variables)
export const APP_CONFIG = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  apiTimeout: 30000,
}

export const FEATURE_FLAGS = {
  enableDarkMode: process.env.NEXT_PUBLIC_ENABLE_DARK_MODE !== 'false',
  // ... other platform flags
}

// Tenant detection helpers
export function getTenantIdentifier(): string | null {
  // From URL: ?tenant=acme-corp
  const urlParams = new URLSearchParams(window.location.search);
  const tenant = urlParams.get('tenant');
  if (tenant) return tenant;
  
  // From subdomain: acme.blicktrack.com → "acme"
  return getTenantFromHostname();
}
```

### 2. Custom Hook (`qk-test/src/hooks/useTenantFeatures.ts`)

```typescript
import { useTenantFeatures } from '@/hooks/useTenantFeatures';

// In your component:
const { features, loading, error } = useTenantFeatures('acme-corp');

// Or auto-detect from URL/subdomain:
const tenantId = getTenantIdentifier();
const { features } = useTenantFeatures(tenantId || undefined);
```

**How it works:**

1. **No tenant specified** → Uses environment variables
2. **Tenant specified** → Fetches from API
3. **API fails** → Falls back to environment variables
4. **Auto-refetch** → When tenant changes

---

## 🎨 Usage Examples

### Example 1: Conditional Registration Button

```tsx
// qk-test/src/components/auth/LoginPage.tsx
'use client';

import { useTenantFeatures } from '@/hooks/useTenantFeatures';
import { getTenantIdentifier } from '@/config/features';

export default function LoginPage() {
  const tenantId = getTenantIdentifier();
  const { features, loading } = useTenantFeatures(tenantId || undefined);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <h1>Login</h1>
      <LoginForm />
      
      {/* Show registration only if enabled for this tenant */}
      {features?.enableRegistration && (
        <Link href="/register">
          Don't have an account? Sign up
        </Link>
      )}
      
      {/* Show SSO button only if enabled */}
      {features?.ssoEnabled && (
        <SSOButton provider={features.ssoProvider} />
      )}
    </div>
  );
}
```

### Example 2: Redirect Based on Landing Page Flag

```tsx
// qk-test/src/app/page.tsx
import { redirect } from 'next/navigation';
import { useTenantFeatures } from '@/hooks/useTenantFeatures';
import LandingPage from '@/components/landing/LandingPage';

export default function Home() {
  // Server-side: Use environment variable
  const showLanding = process.env.NEXT_PUBLIC_SHOW_LANDING_PAGE === 'true';
  
  if (!showLanding) {
    redirect('/login'); // Direct to login
  }
  
  return <LandingPage />;
}

// Client-side component:
'use client';
function DynamicLandingPage() {
  const tenantId = getTenantIdentifier();
  const { features } = useTenantFeatures(tenantId || undefined);
  
  if (features && !features.enableLandingPage) {
    redirect('/login');
  }
  
  return <LandingPage />;
}
```

### Example 3: Theme Customization

```tsx
'use client';

import { useTenantFeatures } from '@/hooks/useTenantFeatures';
import { useEffect } from 'react';

export function TenantThemeProvider({ children }: { children: React.ReactNode }) {
  const { features } = useTenantFeatures();
  
  useEffect(() => {
    if (features) {
      // Apply tenant's primary color
      document.documentElement.style.setProperty(
        '--color-primary',
        features.primaryColor
      );
      
      // Apply tenant's theme
      document.documentElement.setAttribute('data-theme', features.theme);
    }
  }, [features]);
  
  return <>{children}</>;
}
```

---

## 🧪 Testing

### Manual Testing with Browser

#### Test 1: Default Tenant (Environment Variables)

```bash
# 1. Start frontend
cd qk-test
npm run dev

# 2. Visit without tenant
http://localhost:4000

# Expected: Uses .env.local settings
```

#### Test 2: Specific Tenant (Database)

```bash
# 1. Get a tenant slug from database
# Run in backend directory:
npx prisma studio
# Find a tenant, note its slug (e.g., "acme-corp")

# 2. Visit with tenant parameter
http://localhost:4000?tenant=acme-corp

# Expected: Fetches from API, shows tenant-specific features
```

#### Test 3: Update Tenant Features

```bash
# Use API client (e.g., Postman, curl, or Thunder Client)

# Get tenant ID from Prisma Studio
# Then update features:

curl -X PATCH http://localhost:5000/api/v1/tenants/{tenant-id}/features \
  -H "Content-Type: application/json" \
  -d '{
    "enableRegistration": false,
    "enable2FA": true,
    "ssoEnabled": true,
    "ssoProvider": "azure"
  }'

# Refresh frontend - should see changes
```

### Testing with Subdomain (Local Development)

Edit your `hosts` file:

**Windows:** `C:\Windows\System32\drivers\etc\hosts`
```
127.0.0.1 acme.localhost
127.0.0.1 techstart.localhost
127.0.0.1 gov.localhost
```

Then visit:
- `http://acme.localhost:4000` → Acme Corp tenant
- `http://techstart.localhost:4000` → TechStart tenant
- `http://gov.localhost:4000` → Gov Agency tenant

---

## 🚀 Deployment

### Environment Variables

#### Frontend (`.env.local`)
```bash
# Platform-wide settings
NEXT_PUBLIC_SHOW_LANDING_PAGE=true
NEXT_PUBLIC_ENABLE_DARK_MODE=true
NEXT_PUBLIC_API_URL=http://localhost:5000

# For production:
# NEXT_PUBLIC_API_URL=https://api.blicktrack.com
```

#### Backend (`.env`)
```bash
# API Configuration
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/blicktrack_dev"

# CORS (allow frontend)
CORS_ORIGIN="http://localhost:4000"

# For production:
# CORS_ORIGIN="https://app.blicktrack.com"
```

### Production Deployment Patterns

#### Pattern 1: Single Deployment, Multiple Tenants (SaaS)

```
app.blicktrack.com
├─ acme.blicktrack.com → tenant: "acme"
├─ techstart.blicktrack.com → tenant: "techstart"
└─ gov.blicktrack.com → tenant: "gov"

All point to same frontend/backend
Tenant identified by subdomain
```

#### Pattern 2: Separate Deployments (On-Premise)

```
Customer A:
├─ customer-a.mycompany.com:4000 (frontend)
└─ api-customer-a.mycompany.com:5000 (backend)

Customer B:
├─ customer-b.mycompany.com:4000 (frontend)
└─ api-customer-b.mycompany.com:5000 (backend)

Each has own servers and database
Configuration via environment variables
```

---

## 📊 Decision Matrix

| Feature | Environment Variable | Database | Why |
|---------|---------------------|----------|-----|
| **API URL** | ✅ | ❌ | Infrastructure setting |
| **Dark Mode Available** | ✅ | ❌ | Platform-level feature |
| **Landing Page** | ✅ | ✅ | Can be both! Platform default + tenant override |
| **User Registration** | ❌ | ✅ | Tenant business rule |
| **SSO** | ❌ | ✅ | Tenant integration |
| **2FA** | ❌ | ✅ | Tenant security policy |
| **Theme/Branding** | ❌ | ✅ | Tenant customization |

---

## 🎯 Summary

### What We Built

1. ✅ **Database Schema** - Added feature flags to `TenantConfiguration`
2. ✅ **Backend API** - Created REST endpoints for tenant features
3. ✅ **Frontend Hook** - `useTenantFeatures()` for easy access
4. ✅ **Tenant Detection** - Auto-detect from subdomain or URL
5. ✅ **Fallback System** - Environment variables as backup

### How It Works

```
User visits → Detect tenant → Fetch features → Apply features → Render UI
```

### Next Steps

1. **Add Authentication** - Protect admin endpoints
2. **Cache Features** - Use React Query for caching
3. **Real-time Updates** - WebSocket for feature changes
4. **Admin UI** - Build feature management dashboard
5. **Feature Analytics** - Track feature usage per tenant

---

## 📚 Related Files

- `backend/prisma/schema.prisma` - Database schema
- `backend/src/tenants/` - API implementation
- `qk-test/src/config/features.ts` - Frontend configuration
- `qk-test/src/hooks/useTenantFeatures.ts` - React hook
- `qk-test/.env.local` - Environment variables

---

**🎉 Congratulations!** You now have a professional, enterprise-grade tenant feature flag system!

