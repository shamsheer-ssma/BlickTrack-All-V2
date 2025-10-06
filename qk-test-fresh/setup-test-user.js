const user = {
  id: 'test-admin-123',
  email: 'admin@huawei.com',
  firstName: '',
  lastName: '',
  displayName: '',
  name: 'Admin User',
  role: 'TENANT_ADMIN',
  tenantId: 'huawei-tenant-123',
  isVerified: true,
  mfaEnabled: false,
  lastLoginAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  tenant: {
    id: 'huawei-tenant-123',
    name: 'Huawei',
    slug: 'huawei'
  }
};

console.log('Test user object created:', JSON.stringify(user, null, 2));