# BlickTrack Theme System

This directory contains the centralized theme system for BlickTrack, ensuring consistent branding across all components.

## Files

- `theme.ts` - Main theme configuration and utility functions

## Usage

### Import the theme

```typescript
import { BLICKTRACK_THEME, getGradientStyle, getButtonStyle, getCardStyle } from '@/lib/theme';
```

### Using Colors

```typescript
// Direct color access
const primaryBlue = BLICKTRACK_THEME.colors.primary.blue; // #073c82
const primaryTeal = BLICKTRACK_THEME.colors.primary.teal; // #00d6bc

// Gradient backgrounds
const gradient = BLICKTRACK_THEME.colors.gradients.primary; // linear-gradient(90deg, #073c82 0%, #00d6bc 100%)
```

### Using Utility Functions

#### Gradient Text Style

```typescript
const gradientTextStyle = getGradientStyle('primary');

// Use in JSX
<h1 style={gradientTextStyle}>BlickTrack</h1>
```

#### Button Styles

```typescript
const primaryButtonStyle = getButtonStyle('primary');
const secondaryButtonStyle = getButtonStyle('secondary');
const ghostButtonStyle = getButtonStyle('ghost');

// Use in JSX
<button style={primaryButtonStyle}>Get Started</button>
```

#### Card Styles

```typescript
const cardStyle = getCardStyle();

// Use in JSX
<div style={cardStyle}>Card content</div>
```

### Typography

```typescript
const textStyle = {
  fontFamily: BLICKTRACK_THEME.typography.fontFamily.primary,
  fontSize: BLICKTRACK_THEME.typography.fontSize.lg,
  fontWeight: BLICKTRACK_THEME.typography.fontWeight.semibold,
  color: BLICKTRACK_THEME.colors.text.primary,
};
```

### Spacing and Border Radius

```typescript
const containerStyle = {
  padding: BLICKTRACK_THEME.spacing.lg,
  margin: BLICKTRACK_THEME.spacing.xl,
  borderRadius: BLICKTRACK_THEME.borderRadius.xl,
};
```

## Available Gradients

- `primary` - Main BlickTrack gradient (blue to teal)
- `primaryReverse` - Reversed gradient (teal to blue)
- `primaryVertical` - Vertical gradient
- `primaryDiagonal` - Diagonal gradient

## Available Button Variants

- `primary` - Gradient background with white text
- `secondary` - Transparent background with blue border
- `ghost` - Transparent background with subtle border

## Email Templates

The theme system is also used in backend email templates to ensure consistent branding in all communications.

## Benefits

1. **Consistency** - All components use the same colors and styles
2. **Maintainability** - Change colors in one place, update everywhere
3. **Type Safety** - TypeScript ensures correct usage
4. **Reusability** - Easy to create new components with consistent styling
5. **Brand Compliance** - Ensures all UI elements follow BlickTrack branding guidelines
