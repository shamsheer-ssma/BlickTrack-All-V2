import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import * as crypto from 'crypto';

// Email configuration
const EMAIL_CONFIG = {
  host: 'smtp.strato.de',
  port: 587,
  secure: false,
  user: 'noreply@blicktrack.com',
  pass: 'S@Berlin99',
  from: '"Blick Track Security" <noreply@blicktrack.com>'
};

// Generate secure reset token
function generateResetToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Initialize email transporter
function createTransporter() {
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

// Password reset email template
function getPasswordResetEmailTemplate(userName: string, resetLink: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #073c82, #00d6bc); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .reset-button { display: inline-block; background: linear-gradient(135deg, #073c82, #00d6bc); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
        .warning { background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔑 Password Reset Request</h1>
          <p>Blick Track Security Platform</p>
        </div>
        <div class="content">
          <h2>Hello ${userName}!</h2>
          <p>We received a request to reset your password for your Blick Track Security Platform account.</p>
          
          <p>Click the button below to reset your password:</p>
          <a href="${resetLink}" class="reset-button">Reset My Password</a>
          
          <div class="warning">
            <strong>⚠️ Security Information:</strong>
            <ul>
              <li>This link will expire in <strong>1 hour</strong></li>
              <li>If you didn't request this, please ignore this email</li>
              <li>Your password will remain unchanged until you click the link</li>
            </ul>
          </div>
          
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #073c82;">${resetLink}</p>
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
    const { email, userName } = await request.json();

    if (!email || !userName) {
      return NextResponse.json(
        { error: 'Email and userName are required' },
        { status: 400 }
      );
    }

    // Generate reset token
    const resetToken = generateResetToken();
    
    // Create reset link
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`;
    
    // Create transporter
    const transporter = createTransporter();

    // Send email
    const mailOptions = {
      from: EMAIL_CONFIG.from,
      to: email,
      subject: '🔑 Reset Your Password - Blick Track Security Platform',
      html: getPasswordResetEmailTemplate(userName, resetLink),
      text: `Password Reset Request - Blick Track Security Platform\n\nHello ${userName}!\n\nWe received a request to reset your password for your Blick Track Security Platform account.\n\nClick the link below to reset your password:\n${resetLink}\n\nSECURITY INFORMATION:\n- This link will expire in 1 hour\n- If you didn't request this, please ignore this email\n- Your password will remain unchanged until you click the link\n\n© 2024 Blick Track Security Platform. All rights reserved.`
    };

    await transporter.sendMail(mailOptions);

    // In a real app, you'd store the reset token in database with expiration
    // For now, we'll return it (remove this in production)
    return NextResponse.json({
      success: true,
      message: 'Password reset email sent successfully',
      resetToken: resetToken // Remove this in production
    });

  } catch (error) {
    console.error('Error sending password reset email:', error);
    return NextResponse.json(
      { error: 'Failed to send password reset email' },
      { status: 500 }
    );
  }
}
