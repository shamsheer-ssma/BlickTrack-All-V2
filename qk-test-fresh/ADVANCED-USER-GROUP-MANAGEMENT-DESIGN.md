# Advanced User & Group Management System Design
## Azure Active Directory-Inspired Identity & Access Management

### 📋 **Executive Summary**

This document outlines the design for implementing a comprehensive user and group management system inspired by Azure Active Directory, with hierarchical role-based access control (RBAC) and resource-level permissions. The system will support multi-tenant organizations with granular access control at project, product, and activity levels.

---

## 🎯 **User Stories & Requirements**

### **1. Platform Admin User Stories**
- **US-001**: As a Platform Admin, I want to see a graphical dashboard of user statistics before the user table, so I can quickly understand user distribution and activity.
- **US-002**: As a Platform Admin, I want to create, update, and delete users with comprehensive forms (Basic Info, Detailed Info, Assignments), so I can manage all user aspects in one place.
- **US-003**: As a Platform Admin, I want to create and manage groups that span across tenants, so I can organize users for cross-tenant activities.
- **US-004**: As a Platform Admin, I want to assign directory roles (Platform Admin, Tenant Admin, User) to users, so I can control administrative access levels.
- **US-005**: As a Platform Admin, I want to assign resource-level roles (Threat Model Creator, Pen Tester, etc.) to users, so I can control access to specific features and activities.

### **2. Tenant Admin User Stories**
- **US-006**: As a Tenant Admin, I want to manage users within my tenant only, so I can maintain proper tenant isolation.
- **US-007**: As a Tenant Admin, I want to create groups for my tenant's projects and products, so I can organize users by business function.
- **US-008**: As a Tenant Admin, I want to assign users to groups and roles, so I can control access to tenant resources.
- **US-009**: As a Tenant Admin, I want to see user activity and group membership, so I can audit access and make informed decisions.

### **3. End User Stories**
- **US-010**: As a Product Owner, I want to create groups for my products and projects, so I can manage team access efficiently.
- **US-011**: As a Project Manager, I want to add users to my project groups, so I can grant access to project resources.
- **US-012**: As a User, I want to see my group memberships and permissions, so I can understand my access level.
- **US-013**: As a User, I want to request access to groups and resources, so I can get the permissions I need for my work.

---

## 🏗️ **System Architecture**

### **1. Directory Roles (Azure AD Style)**
```
Directory Roles Hierarchy:
├── SUPER_ADMIN (Platform Owner)
│   ├── Full platform access
│   ├── Can manage all tenants
│   └── Can assign all roles
├── PLATFORM_ADMIN (Platform Administrator)
│   ├── Manage platform settings
│   ├── Manage tenants
│   └── Assign tenant admin roles
├── TENANT_ADMIN (Tenant Administrator)
│   ├── Manage tenant users
│   ├── Create tenant groups
│   └── Assign resource roles
└── END_USER (Regular User)
    ├── View own profile
    ├── Request access
    └── Create project groups (if authorized)
```

### **2. Resource-Level Roles (Built-in)**
```
Resource Roles by Category:

Threat Modeling:
├── THREAT_MODEL_CREATOR
├── THREAT_MODEL_EDITOR
├── THREAT_MODEL_REVIEWER
├── THREAT_MODEL_APPROVER
└── THREAT_MODEL_VIEWER

Penetration Testing:
├── PEN_TEST_LEAD
├── PEN_TEST_ANALYST
├── PEN_TEST_REVIEWER
└── PEN_TEST_VIEWER

Vulnerability Management:
├── VULN_MANAGER
├── VULN_ANALYST
├── VULN_REVIEWER
└── VULN_VIEWER

Compliance:
├── COMPLIANCE_MANAGER
├── COMPLIANCE_AUDITOR
├── COMPLIANCE_REVIEWER
└── COMPLIANCE_VIEWER

AI Features:
├── AI_THREAT_MODEL_SPECIALIST
├── AI_VULN_ANALYST
└── AI_COMPLIANCE_AUDITOR
```

### **3. Resource Hierarchy**
```
Resource Hierarchy:
├── Platform (Root)
│   ├── Tenants
│   │   ├── Products
│   │   │   ├── Projects
│   │   │   │   ├── Threat Modeling
│   │   │   │   │   ├── AI Enhanced Threat Modeling
│   │   │   │   │   ├── Manual Threat Modeling
│   │   │   │   │   └── Threat Model Reviews
│   │   │   │   ├── Penetration Testing
│   │   │   │   │   ├── Web App Testing
│   │   │   │   │   ├── API Testing
│   │   │   │   │   └── Infrastructure Testing
│   │   │   │   └── Vulnerability Assessment
│   │   │   │       ├── SAST Analysis
│   │   │   │       ├── DAST Analysis
│   │   │   │       └── Container Scanning
│   │   │   └── Compliance Audits
│   │   └── Groups
│   │       ├── Project Groups
│   │       ├── Product Groups
│   │       └── Department Groups
```

---

## 📊 **Database Schema Changes**

### **1. New Tables**

#### **Groups Table**
```sql
CREATE TABLE groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  group_type VARCHAR(50) NOT NULL, -- 'TENANT', 'PROJECT', 'PRODUCT', 'DEPARTMENT'
  scope VARCHAR(100) NOT NULL, -- '/tenants/{id}', '/tenants/{id}/products/{id}', etc.
  
  -- Ownership
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  created_by UUID NOT NULL REFERENCES users(id),
  owner_id UUID REFERENCES users(id),
  
  -- Hierarchy
  parent_id UUID REFERENCES groups(id),
  level INTEGER DEFAULT 0,
  path VARCHAR(500), -- '/tenant/project/product'
  
  -- Settings
  is_active BOOLEAN DEFAULT true,
  is_public BOOLEAN DEFAULT false, -- Can users join without invitation?
  auto_assign BOOLEAN DEFAULT false, -- Auto-assign new users?
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP NULL
);
```

#### **Group Memberships Table**
```sql
CREATE TABLE group_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES groups(id),
  user_id UUID NOT NULL REFERENCES users(id),
  
  -- Membership details
  role VARCHAR(50) NOT NULL, -- 'OWNER', 'ADMIN', 'MEMBER', 'VIEWER'
  joined_at TIMESTAMP DEFAULT NOW(),
  joined_by UUID REFERENCES users(id),
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP NULL,
  
  -- Permissions
  can_invite BOOLEAN DEFAULT false,
  can_remove_members BOOLEAN DEFAULT false,
  can_manage_roles BOOLEAN DEFAULT false,
  
  UNIQUE(group_id, user_id)
);
```

#### **Resource Roles Table**
```sql
CREATE TABLE resource_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  display_name VARCHAR(255) NOT NULL,
  description TEXT,
  
  -- Role classification
  category VARCHAR(50) NOT NULL, -- 'THREAT_MODELING', 'PEN_TESTING', 'VULN_MANAGEMENT'
  resource_type VARCHAR(50) NOT NULL, -- 'THREAT_MODEL', 'PEN_TEST', 'VULN_ASSESSMENT'
  level INTEGER DEFAULT 1, -- 1=Viewer, 2=Contributor, 3=Editor, 4=Admin, 5=Owner
  
  -- Permissions
  permissions JSONB NOT NULL DEFAULT '[]', -- Array of permission strings
  is_built_in BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **User Resource Assignments Table**
```sql
CREATE TABLE user_resource_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  resource_role_id UUID NOT NULL REFERENCES resource_roles(id),
  
  -- Resource context
  resource_type VARCHAR(50) NOT NULL, -- 'THREAT_MODEL', 'PROJECT', 'PRODUCT'
  resource_id UUID NOT NULL,
  scope VARCHAR(200) NOT NULL, -- '/tenants/{id}/products/{id}/projects/{id}'
  
  -- Assignment details
  assigned_by UUID NOT NULL REFERENCES users(id),
  assigned_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP NULL,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  is_inherited BOOLEAN DEFAULT false, -- Inherited from group membership?
  inherited_from_group_id UUID REFERENCES groups(id),
  
  -- Conditions
  conditions JSONB DEFAULT '{}', -- Time-based, IP-based, etc.
  
  UNIQUE(user_id, resource_role_id, resource_id, scope)
);
```

### **2. Schema Updates**

#### **Update Users Table**
```sql
-- Add directory role
ALTER TABLE users ADD COLUMN directory_role VARCHAR(50) DEFAULT 'END_USER';
ALTER TABLE users ADD COLUMN is_directory_admin BOOLEAN DEFAULT false;

-- Add group management fields
ALTER TABLE users ADD COLUMN can_create_groups BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN max_groups INTEGER DEFAULT 0; -- 0 = unlimited
```

#### **Update Existing Tables**
```sql
-- Add group context to projects
ALTER TABLE projects ADD COLUMN group_id UUID REFERENCES groups(id);

-- Add resource-level permissions to existing tables
ALTER TABLE threat_models ADD COLUMN access_level VARCHAR(50) DEFAULT 'PRIVATE';
ALTER TABLE threat_models ADD COLUMN group_id UUID REFERENCES groups(id);
```

---

## 🎨 **UI/UX Design**

### **1. Users Page Enhancements**

#### **A. Statistics Dashboard (Azure-style)**
```typescript
interface UserStatsDashboard {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  usersByRole: {
    platformAdmin: number;
    tenantAdmin: number;
    endUser: number;
  };
  usersByStatus: {
    active: number;
    inactive: number;
    pending: number;
    locked: number;
  };
  groupMemberships: {
    totalGroups: number;
    averageGroupsPerUser: number;
  };
  recentActivity: Array<{
    user: string;
    action: string;
    timestamp: Date;
    resource: string;
  }>;
}
```

#### **B. Action Cards (Azure-style)**
```typescript
interface ActionCard {
  title: string;
  description: string;
  icon: string;
  action: () => void;
  color: string;
  count?: number;
}

const actionCards: ActionCard[] = [
  {
    title: "Add User",
    description: "Create a new user account",
    icon: "UserPlus",
    action: () => openAddUserModal(),
    color: "blue"
  },
  {
    title: "Bulk Import",
    description: "Import users from CSV",
    icon: "Upload",
    action: () => openBulkImportModal(),
    color: "green"
  },
  {
    title: "Create Group",
    description: "Create a new group",
    icon: "Users",
    action: () => openCreateGroupModal(),
    color: "purple"
  },
  {
    title: "Role Management",
    description: "Manage directory roles",
    icon: "Shield",
    action: () => openRoleManagementModal(),
    color: "orange"
  }
];
```

### **2. Add User Form (Multi-step)**

#### **Step 1: Basic Information**
```typescript
interface BasicUserInfo {
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  phone?: string;
  jobTitle?: string;
  department?: string;
}
```

#### **Step 2: Detailed Information**
```typescript
interface DetailedUserInfo {
  manager?: string;
  officeLocation?: string;
  timezone: string;
  locale: string;
  employeeId?: string;
  startDate: Date;
  notes?: string;
  avatar?: string;
}
```

#### **Step 3: Assignments**
```typescript
interface UserAssignments {
  directoryRole: 'SUPER_ADMIN' | 'PLATFORM_ADMIN' | 'TENANT_ADMIN' | 'END_USER';
  groups: Array<{
    groupId: string;
    groupName: string;
    role: 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';
  }>;
  resourceRoles: Array<{
    roleId: string;
    roleName: string;
    scope: string;
    resourceType: string;
    resourceId: string;
  }>;
  permissions: Array<{
    resource: string;
    actions: string[];
    conditions?: any;
  }>;
}
```

### **3. Groups Management Page**

#### **A. Groups List View**
```typescript
interface GroupListItem {
  id: string;
  name: string;
  description: string;
  type: 'TENANT' | 'PROJECT' | 'PRODUCT' | 'DEPARTMENT';
  memberCount: number;
  owner: string;
  createdDate: Date;
  isActive: boolean;
  scope: string;
}
```

#### **B. Group Details Panel**
```typescript
interface GroupDetails {
  basicInfo: {
    name: string;
    description: string;
    type: string;
    scope: string;
    createdBy: string;
    createdDate: Date;
  };
  members: Array<{
    userId: string;
    name: string;
    email: string;
    role: string;
    joinedDate: Date;
    status: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
  }>;
  permissions: Array<{
    resource: string;
    actions: string[];
    inherited: boolean;
  }>;
  settings: {
    isPublic: boolean;
    autoAssign: boolean;
    canInvite: boolean;
    maxMembers?: number;
  };
}
```

---

## 🔧 **Implementation Plan**

### **Phase 1: Database & Backend (Week 1-2)**
1. **Database Schema Updates**
   - Create new tables (groups, group_memberships, resource_roles, user_resource_assignments)
   - Update existing tables with new fields
   - Create database migrations
   - Seed initial data

2. **Backend API Development**
   - Groups management endpoints
   - Resource roles management
   - User assignment endpoints
   - Permission checking middleware
   - Group-based access control

### **Phase 2: Core UI Components (Week 3-4)**
1. **Users Page Enhancements**
   - Statistics dashboard
   - Action cards
   - Multi-step add user form
   - Bulk operations

2. **Groups Management**
   - Groups list view
   - Group creation/editing
   - Member management
   - Permission assignment

### **Phase 3: Advanced Features (Week 5-6)**
1. **Role Management**
   - Directory roles interface
   - Resource roles management
   - Permission matrix
   - Role inheritance

2. **Access Control**
   - Group-based permissions
   - Resource-level access
   - Permission inheritance
   - Access requests

### **Phase 4: Integration & Testing (Week 7-8)**
1. **Integration**
   - Connect with existing features
   - Update existing components
   - Test all workflows

2. **Testing & Documentation**
   - Unit tests
   - Integration tests
   - User documentation
   - Admin guides

---

## 🚀 **Key Features**

### **1. Azure-Style User Management**
- **Graphical Dashboard**: Statistics, charts, and quick actions
- **Multi-step Forms**: Basic info → Detailed info → Assignments
- **Bulk Operations**: Import, export, bulk updates
- **Advanced Filtering**: By role, group, status, department
- **Activity Tracking**: User actions and changes

### **2. Hierarchical Group Management**
- **Group Types**: Tenant, Project, Product, Department
- **Group Hierarchy**: Nested groups with inheritance
- **Member Management**: Add, remove, change roles
- **Permission Inheritance**: Groups inherit parent permissions
- **Auto-assignment**: Automatic group membership based on rules

### **3. Granular Role-Based Access Control**
- **Directory Roles**: Platform-wide administrative roles
- **Resource Roles**: Feature-specific functional roles
- **Permission Matrix**: Visual permission management
- **Role Inheritance**: Hierarchical permission inheritance
- **Conditional Access**: Time, location, and context-based access

### **4. Resource-Level Permissions**
- **Hierarchical Resources**: Platform → Tenant → Product → Project → Activity
- **Granular Permissions**: Create, Read, Update, Delete, Execute
- **Feature-Specific Roles**: Threat modeling, pen testing, compliance
- **AI Feature Roles**: Specialized roles for AI-enhanced features
- **Dynamic Permissions**: Context-aware permission changes

---

## 📈 **Benefits**

### **1. For Platform Admins**
- **Centralized Control**: Manage all users and groups from one place
- **Granular Permissions**: Fine-tune access at every level
- **Audit Trail**: Complete visibility into user actions
- **Scalability**: Handle thousands of users efficiently

### **2. For Tenant Admins**
- **Tenant Isolation**: Manage only their tenant's users
- **Business Alignment**: Organize users by business function
- **Flexible Groups**: Create groups that match organizational structure
- **Self-Service**: Allow users to request access

### **3. For End Users**
- **Clear Permissions**: Understand what they can access
- **Group Collaboration**: Work with team members efficiently
- **Access Requests**: Request permissions they need
- **Self-Management**: Update their own profile and preferences

### **4. For the Platform**
- **Security**: Multi-layered access control
- **Compliance**: Audit-ready permission management
- **Scalability**: Support for large organizations
- **Flexibility**: Adapt to any organizational structure

---

## 🔒 **Security Considerations**

### **1. Access Control**
- **Principle of Least Privilege**: Users get minimum required access
- **Role Separation**: Clear separation between directory and resource roles
- **Permission Inheritance**: Secure hierarchical permission model
- **Conditional Access**: Context-aware access decisions

### **2. Audit & Compliance**
- **Complete Audit Trail**: All user actions logged
- **Permission Changes**: Track all permission modifications
- **Group Changes**: Monitor group membership changes
- **Access Reviews**: Regular permission reviews

### **3. Data Protection**
- **Tenant Isolation**: Strict data separation between tenants
- **Encryption**: Sensitive data encrypted at rest and in transit
- **Access Logging**: All access attempts logged
- **Data Retention**: Configurable data retention policies

---

This comprehensive design provides a solid foundation for implementing a full-featured identity and access management system that rivals Azure Active Directory in functionality while being tailored to the BlickTrack platform's specific needs.
