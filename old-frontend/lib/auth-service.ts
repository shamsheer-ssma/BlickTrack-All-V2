/**
 * Unified Authentication Service
 * 
 * Complete rewrite of JWT authentication logic
 * - Uses unified JWT configuration
 * - Consistent token generation and validation
 * - Proper error handling
 */

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { JWT_CONFIG, JWTPayload, UserForToken } from './jwt-config';

const BCRYPT_ROUNDS = 12;

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  tenant: string;
  organization: string;
  userType: string;
  isLicensed: boolean;
  emailVerified: boolean;
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate JWT token for user
 */
export function generateToken(user: UserForToken): string {
  const payload: JWTPayload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    tenant: user.tenant,
    tenantId: user.tenantId,
    type: 'access',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60), // 7 days
  };

  return jwt.sign(payload, JWT_CONFIG.SECRET, {
    expiresIn: JWT_CONFIG.EXPIRES_IN,
    issuer: JWT_CONFIG.ISSUER,
    audience: JWT_CONFIG.AUDIENCE,
  });
}

/**
 * Verify and decode JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_CONFIG.SECRET, {
      issuer: JWT_CONFIG.ISSUER,
      audience: JWT_CONFIG.AUDIENCE,
    }) as JWTPayload;
    
    // Additional validation
    if (!decoded.sub || !decoded.email || !decoded.role || !decoded.tenant) {
      console.error('❌ Token missing required fields');
      return null;
    }
    
    console.log('✅ Token verified successfully');
    return decoded;
  } catch (error) {
    console.error('❌ JWT verification failed:', error);
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

/**
 * Generate refresh token
 */
export function generateRefreshToken(userId: string): string {
  const payload = {
    sub: userId,
    type: 'refresh',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60), // 30 days
  };

  return jwt.sign(payload, JWT_CONFIG.SECRET, {
    expiresIn: '30d',
    issuer: JWT_CONFIG.ISSUER,
    audience: JWT_CONFIG.AUDIENCE,
  });
}

/**
 * Verify refresh token
 */
export function verifyRefreshToken(token: string): { userId: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_CONFIG.SECRET, {
      issuer: JWT_CONFIG.ISSUER,
      audience: JWT_CONFIG.AUDIENCE,
    }) as { sub: string; type: string };
    
    if (decoded.type !== 'refresh') {
      return null;
    }
    
    return { userId: decoded.sub };
  } catch (error) {
    console.error('Refresh token verification failed:', error);
    return null;
  }
}

/**
 * Generate secure random string for password reset tokens
 */
export function generatePasswordResetToken(): string {
  const crypto = require('crypto');
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Generate secure random string for OTP
 */
export function generateOTP(): string {
  const crypto = require('crypto');
  return crypto.randomInt(100000, 999999).toString();
}
