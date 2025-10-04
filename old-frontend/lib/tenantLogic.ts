// Tenant and Organization Logic for BlickTrack
export interface TenantInfo {
  id: string;
  name: string;
  domain: string;
  isLicensed: boolean;
  plan?: string;
}

// Licensed tenants with their domains
export const licensedTenants: TenantInfo[] = [
  {
    id: 'utc-tenant',
    name: 'UTC',
    domain: 'utc.com',
    isLicensed: true,
    plan: 'Enterprise'
  },
  {
    id: 'huawei-tenant',
    name: 'Huawei',
    domain: 'huawei.com',
    isLicensed: true,
    plan: 'Enterprise'
  },
  {
    id: 'blicktrack-tenant',
    name: 'BlickTrack Platform',
    domain: 'blicktrack.com',
    isLicensed: true,
    plan: 'Platform'
  }
];

// Trial tenant for non-licensed users
export const trialTenant: TenantInfo = {
  id: 'trial-tenant',
  name: 'Trial Users',
  domain: '*',
  isLicensed: false,
  plan: 'Trial'
};

/**
 * Extract domain from email address
 */
export function extractDomainFromEmail(email: string): string {
  const domain = email.split('@')[1];
  return domain?.toLowerCase() || '';
}

/**
 * Find tenant based on email domain
 */
export function findTenantByEmail(email: string): TenantInfo {
  const domain = extractDomainFromEmail(email);
  
  // Look for licensed tenant with matching domain
  const licensedTenant = licensedTenants.find(tenant => 
    tenant.domain.toLowerCase() === domain
  );
  
  // Return licensed tenant if found, otherwise return trial tenant
  return licensedTenant || trialTenant;
}

/**
 * Check if email domain belongs to a licensed tenant
 */
export function isLicensedUser(email: string): boolean {
  const tenant = findTenantByEmail(email);
  return tenant.isLicensed;
}

/**
 * Get user signup context
 */
export function getUserSignupContext(email: string, companyName: string) {
  const tenant = findTenantByEmail(email);
  const isLicensed = tenant.isLicensed;
  
  return {
    tenant: {
      id: tenant.id,
      name: tenant.name,
      domain: tenant.domain,
      isLicensed: tenant.isLicensed,
      plan: tenant.plan
    },
    organization: companyName, // What user enters goes to organization field
    userType: isLicensed ? 'Licensed User' : 'Trial User',
    signupType: isLicensed ? 'Licensed Organization' : 'Trial Signup'
  };
}

/**
 * Get all tenant domains for validation
 */
export function getAllTenantDomains(): string[] {
  return licensedTenants.map(tenant => tenant.domain);
}

/**
 * Check if domain is licensed
 */
export function isDomainLicensed(domain: string): boolean {
  return licensedTenants.some(tenant => 
    tenant.domain.toLowerCase() === domain.toLowerCase()
  );
}


