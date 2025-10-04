/**
 * File: logging.interceptor.ts
 * Purpose: Logging and transformation interceptors for the BlickTrack backend API. Provides request/response logging, performance monitoring, and response transformation. Implements consistent logging and response formatting across all endpoints.
 *
 * Key Functions / Components / Classes:
 *   - LoggingInterceptor: Logs HTTP requests and responses with timing
 *   - TransformInterceptor: Transforms responses for consistency
 *   - Request logging: Records method, URL, and response time
 *   - Response transformation: Standardizes response format
 *
 * Inputs:
 *   - HTTP requests from clients
 *   - Response data from controllers
 *   - Execution context from NestJS
 *   - Call handler for request processing
 *
 * Outputs:
 *   - Logged request/response information
 *   - Transformed response data
 *   - Performance timing metrics
 *   - Consistent response structure
 *
 * Dependencies:
 *   - NestJS interceptor system
 *   - RxJS for observable handling
 *   - Logger for request tracking
 *   - Execution context for request access
 *
 * Notes:
 *   - Implements comprehensive request logging
 *   - Provides performance monitoring
 *   - Transforms responses for consistency
 *   - Includes timing information for optimization
 *   - Supports debugging and monitoring
 */

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        const delay = Date.now() - now;
        
        this.logger.log(
          `${method} ${url} ${response.statusCode} - ${delay}ms`,
        );
      }),
    );
  }
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<any> {
    const request = context.switchToHttp().getRequest();
    
    return next.handle().pipe(
      tap((data) => {
        // Transform response for consistency
        if (data && typeof data === 'object') {
          return {
            success: true,
            timestamp: new Date().toISOString(),
            path: request.url,
            data,
          };
        }
        return data;
      }),
    );
  }
}