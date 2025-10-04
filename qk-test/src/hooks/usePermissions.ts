/**
 * File: usePermissions.ts
 * Purpose: Custom hook for managing user permissions and feature access control in the multi-tenant SaaS platform.
 * 
 * This hook provides:
 * - Feature access checking based on user role and tenant features
 * - Permission management for granular user control
 * - Caching of permissions to improve performance
 * - Real-time permission updates
 * 
 * Key Functions:
 * - canAccessFeature: Check if user can access a specific feature
 * - canEditFeature: Check if user can edit a specific feature
 * - canDeleteFeature: Check if user can delete a specific feature
 * - refreshPermissions: Refresh permissions from backend
 * 
 * Dependencies:
 * - React hooks (useState, useEffect, useCallback)
 * - API service for fetching permissions
 * - User context for current user data
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiService } from '@/lib/api';

export interface Feature {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
}

export interface TenantFeature {
  id: string;
  tenantId: string;
  featureId: string;
  isEnabled: boolean;
  purchasedAt: string;
  expiresAt?: string;
  feature: Feature;
}

export interface UserPermission {
  id: string;
  userId: string;
  featureId: string;
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  feature: Feature;
}

export interface User {
  id: string;
  email: string;
  role: 'PLATFORM_ADMIN' | 'TENANT_ADMIN' | 'USER';
  tenantId: string;
  firstName: string;
  lastName: string;
}

export function usePermissions() {
  const [user, setUser] = useState<User | null>(null);
  const [tenantFeatures, setTenantFeatures] = useState<TenantFeature[]>([]);
  const [userPermissions, setUserPermissions] = useState<Record<string, UserPermission>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load user data from localStorage or API
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get user data from localStorage (set during login)
        const userData = localStorage.getItem('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);

          // Load tenant features and user permissions
          await Promise.all([
            loadTenantFeatures(parsedUser.tenantId),
            loadUserPermissions(parsedUser.id)
          ]);
        } else {
          // If no user data, try to get from API
          const userProfile = await apiService.getProfile();
          setUser(userProfile);
          await Promise.all([
            loadTenantFeatures(userProfile.tenantId),
            loadUserPermissions(userProfile.id)
          ]);
        }
      } catch (err: any) {
        console.error('Error loading user data:', err);
        setError(err.message || 'Failed to load user data');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  const loadTenantFeatures = useCallback(async (tenantId: string) => {
    try {
      const features = await apiService.getTenantFeatures();
      setTenantFeatures(features);
    } catch (err: any) {
      console.error('Error loading tenant features:', err);
      setError(err.message || 'Failed to load tenant features');
    }
  }, []);

  const loadUserPermissions = useCallback(async (userId: string) => {
    try {
      const permissions = await apiService.getUserPermissions();
      
      // Convert array to object for easier lookup
      const permissionsMap: Record<string, UserPermission> = {};
      permissions.forEach((permission: any) => {
        permissionsMap[permission.feature.slug] = permission;
      });
      
      setUserPermissions(permissionsMap);
    } catch (err: any) {
      console.error('Error loading user permissions:', err);
      setError(err.message || 'Failed to load user permissions');
    }
  }, []);

  const canAccessFeature = useCallback((featureSlug: string): boolean => {
    if (!user || !tenantFeatures.length) return false;
    
    // Platform admin can access everything
    if (user.role === 'PLATFORM_ADMIN') return true;
    
    // Check if tenant has this feature
    const tenantHasFeature = tenantFeatures.some(
      tf => tf.feature.slug === featureSlug && tf.isEnabled
    );
    
    if (!tenantHasFeature) return false;
    
    // Tenant admin can access all tenant features
    if (user.role === 'TENANT_ADMIN') return true;
    
    // For regular users, check individual permissions
    if (user.role === 'USER') {
      const permission = userPermissions[featureSlug];
      return permission?.canView || false;
    }
    
    return false;
  }, [user, tenantFeatures, userPermissions]);

  const canEditFeature = useCallback((featureSlug: string): boolean => {
    if (!user || !tenantFeatures.length) return false;
    
    // Platform admin can edit everything
    if (user.role === 'PLATFORM_ADMIN') return true;
    
    // Check if tenant has this feature
    const tenantHasFeature = tenantFeatures.some(
      tf => tf.feature.slug === featureSlug && tf.isEnabled
    );
    
    if (!tenantHasFeature) return false;
    
    // Tenant admin can edit all tenant features
    if (user.role === 'TENANT_ADMIN') return true;
    
    // For regular users, check individual permissions
    if (user.role === 'USER') {
      const permission = userPermissions[featureSlug];
      return permission?.canEdit || false;
    }
    
    return false;
  }, [user, tenantFeatures, userPermissions]);

  const canDeleteFeature = useCallback((featureSlug: string): boolean => {
    if (!user || !tenantFeatures.length) return false;
    
    // Platform admin can delete everything
    if (user.role === 'PLATFORM_ADMIN') return true;
    
    // Check if tenant has this feature
    const tenantHasFeature = tenantFeatures.some(
      tf => tf.feature.slug === featureSlug && tf.isEnabled
    );
    
    if (!tenantHasFeature) return false;
    
    // Tenant admin can delete all tenant features
    if (user.role === 'TENANT_ADMIN') return true;
    
    // For regular users, check individual permissions
    if (user.role === 'USER') {
      const permission = userPermissions[featureSlug];
      return permission?.canDelete || false;
    }
    
    return false;
  }, [user, tenantFeatures, userPermissions]);

  const getAvailableFeatures = useCallback((): Feature[] => {
    if (!user || !tenantFeatures.length) return [];
    
    if (user.role === 'PLATFORM_ADMIN') {
      // Platform admin can see all features
      return tenantFeatures.map(tf => tf.feature);
    }
    
    if (user.role === 'TENANT_ADMIN') {
      // Tenant admin can see all tenant features
      return tenantFeatures.map(tf => tf.feature);
    }
    
    // For regular users, filter by permissions
    return tenantFeatures
      .filter(tf => userPermissions[tf.feature.slug]?.canView)
      .map(tf => tf.feature);
  }, [user, tenantFeatures, userPermissions]);

  const refreshPermissions = useCallback(async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      await Promise.all([
        loadTenantFeatures(user.tenantId),
        loadUserPermissions(user.id)
      ]);
    } catch (err: any) {
      console.error('Error refreshing permissions:', err);
      setError(err.message || 'Failed to refresh permissions');
    } finally {
      setIsLoading(false);
    }
  }, [user, loadTenantFeatures, loadUserPermissions]);

  const hasRole = useCallback((role: string): boolean => {
    return user?.role === role;
  }, [user]);

  const isPlatformAdmin = useCallback((): boolean => {
    return hasRole('PLATFORM_ADMIN');
  }, [hasRole]);

  const isTenantAdmin = useCallback((): boolean => {
    return hasRole('TENANT_ADMIN');
  }, [hasRole]);

  const isUser = useCallback((): boolean => {
    return hasRole('USER');
  }, [hasRole]);

  return {
    // Data
    user,
    tenantFeatures,
    userPermissions,
    availableFeatures: getAvailableFeatures(),
    
    // Loading states
    isLoading,
    error,
    
    // Permission checks
    canAccessFeature,
    canEditFeature,
    canDeleteFeature,
    
    // Role checks
    hasRole,
    isPlatformAdmin,
    isTenantAdmin,
    isUser,
    
    // Actions
    refreshPermissions,
  };
}
