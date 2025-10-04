"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppConfigService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let AppConfigService = class AppConfigService {
    configService;
    constructor(configService) {
        this.configService = configService;
    }
    get port() {
        return this.configService.get('PORT') || 3001;
    }
    get nodeEnv() {
        return this.configService.get('NODE_ENV') || 'development';
    }
    get isDevelopment() {
        return this.nodeEnv === 'development';
    }
    get isProduction() {
        return this.nodeEnv === 'production';
    }
    get enableDebugFeatures() {
        return this.configService.get('ENABLE_DEBUG_FEATURES') === 'true' || this.isDevelopment;
    }
    get enableHealthEndpoints() {
        return this.configService.get('ENABLE_HEALTH_ENDPOINTS') === 'true' || this.isDevelopment;
    }
    get enableVerboseLogging() {
        return this.configService.get('ENABLE_VERBOSE_LOGGING') === 'true' || this.isDevelopment;
    }
    get enableConsoleLogging() {
        return this.configService.get('ENABLE_CONSOLE_LOGGING') === 'true' || this.isDevelopment;
    }
    get databaseUrl() {
        return this.configService.get('DATABASE_URL') || '';
    }
    get redisUrl() {
        return this.configService.get('REDIS_URL') || 'redis://localhost:6379';
    }
    get jwtSecret() {
        return this.configService.get('JWT_SECRET') || 'fallback-secret';
    }
    get jwtExpiresIn() {
        return this.configService.get('JWT_EXPIRES_IN') || '7d';
    }
    get corsOrigin() {
        const origin = this.configService.get('CORS_ORIGIN');
        if (!origin)
            return 'http://localhost:3000';
        return origin.includes(',') ? origin.split(',').map(o => o.trim()) : origin;
    }
    get rateLimitWindowMs() {
        return this.configService.get('RATE_LIMIT_WINDOW_MS') || 900000;
    }
    get rateLimitMaxRequests() {
        return this.configService.get('RATE_LIMIT_MAX_REQUESTS') || 100;
    }
    get bcryptRounds() {
        return this.configService.get('BCRYPT_ROUNDS') || 12;
    }
    get smtpHost() {
        return this.configService.get('EMAIL_SMTP_HOST') || 'smtp.gmail.com';
    }
    get smtpPort() {
        return this.configService.get('EMAIL_SMTP_PORT') || 587;
    }
    get smtpUser() {
        return this.configService.get('EMAIL_USER') || '';
    }
    get smtpPass() {
        return this.configService.get('EMAIL_PASS') || '';
    }
    get haveibeenpwnedApiKey() {
        return this.configService.get('HAVEIBEENPWNED_API_KEY') || '';
    }
    get twilioAccountSid() {
        return this.configService.get('TWILIO_ACCOUNT_SID') || '';
    }
    get twilioAuthToken() {
        return this.configService.get('TWILIO_AUTH_TOKEN') || '';
    }
    validateConfig() {
        const requiredConfigs = [
            { key: 'DATABASE_URL', value: this.databaseUrl },
            { key: 'JWT_SECRET', value: this.jwtSecret },
        ];
        const missing = requiredConfigs.filter(config => !config.value);
        if (missing.length > 0) {
            throw new Error(`Missing required configuration: ${missing.map(c => c.key).join(', ')}`);
        }
    }
};
exports.AppConfigService = AppConfigService;
exports.AppConfigService = AppConfigService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AppConfigService);
//# sourceMappingURL=app-config.service.js.map