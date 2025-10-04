import { ConfigService } from '@nestjs/config';
export declare enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3
}
export declare class LoggerService {
    private configService;
    private context?;
    private readonly debugEnabled;
    private readonly logLevel;
    private readonly isProduction;
    constructor(configService: ConfigService);
    setContext(context: string): void;
    debug(message: string, data?: any): void;
    info(message: string, data?: any): void;
    warn(message: string, data?: any): void;
    error(message: string, error?: Error | string, data?: any): void;
    private parseLogLevel;
    private shouldLog;
}
