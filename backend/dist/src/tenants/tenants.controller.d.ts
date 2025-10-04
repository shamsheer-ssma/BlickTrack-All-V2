import { TenantsService } from './tenants.service';
import { TenantFeaturesDto, UpdateTenantFeaturesDto } from './dto/tenant-features.dto';
import { CreateTenantDto, UpdateTenantDto, TenantResponseDto, TenantListDto, TenantStatsDto, TenantQueryDto } from './dto/tenant.dto';
export declare class TenantsController {
    private readonly tenantsService;
    constructor(tenantsService: TenantsService);
    createTenant(createTenantDto: CreateTenantDto): Promise<TenantResponseDto>;
    getTenants(query: TenantQueryDto): Promise<TenantListDto>;
    getTenant(id: string): Promise<TenantResponseDto>;
    updateTenant(id: string, updateTenantDto: UpdateTenantDto): Promise<TenantResponseDto>;
    deleteTenant(id: string): Promise<{
        message: string;
    }>;
    getTenantStats(id: string): Promise<TenantStatsDto>;
    getTenantFeatures(id: string): Promise<TenantFeaturesDto>;
    getTenantFeaturesBySlug(slug: string): Promise<TenantFeaturesDto>;
    updateTenantFeatures(id: string, updateDto: UpdateTenantFeaturesDto): Promise<TenantFeaturesDto>;
}
