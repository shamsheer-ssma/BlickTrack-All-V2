"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
let AppService = class AppService {
    getHealthStatus() {
        return {
            status: 'OK',
            timestamp: new Date().toISOString(),
            service: 'BlickTrack API',
            version: '1.0.0',
            uptime: process.uptime(),
            environment: process.env.NODE_ENV || 'development',
        };
    }
    getApiInfo() {
        return {
            name: 'BlickTrack Cybersecurity Platform API',
            version: '1.0.0',
            description: 'Enterprise cybersecurity risk management and threat modeling platform',
            documentation: '/api/docs',
            features: [
                'Authentication & Authorization',
                'Multi-tenant Architecture',
                'SBOM Management',
                'Threat Modeling',
                'Audit Logging',
                'RBAC (Role-Based Access Control)',
            ],
            endpoints: {
                health: '/api/v1/health',
                docs: '/api/docs',
                auth: '/api/v1/auth/*',
            },
        };
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)()
], AppService);
//# sourceMappingURL=app.service.js.map