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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const jwt_1 = require("@nestjs/jwt");
const hashing_service_1 = require("../common/services/hashing.service");
let AuthService = class AuthService {
    prisma;
    jwtService;
    hashingService;
    constructor(prisma, jwtService, hashingService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.hashingService = hashingService;
    }
    async validateUser(email, password) {
        console.log('🔍 [AUTH DEBUG] Validating user:', email);
        const user = await this.prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                passwordHash: true,
                userType: true,
                isActive: true,
                isEmailVerified: true,
                tenantId: true,
            },
        });
        if (!user) {
            console.log('❌ [AUTH DEBUG] User not found:', email);
            return null;
        }
        console.log('✅ [AUTH DEBUG] User found:', {
            email: user.email,
            isActive: user.isActive,
            isEmailVerified: user.isEmailVerified,
            hasPasswordHash: !!user.passwordHash
        });
        if (!user.isActive) {
            console.log('❌ [AUTH DEBUG] Account deactivated:', email);
            throw new common_1.UnauthorizedException('Account has been deactivated');
        }
        if (!user.isEmailVerified) {
            console.log('❌ [AUTH DEBUG] Email not verified:', email);
            throw new common_1.UnauthorizedException('Email not verified');
        }
        if (!user.passwordHash) {
            console.log('❌ [AUTH DEBUG] No password hash:', email);
            return null;
        }
        const isPasswordValid = await this.hashingService.compare(password, user.passwordHash);
        console.log('🔐 [AUTH DEBUG] Password validation result:', isPasswordValid);
        if (!isPasswordValid) {
            console.log('❌ [AUTH DEBUG] Password validation failed:', email);
            return null;
        }
        console.log('✅ [AUTH DEBUG] Authentication successful:', email);
        const { passwordHash: _, ...result } = user;
        return result;
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        console.log('🔍 [AUTH DEBUG] Login attempt for:', email);
        const user = await this.validateUser(email, password);
        if (!user) {
            console.log('❌ [AUTH DEBUG] Login failed for:', email);
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.userType === 'ADMIN' ?
                (user.email === 'admin@blicktrack.com' ? 'SUPER_ADMIN' : 'TENANT_ADMIN') :
                'END_USER',
            tenantId: user.tenantId,
        };
        const access_token = this.jwtService.sign(payload);
        console.log('✅ [AUTH DEBUG] JWT token generated for:', email);
        return {
            access_token,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                userType: user.userType,
                tenantId: user.tenantId,
            },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        hashing_service_1.HashingService])
], AuthService);
//# sourceMappingURL=auth-simple.service.js.map