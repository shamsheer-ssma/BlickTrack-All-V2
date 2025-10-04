import { ConfigService } from '@nestjs/config';
export interface EmailOptions {
    to: string;
    subject: string;
    html?: string;
    text?: string;
    from?: string;
    replyTo?: string;
    cc?: string[];
    bcc?: string[];
    attachments?: Array<{
        filename: string;
        content?: Buffer | string;
        path?: string;
    }>;
}
export interface EmailTemplateContext {
    userName?: string;
    userEmail?: string;
    verificationLink?: string;
    resetLink?: string;
    expirationTime?: string;
    tenantName?: string;
    tenantLogo?: string;
    companyName?: string;
    supportEmail?: string;
    loginUrl?: string;
    dashboardUrl?: string;
    ipAddress?: string;
    deviceInfo?: string;
    location?: string;
    action?: string;
    otpCode?: string;
    additionalInfo?: Record<string, any>;
}
export interface EmailResult {
    success: boolean;
    messageId?: string;
    error?: string;
}
export declare class EmailService {
    private configService;
    private transporter;
    private readonly logger;
    private readonly isEmailEnabled;
    private readonly maxRetries;
    private readonly retryDelay;
    constructor(configService: ConfigService);
    private checkEmailConfiguration;
    private initializeTransporter;
    private verifyConnection;
    sendEmail(options: EmailOptions, retryCount?: number): Promise<EmailResult>;
    sendVerificationEmail(email: string, userName: string, token: string, tenantName?: string, tenantLogo?: string): Promise<EmailResult>;
    sendPasswordResetEmail(email: string, userName: string, token: string, tenantName?: string, ipAddress?: string): Promise<EmailResult>;
    sendPasswordResetOtpEmail(email: string, userName: string, otp: string, tenantName?: string): Promise<EmailResult>;
    sendWelcomeEmail(email: string, userName: string, tenantName?: string): Promise<EmailResult>;
    sendOtpEmail(email: string, userName: string, otp: string, tenantName?: string): Promise<EmailResult>;
    sendSecurityAlertEmail(email: string, userName: string, action: string, ipAddress?: string, deviceInfo?: string, location?: string, tenantName?: string): Promise<EmailResult>;
    private generateVerificationEmailTemplate;
    private generatePasswordResetEmailTemplate;
    private generatePasswordResetOtpEmailTemplate;
    private generateWelcomeEmailTemplate;
    private generateOtpEmailTemplate;
    private generateSecurityAlertEmailTemplate;
    private htmlToText;
    private isTransientError;
    private sleep;
}
