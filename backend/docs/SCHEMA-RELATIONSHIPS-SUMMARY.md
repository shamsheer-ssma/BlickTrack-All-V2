# BlickTrack Schema Relationships Summary

**Visual Summary of Database Table Relationships**

This document provides a simplified, visual summary of the key relationships in the BlickTrack database schema.

## Core Entity Relationships

### 1. Tenant-Centric Architecture
```
Tenant (Organization)
├── Users (People in the organization)
├── Departments (Organizational units)
├── Projects (Security projects)
├── BusinessEntities (Products/Services/Projects)
├── OrganizationalUnits (Flexible org structure)
├── AuditLogs (All activities)
└── Configuration (Tenant-specific settings)
```

### 2. User Management Hierarchy
```
User (Person)
├── UserSessions (Active sessions)
├── UserFeatureAccess (Feature permissions)
├── ThreatModels (Created threat models)
├── Projects (Owned projects)
├── BusinessEntities (Owned entities)
├── SecurityProjects (Owned security activities)
├── ActivityTemplates (Created templates)
└── AuditLogs (Performed actions)
```

### 3. Organizational Structure
```
Department (Traditional org unit)
├── Users (Department members)
├── Projects (Department projects)
└── Departments (Sub-departments)

OrganizationalUnit (Flexible org unit)
├── Users (Unit members)
├── BusinessEntities (Unit entities)
├── OrganizationalUnits (Sub-units)
└── Manager (Unit manager)
```

### 4. Business Entity Management
```
BusinessEntity (Universal container)
├── BusinessEntities (Sub-entities)
├── SecurityProjects (Security activities)
├── EntityAccess (Access control)
├── OrganizationalUnit (Belongs to)
└── Owner (Entity owner)
```

### 5. Project Management
```
Project (Security project)
├── Projects (Sub-projects)
├── ThreatModels (Project threat models)
├── ProjectHierarchyPermission (Access control)
├── Department (Belongs to)
└── Owner (Project owner)
```

## Security and Access Control

### 1. Role-Based Access Control (RBAC)
```
Role (Permission group)
├── RolePermissions (Specific permissions)
├── PrincipalAssignments (User assignments)
├── ProjectHierarchyPermissions (Project access)
└── EntityAccess (Entity access)

Permission (Individual permission)
└── RolePermissions (Granted via roles)
```

### 2. Feature Licensing
```
FeaturePlan (Subscription tier)
├── PlanFeatures (Included features)
└── Tenants (Subscribed tenants)

Feature (Individual capability)
├── PlanFeatures (Plan associations)
└── UserFeatureAccess (User access)

User (Person)
└── UserFeatureAccess (Feature permissions)
```

### 3. Access Control Matrix
```
User → Role → Permission → Resource
User → Feature → Plan → Access
User → Project → Permission → Access
User → BusinessEntity → Access → Control
```

## Compliance and Audit

### 1. Compliance Framework
```
ComplianceFramework (Security standard)
└── ComplianceRequirements (Specific requirements)

AuditLog (Activity record)
├── User (Who performed action)
├── Tenant (Which organization)
└── Resource (What was affected)
```

### 2. Activity Management
```
ActivityTemplate (Pre-built activity)
├── SecurityProjects (Instantiations)
└── Creator (Template author)

SecurityProject (Active activity)
├── ActivityTemplate (Based on)
├── BusinessEntity (Applies to)
├── Owner (Project owner)
└── Tenant (Within organization)
```

## Data Flow Patterns

### 1. User Authentication and Authorization
```
Login → Session → Role → Permission → Resource Access
```

### 2. Feature Access Control
```
User → Feature Request → License Check → Access Grant/Deny
```

### 3. Project Management
```
User → Project Creation → Permission Assignment → Hierarchy Update
```

### 4. Security Activity Execution
```
Template Selection → Project Creation → Entity Assignment → Progress Tracking
```

## Key Design Principles

### 1. Multi-Tenant Isolation
- Every table has a `tenantId` field
- All queries are tenant-scoped
- Complete data isolation between organizations

### 2. Hierarchical Organization
- Self-referencing tables for complex hierarchies
- Parent-child relationships with inheritance
- Flexible organizational structures

### 3. Granular Access Control
- Multiple access control mechanisms
- Role-based and attribute-based permissions
- Scope-based access control

### 4. Comprehensive Audit
- All actions are logged
- Risk-based audit levels
- Compliance framework support

### 5. Feature Licensing
- Plan-based feature access
- User-level permissions
- Usage tracking and limits

## Table Categories

### Core Management (6 tables)
- Tenant, TenantConfiguration, User, UserSession, VerificationToken, Principal

### Organizational Structure (4 tables)
- Department, OrganizationalUnit, BusinessEntity, EntityAccess

### Project Management (3 tables)
- Project, ProjectHierarchyPermission, ThreatModel

### Security & Access Control (4 tables)
- Role, Permission, RolePermission, PrincipalAssignment

### Feature Licensing (4 tables)
- FeaturePlan, Feature, PlanFeature, UserFeatureAccess

### Compliance & Audit (3 tables)
- ComplianceFramework, ComplianceRequirement, AuditLog

### Activity Management (2 tables)
- ActivityTemplate, SecurityProject

## Relationship Summary

### Primary Relationships
- **Tenant** → **Users** (1:many)
- **Tenant** → **Projects** (1:many)
- **User** → **Sessions** (1:many)
- **Project** → **ThreatModels** (1:many)
- **Role** → **Permissions** (1:many)

### Hierarchical Relationships
- **Department** → **Department** (self-referencing)
- **OrganizationalUnit** → **OrganizationalUnit** (self-referencing)
- **BusinessEntity** → **BusinessEntity** (self-referencing)
- **Project** → **Project** (self-referencing)

### Access Control Relationships
- **User** → **Role** (via PrincipalAssignment)
- **User** → **Feature** (via UserFeatureAccess)
- **User** → **Project** (via ProjectHierarchyPermission)
- **User** → **BusinessEntity** (via EntityAccess)

This schema design enables the BlickTrack platform to support complex enterprise cybersecurity management while maintaining security, compliance, and operational excellence.
