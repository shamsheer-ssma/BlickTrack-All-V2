# BlickTrack Frontend Architecture

## 🏗️ Modern Next.js 14+ Architecture with App Router

### Core Technologies Stack
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS 3+ with CSS Variables
- **UI Components**: Shadcn/ui + Radix UI
- **State Management**: Zustand + React Query (TanStack Query)
- **Forms**: React Hook Form + Zod validation
- **Authentication**: NextAuth.js v5
- **Database**: Prisma ORM integration
- **Testing**: Vitest + Testing Library
- **Linting**: ESLint 9+ + Prettier
- **Package Manager**: pnpm (faster than npm)

### 📁 Folder Structure

```
frontend/
├── public/                          # Static assets
│   ├── icons/                       # SVG icons
│   ├── images/                      # Images
│   └── favicon.ico
├── src/                             # Source code
│   ├── app/                         # Next.js App Router
│   │   ├── (auth)/                  # Auth route group
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/             # Dashboard route group
│   │   │   ├── admin/
│   │   │   ├── projects/
│   │   │   ├── compliance/
│   │   │   ├── security/
│   │   │   ├── audit/
│   │   │   ├── users/
│   │   │   └── layout.tsx
│   │   ├── api/                     # API routes
│   │   │   ├── auth/
│   │   │   ├── projects/
│   │   │   └── compliance/
│   │   ├── globals.css              # Global styles
│   │   ├── layout.tsx               # Root layout
│   │   ├── loading.tsx              # Global loading UI
│   │   ├── error.tsx                # Global error UI
│   │   ├── not-found.tsx            # 404 page
│   │   └── page.tsx                 # Home page
│   ├── components/                  # Reusable components
│   │   ├── ui/                      # Base UI components (shadcn/ui)
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── table.tsx
│   │   │   ├── form.tsx
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── alert.tsx
│   │   │   ├── calendar.tsx
│   │   │   ├── date-picker.tsx
│   │   │   ├── data-table.tsx
│   │   │   └── index.ts
│   │   ├── layout/                  # Layout components
│   │   │   ├── header/
│   │   │   │   ├── header.tsx
│   │   │   │   ├── user-nav.tsx
│   │   │   │   ├── notifications.tsx
│   │   │   │   └── search.tsx
│   │   │   ├── sidebar/
│   │   │   │   ├── sidebar.tsx
│   │   │   │   ├── nav-main.tsx
│   │   │   │   ├── nav-secondary.tsx
│   │   │   │   └── nav-user.tsx
│   │   │   ├── footer/
│   │   │   │   └── footer.tsx
│   │   │   └── breadcrumb.tsx
│   │   ├── forms/                   # Form components
│   │   │   ├── auth/
│   │   │   │   ├── login-form.tsx
│   │   │   │   ├── register-form.tsx
│   │   │   │   └── forgot-password-form.tsx
│   │   │   ├── project/
│   │   │   │   ├── project-form.tsx
│   │   │   │   └── project-settings.tsx
│   │   │   ├── user/
│   │   │   │   ├── user-form.tsx
│   │   │   │   └── user-profile.tsx
│   │   │   └── compliance/
│   │   │       ├── framework-form.tsx
│   │   │       └── requirement-form.tsx
│   │   ├── features/                # Feature-specific components
│   │   │   ├── auth/
│   │   │   │   ├── auth-provider.tsx
│   │   │   │   └── protected-route.tsx
│   │   │   ├── dashboard/
│   │   │   │   ├── dashboard-overview.tsx
│   │   │   │   ├── stats-cards.tsx
│   │   │   │   └── recent-activity.tsx
│   │   │   ├── projects/
│   │   │   │   ├── project-list.tsx
│   │   │   │   ├── project-card.tsx
│   │   │   │   ├── project-details.tsx
│   │   │   │   └── project-timeline.tsx
│   │   │   ├── compliance/
│   │   │   │   ├── compliance-dashboard.tsx
│   │   │   │   ├── framework-selector.tsx
│   │   │   │   ├── requirement-tracker.tsx
│   │   │   │   └── compliance-reports.tsx
│   │   │   ├── security/
│   │   │   │   ├── security-activities.tsx
│   │   │   │   ├── threat-models.tsx
│   │   │   │   └── vulnerability-scanner.tsx
│   │   │   ├── audit/
│   │   │   │   ├── audit-logs.tsx
│   │   │   │   ├── audit-reports.tsx
│   │   │   │   └── monitoring-dashboard.tsx
│   │   │   └── users/
│   │   │       ├── user-management.tsx
│   │   │       ├── role-management.tsx
│   │   │       └── permissions.tsx
│   │   ├── charts/                  # Chart components
│   │   │   ├── compliance-charts.tsx
│   │   │   ├── security-metrics.tsx
│   │   │   ├── project-progress.tsx
│   │   │   └── audit-trends.tsx
│   │   ├── tables/                  # Data table components
│   │   │   ├── projects-table.tsx
│   │   │   ├── users-table.tsx
│   │   │   ├── audit-logs-table.tsx
│   │   │   └── compliance-table.tsx
│   │   └── common/                  # Common utility components
│   │       ├── loading-spinner.tsx
│   │       ├── error-boundary.tsx
│   │       ├── page-header.tsx
│   │       ├── empty-state.tsx
│   │       ├── confirmation-dialog.tsx
│   │       └── theme-provider.tsx
│   ├── lib/                         # Utility libraries
│   │   ├── auth/                    # Authentication utilities
│   │   │   ├── config.ts
│   │   │   ├── providers.ts
│   │   │   └── middleware.ts
│   │   ├── api/                     # API utilities
│   │   │   ├── client.ts
│   │   │   ├── endpoints.ts
│   │   │   ├── queries.ts
│   │   │   ├── mutations.ts
│   │   │   └── types.ts
│   │   ├── db/                      # Database utilities
│   │   │   ├── prisma.ts
│   │   │   └── seed.ts
│   │   ├── validations/             # Zod schemas
│   │   │   ├── auth.ts
│   │   │   ├── project.ts
│   │   │   ├── user.ts
│   │   │   └── compliance.ts
│   │   ├── utils/                   # General utilities
│   │   │   ├── cn.ts                # Class name utility
│   │   │   ├── format.ts            # Formatting utilities
│   │   │   ├── date.ts              # Date utilities
│   │   │   ├── constants.ts         # App constants
│   │   │   └── permissions.ts       # Permission utilities
│   │   ├── hooks/                   # Custom React hooks
│   │   │   ├── use-auth.ts
│   │   │   ├── use-permissions.ts
│   │   │   ├── use-local-storage.ts
│   │   │   ├── use-debounce.ts
│   │   │   ├── use-media-query.ts
│   │   │   └── use-toast.ts
│   │   └── stores/                  # Zustand stores
│   │       ├── auth-store.ts
│   │       ├── project-store.ts
│   │       ├── theme-store.ts
│   │       └── ui-store.ts
│   ├── types/                       # TypeScript type definitions
│   │   ├── api.ts                   # API response types
│   │   ├── auth.ts                  # Authentication types
│   │   ├── project.ts               # Project types
│   │   ├── user.ts                  # User types
│   │   ├── compliance.ts            # Compliance types
│   │   ├── audit.ts                 # Audit types
│   │   ├── security.ts              # Security types
│   │   └── global.ts                # Global types
│   └── styles/                      # Styling files
│       ├── globals.css              # Global CSS
│       ├── components.css           # Component-specific styles
│       └── themes/                  # Theme configurations
│           ├── light.css
│           ├── dark.css
│           └── variables.css
├── .env.local                       # Environment variables
├── .env.example                     # Environment variables example
├── .eslintrc.json                   # ESLint configuration
├── .gitignore                       # Git ignore rules
├── components.json                  # Shadcn/ui configuration
├── middleware.ts                    # Next.js middleware
├── next.config.js                   # Next.js configuration
├── package.json                     # Dependencies
├── pnpm-lock.yaml                   # pnpm lock file
├── postcss.config.js                # PostCSS configuration
├── prettier.config.js               # Prettier configuration
├── README.md                        # Project documentation
├── tailwind.config.js               # Tailwind CSS configuration
├── tsconfig.json                    # TypeScript configuration
└── vitest.config.ts                 # Vitest configuration
```

### 🎯 Key Architectural Principles

1. **App Router First**: Using Next.js 14+ App Router for better performance
2. **Route Groups**: Organizing routes with `(auth)` and `(dashboard)` groups
3. **Component Composition**: Separating UI, features, and layout components
4. **Type Safety**: Full TypeScript coverage with strict mode
5. **Performance**: Code splitting, lazy loading, and optimized imports
6. **Accessibility**: WCAG 2.1 AA compliant components
7. **Responsive Design**: Mobile-first approach with Tailwind CSS
8. **Security**: Input validation, CSRF protection, and secure headers
9. **Testing**: Comprehensive testing strategy with Vitest
10. **Developer Experience**: Hot reload, TypeScript, linting, and formatting

### 🔧 Development Tools Integration

- **Package Manager**: pnpm for faster installs
- **Code Quality**: ESLint + Prettier + Husky
- **Type Checking**: TypeScript strict mode
- **Testing**: Vitest + Testing Library + MSW
- **State Management**: Zustand for global state
- **Data Fetching**: TanStack Query for server state
- **Form Handling**: React Hook Form + Zod
- **UI Components**: Shadcn/ui + Radix UI
- **Styling**: Tailwind CSS + CSS Variables
- **Icons**: Lucide React + Heroicons
- **Charts**: Recharts + Chart.js