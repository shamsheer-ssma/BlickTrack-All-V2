"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer = __importStar(require("nodemailer"));
const logger_service_1 = require("./logger.service");
let EmailService = class EmailService {
    configService;
    transporter = null;
    logger;
    isEmailEnabled;
    maxRetries = 3;
    retryDelay = 1000;
    constructor(configService) {
        this.configService = configService;
        this.logger = new logger_service_1.LoggerService(configService);
        this.logger.setContext('EmailService');
        this.isEmailEnabled = this.checkEmailConfiguration();
        if (this.isEmailEnabled) {
            this.initializeTransporter();
        }
        else {
            this.logger.warn('Email service not configured - emails will not be sent');
        }
    }
    checkEmailConfiguration() {
        const requiredVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASSWORD'];
        const missing = requiredVars.filter(varName => !this.configService.get(varName));
        if (missing.length > 0) {
            this.logger.warn('Missing email configuration', { missing });
            return false;
        }
        return true;
    }
    initializeTransporter() {
        try {
            const host = this.configService.get('SMTP_HOST');
            const port = this.configService.get('SMTP_PORT', 587);
            const secure = this.configService.get('SMTP_SECURE', false);
            const user = this.configService.get('SMTP_USER');
            const pass = this.configService.get('SMTP_PASSWORD');
            this.logger.debug('Initializing email transporter', {
                host,
                port,
                secure,
                user,
            });
            this.transporter = nodemailer.createTransport({
                host,
                port,
                secure,
                auth: {
                    user,
                    pass,
                },
                pool: true,
                maxConnections: 5,
                maxMessages: 100,
                rateDelta: 1000,
                rateLimit: 10,
                connectionTimeout: 10000,
                greetingTimeout: 10000,
                socketTimeout: 20000,
                tls: {
                    rejectUnauthorized: true,
                    minVersion: 'TLSv1.2',
                },
            });
            this.verifyConnection();
            this.logger.info('Email transporter initialized successfully');
        }
        catch (error) {
            this.logger.error('Failed to initialize email transporter', error);
            this.transporter = null;
        }
    }
    async verifyConnection() {
        if (!this.transporter) {
            return;
        }
        try {
            await this.transporter.verify();
            this.logger.info('SMTP connection verified successfully');
        }
        catch (error) {
            this.logger.error('SMTP connection verification failed', error);
        }
    }
    async sendEmail(options, retryCount = 0) {
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
            const fromEmail = this.configService.get('SMTP_FROM_EMAIL');
            const fromName = this.configService.get('SMTP_FROM_NAME', 'BlickTrack');
            const mailOptions = {
                from: options.from || `"${fromName}" <${fromEmail}>`,
                to: options.to,
                subject: options.subject,
                html: options.html,
                text: options.text || this.htmlToText(options.html || ''),
                replyTo: options.replyTo,
                cc: options.cc,
                bcc: options.bcc,
                attachments: options.attachments,
            };
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
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            this.logger.error('Failed to send email', error, {
                to: options.to,
                subject: options.subject,
                retryCount,
            });
            if (retryCount < this.maxRetries && this.isTransientError(error)) {
                this.logger.warn('Retrying email send', {
                    to: options.to,
                    retryCount: retryCount + 1,
                    delay: this.retryDelay,
                });
                await this.sleep(this.retryDelay * (retryCount + 1));
                return this.sendEmail(options, retryCount + 1);
            }
            return {
                success: false,
                error: errorMessage,
            };
        }
    }
    async sendVerificationEmail(email, userName, token, tenantName, tenantLogo) {
        this.logger.debug('Sending verification email', { email, userName, tenantName });
        const frontendUrl = this.configService.get('FRONTEND_URL', 'http://localhost:3000');
        const verificationLink = `${frontendUrl}/verify-email?token=${token}`;
        const expirationHours = this.configService.get('EMAIL_VERIFICATION_TOKEN_EXPIRATION', 24);
        const context = {
            userName,
            userEmail: email,
            verificationLink,
            expirationTime: `${expirationHours} hours`,
            tenantName: tenantName || 'BlickTrack',
            tenantLogo,
            companyName: tenantName || 'BlickTrack Security Platform',
            supportEmail: this.configService.get('SMTP_FROM_EMAIL'),
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
    async sendPasswordResetEmail(email, userName, token, tenantName, ipAddress) {
        this.logger.debug('Sending password reset email', { email, userName, ipAddress });
        const frontendUrl = this.configService.get('FRONTEND_URL', 'http://localhost:3000');
        const resetLink = `${frontendUrl}/reset-password?token=${token}`;
        const expirationMinutes = this.configService.get('PASSWORD_RESET_TOKEN_EXPIRATION', 60);
        const context = {
            userName,
            userEmail: email,
            resetLink,
            expirationTime: `${expirationMinutes} minutes`,
            tenantName: tenantName || 'BlickTrack',
            companyName: tenantName || 'BlickTrack Security Platform',
            supportEmail: this.configService.get('SMTP_FROM_EMAIL'),
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
    async sendWelcomeEmail(email, userName, tenantName) {
        this.logger.debug('Sending welcome email', { email, userName, tenantName });
        const frontendUrl = this.configService.get('FRONTEND_URL', 'http://localhost:3000');
        const context = {
            userName,
            userEmail: email,
            tenantName: tenantName || 'BlickTrack',
            companyName: tenantName || 'BlickTrack Security Platform',
            supportEmail: this.configService.get('SMTP_FROM_EMAIL'),
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
    async sendSecurityAlertEmail(email, userName, action, ipAddress, deviceInfo, location, tenantName) {
        this.logger.debug('Sending security alert email', { email, action, ipAddress });
        const frontendUrl = this.configService.get('FRONTEND_URL', 'http://localhost:3000');
        const context = {
            userName,
            userEmail: email,
            action,
            ipAddress,
            deviceInfo,
            location,
            tenantName: tenantName || 'BlickTrack',
            companyName: tenantName || 'BlickTrack Security Platform',
            supportEmail: this.configService.get('SMTP_FROM_EMAIL'),
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
    generateVerificationEmailTemplate(context) {
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
    generatePasswordResetEmailTemplate(context) {
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
    generateWelcomeEmailTemplate(context) {
        return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome!</title>
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
    .features { margin: 30px 0; }
    .feature-item { margin: 15px 0; padding-left: 30px; position: relative; }
    .feature-item:before { content: '✓'; position: absolute; left: 0; color: #667eea; font-weight: bold; font-size: 20px; }
    .footer { background: #f8f9fa; padding: 20px 30px; text-align: center; font-size: 14px; color: #666; }
    .footer a { color: #667eea; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Welcome to ${context.tenantName}!</h1>
    </div>
    <div class="content">
      <h2>Hi ${context.userName},</h2>
      <p>We're thrilled to have you on board! Your account has been successfully created and you're all set to start using ${context.companyName}.</p>
      
      <div style="text-align: center;">
        <a href="${context.dashboardUrl}" class="button">Go to Dashboard</a>
      </div>
      
      <div class="features">
        <h3 style="color: #333;">What you can do now:</h3>
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
      <p>© ${new Date().getFullYear()} ${context.companyName}. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `.trim();
    }
    generateSecurityAlertEmailTemplate(context) {
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
    htmlToText(html) {
        return html
            .replace(/<style[^>]*>.*?<\/style>/gi, '')
            .replace(/<script[^>]*>.*?<\/script>/gi, '')
            .replace(/<[^>]+>/g, '')
            .replace(/\s+/g, ' ')
            .trim();
    }
    isTransientError(error) {
        const transientCodes = ['ETIMEDOUT', 'ECONNRESET', 'ENOTFOUND', 'ESOCKET'];
        return transientCodes.some(code => error.code === code || error.message?.includes(code));
    }
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EmailService);
//# sourceMappingURL=email.service.js.map