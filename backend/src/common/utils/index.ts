/**
 * File: index.ts
 * Purpose: Common utility functions for the BlickTrack backend application. Provides password hashing, token generation, validation, date manipulation, and string processing utilities. Centralizes reusable business logic and security functions.
 *
 * Key Functions / Components / Classes:
 *   - PasswordUtils: Password hashing, validation, and strength checking
 *   - TokenUtils: Secure token generation and OTP creation
 *   - ValidationUtils: Input validation and sanitization
 *   - DateUtils: Date manipulation and formatting
 *   - StringUtils: String processing and manipulation
 *
 * Inputs:
 *   - Passwords for hashing and validation
 *   - User input for validation and sanitization
 *   - Dates for manipulation and formatting
 *   - Strings for processing and slug generation
 *
 * Outputs:
 *   - Hashed passwords and secure tokens
 *   - Validated and sanitized input data
 *   - Formatted dates and processed strings
 *   - Security utilities for authentication
 *
 * Dependencies:
 *   - bcryptjs for password hashing
 *   - crypto for secure token generation
 *   - AUTH_CONSTANTS for configuration
 *
 * Notes:
 *   - Implements comprehensive security utilities
 *   - Includes password strength validation
 *   - Provides secure token generation
 *   - Handles input sanitization and validation
 */

import * as bcrypt from 'bcryptjs';
import { randomBytes, createHash } from 'crypto';
import { AUTH_CONSTANTS } from '../constants';

/**
 * Password utility functions
 */
export class PasswordUtils {
  /**
   * Hash password using bcrypt
   */
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, AUTH_CONSTANTS.BCRYPT_ROUNDS);
  }

  /**
   * Compare password with hash
   */
  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Validate password strength
   */
  static validatePasswordStrength(password: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (password.length < AUTH_CONSTANTS.PASSWORD_MIN_LENGTH) {
      errors.push(`Password must be at least ${AUTH_CONSTANTS.PASSWORD_MIN_LENGTH} characters long`);
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    // Check for common weak patterns
    if (this.isCommonPassword(password)) {
      errors.push('Password is too common. Please choose a stronger password.');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Check if password is in common passwords list
   */
  private static isCommonPassword(password: string): boolean {
    const commonPasswords = [
      'password', 'password123', '123456', '123456789', 'qwerty',
      'abc123', 'password1', 'admin', 'letmein', 'welcome',
      'monkey', '1234567890', 'dragon', 'password12',
    ];

    return commonPasswords.includes(password.toLowerCase());
  }

  /**
   * Generate secure random password
   */
  static generateSecurePassword(length: number = 16): string {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    return password;
  }
}

/**
 * Token utility functions
 */
export class TokenUtils {
  /**
   * Generate secure random token
   */
  static generateSecureToken(length: number = 32): string {
    const tokenBytes = randomBytes(length);
    return createHash('sha256').update(tokenBytes).digest('hex');
  }

  /**
   * Generate URL-safe token
   */
  static generateUrlSafeToken(length: number = 32): string {
    const tokenBytes = randomBytes(length);
    return tokenBytes.toString('base64url');
  }

  /**
   * Generate numeric OTP
   */
  static generateNumericOTP(length: number = 6): string {
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    return Math.floor(Math.random() * (max - min + 1) + min).toString();
  }
}

/**
 * Validation utility functions
 */
export class ValidationUtils {
  /**
   * Validate email format
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate phone number format
   */
  static isValidPhoneNumber(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  }

  /**
   * Sanitize input string
   */
  static sanitizeString(input: string): string {
    return input.trim().replace(/[<>]/g, '');
  }

  /**
   * Validate UUID format
   */
  static isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }
}

/**
 * Date utility functions
 */
export class DateUtils {
  /**
   * Get timestamp X minutes from now
   */
  static getMinutesFromNow(minutes: number): Date {
    return new Date(Date.now() + minutes * 60 * 1000);
  }

  /**
   * Get timestamp X hours from now
   */
  static getHoursFromNow(hours: number): Date {
    return new Date(Date.now() + hours * 60 * 60 * 1000);
  }

  /**
   * Get timestamp X days from now
   */
  static getDaysFromNow(days: number): Date {
    return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  }

  /**
   * Check if date is expired
   */
  static isExpired(date: Date): boolean {
    return date < new Date();
  }

  /**
   * Format date for display
   */
  static formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  /**
   * Format datetime for display
   */
  static formatDateTime(date: Date): string {
    return date.toISOString().replace('T', ' ').split('.')[0];
  }
}

/**
 * String utility functions
 */
export class StringUtils {
  /**
   * Generate slug from string
   */
  static generateSlug(input: string): string {
    return input
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  /**
   * Capitalize first letter
   */
  static capitalize(input: string): string {
    return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
  }

  /**
   * Generate random string
   */
  static generateRandomString(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    return result;
  }

  /**
   * Mask sensitive data
   */
  static maskEmail(email: string): string {
    const [username, domain] = email.split('@');
    const maskedUsername = username.charAt(0) + '*'.repeat(username.length - 2) + username.charAt(username.length - 1);
    return `${maskedUsername}@${domain}`;
  }

  /**
   * Truncate string with ellipsis
   */
  static truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  }
}