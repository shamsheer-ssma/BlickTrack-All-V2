/**
 * BlickTrack Theme Configuration
 * Centralized theme system for consistent branding across all components
 */

export const BLICKTRACK_THEME = {
  // Primary Brand Colors
  colors: {
    primary: {
      blue: '#073c82',      // blick-blue
      teal: '#00d6bc',      // blick-teal
    },
    gradients: {
      primary: 'linear-gradient(90deg, #073c82 0%, #00d6bc 100%)',
      primaryReverse: 'linear-gradient(90deg, #00d6bc 0%, #073c82 100%)',
      primaryVertical: 'linear-gradient(180deg, #073c82 0%, #00d6bc 100%)',
      primaryDiagonal: 'linear-gradient(135deg, #073c82 0%, #00d6bc 100%)',
    },
    text: {
      primary: '#073c82',
      secondary: '#00d6bc',
      muted: '#6b7280',
      light: '#9ca3af',
    },
    background: {
      primary: '#ffffff',
      secondary: '#f8fafc',
      muted: '#f1f5f9',
    },
    borders: {
      primary: '#e5e7eb',
      secondary: '#d1d5db',
    },
    shadows: {
      primary: '0 4px 6px -1px rgba(7, 60, 130, 0.2), 0 2px 4px -1px rgba(0, 214, 188, 0.1)',
      secondary: '0 2px 4px -1px rgba(7, 60, 130, 0.1)',
      large: '0 20px 25px -5px rgba(7, 60, 130, 0.1), 0 10px 10px -5px rgba(0, 214, 188, 0.04)',
    },
  },
  
  // Typography
  typography: {
    fontFamily: {
      primary: 'Geometrica Sans, ui-sans-serif, system-ui, sans-serif',
      mono: 'JetBrains Mono, Fira Code, Monaco, Cascadia Code, Segoe UI Mono, Roboto Mono, monospace',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },
  },
  
  // Spacing
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },
  
  // Border Radius
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    full: '9999px',
  },
  
  // Email Template Styles
  email: {
    header: {
      background: 'linear-gradient(135deg, #073c82 0%, #00d6bc 100%)',
      color: '#ffffff',
      padding: '40px 30px',
      textAlign: 'center',
    },
    container: {
      maxWidth: '600px',
      margin: '40px auto',
      background: '#ffffff',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    content: {
      padding: '40px 30px',
    },
    footer: {
      background: '#f8fafc',
      padding: '20px 30px',
      textAlign: 'center',
      fontSize: '14px',
      color: '#6b7280',
    },
  },
} as const;

/**
 * Get gradient style object for React components
 */
export const getGradientStyle = (gradient: keyof typeof BLICKTRACK_THEME.colors.gradients) => ({
  background: BLICKTRACK_THEME.colors.gradients[gradient],
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  color: BLICKTRACK_THEME.colors.primary.blue,
});

/**
 * Get button style object for React components
 */
export const getButtonStyle = (variant: 'primary' | 'secondary' | 'ghost' = 'primary') => {
  const baseStyle = {
    fontFamily: BLICKTRACK_THEME.typography.fontFamily.primary,
    fontWeight: BLICKTRACK_THEME.typography.fontWeight.medium,
    borderRadius: BLICKTRACK_THEME.borderRadius.lg,
    transition: 'all 0.3s ease',
  };

  switch (variant) {
    case 'primary':
      return {
        ...baseStyle,
        background: BLICKTRACK_THEME.colors.gradients.primary,
        color: '#ffffff',
        boxShadow: BLICKTRACK_THEME.colors.shadows.primary,
      };
    case 'secondary':
      return {
        ...baseStyle,
        background: 'transparent',
        color: BLICKTRACK_THEME.colors.primary.blue,
        border: `2px solid ${BLICKTRACK_THEME.colors.primary.blue}`,
      };
    case 'ghost':
      return {
        ...baseStyle,
        background: 'transparent',
        color: BLICKTRACK_THEME.colors.primary.blue,
        border: `1px solid ${BLICKTRACK_THEME.colors.borders.primary}`,
      };
    default:
      return baseStyle;
  }
};

/**
 * Get card style object for React components
 */
export const getCardStyle = () => ({
  background: BLICKTRACK_THEME.colors.background.primary,
  border: `1px solid ${BLICKTRACK_THEME.colors.borders.primary}`,
  borderRadius: BLICKTRACK_THEME.borderRadius.xl,
  boxShadow: BLICKTRACK_THEME.colors.shadows.secondary,
  transition: 'all 0.3s ease',
});

/**
 * Generate CSS variables for global styles
 */
export const generateCSSVariables = () => {
  const variables: Record<string, string> = {};
  
  // Color variables
  Object.entries(BLICKTRACK_THEME.colors.primary).forEach(([key, value]) => {
    variables[`--blick-${key}`] = value;
  });
  
  // Typography variables
  Object.entries(BLICKTRACK_THEME.typography.fontFamily).forEach(([key, value]) => {
    variables[`--font-${key}`] = value;
  });
  
  return variables;
};

export default BLICKTRACK_THEME;
