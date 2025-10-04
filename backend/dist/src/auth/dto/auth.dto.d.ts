export declare class RegisterDto {
    email: string;
    password: string;
    name?: string;
    tenantSlug?: string;
}
export declare class LoginDto {
    email: string;
    password: string;
}
export declare class ForgotPasswordDto {
    email: string;
}
export declare class ResetPasswordDto {
    token: string;
    newPassword: string;
}
export declare class ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
}
export declare class VerifyEmailDto {
    token: string;
}
export declare class RefreshTokenDto {
    refresh_token: string;
}
export declare class ResendVerificationDto {
    email: string;
}
