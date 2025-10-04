/**
 * File: auth.service.ts
 * Purpose: Authentication service for the BlickTrack backend API. Handles user registration, login, password management, JWT token generation, and user authentication. Provides comprehensive authentication and authorization functionality for the enterprise platform.
 * 
 * Key Functions / Components / Classes:
 *   - AuthService: Main authentication service class
 *   - register: User registration with validation and hashing
 *   - login: User authentication and JWT token generation
 *   - validateUser: User credential validation
 *   - generateTokens: JWT token generation and refresh
 *   - forgotPassword: Password reset request handling
 *   - resetPassword: Password reset with token validation
 *   - changePassword: Authenticated password change
 *   - verifyEmail: Email verification handling
 *
 * Inputs:
 *   - User registration data (email, password, name)
 *   - Login credentials (email, password)
 *   - Password reset requests and tokens
 *   - Email verification tokens
 *   - Password change requests
 *
 * Outputs:
 *   - JWT access and refresh tokens
 *   - User authentication responses
 *   - Password reset emails and tokens
 *   - Email verification confirmations
 *   - Authentication status and user data
 *
 * Dependencies:
 *   - JWT service for token management
 *   - Prisma service for database operations
 *   - Bcrypt for password hashing
 *   - Crypto for secure token generation
 *   - Email service for notifications
 *
 * Notes:
 *   - Implements secure password hashing with bcrypt
 *   - Generates JWT tokens with configurable expiration
 *   - Handles password reset with secure token generation
 *   - Includes email verification functionality
 *   - Provides comprehensive error handling and validation
 */

import { 
  Injectable, 
  UnauthorizedException, 
  ConflictException,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { 
  RegisterDto, 
  LoginDto, 
  ForgotPasswordDto, 
  ResetPasswordDto,
  ChangePasswordDto,
  VerifyEmailDto 
} from './dto/auth.dto';
import * as bcrypt from 'bcryptjs';
import { UserRole, TokenType } from '@prisma/client';
import { randomBytes, createHash } from 'crypto';
import { HashingService } from '../common/services/hashing.service';
import { LoggerService } from '../common/services/logger.service';
import { EmailService } from '../common/services/email.service';

/**
 * Interface for authentication response returned to the client
 * Includes both access and refresh tokens for secure authentication
 */
export interface AuthResponse {
  access_token: string;      // Short-lived JWT token for API access (default: 7 days)
  refresh_token: string;     // Long-lived token for refreshing access tokens (default: 30 days)
  user: {
    id: string;
    email: string;
    name: string | null;
    role: UserRole;
    tenantId: string | null;
    isVerified: boolean;
    mfaEnabled: boolean;
  };
}

/**
 * Interface for JWT payload structure
 * Contains user identity and authorization information
 */
export interface JwtPayload {
  sub: string;          // User ID (subject)
  email: string;        // User email
  role: string;         // User role
  tenantId: string;     // Tenant ID for multi-tenant support
  type: 'access' | 'refresh';  // Token type for validation
}

@Injectable()
export class AuthService {
  private readonly logger: LoggerService;

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private hashingService: HashingService,
    private emailService: EmailService, // Inject email service (globally available)
  ) {
    // Initialize logger with context for this service
    this.logger = new LoggerService(configService);
    this.logger.setContext('AuthService');
    this.logger.debug('AuthService initialized with email support');
  }

  /**
   * Register a new user in the system
   * 
   * @param registerDto - User registration data (email, password, name, tenantSlug)
   * @returns Success message and user ID
   * @throws ConflictException if user already exists
   * @throws BadRequestException if password is weak
   * @throws NotFoundException if tenant not found
   * 
   * Process:
   * 1. Check if user already exists
   * 2. Validate password strength
   * 3. Hash password with bcrypt
   * 4. Find and validate tenant
   * 5. Create user in database
   * 6. Generate email verification token
   * 7. Send verification email (TODO)
   */
  async register(registerDto: RegisterDto): Promise<{ message: string; userId: string }> {
    const { email, password, name, tenantSlug } = registerDto;

    this.logger.debug('User registration attempt', { email, tenantSlug });

    // Check if user already exists and is verified
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      if (existingUser.isEmailVerified) {
        this.logger.warn('Registration failed - verified user already exists', { email });
        throw new ConflictException('User with this email already exists');
      } else {
        // User exists but is not verified - allow re-registration by deleting the old record
        this.logger.info('Deleting unverified user for re-registration', { email, userId: existingUser.id });
        await this.prisma.user.delete({
          where: { id: existingUser.id },
        });
        this.logger.info('Unverified user deleted successfully', { email });
      }
    }

    // Validate password strength (basic validation)
    if (!this.isPasswordStrong(password)) {
      this.logger.warn('Registration failed - weak password', { email });
      throw new BadRequestException(
        'Password must contain at least 8 characters, including uppercase, lowercase, numbers, and special characters'
      );
    }

    // Hash password
    const saltRounds = parseInt(this.configService.get<string>('BCRYPT_ROUNDS') || '12', 10);
    this.logger.debug('Hashing password', { saltRounds });
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Find tenant based on email domain or provided tenantSlug
    let tenantId: string;
    if (tenantSlug) {
      this.logger.debug('Looking up tenant by slug', { tenantSlug });
      const tenant = await this.prisma.tenant.findUnique({
        where: { slug: tenantSlug, isActive: true },
      });
      
      if (!tenant) {
        this.logger.warn('Registration failed - tenant not found', { tenantSlug });
        throw new NotFoundException('Tenant not found');
      }
      
      tenantId = tenant.id;
      this.logger.debug('Tenant found by slug', { tenantId: tenant.id, tenantName: tenant.name });
    } else {
      // Determine tenant based on email domain
      const emailDomain = email.split('@')[1]?.toLowerCase();
      this.logger.debug('Determining tenant by email domain', { email, emailDomain });
      
      let tenantSlugToUse: string;
      
      // Map email domains to tenant slugs
      switch (emailDomain) {
        case 'gmail.com':
          tenantSlugToUse = 'gmail';
          break;
        case 'outlook.com':
        case 'hotmail.com':
        case 'live.com':
          tenantSlugToUse = 'microsoft';
          break;
        case 'yahoo.com':
          tenantSlugToUse = 'yahoo';
          break;
        case 'apple.com':
          tenantSlugToUse = 'apple';
          break;
        case 'amazon.com':
          tenantSlugToUse = 'amazon';
          break;
        case 'google.com':
          tenantSlugToUse = 'google';
          break;
        default:
          // Use default BlickTrack tenant for unknown domains
          tenantSlugToUse = 'blicktrack';
          break;
      }
      
      this.logger.debug('Using tenant based on email domain', { emailDomain, tenantSlug: tenantSlugToUse });
      
      const tenant = await this.prisma.tenant.findFirst({
        where: { slug: tenantSlugToUse, isActive: true },
      });
      
      if (!tenant) {
        // Fallback to BlickTrack tenant if domain-specific tenant doesn't exist
        this.logger.warn('Domain-specific tenant not found, using BlickTrack', { tenantSlug: tenantSlugToUse });
        const defaultTenant = await this.prisma.tenant.findFirst({
          where: { slug: 'blicktrack', isActive: true },
        });
        
        if (!defaultTenant) {
          this.logger.error('Default BlickTrack tenant not found');
          throw new InternalServerErrorException('System configuration error');
        }
        
        tenantId = defaultTenant.id;
        this.logger.debug('Using BlickTrack fallback tenant', { tenantId: tenantId, tenantName: defaultTenant.name });
      } else {
        tenantId = tenant.id;
        this.logger.debug('Using domain-specific tenant', { tenantId: tenant.id, tenantName: tenant.name, tenantSlug: tenantSlugToUse });
      }
    }

    // Create user
    this.logger.debug('Creating user in database', { email, tenantId });
    const user = await this.prisma.user.create({
      data: {
        email,
        firstName: name?.split(' ')[0] || 'User',
        lastName: name?.split(' ')[1] || '',
        passwordHash: hashedPassword,
        tenantId: tenantId!,
        role: UserRole.END_USER,
        isVerified: false,
      },
    });

    this.logger.info('User registered successfully', { userId: user.id, email: user.email });

    // Get tenant information for multi-tenant email branding
    const tenant = tenantId ? await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { name: true },
    }) : null;

    // Send OTP email for verification
    this.logger.debug('Sending OTP email', { userId: user.id, email, tenantName: tenant?.name });
    
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Store OTP in database
    await this.prisma.verificationToken.create({
      data: {
        token: otp,
        type: TokenType.EMAIL_VERIFICATION,
        userId: user.id,
        expires: expiresAt,
        used: false,
      },
    });

    const emailResult = await this.emailService.sendOtpEmail(
      email,
      name || 'User',
      otp,
      tenant?.name,
    );

    if (emailResult.success) {
      this.logger.info('OTP email sent successfully', {
        userId: user.id,
        email,
        messageId: emailResult.messageId,
      });
    } else {
      this.logger.error('Failed to send OTP email', undefined, {
        userId: user.id,
        email,
        error: emailResult.error,
      });
      // Don't fail registration if email fails - user can request resend
    }

    return {
      message: 'User registered successfully. Please check your email for the verification code.',
      userId: user.id,
    };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        passwordHash: true,
        role: true,
        isActive: true,
        isEmailVerified: true,
        tenantId: true,
      },
    });

    if (!user) {
      return null;
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account has been deactivated');
    }

    if (!user.isEmailVerified) {
      throw new UnauthorizedException('Email not verified');
    }

    if (!user.passwordHash) {
      return null;
    }

    const isPasswordValid = await this.hashingService.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return null;
    }

    // Return user without password
    const { passwordHash: _, ...result } = user;
    return result;
  }

  /**
   * Authenticate user and generate JWT tokens
   * 
   * @param loginDto - Login credentials (email, password)
   * @param ipAddress - Client IP address for audit logging
   * @param userAgent - Client user agent for audit logging
   * @returns Authentication response with access token, refresh token, and user data
   * @throws UnauthorizedException if credentials are invalid or account is locked
   * 
   * Process:
   * 1. Find user by email
   * 2. Validate account status (active, not locked)
   * 3. Verify password using bcrypt
   * 4. Reset failed login attempts on success
   * 5. Generate access and refresh tokens
   * 6. Store refresh token in database
   * 7. Create audit log entry
   * 8. Return tokens and user data
   */
  async login(loginDto: LoginDto, ipAddress?: string, userAgent?: string): Promise<AuthResponse> {
    const { email, password } = loginDto;

    this.logger.debug('Login attempt started', { email, ipAddress });

    // Find user with all necessary data
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        passwordHash: true,
        userType: true,
        isActive: true,
        isEmailVerified: true,
        tenantId: true,
        status: true,
        lockedUntil: true,
        failedLoginAttempts: true,
        lastLoginAt: true,
        tenant: {
          select: {
            id: true,
            name: true,
            domain: true,
            status: true
          }
        }
      },
    });

    // Check if user exists
    if (!user) {
      this.logger.warn('Login failed - user not found', { email });
      throw new UnauthorizedException('Invalid credentials');
    }

    this.logger.debug('User found, validating account status', { userId: user.id, status: user.status });

    // Check if user is active
    if (!user.isActive) {
      this.logger.warn('Login failed - account deactivated', { userId: user.id, email });
      throw new UnauthorizedException('Account is deactivated');
    }

    // Check if account is locked due to failed login attempts
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const lockTimeRemaining = Math.ceil((user.lockedUntil.getTime() - Date.now()) / (1000 * 60));
      this.logger.warn('Login failed - account locked', { 
        userId: user.id, 
        email, 
        lockTimeRemaining: `${lockTimeRemaining} minutes` 
      });
      throw new UnauthorizedException(`Account is locked for ${lockTimeRemaining} more minutes`);
    }

    this.logger.debug('Account validation passed, checking password', { userId: user.id });

    // Validate password using passwordHash and hashingService
    const passwordToCheck = user.passwordHash;
    if (!passwordToCheck) {
      this.logger.error('Login failed - no password hash in database', undefined, { userId: user.id, email });
      await this.handleFailedLogin(user.id);
      throw new UnauthorizedException('Invalid credentials');
    }

    // Compare provided password with stored hash
    const isPasswordValid = await this.hashingService.compare(password, passwordToCheck);
    this.logger.debug('Password validation completed', { userId: user.id, isValid: isPasswordValid });
    
    if (!isPasswordValid) {
      this.logger.warn('Login failed - invalid password', { userId: user.id, email });
      // Increment failed login attempts
      await this.handleFailedLogin(user.id);
      throw new UnauthorizedException('Invalid credentials');
    }

    this.logger.info('Password validation successful', { userId: user.id, email });

    // Reset failed login attempts on successful login
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        lastLoginAt: new Date(),
        failedLoginAttempts: 0,  // Reset failed attempts counter
        lockedUntil: null,        // Clear any lock
      },
    });

    this.logger.debug('Failed login attempts reset', { userId: user.id });

    // Map user role for JWT token
    const mappedRole = user.userType === 'ADMIN' ? 
      (user.email === 'admin@blicktrack.com' ? UserRole.SUPER_ADMIN : UserRole.TENANT_ADMIN) : 
      UserRole.END_USER;
    
    this.logger.debug('🔍 [AUTH DEBUG] JWT role mapping', {
      email: user.email,
      userType: user.userType,
      mappedRole: mappedRole,
      isAdmin: user.userType === 'ADMIN',
      isBlickTrackAdmin: user.email === 'admin@blicktrack.com'
    });

    // Generate access and refresh tokens
    const tokens = await this.generateTokens(user.id, user.email, mappedRole, user.tenantId);
    this.logger.debug('Tokens generated successfully', { userId: user.id });

    // Store refresh token in database for validation and revocation
    await this.storeRefreshToken(user.id, tokens.refresh_token, ipAddress, userAgent);
    this.logger.debug('Refresh token stored in database', { userId: user.id });

    // Log successful login for audit trail
    await this.prisma.auditLog.create({
      data: {
        eventType: 'AUTHENTICATION',
        userId: user.id,
        tenantId: user.tenantId,
        action: 'LOGIN',
        ipAddress,
        userAgent,
        success: true,
      },
    });

    this.logger.info('Login successful', { 
      userId: user.id, 
      email: user.email,
      tenantId: user.tenantId 
    });

    return {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      user: {
        id: user.id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        role: (() => {
          const mappedRole = user.userType === 'ADMIN' ? 
            (user.email === 'admin@blicktrack.com' ? UserRole.SUPER_ADMIN : UserRole.TENANT_ADMIN) : 
            UserRole.END_USER;
          this.logger.debug('🔍 [AUTH DEBUG] Role mapping', {
            email: user.email,
            userType: user.userType,
            mappedRole: mappedRole,
            isAdmin: user.userType === 'ADMIN',
            isBlickTrackAdmin: user.email === 'admin@blicktrack.com'
          });
          return mappedRole;
        })(),
        tenantId: user.tenantId,
        isVerified: user.isEmailVerified,
        mfaEnabled: false, // Default to false for now (will be implemented in MFA feature)
      },
    };
  }

  /**
   * Request password reset for user
   * Sends OTP via email for password reset
   * 
   * @param forgotPasswordDto - Contains user's email
   * @returns Generic success message (doesn't reveal if user exists)
   * 
   * Security:
   * - Doesn't reveal if email exists in system
   * - Generates secure 6-digit OTP
   * - OTP expires in 5 minutes
   * - Includes IP address in email for security
   * 
   * Multi-tenant:
   * - Uses tenant-specific email branding
   */
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{ message: string }> {
    const { email } = forgotPasswordDto;

    this.logger.debug('Password reset OTP requested', { email });

    // Find user with tenant information
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        tenant: {
          select: { name: true },
        },
      },
    });

    if (!user) {
      this.logger.warn('Password reset OTP requested for non-existent email', { email });
      // Don't reveal if user exists or not - return success anyway
      return { message: 'If the email exists, a password reset code has been sent.' };
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    this.logger.debug('Password reset OTP generated', { userId: user.id, otpLength: otp.length });

    // Store OTP in database
    await this.prisma.verificationToken.create({
      data: {
        token: otp,
        type: TokenType.PASSWORD_RESET,
        userId: user.id,
        expires: expiresAt,
        used: false,
      },
    });

    // Send password reset OTP email with multi-tenant branding
    const emailResult = await this.emailService.sendPasswordResetOtpEmail(
      email,
      `${user.firstName} ${user.lastName}`,
      otp,
      user.tenant?.name,
    );

    if (emailResult.success) {
      this.logger.info('Password reset OTP email sent successfully', {
        userId: user.id,
        email,
        messageId: emailResult.messageId,
      });
    } else {
      this.logger.error('Failed to send password reset OTP email', undefined, {
        userId: user.id,
        email,
        error: emailResult.error,
      });
      // Don't reveal email failure to prevent enumeration
    }

    return { message: 'If the email exists, a password reset code has been sent.' };
  }

  /**
   * Reset user password using valid OTP
   * 
   * @param resetPasswordDto - Contains OTP and new password
   * @returns Success message
   * @throws BadRequestException if OTP is invalid or expired
   * 
   * Process:
   * 1. Validate OTP exists and not used
   * 2. Check OTP expiration
   * 3. Validate new password strength
   * 4. Hash new password
   * 5. Update user password
   * 6. Mark OTP as used
   * 7. Send security alert email
   * 8. Create audit log
   */
  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
    const { token: otp, newPassword } = resetPasswordDto;

    this.logger.debug('Password reset attempt', { otpProvided: !!otp });

    // Find valid reset OTP
    const resetToken = await this.prisma.verificationToken.findFirst({
      where: {
        token: otp,
        type: TokenType.PASSWORD_RESET,
        used: false,
      },
      include: {
        user: {
          include: {
            tenant: {
              select: { name: true },
            },
          },
        },
      },
    });

    if (!resetToken) {
      this.logger.warn('Password reset failed - invalid or used OTP', { otpLength: otp?.length });
      throw new BadRequestException('Invalid or expired reset code');
    }

    // Check if OTP is expired
    if (resetToken.expires < new Date()) {
      this.logger.warn('Password reset failed - expired OTP', {
        userId: resetToken.userId,
        expiredAt: resetToken.expires,
      });
      throw new BadRequestException('Reset code has expired. Please request a new one.');
    }

    // Validate new password strength
    if (!this.isPasswordStrong(newPassword)) {
      this.logger.warn('Password reset failed - weak password', { userId: resetToken.userId });
      throw new BadRequestException(
        'Password must contain at least 8 characters, including uppercase, lowercase, numbers, and special characters'
      );
    }

    this.logger.debug('Password reset token validated', { userId: resetToken.userId });

    // Hash new password
    const hashedPassword = await this.hashingService.hash(newPassword);

    // Update user password
    await this.prisma.user.update({
      where: { id: resetToken.userId! },
      data: {
        passwordHash: hashedPassword,
        passwordChangedAt: new Date(),
      },
    });

    // Mark token as used
    await this.prisma.verificationToken.update({
      where: { id: resetToken.id },
      data: {
        used: true,
        usedAt: new Date(),
      },
    });

    this.logger.info('Password reset successful', {
      userId: resetToken.userId,
      email: resetToken.user?.email,
    });

    // Send security alert email
    if (resetToken.user) {
      const emailResult = await this.emailService.sendSecurityAlertEmail(
        resetToken.user.email,
        `${resetToken.user.firstName} ${resetToken.user.lastName}`,
        'Password Changed',
        undefined, // IP address - would come from request context
        undefined, // Device info
        undefined, // Location
        resetToken.user.tenant?.name,
      );

      if (emailResult.success) {
        this.logger.debug('Security alert email sent', { userId: resetToken.userId });
      }
    }

    // Create audit log
    await this.prisma.auditLog.create({
      data: {
        eventType: 'SECURITY_EVENT',
        action: 'PASSWORD_RESET',
        userId: resetToken.userId,
        tenantId: resetToken.user?.tenantId || '',
        success: true,
      },
    });

    return { message: 'Password reset successful. You can now log in with your new password.' };
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<{ message: string }> {
    const { currentPassword, newPassword } = changePasswordDto;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.passwordHash) {
      throw new NotFoundException('User not found');
    }

    // Validate current password
    const isCurrentPasswordValid = await this.hashingService.compare(currentPassword, user.passwordHash);
    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Validate new password
    if (!this.isPasswordStrong(newPassword)) {
      throw new BadRequestException(
        'Password must contain at least 8 characters, including uppercase, lowercase, numbers, and special characters'
      );
    }

    // Hash new password
    const hashedPassword = await this.hashingService.hash(newPassword);

    // Update password
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash: hashedPassword,
      },
    });

    return { message: 'Password changed successfully' };
  }

  /**
   * Verify user email address using verification token
   * 
   * @param verifyEmailDto - Contains verification token
   * @returns Success message
   * @throws BadRequestException if token is invalid or expired
   * 
   * Process:
   * 1. Find valid verification token
   * 2. Check token expiration
   * 3. Update user email verification status
   * 4. Mark token as used
   * 5. Send welcome email
   * 6. Create audit log
   */
  async verifyEmail(verifyEmailDto: VerifyEmailDto): Promise<{ message: string }> {
    const { token } = verifyEmailDto;

    this.logger.debug('Email verification attempt', { tokenProvided: !!token });

    // Find valid verification token
    const verificationToken = await this.prisma.verificationToken.findFirst({
      where: {
        token,
        type: TokenType.EMAIL_VERIFICATION,
        used: false,
      },
      include: {
        user: {
          include: {
            tenant: {
              select: { name: true },
            },
          },
        },
      },
    });

    if (!verificationToken) {
      this.logger.warn('Email verification failed - invalid or used token', {
        token: token.substring(0, 10),
      });
      throw new BadRequestException('Invalid or expired verification token');
    }

    // Check if token is expired
    if (verificationToken.expires < new Date()) {
      this.logger.warn('Email verification failed - expired token', {
        userId: verificationToken.userId,
        expiredAt: verificationToken.expires,
      });
      throw new BadRequestException('Verification token has expired. Please request a new one.');
    }

    this.logger.debug('Email verification token validated', { userId: verificationToken.userId });

    // Update user email verification status
    await this.prisma.user.update({
      where: { id: verificationToken.userId! },
      data: {
        isEmailVerified: true,
        isVerified: true,
      },
    });

    // Mark token as used
    await this.prisma.verificationToken.update({
      where: { id: verificationToken.id },
      data: {
        used: true,
        usedAt: new Date(),
      },
    });

    this.logger.info('Email verified successfully', {
      userId: verificationToken.userId,
      email: verificationToken.user?.email,
    });

    // Send welcome email
    if (verificationToken.user) {
      const emailResult = await this.emailService.sendWelcomeEmail(
        verificationToken.user.email,
        `${verificationToken.user.firstName} ${verificationToken.user.lastName}`,
        verificationToken.user.tenant?.name,
      );

      if (emailResult.success) {
        this.logger.debug('Welcome email sent', { userId: verificationToken.userId });
      }
    }

    // Create audit log
    await this.prisma.auditLog.create({
      data: {
        eventType: 'AUTHENTICATION',
        action: 'EMAIL_VERIFIED',
        userId: verificationToken.userId,
        tenantId: verificationToken.user?.tenantId || '',
        success: true,
      },
    });

    return { message: 'Email verified successfully. You can now log in.' };
  }

  /**
   * Send OTP to user's email for verification
   * 
   * @param email - User's email address
   * @returns Success message
   * @throws NotFoundException if user not found
   * @throws BadRequestException if email already verified
   * 
   * Process:
   * 1. Find user by email
   * 2. Check if email already verified
   * 3. Generate 6-digit OTP
   * 4. Store OTP in database with expiration
   * 5. Send OTP via email
   * 6. Create audit log
   */
  async sendOtp(email: string): Promise<{ message: string }> {
    this.logger.debug('OTP send request', { email });

    // Find user by email
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        tenant: {
          select: { name: true },
        },
      },
    });

    if (!user) {
      this.logger.warn('OTP send failed - user not found', { email });
      throw new NotFoundException('User not found');
    }

    // Check if email already verified
    if (user.isEmailVerified) {
      this.logger.warn('OTP send failed - email already verified', { userId: user.id });
      throw new BadRequestException('Email is already verified');
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    this.logger.debug('OTP generated', { userId: user.id, otpLength: otp.length });

    // Store OTP in database
    await this.prisma.verificationToken.create({
      data: {
        token: otp,
        type: TokenType.EMAIL_VERIFICATION,
        userId: user.id,
        expires: expiresAt,
        used: false,
      },
    });

    // Send OTP via email
    const emailResult = await this.emailService.sendOtpEmail(
      user.email,
      `${user.firstName} ${user.lastName}`,
      otp,
      user.tenant?.name,
    );

    if (!emailResult.success) {
      this.logger.error('Failed to send OTP email', undefined, { 
        userId: user.id, 
        error: emailResult.error || 'Unknown error' 
      });
      throw new InternalServerErrorException('Failed to send OTP email');
    }

    // Create audit log
    await this.prisma.auditLog.create({
      data: {
        eventType: 'AUTHENTICATION',
        action: 'OTP_SENT',
        userId: user.id,
        tenantId: user.tenantId,
        success: true,
      },
    });

    this.logger.info('OTP sent successfully', { userId: user.id, email: user.email });

    return { message: 'OTP sent to your email address' };
  }

  /**
   * Verify OTP code
   * 
   * @param email - User's email address
   * @param otp - 6-digit OTP code
   * @returns Success message
   * @throws BadRequestException if OTP is invalid or expired
   * 
   * Process:
   * 1. Find valid OTP token
   * 2. Check OTP expiration
   * 3. Update user email verification status
   * 4. Mark OTP as used
   * 5. Send welcome email
   * 6. Create audit log
   */
  async verifyOtp(email: string, otp: string): Promise<{ message: string }> {
    this.logger.debug('OTP verification attempt', { email, otpLength: otp.length });

    // Find valid OTP token
    const verificationToken = await this.prisma.verificationToken.findFirst({
      where: {
        token: otp,
        type: TokenType.EMAIL_VERIFICATION,
        used: false,
        user: {
          email: email.toLowerCase(),
        },
      },
      include: {
        user: {
          include: {
            tenant: {
              select: { name: true },
            },
          },
        },
      },
    });

    if (!verificationToken) {
      this.logger.warn('OTP verification failed - invalid OTP', { email });
      throw new BadRequestException('Invalid OTP code');
    }

    // Check if OTP is expired
    if (verificationToken.expires < new Date()) {
      this.logger.warn('OTP verification failed - expired OTP', {
        userId: verificationToken.userId,
        expiredAt: verificationToken.expires,
      });
      throw new BadRequestException('OTP has expired. Please request a new one.');
    }

    this.logger.debug('OTP validated successfully', { userId: verificationToken.userId });

    // Update user email verification status
    await this.prisma.user.update({
      where: { id: verificationToken.userId! },
      data: {
        isEmailVerified: true,
        isVerified: true,
      },
    });

    // Mark OTP as used
    await this.prisma.verificationToken.update({
      where: { id: verificationToken.id },
      data: {
        used: true,
        usedAt: new Date(),
      },
    });

    this.logger.info('OTP verified successfully', {
      userId: verificationToken.userId,
      email: verificationToken.user?.email,
    });

    // Send welcome email
    if (verificationToken.user) {
      const emailResult = await this.emailService.sendWelcomeEmail(
        verificationToken.user.email,
        `${verificationToken.user.firstName} ${verificationToken.user.lastName}`,
        verificationToken.user.tenant?.name,
      );

      if (emailResult.success) {
        this.logger.debug('Welcome email sent', { userId: verificationToken.userId });
      }
    }

    // Create audit log
    await this.prisma.auditLog.create({
      data: {
        eventType: 'AUTHENTICATION',
        action: 'OTP_VERIFIED',
        userId: verificationToken.userId,
        tenantId: verificationToken.user?.tenantId || '',
        success: true,
      },
    });

    return { message: 'Email verified successfully. You can now log in.' };
  }

  /**
   * Resend email verification link
   * Allows user to request new verification email if original expired
   * 
   * @param email - User's email address
   * @returns Success message
   * @throws NotFoundException if user not found
   * @throws BadRequestException if email already verified
   * 
   * Security:
   * - Rate limited (should be applied at controller level)
   * - Only generates new token if previous expired or used
   */
  async resendVerificationEmail(email: string): Promise<{ message: string }> {
    this.logger.debug('Resend verification email requested', { email });

    // Find user with tenant information
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        tenant: {
          select: { name: true },
        },
      },
    });

    if (!user) {
      this.logger.warn('Resend verification failed - user not found', { email });
      throw new NotFoundException('User not found');
    }

    // Check if email already verified
    if (user.isEmailVerified) {
      this.logger.warn('Resend verification failed - already verified', { userId: user.id });
      throw new BadRequestException('Email is already verified');
    }

    // Invalidate any existing unused verification tokens for this user
    await this.prisma.verificationToken.updateMany({
      where: {
        userId: user.id,
        type: TokenType.EMAIL_VERIFICATION,
        used: false,
      },
      data: {
        used: true,
        usedAt: new Date(),
      },
    });

    // Generate new verification token
    const verificationToken = await this.generateVerificationToken(
      user.id,
      email,
      TokenType.EMAIL_VERIFICATION
    );

    this.logger.debug('New verification token generated', { userId: user.id });

    // Send verification email
    const emailResult = await this.emailService.sendVerificationEmail(
      email,
      `${user.firstName} ${user.lastName}`,
      verificationToken,
      user.tenant?.name,
    );

    if (emailResult.success) {
      this.logger.info('Verification email resent successfully', {
        userId: user.id,
        email,
        messageId: emailResult.messageId,
      });
    } else {
      this.logger.error('Failed to resend verification email', undefined, {
        userId: user.id,
        email,
        error: emailResult.error,
      });
      throw new BadRequestException('Failed to send verification email. Please try again later.');
    }

    return { message: 'Verification email has been resent. Please check your inbox.' };
  }

  /**
   * Generate both access and refresh JWT tokens
   * 
   * @param userId - User ID (subject)
   * @param email - User email
   * @param role - User role
   * @param tenantId - Tenant ID for multi-tenant support
   * @returns Object containing access_token and refresh_token
   * 
   * Token specifications:
   * - Access token: Short-lived (default 7 days), used for API authentication
   * - Refresh token: Long-lived (default 30 days), used to obtain new access tokens
   */
  private async generateTokens(
    userId: string,
    email: string,
    role: string,
    tenantId: string
  ): Promise<{ access_token: string; refresh_token: string }> {
    this.logger.debug('Generating JWT tokens', { userId, email });

    // Payload for access token
    const accessPayload: JwtPayload = {
      sub: userId,
      email,
      role,
      tenantId,
      type: 'access',
    };
    
    this.logger.debug('🔍 [AUTH DEBUG] JWT access payload created', {
      sub: accessPayload.sub,
      email: accessPayload.email,
      role: accessPayload.role,
      tenantId: accessPayload.tenantId,
      type: accessPayload.type
    });

    // Payload for refresh token
    const refreshPayload: JwtPayload = {
      sub: userId,
      email,
      role,
      tenantId,
      type: 'refresh',
    };

    // Generate access token (short-lived)
    const accessTokenExpiry = this.configService.get<string>('JWT_EXPIRES_IN') || '7d';
    const access_token = this.jwtService.sign(accessPayload, {
      expiresIn: accessTokenExpiry,
    });

    // Generate refresh token (long-lived)
    const refreshTokenExpiry = this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '30d';
    const refresh_token = this.jwtService.sign(refreshPayload, {
      expiresIn: refreshTokenExpiry,
    });

    this.logger.debug('Tokens generated', {
      userId,
      accessTokenExpiry,
      refreshTokenExpiry,
    });

    return { access_token, refresh_token };
  }

  /**
   * Store refresh token in database for validation and revocation
   * Uses VerificationToken table with type REFRESH
   * 
   * @param userId - User ID owning the token
   * @param refreshToken - The JWT refresh token string
   * @param ipAddress - Client IP address for security tracking
   * @param userAgent - Client user agent for device tracking
   * 
   * Process:
   * 1. Calculate token expiration based on config
   * 2. Create token record in database
   * 3. Clean up old expired tokens for this user
   */
  private async storeRefreshToken(
    userId: string,
    refreshToken: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    this.logger.debug('Storing refresh token', { userId, ipAddress });

    // Calculate expiration time based on JWT_REFRESH_EXPIRES_IN
    const refreshTokenExpiry = this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '30d';
    const expirationDate = this.calculateExpirationDate(refreshTokenExpiry);

    // Store refresh token in database
    await this.prisma.verificationToken.create({
      data: {
        token: refreshToken,
        type: TokenType.REFRESH,
        userId,
        expires: expirationDate,
        used: false,
      },
    });

    this.logger.debug('Refresh token stored successfully', {
      userId,
      expiresAt: expirationDate,
    });

    // Clean up old expired refresh tokens for this user
    // This prevents token table from growing indefinitely
    await this.prisma.verificationToken.deleteMany({
      where: {
        userId,
        type: TokenType.REFRESH,
        expires: {
          lt: new Date(), // Less than current time = expired
        },
      },
    });

    this.logger.debug('Old expired tokens cleaned up', { userId });
  }

  /**
   * Refresh access token using a valid refresh token
   * 
   * @param refreshToken - The refresh token JWT string
   * @returns New access and refresh tokens
   * @throws UnauthorizedException if refresh token is invalid or expired
   * 
   * Process:
   * 1. Verify refresh token JWT signature
   * 2. Check if token exists in database and is not used
   * 3. Validate token expiration
   * 4. Mark old refresh token as used
   * 5. Generate new access and refresh tokens
   * 6. Store new refresh token
   * 7. Return new tokens
   */
  async refreshTokens(refreshToken: string): Promise<{ access_token: string; refresh_token: string }> {
    this.logger.debug('Refresh token request received');

    try {
      // Verify and decode the refresh token JWT
      const payload = this.jwtService.verify<JwtPayload>(refreshToken);
      
      this.logger.debug('Refresh token verified', { userId: payload.sub, type: payload.type });

      // Validate token type
      if (payload.type !== 'refresh') {
        this.logger.warn('Invalid token type for refresh', { type: payload.type, userId: payload.sub });
        throw new UnauthorizedException('Invalid token type');
      }

      // Check if refresh token exists in database and is not used
      const storedToken = await this.prisma.verificationToken.findFirst({
        where: {
          token: refreshToken,
          type: TokenType.REFRESH,
          userId: payload.sub,
          used: false,
        },
      });

      if (!storedToken) {
        this.logger.warn('Refresh token not found or already used', { userId: payload.sub });
        throw new UnauthorizedException('Invalid or expired refresh token');
      }

      // Check if token is expired
      if (storedToken.expires < new Date()) {
        this.logger.warn('Refresh token expired', { 
          userId: payload.sub, 
          expiredAt: storedToken.expires 
        });
        throw new UnauthorizedException('Refresh token expired');
      }

      this.logger.debug('Refresh token validated successfully', { userId: payload.sub });

      // Mark old refresh token as used (token rotation for security)
      await this.prisma.verificationToken.update({
        where: { id: storedToken.id },
        data: {
          used: true,
          usedAt: new Date(),
        },
      });

      this.logger.debug('Old refresh token marked as used', { userId: payload.sub });

      // Get user to ensure they're still active
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: {
          id: true,
          email: true,
          userType: true,
          tenantId: true,
          isActive: true,
        },
      });

      if (!user || !user.isActive) {
        this.logger.warn('User not found or inactive during token refresh', { userId: payload.sub });
        throw new UnauthorizedException('User account is not active');
      }

      // Map user role for JWT token
      const mappedRole = user.userType === 'ADMIN' ? 
        (user.email === 'admin@blicktrack.com' ? UserRole.SUPER_ADMIN : UserRole.TENANT_ADMIN) : 
        UserRole.END_USER;

      // Generate new tokens
      const newTokens = await this.generateTokens(user.id, user.email, mappedRole, user.tenantId);
      
      // Store new refresh token
      await this.storeRefreshToken(user.id, newTokens.refresh_token);

      this.logger.info('Tokens refreshed successfully', { userId: user.id });

      return newTokens;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      
      this.logger.error('Token refresh failed', error as Error);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  /**
   * Revoke a refresh token (logout)
   * Marks the token as used so it cannot be used again
   * 
   * @param refreshToken - The refresh token to revoke
   * @throws UnauthorizedException if token not found
   */
  async revokeRefreshToken(refreshToken: string): Promise<void> {
    this.logger.debug('Revoking refresh token');

    try {
      // Decode token to get user ID (don't verify expiration for revocation)
      const payload = this.jwtService.decode(refreshToken) as JwtPayload;

      if (!payload || !payload.sub) {
        this.logger.warn('Invalid token format for revocation');
        throw new UnauthorizedException('Invalid token');
      }

      // Mark token as used
      const result = await this.prisma.verificationToken.updateMany({
        where: {
          token: refreshToken,
          type: TokenType.REFRESH,
          userId: payload.sub,
        },
        data: {
          used: true,
          usedAt: new Date(),
        },
      });

      if (result.count === 0) {
        this.logger.warn('Refresh token not found for revocation', { userId: payload.sub });
        throw new UnauthorizedException('Token not found');
      }

      this.logger.info('Refresh token revoked successfully', { userId: payload.sub });
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      this.logger.error('Token revocation failed', error as Error);
      throw new UnauthorizedException('Failed to revoke token');
    }
  }

  /**
   * Handle failed login attempts and implement account lockout
   * 
   * @param userId - User ID who failed to login
   * 
   * Process:
   * 1. Increment failed login counter
   * 2. Check if max attempts reached
   * 3. Lock account if threshold exceeded
   * 4. Log failed attempt for audit
   */
  private async handleFailedLogin(userId: string): Promise<void> {
    this.logger.debug('Handling failed login attempt', { userId });

    const maxAttempts = this.configService.get<number>('MAX_FAILED_LOGIN_ATTEMPTS') || 5;
    const lockoutDuration = this.configService.get<number>('ACCOUNT_LOCKOUT_DURATION') || 30; // minutes

    // Get current failed attempts
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { failedLoginAttempts: true, email: true, tenantId: true },
    });

    if (!user) {
      return;
    }

    const newFailedAttempts = (user.failedLoginAttempts || 0) + 1;

    // Update failed attempts counter
    const updateData: any = {
      failedLoginAttempts: newFailedAttempts,
    };

    // Lock account if max attempts reached
    if (newFailedAttempts >= maxAttempts) {
      const lockUntil = new Date();
      lockUntil.setMinutes(lockUntil.getMinutes() + lockoutDuration);
      updateData.lockedUntil = lockUntil;

      this.logger.warn('Account locked due to failed login attempts', {
        userId,
        attempts: newFailedAttempts,
        lockedUntil: lockUntil,
      });
    } else {
      this.logger.debug('Failed login attempt recorded', {
        userId,
        attempts: newFailedAttempts,
        remaining: maxAttempts - newFailedAttempts,
      });
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    // Log failed login for audit
    await this.prisma.auditLog.create({
      data: {
        eventType: 'AUTHENTICATION',
        userId,
        tenantId: user.tenantId,
        action: 'LOGIN_FAILED',
        success: false,
        errorMessage: 'Invalid credentials',
      },
    });
  }

  /**
   * Generate verification token for email verification or password reset
   * 
   * @param userId - User ID
   * @param email - User email
   * @param type - Token type (EMAIL_VERIFICATION or PASSWORD_RESET)
   * @returns Generated token string
   */
  private async generateVerificationToken(userId: string, email: string, type: TokenType): Promise<string> {
    this.logger.debug('Generating verification token', { userId, email, type });

    // Generate secure random token
    const token = randomBytes(32).toString('hex');

    // Calculate expiration based on token type
    const expirationHours = type === TokenType.EMAIL_VERIFICATION ? 24 : 1; // 24h for email, 1h for password reset
    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + expirationHours);

    // Store token in database
    await this.prisma.verificationToken.create({
      data: {
        token,
        type,
        userId,
        email,
        expires: expirationDate,
        used: false,
      },
    });

    this.logger.debug('Verification token generated', {
      userId,
      type,
      expiresAt: expirationDate,
    });

    return token;
  }

  /**
   * Validate password strength
   * 
   * @param password - Password to validate
   * @returns true if password meets strength requirements, false otherwise
   * 
   * Requirements:
   * - At least 8 characters
   * - At least 1 uppercase letter
   * - At least 1 lowercase letter
   * - At least 1 number
   * - At least 1 special character
   */
  private isPasswordStrong(password: string): boolean {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  }

  /**
   * Calculate expiration date from JWT expiry string format
   * 
   * @param expiryString - String like '7d', '30d', '1h', '60m'
   * @returns Date object representing expiration time
   */
  private calculateExpirationDate(expiryString: string): Date {
    const now = new Date();
    const value = parseInt(expiryString);
    const unit = expiryString.slice(-1);

    switch (unit) {
      case 'd': // days
        now.setDate(now.getDate() + value);
        break;
      case 'h': // hours
        now.setHours(now.getHours() + value);
        break;
      case 'm': // minutes
        now.setMinutes(now.getMinutes() + value);
        break;
      case 's': // seconds
        now.setSeconds(now.getSeconds() + value);
        break;
      default:
        // Default to 30 days if format is unknown
        now.setDate(now.getDate() + 30);
    }

    return now;
  }
}