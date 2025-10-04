import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import * as crypto from 'crypto';
import { findUserByEmail } from '@/lib/api-service';
import { getUserFromServer } from '@/lib/auth';

// Email configuration - Enterprise-grade with environment variables
const EMAIL_CONFIG = {
  host: process.env.SMTP_HOST || 'smtp.strato.de',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  user: process.env.SMTP_USER || 'noreply@blicktrack.com',
  pass: process.env.SMTP_PASS || '', // No default password for security
  from: process.env.SMTP_FROM || '"Blick Track Security" <noreply@blicktrack.com>'
};

// Generate 6-digit OTP
function generateOTP(): string {
  const randomBytes = crypto.randomBytes(3);
  const randomNumber = randomBytes.readUIntBE(0, 3);
  return (randomNumber % 1000000).toString().padStart(6, '0');
}

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

// Initialize email transporter with validation
function createTransporter() {
  // Validate SMTP configuration
  if (!EMAIL_CONFIG.pass) {
    throw new Error('SMTP_PASS environment variable is required for email functionality');
  }
  
  if (!EMAIL_CONFIG.user) {
    throw new Error('SMTP_USER environment variable is required for email functionality');
  }

  return nodemailer.createTransport({
    host: EMAIL_CONFIG.host,
    port: EMAIL_CONFIG.port,
    secure: EMAIL_CONFIG.secure,
    auth: {
      user: EMAIL_CONFIG.user,
      pass: EMAIL_CONFIG.pass,
    },
    tls: {
      rejectUnauthorized: false
    }
  });
}

// Email verification template
function getVerificationEmailTemplate(firstName: string, otp: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #073c82, #00d6bc); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .otp-code { background: #fff; border: 2px dashed #073c82; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; color: #073c82; margin: 20px 0; border-radius: 8px; letter-spacing: 5px; }
        .warning { background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 Email Verification Required</h1>
          <p>Blick Track Security Platform</p>
        </div>
        <div class="content">
          <h2>Hello ${firstName}!</h2>
          <p>Thank you for registering with Blick Track Security Platform. To complete your registration and secure your account, please verify your email address.</p>
          
          <p><strong>Your verification code is:</strong></p>
          <div class="otp-code">${otp}</div>
          
          <div class="warning">
            <strong>⚠️ Important Security Information:</strong>
            <ul>
              <li>This code will expire in <strong>5 minutes</strong></li>
              <li>Use this code only once</li>
              <li>Never share this code with anyone</li>
              <li>If you didn't request this, please ignore this email</li>
            </ul>
          </div>
          
          <p>Enter this code in the verification form to activate your account.</p>
          
          <p>If you have any questions, please contact our support team.</p>
        </div>
        <div class="footer">
          <p>© 2024 Blick Track Security Platform. All rights reserved.</p>
          <p>This is an automated message, please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export async function POST(request: NextRequest) {
  try {
    const { email, firstName } = await request.json();

    if (!email || !firstName) {
      return NextResponse.json(
        { error: 'Email and firstName are required' },
        { status: 400 }
      );
    }

    // Check if email already exists before sending OTP
    console.log(`🔍 [OTP] Checking if email already exists before OTP: ${email}`);
    try {
      const existingUser = await findUserByEmail(email);
      console.log(`📊 [OTP] Database query result:`, existingUser ? 'User found' : 'User not found');
      
      if (existingUser) {
        console.log(`❌ [OTP] Email already exists in database, not sending OTP: ${email}`, {
          id: existingUser.id,
          name: `${existingUser.firstName} ${existingUser.lastName}`,
          tenant: existingUser.tenant.name // UserWithContext has tenant.name
        });
        return NextResponse.json(
          { 
            error: 'An account with this email already exists. Please use a different email or try signing in.',
            code: 'EMAIL_EXISTS'
          },
          { status: 409 }
        );
      }
    } catch (dbError) {
      console.log(`⚠️ [OTP] Database check failed, falling back to memory store:`, dbError);
      // Fallback to memory store check
      const existingUser = getUserFromServer(email);
      if (existingUser) {
        console.log(`❌ [OTP] Email already exists in memory store, not sending OTP: ${email}`, {
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
    console.log(`✅ [OTP] Email is available, proceeding with OTP: ${email}`);

    // Generate OTP
    const otp = generateOTP();
    
    // Create transporter
    const transporter = createTransporter();

    // Send email
    const mailOptions = {
      from: EMAIL_CONFIG.from,
      to: email,
      subject: '🔐 Verify Your Email - Blick Track Security Platform',
      html: getVerificationEmailTemplate(firstName, otp),
      text: `Email Verification Required - Blick Track Security Platform\n\nHello ${firstName}!\n\nThank you for registering with Blick Track Security Platform. To complete your registration and secure your account, please verify your email address.\n\nYour verification code is: ${otp}\n\nIMPORTANT SECURITY INFORMATION:\n- This code will expire in 5 minutes\n- Use this code only once\n- Never share this code with anyone\n- If you didn't request this, please ignore this email\n\nEnter this code in the verification form to activate your account.\n\n© 2024 Blick Track Security Platform. All rights reserved.`
    };

    await transporter.sendMail(mailOptions);

    // In a real app, you'd store the OTP in database with expiration
    // For now, we'll store it in memory with a 5-minute expiration
    const otpData = {
      otp: otp,
      email: email,
      expiresAt: Date.now() + (5 * 60 * 1000) // 5 minutes from now
    };
    
    // Store in global OTP cache (in production, use Redis or database)
    if (!global.otpCache) {
      global.otpCache = new Map();
    }
    
    // Clean up expired OTPs before adding new one
    cleanupExpiredOTPs();
    
    global.otpCache.set(email, otpData);

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully'
    });

  } catch (error) {
    console.error('Error sending OTP email:', error);
    return NextResponse.json(
      { error: 'Failed to send OTP email' },
      { status: 500 }
    );
  }
}
