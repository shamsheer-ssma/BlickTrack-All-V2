export declare const APP_CONSTANTS: {
    readonly APP_NAME: "BlickTrack";
    readonly VERSION: "1.0.0";
    readonly API_PREFIX: "api/v1";
    readonly SWAGGER_PATH: "api/docs";
};
export declare const AUTH_CONSTANTS: {
    readonly JWT_EXPIRY: "7d";
    readonly BCRYPT_ROUNDS: 12;
    readonly MAX_LOGIN_ATTEMPTS: 5;
    readonly LOCKOUT_DURATION: number;
    readonly PASSWORD_MIN_LENGTH: 12;
    readonly TOKEN_EXPIRY: {
        readonly EMAIL_VERIFICATION: number;
        readonly PASSWORD_RESET: number;
        readonly MFA_SETUP: number;
    };
};
export declare const RATE_LIMIT_CONSTANTS: {
    readonly WINDOW_MS: number;
    readonly MAX_REQUESTS: 100;
    readonly AUTH_WINDOW_MS: number;
    readonly AUTH_MAX_REQUESTS: 5;
};
export declare const RBAC_CONSTANTS: {
    readonly ROLES: {
        readonly PLATFORM_ADMIN: "PLATFORM_ADMIN";
        readonly TENANT_ADMIN: "TENANT_ADMIN";
        readonly END_USER: "END_USER";
        readonly COLLABORATOR: "COLLABORATOR";
    };
    readonly PERMISSIONS: {
        readonly MANAGE_ALL_TENANTS: "manage:all:tenants";
        readonly MANAGE_ALL_USERS: "manage:all:users";
        readonly VIEW_ALL_ANALYTICS: "view:all:analytics";
        readonly MANAGE_PLATFORM_SETTINGS: "manage:platform:settings";
        readonly MANAGE_TENANT: "manage:tenant";
        readonly MANAGE_TENANT_USERS: "manage:tenant:users";
        readonly VIEW_TENANT_ANALYTICS: "view:tenant:analytics";
        readonly CONFIGURE_SSO: "configure:sso";
        readonly CREATE_SBOM: "create:sbom";
        readonly VIEW_SBOM: "view:sbom";
        readonly UPDATE_OWN_SBOM: "update:own:sbom";
        readonly CREATE_THREAT_MODEL: "create:threat_model";
        readonly VIEW_THREAT_MODEL: "view:threat_model";
        readonly UPDATE_OWN_THREAT_MODEL: "update:own:threat_model";
        readonly VIEW_SHARED_SBOM: "view:shared:sbom";
        readonly VIEW_SHARED_THREAT_MODEL: "view:shared:threat_model";
        readonly COMMENT_ON_SHARED: "comment:shared";
    };
};
export declare const DB_CONSTANTS: {
    readonly MAX_CONNECTIONS: 10;
    readonly CONNECTION_TIMEOUT: 10000;
    readonly QUERY_TIMEOUT: 5000;
};
export declare const FILE_CONSTANTS: {
    readonly MAX_FILE_SIZE: number;
    readonly ALLOWED_SBOM_FORMATS: readonly ["application/json", "application/xml", "text/xml"];
    readonly ALLOWED_EXTENSIONS: readonly [".json", ".xml", ".spdx", ".cdx"];
    readonly UPLOAD_PATH: "./uploads";
};
export declare const EMAIL_CONSTANTS: {
    readonly FROM_ADDRESS: "noreply@blicktrack.com";
    readonly SUPPORT_ADDRESS: "support@blicktrack.com";
    readonly TEMPLATES: {
        readonly WELCOME: "welcome";
        readonly EMAIL_VERIFICATION: "email-verification";
        readonly PASSWORD_RESET: "password-reset";
        readonly ACCOUNT_LOCKED: "account-locked";
        readonly MFA_SETUP: "mfa-setup";
    };
};
export declare const API_RESPONSES: {
    readonly SUCCESS: {
        readonly CREATED: "Resource created successfully";
        readonly UPDATED: "Resource updated successfully";
        readonly DELETED: "Resource deleted successfully";
        readonly RETRIEVED: "Resource retrieved successfully";
    };
    readonly AUTH: {
        readonly LOGIN_SUCCESS: "Login successful";
        readonly LOGOUT_SUCCESS: "Logout successful";
        readonly REGISTER_SUCCESS: "User registered successfully. Please verify your email.";
        readonly EMAIL_VERIFIED: "Email verified successfully";
        readonly PASSWORD_RESET_SENT: "Password reset link sent to your email";
        readonly PASSWORD_CHANGED: "Password changed successfully";
    };
    readonly ERRORS: {
        readonly UNAUTHORIZED: "Authentication required";
        readonly FORBIDDEN: "Insufficient permissions";
        readonly NOT_FOUND: "Resource not found";
        readonly INVALID_CREDENTIALS: "Invalid email or password";
        readonly ACCOUNT_LOCKED: "Account temporarily locked due to multiple failed attempts";
        readonly EMAIL_NOT_VERIFIED: "Please verify your email address";
        readonly WEAK_PASSWORD: "Password does not meet security requirements";
        readonly DUPLICATE_EMAIL: "Email address already registered";
    };
};
export declare const SECURITY_CONSTANTS: {
    readonly CORS_ORIGINS: readonly ["http://localhost:3000", "https://blicktrack.com"];
    readonly CSRF_SECRET: "blicktrack-csrf-secret";
    readonly HELMET_CONFIG: {
        readonly contentSecurityPolicy: {
            readonly directives: {
                readonly defaultSrc: readonly ["'self'"];
                readonly styleSrc: readonly ["'self'", "'unsafe-inline'", "https:"];
                readonly scriptSrc: readonly ["'self'", "'unsafe-eval'"];
                readonly imgSrc: readonly ["'self'", "data:", "https:"];
                readonly connectSrc: readonly ["'self'", "https:"];
                readonly fontSrc: readonly ["'self'", "https:", "data:"];
                readonly objectSrc: readonly ["'none'"];
                readonly mediaSrc: readonly ["'self'"];
                readonly frameSrc: readonly ["'none'"];
            };
        };
    };
};
