// Input validation utilities for BlickTrack
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface PasswordComplexityResult {
  isValid: boolean;
  errors: string[];
  score: number; // 0-100
  strength: 'weak' | 'medium' | 'strong' | 'very-strong';
}

/**
 * Validate email format
 */
export function validateEmail(email: string): ValidationResult {
  const errors: string[] = [];
  
  if (!email) {
    errors.push('Email is required');
    return { isValid: false, errors };
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    errors.push('Please enter a valid email address');
  }

  // Check for common typos in domain
  const commonDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];
  const domain = email.split('@')[1]?.toLowerCase();
  if (domain) {
    const similarDomain = commonDomains.find(d => 
      d.includes(domain) || domain.includes(d) || 
      Math.abs(d.length - domain.length) <= 2
    );
    if (similarDomain && similarDomain !== domain) {
      errors.push(`Did you mean ${email.split('@')[0]}@${similarDomain}?`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Check if email already exists (async validation)
 */
export async function checkEmailExists(email: string): Promise<ValidationResult> {
  const errors: string[] = [];
  
  if (!email) {
    errors.push('Email is required');
    return { isValid: false, errors };
  }

  try {
    // This would be an API call to check email existence
    // For now, we'll simulate the check
    const response = await fetch('/api/auth/check-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (response.status === 409) {
      errors.push('An account with this email already exists. Please use a different email or try signing in.');
    }
  } catch (error) {
    // If API call fails, we'll let the server-side validation handle it
    console.log('Email existence check failed, will be validated server-side');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate name fields
 */
export function validateName(name: string, fieldName: string = 'Name'): ValidationResult {
  const errors: string[] = [];
  
  if (!name || name.trim().length === 0) {
    errors.push(`${fieldName} is required`);
    return { isValid: false, errors };
  }

  if (name.trim().length < 2) {
    errors.push(`${fieldName} must be at least 2 characters long`);
  }

  if (name.trim().length > 50) {
    errors.push(`${fieldName} must be less than 50 characters`);
  }

  // Check for valid characters (letters, spaces, hyphens, apostrophes)
  const nameRegex = /^[a-zA-Z\s\-']+$/;
  if (!nameRegex.test(name.trim())) {
    errors.push(`${fieldName} can only contain letters, spaces, hyphens, and apostrophes`);
  }

  // Check for consecutive special characters
  if (/['\s\-]{2,}/.test(name)) {
    errors.push(`${fieldName} cannot have consecutive special characters`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate company name
 */
export function validateCompany(company: string): ValidationResult {
  const errors: string[] = [];
  
  if (!company || company.trim().length === 0) {
    errors.push('Company name is required');
    return { isValid: false, errors };
  }

  if (company.trim().length < 2) {
    errors.push('Company name must be at least 2 characters long');
  }

  if (company.trim().length > 100) {
    errors.push('Company name must be less than 100 characters');
  }

  // Check for valid characters (letters, numbers, spaces, common business symbols)
  const companyRegex = /^[a-zA-Z0-9\s\-'.,&()]+$/;
  if (!companyRegex.test(company.trim())) {
    errors.push('Company name contains invalid characters');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Comprehensive password complexity validation
 */
export function validatePasswordComplexity(password: string): PasswordComplexityResult {
  const errors: string[] = [];
  let score = 0;

  if (!password) {
    errors.push('Password is required');
    return { isValid: false, errors, score: 0, strength: 'weak' };
  }

  // Length requirements
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  } else if (password.length >= 12) {
    score += 20;
  } else {
    score += 10;
  }

  // Character variety checks
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password);

  if (!hasLowercase) {
    errors.push('Password must contain at least one lowercase letter');
  } else {
    score += 15;
  }

  if (!hasUppercase) {
    errors.push('Password must contain at least one uppercase letter');
  } else {
    score += 15;
  }

  if (!hasNumbers) {
    errors.push('Password must contain at least one number');
  } else {
    score += 15;
  }

  if (!hasSpecialChars) {
    errors.push('Password must contain at least one special character (!@#$%^&*()_+-=[]{}|;:,.<>?)');
  } else {
    score += 15;
  }

  // Common patterns and weak passwords
  const commonPatterns = [
    /123456/,
    /password/i,
    /qwerty/i,
    /abc123/i,
    /admin/i,
    /letmein/i,
    /welcome/i,
    /monkey/i,
    /dragon/i,
    /master/i
  ];

  const isCommonPattern = commonPatterns.some(pattern => pattern.test(password));
  if (isCommonPattern) {
    errors.push('Password contains common patterns and is not secure');
    score = Math.max(0, score - 30);
  }

  // Sequential characters
  const hasSequential = /(012|123|234|345|456|567|678|789|890|abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i.test(password);
  if (hasSequential) {
    errors.push('Password contains sequential characters');
    score = Math.max(0, score - 20);
  }

  // Repeated characters
  const hasRepeated = /(.)\1{2,}/.test(password);
  if (hasRepeated) {
    errors.push('Password contains repeated characters');
    score = Math.max(0, score - 15);
  }

  // Keyboard patterns
  const keyboardPatterns = [
    /qwerty/i,
    /asdf/i,
    /zxcv/i,
    /qwertyuiop/i,
    /asdfghjkl/i,
    /zxcvbnm/i
  ];
  
  const hasKeyboardPattern = keyboardPatterns.some(pattern => pattern.test(password));
  if (hasKeyboardPattern) {
    errors.push('Password contains keyboard patterns');
    score = Math.max(0, score - 25);
  }

  // Bonus points for length and complexity
  if (password.length >= 16) {
    score += 10;
  }
  if (password.length >= 20) {
    score += 5;
  }

  // Calculate strength
  let strength: 'weak' | 'medium' | 'strong' | 'very-strong';
  if (score < 40) {
    strength = 'weak';
  } else if (score < 60) {
    strength = 'medium';
  } else if (score < 80) {
    strength = 'strong';
  } else {
    strength = 'very-strong';
  }

  // Minimum requirements for enterprise
  const meetsMinimumRequirements = password.length >= 8 && hasLowercase && hasUppercase && hasNumbers && hasSpecialChars && !isCommonPattern;

  return {
    isValid: meetsMinimumRequirements && errors.length === 0,
    errors,
    score: Math.min(100, Math.max(0, score)),
    strength
  };
}

/**
 * Validate OTP format
 */
export function validateOTP(otp: string): ValidationResult {
  const errors: string[] = [];
  
  if (!otp) {
    errors.push('Verification code is required');
    return { isValid: false, errors };
  }

  if (!/^\d{6}$/.test(otp)) {
    errors.push('Verification code must be exactly 6 digits');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validate password confirmation
 */
export function validatePasswordConfirmation(password: string, confirmPassword: string): ValidationResult {
  const errors: string[] = [];
  
  if (!confirmPassword) {
    errors.push('Please confirm your password');
    return { isValid: false, errors };
  }

  if (password !== confirmPassword) {
    errors.push('Passwords do not match');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Get password strength color for UI
 */
export function getPasswordStrengthColor(strength: string): string {
  switch (strength) {
    case 'weak':
      return 'text-red-500';
    case 'medium':
      return 'text-yellow-500';
    case 'strong':
      return 'text-blue-500';
    case 'very-strong':
      return 'text-green-500';
    default:
      return 'text-gray-500';
  }
}

/**
 * Get password strength background color for progress bar
 */
export function getPasswordStrengthBgColor(strength: string): string {
  switch (strength) {
    case 'weak':
      return 'bg-red-500';
    case 'medium':
      return 'bg-yellow-500';
    case 'strong':
      return 'bg-blue-500';
    case 'very-strong':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
}
