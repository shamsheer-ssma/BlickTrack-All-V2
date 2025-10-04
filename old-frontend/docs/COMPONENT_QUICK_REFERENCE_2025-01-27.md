# 🚀 BlickTrack Components - Quick Reference Guide

**Date**: January 27, 2025  
**For**: Developers adding new pages

---

## 🎯 Quick Start

### **1. Choose Your Page Type**

| Page Type | Layout | Sidebar | Example |
|-----------|--------|---------|---------|
| **Landing** | `<Layout>` | ❌ No | Homepage, marketing |
| **Auth** | `<Layout>` | ❌ No | Login, signup, forgot password |
| **Dashboard** | `<Layout showSidebar={true}>` | ✅ Yes | Admin dashboard, analytics |
| **Feature** | `<Layout showSidebar={true}>` | ✅ Yes | Users, tenants, settings |

### **2. Copy-Paste Templates**

#### **📊 Dashboard/Feature Page Template**
```typescript
'use client';
import Layout from '@/components/layout/Layout';

export default function YourPage() {
  return (
    <Layout showSidebar={true}>
      <div className="px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Your Page Title</h1>
          <p className="text-slate-600">Your page description</p>
        </div>
        
        {/* Your page content here */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <p>Your content goes here</p>
        </div>
      </div>
    </Layout>
  );
}
```

#### **🔐 Auth Page Template**
```typescript
'use client';
import Layout from '@/components/layout/Layout';

export default function YourAuthPage() {
  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          {/* Your auth form here */}
          <div className="bg-white rounded-xl p-8 shadow-xl">
            <h1 className="text-2xl font-bold mb-6">Your Auth Form</h1>
            {/* Form content */}
          </div>
        </div>
      </div>
    </Layout>
  );
}
```

#### **🏠 Landing Page Template**
```typescript
import Layout from '@/components/layout/Layout';

export default function YourLandingPage() {
  return (
    <Layout>
      <div className="min-h-screen">
        {/* Your landing page content */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <h1 className="text-4xl font-bold mb-6">Your Landing Page</h1>
            {/* Content */}
          </div>
        </section>
      </div>
    </Layout>
  );
}
```

---

## 🎨 Component Structure

```
components/layout/
├── Layout.tsx          # Main wrapper (auto-detects page type)
├── Header.tsx          # Navigation header (logo, search, profile)
└── Sidebar.tsx         # Navigation menu (dashboard pages only)
```

---

## 📱 Responsive Behavior

### **Desktop (1024px+)**
- ✅ Fixed sidebar on left
- ✅ Main content adjusts automatically
- ✅ Full navigation visible

### **Mobile (<1024px)**
- ✅ Collapsible sidebar with overlay
- ✅ Hamburger menu in header
- ✅ Touch-friendly navigation

---

## 🎯 Adding Navigation Items

### **Edit Sidebar Navigation**
File: `components/layout/Sidebar.tsx`

```typescript
const navigation = [
  // Add your new section here
  {
    name: 'Your Feature',
    href: '/your-feature',
    icon: <YourIcon className="w-5 h-5" />,
    children: [
      { name: 'Overview', href: '/your-feature' },
      { name: 'Settings', href: '/your-feature/settings' },
    ]
  }
];
```

### **Available Icons**
```typescript
import { 
  Users,           // User management
  Building2,       // Tenant management  
  Shield,          // Security
  Settings,        // Settings
  BarChart3,       // Analytics
  FileText,        // Reports
  Zap,             // Alerts
  Activity,        // System health
  LayoutDashboard, // Dashboard
} from 'lucide-react';
```

---

## 🚨 Common Mistakes

### **❌ Don't Do This**
```typescript
// Wrong - no layout component
export default function BadPage() {
  return (
    <div className="min-h-screen">
      <nav>Custom navigation</nav>
      <main>Content</main>
    </div>
  );
}

// Wrong - wrong layout type
<Layout showSidebar={false}>
  <DashboardContent />
</Layout>
```

### **✅ Do This Instead**
```typescript
// Correct - using layout component
export default function GoodPage() {
  return (
    <Layout showSidebar={true}>
      <DashboardContent />
    </Layout>
  );
}
```

---

## 🔧 File Structure Examples

### **Simple Page**
```
app/your-feature/page.tsx
```

### **Page with Sub-pages**
```
app/your-feature/
├── page.tsx              # /your-feature
├── settings/
│   └── page.tsx          # /your-feature/settings
└── [id]/
    └── page.tsx          # /your-feature/123
```

### **Multiple Related Pages**
```
app/users/
├── page.tsx              # /users (list)
├── create/
│   └── page.tsx          # /users/create
├── [id]/
│   └── page.tsx          # /users/123 (view)
└── [id]/edit/
    └── page.tsx          # /users/123/edit
```

---

## 🎨 Styling Guidelines

### **Use These Classes**
```css
/* Page containers */
px-6 py-8                 /* Standard page padding */
bg-white rounded-xl       /* Card containers */
shadow-sm border          /* Card styling */

/* Text hierarchy */
text-2xl font-bold        /* Page titles */
text-slate-600           /* Descriptions */
text-slate-900           /* Main text */

/* Spacing */
mb-8                     /* Section spacing */
space-y-4                /* List spacing */
gap-6                    /* Grid spacing */
```

### **Color Palette**
```css
/* Primary Colors */
bg-blue-600              /* Primary buttons */
text-blue-600            /* Links, accents */

/* Backgrounds */
bg-slate-50              /* Page background */
bg-white                 /* Card background */
bg-slate-100             /* Hover states */

/* Text Colors */
text-slate-900           /* Primary text */
text-slate-600           /* Secondary text */
text-slate-500           /* Muted text */
```

---

## 🚀 Testing Checklist

Before deploying your new page:

- [ ] **Layout renders correctly** on desktop
- [ ] **Mobile responsive** (test on phone)
- [ ] **Sidebar shows/hides** appropriately
- [ ] **Navigation works** (if added to sidebar)
- [ ] **No console errors**
- [ ] **Page loads fast**
- [ ] **Accessibility** (keyboard navigation)

---

## 📞 Need Help?

1. **Check existing pages** for examples
2. **Read the full documentation** in `REUSABLE_COMPONENTS_ARCHITECTURE.md`
3. **Ask the development team**

---

**Remember**: Always use the Layout component for consistent design! 🎯
