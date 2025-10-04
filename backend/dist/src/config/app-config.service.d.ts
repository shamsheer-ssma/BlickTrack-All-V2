import { ConfigService } from '@nestjs/config';
export declare class AppConfigService {
    private configService;
    constructor(configService: ConfigService);
    get port(): number;
    get nodeEnv(): string;
    get isDevelopment(): boolean;
    get isProduction(): boolean;
    get enableDebugFeatures(): boolean;
    get enableHealthEndpoints(): boolean;
    get enableVerboseLogging(): boolean;
    get enableConsoleLogging(): boolean;
    get databaseUrl(): string;
    get redisUrl(): string;
    get jwtSecret(): string;
    get jwtExpiresIn(): string;
    get corsOrigin(): string | string[];
    get rateLimitWindowMs(): number;
    get rateLimitMaxRequests(): number;
    get bcryptRounds(): number;
    get smtpHost(): string;
    get smtpPort(): number;
    get smtpUser(): string;
    get smtpPass(): string;
    get haveibeenpwnedApiKey(): string;
    get twilioAccountSid(): string;
    get twilioAuthToken(): string;
    validateConfig(): void;
}
