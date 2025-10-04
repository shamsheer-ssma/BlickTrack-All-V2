export declare class TenantFeaturesDto {
    enableRegistration: boolean;
    enable2FA: boolean;
    enableLandingPage: boolean;
    enableDarkMode: boolean;
    ssoEnabled: boolean;
    ssoProvider?: string | null;
    ssoClientId?: string | null;
    theme: string;
    primaryColor: string;
    logoUrl?: string | null;
}
export declare class UpdateTenantFeaturesDto {
    enableRegistration?: boolean;
    enable2FA?: boolean;
    enableLandingPage?: boolean;
    enableDarkMode?: boolean;
    ssoEnabled?: boolean;
    ssoProvider?: string;
    ssoClientId?: string;
    ssoTenantId?: string;
    ssoIssuerUrl?: string;
    theme?: string;
    primaryColor?: string;
    logoUrl?: string;
}
