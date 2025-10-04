// Mock user data for demonstration
export const mockUsers = {
  platformAdmin: {
    name: 'John Smith',
    email: 'john.smith@blicktrack.com',
    role: 'Platform Admin',
    tenant: 'BlickTrack Platform',
    company: 'BlickTrack Inc.',
    organization: 'BlickTrack Inc.',
    userType: 'Licensed User',
    isLicensed: true
  },
  tenantAdmin: {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@utc.com',
    role: 'Tenant Admin',
    tenant: 'UTC',
    company: 'UTC Corporation',
    organization: 'UTC Corporation',
    userType: 'Licensed User',
    isLicensed: true
  },
  securityManager: {
    name: 'Mike Chen',
    email: 'mike.chen@huawei.com',
    role: 'Security Manager',
    tenant: 'Huawei',
    company: 'Huawei Technologies',
    organization: 'Huawei Technologies',
    userType: 'Licensed User',
    isLicensed: true
  },
  securityAnalyst: {
    name: 'Emily Davis',
    email: 'emily.davis@startup.io',
    role: 'Security Analyst',
    tenant: 'Trial Users',
    company: 'StartupIO Technologies',
    organization: 'StartupIO Technologies',
    userType: 'Trial User',
    isLicensed: false
  },
  developer: {
    name: 'Alex Rodriguez',
    email: 'alex.rodriguez@innovate.com',
    role: 'Developer',
    tenant: 'Trial Users',
    company: 'Innovate Labs LLC',
    organization: 'Innovate Labs LLC',
    userType: 'Trial User',
    isLicensed: false
  },
  consultant: {
    name: 'Lisa Wang',
    email: 'lisa.wang@securitypartners.com',
    role: 'External Consultant',
    tenant: 'Trial Users',
    company: 'Security Partners Inc.',
    organization: 'Security Partners Inc.',
    userType: 'Trial User',
    isLicensed: false
  },
  guest: {
    name: 'Guest User',
    email: 'guest@blicktrack.com',
    role: 'Guest/Viewer',
    tenant: 'BlickTrack Platform',
    company: 'BlickTrack Inc.',
    organization: 'BlickTrack Inc.',
    userType: 'Licensed User',
    isLicensed: true
  }
};

export function getUserInfo(role: keyof typeof mockUsers) {
  return mockUsers[role] || mockUsers.platformAdmin;
}
