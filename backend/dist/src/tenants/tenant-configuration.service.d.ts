import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { CreateTenantConfigurationDto, UpdateTenantConfigurationDto, TenantConfigurationResponseDto } from './dto/tenant-configuration.dto';
export declare class TenantConfigurationService {
    private prisma;
    private configService;
    private readonly logger;
    constructor(prisma: PrismaService, configService: ConfigService);
    createConfiguration(tenantId: string, createConfigDto: CreateTenantConfigurationDto): Promise<TenantConfigurationResponseDto>;
    getConfiguration(tenantId: string): Promise<TenantConfigurationResponseDto>;
    updateConfiguration(tenantId: string, updateConfigDto: UpdateTenantConfigurationDto): Promise<TenantConfigurationResponseDto>;
    deleteConfiguration(tenantId: string): Promise<{
        message: string;
    }>;
    getIndustryTemplates(): Promise<{
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
    applyIndustryTemplate(tenantId: string, industryType: string, preserveCustomSettings?: boolean): Promise<TenantConfigurationResponseDto>;
    testSSOConfiguration(tenantId: string, ssoProvider: string, testCredentials?: object): Promise<any>;
    getThemeOptions(): Promise<{
        themes: {
            id: string;
            name: string;
            displayName: string;
            description: string;
            preview: string;
        }[];
    }>;
    previewConfiguration(tenantId: string, previewData: UpdateTenantConfigurationDto): Promise<{
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
    private mapConfigurationToResponseDto;
    private testAzureSSO;
    private testOktaSSO;
    private testGoogleSSO;
    private testSAMLSSO;
}
