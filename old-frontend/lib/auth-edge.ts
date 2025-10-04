/**
 * Edge Runtime Compatible Authentication Service
 * 
 * Complete rewrite for Next.js Edge Runtime (middleware)
 * - Uses unified JWT configuration
 * - Proper token validation without Node.js dependencies
 * - Consistent with auth-service-new.ts
 */

import { JWT_CONFIG, JWTPayload } from './jwt-config';

/**
 * Simple JWT token verification for Edge Runtime
 * This validates token structure and expiration without signature verification
 * Signature verification is handled by the backend API
 */
export function verifyTokenEdge(token: string): JWTPayload | null {
  try {
    console.log('🔍 Verifying token in Edge Runtime...');
    
    // Split the token into parts
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.log('🔒 Invalid token format');
      return null;
    }

    // Decode the payload (base64url)
    const payload = parts[1];
    const decodedPayload = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    const parsedPayload = JSON.parse(decodedPayload) as JWTPayload;

    console.log('📋 Token payload:', {
      sub: parsedPayload.sub,
      email: parsedPayload.email,
      role: parsedPayload.role,
      tenant: parsedPayload.tenant,
      exp: parsedPayload.exp,
      iat: parsedPayload.iat
    });

    // Check if token is expired
    const now = Math.floor(Date.now() / 1000);
    if (parsedPayload.exp && parsedPayload.exp < now) {
      console.log('🔒 Token expired at:', new Date(parsedPayload.exp * 1000));
      console.log('🔒 Current time:', new Date(now * 1000));
      return null;
    }

    // Check required fields
    if (!parsedPayload.sub || !parsedPayload.email || !parsedPayload.role || !parsedPayload.tenant) {
      console.log('🔒 Token missing required fields');
      console.log('🔒 Missing fields:', {
        sub: !parsedPayload.sub,
        email: !parsedPayload.email,
        role: !parsedPayload.role,
        tenant: !parsedPayload.tenant
      });
      return null;
    }

    // Check token type
    if (parsedPayload.type !== 'access') {
      console.log('🔒 Invalid token type:', parsedPayload.type);
      return null;
    }

    console.log('✅ Token verified (Edge Runtime)');
    return parsedPayload;

  } catch (error) {
    console.error('🔒 JWT verification failed (Edge Runtime):', error);
    return null;
  }
}

/**
 * Extract token from Authorization header
 */
export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  return authHeader.substring(7); // Remove 'Bearer ' prefix
}
