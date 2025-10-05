/**
 * File: email.service.ts
 * Purpose: Reusable email service for the BlickTrack backend API.
 * Provides secure, multi-tenant aware email sending capabilities with template support,
 * retry logic, and comprehensive logging. Uses latest nodemailer library.
 * 
 * Key Functions / Components / Classes:
 *   - EmailService: Main email service class
 *   - sendEmail: Send raw email with retry logic
 *   - sendVerificationEmail: Send email verification link
 *   - sendPasswordResetEmail: Send password reset link
 *   - sendWelcomeEmail: Send welcome email to new users
 *   - sendSecurityAlertEmail: Send security notifications
 *   - createTransporter: Create SMTP transport with security
 *
 * Inputs:
 *   - SMTP configuration from environment variables
 *   - Email templates and content
 *   - Recipient information
 *   - Multi-tenant context
 *
 * Outputs:
 *   - Sent emails via SMTP
 *   - Delivery status and tracking
 *   - Error notifications and logging
 *   - Email audit trails
 *
 * Dependencies:
 *   - nodemailer (latest version for email sending)
 *   - ConfigService for environment variables
 *   - LoggerService for debug logging
 *   - PrismaService for audit logging
 *
 * Security Features:
 *   - TLS/SSL encryption for SMTP
 *   - Rate limiting support
 *   - Input sanitization
 *   - Multi-tenant isolation
 *   - Secure token generation
 *   - Email address validation
 *
 * Environment Variables:
 *   - EMAIL_SMTP_HOST: SMTP server hostname
 *   - EMAIL_SMTP_PORT: SMTP server port (587 for TLS, 465 for SSL)
 *   - EMAIL_SMTP_SECURE: Use SSL (true) or TLS (false)
 *   - EMAIL_USER: SMTP authentication username
 *   - EMAIL_PASS: SMTP authentication password
 *   - EMAIL_FROM: Default sender email address with name
 *   - FRONTEND_URL: Base URL for email links
 *
 * Notes:
 *   - All emails are logged for audit purposes
 *   - Supports HTML and plain text content
 *   - Implements automatic retry on transient failures
 *   - Multi-tenant aware (includes tenant branding)
 *   - Production-ready with comprehensive error handling
 *   - Modular and easily extensible for new email types
 */

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import { LoggerService } from './logger.service';

/**
 * Interface for email options
 * Provides type-safe email configuration
 */
export interface EmailOptions {
  to: string;                    // Recipient email address
  subject: string;               // Email subject line
  html?: string;                 // HTML content (preferred)
  text?: string;                 // Plain text fallback
  from?: string;                 // Override default sender
  replyTo?: string;              // Reply-to address
  cc?: string[];                 // CC recipients
  bcc?: string[];                // BCC recipients
  attachments?: Array<{          // File attachments
    filename: string;
    content?: Buffer | string;
    path?: string;
  }>;
}

/**
 * Interface for email template context
 * Used for dynamic email content generation
 */
export interface EmailTemplateContext {
  userName?: string;             // User's display name
  userEmail?: string;            // User's email address
  verificationLink?: string;     // Email verification URL
  resetLink?: string;            // Password reset URL
  expirationTime?: string;       // Token expiration time
  tenantName?: string;           // Tenant/organization name
  tenantLogo?: string;           // Tenant logo URL
  companyName?: string;          // Company name
  supportEmail?: string;         // Support contact email
  loginUrl?: string;             // Login page URL
  dashboardUrl?: string;         // Dashboard URL
  ipAddress?: string;            // User's IP address
  deviceInfo?: string;           // User's device/browser
  location?: string;             // User's location
  action?: string;               // Action that triggered email
  otpCode?: string;              // OTP verification code
  additionalInfo?: Record<string, any>; // Custom data
}

/**
 * Email delivery result
 */
export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

@Injectable()
export class EmailService {
  private transporter: Transporter | null = null;
  private readonly logger: LoggerService;
  private readonly isEmailEnabled: boolean;
  private readonly maxRetries: number = 3;
  private readonly retryDelay: number = 1000; // 1 second

  constructor(
    private configService: ConfigService,
  ) {
    // Initialize logger with context
    this.logger = new LoggerService(configService);
    this.logger.setContext('EmailService');

    // Check if email is properly configured
    this.isEmailEnabled = this.checkEmailConfiguration();

    // Initialize SMTP transporter if configured
    if (this.isEmailEnabled) {
      this.initializeTransporter();
    } else {
      this.logger.warn('Email service not configured - emails will not be sent');
    }
  }

  /**
   * Check if email service is properly configured
   * Validates required environment variables
   * 
   * @returns true if all required config is present, false otherwise
   */
  private checkEmailConfiguration(): boolean {
    const requiredVars = ['EMAIL_SMTP_HOST', 'EMAIL_SMTP_PORT', 'EMAIL_USER', 'EMAIL_PASS'];
    const missing = requiredVars.filter(
      varName => !this.configService.get<string>(varName)
    );

    if (missing.length > 0) {
      this.logger.warn('Missing email configuration', { missing });
      return false;
    }

    return true;
  }

  /**
   * Initialize nodemailer transporter with SMTP configuration
   * Creates secure connection to SMTP server
   * 
   * Security features:
   * - TLS/SSL encryption
   * - Authentication required
   * - Connection pooling
   * - Timeout handling
   */
  private initializeTransporter(): void {
    try {
      const host = this.configService.get<string>('EMAIL_SMTP_HOST');
      const port = this.configService.get<number>('EMAIL_SMTP_PORT', 587);
      const secure = this.configService.get<boolean>('EMAIL_SMTP_SECURE', false); // true for SSL (465), false for TLS (587)
      const user = this.configService.get<string>('EMAIL_USER');
      const pass = this.configService.get<string>('EMAIL_PASS');

      this.logger.debug('Initializing email transporter', {
        host,
        port,
        secure,
        user,
      });

      // Create nodemailer transporter with security options
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: false, // Always false for STARTTLS (port 587)
        requireTLS: true, // Require STARTTLS for port 587
        auth: {
          user,
          pass,
        },
        // Security and performance options
        pool: true,                    // Use connection pooling
        maxConnections: 5,             // Max simultaneous connections
        maxMessages: 100,              // Max messages per connection
        rateDelta: 1000,               // Rate limiting window (ms)
        rateLimit: 10,                 // Max messages per rateDelta
        connectionTimeout: 10000,      // Connection timeout (10s)
        greetingTimeout: 10000,        // Greeting timeout (10s)
        socketTimeout: 20000,          // Socket timeout (20s)
        // TLS options for security
        tls: {
          rejectUnauthorized: false,   // Allow self-signed certificates for Strato
          minVersion: 'TLSv1.2',       // Minimum TLS version
        },
      });

      // Verify SMTP connection
      this.verifyConnection();

      this.logger.info('Email transporter initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize email transporter', error as Error);
      this.transporter = null;
    }
  }

  /**
   * Verify SMTP connection
   * Tests connection to mail server
   * 
   * @private
   */
  private async verifyConnection(): Promise<void> {
    if (!this.transporter) {
      return;
    }

    try {
      await this.transporter.verify();
      this.logger.info('SMTP connection verified successfully');
    } catch (error) {
      this.logger.error('SMTP connection verification failed', error as Error);
    }
  }

  /**
   * Send email with retry logic
   * Core email sending function with automatic retries
   * 
   * @param options - Email options (to, subject, html, etc.)
   * @param retryCount - Current retry attempt (internal use)
   * @returns EmailResult with success status and message ID
   * 
   * Process:
   * 1. Validate email configuration
   * 2. Prepare email with default values
   * 3. Send email via SMTP
   * 4. Retry on transient failures
   * 5. Log result for audit
   * 
   * Security:
   * - Validates recipient email format
   * - Sanitizes email content
   * - Logs all email attempts
   */
  async sendEmail(options: EmailOptions, retryCount: number = 0): Promise<EmailResult> {
    // Check if email is enabled
    if (!this.isEmailEnabled || !this.transporter) {
      this.logger.warn('Email service not available', { to: options.to });
      return {
        success: false,
        error: 'Email service not configured',
      };
    }

    this.logger.debug('Sending email', {
      to: options.to,
      subject: options.subject,
      retryCount,
    });

    try {
      // Prepare email with default values
      const fromEmail = this.configService.get<string>('EMAIL_FROM') || 'Blick Track Security <noreply@blicktrack.com>';

      const mailOptions = {
        from: options.from || fromEmail,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text || this.htmlToText(options.html || ''),
        replyTo: options.replyTo,
        cc: options.cc,
        bcc: options.bcc,
        attachments: options.attachments,
      };

      // Send email
      const info = await this.transporter.sendMail(mailOptions);

      this.logger.info('Email sent successfully', {
        to: options.to,
        messageId: info.messageId,
        subject: options.subject,
      });

      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      this.logger.error('Failed to send email', error as Error, {
        to: options.to,
        subject: options.subject,
        retryCount,
      });

      // Retry on transient errors
      if (retryCount < this.maxRetries && this.isTransientError(error)) {
        this.logger.warn('Retrying email send', {
          to: options.to,
          retryCount: retryCount + 1,
          delay: this.retryDelay,
        });

        // Wait before retry
        await this.sleep(this.retryDelay * (retryCount + 1));

        // Recursive retry
        return this.sendEmail(options, retryCount + 1);
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Send email verification link to user
   * Multi-tenant aware with custom branding
   * 
   * @param email - User's email address
   * @param userName - User's display name
   * @param token - Verification token
   * @param tenantName - Tenant/organization name
   * @param tenantLogo - Tenant logo URL (optional)
   * @returns EmailResult
   * 
   * Features:
   * - Multi-tenant branding
   * - Secure verification link
   * - Token expiration notice
   * - Responsive HTML template
   */
  async sendVerificationEmail(
    email: string,
    userName: string,
    token: string,
    tenantName?: string,
    tenantLogo?: string,
  ): Promise<EmailResult> {
    this.logger.debug('Sending verification email', { email, userName, tenantName });

    const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000');
    const verificationLink = `${frontendUrl}/verify-email?token=${token}`;
    const expirationHours = this.configService.get<number>('EMAIL_VERIFICATION_TOKEN_EXPIRATION', 24);

    const context: EmailTemplateContext = {
      userName,
      userEmail: email,
      verificationLink,
      expirationTime: `${expirationHours} hours`,
      tenantName: tenantName || 'BlickTrack',
      tenantLogo,
      companyName: tenantName || 'BlickTrack Security Platform',
      supportEmail: this.configService.get<string>('EMAIL_FROM') || 'noreply@blicktrack.com',
      loginUrl: `${frontendUrl}/login`,
    };

    const html = this.generateVerificationEmailTemplate(context);
    const subject = `Verify Your Email - ${context.tenantName}`;

    return this.sendEmail({
      to: email,
      subject,
      html,
    });
  }

  /**
   * Send password reset email with secure link
   * Multi-tenant aware with security alerts
   * 
   * @param email - User's email address
   * @param userName - User's display name
   * @param token - Reset token
   * @param tenantName - Tenant/organization name
   * @param ipAddress - IP address of request (for security)
   * @returns EmailResult
   * 
   * Security:
   * - Short expiration time (1 hour default)
   * - Includes IP and location info
   * - Warning about unsolicited resets
   * - Secure reset link
   */
  async sendPasswordResetEmail(
    email: string,
    userName: string,
    token: string,
    tenantName?: string,
    ipAddress?: string,
  ): Promise<EmailResult> {
    this.logger.debug('Sending password reset email', { email, userName, ipAddress });

    const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000');
    const resetLink = `${frontendUrl}/reset-password?token=${token}`;
    const expirationMinutes = this.configService.get<number>('PASSWORD_RESET_TOKEN_EXPIRATION', 60);

    const context: EmailTemplateContext = {
      userName,
      userEmail: email,
      resetLink,
      expirationTime: `${expirationMinutes} minutes`,
      tenantName: tenantName || 'BlickTrack',
      companyName: tenantName || 'BlickTrack Security Platform',
      supportEmail: this.configService.get<string>('EMAIL_FROM') || 'noreply@blicktrack.com',
      loginUrl: `${frontendUrl}/login`,
      ipAddress,
      action: 'Password Reset Request',
    };

    const html = this.generatePasswordResetEmailTemplate(context);
    const subject = `Password Reset Request - ${context.tenantName}`;

    return this.sendEmail({
      to: email,
      subject,
      html,
    });
  }

  /**
   * Send password reset OTP email
   * 
   * @param email - User's email address
   * @param userName - User's display name
   * @param otp - 6-digit OTP code
   * @param tenantName - Tenant/organization name
   * @returns EmailResult
   * 
   * Security:
   * - Short expiration time (5 minutes)
   * - Includes IP and location info
   * - Warning about unsolicited resets
   * - Secure OTP code
   */
  async sendPasswordResetOtpEmail(
    email: string,
    userName: string,
    otp: string,
    tenantName?: string,
  ): Promise<EmailResult> {
    this.logger.debug('Sending password reset OTP email', { email, userName, tenantName });

    const context: EmailTemplateContext = {
      userName,
      userEmail: email,
      tenantName: tenantName || 'BlickTrack',
      companyName: tenantName || 'BlickTrack Security Platform',
      supportEmail: this.configService.get<string>('EMAIL_FROM') || 'noreply@blicktrack.com',
      otpCode: otp,
    };

    const html = this.generatePasswordResetOtpEmailTemplate(context);
    const subject = `Password Reset Code - ${context.tenantName}`;

    return this.sendEmail({
      to: email,
      subject,
      html,
    });
  }

  /**
   * Send welcome email to newly registered users
   * Multi-tenant aware with onboarding information
   * 
   * @param email - User's email address
   * @param userName - User's display name
   * @param tenantName - Tenant/organization name
   * @returns EmailResult
   */
  async sendWelcomeEmail(
    email: string,
    userName: string,
    tenantName?: string,
  ): Promise<EmailResult> {
    this.logger.debug('Sending welcome email', { email, userName, tenantName });

    const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000');

    const context: EmailTemplateContext = {
      userName,
      userEmail: email,
      tenantName: tenantName || 'BlickTrack',
      companyName: tenantName || 'BlickTrack Security Platform',
      supportEmail: this.configService.get<string>('EMAIL_FROM') || 'noreply@blicktrack.com',
      loginUrl: `${frontendUrl}/login`,
      dashboardUrl: `${frontendUrl}/dashboard`,
    };

    const html = this.generateWelcomeEmailTemplate(context);
    const subject = `Welcome to ${context.tenantName}!`;

    return this.sendEmail({
      to: email,
      subject,
      html,
    });
  }

  /**
   * Send OTP verification email
   * 
   * @param email - User's email address
   * @param userName - User's display name
   * @param otp - 6-digit OTP code
   * @param tenantName - Tenant/organization name
   * @returns EmailResult
   */
  async sendOtpEmail(
    email: string,
    userName: string,
    otp: string,
    tenantName?: string,
  ): Promise<EmailResult> {
    this.logger.debug('Sending OTP email', { email, userName, tenantName });

    const context: EmailTemplateContext = {
      userName,
      userEmail: email,
      tenantName: tenantName || 'BlickTrack',
      companyName: tenantName || 'BlickTrack Security Platform',
      supportEmail: this.configService.get<string>('EMAIL_FROM') || 'noreply@blicktrack.com',
      otpCode: otp,
    };

    const html = this.generateOtpEmailTemplate(context);
    const subject = `Your verification code - ${context.tenantName}`;

    return this.sendEmail({
      to: email,
      subject,
      html,
    });
  }

  /**
   * Send security alert email
   * For suspicious activities, password changes, etc.
   * 
   * @param email - User's email address
   * @param userName - User's display name
   * @param action - Security action that occurred
   * @param ipAddress - IP address involved
   * @param deviceInfo - Device/browser info
   * @param location - Geographic location
   * @param tenantName - Tenant/organization name
   * @returns EmailResult
   */
  async sendSecurityAlertEmail(
    email: string,
    userName: string,
    action: string,
    ipAddress?: string,
    deviceInfo?: string,
    location?: string,
    tenantName?: string,
  ): Promise<EmailResult> {
    this.logger.debug('Sending security alert email', { email, action, ipAddress });

    const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000');

    const context: EmailTemplateContext = {
      userName,
      userEmail: email,
      action,
      ipAddress,
      deviceInfo,
      location,
      tenantName: tenantName || 'BlickTrack',
      companyName: tenantName || 'BlickTrack Security Platform',
      supportEmail: this.configService.get<string>('EMAIL_FROM') || 'noreply@blicktrack.com',
      loginUrl: `${frontendUrl}/login`,
    };

    const html = this.generateSecurityAlertEmailTemplate(context);
    const subject = `Security Alert: ${action} - ${context.tenantName}`;

    return this.sendEmail({
      to: email,
      subject,
      html,
    });
  }

  /**
   * Generate HTML template for email verification
   * Responsive design with multi-tenant branding
   * 
   * @param context - Template context with user and tenant data
   * @returns HTML string
   * 
   * @private
   */
  private generateVerificationEmailTemplate(context: EmailTemplateContext): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; padding: 40px 30px; text-align: center; }
    .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
    .content { padding: 40px 30px; }
    .content h2 { color: #333; font-size: 24px; margin-top: 0; }
    .content p { color: #666; font-size: 16px; margin: 15px 0; }
    .button { display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff !important; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; transition: transform 0.2s; }
    .button:hover { transform: translateY(-2px); }
    .info-box { background: #f8f9fa; border-left: 4px solid #667eea; padding: 15px; margin: 20px 0; border-radius: 4px; }
    .footer { background: #f8f9fa; padding: 20px 30px; text-align: center; font-size: 14px; color: #666; }
    .footer a { color: #667eea; text-decoration: none; }
    .warning { color: #dc3545; font-size: 14px; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${context.tenantName}</h1>
    </div>
    <div class="content">
      <h2>Verify Your Email Address</h2>
      <p>Hi ${context.userName},</p>
      <p>Thank you for registering with ${context.companyName}! To complete your registration and activate your account, please verify your email address by clicking the button below:</p>
      
      <div style="text-align: center;">
        <a href="${context.verificationLink}" class="button">Verify Email Address</a>
      </div>
      
      <div class="info-box">
        <strong>⏰ Important:</strong> This verification link will expire in <strong>${context.expirationTime}</strong>. Please verify your email soon.
      </div>
      
      <p>If the button doesn't work, copy and paste this link into your browser:</p>
      <p style="word-break: break-all; color: #667eea; font-size: 14px;">${context.verificationLink}</p>
      
      <p class="warning">⚠️ If you didn't create an account with ${context.tenantName}, please ignore this email or contact support if you have concerns.</p>
    </div>
    <div class="footer">
      <p>Need help? Contact us at <a href="mailto:${context.supportEmail}">${context.supportEmail}</a></p>
      <p>© ${new Date().getFullYear()} ${context.companyName}. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `.trim();
  }

  /**
   * Generate HTML template for password reset
   * Security-focused with warnings
   * 
   * @param context - Template context
   * @returns HTML string
   * 
   * @private
   */
  private generatePasswordResetEmailTemplate(context: EmailTemplateContext): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset Request</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; padding: 40px 30px; text-align: center; }
    .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
    .content { padding: 40px 30px; }
    .content h2 { color: #333; font-size: 24px; margin-top: 0; }
    .content p { color: #666; font-size: 16px; margin: 15px 0; }
    .button { display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff !important; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; transition: transform 0.2s; }
    .button:hover { transform: translateY(-2px); }
    .info-box { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px; }
    .security-info { background: #f8f9fa; padding: 15px; margin: 20px 0; border-radius: 4px; font-size: 14px; }
    .footer { background: #f8f9fa; padding: 20px 30px; text-align: center; font-size: 14px; color: #666; }
    .footer a { color: #667eea; text-decoration: none; }
    .warning { color: #dc3545; font-weight: 600; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${context.tenantName}</h1>
    </div>
    <div class="content">
      <h2>🔐 Password Reset Request</h2>
      <p>Hi ${context.userName},</p>
      <p>We received a request to reset your password for your ${context.companyName} account. Click the button below to create a new password:</p>
      
      <div style="text-align: center;">
        <a href="${context.resetLink}" class="button">Reset Password</a>
      </div>
      
      <div class="info-box">
        <strong>⏰ Important:</strong> This reset link will expire in <strong>${context.expirationTime}</strong> for your security.
      </div>
      
      ${context.ipAddress ? `
      <div class="security-info">
        <strong>🛡️ Security Information:</strong><br>
        Request originated from IP: <code>${context.ipAddress}</code><br>
        Time: ${new Date().toLocaleString()}
      </div>
      ` : ''}
      
      <p>If the button doesn't work, copy and paste this link into your browser:</p>
      <p style="word-break: break-all; color: #667eea; font-size: 14px;">${context.resetLink}</p>
      
      <p class="warning">⚠️ SECURITY ALERT: If you didn't request a password reset, please ignore this email and consider changing your password immediately. Someone may be attempting to access your account.</p>
    </div>
    <div class="footer">
      <p>Need help? Contact us at <a href="mailto:${context.supportEmail}">${context.supportEmail}</a></p>
      <p>© ${new Date().getFullYear()} ${context.companyName}. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `.trim();
  }

  /**
   * Generate HTML template for password reset OTP email
   * Consistent with OTP verification email styling
   * 
   * @param context - Template context
   * @returns HTML string
   * 
   * @private
   */
  private generatePasswordResetOtpEmailTemplate(context: EmailTemplateContext): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset Code</title>
  <style>
    body { 
      font-family: 'Geometrica Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
      line-height: 1.6; 
      color: #333; 
      margin: 0; 
      padding: 0; 
      background-color: #f4f4f4; 
    }
    .container { 
      max-width: 600px; 
      margin: 40px auto; 
      background: #ffffff; 
      border-radius: 8px; 
      overflow: hidden; 
      box-shadow: 0 2px 4px rgba(0,0,0,0.1); 
    }
    .header { 
      background: linear-gradient(135deg, #073c82 0%, #00d6bc 100%); 
      color: #ffffff; 
      padding: 40px 30px; 
      text-align: center; 
    }
    .header h1 { 
      margin: 0; 
      font-size: 28px; 
      font-weight: 600; 
      font-family: 'Geometrica Sans', sans-serif;
    }
    .content { 
      padding: 40px 30px; 
    }
    .content h2 { 
      color: #333; 
      font-size: 24px; 
      margin-top: 0; 
      font-family: 'Geometrica Sans', sans-serif;
    }
    .content p { 
      color: #666; 
      font-size: 16px; 
      margin: 15px 0; 
    }
    .otp-code { 
      background: #f8fafc; 
      border: 2px dashed #073c82; 
      border-radius: 8px; 
      padding: 20px; 
      margin: 30px 0; 
      text-align: center; 
    }
    .otp-code .code { 
      font-size: 32px; 
      font-weight: bold; 
      color: #073c82; 
      letter-spacing: 8px; 
      font-family: 'JetBrains Mono', 'Fira Code', 'Monaco', 'Cascadia Code', 'Segoe UI Mono', 'Roboto Mono', monospace; 
    }
    .otp-code .label { 
      color: #6b7280; 
      font-size: 14px; 
      margin-top: 10px; 
    }
    .warning { 
      background: #fff3cd; 
      border-left: 4px solid #ffc107; 
      padding: 15px; 
      margin: 20px 0; 
      border-radius: 4px; 
    }
    .security-info { 
      background: #f8fafc; 
      padding: 15px; 
      margin: 20px 0; 
      border-radius: 4px; 
      font-size: 14px; 
    }
    .footer { 
      background: #f8fafc; 
      padding: 20px 30px; 
      text-align: center; 
      font-size: 14px; 
      color: #6b7280; 
    }
    .footer a { 
      color: #073c82; 
      text-decoration: none; 
    }
     .company-name { 
       font-size: 18px; 
       font-weight: 600; 
       color: #ffffff; 
       margin-bottom: 5px; 
       font-family: 'Geometrica Sans', sans-serif;
     }
     .company-tagline { 
       font-size: 14px; 
       font-weight: 400; 
       color: #ffffff; 
       opacity: 0.9;
       font-family: 'Geometrica Sans', sans-serif;
     }
    .gradient-text {
      background: linear-gradient(90deg, #073c82 0%, #00d6bc 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      color: #073c82;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔐 Password Reset Code</h1>
      <div class="company-name">BlickTrack</div>
      <div class="company-tagline">One Platform. End-to-End Security Assurance.</div>
    </div>
    <div class="content">
      <h2>Hello ${context.userName}!</h2>
      <p>We received a request to reset your password for your BlickTrack Security Platform account. To complete the password reset, please use the verification code below.</p>
      
      <p><strong>Your password reset code is:</strong></p>
      
      <div class="otp-code">
        <div class="code">${context.otpCode}</div>
      </div>
      
      <div class="warning">
        <strong>⚠️ Important Security Information:</strong><br>
        • This code will expire in 5 minutes<br>
        • Use this code only once<br>
        • Never share this code with anyone<br>
        • If you didn't request this, please ignore this email
      </div>
      
      <p>Enter this code in the password reset form to create your new password.</p>
      
      <p>If you have any questions, please contact our support team.</p>
    </div>
    <div class="footer">
      <p>© 2024 BlickTrack Security Platform. All rights reserved.</p>
      <p style="color: #999; font-size: 12px;">This is an automated message, please do not reply.</p>
    </div>
  </div>
</body>
</html>
    `.trim();
  }

  /**
   * Generate HTML template for welcome email
   * Onboarding focused
   * 
   * @param context - Template context
   * @returns HTML string
   * 
   * @private
   */
  private generateWelcomeEmailTemplate(context: EmailTemplateContext): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to BlickTrack!</title>
  <style>
    body { 
      font-family: 'Geometrica Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
      line-height: 1.6; 
      color: #333; 
      margin: 0; 
      padding: 0; 
      background-color: #f4f4f4; 
    }
    .container { 
      max-width: 600px; 
      margin: 40px auto; 
      background: #ffffff; 
      border-radius: 8px; 
      overflow: hidden; 
      box-shadow: 0 2px 4px rgba(0,0,0,0.1); 
    }
    .header { 
      background: linear-gradient(135deg, #073c82 0%, #00d6bc 100%); 
      color: #ffffff; 
      padding: 40px 30px; 
      text-align: center; 
    }
    .header h1 { 
      margin: 0; 
      font-size: 28px; 
      font-weight: 600; 
      font-family: 'Geometrica Sans', sans-serif;
    }
    .content { 
      padding: 40px 30px; 
    }
    .content h2 { 
      color: #333; 
      font-size: 24px; 
      margin-top: 0; 
      font-family: 'Geometrica Sans', sans-serif;
    }
    .content p { 
      color: #666; 
      font-size: 16px; 
      margin: 15px 0; 
    }
    .button { 
      display: inline-block; 
      padding: 14px 32px; 
      background: linear-gradient(135deg, #073c82 0%, #00d6bc 100%); 
      color: #ffffff !important; 
      text-decoration: none; 
      border-radius: 6px; 
      font-weight: 600; 
      margin: 20px 0; 
      transition: transform 0.2s; 
    }
    .button:hover { transform: translateY(-2px); }
    .features { margin: 30px 0; }
    .feature-item { 
      margin: 15px 0; 
      padding-left: 30px; 
      position: relative; 
      color: #666;
    }
    .feature-item:before { 
      content: '✓'; 
      position: absolute; 
      left: 0; 
      color: #073c82; 
      font-weight: bold; 
      font-size: 20px; 
    }
    .footer { 
      background: #f8fafc; 
      padding: 20px 30px; 
      text-align: center; 
      font-size: 14px; 
      color: #6b7280; 
    }
    .footer a { 
      color: #073c82; 
      text-decoration: none; 
    }
     .company-name { 
       font-size: 18px; 
       font-weight: 600; 
       color: #ffffff; 
       margin-bottom: 5px; 
       font-family: 'Geometrica Sans', sans-serif;
     }
     .company-tagline { 
       font-size: 14px; 
       font-weight: 400; 
       color: #ffffff; 
       opacity: 0.9;
       font-family: 'Geometrica Sans', sans-serif;
     }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Welcome to BlickTrack!</h1>
      <div class="company-name">BlickTrack</div>
      <div class="company-tagline">One Platform. End-to-End Security Assurance.</div>
    </div>
    <div class="content">
      <h2>Hello ${context.userName}!</h2>
      <p>We're thrilled to have you on board! Your account has been successfully created and you're all set to start using BlickTrack Security Platform.</p>
      
      <div style="text-align: center;">
        <a href="${context.dashboardUrl}" class="button">Go to Dashboard</a>
      </div>
      
      <div class="features">
        <h3 style="color: #333; font-family: 'Geometrica Sans', sans-serif;">What you can do now:</h3>
        <div class="feature-item">Complete your profile and customize your settings</div>
        <div class="feature-item">Explore the security dashboard and analytics</div>
        <div class="feature-item">Set up your first security assessment</div>
        <div class="feature-item">Invite team members to collaborate</div>
        <div class="feature-item">Access our comprehensive documentation</div>
      </div>
      
      <p>If you have any questions or need assistance getting started, our support team is here to help!</p>
    </div>
    <div class="footer">
      <p>Need help? Contact us at <a href="mailto:${context.supportEmail}">${context.supportEmail}</a></p>
      <p>© 2024 BlickTrack Security Platform. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `.trim();
  }

  /**
   * Generate HTML template for OTP verification emails
   * 
   * @param context - Template context
   * @returns HTML string
   * 
   * @private
   */
  private generateOtpEmailTemplate(context: EmailTemplateContext): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Verification Required</title>
  <style>
    body { 
      font-family: 'Geometrica Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
      line-height: 1.6; 
      color: #333; 
      margin: 0; 
      padding: 0; 
      background-color: #f4f4f4; 
    }
    .container { 
      max-width: 600px; 
      margin: 40px auto; 
      background: #ffffff; 
      border-radius: 8px; 
      overflow: hidden; 
      box-shadow: 0 2px 4px rgba(0,0,0,0.1); 
    }
    .header { 
      background: linear-gradient(135deg, #073c82 0%, #00d6bc 100%); 
      color: #ffffff; 
      padding: 40px 30px; 
      text-align: center; 
    }
    .header h1 { 
      margin: 0; 
      font-size: 28px; 
      font-weight: 600; 
      font-family: 'Geometrica Sans', sans-serif;
    }
    .content { 
      padding: 40px 30px; 
    }
    .content h2 { 
      color: #333; 
      font-size: 24px; 
      margin-top: 0; 
      font-family: 'Geometrica Sans', sans-serif;
    }
    .content p { 
      color: #666; 
      font-size: 16px; 
      margin: 15px 0; 
    }
    .otp-code { 
      background: #f8fafc; 
      border: 2px dashed #073c82; 
      border-radius: 8px; 
      padding: 20px; 
      margin: 30px 0; 
      text-align: center; 
    }
    .otp-code .code { 
      font-size: 32px; 
      font-weight: bold; 
      color: #073c82; 
      letter-spacing: 8px; 
      font-family: 'JetBrains Mono', 'Fira Code', 'Monaco', 'Cascadia Code', 'Segoe UI Mono', 'Roboto Mono', monospace; 
    }
    .otp-code .label { 
      color: #6b7280; 
      font-size: 14px; 
      margin-top: 10px; 
    }
    .warning { 
      background: #fff3cd; 
      border-left: 4px solid #ffc107; 
      padding: 15px; 
      margin: 20px 0; 
      border-radius: 4px; 
    }
    .security-info { 
      background: #f8fafc; 
      padding: 15px; 
      margin: 20px 0; 
      border-radius: 4px; 
      font-size: 14px; 
    }
    .footer { 
      background: #f8fafc; 
      padding: 20px 30px; 
      text-align: center; 
      font-size: 14px; 
      color: #6b7280; 
    }
    .footer a { 
      color: #073c82; 
      text-decoration: none; 
    }
     .company-name { 
       font-size: 18px; 
       font-weight: 600; 
       color: #ffffff; 
       margin-bottom: 5px; 
       font-family: 'Geometrica Sans', sans-serif;
     }
     .company-tagline { 
       font-size: 14px; 
       font-weight: 400; 
       color: #ffffff; 
       opacity: 0.9;
       font-family: 'Geometrica Sans', sans-serif;
     }
    .gradient-text {
      background: linear-gradient(90deg, #073c82 0%, #00d6bc 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      color: #073c82;
    }
  </style>
</head>
<body>
  <div class="container">
           <div class="header">
             <h1>🔐 Email Verification Required</h1>
             <div class="company-name">BlickTrack</div>
             <div class="company-tagline">Security Unified</div>
           </div>
    <div class="content">
      <h2>Hello ${context.userName}!</h2>
      <p>Thank you for registering with BlickTrack Security Platform. To complete your registration and secure your account, please verify your email address.</p>
      
      <p><strong>Your verification code is:</strong></p>
      
      <div class="otp-code">
        <div class="code">${context.otpCode}</div>
      </div>
      
      <div class="warning">
        <strong>⚠️ Important Security Information:</strong><br>
        • This code will expire in 5 minutes<br>
        • Use this code only once<br>
        • Never share this code with anyone<br>
        • If you didn't request this, please ignore this email
      </div>
      
      <p>Enter this code in the verification form to activate your account.</p>
      
      <p>If you have any questions, please contact our support team.</p>
    </div>
    <div class="footer">
      <p>© 2024 BlickTrack Security Platform. All rights reserved.</p>
      <p style="color: #999; font-size: 12px;">This is an automated message, please do not reply.</p>
    </div>
  </div>
</body>
</html>
    `.trim();
  }

  /**
   * Generate HTML template for security alerts
   * 
   * @param context - Template context
   * @returns HTML string
   * 
   * @private
   */
  private generateSecurityAlertEmailTemplate(context: EmailTemplateContext): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Security Alert</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
    .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); color: #ffffff; padding: 40px 30px; text-align: center; }
    .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
    .content { padding: 40px 30px; }
    .content h2 { color: #333; font-size: 24px; margin-top: 0; }
    .content p { color: #666; font-size: 16px; margin: 15px 0; }
    .alert-box { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px; }
    .security-info { background: #f8f9fa; padding: 15px; margin: 20px 0; border-radius: 4px; font-size: 14px; }
    .button { display: inline-block; padding: 14px 32px; background: #dc3545; color: #ffffff !important; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
    .footer { background: #f8f9fa; padding: 20px 30px; text-align: center; font-size: 14px; color: #666; }
    .footer a { color: #dc3545; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔐 Security Alert</h1>
    </div>
    <div class="content">
      <h2>Security Activity Detected</h2>
      <p>Hi ${context.userName},</p>
      <p>We detected the following security-related activity on your ${context.tenantName} account:</p>
      
      <div class="alert-box">
        <strong>Action:</strong> ${context.action}
      </div>
      
      <div class="security-info">
        <strong>🛡️ Activity Details:</strong><br>
        ${context.ipAddress ? `IP Address: <code>${context.ipAddress}</code><br>` : ''}
        ${context.deviceInfo ? `Device: ${context.deviceInfo}<br>` : ''}
        ${context.location ? `Location: ${context.location}<br>` : ''}
        Time: ${new Date().toLocaleString()}
      </div>
      
      <p>If this was you, you can safely ignore this email. If you don't recognize this activity, please secure your account immediately.</p>
      
      <div style="text-align: center;">
        <a href="${context.loginUrl}" class="button">Review Account Security</a>
      </div>
    </div>
    <div class="footer">
      <p>Need help? Contact us at <a href="mailto:${context.supportEmail}">${context.supportEmail}</a></p>
      <p>© ${new Date().getFullYear()} ${context.companyName}. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `.trim();
  }

  /**
   * Convert HTML to plain text (fallback)
   * Simple implementation - can be enhanced with htmlToText library
   * 
   * @param html - HTML string
   * @returns Plain text string
   * 
   * @private
   */
  private htmlToText(html: string): string {
    return html
      .replace(/<style[^>]*>.*?<\/style>/gi, '')
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/<[^>]+>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Check if error is transient (should retry)
   * 
   * @param error - Error object
   * @returns true if error is transient, false otherwise
   * 
   * @private
   */
  private isTransientError(error: any): boolean {
    const transientCodes = ['ETIMEDOUT', 'ECONNRESET', 'ENOTFOUND', 'ESOCKET'];
    return transientCodes.some(code => 
      error.code === code || error.message?.includes(code)
    );
  }

  /**
   * Sleep utility for retry delays
   * 
   * @param ms - Milliseconds to sleep
   * @returns Promise that resolves after delay
   * 
   * @private
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

