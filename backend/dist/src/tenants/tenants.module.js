"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantsModule = void 0;
const common_1 = require("@nestjs/common");
const tenants_controller_1 = require("./tenants.controller");
const tenants_service_1 = require("./tenants.service");
const tenant_configuration_controller_1 = require("./tenant-configuration.controller");
const tenant_configuration_service_1 = require("./tenant-configuration.service");
const prisma_module_1 = require("../prisma/prisma.module");
const logger_service_1 = require("../common/services/logger.service");
const config_1 = require("@nestjs/config");
let TenantsModule = class TenantsModule {
};
exports.TenantsModule = TenantsModule;
exports.TenantsModule = TenantsModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [tenants_controller_1.TenantsController, tenant_configuration_controller_1.TenantConfigurationController],
        providers: [tenants_service_1.TenantsService, tenant_configuration_service_1.TenantConfigurationService, logger_service_1.LoggerService, config_1.ConfigService],
        exports: [tenants_service_1.TenantsService, tenant_configuration_service_1.TenantConfigurationService],
    })
], TenantsModule);
//# sourceMappingURL=tenants.module.js.map