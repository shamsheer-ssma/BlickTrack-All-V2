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
exports.TenantsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const logger_service_1 = require("../common/services/logger.service");
const config_1 = require("@nestjs/config");
let TenantsService = class TenantsService {
    prisma;
    configService;
    logger;
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
        this.logger = new logger_service_1.LoggerService(configService);
        this.logger.setContext('TenantsService');
        this.logger.debug('TenantsService initialized');
    }
    async createTenant(createTenantDto) {
        this.logger.debug('Creating new tenant', { name: createTenantDto.name, slug: createTenantDto.slug });
        const existingTenant = await this.prisma.tenant.findUnique({
            where: { slug: createTenantDto.slug }
        });
        if (existingTenant) {
            this.logger.warn('Tenant creation failed - slug already exists', { slug: createTenantDto.slug });
            throw new common_1.ConflictException(`Tenant with slug '${createTenantDto.slug}' already exists`);
        }
        if (createTenantDto.domain) {
            const existingDomain = await this.prisma.tenant.findUnique({
                where: { domain: createTenantDto.domain }
            });
            if (existingDomain) {
                this.logger.warn('Tenant creation failed - domain already exists', { domain: createTenantDto.domain });
                throw new common_1.ConflictException(`Tenant with domain '${createTenantDto.domain}' already exists`);
            }
        }
        try {
            const tenant = await this.prisma.tenant.create({
                data: {
                    ...createTenantDto,
                    status: createTenantDto.status || 'TRIAL',
                    isActive: createTenantDto.isActive ?? true,
                    isTrial: createTenantDto.isTrial ?? true,
                    mfaRequired: createTenantDto.mfaRequired ?? false,
                    passwordPolicy: createTenantDto.passwordPolicy || { minLength: 8, requireSpecialChar: true },
                    sessionTimeout: createTenantDto.sessionTimeout || 480,
                    complianceFrameworks: createTenantDto.complianceFrameworks || [],
                    apiQuotaDaily: createTenantDto.apiQuotaDaily || 10000,
                    settings: createTenantDto.settings || {},
                },
                include: {
                    plan: true,
                    configuration: true,
                }
            });
            this.logger.info('Tenant created successfully', {
                tenantId: tenant.id,
                name: tenant.name,
                slug: tenant.slug
            });
            return this.mapTenantToResponseDto(tenant);
        }
        catch (error) {
            this.logger.error('Failed to create tenant', error, { createTenantDto });
            throw error;
        }
    }
    async getTenants(query) {
        this.logger.debug('Getting tenants with query', { query });
        const { page = 1, limit = 10, search, status, isActive, isTrial, sortBy = 'createdAt', sortOrder = 'desc' } = query;
        const skip = (page - 1) * limit;
        const where = {
            deletedAt: null,
        };
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { slug: { contains: search, mode: 'insensitive' } },
                { domain: { contains: search, mode: 'insensitive' } }
            ];
        }
        if (status) {
            where.status = status;
        }
        if (isActive !== undefined) {
            where.isActive = isActive;
        }
        if (isTrial !== undefined) {
            where.isTrial = isTrial;
        }
        const orderBy = {};
        orderBy[sortBy] = sortOrder;
        try {
            const [tenants, total] = await Promise.all([
                this.prisma.tenant.findMany({
                    where,
                    orderBy,
                    skip,
                    take: limit,
                    include: {
                        plan: true,
                        configuration: true,
                        _count: {
                            select: {
                                users: true,
                                projects: true,
                            }
                        }
                    }
                }),
                this.prisma.tenant.count({ where })
            ]);
            const totalPages = Math.ceil(total / limit);
            this.logger.debug('Tenants retrieved successfully', {
                count: tenants.length,
                total,
                page,
                totalPages
            });
            return {
                tenants: tenants.map(tenant => this.mapTenantToResponseDto(tenant)),
                total,
                page,
                limit,
                totalPages
            };
        }
        catch (error) {
            this.logger.error('Failed to get tenants', error, { query });
            throw error;
        }
    }
    async getTenantById(tenantId) {
        this.logger.debug('Getting tenant by ID', { tenantId });
        const tenant = await this.prisma.tenant.findUnique({
            where: {
                id: tenantId,
                deletedAt: null
            },
            include: {
                plan: true,
                configuration: true,
                _count: {
                    select: {
                        users: true,
                        projects: true,
                        securityProjects: true,
                    }
                }
            }
        });
        if (!tenant) {
            this.logger.warn('Tenant not found', { tenantId });
            throw new common_1.NotFoundException(`Tenant with ID ${tenantId} not found`);
        }
        this.logger.debug('Tenant retrieved successfully', {
            tenantId,
            name: tenant.name,
            userCount: tenant._count.users,
            projectCount: tenant._count.projects
        });
        return this.mapTenantToResponseDto(tenant);
    }
    async updateTenant(tenantId, updateTenantDto) {
        this.logger.debug('Updating tenant', { tenantId, updateData: updateTenantDto });
        const existingTenant = await this.prisma.tenant.findUnique({
            where: {
                id: tenantId,
                deletedAt: null
            }
        });
        if (!existingTenant) {
            this.logger.warn('Tenant update failed - tenant not found', { tenantId });
            throw new common_1.NotFoundException(`Tenant with ID ${tenantId} not found`);
        }
        if (updateTenantDto.slug && updateTenantDto.slug !== existingTenant.slug) {
            const slugExists = await this.prisma.tenant.findUnique({
                where: { slug: updateTenantDto.slug }
            });
            if (slugExists) {
                this.logger.warn('Tenant update failed - slug already exists', {
                    tenantId,
                    newSlug: updateTenantDto.slug
                });
                throw new common_1.ConflictException(`Tenant with slug '${updateTenantDto.slug}' already exists`);
            }
        }
        if (updateTenantDto.domain && updateTenantDto.domain !== existingTenant.domain) {
            const domainExists = await this.prisma.tenant.findUnique({
                where: { domain: updateTenantDto.domain }
            });
            if (domainExists) {
                this.logger.warn('Tenant update failed - domain already exists', {
                    tenantId,
                    newDomain: updateTenantDto.domain
                });
                throw new common_1.ConflictException(`Tenant with domain '${updateTenantDto.domain}' already exists`);
            }
        }
        try {
            const updatedTenant = await this.prisma.tenant.update({
                where: { id: tenantId },
                data: updateTenantDto,
                include: {
                    plan: true,
                    configuration: true,
                }
            });
            this.logger.info('Tenant updated successfully', {
                tenantId,
                name: updatedTenant.name,
                updatedFields: Object.keys(updateTenantDto)
            });
            return this.mapTenantToResponseDto(updatedTenant);
        }
        catch (error) {
            this.logger.error('Failed to update tenant', error, { tenantId, updateTenantDto });
            throw error;
        }
    }
    async deleteTenant(tenantId) {
        this.logger.debug('Deleting tenant', { tenantId });
        const existingTenant = await this.prisma.tenant.findUnique({
            where: {
                id: tenantId,
                deletedAt: null
            }
        });
        if (!existingTenant) {
            this.logger.warn('Tenant deletion failed - tenant not found', { tenantId });
            throw new common_1.NotFoundException(`Tenant with ID ${tenantId} not found`);
        }
        try {
            await this.prisma.tenant.update({
                where: { id: tenantId },
                data: {
                    deletedAt: new Date(),
                    isActive: false,
                }
            });
            this.logger.info('Tenant deleted successfully', {
                tenantId,
                name: existingTenant.name
            });
            return { message: 'Tenant deleted successfully' };
        }
        catch (error) {
            this.logger.error('Failed to delete tenant', error, { tenantId });
            throw error;
        }
    }
    async getTenantStats(tenantId) {
        this.logger.debug('Getting tenant statistics', { tenantId });
        const tenant = await this.prisma.tenant.findUnique({
            where: {
                id: tenantId,
                deletedAt: null
            }
        });
        if (!tenant) {
            this.logger.warn('Tenant stats failed - tenant not found', { tenantId });
            throw new common_1.NotFoundException(`Tenant with ID ${tenantId} not found`);
        }
        try {
            const [totalUsers, totalProjects, totalThreatModels, totalSecurityProjects, activeUsers, complianceFrameworks] = await Promise.all([
                this.prisma.user.count({
                    where: {
                        tenantId,
                        deletedAt: null
                    }
                }),
                this.prisma.project.count({
                    where: {
                        tenantId,
                        deletedAt: null
                    }
                }),
                this.prisma.threatModel.count({
                    where: {
                        tenantId
                    }
                }),
                this.prisma.securityProject.count({
                    where: {
                        tenantId,
                        deletedAt: null
                    }
                }),
                this.prisma.user.count({
                    where: {
                        tenantId,
                        deletedAt: null,
                        lastLoginAt: {
                            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                        }
                    }
                }),
                this.prisma.project.findMany({
                    where: {
                        tenantId,
                        deletedAt: null
                    },
                    select: { complianceFrameworks: true }
                })
            ]);
            const uniqueFrameworks = Array.from(new Set(complianceFrameworks
                .flatMap(p => p.complianceFrameworks)
                .filter(Boolean)));
            const stats = {
                totalUsers,
                totalProjects,
                totalThreatModels,
                totalSecurityProjects,
                activeUsers,
                storageUsed: 0,
                apiCallsToday: 0,
                complianceFrameworks: uniqueFrameworks
            };
            this.logger.debug('Tenant statistics retrieved successfully', {
                tenantId,
                stats
            });
            return stats;
        }
        catch (error) {
            this.logger.error('Failed to get tenant statistics', error, { tenantId });
            throw error;
        }
    }
    mapTenantToResponseDto(tenant) {
        return {
            id: tenant.id,
            name: tenant.name,
            slug: tenant.slug,
            domain: tenant.domain,
            planId: tenant.planId,
            plan: tenant.plan ? {
                id: tenant.plan.id,
                name: tenant.plan.name,
                displayName: tenant.plan.displayName,
                tier: tenant.plan.name
            } : undefined,
            maxUsers: tenant.maxUsers,
            maxProjects: tenant.maxProjects,
            status: tenant.status,
            isActive: tenant.isActive,
            isTrial: tenant.isTrial,
            trialExpiresAt: tenant.trialExpiresAt,
            mfaRequired: tenant.mfaRequired,
            passwordPolicy: tenant.passwordPolicy,
            sessionTimeout: tenant.sessionTimeout,
            complianceFrameworks: tenant.complianceFrameworks,
            dataResidency: tenant.dataResidency,
            apiQuotaDaily: tenant.apiQuotaDaily,
            webhookUrl: tenant.webhookUrl,
            settings: tenant.settings,
            createdAt: tenant.createdAt,
            updatedAt: tenant.updatedAt,
            deletedAt: tenant.deletedAt
        };
    }
    async getTenantFeatures(tenantId) {
        const tenant = await this.prisma.tenant.findUnique({
            where: { id: tenantId },
            include: {
                configuration: true,
            },
        });
        if (!tenant) {
            throw new common_1.NotFoundException(`Tenant with ID ${tenantId} not found`);
        }
        if (!tenant.configuration) {
            const config = await this.prisma.tenantConfiguration.create({
                data: {
                    tenantId: tenant.id,
                },
            });
            return this.mapConfigToDto(config);
        }
        return this.mapConfigToDto(tenant.configuration);
    }
    async updateTenantFeatures(tenantId, updateDto) {
        const tenant = await this.prisma.tenant.findUnique({
            where: { id: tenantId },
        });
        if (!tenant) {
            throw new common_1.NotFoundException(`Tenant with ID ${tenantId} not found`);
        }
        const config = await this.prisma.tenantConfiguration.upsert({
            where: { tenantId },
            update: {
                ...updateDto,
            },
            create: {
                tenantId,
                ...updateDto,
            },
        });
        return this.mapConfigToDto(config);
    }
    async getTenantBySlug(slug) {
        const tenant = await this.prisma.tenant.findUnique({
            where: { slug },
            include: {
                configuration: true,
                plan: true,
            },
        });
        if (!tenant) {
            throw new common_1.NotFoundException(`Tenant with slug ${slug} not found`);
        }
        return tenant;
    }
    mapConfigToDto(config) {
        return {
            enableRegistration: config.enableRegistration ?? true,
            enable2FA: config.enable2FA ?? false,
            enableLandingPage: config.enableLandingPage ?? true,
            enableDarkMode: config.enableDarkMode ?? true,
            ssoEnabled: config.ssoEnabled ?? false,
            ssoProvider: config.ssoProvider,
            ssoClientId: config.ssoClientId,
            theme: config.theme ?? 'corporate',
            primaryColor: config.primaryColor ?? '#2563eb',
            logoUrl: config.logoUrl,
        };
    }
};
exports.TenantsService = TenantsService;
exports.TenantsService = TenantsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], TenantsService);
//# sourceMappingURL=tenants.service.js.map