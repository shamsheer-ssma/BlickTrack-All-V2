/**
 * File: audit.middleware.ts
 * Purpose: Audit logging middleware for the BlickTrack backend API. Automatically logs user actions, API requests, and security events for compliance and monitoring. Implements comprehensive audit trail for enterprise security requirements.
 *
 * Key Functions / Components / Classes:
 *   - AuditMiddleware: Main middleware for audit logging
 *   - shouldAudit: Determines which requests to audit
 *   - createAuditLog: Creates audit log entries
 *   - getActionFromRequest: Extracts action from HTTP method and path
 *   - getResourceFromRequest: Identifies resource being accessed
 *   - getClientIP: Extracts client IP address
 *
 * Inputs:
 *   - HTTP requests with user context
 *   - Response data and status codes
 *   - Request timing and duration
 *   - User authentication information
 *
 * Outputs:
 *   - Audit log entries in database
 *   - Security event tracking
 *   - Compliance audit trail
 *   - Performance monitoring data
 *
 * Dependencies:
 *   - PrismaService for database access
 *   - AuthenticatedRequest interface
 *   - Express middleware system
 *   - AuditLog database model
 *
 * Notes:
 *   - Implements comprehensive audit logging
 *   - Tracks all security-sensitive operations
 *   - Includes performance timing data
 *   - Supports compliance requirements
 *   - Handles error scenarios gracefully
 */

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthenticatedRequest } from './authentication.middleware';

@Injectable()
export class AuditMiddleware implements NestMiddleware {
  constructor(private prisma: PrismaService) {}

  async use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const startTime = Date.now();
    
    // Store original res.json to capture response
    const originalJson = res.json;
    let responseData: any;
    let statusCode: number;

    res.json = function(data: any) {
      responseData = data;
      statusCode = res.statusCode;
      return originalJson.call(this, data);
    };

    // Continue with request
    next();

    // Log after response is sent
    res.on('finish', async () => {
      try {
        const endTime = Date.now();
        const duration = endTime - startTime;

        // Only audit important endpoints and authenticated requests
        if (this.shouldAudit(req)) {
          await this.createAuditLog(req, res, duration, statusCode >= 400);
        }
      } catch (error) {
        console.error('Audit logging failed:', error);
      }
    });
  }

  private shouldAudit(req: AuthenticatedRequest): boolean {
    const path = req.path.toLowerCase();
    const method = req.method.toUpperCase();

    // Skip health checks and static files
    if (path.includes('/health') || path.includes('/docs') || path.includes('/static')) {
      return false;
    }

    // Audit all authentication related endpoints
    if (path.includes('/auth/')) {
      return true;
    }

    // Audit all modification operations
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      return true;
    }

    // Audit sensitive GET operations for authenticated users
    if (method === 'GET' && req.user) {
      return path.includes('/admin/') || 
             path.includes('/users/') || 
             path.includes('/tenants/') ||
             path.includes('/sbom/') ||
             path.includes('/threat-model/');
    }

    return false;
  }

  private async createAuditLog(
    req: AuthenticatedRequest, 
    res: Response, 
    duration: number,
    isError: boolean
  ) {
    const action = this.getActionFromRequest(req);
    const resource = this.getResourceFromRequest(req);

    await this.prisma.auditLog.create({
      data: {
        eventType: 'DATA_ACCESS',
        userId: req.user?.id,
        tenantId: req.user?.tenantId || 'unknown',
        action,
        resource,
        resourceId: req.params.id,
        ipAddress: this.getClientIP(req),
        userAgent: req.get('User-Agent'),
        method: req.method,
        endpoint: req.path,
        metadata: {
          duration,
          statusCode: res.statusCode,
          queryParams: req.query,
          bodyKeys: req.body ? Object.keys(req.body) : [],
        },
        success: !isError,
        errorMessage: isError ? res.statusMessage : null,
      },
    });
  }

  private getActionFromRequest(req: AuthenticatedRequest): string {
    const method = req.method.toUpperCase();
    const path = req.path.toLowerCase();

    // Authentication actions
    if (path.includes('/auth/login')) return 'LOGIN';
    if (path.includes('/auth/logout')) return 'LOGOUT';
    if (path.includes('/auth/register')) return 'REGISTER';
    if (path.includes('/auth/forgot-password')) return 'FORGOT_PASSWORD';
    if (path.includes('/auth/reset-password')) return 'RESET_PASSWORD';
    if (path.includes('/auth/verify-email')) return 'VERIFY_EMAIL';
    if (path.includes('/auth/change-password')) return 'CHANGE_PASSWORD';

    // Resource actions
    if (method === 'POST') return 'CREATE';
    if (method === 'PUT' || method === 'PATCH') return 'UPDATE';
    if (method === 'DELETE') return 'DELETE';
    if (method === 'GET') return 'VIEW';

    return 'UNKNOWN';
  }

  private getResourceFromRequest(req: AuthenticatedRequest): string {
    const path = req.path.toLowerCase();

    if (path.includes('/auth/')) return 'authentication';
    if (path.includes('/users/')) return 'user';
    if (path.includes('/tenants/')) return 'tenant';
    if (path.includes('/admin/')) return 'admin';
    if (path.includes('/sbom/')) return 'sbom';
    if (path.includes('/threat-model/')) return 'threat_model';
    if (path.includes('/vulnerabilities/')) return 'vulnerability';

    return 'unknown';
  }

  private getClientIP(req: AuthenticatedRequest): string {
    return (
      req.headers['x-forwarded-for'] as string ||
      req.headers['x-real-ip'] as string ||
      req.connection?.remoteAddress ||
      req.socket?.remoteAddress ||
      'unknown'
    );
  }
}