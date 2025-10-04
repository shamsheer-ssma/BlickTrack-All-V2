/**
 * useTenantFeatures Hook - Dynamic Layer
 * 
 * This hook provides the DYNAMIC configuration layer in our hybrid system.
 * It fetches tenant-specific configuration from the database and falls back
 * to static configuration when needed.
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
 * │ 3. Default Values (features.ts) ← LAST RESORT             │
 * │    ├─ Hardcoded fallbacks                                 │
 * │    ├─ When env vars not set                               │
 * │    └─ When database unavailable                           │
 * └─────────────────────────────────────────────────────────────┘
 * 
 * HOOK BEHAVIOR:
 * 1. If tenantId provided → fetch from database API
 * 2. If API succeeds → return database configuration
 * 3. If API fails or no tenantId → fallback to features.ts
 * 4. features.ts reads environment variables
 * 5. If env vars not set → uses hardcoded defaults
 * 
 * USAGE EXAMPLES:
 * ```tsx
 * // With tenant ID (tries database first)
 * const { features, loading, error } = useTenantFeatures('acme-corp-uuid');
 * 
 * // Without tenant ID (uses environment fallback)
 * const { features, loading, error } = useTenantFeatures();
 * 
 * // In components
 * if (loading) return <Loading />;
 * if (error) return <Error />;
 * 
 * return (
 *   <div>
 *     {features.enableRegistration && <SignUpButton />}
 *     {features.ssoEnabled && <SSOButton />}
 *     {features.enableLandingPage ? <LandingPage /> : <FastLoginPage />}
 *   </div>
 * );
 * ```
 * 
 * CONFIGURATION PRIORITY:
 * Database > Environment Variables > Default Values
 * 
 * REAL-WORLD EXAMPLES:
 * - Acme Corp: Database says enableLandingPage=true → Shows landing page
 * - Boeing: Database says enableLandingPage=false → Shows login page  
 * - New visitor: No tenant → Uses .env.local (NEXT_PUBLIC_SHOW_LANDING_PAGE=true)
 * - API down: Falls back to features.ts environment variables
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { APP_CONFIG, FEATURE_FLAGS, shouldShowLandingPage } from '@/config/features';

/**
 * Tenant Feature Flags Interface
 * Matches the backend TenantFeaturesDto
 */
export interface TenantFeatures {
  // Feature Flags
  enableRegistration: boolean;
  enable2FA: boolean;
  enableLandingPage: boolean;
  enableDarkMode: boolean;
  
  // SSO Configuration
  ssoEnabled: boolean;
  ssoProvider?: string | null;
  ssoClientId?: string | null;
  
  // UI Configuration
  theme: string;
  primaryColor: string;
  logoUrl?: string | null;
}

/**
 * Hook Return Type
 */
interface UseTenantFeaturesReturn {
  features: TenantFeatures | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch tenant-specific feature flags
 * 
 * @param tenantId - Optional tenant UUID or slug
 * @param useSlug - If true, treat tenantId as a slug instead of UUID
 * @returns Tenant features, loading state, error, and refetch function
 * 
 * @example
 * // Fetch by tenant ID
 * const { features } = useTenantFeatures('123e4567-e89b-12d3-a456-426614174000');
 * 
 * @example
 * // Fetch by tenant slug
 * const { features } = useTenantFeatures('acme-corp', true);
 * 
 * @example
 * // Use environment variables only (no tenant)
 * const { features } = useTenantFeatures();
 */
export function useTenantFeatures(
  tenantId?: string,
  useSlug: boolean = false
): UseTenantFeaturesReturn {
  const [features, setFeatures] = useState<TenantFeatures | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetch features from environment variables (fallback)
   */
  const getEnvironmentFeatures = useCallback((): TenantFeatures => {
    return {
      enableRegistration: FEATURE_FLAGS.enableRegistration,
      enable2FA: FEATURE_FLAGS.enable2FA,
      enableLandingPage: shouldShowLandingPage(), // Use the proper function
      enableDarkMode: FEATURE_FLAGS.enableDarkMode,
      ssoEnabled: FEATURE_FLAGS.enableSSO,
      ssoProvider: null,
      ssoClientId: null,
      theme: 'corporate',
      primaryColor: '#2563eb',
      logoUrl: null,
    };
  }, []);

  /**
   * Fetch features from API
   */
  const fetchFeatures = useCallback(async () => {
    // If no tenant ID, use environment variables
    if (!tenantId) {
      setFeatures(getEnvironmentFeatures());
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Build API URL based on whether we're using slug or ID
      const endpoint = useSlug
        ? `/api/v1/tenants/slug/${tenantId}/features`
        : `/api/v1/tenants/${tenantId}/features`;

      const response = await axios.get<TenantFeatures>(
        `${APP_CONFIG.apiUrl}${endpoint}`,
        {
          timeout: APP_CONFIG.apiTimeout,
        }
      );

      setFeatures(response.data);
    } catch (err) {
      console.error('Failed to fetch tenant features:', err);
      setError(err as Error);
      
      // Fallback to environment variables on error
      setFeatures(getEnvironmentFeatures());
    } finally {
      setLoading(false);
    }
  }, [tenantId, useSlug, getEnvironmentFeatures]);

  // Fetch on mount or when tenantId changes
  useEffect(() => {
    fetchFeatures();
  }, [tenantId, useSlug, fetchFeatures]);

  return {
    features,
    loading,
    error,
    refetch: fetchFeatures,
  };
}

/**
 * Hook to get features by tenant slug
 * Convenience wrapper around useTenantFeatures
 * 
 * @param slug - Tenant slug (e.g., "acme-corp")
 * @returns Tenant features, loading state, error, and refetch function
 * 
 * @example
 * const { features } = useTenantFeaturesBySlug('acme-corp');
 */
export function useTenantFeaturesBySlug(slug?: string): UseTenantFeaturesReturn {
  return useTenantFeatures(slug, true);
}

