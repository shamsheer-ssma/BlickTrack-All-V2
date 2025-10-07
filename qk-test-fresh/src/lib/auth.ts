/**
 * Authentication utilities for token validation and management
 */

export interface TokenPayload {
  sub: string;
  email: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  role: string;
  tenantId: string;
  iat: number;
  exp: number;
}

/**
 * Check if a token is valid and not expired
 */
export function isTokenValid(token: string): boolean {
  if (!token) return false;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1])) as TokenPayload;
    const currentTime = Math.floor(Date.now() / 1000);
    
    // Check if token is expired
    if (payload.exp && payload.exp < currentTime) {
      return false;
    }
    
    // Check if token has required fields
    return !!(payload.sub && payload.email && payload.role);
  } catch (error) {
    console.warn('Invalid token format:', error);
    return false;
  }
}

/**
 * Get token payload if valid
 */
export function getTokenPayload(token: string): TokenPayload | null {
  if (!isTokenValid(token)) return null;
  
  try {
    return JSON.parse(atob(token.split('.')[1])) as TokenPayload;
  } catch (error) {
    console.warn('Could not decode token:', error);
    return null;
  }
}

/**
 * Check if user is authenticated (has valid token)
 */
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  
  const token = localStorage.getItem('access_token');
  return isTokenValid(token || '');
}

/**
 * Get current user from token
 */
export function getCurrentUser(): {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  role: string;
  tenantId: string;
} | null {
  if (typeof window === 'undefined') return null;
  
  const token = localStorage.getItem('access_token');
  if (!isTokenValid(token || '')) return null;
  
  const payload = getTokenPayload(token!);
  if (!payload) return null;
  
  return {
    id: payload.sub,
    email: payload.email,
    firstName: payload.firstName || '',
    lastName: payload.lastName || '',
    displayName: payload.displayName || payload.email,
    role: payload.role,
    tenantId: payload.tenantId,
  };
}

/**
 * Clear all authentication data
 */
export function clearAuth(): void {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
  localStorage.removeItem('token'); // Legacy token storage
}
