/**
 * File: http-exception.filter.ts
 * Purpose: HTTP exception filters for the BlickTrack backend API. Provides global error handling for HTTP exceptions and Prisma database errors. Implements consistent error response formatting and logging for better debugging and user experience.
 *
 * Key Functions / Components / Classes:
 *   - GlobalExceptionFilter: Catches all exceptions and formats responses
 *   - HttpExceptionFilter: Handles HTTP-specific exceptions
 *   - handlePrismaError: Converts Prisma errors to HTTP responses
 *   - Error logging: Logs errors with context information
 *
 * Inputs:
 *   - HTTP exceptions from controllers
 *   - Prisma database errors
 *   - General application errors
 *   - Request context and response objects
 *
 * Outputs:
 *   - Formatted error responses
 *   - Error logging and monitoring
 *   - Consistent error structure
 *   - Development vs production error details
 *
 * Dependencies:
 *   - NestJS exception filter system
 *   - Prisma client error types
 *   - Express request/response objects
 *   - Logger for error tracking
 *
 * Notes:
 *   - Implements comprehensive error handling
 *   - Provides consistent error response format
 *   - Handles Prisma database errors gracefully
 *   - Includes development vs production error details
 *   - Logs errors for monitoring and debugging
 */

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'InternalServerError';

    // Handle different types of exceptions
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        message = (exceptionResponse as any).message || exception.message;
        error = (exceptionResponse as any).error || exception.constructor.name;
      }
    } else if (exception instanceof PrismaClientKnownRequestError) {
      const prismaError = this.handlePrismaError(exception);
      status = prismaError.status;
      message = prismaError.message;
      error = prismaError.error;
    } else if (exception instanceof Error) {
      message = exception.message;
      error = exception.constructor.name;
    }

    // Log the error
    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${message}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    // Send error response
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

  private handlePrismaError(exception: PrismaClientKnownRequestError): {
    status: number;
    message: string;
    error: string;
  } {
    switch (exception.code) {
      case 'P2002':
        // Unique constraint failed
        const field = exception.meta?.target as string[] | undefined;
        const fieldName = field ? field[0] : 'field';
        return {
          status: HttpStatus.CONFLICT,
          message: `${fieldName} already exists`,
          error: 'ConflictError',
        };

      case 'P2025':
        // Record not found
        return {
          status: HttpStatus.NOT_FOUND,
          message: 'Record not found',
          error: 'NotFoundError',
        };

      case 'P2003':
        // Foreign key constraint failed
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Invalid reference to related record',
          error: 'BadRequestError',
        };

      case 'P2014':
        // Invalid ID
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Invalid ID provided',
          error: 'BadRequestError',
        };

      default:
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Database error occurred',
          error: 'DatabaseError',
        };
    }
  }
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let message: string | string[];
    let error: string;

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
      error = exception.constructor.name;
    } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      message = (exceptionResponse as any).message || exception.message;
      error = (exceptionResponse as any).error || exception.constructor.name;
    } else {
      message = exception.message;
      error = exception.constructor.name;
    }

    // Log non-client errors
    if (status >= 500) {
      this.logger.error(
        `${request.method} ${request.url} - ${status} - ${message}`,
        exception.stack,
      );
    } else {
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
}