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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringUtils = exports.DateUtils = exports.ValidationUtils = exports.TokenUtils = exports.PasswordUtils = void 0;
const bcrypt = __importStar(require("bcryptjs"));
const crypto_1 = require("crypto");
const constants_1 = require("../constants");
class PasswordUtils {
    static async hashPassword(password) {
        return bcrypt.hash(password, constants_1.AUTH_CONSTANTS.BCRYPT_ROUNDS);
    }
    static async comparePassword(password, hash) {
        return bcrypt.compare(password, hash);
    }
    static validatePasswordStrength(password) {
        const errors = [];
        if (password.length < constants_1.AUTH_CONSTANTS.PASSWORD_MIN_LENGTH) {
            errors.push(`Password must be at least ${constants_1.AUTH_CONSTANTS.PASSWORD_MIN_LENGTH} characters long`);
        }
        if (!/[a-z]/.test(password)) {
            errors.push('Password must contain at least one lowercase letter');
        }
        if (!/[A-Z]/.test(password)) {
            errors.push('Password must contain at least one uppercase letter');
        }
        if (!/\d/.test(password)) {
            errors.push('Password must contain at least one number');
        }
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
            errors.push('Password must contain at least one special character');
        }
        if (this.isCommonPassword(password)) {
            errors.push('Password is too common. Please choose a stronger password.');
        }
        return {
            isValid: errors.length === 0,
            errors,
        };
    }
    static isCommonPassword(password) {
        const commonPasswords = [
            'password', 'password123', '123456', '123456789', 'qwerty',
            'abc123', 'password1', 'admin', 'letmein', 'welcome',
            'monkey', '1234567890', 'dragon', 'password12',
        ];
        return commonPasswords.includes(password.toLowerCase());
    }
    static generateSecurePassword(length = 16) {
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
        let password = '';
        for (let i = 0; i < length; i++) {
            password += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        return password;
    }
}
exports.PasswordUtils = PasswordUtils;
class TokenUtils {
    static generateSecureToken(length = 32) {
        const tokenBytes = (0, crypto_1.randomBytes)(length);
        return (0, crypto_1.createHash)('sha256').update(tokenBytes).digest('hex');
    }
    static generateUrlSafeToken(length = 32) {
        const tokenBytes = (0, crypto_1.randomBytes)(length);
        return tokenBytes.toString('base64url');
    }
    static generateNumericOTP(length = 6) {
        const min = Math.pow(10, length - 1);
        const max = Math.pow(10, length) - 1;
        return Math.floor(Math.random() * (max - min + 1) + min).toString();
    }
}
exports.TokenUtils = TokenUtils;
class ValidationUtils {
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    static isValidPhoneNumber(phone) {
        const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
        return phoneRegex.test(phone);
    }
    static sanitizeString(input) {
        return input.trim().replace(/[<>]/g, '');
    }
    static isValidUUID(uuid) {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidRegex.test(uuid);
    }
}
exports.ValidationUtils = ValidationUtils;
class DateUtils {
    static getMinutesFromNow(minutes) {
        return new Date(Date.now() + minutes * 60 * 1000);
    }
    static getHoursFromNow(hours) {
        return new Date(Date.now() + hours * 60 * 60 * 1000);
    }
    static getDaysFromNow(days) {
        return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    }
    static isExpired(date) {
        return date < new Date();
    }
    static formatDate(date) {
        return date.toISOString().split('T')[0];
    }
    static formatDateTime(date) {
        return date.toISOString().replace('T', ' ').split('.')[0];
    }
}
exports.DateUtils = DateUtils;
class StringUtils {
    static generateSlug(input) {
        return input
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
    static capitalize(input) {
        return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
    }
    static generateRandomString(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }
    static maskEmail(email) {
        const [username, domain] = email.split('@');
        const maskedUsername = username.charAt(0) + '*'.repeat(username.length - 2) + username.charAt(username.length - 1);
        return `${maskedUsername}@${domain}`;
    }
    static truncate(text, maxLength) {
        if (text.length <= maxLength)
            return text;
        return text.substring(0, maxLength - 3) + '...';
    }
}
exports.StringUtils = StringUtils;
//# sourceMappingURL=index.js.map