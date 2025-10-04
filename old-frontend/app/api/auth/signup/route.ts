import { NextRequest, NextResponse } from 'next/server';
import { getUserSignupContext } from '@/lib/tenantLogic';
import { storeUser, getUserFromServer } from '@/lib/auth';
import { hashPassword, generateToken } from '@/lib/auth-service';
import { findUserByEmail } from '@/lib/api-service';

// Clean up expired OTPs
function cleanupExpiredOTPs(): void {
  if (!global.otpCache) return;
  
  const now = Date.now();
  const emailsToDelete: string[] = [];
  
  global.otpCache.forEach((otpData, email) => {
    if (now > otpData.expiresAt) {
      emailsToDelete.push(email);
    }
  });
  
  emailsToDelete.forEach(email => {
    global.otpCache!.delete(email);
  });
}

// Function to validate OTP
function validateOTP(email: string, providedOTP: string): boolean {
  if (!global.otpCache) {
    return false;
  }

  const otpData = global.otpCache.get(email);
  
  if (!otpData) {
    return false;
  }

  // Check if OTP has expired
  if (Date.now() > otpData.expiresAt) {
    global.otpCache.delete(email); // Clean up expired OTP
    return false;
  }

  // Check if OTP matches
  if (otpData.otp !== providedOTP) {
    return false;
  }

  // OTP is valid, remove it from cache (single use)
  global.otpCache.delete(email);
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, company, password, otp } = await request.json();

    if (!firstName || !lastName || !email || !password || !otp) {
      return NextResponse.json(
        { error: 'All fields including OTP are required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Check if email already exists in database
    console.log(`🔍 [SIGNUP] Checking if email already exists: ${email}`);
    try {
      const existingUser = await findUserByEmail(email);
      console.log(`📊 [SIGNUP] Database query result:`, existingUser ? 'User found' : 'User not found');
      
      if (existingUser) {
        console.log(`❌ [SIGNUP] Email already exists in database: ${email}`, {
          id: existingUser.id,
          name: `${existingUser.firstName} ${existingUser.lastName}`,
          tenant: existingUser.tenant.name
        });
        return NextResponse.json(
          { 
            error: 'An account with this email already exists. Please use a different email or try signing in.',
            code: 'EMAIL_EXISTS'
          },
          { status: 409 } // Conflict status code
        );
      }
    } catch (dbError) {
      console.log(`⚠️ [SIGNUP] Database check failed, falling back to memory store:`, dbError);
      // Fallback to memory store check
      const existingUser = getUserFromServer(email);
      if (existingUser) {
        console.log(`❌ [SIGNUP] Email already exists in memory store: ${email}`, {
          id: existingUser.id,
          name: `${existingUser.firstName} ${existingUser.lastName}`
        });
        return NextResponse.json(
          { 
            error: 'An account with this email already exists. Please use a different email or try signing in.',
            code: 'EMAIL_EXISTS'
          },
          { status: 409 }
        );
      }
    }
    console.log(`✅ [SIGNUP] Email is available: ${email}`);

    // Clean up expired OTPs first
    cleanupExpiredOTPs();

    // Validate OTP
    if (!validateOTP(email, otp)) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP. Please request a new verification code.' },
        { status: 400 }
      );
    }

    // Apply tenant logic based on email domain
    const signupContext = getUserSignupContext(email, company);
    
    // In a real application, you would:
    // 1. Hash the password
    // 2. Create the user in the database with tenant and organization info
    // 3. Send welcome email
    // 4. Return JWT token

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user object with hashed password
    const user = {
      id: 'user_' + Date.now(),
      firstName,
      lastName,
      email,
      organization: signupContext.organization,
      tenant: signupContext.tenant.name,
      company: signupContext.organization,
      role: signupContext.tenant.isLicensed ? 'user' : 'trial_user',
      userType: signupContext.userType,
      isLicensed: signupContext.tenant.isLicensed,
      emailVerified: true,
      passwordHash, // Store hashed password
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Generate JWT token
    const token = generateToken(user);

    // Store user data with token
    storeUser(user, token);

    // For now, we'll simulate a successful signup with tenant logic
    console.log(`User signup: ${firstName} ${lastName} (${email})`);
    console.log(`Company/Organization: ${company}`);
    console.log(`Assigned Tenant: ${signupContext.tenant.name} (${signupContext.tenant.isLicensed ? 'Licensed' : 'Trial'})`);
    console.log(`User Type: ${signupContext.userType}`);
    console.log(`Signup Type: ${signupContext.signupType}`);
    console.log(`OTP validated successfully`);

    return NextResponse.json({
      success: true,
      message: signupContext.tenant.isLicensed 
        ? 'Account created successfully! Welcome to your licensed organization.'
        : 'Account created successfully! You are on a trial plan.',
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        organization: user.organization,
        tenant: user.tenant,
        role: user.role,
        userType: user.userType,
        isLicensed: user.isLicensed,
        emailVerified: user.emailVerified
        // Don't return password hash or sensitive data
      },
      token // Return JWT token for immediate login
    });

  } catch (error) {
    console.error('Error creating account:', error);
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
}
