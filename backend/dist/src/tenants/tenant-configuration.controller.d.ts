import { TenantConfigurationService } from './tenant-configuration.service';
import { CreateTenantConfigurationDto, UpdateTenantConfigurationDto, TenantConfigurationResponseDto } from './dto/tenant-configuration.dto';
export declare class TenantConfigurationController {
    private readonly tenantConfigurationService;
    constructor(tenantConfigurationService: TenantConfigurationService);
    createConfiguration(tenantId: string, createConfigDto: CreateTenantConfigurationDto): Promise<TenantConfigurationResponseDto>;
    getConfiguration(tenantId: string): Promise<TenantConfigurationResponseDto>;
    updateConfiguration(tenantId: string, updateConfigDto: UpdateTenantConfigurationDto): Promise<TenantConfigurationResponseDto>;
    deleteConfiguration(tenantId: string): Promise<{
        message: string;
    }>;
    getIndustryTemplates(tenantId: string): Promise<{
        templates: ({
            industryType: string;
            displayName: string;
            description: string;
            defaultConfiguration: {
                industryType: string;
                organizationType: string;
                productTerm: string;
                projectTerm: string;
                portfolioTerm: string;
                workstreamTerm: string;
                defaultHierarchy: string[];
                maxHierarchyLevels: number;
                securityFrameworks: string[];
                defaultRiskLevel: "HIGH";
                theme: string;
                primaryColor: string;
                requiresApproval: boolean;
                encryptionRequired: boolean;
                enable2FA: boolean;
                auditRetentionDays?: undefined;
            };
        } | {
            industryType: string;
            displayName: string;
            description: string;
            defaultConfiguration: {
                industryType: string;
                organizationType: string;
                productTerm: string;
                projectTerm: string;
                portfolioTerm: string;
                workstreamTerm: string;
                defaultHierarchy: string[];
                maxHierarchyLevels: number;
                securityFrameworks: string[];
                defaultRiskLevel: "HIGH";
                theme: string;
                primaryColor: string;
                requiresApproval: boolean;
                encryptionRequired: boolean;
                enable2FA: boolean;
                auditRetentionDays: number;
            };
        } | {
            industryType: string;
            displayName: string;
            description: string;
            defaultConfiguration: {
                industryType: string;
                organizationType: string;
                productTerm: string;
                projectTerm: string;
                portfolioTerm: string;
                workstreamTerm: string;
                defaultHierarchy: string[];
                maxHierarchyLevels: number;
                securityFrameworks: string[];
                defaultRiskLevel: "MEDIUM";
                theme: string;
                primaryColor: string;
                requiresApproval: boolean;
                encryptionRequired: boolean;
                enable2FA: boolean;
                auditRetentionDays?: undefined;
            };
        })[];
    }>;
    applyIndustryTemplate(tenantId: string, body: {
        industryType: string;
        preserveCustomSettings?: boolean;
    }): Promise<TenantConfigurationResponseDto>;
    testSSOConfiguration(tenantId: string, body: {
        ssoProvider: string;
        testCredentials?: object;
    }): Promise<any>;
    getThemeOptions(tenantId: string): Promise<{
        themes: {
            id: string;
            name: string;
            displayName: string;
            description: string;
            preview: string;
        }[];
    }>;
    previewConfiguration(tenantId: string, body: UpdateTenantConfigurationDto): Promise<{
        preview: {
            theme: string;
            primaryColor: string;
            logoUrl: string | null;
            customCssUrl: string | null;
            industryType: string;
            organizationType: string;
            productTerm: string;
            projectTerm: string;
            portfolioTerm: string;
            workstreamTerm: string;
        };
        changes: string[];
    }>;
}
