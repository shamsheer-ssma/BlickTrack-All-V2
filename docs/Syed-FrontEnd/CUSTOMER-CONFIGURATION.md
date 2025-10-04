# 🏢 **Customer-Specific Configuration Guide**

---

## 🎯 **Overview**

BlickTrack supports **per-customer configuration** to meet different enterprise requirements. Some customers want a marketing landing page, while others prefer direct login access.

---

## 🔧 **Configuration Methods**

### **✅ Method 1: Environment Variables** (RECOMMENDED)

This is the **professional, enterprise-grade** approach.

**Benefits:**
- ✅ No code changes needed
- ✅ Different config per environment (dev, staging, prod)
- ✅ Easy to maintain
- ✅ Industry standard
- ✅ Secure (secrets not in code)
- ✅ Can change without rebuild

---

## 📂 **Configuration Files**

### **1. `.env.local.example`** (Template)

```bash
# ============================================
# BlickTrack Environment Configuration
# ============================================

# Landing Page Configuration
# Set to 'true' to show landing page at /
# Set to 'false' to redirect directly to login
NEXT_PUBLIC_SHOW_LANDING_PAGE=true
```

**Purpose:** Template for developers (committed to git)

---

### **2. `.env.local`** (Actual Config)

```bash
NEXT_PUBLIC_SHOW_LANDING_PAGE=true
```

**Purpose:** Actual configuration (NOT committed to git)

**Location:** `qk-test/.env.local`

---

### **3. `src/config/features.ts`** (Code)

```typescript
export const SHOW_LANDING_PAGE = 
  process.env.NEXT_PUBLIC_SHOW_LANDING_PAGE !== 'false';
```

**Purpose:** Reads environment variables and exports configuration

---

## 🎛️ **How to Configure Per Customer**

### **Scenario 1: Customer Wants Landing Page** (Default)

```bash
# .env.local
NEXT_PUBLIC_SHOW_LANDING_PAGE=true
```

**User Flow:**
```
1. User visits: yourapp.com/
2. Sees: Landing page with features
3. Clicks: "Sign In" button
4. Goes to: yourapp.com/login
```

**Use Case:**
- New customers who need marketing
- Public-facing deployments
- Trial/demo environments

---

### **Scenario 2: Customer Wants Direct Login**

```bash
# .env.local
NEXT_PUBLIC_SHOW_LANDING_PAGE=false
```

**User Flow:**
```
1. User visits: yourapp.com/
2. Automatically redirected to: yourapp.com/login
3. Sees: Login form immediately
```

**Use Case:**
- Existing customers with established users
- Internal company deployments
- Direct access requirements
- No marketing needed

---

## 🚀 **Deployment Guide**

### **For Each Customer Deployment:**

#### **Step 1: Clone Repository**
```bash
git clone <repository>
cd qk-test
```

#### **Step 2: Create Customer-Specific Config**
```bash
# Copy example file
cp .env.local.example .env.local

# Edit for this customer
nano .env.local
```

#### **Step 3: Set Customer Preferences**

**Customer A (Wants landing page):**
```bash
# .env.local
NEXT_PUBLIC_SHOW_LANDING_PAGE=true
NEXT_PUBLIC_APP_NAME=BlickTrack
NEXT_PUBLIC_COMPANY_NAME=Customer A Corp
```

**Customer B (Direct login):**
```bash
# .env.local
NEXT_PUBLIC_SHOW_LANDING_PAGE=false
NEXT_PUBLIC_APP_NAME=SecurePortal
NEXT_PUBLIC_COMPANY_NAME=Customer B Inc
```

#### **Step 4: Build & Deploy**
```bash
npm run build
npm start
```

---

## 📊 **Configuration Options**

### **Available Settings:**

| Variable | Default | Purpose | Values |
|----------|---------|---------|--------|
| `NEXT_PUBLIC_SHOW_LANDING_PAGE` | `true` | Show/hide landing page | `true` / `false` |
| `NEXT_PUBLIC_APP_NAME` | `BlickTrack` | Application name | Any string |
| `NEXT_PUBLIC_COMPANY_NAME` | `Enterprise Solutions` | Company name | Any string |
| `NEXT_PUBLIC_SUPPORT_EMAIL` | `support@blicktrack.com` | Support email | Email address |

---

## 🔄 **How It Works**

### **Code Flow:**

```typescript
// 1. User visits / (home page)
// 2. Next.js calls: src/app/page.tsx

export default function Home() {
  // 3. Check environment variable
  if (!shouldShowLandingPage()) {
    // 4a. If false, redirect to /login
    redirect('/login')
  }

  // 4b. If true, show landing page
  return <LandingPage />
}
```

### **Environment Variable Resolution:**

```typescript
// src/config/features.ts
export const SHOW_LANDING_PAGE = 
  process.env.NEXT_PUBLIC_SHOW_LANDING_PAGE !== 'false';
  
// How it works:
// If .env.local has: NEXT_PUBLIC_SHOW_LANDING_PAGE=true  → Returns true
// If .env.local has: NEXT_PUBLIC_SHOW_LANDING_PAGE=false → Returns false
// If NOT SET in .env.local                                → Returns true (default)
```

---

## 🎯 **Why NOT Comment Code?**

### **❌ Bad Approach (Commenting):**

```typescript
// BAD: Don't do this!
export default function Home() {
  // For Customer A:
  return <LandingPage />
  
  // For Customer B (uncomment this):
  // redirect('/login')
}
```

**Problems:**
- ❌ Requires code changes per customer
- ❌ Easy to forget which is commented
- ❌ Hard to maintain multiple customers
- ❌ Code clutter
- ❌ Merge conflicts
- ❌ Not scalable

---

### **✅ Good Approach (Environment Variables):**

```typescript
// GOOD: Professional approach
export default function Home() {
  if (!shouldShowLandingPage()) {
    redirect('/login')
  }
  return <LandingPage />
}
```

**Benefits:**
- ✅ One codebase for all customers
- ✅ Configuration outside code
- ✅ Easy to change without rebuild
- ✅ Clear and maintainable
- ✅ Industry standard
- ✅ Scalable to 100s of customers

---

## 🏗️ **Enterprise Deployment Architecture**

```
┌──────────────────────────────────────────┐
│         Single Codebase                  │
│         (Git Repository)                 │
└─────────────┬────────────────────────────┘
              │
              ├─────────────────────────────┐
              │                             │
              ↓                             ↓
    ┌─────────────────┐          ┌─────────────────┐
    │  Customer A     │          │  Customer B     │
    │  Deployment     │          │  Deployment     │
    ├─────────────────┤          ├─────────────────┤
    │ .env.local:     │          │ .env.local:     │
    │ LANDING=true    │          │ LANDING=false   │
    │                 │          │                 │
    │ Result:         │          │ Result:         │
    │ / → Landing     │          │ / → Login       │
    └─────────────────┘          └─────────────────┘
```

---

## 🧪 **Testing Different Configurations**

### **Test Landing Page Mode:**

```bash
# Edit .env.local
NEXT_PUBLIC_SHOW_LANDING_PAGE=true

# Restart server
npm run dev

# Visit: http://localhost:4000/
# Should see: Landing page
```

### **Test Direct Login Mode:**

```bash
# Edit .env.local
NEXT_PUBLIC_SHOW_LANDING_PAGE=false

# Restart server
npm run dev

# Visit: http://localhost:4000/
# Should redirect to: http://localhost:4000/login
```

---

## 📝 **Customer Deployment Checklist**

```
□ Clone repository
□ Copy .env.local.example → .env.local
□ Set NEXT_PUBLIC_SHOW_LANDING_PAGE (true/false)
□ Set customer-specific branding (app name, company name)
□ Set support email
□ Test landing page behavior
□ Test login flow
□ Test dashboard access
□ Build for production: npm run build
□ Deploy to customer environment
□ Verify configuration in production
```

---

## 🔐 **Security Best Practices**

### **DO:**
- ✅ Keep `.env.local` out of git (already in `.gitignore`)
- ✅ Use environment variables for secrets
- ✅ Different `.env.local` per environment
- ✅ Document all variables in `.env.local.example`

### **DON'T:**
- ❌ Commit `.env.local` to git
- ❌ Put secrets in code
- ❌ Use same config for dev and prod
- ❌ Forget to document new variables

---

## 🚀 **Future Enhancements**

You can extend this system for:

```typescript
// src/config/features.ts

export const FEATURE_FLAGS = {
  // Per-customer features
  enableRegistration: process.env.NEXT_PUBLIC_ENABLE_REGISTRATION === 'true',
  enableSSO: process.env.NEXT_PUBLIC_ENABLE_SSO === 'true',
  enable2FA: process.env.NEXT_PUBLIC_ENABLE_2FA === 'true',
  enableDarkMode: process.env.NEXT_PUBLIC_ENABLE_DARK_MODE !== 'false',
  
  // Customer-specific modules
  enableThreatModeling: process.env.NEXT_PUBLIC_ENABLE_THREAT === 'true',
  enableVulnScanning: process.env.NEXT_PUBLIC_ENABLE_VULN === 'true',
  enableCompliance: process.env.NEXT_PUBLIC_ENABLE_COMPLIANCE === 'true',
};
```

**Then in components:**
```typescript
import { isFeatureEnabled } from '@/config/features'

export default function Dashboard() {
  return (
    <div>
      {isFeatureEnabled('enableThreatModeling') && <ThreatModule />}
      {isFeatureEnabled('enableVulnScanning') && <VulnScanner />}
      {isFeatureEnabled('enableCompliance') && <ComplianceModule />}
    </div>
  )
}
```

---

## 📊 **Summary**

| Approach | Use Case | Pros | Cons |
|----------|----------|------|------|
| **Environment Variables** ✅ | Production | Clean, scalable, standard | Requires server restart |
| **Commenting Code** ❌ | Never | Simple | Unmaintainable, error-prone |
| **If/Else in Code** ❌ | Never | Works | Not configurable per deploy |

---

## 🎯 **Key Takeaways**

1. ✅ Use **environment variables** for customer configuration
2. ✅ One codebase, multiple configurations
3. ✅ Keep config separate from code
4. ✅ Document all variables
5. ✅ Test both configurations
6. ✅ `.env.local` is gitignored (secure)
7. ✅ Easy to add more feature flags

---

**Your app is now enterprise-ready with customer-specific configuration!** 🎉

