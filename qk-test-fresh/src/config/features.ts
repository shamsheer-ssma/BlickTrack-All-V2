/**
 * Feature Configuration - Static Layer
 * 
 * This file provides the STATIC configuration layer in our hybrid system.
 * It handles platform-wide defaults and environment-based configuration.
 * 
 * ARCHITECTURE OVERVIEW:
 * ┌─────────────────────────────────────────────────────────────┐
 * │                    HYBRID CONFIGURATION                    │
 * ├─────────────────────────────────────────────────────────────┤
 * │ 1. Database (TenantConfiguration) ← HIGHEST PRIORITY       │
 * │    ├─ Per-tenant customization                             │
 * │    ├─ Runtime updates (no redeployment needed)            │
 * │    └─ API: /api/tenants/{id}/features                     │
 * ├─────────────────────────────────────────────────────────────┤
 * │ 2. Environment Variables (.env.local) ← FALLBACK          │
 * │    ├─ Platform-wide defaults                              │
 * │    ├─ Build-time configuration                            │
 * │    └─ NEXT_PUBLIC_SHOW_LANDING_PAGE=true                 │
 * ├─────────────────────────────────────────────────────────────┤
 * │ 3. Default Values (this file) ← LAST RESORT              │
 * │    ├─ Hardcoded fallbacks                                 │
 * │    ├─ When env vars not set                               │
 * │    └─ When database unavailable                           │
 * └─────────────────────────────────────────────────────────────┘
 * 
 * DECISION FLOW:
 * 1. useTenantFeatures() tries to fetch from database
 * 2. If no tenant or API fails → falls back to this file
 * 3. This file reads environment variables
 * 4. If env vars not set → uses hardcoded defaults
 * 
 * USAGE:
 * - Used as fallback when database is unavailable
 * - Provides platform-wide defaults for all deployments
 * - Environment variables are read at build time
 * - Cannot be changed at runtime (requires rebuild)
 */

/**
 * Landing Page Configuration
 * 
 * Controls whether to show the marketing landing page or redirect to login.
 * 
 * - true: Show landing page at / (default for new customers)
 * - false: Redirect / to /login (for existing customers who want direct access)
 * 
 * Configure via: NEXT_PUBLIC_SHOW_LANDING_PAGE in .env.local
 */
export const SHOW_LANDING_PAGE = 
  process.env.NEXT_PUBLIC_SHOW_LANDING_PAGE !== 'false';

/**
 * App Configuration
 * 
 * These can be customized per customer deployment
 */
export const APP_CONFIG = {
  // App Display Name
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'BlickTrack',
  
  // Company Name
  companyName: process.env.NEXT_PUBLIC_COMPANY_NAME || 'Enterprise Solutions',
  
  // Support Email
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@blicktrack.com',
  
  // API Configuration (Future)
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  apiTimeout: Number(process.env.NEXT_PUBLIC_API_TIMEOUT) || 30000,
} as const;

/**
 * Feature Flags (Future Enhancement)
 * 
 * Enable/disable features per customer
 */
export const FEATURE_FLAGS = {
  // User registration (some customers may disable this)
  enableRegistration: process.env.NEXT_PUBLIC_ENABLE_REGISTRATION === 'true',
  
  // Single Sign-On
  enableSSO: process.env.NEXT_PUBLIC_ENABLE_SSO === 'true',
  
  // Two-Factor Authentication
  enable2FA: process.env.NEXT_PUBLIC_ENABLE_2FA === 'true',
  
  // Dark mode toggle
  enableDarkMode: process.env.NEXT_PUBLIC_ENABLE_DARK_MODE !== 'false', // Default: true
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

/**
 * Check if landing page should be shown
 */
export function shouldShowLandingPage(): boolean {
  return SHOW_LANDING_PAGE;
}

/**
 * Get the default route based on configuration
 */
export function getDefaultRoute(): string {
  return shouldShowLandingPage() ? '/' : '/login';
}

/**
 * Check if a feature is enabled
 */
export function isFeatureEnabled(feature: keyof typeof FEATURE_FLAGS): boolean {
  return FEATURE_FLAGS[feature];
}

/**
 * Extract tenant slug from hostname
 * 
 * Supports multiple patterns:
 * - tenant.blicktrack.com -> "tenant"
 * - tenant-name.blicktrack.com -> "tenant-name"
 * - localhost or direct IP -> null (uses default tenant)
 * 
 * @param hostname - The hostname to parse (defaults to window.location.hostname in browser)
 * @returns Tenant slug or null
 * 
 * @example
 * getTenantFromHostname('acme.blicktrack.com') // "acme"
 * getTenantFromHostname('localhost') // null
 */
export function getTenantFromHostname(hostname?: string): string | null {
  const host = hostname || (typeof window !== 'undefined' ? window.location.hostname : '');
  
  // Localhost or IP address - no tenant
  if (host === 'localhost' || host.match(/^\d+\.\d+\.\d+\.\d+$/)) {
    return null;
  }
  
  // Extract subdomain
  // Example: acme.blicktrack.com -> acme
  const parts = host.split('.');
  if (parts.length >= 3) {
    return parts[0]; // First part is the tenant slug
  }
  
  return null;
}

/**
 * Get tenant ID from URL parameter or subdomain
 * Used for multi-tenant routing
 * 
 * @returns Tenant identifier (slug or ID)
 */
export function getTenantIdentifier(): string | null {
  if (typeof window === 'undefined') return null;
  
  // Check URL parameter first (e.g., ?tenant=acme-corp)
  const urlParams = new URLSearchParams(window.location.search);
  const tenantParam = urlParams.get('tenant');
  if (tenantParam) return tenantParam;
  
  // Check subdomain
  return getTenantFromHostname();
}

