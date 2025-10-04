# 🤖 LLM Prompts for BlickTrack Frontend Development

## 🎯 Master Prompt Template

Use this as your base prompt for all frontend development tasks:

```
You are an expert senior frontend developer specializing in modern React/Next.js applications. You build enterprise-grade, secure, performant, and accessible web applications.

**CONTEXT**: BlickTrack is a cybersecurity project management platform with RBAC, compliance tracking, audit logging, and security activity management.

**TECH STACK REQUIREMENTS**:
- Next.js 14+ with App Router (TypeScript)
- Tailwind CSS 3+ with CSS Variables for theming
- Shadcn/ui + Radix UI components
- React Hook Form + Zod validation
- Zustand for state management
- TanStack Query for server state
- NextAuth.js v5 for authentication
- Lucide React icons
- Recharts for data visualization

**CODE STANDARDS**:
1. Use TypeScript with strict mode - no `any` types
2. Follow React Server Components pattern where possible
3. Implement proper error boundaries and loading states
4. Use `use client` directive only when necessary
5. Implement comprehensive Zod validation schemas
6. Follow accessibility guidelines (WCAG 2.1 AA)
7. Use semantic HTML and proper ARIA attributes
8. Implement responsive design (mobile-first)
9. Use CSS variables for consistent theming
10. Include proper TypeScript interfaces/types

**SECURITY REQUIREMENTS**:
- Input sanitization and validation
- XSS prevention
- CSRF protection
- Secure authentication flows
- Permission-based component rendering
- Data encryption for sensitive information

**PERFORMANCE REQUIREMENTS**:
- Code splitting and lazy loading
- Optimized images and assets
- Minimal bundle size
- Efficient re-renders
- Proper caching strategies

Generate production-ready, well-documented code with comprehensive error handling.
```

## 🎨 UI Component Generation Prompts

### Base UI Component Prompt
```
Create a [COMPONENT_NAME] component using the following requirements:

**Base Template**:
```typescript
"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

// Define variants using cva
const [componentName]Variants = cva(
  "base-classes-here",
  {
    variants: {
      variant: {
        default: "variant-classes",
        // ... other variants
      },
      size: {
        default: "size-classes",
        // ... other sizes
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface [ComponentName]Props
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof [componentName]Variants> {
  // Additional props here
}

const [ComponentName] = React.forwardRef<
  HTMLElement,
  [ComponentName]Props
>(({ className, variant, size, ...props }, ref) => {
  return (
    <element
      className={cn([componentName]Variants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
})

[ComponentName].displayName = "[ComponentName]"

export { [ComponentName], [componentName]Variants }
```

**Requirements**:
1. Follow shadcn/ui patterns and styling
2. Include proper TypeScript interfaces
3. Use forwardRef for DOM element access
4. Implement variant props with class-variance-authority
5. Include proper accessibility attributes
6. Add loading and error states where applicable
7. Make it fully responsive
8. Include comprehensive JSDoc comments
9. Export both component and variants
10. Follow naming conventions (PascalCase for components)
```

### Form Component Prompt
```
Create a comprehensive form component for [FORM_PURPOSE] with the following specifications:

**Requirements**:
1. Use React Hook Form with Zod validation
2. Include all necessary form fields with proper types
3. Implement real-time validation with error messages
4. Add loading states during submission
5. Include success/error toast notifications
6. Use shadcn/ui form components
7. Implement proper accessibility (labels, ARIA attributes)
8. Add form reset functionality
9. Include proper TypeScript interfaces
10. Handle API integration with error handling

**Template Structure**:
```typescript
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

// Define Zod schema
const formSchema = z.object({
  // Define fields with proper validation
})

type FormData = z.infer<typeof formSchema>

export function [FormName]({ onSubmit, ...props }: Props) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // Default values
    },
  })

  // Implementation
}
```

**Validation Rules**:
- Email fields: proper email validation
- Password fields: strength requirements
- Required fields: meaningful error messages
- Custom validation for business logic
- Async validation for uniqueness checks
```

### Data Table Component Prompt
```
Create a sophisticated data table component for [DATA_TYPE] with the following features:

**Features Required**:
1. Server-side pagination, sorting, and filtering
2. Column resizing and reordering
3. Row selection (single/multiple)
4. Export functionality (CSV, PDF)
5. Search and advanced filtering
6. Loading skeletons
7. Empty states
8. Error handling
9. Responsive design (mobile table view)
10. Accessibility compliance

**Template**:
```typescript
"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  loading?: boolean
  onSelectionChange?: (selection: TData[]) => void
}

export function DataTable<TData, TValue>({
  columns,
  data,
  loading,
  onSelectionChange,
}: DataTableProps<TData, TValue>) {
  // Implementation with TanStack Table
}
```

**Styling Requirements**:
- Use shadcn/ui table components
- Implement proper hover states
- Add zebra striping for better readability
- Include proper spacing and typography
- Mobile-responsive breakpoints
```

## 🔐 Authentication & Security Prompts

### Auth Component Prompt
```
Create secure authentication components with the following requirements:

**Security Features**:
1. Input sanitization and validation
2. Rate limiting implementation
3. CSRF token handling
4. Secure password requirements
5. Account lockout protection
6. Session management
7. Remember me functionality
8. Password strength indicator
9. Proper error messages (no information leakage)
10. Multi-factor authentication support

**Components Needed**:
- LoginForm
- RegisterForm
- ForgotPasswordForm
- ResetPasswordForm
- ChangePasswordForm
- ProfileForm

**Template**:
```typescript
"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"

// Zod schema with security validations
const authSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
           "Password must contain uppercase, lowercase, number and special character"),
})

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Implementation with proper error handling
}
```
```

### Permission-Based Component Prompt
```
Create a permission-based component system with the following requirements:

**RBAC Implementation**:
1. Role-based access control
2. Permission-based rendering
3. Route protection
4. Component-level permissions
5. Feature flags integration
6. Audit logging for access attempts

**Components**:
```typescript
// Permission wrapper component
interface PermissionGuardProps {
  permission: string | string[]
  fallback?: React.ReactNode
  children: React.ReactNode
}

export function PermissionGuard({ 
  permission, 
  fallback = null, 
  children 
}: PermissionGuardProps) {
  // Implementation
}

// Hook for permission checking
export function usePermissions() {
  // Return permission checking functions
}
```
```

## 📊 Dashboard & Charts Prompts

### Dashboard Component Prompt
```
Create a comprehensive dashboard with the following components:

**Dashboard Features**:
1. Real-time data updates
2. Interactive charts and graphs
3. KPI cards with trends
4. Responsive grid layout
5. Customizable widgets
6. Export functionality
7. Time range selection
8. Data filtering
9. Performance optimization
10. Loading states and error handling

**Chart Types**:
- Line charts for trends
- Bar charts for comparisons
- Pie charts for distributions
- Area charts for cumulative data
- Gauge charts for metrics
- Funnel charts for processes

**Template**:
```typescript
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts"

interface DashboardProps {
  timeRange: string
  filters: Record<string, any>
}

export function Dashboard({ timeRange, filters }: DashboardProps) {
  // Implementation with proper data fetching and error handling
}
```
```

## 🎨 Styling & Theme Prompts

### Theme System Prompt
```
Create a comprehensive theme system with the following requirements:

**Theme Features**:
1. Light/Dark mode support
2. Color palette system
3. Typography scale
4. Spacing system
5. Component variants
6. CSS variable-based theming
7. Automatic system preference detection
8. Smooth theme transitions

**Implementation**:
```typescript
// Theme provider component
"use client"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

export function ThemeProvider({ 
  children, 
  defaultTheme = "system", 
  storageKey = "theme" 
}: ThemeProviderProps) {
  // Implementation
}
```

**CSS Variables**:
```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  /* Define all theme variables */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* Dark theme overrides */
}
```
```

## 🧪 Testing Prompts

### Component Testing Prompt
```
Create comprehensive tests for the [COMPONENT_NAME] component:

**Testing Requirements**:
1. Unit tests for all component functionality
2. Integration tests for user interactions
3. Accessibility tests
4. Visual regression tests
5. Performance tests
6. Error boundary tests

**Template**:
```typescript
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { vi } from "vitest"
import { [ComponentName] } from "./[component-name]"

describe("[ComponentName]", () => {
  beforeEach(() => {
    // Setup
  })

  it("renders correctly", () => {
    // Test implementation
  })

  it("handles user interactions", async () => {
    // Test user interactions
  })

  it("displays error states", () => {
    // Test error handling
  })

  it("is accessible", () => {
    // Accessibility tests
  })
})
```
```

## 🚀 Performance Optimization Prompts

### Performance Optimization Prompt
```
Optimize the [COMPONENT/FEATURE_NAME] for maximum performance:

**Optimization Techniques**:
1. React.memo for expensive components
2. useMemo for expensive calculations
3. useCallback for stable function references
4. Code splitting with dynamic imports
5. Image optimization with Next.js Image
6. Bundle analysis and reduction
7. Virtual scrolling for large lists
8. Debouncing for search inputs
9. Proper cache strategies
10. Lazy loading for non-critical components

**Implementation Example**:
```typescript
import { memo, useMemo, useCallback, lazy, Suspense } from "react"
import dynamic from "next/dynamic"

// Lazy load heavy components
const HeavyComponent = dynamic(() => import("./heavy-component"), {
  loading: () => <div>Loading...</div>,
})

export const OptimizedComponent = memo(({ data, onUpdate }) => {
  // Memoize expensive calculations
  const processedData = useMemo(() => {
    return expensiveDataProcessing(data)
  }, [data])

  // Stable function references
  const handleUpdate = useCallback((id: string, value: any) => {
    onUpdate(id, value)
  }, [onUpdate])

  return (
    // Component implementation
  )
})
```
```

## 📱 Responsive Design Prompts

### Mobile-First Component Prompt
```
Create a fully responsive [COMPONENT_NAME] with mobile-first approach:

**Responsive Requirements**:
1. Mobile-first design (320px+)
2. Tablet optimization (768px+)
3. Desktop enhancement (1024px+)
4. Touch-friendly interactions
5. Keyboard navigation support
6. Screen reader compatibility
7. Proper viewport handling
8. Performance on mobile devices

**Breakpoint System**:
```typescript
// Tailwind breakpoints
const breakpoints = {
  sm: '640px',   // Small devices
  md: '768px',   // Medium devices
  lg: '1024px',  // Large devices
  xl: '1280px',  // Extra large devices
  '2xl': '1536px' // 2X Extra large devices
}

// Component with responsive classes
<div className="
  w-full px-4 
  sm:px-6 sm:max-w-md
  md:px-8 md:max-w-lg
  lg:px-12 lg:max-w-xl
  xl:px-16 xl:max-w-2xl
">
  {/* Responsive content */}
</div>
```
```

## 🔍 Final Implementation Checklist

When using these prompts, ensure each component includes:

- ✅ TypeScript interfaces and proper typing
- ✅ Error boundaries and error handling
- ✅ Loading states and skeletons
- ✅ Accessibility attributes (ARIA, semantic HTML)
- ✅ Responsive design (mobile-first)
- ✅ Performance optimizations
- ✅ Security considerations
- ✅ Comprehensive testing
- ✅ Proper documentation
- ✅ Consistent styling with design system

## 🎯 Usage Example

```
[MASTER_PROMPT]

Task: Create a project management dashboard component for BlickTrack

Specific Requirements:
- Display project list with status indicators
- Include search and filtering capabilities
- Show project progress with charts
- Handle real-time updates
- Support bulk operations
- Include export functionality
- Mobile-responsive design
- Full accessibility support

Please implement following the architecture guidelines and include all necessary types, validation, and error handling.
```

This approach will generate consistent, high-quality, maintainable code that follows modern React/Next.js best practices while ensuring security, performance, and accessibility.