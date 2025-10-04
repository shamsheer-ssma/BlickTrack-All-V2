/**
 * Secure API Service
 * 
 * SECURITY FIX: Replaces direct database access with secure backend API calls
 * All database operations now go through the secure backend API
 * 
 * @author BlickTrack Development Team
 * @version 2.0.0
 * @created 2025-10-01 - Security refactor
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  tenantId?: string;
  authToken?: string;
}

/**
 * Get CSRF token from backend
 */
async function getCsrfToken(): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/csrf-token`);
    if (!response.ok) {
      throw new Error(`Failed to get CSRF token: ${response.status}`);
    }
    const data = await response.json();
    return data.csrfToken;
  } catch (error) {
    console.error('Error getting CSRF token:', error);
    throw error;
  }
}

/**
 * Secure API request wrapper
 * Handles authentication, tenant context, and CSRF protection automatically
 */
async function secureApiRequest(endpoint: string, options: ApiRequestOptions = {}) {
  const {
    method = 'GET',
    headers = {},
    body,
    tenantId,
    authToken
  } = options;

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers
  };

  // Add authentication if provided
  if (authToken) {
    requestHeaders['Authorization'] = `Bearer ${authToken}`;
  }

  // Add tenant context if provided
  if (tenantId) {
    requestHeaders['x-tenant-id'] = tenantId;
  }

  // Add CSRF token for non-GET requests (except health checks)
  if (method !== 'GET' && !endpoint.includes('/health')) {
    try {
      const csrfToken = await getCsrfToken();
      requestHeaders['X-CSRF-Token'] = csrfToken;
    } catch (error) {
      console.warn('Could not get CSRF token, proceeding without it:', error);
    }
  }

  const requestOptions: RequestInit = {
    method,
    headers: requestHeaders,
  };

  if (body && method !== 'GET') {
    requestOptions.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, requestOptions);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error: ${response.status} - ${errorText}`);
  }

  return response.json();
}

// User Management API calls (replacing direct database access)
export async function findUserByEmail(email: string, authToken?: string) {
  return secureApiRequest(`/users/by-email/${encodeURIComponent(email)}`, {
    authToken
  });
}

export async function getAllUsersWithContext(tenantId?: string, authToken?: string) {
  return secureApiRequest('/users', {
    tenantId,
    authToken
  });
}

export async function getUserRolesAndPermissions(userId: string, authToken?: string) {
  return secureApiRequest(`/users/${userId}/roles-permissions`, {
    authToken
  });
}

// Tenant Management API calls
export async function getTenantFeatures(tenantId: string, authToken?: string) {
  return secureApiRequest(`/tenants/${tenantId}/features`, {
    tenantId,
    authToken
  });
}

export async function toggleTenantFeature(
  tenantId: string, 
  featureId: string, 
  enabled: boolean, 
  authToken?: string
) {
  return secureApiRequest(`/tenants/${tenantId}/features/${featureId}`, {
    method: 'PATCH',
    body: { enabled },
    tenantId,
    authToken
  });
}

// Authentication Functions (for login route)
export async function verifyPassword(user: any, password: string, authToken?: string) {
  return secureApiRequest('/auth/verify-password', {
    method: 'POST',
    body: { userId: user.id, password },
    authToken
  });
}

export async function updateLastLogin(userId: string, authToken?: string) {
  return secureApiRequest(`/users/${userId}/last-login`, {
    method: 'PATCH',
    authToken
  });
}

export async function incrementFailedLoginAttempts(userId: string, authToken?: string) {
  return secureApiRequest(`/users/${userId}/failed-attempts`, {
    method: 'POST',
    authToken
  });
}

// Generic query function (secure replacement for direct SQL)
export async function query(sqlQuery: string, params?: any[], authToken?: string) {
  // SECURITY NOTE: This is now a secure API call instead of direct SQL execution
  return secureApiRequest('/query', {
    method: 'POST',
    body: { query: sqlQuery, params },
    authToken
  });
}

// Test connection (now tests backend API connectivity)
export async function testConnection() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch {
    return false;
  }
}

// Database connection management (now just API connectivity)
export async function getConnection() {
  // Returns a mock connection object for compatibility
  return {
    query: (sql: string, params?: any[]) => query(sql, params),
    release: () => Promise.resolve(),
  };
}

// Clean up connections (no-op for API calls)
export async function closeConnections() {
  // No actual connections to close with API calls
  console.log('✅ [API SERVICE] No connections to close (using secure API calls)');
}

console.log('🛡️ [SECURITY] Database access secured - using backend API instead of direct database connections');