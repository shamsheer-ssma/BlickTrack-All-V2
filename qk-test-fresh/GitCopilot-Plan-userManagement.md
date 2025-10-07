# Azure AD-Inspired User & Group Management System Design

## Executive Summary

This document outlines a comprehensive redesign of BlickTrack's user and group management system, inspired by Azure Active Directory (Azure AD) patterns. The new system will provide enterprise-grade identity and access management with hierarchical permissions, group-based access control, and resource-level role assignments.

## Current System Analysis

### ✅ **Existing Strengths**
- Basic user management with CRUD operations
- Role-based access control (RBAC) with three roles: Platform Admin, Tenant Admin, User
- Multi-tenant user isolation
- Basic user profile management

### ⚠️ **Current Limitations**
- **No group management** - Users can't be organized into groups
- **Flat permission model** - No resource-level permissions
- **Limited user creation workflow** - Basic form without advanced options
- **No directory roles** - Roles are not centrally managed
- **No hierarchical permissions** - No project/product/activity level access control
- **Missing Azure-like UX** - No graphical dashboard with metrics

## Azure AD Design Patterns to Implement

### 🏗️ **Core Azure AD Concepts**

#### **1. Directory Roles (Azure AD Roles)**
- **Global Administrator** → Platform Admin equivalent
- **User Administrator** → Tenant Admin equivalent
- **Directory Readers** → Read-only access
- **Custom roles** → Project-specific roles

#### **2. Groups & Group Membership**
- **Security Groups** → Permission assignment
- **Microsoft 365 Groups** → Collaboration groups
- **Dynamic Groups** → Auto-membership based on rules
- **Nested Groups** → Group hierarchies

#### **3. Users & User Management**
- **Basic Info** → Name, email, contact details
- **Detailed Info** → Job info, manager, department
- **Assignments** → Groups, roles, licenses
- **Authentication** → MFA, password policies

#### **4. Role-Based Access Control (RBAC)**
- **Directory Roles** → Tenant-wide permissions
- **Resource Roles** → Specific resource permissions
- **Custom Roles** → Organization-specific roles

## Database Schema Redesign

### **Phase 1: Core Identity Tables**

```sql
-- Directory Roles (Azure AD Roles equivalent)
CREATE TABLE "DirectoryRole" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "name" TEXT NOT NULL UNIQUE,
  "description" TEXT,
  "isBuiltIn" BOOLEAN DEFAULT false,
  "isEnabled" BOOLEAN DEFAULT true,
  "permissions" JSONB, -- Directory-level permissions
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert built-in directory roles
INSERT INTO "DirectoryRole" (name, description, "isBuiltIn", permissions) VALUES
('Platform Administrator', 'Full access to all tenants and system settings', true, '{"all": true}'),
('Tenant Administrator', 'Full access to their tenant', true, '{"tenant": "full"}'),
('User', 'Basic user access', true, '{"basic": true}'),
('Security Administrator', 'Security and compliance management', true, '{"security": "full"}'),
('Compliance Administrator', 'Compliance reporting and management', true, '{"compliance": "full"}');

-- Enhanced Users table
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS
  "directoryRoleId" TEXT REFERENCES "DirectoryRole"("id");

ALTER TABLE "User" ADD COLUMN IF NOT EXISTS
  "managerId" TEXT REFERENCES "User"("id");

ALTER TABLE "User" ADD COLUMN IF NOT EXISTS
  "jobTitle" TEXT;

ALTER TABLE "User" ADD COLUMN IF NOT EXISTS
  "department" TEXT;

ALTER TABLE "User" ADD COLUMN IF NOT EXISTS
  "officeLocation" TEXT;

ALTER TABLE "User" ADD COLUMN IF NOT EXISTS
  "employeeId" TEXT;

ALTER TABLE "User" ADD COLUMN IF NOT EXISTS
  "userPrincipalName" TEXT UNIQUE; -- Azure AD UPN equivalent

ALTER TABLE "User" ADD COLUMN IF NOT EXISTS
  "accountEnabled" BOOLEAN DEFAULT true;

ALTER TABLE "User" ADD COLUMN IF NOT EXISTS
  "passwordLastChanged" TIMESTAMP;

ALTER TABLE "User" ADD COLUMN IF NOT EXISTS
  "lastPasswordReset" TIMESTAMP;

-- Groups table (Azure AD Groups equivalent)
CREATE TABLE "Group" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "groupType" TEXT CHECK ("groupType" IN ('Security', 'Distribution', 'Microsoft365')),
  "membershipType" TEXT CHECK ("membershipType" IN ('Assigned', 'Dynamic', 'Nested')),
  "ownerId" TEXT REFERENCES "User"("id"),
  "tenantId" TEXT,
  "isSystemGroup" BOOLEAN DEFAULT false,
  "dynamicRule" JSONB, -- For dynamic groups
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_group_tenant FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE
);

-- Group Membership
CREATE TABLE "GroupMembership" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "groupId" TEXT REFERENCES "Group"("id") ON DELETE CASCADE,
  "userId" TEXT REFERENCES "User"("id") ON DELETE CASCADE,
  "joinedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "addedBy" TEXT REFERENCES "User"("id"),

  UNIQUE("groupId", "userId")
);

-- Nested Groups (Group can contain other groups)
CREATE TABLE "GroupHierarchy" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "parentGroupId" TEXT REFERENCES "Group"("id") ON DELETE CASCADE,
  "childGroupId" TEXT REFERENCES "Group"("id") ON DELETE CASCADE,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE("parentGroupId", "childGroupId")
);
```

### **Phase 2: Resource-Based Access Control**

```sql
-- Resource Types (Projects, Products, Activities)
CREATE TABLE "ResourceType" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "name" TEXT NOT NULL UNIQUE,
  "description" TEXT,
  "hierarchy" JSONB, -- Parent-child relationships
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert built-in resource types
INSERT INTO "ResourceType" (name, description, hierarchy) VALUES
('Project', 'Top-level project container', '{"level": 1}'),
('Product', 'Product within a project', '{"level": 2, "parent": "Project"}'),
('Activity', 'Activity within a product', '{"level": 3, "parent": "Product"}'),
('Feature', 'Feature within an activity', '{"level": 4, "parent": "Activity"}');

-- Resources (Actual instances)
CREATE TABLE "Resource" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "resourceTypeId" TEXT REFERENCES "ResourceType"("id"),
  "parentResourceId" TEXT REFERENCES "Resource"("id"),
  "tenantId" TEXT REFERENCES "Tenant"("id"),
  "ownerId" TEXT REFERENCES "User"("id"),
  "metadata" JSONB,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Resource Roles (Built-in roles for each resource type)
CREATE TABLE "ResourceRole" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "resourceTypeId" TEXT REFERENCES "ResourceType"("id"),
  "permissions" JSONB, -- Specific permissions for this role
  "isBuiltIn" BOOLEAN DEFAULT true,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert built-in resource roles
INSERT INTO "ResourceRole" (name, description, "resourceTypeId", permissions) VALUES
-- Project roles
('Project Owner', 'Full control over project', (SELECT id FROM "ResourceType" WHERE name = 'Project'), '{"create": true, "read": true, "update": true, "delete": true, "manage": true}'),
('Project Contributor', 'Can contribute to project', (SELECT id FROM "ResourceType" WHERE name = 'Project'), '{"create": true, "read": true, "update": true, "delete": false, "manage": false}'),
('Project Reader', 'Read-only access to project', (SELECT id FROM "ResourceType" WHERE name = 'Project'), '{"create": false, "read": true, "update": false, "delete": false, "manage": false}'),

-- Threat Modeling specific roles
('Threat Model Creator', 'Can create threat models', (SELECT id FROM "ResourceType" WHERE name = 'Activity'), '{"threatmodel": {"create": true}}'),
('Threat Model Contributor', 'Can contribute to threat models', (SELECT id FROM "ResourceType" WHERE name = 'Activity'), '{"threatmodel": {"update": true}}'),
('Threat Model Reviewer', 'Can review threat models', (SELECT id FROM "ResourceType" WHERE name = 'Activity'), '{"threatmodel": {"review": true}}'),
('Threat Model Admin', 'Full threat model management', (SELECT id FROM "ResourceType" WHERE name = 'Activity'), '{"threatmodel": {"create": true, "update": true, "delete": true, "admin": true}}'),

-- Security Testing roles
('Security Tester', 'Can perform security tests', (SELECT id FROM "ResourceType" WHERE name = 'Activity'), '{"security": {"test": true}}'),
('Security Lead', 'Can manage security testing', (SELECT id FROM "ResourceType" WHERE name = 'Activity'), '{"security": {"test": true, "manage": true}}'),
('Vulnerability Manager', 'Can manage vulnerabilities', (SELECT id FROM "ResourceType" WHERE name = 'Activity'), '{"vulnerability": {"manage": true}}');

-- Resource Role Assignments
CREATE TABLE "ResourceRoleAssignment" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "resourceId" TEXT REFERENCES "Resource"("id") ON DELETE CASCADE,
  "userId" TEXT REFERENCES "User"("id") ON DELETE CASCADE,
  "roleId" TEXT REFERENCES "ResourceRole"("id") ON DELETE CASCADE,
  "assignedBy" TEXT REFERENCES "User"("id"),
  "assignedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "expiresAt" TIMESTAMP, -- For temporary assignments

  UNIQUE("resourceId", "userId", "roleId")
);

-- Group-based resource role assignments
CREATE TABLE "GroupResourceRoleAssignment" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "resourceId" TEXT REFERENCES "Resource"("id") ON DELETE CASCADE,
  "groupId" TEXT REFERENCES "Group"("id") ON DELETE CASCADE,
  "roleId" TEXT REFERENCES "ResourceRole"("id") ON DELETE CASCADE,
  "assignedBy" TEXT REFERENCES "User"("id"),
  "assignedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE("resourceId", "groupId", "roleId")
);
```

### **Phase 3: Advanced Features**

```sql
-- User Licenses/Entitlements
CREATE TABLE "UserLicense" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" TEXT REFERENCES "User"("id") ON DELETE CASCADE,
  "licenseType" TEXT NOT NULL,
  "assignedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "expiresAt" TIMESTAMP,
  "assignedBy" TEXT REFERENCES "User"("id")
);

-- Password Policies
CREATE TABLE "PasswordPolicy" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "tenantId" TEXT REFERENCES "Tenant"("id") ON DELETE CASCADE,
  "minLength" INTEGER DEFAULT 8,
  "requireUppercase" BOOLEAN DEFAULT true,
  "requireLowercase" BOOLEAN DEFAULT true,
  "requireNumbers" BOOLEAN DEFAULT true,
  "requireSpecialChars" BOOLEAN DEFAULT true,
  "passwordHistory" INTEGER DEFAULT 5,
  "maxAge" INTEGER DEFAULT 90, -- days
  "lockoutThreshold" INTEGER DEFAULT 5,
  "lockoutDuration" INTEGER DEFAULT 30, -- minutes
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit Logs for User Management
CREATE TABLE "UserManagementAudit" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "action" TEXT NOT NULL, -- CREATE, UPDATE, DELETE, ASSIGN, REVOKE
  "targetType" TEXT NOT NULL, -- USER, GROUP, ROLE, RESOURCE
  "targetId" TEXT NOT NULL,
  "actorId" TEXT REFERENCES "User"("id"),
  "oldValues" JSONB,
  "newValues" JSONB,
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "timestamp" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## User Stories & Implementation Phases

### 📋 **Epic 1: Azure AD-Style User Management Dashboard**

#### **User Story 1.1: As a Platform Admin, I want to see a graphical user overview dashboard like Azure AD**
**Acceptance Criteria:**
- User count cards (Total, Active, Disabled, Guest)
- User creation trends chart
- Recent user activities
- Quick action buttons (Add User, Bulk Import, Export)

**Implementation:**
1. **File:** `src/components/dashboard/UserManagementDashboard.tsx` (New)
   - Create overview cards with user statistics
   - Add charts for user trends
   - Implement quick actions

2. **File:** `src/lib/api.ts`
   - Add `getUserStatistics()` method
   - Add `getUserTrends()` method

#### **User Story 1.2: As a Tenant Admin, I want to manage users with Azure-like interface**
**Acceptance Criteria:**
- User table with search, filter, sort
- Bulk operations (Enable/Disable, Delete, Assign Groups)
- Export to CSV functionality
- Advanced filtering options

**Implementation:**
1. **File:** `src/components/dashboard/UsersView.tsx` (Modify)
   - Add graphical overview section
   - Enhance table with bulk operations
   - Add export functionality

### 📋 **Epic 2: Group Management System**

#### **User Story 2.1: As a Platform Admin, I want to create and manage groups in the sidebar**
**Acceptance Criteria:**
- Groups section in sidebar navigation
- Create security groups and distribution groups
- Group membership management
- Nested group support

**Implementation:**
1. **File:** `src/components/dashboard/Sidebar.tsx` (Modify)
   - Add "Groups" navigation item
   - Update permission checks

2. **File:** `src/components/dashboard/GroupsView.tsx` (New)
   - Group CRUD operations
   - Membership management
   - Group hierarchy visualization

#### **User Story 2.2: As a User, I want to create project-specific groups**
**Acceptance Criteria:**
- Users can create groups within their scope
- Group ownership and management
- Automatic group assignment for projects

**Implementation:**
1. **File:** `src/hooks/useGroups.ts` (New)
   - Group management logic
   - Permission validation

2. **File:** `src/lib/api.ts`
   - Add group management methods
   - Add group membership methods

### 📋 **Epic 3: Enhanced User Creation Workflow**

#### **User Story 3.1: As an Admin, I want to create users with Azure AD-style wizard**
**Acceptance Criteria:**
- Multi-step wizard (Basic Info → Details → Assignments → Review)
- Group assignment during creation
- Role assignment (Directory + Resource roles)
- License assignment

**Implementation:**
1. **File:** `src/components/dashboard/UserCreationWizard.tsx` (New)
   - Multi-step form wizard
   - Validation at each step
   - Progress indicator

2. **File:** `src/lib/api.ts`
   - Add `createUserWithAssignments()` method
   - Add validation methods

#### **User Story 3.2: As an Admin, I want to bulk import users**
**Acceptance Criteria:**
- CSV upload with validation
- Preview and confirm before import
- Error reporting for failed imports
- Progress tracking

**Implementation:**
1. **File:** `src/components/dashboard/UserBulkImport.tsx` (New)
   - File upload interface
   - CSV parsing and validation
   - Import progress tracking

### 📋 **Epic 4: Directory Roles & Resource-Based Permissions**

#### **User Story 4.1: As a Platform Admin, I want to manage directory roles**
**Acceptance Criteria:**
- CRUD operations for directory roles
- Built-in roles management
- Custom role creation
- Role assignment to users

**Implementation:**
1. **File:** `src/components/dashboard/DirectoryRolesView.tsx` (New)
   - Role management interface
   - Permission assignment
   - Role templates

#### **User Story 4.2: As a Project Owner, I want to assign resource-level permissions**
**Acceptance Criteria:**
- Resource hierarchy visualization
- Role assignment per resource
- Group-based permissions
- Permission inheritance

**Implementation:**
1. **File:** `src/components/dashboard/ResourcePermissions.tsx` (New)
   - Resource tree view
   - Permission assignment interface
   - Inheritance visualization

## Implementation Phases

### 🏗️ **Phase 1: Foundation (Weeks 1-2)**

#### **Database Migrations**
- Create new tables for groups, directory roles, resources
- Migrate existing user data
- Add new columns to User table

#### **API Extensions**
- Add group management endpoints
- Add directory role endpoints
- Add resource permission endpoints

#### **Basic UI Updates**
- Update User interface to include new fields
- Add Groups to sidebar navigation
- Create basic group management interface

### 🏗️ **Phase 2: User Management Enhancement (Weeks 3-4)**

#### **Azure AD-Style Dashboard**
- Create user overview dashboard
- Add user statistics and charts
- Implement quick actions

#### **Enhanced User Creation**
- Multi-step user creation wizard
- Group assignment during creation
- Bulk import functionality

#### **Group Management**
- Full CRUD for groups
- Membership management
- Group hierarchies

### 🏗️ **Phase 3: Advanced Permissions (Weeks 5-6)**

#### **Directory Roles**
- Directory role management
- Built-in roles configuration
- Role assignment system

#### **Resource-Based Access Control**
- Resource hierarchy implementation
- Resource role assignments
- Permission evaluation logic

#### **Integration Testing**
- End-to-end permission testing
- User workflow validation
- Performance testing

## File Modification Guide

### 📁 **Core API Files**

#### **`src/lib/api.ts`**
**New Interfaces:**
```typescript
export interface DirectoryRole {
  id: string;
  name: string;
  description?: string;
  isBuiltIn: boolean;
  isEnabled: boolean;
  permissions: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  groupType: 'Security' | 'Distribution' | 'Microsoft365';
  membershipType: 'Assigned' | 'Dynamic' | 'Nested';
  ownerId: string;
  tenantId: string;
  isSystemGroup: boolean;
  dynamicRule?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Resource {
  id: string;
  name: string;
  description?: string;
  resourceTypeId: string;
  parentResourceId?: string;
  tenantId: string;
  ownerId: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ResourceRole {
  id: string;
  name: string;
  description?: string;
  resourceTypeId: string;
  permissions: Record<string, any>;
  isBuiltIn: boolean;
  created_at: string;
}
```

**New Methods:**
```typescript
// Group Management
getGroups(tenantId?: string): Promise<Group[]>
createGroup(group: CreateGroupRequest): Promise<Group>
updateGroup(id: string, updates: UpdateGroupRequest): Promise<Group>
deleteGroup(id: string): Promise<void>
addUserToGroup(groupId: string, userId: string): Promise<void>
removeUserFromGroup(groupId: string, userId: string): Promise<void>

// Directory Roles
getDirectoryRoles(): Promise<DirectoryRole[]>
createDirectoryRole(role: CreateDirectoryRoleRequest): Promise<DirectoryRole>
assignDirectoryRole(userId: string, roleId: string): Promise<void>

// Resource Permissions
getResources(tenantId: string): Promise<Resource[]>
getResourceRoles(resourceTypeId: string): Promise<ResourceRole[]>
assignResourceRole(resourceId: string, userId: string, roleId: string): Promise<void>
assignGroupResourceRole(resourceId: string, groupId: string, roleId: string): Promise<void>

// Enhanced User Management
createUserWithAssignments(user: CreateUserWithAssignmentsRequest): Promise<User>
getUserStatistics(): Promise<UserStatistics>
bulkImportUsers(users: BulkUserImport[]): Promise<BulkImportResult>
```

#### **`src/types/dashboard.ts`**
**New Interfaces:**
```typescript
export interface UserStatistics {
  totalUsers: number;
  activeUsers: number;
  disabledUsers: number;
  guestUsers: number;
  usersByRole: Record<string, number>;
  usersByDepartment: Record<string, number>;
  recentSignIns: number;
  passwordExpiryWarnings: number;
}

export interface CreateUserWithAssignmentsRequest {
  // Basic Info
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  userPrincipalName: string;

  // Detailed Info
  jobTitle?: string;
  department?: string;
  officeLocation?: string;
  employeeId?: string;
  managerId?: string;

  // Assignments
  directoryRoleId: string;
  groupIds: string[];
  resourceRoleAssignments: ResourceRoleAssignment[];
  licenses: string[];
}

export interface BulkUserImport {
  email: string;
  firstName: string;
  lastName: string;
  jobTitle?: string;
  department?: string;
  managerEmail?: string;
  groupNames?: string[];
  directoryRoleName?: string;
}

export interface BulkImportResult {
  successful: number;
  failed: number;
  errors: Array<{ row: number; email: string; error: string }>;
}
```

### 📁 **New Components**

#### **`src/components/dashboard/UserManagementDashboard.tsx`**
- Overview cards with user statistics
- User creation trends chart
- Recent activities feed
- Quick action buttons

#### **`src/components/dashboard/GroupsView.tsx`**
- Group listing with search/filter
- Group creation and editing
- Membership management
- Group hierarchy visualization

#### **`src/components/dashboard/UserCreationWizard.tsx`**
- Multi-step form wizard
- Step 1: Basic Information
- Step 2: Detailed Information
- Step 3: Assignments (Groups, Roles, Licenses)
- Step 4: Review and Create

#### **`src/components/dashboard/DirectoryRolesView.tsx`**
- Directory role management
- Built-in roles configuration
- Custom role creation
- Role assignment interface

#### **`src/components/dashboard/ResourcePermissions.tsx`**
- Resource hierarchy tree view
- Permission assignment per resource
- Group-based permissions
- Permission inheritance display

### 📁 **Modified Components**

#### **`src/components/dashboard/UsersView.tsx`**
**Modifications:**
- Add graphical overview section at top
- Enhance user table with bulk operations
- Add export functionality
- Update user creation to use wizard

#### **`src/components/dashboard/Sidebar.tsx`**
**Modifications:**
- Add "Groups" navigation item
- Add "Directory Roles" for platform admins
- Update permission checks for new features

#### **`src/components/dashboard/UnifiedDashboard.tsx`**
**Modifications:**
- Add user management statistics to main dashboard
- Update navigation for new user management features
- Add quick links to user/group management

### 📁 **New Hooks**

#### **`src/hooks/useGroups.ts`**
```typescript
export function useGroups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadGroups = useCallback(async (tenantId?: string) => {
    try {
      setLoading(true);
      const data = await apiService.getGroups(tenantId);
      setGroups(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load groups');
    } finally {
      setLoading(false);
    }
  }, []);

  const createGroup = useCallback(async (groupData: CreateGroupRequest) => {
    const newGroup = await apiService.createGroup(groupData);
    setGroups(prev => [...prev, newGroup]);
    return newGroup;
  }, []);

  const addUserToGroup = useCallback(async (groupId: string, userId: string) => {
    await apiService.addUserToGroup(groupId, userId);
    // Update local state
    setGroups(prev => prev.map(group =>
      group.id === groupId
        ? { ...group, memberCount: (group.memberCount || 0) + 1 }
        : group
    ));
  }, []);

  return {
    groups,
    loading,
    error,
    loadGroups,
    createGroup,
    addUserToGroup,
    removeUserFromGroup: apiService.removeUserFromGroup,
  };
}
```

#### **`src/hooks/useDirectoryRoles.ts`**
```typescript
export function useDirectoryRoles() {
  const [roles, setRoles] = useState<DirectoryRole[]>([]);
  const [loading, setLoading] = useState(false);

  const loadRoles = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiService.getDirectoryRoles();
      setRoles(data);
    } catch (err) {
      console.error('Error loading directory roles:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const assignRole = useCallback(async (userId: string, roleId: string) => {
    await apiService.assignDirectoryRole(userId, roleId);
    // Update user role in local state if needed
  }, []);

  return {
    roles,
    loading,
    loadRoles,
    assignRole,
  };
}
```

## Testing Strategy

### **Unit Tests**
```typescript
// src/__tests__/components/UserManagementDashboard.test.tsx
describe('UserManagementDashboard', () => {
  it('displays user statistics correctly', () => {
    // Test user count cards
  });

  it('shows user creation trends', () => {
    // Test charts rendering
  });
});
```

### **Integration Tests**
```typescript
// src/__tests__/api/userManagement.test.ts
describe('User Management API', () => {
  it('creates user with group assignments', async () => {
    const userData = {
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      groupIds: ['group1', 'group2'],
      directoryRoleId: 'role1'
    };

    const result = await apiService.createUserWithAssignments(userData);
    expect(result.groups).toHaveLength(2);
  });
});
```

### **E2E Tests**
```typescript
// cypress/integration/user-management.spec.ts
describe('User Management', () => {
  it('creates user through wizard', () => {
    cy.visit('/dashboard/users');
    cy.get('[data-testid="add-user-button"]').click();

    // Step 1: Basic Info
    cy.get('[data-testid="email"]').type('newuser@example.com');
    cy.get('[data-testid="firstName"]').type('New');
    cy.get('[data-testid="lastName"]').type('User');
    cy.get('[data-testid="next-button"]').click();

    // Step 2: Details
    cy.get('[data-testid="jobTitle"]').type('Developer');
    cy.get('[data-testid="department"]').type('Engineering');
    cy.get('[data-testid="next-button"]').click();

    // Step 3: Assignments
    cy.get('[data-testid="group-checkbox"]').first().check();
    cy.get('[data-testid="role-select"]').select('User');
    cy.get('[data-testid="next-button"]').click();

    // Step 4: Review and Create
    cy.get('[data-testid="create-user-button"]').click();
    cy.contains('User created successfully').should('be.visible');
  });
});
```

## Security Considerations

### **Permission Evaluation**
- **Hierarchical Evaluation**: Directory roles → Group permissions → Resource roles
- **Deny Overrides Allow**: Most restrictive permission wins
- **Time-based Permissions**: Support for temporary role assignments

### **Audit & Compliance**
- **Comprehensive Auditing**: All user/group/role changes logged
- **GDPR Compliance**: Data export/deletion capabilities
- **Access Reviews**: Periodic permission review workflows

## Performance Optimizations

### **Database Indexes**
```sql
CREATE INDEX idx_user_directory_role ON "User"(directoryRoleId);
CREATE INDEX idx_user_tenant ON "User"(tenantId);
CREATE INDEX idx_group_membership_user ON "GroupMembership"(userId);
CREATE INDEX idx_group_membership_group ON "GroupMembership"(groupId);
CREATE INDEX idx_resource_role_assignment_user ON "ResourceRoleAssignment"(userId);
CREATE INDEX idx_resource_role_assignment_resource ON "ResourceRoleAssignment"(resourceId);
```

### **Caching Strategy**
- **Redis Caching**: User permissions, group memberships
- **Permission Evaluation Cache**: Avoid repeated DB queries
- **Group Hierarchy Cache**: Pre-computed group relationships

## Migration Strategy

### **Data Migration Scripts**
1. **Migrate existing roles** to directory roles
2. **Create default groups** for each tenant
3. **Assign users to appropriate groups**
4. **Migrate existing permissions** to resource roles

### **Rollback Plan**
- **Database backups** before migration
- **Feature flags** to disable new functionality
- **Gradual rollout** with monitoring

## Success Metrics

### **Quantitative Metrics**
- **User Management Efficiency**: Time to create/manage users (target: 50% reduction)
- **Permission Accuracy**: Percentage of correct permission assignments
- **Group Adoption**: Percentage of users in groups vs. individual assignments
- **Audit Compliance**: Percentage of user management actions audited

### **Qualitative Metrics**
- **User Satisfaction**: Admin feedback on management tools
- **Security Posture**: Reduction in permission-related security incidents
- **Compliance Readiness**: Time to complete access reviews

## Conclusion

This Azure AD-inspired user and group management system will transform BlickTrack into an enterprise-grade identity and access management platform. The hierarchical permission model, combined with intuitive Azure-like interfaces, will provide administrators with powerful tools to manage users, groups, and permissions at scale while maintaining security and compliance.

The phased implementation approach ensures minimal disruption while delivering immediate value through enhanced user management capabilities. The system will scale from small teams to large enterprises, supporting complex organizational structures and compliance requirements.

**Next Steps:**
1. Start with database schema design and migration
2. Implement core group management functionality
3. Build the Azure AD-style user management dashboard
4. Add resource-based permissions
5. Conduct thorough testing and security review

This foundation will support advanced features like automated provisioning, just-in-time access, and integration with external identity providers in future phases.</content>
<parameter name="filePath">c:\GIT\BlickTrack\qk-test-fresh\GitCopilot-Plan-userManagement.md