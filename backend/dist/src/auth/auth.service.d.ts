import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto, ForgotPasswordDto, ResetPasswordDto, ChangePasswordDto, VerifyEmailDto } from './dto/auth.dto';
import { UserRole } from '@prisma/client';
import { HashingService } from '../common/services/hashing.service';
import { EmailService } from '../common/services/email.service';
export interface AuthResponse {
    access_token: string;
    refresh_token: string;
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
export interface JwtPayload {
    sub: string;
    email: string;
    role: string;
    tenantId: string;
    type: 'access' | 'refresh';
}
export declare class AuthService {
    private prisma;
    private jwtService;
    private configService;
    private hashingService;
    private emailService;
    private readonly logger;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService, hashingService: HashingService, emailService: EmailService);
    register(registerDto: RegisterDto): Promise<{
        message: string;
        userId: string;
    }>;
    validateUser(email: string, password: string): Promise<any>;
    login(loginDto: LoginDto, ipAddress?: string, userAgent?: string): Promise<AuthResponse>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    verifyEmail(verifyEmailDto: VerifyEmailDto): Promise<{
        message: string;
    }>;
    resendVerificationEmail(email: string): Promise<{
        message: string;
    }>;
    private generateTokens;
    private storeRefreshToken;
    refreshTokens(refreshToken: string): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    revokeRefreshToken(refreshToken: string): Promise<void>;
    private handleFailedLogin;
    private generateVerificationToken;
    private isPasswordStrong;
    private calculateExpirationDate;
}
