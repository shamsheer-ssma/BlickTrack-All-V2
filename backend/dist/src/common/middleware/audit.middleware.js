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
exports.AuditMiddleware = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let AuditMiddleware = class AuditMiddleware {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async use(req, res, next) {
        const startTime = Date.now();
        const originalJson = res.json;
        let responseData;
        let statusCode;
        res.json = function (data) {
            responseData = data;
            statusCode = res.statusCode;
            return originalJson.call(this, data);
        };
        next();
        res.on('finish', async () => {
            try {
                const endTime = Date.now();
                const duration = endTime - startTime;
                if (this.shouldAudit(req)) {
                    await this.createAuditLog(req, res, duration, statusCode >= 400);
                }
            }
            catch (error) {
                console.error('Audit logging failed:', error);
            }
        });
    }
    shouldAudit(req) {
        const path = req.path.toLowerCase();
        const method = req.method.toUpperCase();
        if (path.includes('/health') || path.includes('/docs') || path.includes('/static')) {
            return false;
        }
        if (path.includes('/auth/')) {
            return true;
        }
        if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
            return true;
        }
        if (method === 'GET' && req.user) {
            return path.includes('/admin/') ||
                path.includes('/users/') ||
                path.includes('/tenants/') ||
                path.includes('/sbom/') ||
                path.includes('/threat-model/');
        }
        return false;
    }
    async createAuditLog(req, res, duration, isError) {
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
    getActionFromRequest(req) {
        const method = req.method.toUpperCase();
        const path = req.path.toLowerCase();
        if (path.includes('/auth/login'))
            return 'LOGIN';
        if (path.includes('/auth/logout'))
            return 'LOGOUT';
        if (path.includes('/auth/register'))
            return 'REGISTER';
        if (path.includes('/auth/forgot-password'))
            return 'FORGOT_PASSWORD';
        if (path.includes('/auth/reset-password'))
            return 'RESET_PASSWORD';
        if (path.includes('/auth/verify-email'))
            return 'VERIFY_EMAIL';
        if (path.includes('/auth/change-password'))
            return 'CHANGE_PASSWORD';
        if (method === 'POST')
            return 'CREATE';
        if (method === 'PUT' || method === 'PATCH')
            return 'UPDATE';
        if (method === 'DELETE')
            return 'DELETE';
        if (method === 'GET')
            return 'VIEW';
        return 'UNKNOWN';
    }
    getResourceFromRequest(req) {
        const path = req.path.toLowerCase();
        if (path.includes('/auth/'))
            return 'authentication';
        if (path.includes('/users/'))
            return 'user';
        if (path.includes('/tenants/'))
            return 'tenant';
        if (path.includes('/admin/'))
            return 'admin';
        if (path.includes('/sbom/'))
            return 'sbom';
        if (path.includes('/threat-model/'))
            return 'threat_model';
        if (path.includes('/vulnerabilities/'))
            return 'vulnerability';
        return 'unknown';
    }
    getClientIP(req) {
        return (req.headers['x-forwarded-for'] ||
            req.headers['x-real-ip'] ||
            req.connection?.remoteAddress ||
            req.socket?.remoteAddress ||
            'unknown');
    }
};
exports.AuditMiddleware = AuditMiddleware;
exports.AuditMiddleware = AuditMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuditMiddleware);
//# sourceMappingURL=audit.middleware.js.map