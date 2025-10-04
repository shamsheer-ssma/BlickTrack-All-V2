# BlickTrack RBAC System Documentation

**Date**: January 27, 2025  
**Version**: 1.0  
**Author**: BlickTrack Development Team  

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [RBAC Architecture](#rbac-architecture)
3. [User Roles & Permissions](#user-roles--permissions)
4. [Dashboard Access by User](#dashboard-access-by-user)
5. [Database Schema](#database-schema)
6. [Implementation Details](#implementation-details)
7. [Security Features](#security-features)
8. [Future Enhancements](#future-enhancements)

---

## 🎯 Overview

BlickTrack implements a comprehensive **Role-Based Access Control (RBAC)** system with **Attribute-Based Access Control (ABAC)** support for enterprise-grade security. The system supports multi-tenant architecture with complete data isolation between tenants.

### Key Features
- ✅ **34 Granular Permissions** across all system modules
- ✅ **7 Enterprise Roles** per tenant
- ✅ **Multi-tenant Isolation** with tenant-specific roles
- ✅ **ABAC Support** with user attributes
- ✅ **Audit Trail** for all role assignments and permissions
- ✅ **JWT-based Authentication** with role-based authorization

---

## 🏗️ RBAC Architecture

### System Components

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   USERS         │    │     ROLES       │    │  PERMISSIONS    │
│                 │    │                 │    │                 │
│ • User Data     │    │ • Role Names    │    │ • Actions       │
│ • Attributes    │    │ • Descriptions  │    │ • Resources     │
│ • Tenant ID     │    │ • Tenant Scope  │    │ • Risk Levels   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   USER ROLES    │    │ ROLE PERMISSIONS│    │ USER ATTRIBUTES │
│                 │    │                 │    │                 │
│ • User ↔ Role   │    │ • Role ↔ Perm   │    │ • ABAC Rules    │
│ • Scope         │    │ • Granted/Deny  │    │ • Classifications│
│ • Expiration    │    │ • Conditions    │    │ • Metadata      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## 👥 User Roles & Permissions

### 🔵 Platform Administrator
**Scope**: Global/Platform-wide  
**Access Level**: System  
**Tenant Isolation**: No (cross-tenant access)

#### Permissions
- ✅ `system:manage` - Full system management
- ✅ `tenant:manage` - Manage all tenants
- ✅ `tenant:create` - Create new tenants
- ✅ `tenant:read` - Read tenant information
- ✅ `tenant:update` - Update tenant settings
- ✅ `tenant:delete` - Delete tenants
- ✅ `user:manage` - Full user management across all tenants
- ✅ `project:create/read/update/delete` - Project management
- ✅ `threat_model:*` - All threat modeling operations
- ✅ `vulnerability:*` - All vulnerability management
- ✅ `resource:*` - All resource operations
- ✅ `audit:read/export` - Audit capabilities

#### Assigned Users
- `admin@blicktrack.com`

---

### 🟢 Tenant Administrator
**Scope**: Tenant-specific  
**Access Level**: Tenant  
**Tenant Isolation**: Yes (tenant-only access)

#### Permissions
- ✅ `tenant:read/update` - Tenant settings
- ✅ `user:manage` - User management within tenant
- ✅ `user:create/read/update/delete/invite/suspend/activate`
- ✅ `project:create/read/update/delete/assign/archive`
- ✅ `threat_model:create/read/update/delete/approve`
- ✅ `vulnerability:create/read/update/delete/triage`
- ✅ `resource:create/read/update/delete/share/export`
- ✅ `audit:read/export` - Audit capabilities

#### Assigned Users
- `tenant@blicktrack.com` (BlickTrack Demo)
- `shezassma@gmail.com` (UTC Technologies)
- `syedssma@gmail.com` (Huawei Technologies)

---

### 🟡 Security Manager
**Scope**: Tenant-specific  
**Access Level**: Tenant  
**Tenant Isolation**: Yes

#### Permissions
- ✅ `user:read/update` - Limited user management
- ✅ `project:read/update/assign` - Project oversight
- ✅ `threat_model:create/read/update/delete/approve`
- ✅ `vulnerability:create/read/update/delete/triage`
- ✅ `resource:create/read/update/delete/share/export`
- ✅ `audit:read/export`

#### Assigned Users
- Currently no users assigned (can be assigned to tenant users)

---

### 🟠 Security Analyst
**Scope**: Tenant-specific  
**Access Level**: Tenant  
**Tenant Isolation**: Yes

#### Permissions
- ✅ `user:read` - Read-only user access
- ✅ `project:read` - Read-only project access
- ✅ `threat_model:create/read/update`
- ✅ `vulnerability:create/read/update/triage`
- ✅ `resource:create/read/update/export`
- ✅ `audit:read`

#### Assigned Users
- `analyst@blicktrack.com`

---

### 🔶 Software Developer
**Scope**: Tenant-specific  
**Access Level**: Tenant  
**Tenant Isolation**: Yes

#### Permissions
- ✅ `user:read` - Read-only user access
- ✅ `project:read/update` - Project development access
- ✅ `threat_model:read/create/update`
- ✅ `vulnerability:read/create/update`
- ✅ `resource:create/read/update`
- ✅ `audit:read`

#### Assigned Users
- `developer@blicktrack.com`

---

### 🔷 Project Manager
**Scope**: Tenant-specific  
**Access Level**: Tenant  
**Tenant Isolation**: Yes

#### Permissions
- ✅ `user:read/update` - User coordination
- ✅ `project:create/read/update/delete/assign/archive`
- ✅ `threat_model:read`
- ✅ `vulnerability:read`
- ✅ `resource:read/update/export`
- ✅ `audit:read`

#### Assigned Users
- Currently no users assigned (can be assigned to tenant users)

---

### ⚪ Viewer
**Scope**: Tenant-specific  
**Access Level**: Tenant  
**Tenant Isolation**: Yes

#### Permissions
- ✅ `user:read` - Read-only user access
- ✅ `project:read` - Read-only project access
- ✅ `threat_model:read` - Read-only threat models
- ✅ `vulnerability:read` - Read-only vulnerabilities
- ✅ `resource:read` - Read-only resources
- ✅ `audit:read` - Read-only audit logs

#### Assigned Users
- `sheetalssma@gmail.com` (UTC Technologies)
- `syedssmaos@gmail.com` (Huawei Technologies)

---

## 🖥️ Dashboard Access by User

### Current Dashboard Routing

| User Email | Job Title | RBAC Role | Dashboard Route | Access Level |
|------------|-----------|-----------|-----------------|--------------|
| `admin@blicktrack.com` | Platform Administrator | Platform Administrator | `/features/dashboard/platform-admin` | System-wide |
| `tenant@blicktrack.com` | Tenant Administrator | Tenant Administrator | `/features/dashboard/tenant-admin` | BlickTrack Demo |
| `shezassma@gmail.com` | UTC Administrator | Tenant Administrator | `/features/dashboard/tenant-admin` | UTC Technologies |
| `syedssma@gmail.com` | Huawei Administrator | Tenant Administrator | `/features/dashboard/tenant-admin` | Huawei Technologies |
| `analyst@blicktrack.com` | Security Analyst | Security Analyst | `/features/dashboard/trial-user` ⚠️ | BlickTrack Demo |
| `developer@blicktrack.com` | Software Developer | Software Developer | `/features/dashboard/trial-user` ⚠️ | BlickTrack Demo |
| `sheetalssma@gmail.com` | UTC User | Viewer | `/features/dashboard/trial-user` | UTC Technologies |
| `syedssmaos@gmail.com` | Huawei User | Viewer | `/features/dashboard/trial-user` | Huawei Technologies |

### ⚠️ Dashboard Issues to Fix

**Missing Dashboards:**
1. **Security Analyst Dashboard** - `analyst@blicktrack.com` currently sees Trial User dashboard
2. **Software Developer Dashboard** - `developer@blicktrack.com` currently sees Trial User dashboard

**Required Actions:**
1. Create `/features/dashboard/security-analyst/page.tsx`
2. Create `/features/dashboard/software-developer/page.tsx`
3. Update dashboard routing logic to handle these roles

---

## 🗄️ Database Schema

### Core RBAC Tables

#### 1. `roles` Table
```sql
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  description TEXT,
  display_name VARCHAR,
  type VARCHAR DEFAULT 'custom', -- 'system', 'tenant', 'custom'
  level VARCHAR DEFAULT 'tenant', -- 'platform', 'tenant', 'custom'
  is_built_in BOOLEAN DEFAULT false,
  is_system_role BOOLEAN DEFAULT false,
  is_default BOOLEAN DEFAULT false,
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  organization_id UUID REFERENCES organizations(id),
  max_users INTEGER,
  is_inheritable BOOLEAN DEFAULT true,
  expires_at TIMESTAMP,
  requires_approval BOOLEAN DEFAULT false,
  sensitivity_level VARCHAR, -- 'public', 'internal', 'confidential', 'restricted'
  risk_level VARCHAR, -- 'low', 'medium', 'high', 'critical'
  azure_ad_group VARCHAR,
  metadata JSONB DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_modified_by VARCHAR,
  UNIQUE(name, tenant_id)
);
```

#### 2. `permissions` Table
```sql
CREATE TABLE permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR UNIQUE NOT NULL,
  description TEXT,
  display_name VARCHAR,
  category VARCHAR NOT NULL, -- 'system', 'tenant', 'user', 'project', etc.
  action VARCHAR NOT NULL, -- 'create', 'read', 'update', 'delete', 'manage'
  resource VARCHAR NOT NULL, -- 'user', 'project', 'threat_model', etc.
  is_system_permission BOOLEAN DEFAULT false,
  risk_level VARCHAR DEFAULT 'low',
  requires_mfa BOOLEAN DEFAULT false,
  requires_approval BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 3. `role_permissions` Table
```sql
CREATE TABLE role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID NOT NULL REFERENCES roles(id),
  permission_id UUID NOT NULL REFERENCES permissions(id),
  granted BOOLEAN DEFAULT true,
  conditions JSONB,
  metadata JSONB DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  granted_by VARCHAR,
  granted_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  UNIQUE(role_id, permission_id)
);
```

#### 4. `user_roles` Table
```sql
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  role_id UUID NOT NULL REFERENCES roles(id),
  scope VARCHAR NOT NULL, -- 'tenant', 'organization', 'department', 'project'
  scope_id VARCHAR,
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  assigned_by VARCHAR NOT NULL,
  assigned_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  is_temporary BOOLEAN DEFAULT false,
  requires_approval BOOLEAN DEFAULT false,
  conditions JSONB,
  metadata JSONB DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  approved_at TIMESTAMP,
  approved_by VARCHAR,
  rejected_at TIMESTAMP,
  rejected_by VARCHAR,
  rejection_reason VARCHAR,
  UNIQUE(user_id, role_id, scope, scope_id, tenant_id)
);
```

#### 5. `user_attributes` Table (ABAC)
```sql
CREATE TABLE user_attributes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  key VARCHAR NOT NULL,
  value VARCHAR NOT NULL,
  value_type VARCHAR DEFAULT 'string', -- 'string', 'boolean', 'number', 'date'
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  source VARCHAR DEFAULT 'manual', -- 'manual', 'ldap', 'sso', 'hr_system'
  is_system_attribute BOOLEAN DEFAULT false,
  is_encrypted BOOLEAN DEFAULT false,
  is_sensitive BOOLEAN DEFAULT false,
  classification VARCHAR, -- 'public', 'internal', 'confidential', 'restricted'
  metadata JSONB DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_modified_by VARCHAR,
  UNIQUE(user_id, key)
);
```

---

## 🔧 Implementation Details

### Login API Flow
1. **User Authentication** - Verify email/password
2. **Fetch User Data** - Get user with tenant/organization context
3. **Get RBAC Data** - Fetch user roles and permissions
4. **Generate JWT** - Include role and permission data in token
5. **Return Response** - User data with roles/permissions

### Database Functions
- `findUserByEmail()` - Get user with tenant context
- `getUserRolesAndPermissions()` - Get user's roles and permissions
- `verifyPassword()` - Password verification
- `updateLastLogin()` - Track login activity

### Frontend Integration
- **JWT Token** contains role and permission data
- **Header Display** shows actual user role from database
- **Dashboard Routing** based on user's primary role
- **Permission Checks** for UI element visibility

---

## 🔒 Security Features

### Multi-Tenant Isolation
- ✅ **Tenant-Scoped Roles** - Each tenant has separate role instances
- ✅ **Data Isolation** - Users can only access their tenant's data
- ✅ **Permission Isolation** - Permissions are tenant-specific

### Security Classifications
- **Sensitivity Levels**: public, internal, confidential, restricted
- **Risk Levels**: low, medium, high, critical
- **MFA Requirements** - Certain permissions require MFA
- **Approval Requirements** - Critical permissions require approval

### Audit Trail
- ✅ **Role Assignments** - Who assigned what role when
- ✅ **Permission Grants** - Who granted what permission when
- ✅ **User Attributes** - Changes to user attributes
- ✅ **Login Tracking** - Last login time and IP address

---

## 🚀 Future Enhancements

### Planned Features
1. **Custom Roles** - Allow tenants to create custom roles
2. **Temporary Permissions** - Time-limited access grants
3. **Approval Workflows** - Multi-step approval for sensitive permissions
4. **Azure AD Integration** - Automatic role assignment from AD groups
5. **Advanced ABAC** - Complex attribute-based rules
6. **Permission Analytics** - Usage tracking and optimization

### Dashboard Improvements
1. **Role-Specific Dashboards** - Dedicated dashboards for each role
2. **Permission-Based UI** - Show/hide features based on permissions
3. **Multi-Role Support** - Handle users with multiple roles
4. **Dynamic Navigation** - Menu items based on user permissions

---

## 📞 Support & Maintenance

### Database Maintenance
- **Regular Cleanup** - Remove expired role assignments
- **Permission Audits** - Review and optimize permission grants
- **User Attribute Updates** - Sync with external systems (LDAP, HR)

### Monitoring
- **Failed Login Attempts** - Track and alert on suspicious activity
- **Permission Usage** - Monitor which permissions are used most
- **Role Changes** - Audit trail for all role modifications

---

**Last Updated**: January 27, 2025  
**Next Review**: February 27, 2025  
**Document Owner**: BlickTrack Security Team


