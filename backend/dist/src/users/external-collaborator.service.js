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
exports.ExternalCollaboratorService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let ExternalCollaboratorService = class ExternalCollaboratorService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createExternalCollaborator(tenantId, collaboratorDto) {
        const { projectIds, ...userData } = collaboratorDto;
        const collaborator = await this.prisma.user.create({
            data: {
                ...userData,
                tenantId,
                userType: client_1.UserType.EXTERNAL,
                role: collaboratorDto.role || client_1.UserRole.COLLABORATOR,
                status: client_1.UserStatus.PENDING,
                isActive: false,
            },
        });
        if (projectIds && projectIds.length > 0) {
            console.log('Project access assignment would be implemented here');
        }
        return collaborator;
    }
    async getExternalCollaborators(tenantId, filters) {
        return this.prisma.user.findMany({
            where: {
                tenantId,
                userType: client_1.UserType.EXTERNAL,
            },
            include: {
                tenant: true,
            },
        });
    }
    async inviteExternalCollaborator(tenantId, inviterId, collaboratorDto) {
        const collaborator = await this.createExternalCollaborator(tenantId, collaboratorDto);
        console.log(`Invitation sent to ${collaboratorDto.email} by user ${inviterId}`);
        return collaborator;
    }
    async extendContract(tenantId, collaboratorId, extensionDto) {
        return this.prisma.user.update({
            where: {
                id: collaboratorId,
                tenantId,
                userType: client_1.UserType.EXTERNAL,
            },
            data: {
                userType: client_1.UserType.EXTERNAL,
            },
        });
    }
    async revokeAccess(tenantId, collaboratorId) {
        return this.removeExternalCollaborator(tenantId, collaboratorId);
    }
    async removeExternalCollaborator(tenantId, collaboratorId) {
        return this.prisma.user.update({
            where: {
                id: collaboratorId,
                tenantId,
            },
            data: {
                isActive: false,
                status: client_1.UserStatus.INACTIVE,
                deletedAt: new Date(),
            },
        });
    }
    async updateCollaboratorRole(tenantId, collaboratorId, role) {
        return this.prisma.user.update({
            where: {
                id: collaboratorId,
                tenantId,
                userType: client_1.UserType.EXTERNAL,
            },
            data: {
                role,
            },
        });
    }
};
exports.ExternalCollaboratorService = ExternalCollaboratorService;
exports.ExternalCollaboratorService = ExternalCollaboratorService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ExternalCollaboratorService);
//# sourceMappingURL=external-collaborator.service.js.map