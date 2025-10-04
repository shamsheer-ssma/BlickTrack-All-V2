"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcryptjs"));
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createUserDto) {
        const { password, ...userData } = createUserDto;
        let hashedPassword;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 12);
        }
        const user = await this.prisma.user.create({
            data: {
                ...userData,
                ...(hashedPassword && { passwordHash: hashedPassword }),
            },
            include: {
                tenant: true,
                department: true,
            },
        });
        return this.toUserResponse(user);
    }
    async findAll(tenantId) {
        const users = await this.prisma.user.findMany({
            where: { tenantId },
            include: {
                tenant: true,
                department: true,
                orgUnit: true,
            },
        });
        return users.map(user => this.toUserResponse(user));
    }
    async findOne(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: {
                tenant: true,
                department: true,
                orgUnit: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return this.toUserResponse(user);
    }
    async findByEmail(email) {
        return this.prisma.user.findUnique({
            where: { email },
            include: {
                tenant: true,
                department: true,
                orgUnit: true,
            },
        });
    }
    async update(id, updateUserDto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!existingUser) {
            throw new common_1.NotFoundException('User not found');
        }
        const { password, ...updateData } = updateUserDto;
        let hashedPassword;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 12);
        }
        const user = await this.prisma.user.update({
            where: { id },
            data: {
                ...updateData,
                ...(hashedPassword && {
                    password: hashedPassword,
                    passwordHash: hashedPassword
                }),
                ...(updateData.firstName || updateData.lastName) && {
                    name: `${updateData.firstName || existingUser.firstName} ${updateData.lastName || existingUser.lastName}`,
                },
            },
            include: {
                tenant: true,
                department: true,
                orgUnit: true,
            },
        });
        return this.toUserResponse(user);
    }
    async remove(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        await this.prisma.user.update({
            where: { id },
            data: {
                status: client_1.UserStatus.INACTIVE,
                isActive: false,
                deletedAt: new Date(),
            },
        });
    }
    async updateRole(id, role) {
        const user = await this.prisma.user.update({
            where: { id },
            data: { role },
            include: {
                tenant: true,
                department: true,
                orgUnit: true,
            },
        });
        return this.toUserResponse(user);
    }
    async updateStatus(id, status) {
        const user = await this.prisma.user.update({
            where: { id },
            data: {
                status,
                isActive: status === client_1.UserStatus.ACTIVE,
            },
            include: {
                tenant: true,
                department: true,
                orgUnit: true,
            },
        });
        return this.toUserResponse(user);
    }
    async getInternalUsers(tenantId, filters = {}) {
        const { department, role, page = 1, limit = 10 } = filters;
        const skip = (page - 1) * limit;
        return this.prisma.user.findMany({
            where: {
                tenantId,
                userType: client_1.UserType.REGULAR,
                ...(department && { departmentId: department }),
                ...(role && { role }),
            },
            include: {
                tenant: true,
                department: true,
            },
            skip,
            take: limit,
        });
    }
    async createInternalUser(tenantId, createUserDto) {
        return this.create({ ...createUserDto, tenantId });
    }
    async getDepartmentUsers(tenantId, departmentId, includeExternal = false) {
        return this.prisma.user.findMany({
            where: {
                tenantId,
                departmentId,
                ...(includeExternal ? {} : { userType: client_1.UserType.REGULAR }),
            },
            include: {
                tenant: true,
                department: true,
            },
        });
    }
    async getUsersByRole(tenantId, role) {
        return this.prisma.user.findMany({
            where: {
                tenantId,
                role,
            },
            include: {
                tenant: true,
                department: true,
            },
        });
    }
    async activateUser(tenantId, userId) {
        const user = await this.prisma.user.update({
            where: {
                id: userId,
                tenantId,
            },
            data: {
                status: client_1.UserStatus.ACTIVE,
                isActive: true,
            },
            include: {
                tenant: true,
                department: true,
            },
        });
        return this.toUserResponse(user);
    }
    async deactivateUser(tenantId, userId) {
        const user = await this.prisma.user.update({
            where: {
                id: userId,
                tenantId,
            },
            data: {
                status: client_1.UserStatus.INACTIVE,
                isActive: false,
            },
            include: {
                tenant: true,
                department: true,
            },
        });
        return this.toUserResponse(user);
    }
    async getUserAnalytics(tenantId) {
        const totalUsers = await this.prisma.user.count({
            where: { tenantId },
        });
        const activeUsers = await this.prisma.user.count({
            where: { tenantId, status: client_1.UserStatus.ACTIVE },
        });
        const usersByRole = await this.prisma.user.groupBy({
            by: ['role'],
            where: { tenantId },
            _count: true,
        });
        const usersByType = await this.prisma.user.groupBy({
            by: ['userType'],
            where: { tenantId },
            _count: true,
        });
        return {
            totalUsers,
            activeUsers,
            inactiveUsers: totalUsers - activeUsers,
            usersByRole,
            usersByType,
        };
    }
    toUserResponse(user) {
        const { password, passwordHash, ...userResponse } = user;
        return userResponse;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map