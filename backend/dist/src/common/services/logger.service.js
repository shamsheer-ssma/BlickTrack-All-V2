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
exports.LoggerService = exports.LogLevel = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["DEBUG"] = 0] = "DEBUG";
    LogLevel[LogLevel["INFO"] = 1] = "INFO";
    LogLevel[LogLevel["WARN"] = 2] = "WARN";
    LogLevel[LogLevel["ERROR"] = 3] = "ERROR";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
let LoggerService = class LoggerService {
    configService;
    context;
    debugEnabled;
    logLevel;
    isProduction;
    constructor(configService) {
        this.configService = configService;
        this.debugEnabled = this.configService.get('DEBUG_ENABLED', false);
        this.isProduction = this.configService.get('NODE_ENV') === 'production';
        const logLevelString = this.configService.get('LOG_LEVEL', this.isProduction ? 'info' : 'debug');
        this.logLevel = this.parseLogLevel(logLevelString);
        if (!this.isProduction) {
            console.log(`🔧 [Logger] Initialized - Debug: ${this.debugEnabled}, Level: ${logLevelString}, Env: ${this.configService.get('NODE_ENV')}`);
        }
    }
    setContext(context) {
        this.context = context;
    }
    debug(message, data) {
        if (!this.shouldLog(LogLevel.DEBUG)) {
            return;
        }
        const timestamp = new Date().toISOString();
        const contextStr = this.context ? `[${this.context}]` : '';
        if (!this.isProduction) {
            console.log(`\x1b[36m🔍 [DEBUG] ${timestamp} ${contextStr}\x1b[0m ${message}`);
            if (data) {
                console.log('\x1b[36m   Data:\x1b[0m', JSON.stringify(data, null, 2));
            }
        }
        else {
            console.log(JSON.stringify({
                level: 'debug',
                timestamp,
                context: this.context,
                message,
                data,
            }));
        }
    }
    info(message, data) {
        if (!this.shouldLog(LogLevel.INFO)) {
            return;
        }
        const timestamp = new Date().toISOString();
        const contextStr = this.context ? `[${this.context}]` : '';
        if (!this.isProduction) {
            console.log(`\x1b[32m✅ [INFO] ${timestamp} ${contextStr}\x1b[0m ${message}`);
            if (data) {
                console.log('\x1b[32m   Data:\x1b[0m', JSON.stringify(data, null, 2));
            }
        }
        else {
            console.log(JSON.stringify({
                level: 'info',
                timestamp,
                context: this.context,
                message,
                data,
            }));
        }
    }
    warn(message, data) {
        if (!this.shouldLog(LogLevel.WARN)) {
            return;
        }
        const timestamp = new Date().toISOString();
        const contextStr = this.context ? `[${this.context}]` : '';
        if (!this.isProduction) {
            console.warn(`\x1b[33m⚠️  [WARN] ${timestamp} ${contextStr}\x1b[0m ${message}`);
            if (data) {
                console.warn('\x1b[33m   Data:\x1b[0m', JSON.stringify(data, null, 2));
            }
        }
        else {
            console.warn(JSON.stringify({
                level: 'warn',
                timestamp,
                context: this.context,
                message,
                data,
            }));
        }
    }
    error(message, error, data) {
        if (!this.shouldLog(LogLevel.ERROR)) {
            return;
        }
        const timestamp = new Date().toISOString();
        const contextStr = this.context ? `[${this.context}]` : '';
        if (!this.isProduction) {
            console.error(`\x1b[31m❌ [ERROR] ${timestamp} ${contextStr}\x1b[0m ${message}`);
            if (error) {
                if (error instanceof Error) {
                    console.error('\x1b[31m   Error:\x1b[0m', error.message);
                    console.error('\x1b[31m   Stack:\x1b[0m', error.stack);
                }
                else {
                    console.error('\x1b[31m   Error:\x1b[0m', error);
                }
            }
            if (data) {
                console.error('\x1b[31m   Data:\x1b[0m', JSON.stringify(data, null, 2));
            }
        }
        else {
            console.error(JSON.stringify({
                level: 'error',
                timestamp,
                context: this.context,
                message,
                error: error instanceof Error ? {
                    message: error.message,
                    stack: error.stack,
                    name: error.name,
                } : error,
                data,
            }));
        }
    }
    parseLogLevel(level) {
        switch (level.toLowerCase()) {
            case 'debug':
                return LogLevel.DEBUG;
            case 'info':
                return LogLevel.INFO;
            case 'warn':
                return LogLevel.WARN;
            case 'error':
                return LogLevel.ERROR;
            default:
                return LogLevel.INFO;
        }
    }
    shouldLog(messageLevel) {
        if (messageLevel === LogLevel.DEBUG) {
            return this.debugEnabled || this.logLevel === LogLevel.DEBUG;
        }
        return messageLevel >= this.logLevel;
    }
};
exports.LoggerService = LoggerService;
exports.LoggerService = LoggerService = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.TRANSIENT }),
    __metadata("design:paramtypes", [config_1.ConfigService])
], LoggerService);
//# sourceMappingURL=logger.service.js.map