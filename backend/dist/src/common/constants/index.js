"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SECURITY_CONSTANTS = exports.API_RESPONSES = exports.EMAIL_CONSTANTS = exports.FILE_CONSTANTS = exports.DB_CONSTANTS = exports.RBAC_CONSTANTS = exports.RATE_LIMIT_CONSTANTS = exports.AUTH_CONSTANTS = exports.APP_CONSTANTS = void 0;
const client_1 = require("@prisma/client");
exports.APP_CONSTANTS = {
    APP_NAME: 'BlickTrack',
    VERSION: '1.0.0',
    API_PREFIX: 'api/v1',
    SWAGGER_PATH: 'api/docs',
};
exports.AUTH_CONSTANTS = {
    JWT_EXPIRY: '7d',
    BCRYPT_ROUNDS: 12,
    MAX_LOGIN_ATTEMPTS: 5,
    LOCKOUT_DURATION: 30 * 60 * 1000,
    PASSWORD_MIN_LENGTH: 12,
    TOKEN_EXPIRY: {
        EMAIL_VERIFICATION: 24 * 60 * 60 * 1000,
        PASSWORD_RESET: 60 * 60 * 1000,
        MFA_SETUP: 10 * 60 * 1000,
    },
};
exports.RATE_LIMIT_CONSTANTS = {
    WINDOW_MS: 15 * 60 * 1000,
    MAX_REQUESTS: 100,
    AUTH_WINDOW_MS: 15 * 60 * 1000,
    AUTH_MAX_REQUESTS: 5,
};
exports.RBAC_CONSTANTS = {
    ROLES: {
        PLATFORM_ADMIN: client_1.UserRole.PLATFORM_ADMIN,
        TENANT_ADMIN: client_1.UserRole.TENANT_ADMIN,
        END_USER: client_1.UserRole.END_USER,
        COLLABORATOR: client_1.UserRole.COLLABORATOR,
    },
    PERMISSIONS: {
        MANAGE_ALL_TENANTS: 'manage:all:tenants',
        MANAGE_ALL_USERS: 'manage:all:users',
        VIEW_ALL_ANALYTICS: 'view:all:analytics',
        MANAGE_PLATFORM_SETTINGS: 'manage:platform:settings',
        MANAGE_TENANT: 'manage:tenant',
        MANAGE_TENANT_USERS: 'manage:tenant:users',
        VIEW_TENANT_ANALYTICS: 'view:tenant:analytics',
        CONFIGURE_SSO: 'configure:sso',
        CREATE_SBOM: 'create:sbom',
        VIEW_SBOM: 'view:sbom',
        UPDATE_OWN_SBOM: 'update:own:sbom',
        CREATE_THREAT_MODEL: 'create:threat_model',
        VIEW_THREAT_MODEL: 'view:threat_model',
        UPDATE_OWN_THREAT_MODEL: 'update:own:threat_model',
        VIEW_SHARED_SBOM: 'view:shared:sbom',
        VIEW_SHARED_THREAT_MODEL: 'view:shared:threat_model',
        COMMENT_ON_SHARED: 'comment:shared',
    },
};
exports.DB_CONSTANTS = {
    MAX_CONNECTIONS: 10,
    CONNECTION_TIMEOUT: 10000,
    QUERY_TIMEOUT: 5000,
};
exports.FILE_CONSTANTS = {
    MAX_FILE_SIZE: 10 * 1024 * 1024,
    ALLOWED_SBOM_FORMATS: ['application/json', 'application/xml', 'text/xml'],
    ALLOWED_EXTENSIONS: ['.json', '.xml', '.spdx', '.cdx'],
    UPLOAD_PATH: './uploads',
};
exports.EMAIL_CONSTANTS = {
    FROM_ADDRESS: 'noreply@blicktrack.com',
    SUPPORT_ADDRESS: 'support@blicktrack.com',
    TEMPLATES: {
        WELCOME: 'welcome',
        EMAIL_VERIFICATION: 'email-verification',
        PASSWORD_RESET: 'password-reset',
        ACCOUNT_LOCKED: 'account-locked',
        MFA_SETUP: 'mfa-setup',
    },
};
exports.API_RESPONSES = {
    SUCCESS: {
        CREATED: 'Resource created successfully',
        UPDATED: 'Resource updated successfully',
        DELETED: 'Resource deleted successfully',
        RETRIEVED: 'Resource retrieved successfully',
    },
    AUTH: {
        LOGIN_SUCCESS: 'Login successful',
        LOGOUT_SUCCESS: 'Logout successful',
        REGISTER_SUCCESS: 'User registered successfully. Please verify your email.',
        EMAIL_VERIFIED: 'Email verified successfully',
        PASSWORD_RESET_SENT: 'Password reset link sent to your email',
        PASSWORD_CHANGED: 'Password changed successfully',
    },
    ERRORS: {
        UNAUTHORIZED: 'Authentication required',
        FORBIDDEN: 'Insufficient permissions',
        NOT_FOUND: 'Resource not found',
        INVALID_CREDENTIALS: 'Invalid email or password',
        ACCOUNT_LOCKED: 'Account temporarily locked due to multiple failed attempts',
        EMAIL_NOT_VERIFIED: 'Please verify your email address',
        WEAK_PASSWORD: 'Password does not meet security requirements',
        DUPLICATE_EMAIL: 'Email address already registered',
    },
};
exports.SECURITY_CONSTANTS = {
    CORS_ORIGINS: ['http://localhost:3000', 'https://blicktrack.com'],
    CSRF_SECRET: 'blicktrack-csrf-secret',
    HELMET_CONFIG: {
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'", 'https:'],
                scriptSrc: ["'self'", "'unsafe-eval'"],
                imgSrc: ["'self'", 'data:', 'https:'],
                connectSrc: ["'self'", 'https:'],
                fontSrc: ["'self'", 'https:', 'data:'],
                objectSrc: ["'none'"],
                mediaSrc: ["'self'"],
                frameSrc: ["'none'"],
            },
        },
    },
};
//# sourceMappingURL=index.js.map