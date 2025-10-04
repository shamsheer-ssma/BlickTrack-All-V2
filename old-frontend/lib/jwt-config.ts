/**
 * Unified JWT Configuration
 * 
 * This file ensures consistent JWT configuration across the entire application
 * - Same secret for frontend and backend
 * - Same token structure
 * - Same validation logic
 */

// JWT Configuration - MUST match backend exactly
export const JWT_CONFIG = {
  SECRET: 'blicktrack-jwt-secret-2025-unified',
  EXPIRES_IN: '7d', // 7 days
  ISSUER: 'blicktrack',
  AUDIENCE: 'blicktrack-users',
};

// JWT Token Payload Interface
export interface JWTPayload {
  sub: string;        // User ID
  email: string;      // User email
  role: string;       // User role
  tenant: string;     // Tenant name
  tenantId: string;   // Tenant ID
  type: 'access';    // Token type
  iat: number;        // Issued at
  exp: number;        // Expires at
}

// User data interface for token generation
export interface UserForToken {
  id: string;
  email: string;
  role: string;
  tenant: string;
  tenantId: string;
}

