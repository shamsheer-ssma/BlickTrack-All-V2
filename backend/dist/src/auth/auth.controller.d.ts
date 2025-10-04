import { AuthService, AuthResponse } from './auth.service';
import { RegisterDto, LoginDto, ForgotPasswordDto, ResetPasswordDto, ChangePasswordDto, VerifyEmailDto, RefreshTokenDto, ResendVerificationDto } from './dto/auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        message: string;
        userId: string;
    }>;
    login(loginDto: LoginDto, req: any): Promise<AuthResponse>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    verifyEmail(verifyEmailDto: VerifyEmailDto): Promise<{
        message: string;
    }>;
    sendOtp(sendOtpDto: {
        email: string;
    }): Promise<{
        message: string;
    }>;
    verifyOtp(verifyOtpDto: {
        email: string;
        otp: string;
    }): Promise<{
        message: string;
    }>;
    changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    getProfile(user: any): Promise<{
        id: any;
        email: any;
        name: any;
        role: any;
        tenantId: any;
        isVerified: any;
        mfaEnabled: any;
    }>;
    resendVerification(resendVerificationDto: ResendVerificationDto): Promise<{
        message: string;
    }>;
    refresh(refreshTokenDto: RefreshTokenDto): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    logout(refreshTokenDto: RefreshTokenDto): Promise<{
        message: string;
        note: string;
    }>;
}
