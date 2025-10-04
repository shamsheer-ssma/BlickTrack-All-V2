# Reusable Component Architecture

## Overview

This document outlines the comprehensive reusable component architecture implemented for the BlickTrack platform, focusing on security, responsiveness, and maintainability.

## 🏗️ Architecture Principles

### 1. **Component Composition**
- Small, focused components that can be composed together
- Clear separation of concerns
- Reusable across different contexts

### 2. **Type Safety**
- Full TypeScript support with strict typing
- Generic components for maximum flexibility
- Interface-driven development

### 3. **Security First**
- Input validation and sanitization
- XSS and SQL injection prevention
- CSRF protection
- Rate limiting

### 4. **Responsive Design**
- Mobile-first approach
- Consistent breakpoints
- Flexible grid systems
- Adaptive typography

## 📁 Component Structure

```
components/
├── ui/                     # Base UI components
│   ├── button.tsx         # Button component with variants
│   ├── modal.tsx          # Modal system with composition
│   ├── form.tsx           # Form components with validation
│   ├── loading.tsx        # Loading states and skeletons
│   ├── alert.tsx          # Alert and toast system
│   ├── card.tsx           # Card components
│   ├── input.tsx          # Input components
│   ├── table.tsx          # Table components
│   └── dropdown-menu.tsx  # Dropdown components
├── admin/                 # Admin-specific components
│   ├── AdminLayout.tsx    # Main admin layout
│   ├── AdminSidebar.tsx   # Navigation sidebar
│   ├── TenantManagement.tsx
│   ├── UserManagement.tsx
│   └── ...
└── layout/                # Layout components
    ├── Header.tsx
    ├── Footer.tsx
    └── Navigation.tsx
```

## 🧩 Core UI Components

### Button Component
```tsx
import { Button } from '@/components/ui/button';

// Basic usage
<Button>Click me</Button>

// With variants and sizes
<Button variant="destructive" size="lg">
  Delete
</Button>

// With loading state
<Button loading={isLoading} loadingText="Saving...">
  Save Changes
</Button>

// With icons
<Button leftIcon={<Save />} rightIcon={<ArrowRight />}>
  Save & Continue
</Button>
```

### Modal System
```tsx
import { Modal, ModalBody, ModalFooter } from '@/components/ui/modal';

<Modal
  isOpen={isOpen}
  onClose={onClose}
  title="Edit Tenant"
  size="lg"
>
  <ModalBody>
    {/* Form content */}
  </ModalBody>
  <ModalFooter>
    <Button variant="outline" onClick={onClose}>
      Cancel
    </Button>
    <Button onClick={onSave}>
      Save Changes
    </Button>
  </ModalFooter>
</Modal>
```

### Form System
```tsx
import { Form, FormInput, FormSelect, FormTextarea } from '@/components/ui/form';

<Form onSubmit={handleSubmit}>
  <FormInput
    label="Tenant Name"
    required
    value={formData.name}
    onChange={(e) => setFormData({...formData, name: e.target.value})}
  />
  
  <FormSelect
    label="Plan"
    options={planOptions}
    value={formData.plan}
    onChange={(e) => setFormData({...formData, plan: e.target.value})}
  />
  
  <FormTextarea
    label="Description"
    rows={3}
    value={formData.description}
    onChange={(e) => setFormData({...formData, description: e.target.value})}
  />
</Form>
```

## 🔒 Security Features

### Input Validation
```tsx
import { validateInput, ValidationSchema } from '@/lib/security';

const schema: ValidationSchema = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-Z\s]+$/
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  }
};

const { isValid, errors } = validateInput(formData, schema);
```

### Input Sanitization
```tsx
import { sanitizeInput, escapeHtml } from '@/lib/security';

// Sanitize user input
const cleanInput = sanitizeInput(userInput);

// Escape HTML for display
const safeHtml = escapeHtml(userContent);
```

### Rate Limiting
```tsx
import { RateLimiter } from '@/lib/security';

const rateLimiter = new RateLimiter(100, 15 * 60 * 1000); // 100 requests per 15 minutes

if (!rateLimiter.isAllowed(userId)) {
  throw new Error('Rate limit exceeded');
}
```

## 📱 Responsive Design

### Breakpoint System
```tsx
import { useResponsive } from '@/lib/responsive';

function MyComponent() {
  const { isMobile, isTablet, isDesktop, breakpoint } = useResponsive();
  
  return (
    <div className={getResponsiveClasses(
      'grid-cols-1',      // Mobile
      'sm:grid-cols-2',   // Small screens
      'md:grid-cols-3',   // Medium screens
      'lg:grid-cols-4'    // Large screens
    )}>
      {/* Content */}
    </div>
  );
}
```

### Responsive Classes
```tsx
import { gridClasses, spacingClasses, typographyClasses } from '@/lib/responsive';

// Grid
<div className={gridClasses.responsive['1-2-3']}>

// Spacing
<div className={spacingClasses.padding.responsive}>

// Typography
<h1 className={typographyClasses.h1}>
```

## 🔄 State Management

### Form State
```tsx
import { FormProvider, useFormContext } from '@/components/ui/form';

function MyForm() {
  const { errors, setError, clearError } = useFormContext();
  
  const handleSubmit = (data) => {
    // Validation logic
    if (!data.name) {
      setError('name', 'Name is required');
      return;
    }
    
    // Submit logic
  };
}
```

### Loading States
```tsx
import { LoadingState, LoadingSpinner } from '@/components/ui/loading';

<LoadingState
  loading={isLoading}
  error={error}
  empty={data.length === 0}
  emptyText="No tenants found"
>
  {/* Content when loaded */}
</LoadingState>
```

## 🌐 API Integration

### Type-Safe API Client
```tsx
import { tenantApi, withErrorHandling } from '@/lib/api-client';

// Basic usage
const tenants = await tenantApi.getAll();

// With error handling
const createTenant = withErrorHandling(
  (data) => tenantApi.create(data),
  'Failed to create tenant'
);

const result = await createTenant(tenantData);
```

### Error Handling
```tsx
import { toast } from '@/components/ui/alert';

try {
  await tenantApi.create(data);
  toast({
    variant: 'success',
    title: 'Success',
    description: 'Tenant created successfully'
  });
} catch (error) {
  toast({
    variant: 'error',
    title: 'Error',
    description: error.message
  });
}
```

## 🎨 Styling System

### CSS Classes
- **Utility-first approach** with Tailwind CSS
- **Consistent spacing** using design tokens
- **Responsive breakpoints** for all screen sizes
- **Dark mode support** (planned)

### Component Variants
```tsx
// Button variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Cancel</Button>
<Button variant="ghost">Ghost</Button>

// Alert variants
<Alert variant="success">Success message</Alert>
<Alert variant="error">Error message</Alert>
<Alert variant="warning">Warning message</Alert>
<Alert variant="info">Info message</Alert>
```

## 🧪 Testing Strategy

### Component Testing
```tsx
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';

test('renders button with correct text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});
```

### Integration Testing
```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from '@/components/ui/modal';

test('modal opens and closes correctly', () => {
  const onClose = jest.fn();
  render(
    <Modal isOpen={true} onClose={onClose}>
      <div>Modal content</div>
    </Modal>
  );
  
  fireEvent.click(screen.getByRole('button'));
  expect(onClose).toHaveBeenCalled();
});
```

## 📊 Performance Optimization

### Code Splitting
```tsx
import { lazy, Suspense } from 'react';

const TenantManagement = lazy(() => import('./TenantManagement'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <TenantManagement />
    </Suspense>
  );
}
```

### Memoization
```tsx
import { memo, useMemo } from 'react';

const ExpensiveComponent = memo(({ data }) => {
  const processedData = useMemo(() => {
    return data.map(item => processItem(item));
  }, [data]);
  
  return <div>{/* Render processed data */}</div>;
});
```

## 🔧 Development Guidelines

### 1. **Component Creation**
- Start with the smallest possible component
- Use TypeScript interfaces for props
- Include proper error boundaries
- Add loading and error states

### 2. **Styling**
- Use Tailwind utility classes
- Follow the responsive design system
- Maintain consistency with design tokens
- Test on multiple screen sizes

### 3. **Security**
- Always validate and sanitize inputs
- Use the security utilities provided
- Implement proper error handling
- Follow OWASP guidelines

### 4. **Accessibility**
- Use semantic HTML elements
- Include ARIA labels and descriptions
- Ensure keyboard navigation works
- Test with screen readers

## 🚀 Future Enhancements

### Planned Features
- [ ] Dark mode support
- [ ] Animation system
- [ ] Advanced form validation
- [ ] Internationalization (i18n)
- [ ] Advanced theming system
- [ ] Component documentation with Storybook
- [ ] Automated testing with Playwright
- [ ] Performance monitoring
- [ ] Accessibility testing

### Migration Path
- [ ] Gradual migration of existing components
- [ ] Backward compatibility maintenance
- [ ] Documentation updates
- [ ] Team training and guidelines

## 📚 Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [OWASP Security Guidelines](https://owasp.org/www-project-top-ten/)
- [WCAG Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

This architecture provides a solid foundation for building scalable, secure, and maintainable React applications with a focus on reusability and developer experience.

