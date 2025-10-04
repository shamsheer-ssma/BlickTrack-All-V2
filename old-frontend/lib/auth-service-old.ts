import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-here-change-in-production';
const JWT_ACCESS_TOKEN_EXPIRY = process.env.JWT_ACCESS_TOKEN_EXPIRY || '7d'; // Extended to 7 days
const JWT_REFRESH_TOKEN_EXPIRY = process.env.JWT_REFRESH_TOKEN_EXPIRY || '30d'; // Extended to 30 days
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

export interface JWTPayload {
  sub: string; // User ID (matches backend)
  email: string;
  role: string;
  tenant: string;
  tenantId?: string; // Optional tenant ID
  type?: string; // Token type
  iat?: number;
  exp?: number;
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
export function generateToken(user: AuthUser): string {
  const payload: JWTPayload = {
    sub: user.id, // Use 'sub' to match backend
    email: user.email,
    role: user.role,
    tenant: user.tenant
  };

  return jwt.sign(
    payload, 
    JWT_SECRET, 
    {
      expiresIn: JWT_ACCESS_TOKEN_EXPIRY,
      issuer: 'blicktrack',
      audience: 'blicktrack-users'
    } as jwt.SignOptions
  );
}

/**
 * Verify and decode JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'blicktrack',
      audience: 'blicktrack-users'
    }) as JWTPayload;
    
    return decoded;
  } catch (error) {
    console.error('JWT verification failed:', error);
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
 * Generate refresh token (for token rotation)
 */
export function generateRefreshToken(userId: string): string {
  return jwt.sign(
    { sub: userId, type: 'refresh' }, // Use 'sub' to match backend
    JWT_SECRET,
    { expiresIn: JWT_REFRESH_TOKEN_EXPIRY } as jwt.SignOptions
  );
}

/**
 * Verify refresh token
 */
export function verifyRefreshToken(token: string): { userId: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { sub: string; type: string };
    
    if (decoded.type !== 'refresh') {
      return null;
    }
    
    return { userId: decoded.sub }; // Convert 'sub' to 'userId' for compatibility
  } catch (error) {
    console.error('Refresh token verification failed:', error);
    return null;
  }
}

/**
 * Generate secure random string for password reset tokens
 */
export function generatePasswordResetToken(): string {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const crypto = require('crypto');
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Generate secure random string for OTP
 */
export function generateOTP(): string {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const crypto = require('crypto');
  return crypto.randomInt(100000, 999999).toString();
}
