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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = __importStar(require("bcryptjs"));
const client_1 = require("@prisma/client");
const crypto_1 = require("crypto");
const hashing_service_1 = require("../common/services/hashing.service");
const logger_service_1 = require("../common/services/logger.service");
const email_service_1 = require("../common/services/email.service");
let AuthService = class AuthService {
    prisma;
    jwtService;
    configService;
    hashingService;
    emailService;
    logger;
    constructor(prisma, jwtService, configService, hashingService, emailService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.configService = configService;
        this.hashingService = hashingService;
        this.emailService = emailService;
        this.logger = new logger_service_1.LoggerService(configService);
        this.logger.setContext('AuthService');
        this.logger.debug('AuthService initialized with email support');
    }
    async register(registerDto) {
        const { email, password, name, tenantSlug } = registerDto;
        this.logger.debug('User registration attempt', { email, tenantSlug });
        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            this.logger.warn('Registration failed - user already exists', { email });
            throw new common_1.ConflictException('User with this email already exists');
        }
        if (!this.isPasswordStrong(password)) {
            this.logger.warn('Registration failed - weak password', { email });
            throw new common_1.BadRequestException('Password must contain at least 12 characters, including uppercase, lowercase, numbers, and special characters');
        }
        const saltRounds = this.configService.get('BCRYPT_ROUNDS') || 12;
        this.logger.debug('Hashing password', { saltRounds });
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        let tenantId = undefined;
        if (tenantSlug) {
            this.logger.debug('Looking up tenant', { tenantSlug });
            const tenant = await this.prisma.tenant.findUnique({
                where: { slug: tenantSlug, isActive: true },
            });
            if (!tenant) {
                this.logger.warn('Registration failed - tenant not found', { tenantSlug });
                throw new common_1.NotFoundException('Tenant not found');
            }
            tenantId = tenant.id;
            this.logger.debug('Tenant found', { tenantId: tenant.id, tenantName: tenant.name });
        }
        this.logger.debug('Creating user in database', { email, tenantId });
        const user = await this.prisma.user.create({
            data: {
                email,
                firstName: name?.split(' ')[0] || 'User',
                lastName: name?.split(' ')[1] || '',
                passwordHash: hashedPassword,
                tenantId: tenantId,
                role: client_1.UserRole.END_USER,
                isVerified: false,
            },
        });
        this.logger.info('User registered successfully', { userId: user.id, email: user.email });
        const verificationToken = await this.generateVerificationToken(user.id, email, client_1.TokenType.EMAIL_VERIFICATION);
        const tenant = tenantId ? await this.prisma.tenant.findUnique({
            where: { id: tenantId },
            select: { name: true },
        }) : null;
        this.logger.debug('Sending verification email', { userId: user.id, email, tenantName: tenant?.name });
        const emailResult = await this.emailService.sendVerificationEmail(email, name || 'User', verificationToken, tenant?.name);
        if (emailResult.success) {
            this.logger.info('Verification email sent successfully', {
                userId: user.id,
                email,
                messageId: emailResult.messageId,
            });
        }
        else {
            this.logger.error('Failed to send verification email', undefined, {
                userId: user.id,
                email,
                error: emailResult.error,
            });
        }
        return {
            message: 'User registered successfully. Please check your email for verification.',
            userId: user.id,
        };
    }
    async validateUser(email, password) {
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
            throw new common_1.UnauthorizedException('Account has been deactivated');
        }
        if (!user.isEmailVerified) {
            throw new common_1.UnauthorizedException('Email not verified');
        }
        if (!user.passwordHash) {
            return null;
        }
        const isPasswordValid = await this.hashingService.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            return null;
        }
        const { passwordHash: _, ...result } = user;
        return result;
    }
    async login(loginDto, ipAddress, userAgent) {
        const { email, password } = loginDto;
        this.logger.debug('Login attempt started', { email, ipAddress });
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
        if (!user) {
            this.logger.warn('Login failed - user not found', { email });
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        this.logger.debug('User found, validating account status', { userId: user.id, status: user.status });
        if (!user.isActive) {
            this.logger.warn('Login failed - account deactivated', { userId: user.id, email });
            throw new common_1.UnauthorizedException('Account is deactivated');
        }
        if (user.lockedUntil && user.lockedUntil > new Date()) {
            const lockTimeRemaining = Math.ceil((user.lockedUntil.getTime() - Date.now()) / (1000 * 60));
            this.logger.warn('Login failed - account locked', {
                userId: user.id,
                email,
                lockTimeRemaining: `${lockTimeRemaining} minutes`
            });
            throw new common_1.UnauthorizedException(`Account is locked for ${lockTimeRemaining} more minutes`);
        }
        this.logger.debug('Account validation passed, checking password', { userId: user.id });
        const passwordToCheck = user.passwordHash;
        if (!passwordToCheck) {
            this.logger.error('Login failed - no password hash in database', undefined, { userId: user.id, email });
            await this.handleFailedLogin(user.id);
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await this.hashingService.compare(password, passwordToCheck);
        this.logger.debug('Password validation completed', { userId: user.id, isValid: isPasswordValid });
        if (!isPasswordValid) {
            this.logger.warn('Login failed - invalid password', { userId: user.id, email });
            await this.handleFailedLogin(user.id);
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        this.logger.info('Password validation successful', { userId: user.id, email });
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                lastLoginAt: new Date(),
                failedLoginAttempts: 0,
                lockedUntil: null,
            },
        });
        this.logger.debug('Failed login attempts reset', { userId: user.id });
        const tokens = await this.generateTokens(user.id, user.email, user.userType, user.tenantId);
        this.logger.debug('Tokens generated successfully', { userId: user.id });
        await this.storeRefreshToken(user.id, tokens.refresh_token, ipAddress, userAgent);
        this.logger.debug('Refresh token stored in database', { userId: user.id });
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
                role: user.userType === 'ADMIN' ? client_1.UserRole.TENANT_ADMIN : client_1.UserRole.END_USER,
                tenantId: user.tenantId,
                isVerified: user.isEmailVerified,
                mfaEnabled: false,
            },
        };
    }
    async forgotPassword(forgotPasswordDto) {
        const { email } = forgotPasswordDto;
        this.logger.debug('Password reset requested', { email });
        const user = await this.prisma.user.findUnique({
            where: { email },
            include: {
                tenant: {
                    select: { name: true },
                },
            },
        });
        if (!user) {
            this.logger.warn('Password reset requested for non-existent email', { email });
            return { message: 'If the email exists, a password reset link has been sent.' };
        }
        const resetToken = await this.generateVerificationToken(user.id, email, client_1.TokenType.PASSWORD_RESET);
        this.logger.debug('Password reset token generated', { userId: user.id, email });
        const emailResult = await this.emailService.sendPasswordResetEmail(email, `${user.firstName} ${user.lastName}`, resetToken, user.tenant?.name, undefined);
        if (emailResult.success) {
            this.logger.info('Password reset email sent successfully', {
                userId: user.id,
                email,
                messageId: emailResult.messageId,
            });
        }
        else {
            this.logger.error('Failed to send password reset email', undefined, {
                userId: user.id,
                email,
                error: emailResult.error,
            });
        }
        return { message: 'If the email exists, a password reset link has been sent.' };
    }
    async resetPassword(resetPasswordDto) {
        const { token, newPassword } = resetPasswordDto;
        this.logger.debug('Password reset attempt', { tokenProvided: !!token });
        const resetToken = await this.prisma.verificationToken.findFirst({
            where: {
                token,
                type: client_1.TokenType.PASSWORD_RESET,
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
            this.logger.warn('Password reset failed - invalid or used token', { token: token.substring(0, 10) });
            throw new common_1.BadRequestException('Invalid or expired reset token');
        }
        if (resetToken.expires < new Date()) {
            this.logger.warn('Password reset failed - expired token', {
                userId: resetToken.userId,
                expiredAt: resetToken.expires,
            });
            throw new common_1.BadRequestException('Reset token has expired. Please request a new one.');
        }
        if (!this.isPasswordStrong(newPassword)) {
            this.logger.warn('Password reset failed - weak password', { userId: resetToken.userId });
            throw new common_1.BadRequestException('Password must contain at least 12 characters, including uppercase, lowercase, numbers, and special characters');
        }
        this.logger.debug('Password reset token validated', { userId: resetToken.userId });
        const hashedPassword = await this.hashingService.hash(newPassword);
        await this.prisma.user.update({
            where: { id: resetToken.userId },
            data: {
                passwordHash: hashedPassword,
                passwordChangedAt: new Date(),
            },
        });
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
        if (resetToken.user) {
            const emailResult = await this.emailService.sendSecurityAlertEmail(resetToken.user.email, `${resetToken.user.firstName} ${resetToken.user.lastName}`, 'Password Changed', undefined, undefined, undefined, resetToken.user.tenant?.name);
            if (emailResult.success) {
                this.logger.debug('Security alert email sent', { userId: resetToken.userId });
            }
        }
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
    async changePassword(userId, changePasswordDto) {
        const { currentPassword, newPassword } = changePasswordDto;
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user || !user.passwordHash) {
            throw new common_1.NotFoundException('User not found');
        }
        const isCurrentPasswordValid = await this.hashingService.compare(currentPassword, user.passwordHash);
        if (!isCurrentPasswordValid) {
            throw new common_1.UnauthorizedException('Current password is incorrect');
        }
        if (!this.isPasswordStrong(newPassword)) {
            throw new common_1.BadRequestException('Password must contain at least 12 characters, including uppercase, lowercase, numbers, and special characters');
        }
        const hashedPassword = await this.hashingService.hash(newPassword);
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                passwordHash: hashedPassword,
            },
        });
        return { message: 'Password changed successfully' };
    }
    async verifyEmail(verifyEmailDto) {
        const { token } = verifyEmailDto;
        this.logger.debug('Email verification attempt', { tokenProvided: !!token });
        const verificationToken = await this.prisma.verificationToken.findFirst({
            where: {
                token,
                type: client_1.TokenType.EMAIL_VERIFICATION,
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
            throw new common_1.BadRequestException('Invalid or expired verification token');
        }
        if (verificationToken.expires < new Date()) {
            this.logger.warn('Email verification failed - expired token', {
                userId: verificationToken.userId,
                expiredAt: verificationToken.expires,
            });
            throw new common_1.BadRequestException('Verification token has expired. Please request a new one.');
        }
        this.logger.debug('Email verification token validated', { userId: verificationToken.userId });
        await this.prisma.user.update({
            where: { id: verificationToken.userId },
            data: {
                isEmailVerified: true,
                isVerified: true,
            },
        });
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
        if (verificationToken.user) {
            const emailResult = await this.emailService.sendWelcomeEmail(verificationToken.user.email, `${verificationToken.user.firstName} ${verificationToken.user.lastName}`, verificationToken.user.tenant?.name);
            if (emailResult.success) {
                this.logger.debug('Welcome email sent', { userId: verificationToken.userId });
            }
        }
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
    async resendVerificationEmail(email) {
        this.logger.debug('Resend verification email requested', { email });
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
            throw new common_1.NotFoundException('User not found');
        }
        if (user.isEmailVerified) {
            this.logger.warn('Resend verification failed - already verified', { userId: user.id });
            throw new common_1.BadRequestException('Email is already verified');
        }
        await this.prisma.verificationToken.updateMany({
            where: {
                userId: user.id,
                type: client_1.TokenType.EMAIL_VERIFICATION,
                used: false,
            },
            data: {
                used: true,
                usedAt: new Date(),
            },
        });
        const verificationToken = await this.generateVerificationToken(user.id, email, client_1.TokenType.EMAIL_VERIFICATION);
        this.logger.debug('New verification token generated', { userId: user.id });
        const emailResult = await this.emailService.sendVerificationEmail(email, `${user.firstName} ${user.lastName}`, verificationToken, user.tenant?.name);
        if (emailResult.success) {
            this.logger.info('Verification email resent successfully', {
                userId: user.id,
                email,
                messageId: emailResult.messageId,
            });
        }
        else {
            this.logger.error('Failed to resend verification email', undefined, {
                userId: user.id,
                email,
                error: emailResult.error,
            });
            throw new common_1.BadRequestException('Failed to send verification email. Please try again later.');
        }
        return { message: 'Verification email has been resent. Please check your inbox.' };
    }
    async generateTokens(userId, email, role, tenantId) {
        this.logger.debug('Generating JWT tokens', { userId, email });
        const accessPayload = {
            sub: userId,
            email,
            role,
            tenantId,
            type: 'access',
        };
        const refreshPayload = {
            sub: userId,
            email,
            role,
            tenantId,
            type: 'refresh',
        };
        const accessTokenExpiry = this.configService.get('JWT_EXPIRES_IN') || '7d';
        const access_token = this.jwtService.sign(accessPayload, {
            expiresIn: accessTokenExpiry,
        });
        const refreshTokenExpiry = this.configService.get('JWT_REFRESH_EXPIRES_IN') || '30d';
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
    async storeRefreshToken(userId, refreshToken, ipAddress, userAgent) {
        this.logger.debug('Storing refresh token', { userId, ipAddress });
        const refreshTokenExpiry = this.configService.get('JWT_REFRESH_EXPIRES_IN') || '30d';
        const expirationDate = this.calculateExpirationDate(refreshTokenExpiry);
        await this.prisma.verificationToken.create({
            data: {
                token: refreshToken,
                type: client_1.TokenType.REFRESH,
                userId,
                expires: expirationDate,
                used: false,
            },
        });
        this.logger.debug('Refresh token stored successfully', {
            userId,
            expiresAt: expirationDate,
        });
        await this.prisma.verificationToken.deleteMany({
            where: {
                userId,
                type: client_1.TokenType.REFRESH,
                expires: {
                    lt: new Date(),
                },
            },
        });
        this.logger.debug('Old expired tokens cleaned up', { userId });
    }
    async refreshTokens(refreshToken) {
        this.logger.debug('Refresh token request received');
        try {
            const payload = this.jwtService.verify(refreshToken);
            this.logger.debug('Refresh token verified', { userId: payload.sub, type: payload.type });
            if (payload.type !== 'refresh') {
                this.logger.warn('Invalid token type for refresh', { type: payload.type, userId: payload.sub });
                throw new common_1.UnauthorizedException('Invalid token type');
            }
            const storedToken = await this.prisma.verificationToken.findFirst({
                where: {
                    token: refreshToken,
                    type: client_1.TokenType.REFRESH,
                    userId: payload.sub,
                    used: false,
                },
            });
            if (!storedToken) {
                this.logger.warn('Refresh token not found or already used', { userId: payload.sub });
                throw new common_1.UnauthorizedException('Invalid or expired refresh token');
            }
            if (storedToken.expires < new Date()) {
                this.logger.warn('Refresh token expired', {
                    userId: payload.sub,
                    expiredAt: storedToken.expires
                });
                throw new common_1.UnauthorizedException('Refresh token expired');
            }
            this.logger.debug('Refresh token validated successfully', { userId: payload.sub });
            await this.prisma.verificationToken.update({
                where: { id: storedToken.id },
                data: {
                    used: true,
                    usedAt: new Date(),
                },
            });
            this.logger.debug('Old refresh token marked as used', { userId: payload.sub });
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
                throw new common_1.UnauthorizedException('User account is not active');
            }
            const newTokens = await this.generateTokens(user.id, user.email, user.userType, user.tenantId);
            await this.storeRefreshToken(user.id, newTokens.refresh_token);
            this.logger.info('Tokens refreshed successfully', { userId: user.id });
            return newTokens;
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            this.logger.error('Token refresh failed', error);
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
    async revokeRefreshToken(refreshToken) {
        this.logger.debug('Revoking refresh token');
        try {
            const payload = this.jwtService.decode(refreshToken);
            if (!payload || !payload.sub) {
                this.logger.warn('Invalid token format for revocation');
                throw new common_1.UnauthorizedException('Invalid token');
            }
            const result = await this.prisma.verificationToken.updateMany({
                where: {
                    token: refreshToken,
                    type: client_1.TokenType.REFRESH,
                    userId: payload.sub,
                },
                data: {
                    used: true,
                    usedAt: new Date(),
                },
            });
            if (result.count === 0) {
                this.logger.warn('Refresh token not found for revocation', { userId: payload.sub });
                throw new common_1.UnauthorizedException('Token not found');
            }
            this.logger.info('Refresh token revoked successfully', { userId: payload.sub });
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            this.logger.error('Token revocation failed', error);
            throw new common_1.UnauthorizedException('Failed to revoke token');
        }
    }
    async handleFailedLogin(userId) {
        this.logger.debug('Handling failed login attempt', { userId });
        const maxAttempts = this.configService.get('MAX_FAILED_LOGIN_ATTEMPTS') || 5;
        const lockoutDuration = this.configService.get('ACCOUNT_LOCKOUT_DURATION') || 30;
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { failedLoginAttempts: true, email: true, tenantId: true },
        });
        if (!user) {
            return;
        }
        const newFailedAttempts = (user.failedLoginAttempts || 0) + 1;
        const updateData = {
            failedLoginAttempts: newFailedAttempts,
        };
        if (newFailedAttempts >= maxAttempts) {
            const lockUntil = new Date();
            lockUntil.setMinutes(lockUntil.getMinutes() + lockoutDuration);
            updateData.lockedUntil = lockUntil;
            this.logger.warn('Account locked due to failed login attempts', {
                userId,
                attempts: newFailedAttempts,
                lockedUntil: lockUntil,
            });
        }
        else {
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
    async generateVerificationToken(userId, email, type) {
        this.logger.debug('Generating verification token', { userId, email, type });
        const token = (0, crypto_1.randomBytes)(32).toString('hex');
        const expirationHours = type === client_1.TokenType.EMAIL_VERIFICATION ? 24 : 1;
        const expirationDate = new Date();
        expirationDate.setHours(expirationDate.getHours() + expirationHours);
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
    isPasswordStrong(password) {
        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;
        return strongPasswordRegex.test(password);
    }
    calculateExpirationDate(expiryString) {
        const now = new Date();
        const value = parseInt(expiryString);
        const unit = expiryString.slice(-1);
        switch (unit) {
            case 'd':
                now.setDate(now.getDate() + value);
                break;
            case 'h':
                now.setHours(now.getHours() + value);
                break;
            case 'm':
                now.setMinutes(now.getMinutes() + value);
                break;
            case 's':
                now.setSeconds(now.getSeconds() + value);
                break;
            default:
                now.setDate(now.getDate() + 30);
        }
        return now;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService,
        hashing_service_1.HashingService,
        email_service_1.EmailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map