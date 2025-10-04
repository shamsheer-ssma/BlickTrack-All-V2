export declare class PasswordUtils {
    static hashPassword(password: string): Promise<string>;
    static comparePassword(password: string, hash: string): Promise<boolean>;
    static validatePasswordStrength(password: string): {
        isValid: boolean;
        errors: string[];
    };
    private static isCommonPassword;
    static generateSecurePassword(length?: number): string;
}
export declare class TokenUtils {
    static generateSecureToken(length?: number): string;
    static generateUrlSafeToken(length?: number): string;
    static generateNumericOTP(length?: number): string;
}
export declare class ValidationUtils {
    static isValidEmail(email: string): boolean;
    static isValidPhoneNumber(phone: string): boolean;
    static sanitizeString(input: string): string;
    static isValidUUID(uuid: string): boolean;
}
export declare class DateUtils {
    static getMinutesFromNow(minutes: number): Date;
    static getHoursFromNow(hours: number): Date;
    static getDaysFromNow(days: number): Date;
    static isExpired(date: Date): boolean;
    static formatDate(date: Date): string;
    static formatDateTime(date: Date): string;
}
export declare class StringUtils {
    static generateSlug(input: string): string;
    static capitalize(input: string): string;
    static generateRandomString(length: number): string;
    static maskEmail(email: string): string;
    static truncate(text: string, maxLength: number): string;
}
