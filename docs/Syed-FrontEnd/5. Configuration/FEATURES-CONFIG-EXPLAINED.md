# 🎛️ **features.ts - Complete Learning Guide**

---

## 🎯 **What is features.ts?**

`src/config/features.ts` is your **centralized configuration file** for:
- ✅ Feature flags (enable/disable features per customer)
- ✅ App configuration (branding, settings)
- ✅ Environment-based settings
- ✅ Customer-specific deployments

Think of it as the **"control panel"** for your entire application!

---

## 📄 **Your Current features.ts**

```typescript
/**
 * Feature Configuration
 * 
 * Centralized configuration for customer-specific features.
 * These can be configured per deployment using environment variables.
 */

/**
 * Landing Page Configuration
 */
export const SHOW_LANDING_PAGE = 
  process.env.NEXT_PUBLIC_SHOW_LANDING_PAGE !== 'false';

/**
 * App Configuration
 */
export const APP_CONFIG = {
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'BlickTrack',
  companyName: process.env.NEXT_PUBLIC_COMPANY_NAME || 'Enterprise Solutions',
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@blicktrack.com',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  apiTimeout: Number(process.env.NEXT_PUBLIC_API_TIMEOUT) || 30000,
} as const;

/**
 * Feature Flags (Future Enhancement)
 */
export const FEATURE_FLAGS = {
  enableRegistration: process.env.NEXT_PUBLIC_ENABLE_REGISTRATION === 'true',
  enableSSO: process.env.NEXT_PUBLIC_ENABLE_SSO === 'true',
  enable2FA: process.env.NEXT_PUBLIC_ENABLE_2FA === 'true',
  enableDarkMode: process.env.NEXT_PUBLIC_ENABLE_DARK_MODE !== 'false',
} as const;

/**
 * Deployment Info
 */
export const DEPLOYMENT_INFO = {
  environment: process.env.NODE_ENV || 'development',
  version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  buildDate: process.env.NEXT_PUBLIC_BUILD_DATE || new Date().toISOString(),
} as const;

/**
 * Helper Functions
 */
export function shouldShowLandingPage(): boolean {
  return SHOW_LANDING_PAGE;
}

export function getDefaultRoute(): string {
  return shouldShowLandingPage() ? '/' : '/login';
}

export function isFeatureEnabled(feature: keyof typeof FEATURE_FLAGS): boolean {
  return FEATURE_FLAGS[feature];
}
```

---

## 🔍 **Section-by-Section Explanation**

---

## **Section 1: Landing Page Configuration** (Lines 10-11)

```typescript
export const SHOW_LANDING_PAGE = 
  process.env.NEXT_PUBLIC_SHOW_LANDING_PAGE !== 'false';
```

### **What it does:**
Controls whether to show the marketing landing page or redirect to login.

### **How it works:**

```typescript
process.env.NEXT_PUBLIC_SHOW_LANDING_PAGE !== 'false'
```

**Logic:**
- If env var is `'false'` (string) → Returns `false`
- If env var is `'true'` → Returns `true`
- If env var is NOT SET → Returns `true` (default)

**Truth table:**

| .env.local | Result | Behavior |
|------------|--------|----------|
| `NEXT_PUBLIC_SHOW_LANDING_PAGE=true` | `true` | Show landing page |
| `NEXT_PUBLIC_SHOW_LANDING_PAGE=false` | `false` | Redirect to /login |
| (not set) | `true` | Show landing page (default) |

### **Where it's used:**

```typescript
// src/app/page.tsx
import { shouldShowLandingPage } from '@/config/features'

export default function Home() {
  if (!shouldShowLandingPage()) {
    redirect('/login')  // Skip landing, go straight to login
  }
  return <LandingPage />
}
```

### **Why this pattern?**

```typescript
// ❌ Bad: Check environment variable everywhere
if (process.env.NEXT_PUBLIC_SHOW_LANDING_PAGE !== 'false') {
  // ...
}

// ✅ Good: Centralized configuration
if (shouldShowLandingPage()) {
  // ...
}
```

**Benefits:**
- ✅ Single source of truth
- ✅ Easy to change logic
- ✅ Type-safe
- ✅ Reusable

---

## **Section 2: App Configuration** (Lines 17-23)

```typescript
export const APP_CONFIG = {
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'BlickTrack',
  companyName: process.env.NEXT_PUBLIC_COMPANY_NAME || 'Enterprise Solutions',
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@blicktrack.com',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  apiTimeout: Number(process.env.NEXT_PUBLIC_API_TIMEOUT) || 30000,
} as const;
```

### **What is `as const`?**

Makes the object **deeply readonly** (TypeScript feature).

```typescript
// Without 'as const':
const config = { name: 'BlickTrack' }
config.name = 'NewName'  // ✅ Allowed (but might cause bugs!)

// With 'as const':
const config = { name: 'BlickTrack' } as const
config.name = 'NewName'  // ❌ TypeScript ERROR: Cannot assign to 'name'
```

**Why use it?**
- ✅ Prevents accidental modifications
- ✅ Better type inference
- ✅ Catch errors at compile time

---

### **Breaking Down Each Field:**

#### **1. `appName`**

```typescript
appName: process.env.NEXT_PUBLIC_APP_NAME || 'BlickTrack'
```

**Purpose:** Application display name

**Usage:**
```tsx
import { APP_CONFIG } from '@/config/features'

<h1>{APP_CONFIG.appName}</h1>  // "BlickTrack"
```

**Per-customer configuration:**
```bash
# Customer A
NEXT_PUBLIC_APP_NAME=BlickTrack

# Customer B
NEXT_PUBLIC_APP_NAME=SecurePortal

# Customer C
NEXT_PUBLIC_APP_NAME=CyberDefense Pro
```

---

#### **2. `companyName`**

```typescript
companyName: process.env.NEXT_PUBLIC_COMPANY_NAME || 'Enterprise Solutions'
```

**Purpose:** Company/organization name

**Usage:**
```tsx
<footer>
  © 2024 {APP_CONFIG.companyName}
</footer>
```

---

#### **3. `supportEmail`**

```typescript
supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@blicktrack.com'
```

**Purpose:** Support contact email

**Usage:**
```tsx
<a href={`mailto:${APP_CONFIG.supportEmail}`}>
  Contact Support
</a>
```

---

#### **4. `apiUrl`**

```typescript
apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
```

**Purpose:** Backend API base URL

**Usage:**
```typescript
import axios from 'axios'
import { APP_CONFIG } from '@/config/features'

// Make API calls
const response = await axios.get(`${APP_CONFIG.apiUrl}/api/v1/users`)
```

**Per-environment:**
```bash
# Development
NEXT_PUBLIC_API_URL=http://localhost:5000

# Staging
NEXT_PUBLIC_API_URL=https://staging-api.blicktrack.com

# Production
NEXT_PUBLIC_API_URL=https://api.blicktrack.com
```

---

#### **5. `apiTimeout`**

```typescript
apiTimeout: Number(process.env.NEXT_PUBLIC_API_TIMEOUT) || 30000
```

**Purpose:** API request timeout (milliseconds)

**Note the `Number()` wrapper:**
```typescript
// Environment variables are ALWAYS strings!
process.env.NEXT_PUBLIC_API_TIMEOUT  // "30000" (string)

// Convert to number:
Number(process.env.NEXT_PUBLIC_API_TIMEOUT)  // 30000 (number)
```

**Usage:**
```typescript
import axios from 'axios'

const api = axios.create({
  baseURL: APP_CONFIG.apiUrl,
  timeout: APP_CONFIG.apiTimeout,  // 30000ms = 30 seconds
})
```

---

## **Section 3: Feature Flags** (Lines 28-33)

```typescript
export const FEATURE_FLAGS = {
  enableRegistration: process.env.NEXT_PUBLIC_ENABLE_REGISTRATION === 'true',
  enableSSO: process.env.NEXT_PUBLIC_ENABLE_SSO === 'true',
  enable2FA: process.env.NEXT_PUBLIC_ENABLE_2FA === 'true',
  enableDarkMode: process.env.NEXT_PUBLIC_ENABLE_DARK_MODE !== 'false',
} as const;
```

### **What are Feature Flags?**

Feature flags = Turn features ON/OFF without code changes.

**Real-world scenario:**
```
Customer A wants:
- ✅ User registration
- ❌ No SSO (they don't use it)
- ✅ 2FA enabled

Customer B wants:
- ❌ No registration (invite-only)
- ✅ SSO with Azure AD
- ❌ No 2FA (they use SSO)
```

---

### **Pattern Difference:**

```typescript
// Pattern 1: Explicit 'true' (opt-in)
enableRegistration: process.env.NEXT_PUBLIC_ENABLE_REGISTRATION === 'true'
// Must set to 'true' to enable, otherwise disabled

// Pattern 2: Not 'false' (opt-out)
enableDarkMode: process.env.NEXT_PUBLIC_ENABLE_DARK_MODE !== 'false'
// Enabled by default, set to 'false' to disable
```

**Truth tables:**

**Opt-in (Pattern 1):**
| .env.local | Result |
|------------|--------|
| `=true` | ✅ Enabled |
| `=false` | ❌ Disabled |
| (not set) | ❌ Disabled (default) |

**Opt-out (Pattern 2):**
| .env.local | Result |
|------------|--------|
| `=true` | ✅ Enabled |
| `=false` | ❌ Disabled |
| (not set) | ✅ Enabled (default) |

---

### **Usage Examples:**

#### **Conditional Rendering:**

```tsx
import { FEATURE_FLAGS } from '@/config/features'

export default function AuthPage() {
  return (
    <div>
      <LoginForm />
      
      {/* Show registration only if enabled */}
      {FEATURE_FLAGS.enableRegistration && (
        <Link href="/register">Don't have an account? Sign up</Link>
      )}
      
      {/* Show SSO button only if enabled */}
      {FEATURE_FLAGS.enableSSO && (
        <button onClick={handleSSOLogin}>
          Sign in with Azure AD
        </button>
      )}
    </div>
  )
}
```

#### **Using Helper Function:**

```tsx
import { isFeatureEnabled } from '@/config/features'

export default function Settings() {
  return (
    <div>
      <h1>Settings</h1>
      
      {isFeatureEnabled('enable2FA') && (
        <TwoFactorSettings />
      )}
      
      {isFeatureEnabled('enableDarkMode') && (
        <ThemeToggle />
      )}
    </div>
  )
}
```

---

## **Section 4: Deployment Info** (Lines 38-42)

```typescript
export const DEPLOYMENT_INFO = {
  environment: process.env.NODE_ENV || 'development',
  version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  buildDate: process.env.NEXT_PUBLIC_BUILD_DATE || new Date().toISOString(),
} as const;
```

### **Purpose:**
Track deployment information for debugging and support.

---

### **1. `environment`**

```typescript
environment: process.env.NODE_ENV || 'development'
```

**Possible values:**
- `'development'` → Local development
- `'production'` → Production deployment
- `'test'` → Running tests

**Set automatically by Next.js:**
```bash
npm run dev   → NODE_ENV=development
npm run build → NODE_ENV=production
npm start     → NODE_ENV=production
```

**Usage:**
```typescript
if (DEPLOYMENT_INFO.environment === 'development') {
  console.log('Debug info:', data)  // Only show in dev
}
```

---

### **2. `version`**

```typescript
version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0'
```

**Purpose:** Track app version for support/debugging

**Set in CI/CD:**
```bash
# In GitHub Actions / Jenkins
NEXT_PUBLIC_APP_VERSION=2.3.1
```

**Usage:**
```tsx
<footer>
  Version {DEPLOYMENT_INFO.version}
</footer>
```

---

### **3. `buildDate`**

```typescript
buildDate: process.env.NEXT_PUBLIC_BUILD_DATE || new Date().toISOString()
```

**Purpose:** When was this build created?

**Set in CI/CD:**
```bash
# Build script
NEXT_PUBLIC_BUILD_DATE=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
```

**Result:**
```
"2024-10-04T14:30:00.000Z"
```

**Usage:**
```tsx
<footer>
  Built: {new Date(DEPLOYMENT_INFO.buildDate).toLocaleDateString()}
</footer>
```

---

## **Section 5: Helper Functions** (Lines 47-59)

---

### **1. `shouldShowLandingPage()`**

```typescript
export function shouldShowLandingPage(): boolean {
  return SHOW_LANDING_PAGE;
}
```

**Why a function instead of just using `SHOW_LANDING_PAGE`?**

**Benefits:**
1. **Abstraction** - Hide implementation details
2. **Future flexibility** - Can add logic later
3. **Type safety** - Explicit return type
4. **Testability** - Easy to mock in tests

**Future enhancement example:**
```typescript
export function shouldShowLandingPage(): boolean {
  // Could add more logic:
  // - Check user's login status
  // - Check time of day
  // - Check A/B testing group
  
  if (typeof window !== 'undefined' && window.localStorage.getItem('returning_user')) {
    return false;  // Returning users skip landing
  }
  
  return SHOW_LANDING_PAGE;
}
```

---

### **2. `getDefaultRoute()`**

```typescript
export function getDefaultRoute(): string {
  return shouldShowLandingPage() ? '/' : '/login';
}
```

**Purpose:** Get the default route based on configuration

**Usage:**
```typescript
import { getDefaultRoute } from '@/config/features'

// After logout, where to redirect?
router.push(getDefaultRoute())

// On app startup, where to go?
const defaultPath = getDefaultRoute()
```

**Ternary operator breakdown:**
```typescript
condition ? valueIfTrue : valueIfFalse

shouldShowLandingPage() ? '/' : '/login'
//        ↓                ↓      ↓
//    if true         return /   return /login
```

---

### **3. `isFeatureEnabled()`**

```typescript
export function isFeatureEnabled(feature: keyof typeof FEATURE_FLAGS): boolean {
  return FEATURE_FLAGS[feature];
}
```

**Breaking down the TypeScript:**

```typescript
keyof typeof FEATURE_FLAGS
//     ↑      ↑
//  typeof   keyof
```

**Step 1: `typeof FEATURE_FLAGS`**
Gets the type of the object:
```typescript
{
  enableRegistration: boolean;
  enableSSO: boolean;
  enable2FA: boolean;
  enableDarkMode: boolean;
}
```

**Step 2: `keyof`**
Gets the keys as a union type:
```typescript
"enableRegistration" | "enableSSO" | "enable2FA" | "enableDarkMode"
```

**Result:**
TypeScript only allows valid feature names:
```typescript
isFeatureEnabled('enableSSO')        // ✅ OK
isFeatureEnabled('enableDarkMode')   // ✅ OK
isFeatureEnabled('invalidFeature')   // ❌ TypeScript ERROR!
```

---

## 🎯 **Real-World Usage Examples**

### **Example 1: Customer A (Standard Deployment)**

```bash
# .env.local
NEXT_PUBLIC_SHOW_LANDING_PAGE=true
NEXT_PUBLIC_APP_NAME=BlickTrack
NEXT_PUBLIC_COMPANY_NAME=Acme Corp
NEXT_PUBLIC_API_URL=https://api.acme.com
NEXT_PUBLIC_ENABLE_REGISTRATION=true
NEXT_PUBLIC_ENABLE_SSO=false
NEXT_PUBLIC_ENABLE_2FA=true
```

**Result:**
- ✅ Shows landing page
- ✅ App name: "BlickTrack"
- ✅ Registration enabled
- ❌ SSO disabled
- ✅ 2FA enabled

---

### **Example 2: Customer B (Enterprise with SSO)**

```bash
# .env.local
NEXT_PUBLIC_SHOW_LANDING_PAGE=false
NEXT_PUBLIC_APP_NAME=Acme Security Portal
NEXT_PUBLIC_COMPANY_NAME=Acme Corporation
NEXT_PUBLIC_API_URL=https://security.acme.internal
NEXT_PUBLIC_ENABLE_REGISTRATION=false
NEXT_PUBLIC_ENABLE_SSO=true
NEXT_PUBLIC_ENABLE_2FA=false
```

**Result:**
- ❌ No landing page (direct to login)
- ✅ App name: "Acme Security Portal"
- ❌ Registration disabled (invite-only)
- ✅ SSO enabled (Azure AD)
- ❌ 2FA disabled (using SSO)

---

## 📊 **Environment Variable Naming Convention**

```typescript
NEXT_PUBLIC_SHOW_LANDING_PAGE
└─┬──┘ └──┬──┘ └───────┬────────┘
  │       │             │
  │       │             └── Feature name (UPPER_SNAKE_CASE)
  │       └── Next.js prefix (REQUIRED for client-side)
  └── Next.js framework
```

**Rules:**
1. ✅ Must start with `NEXT_PUBLIC_` for client-side access
2. ✅ Use UPPER_SNAKE_CASE
3. ✅ Descriptive names
4. ❌ No `NEXT_PUBLIC_` = server-only (not accessible in browser)

---

## 🔒 **Security Considerations**

### **✅ Safe for Client-Side:**
```bash
NEXT_PUBLIC_APP_NAME=BlickTrack
NEXT_PUBLIC_API_URL=https://api.example.com
```

### **❌ NEVER expose secrets:**
```bash
# ❌ WRONG! This is exposed to browser!
NEXT_PUBLIC_DATABASE_PASSWORD=secret123
NEXT_PUBLIC_JWT_SECRET=mysecret

# ✅ CORRECT! Server-only (no NEXT_PUBLIC_)
DATABASE_PASSWORD=secret123
JWT_SECRET=mysecret
```

---

## 🧪 **Testing Your Configuration**

### **Create a debug page:**

```typescript
// src/app/debug/page.tsx
import { APP_CONFIG, FEATURE_FLAGS, DEPLOYMENT_INFO } from '@/config/features'

export default function DebugPage() {
  return (
    <div>
      <h1>Configuration Debug</h1>
      
      <h2>App Config:</h2>
      <pre>{JSON.stringify(APP_CONFIG, null, 2)}</pre>
      
      <h2>Feature Flags:</h2>
      <pre>{JSON.stringify(FEATURE_FLAGS, null, 2)}</pre>
      
      <h2>Deployment Info:</h2>
      <pre>{JSON.stringify(DEPLOYMENT_INFO, null, 2)}</pre>
    </div>
  )
}
```

Visit: `http://localhost:4000/debug`

---

## 🎯 **Key Takeaways**

1. ✅ **Centralized configuration** - One file controls everything
2. ✅ **Environment variables** - Different config per deployment
3. ✅ **Type-safe** - TypeScript catches errors
4. ✅ **Feature flags** - Enable/disable features per customer
5. ✅ **Helper functions** - Abstract configuration logic
6. ✅ **`as const`** - Prevent accidental modifications
7. ✅ **`NEXT_PUBLIC_`** - Required for client-side access

---

## 📚 **What's Next?**

Now you understand how to:
- ✅ Configure features per customer
- ✅ Use environment variables
- ✅ Create feature flags
- ✅ Access configuration in your app

**Ready to use this in your LoginPage or Dashboard?** 🚀

