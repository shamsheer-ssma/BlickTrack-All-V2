"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var GlobalExceptionFilter_1, HttpExceptionFilter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpExceptionFilter = exports.GlobalExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const library_1 = require("@prisma/client/runtime/library");
let GlobalExceptionFilter = GlobalExceptionFilter_1 = class GlobalExceptionFilter {
    logger = new common_1.Logger(GlobalExceptionFilter_1.name);
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        let status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let error = 'InternalServerError';
        if (exception instanceof common_1.HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();
            if (typeof exceptionResponse === 'string') {
                message = exceptionResponse;
            }
            else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
                message = exceptionResponse.message || exception.message;
                error = exceptionResponse.error || exception.constructor.name;
            }
        }
        else if (exception instanceof library_1.PrismaClientKnownRequestError) {
            const prismaError = this.handlePrismaError(exception);
            status = prismaError.status;
            message = prismaError.message;
            error = prismaError.error;
        }
        else if (exception instanceof Error) {
            message = exception.message;
            error = exception.constructor.name;
        }
        this.logger.error(`${request.method} ${request.url} - ${status} - ${message}`, exception instanceof Error ? exception.stack : undefined);
        const errorResponse = {
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            error,
            message,
            ...(process.env.NODE_ENV === 'development' && {
                stack: exception instanceof Error ? exception.stack : undefined,
            }),
        };
        response.status(status).json(errorResponse);
    }
    handlePrismaError(exception) {
        switch (exception.code) {
            case 'P2002':
                const field = exception.meta?.target;
                const fieldName = field ? field[0] : 'field';
                return {
                    status: common_1.HttpStatus.CONFLICT,
                    message: `${fieldName} already exists`,
                    error: 'ConflictError',
                };
            case 'P2025':
                return {
                    status: common_1.HttpStatus.NOT_FOUND,
                    message: 'Record not found',
                    error: 'NotFoundError',
                };
            case 'P2003':
                return {
                    status: common_1.HttpStatus.BAD_REQUEST,
                    message: 'Invalid reference to related record',
                    error: 'BadRequestError',
                };
            case 'P2014':
                return {
                    status: common_1.HttpStatus.BAD_REQUEST,
                    message: 'Invalid ID provided',
                    error: 'BadRequestError',
                };
            default:
                return {
                    status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Database error occurred',
                    error: 'DatabaseError',
                };
        }
    }
};
exports.GlobalExceptionFilter = GlobalExceptionFilter;
exports.GlobalExceptionFilter = GlobalExceptionFilter = GlobalExceptionFilter_1 = __decorate([
    (0, common_1.Catch)()
], GlobalExceptionFilter);
let HttpExceptionFilter = HttpExceptionFilter_1 = class HttpExceptionFilter {
    logger = new common_1.Logger(HttpExceptionFilter_1.name);
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception.getStatus();
        const exceptionResponse = exception.getResponse();
        let message;
        let error;
        if (typeof exceptionResponse === 'string') {
            message = exceptionResponse;
            error = exception.constructor.name;
        }
        else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
            message = exceptionResponse.message || exception.message;
            error = exceptionResponse.error || exception.constructor.name;
        }
        else {
            message = exception.message;
            error = exception.constructor.name;
        }
        if (status >= 500) {
            this.logger.error(`${request.method} ${request.url} - ${status} - ${message}`, exception.stack);
        }
        else {
            this.logger.warn(`${request.method} ${request.url} - ${status} - ${message}`);
        }
        const errorResponse = {
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            error,
            message,
        };
        response.status(status).json(errorResponse);
    }
};
exports.HttpExceptionFilter = HttpExceptionFilter;
exports.HttpExceptionFilter = HttpExceptionFilter = HttpExceptionFilter_1 = __decorate([
    (0, common_1.Catch)(common_1.HttpException)
], HttpExceptionFilter);
//# sourceMappingURL=http-exception.filter.js.map