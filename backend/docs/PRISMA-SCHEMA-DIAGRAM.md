# BlickTrack Prisma Schema Visual Diagram

**Database Relationship Diagram for Enterprise Cybersecurity Platform**

This document provides a visual representation of the BlickTrack database schema relationships using Mermaid diagrams.

## Complete Database Schema Diagram

```mermaid
erDiagram
    %% Core Tenant Management
    Tenant ||--o{ User : "has many"
    Tenant ||--o{ Department : "has many"
    Tenant ||--o{ Project : "has many"
    Tenant ||--o{ OrganizationalUnit : "has many"
    Tenant ||--o{ BusinessEntity : "has many"
    Tenant ||--o{ AuditLog : "has many"
    Tenant ||--|| TenantConfiguration : "has one"
    
    %% User Management
    User ||--o{ UserSession : "has many"
    User ||--o{ UserFeatureAccess : "has many"
    User ||--o{ ThreatModel : "creates"
    User ||--o{ Project : "owns"
    User ||--o{ BusinessEntity : "owns"
    User ||--o{ SecurityProject : "owns"
    User ||--o{ ActivityTemplate : "creates"
    User ||--o{ AuditLog : "performs"
    User }o--|| Department : "belongs to"
    User }o--o| OrganizationalUnit : "belongs to"
    
    %% Organizational Structure
    Department ||--o{ Department : "parent-child"
    Department ||--o{ Project : "contains"
    Department ||--o{ User : "has many"
    
    OrganizationalUnit ||--o{ OrganizationalUnit : "parent-child"
    OrganizationalUnit ||--o{ BusinessEntity : "contains"
    OrganizationalUnit ||--o{ User : "has many"
    OrganizationalUnit }o--o| User : "managed by"
    
    %% Business Entity Management
    BusinessEntity ||--o{ BusinessEntity : "parent-child"
    BusinessEntity ||--o{ SecurityProject : "has many"
    BusinessEntity ||--o{ EntityAccess : "has many"
    BusinessEntity }o--o| OrganizationalUnit : "belongs to"
    BusinessEntity }o--o| User : "owned by"
    
    EntityAccess }o--|| BusinessEntity : "controls access to"
    EntityAccess }o--o| User : "granted to"
    EntityAccess }o--o| Role : "granted to"
    
    %% Project Management
    Project ||--o{ Project : "parent-child"
    Project ||--o{ ThreatModel : "contains"
    Project ||--o{ ProjectHierarchyPermission : "has many"
    Project }o--o| Department : "belongs to"
    Project }o--o| User : "owned by"
    
    ProjectHierarchyPermission }o--|| Project : "controls access to"
    ProjectHierarchyPermission }o--o| User : "granted to"
    ProjectHierarchyPermission }o--o| Role : "granted to"
    
    %% Security and Access Control
    Role ||--o{ RolePermission : "has many"
    Role ||--o{ PrincipalAssignment : "assigned via"
    Role ||--o{ ProjectHierarchyPermission : "grants via"
    Role ||--o{ EntityAccess : "grants via"
    
    Permission ||--o{ RolePermission : "granted via"
    
    PrincipalAssignment }o--|| Principal : "assigns"
    PrincipalAssignment }o--|| Role : "assigns"
    
    %% Feature Licensing System
    FeaturePlan ||--o{ PlanFeature : "includes"
    FeaturePlan ||--o{ Tenant : "subscribed by"
    
    Feature ||--o{ PlanFeature : "included in"
    Feature ||--o{ UserFeatureAccess : "accessed via"
    
    PlanFeature }o--|| FeaturePlan : "belongs to"
    PlanFeature }o--|| Feature : "includes"
    
    UserFeatureAccess }o--|| User : "grants access to"
    UserFeatureAccess }o--|| Feature : "grants access to"
    UserFeatureAccess }o--|| Tenant : "within"
    
    %% Compliance and Audit
    ComplianceFramework ||--o{ ComplianceRequirement : "contains"
    
    %% Activity Templates and Security Projects
    ActivityTemplate ||--o{ SecurityProject : "instantiated as"
    ActivityTemplate }o--o| User : "created by"
    
    SecurityProject }o--|| ActivityTemplate : "based on"
    SecurityProject }o--|| BusinessEntity : "applies to"
    SecurityProject }o--o| User : "owned by"
    SecurityProject }o--|| Tenant : "within"
    
    %% Threat Modeling
    ThreatModel }o--|| Project : "belongs to"
    ThreatModel }o--|| User : "created by"
    ThreatModel }o--|| Tenant : "within"
    
    %% Verification Tokens
    VerificationToken }o--o| User : "belongs to"
```

## Core Architecture Layers

### Layer 1: Tenant and Configuration
```mermaid
graph TD
    A[Tenant] --> B[TenantConfiguration]
    A --> C[Users]
    A --> D[Departments]
    A --> E[OrganizationalUnits]
    A --> F[BusinessEntities]
    A --> G[Projects]
    A --> H[AuditLogs]
```

### Layer 2: User Management and Authentication
```mermaid
graph TD
    A[User] --> B[UserSession]
    A --> C[UserFeatureAccess]
    A --> D[VerificationToken]
    A --> E[AuditLog]
    A --> F[ThreatModel]
    A --> G[Project]
    A --> H[BusinessEntity]
    A --> I[SecurityProject]
    A --> J[ActivityTemplate]
```

### Layer 3: Organizational Structure
```mermaid
graph TD
    A[Department] --> B[Department]
    A --> C[Project]
    A --> D[User]
    
    E[OrganizationalUnit] --> F[OrganizationalUnit]
    E --> G[BusinessEntity]
    E --> H[User]
    
    I[BusinessEntity] --> J[BusinessEntity]
    I --> K[SecurityProject]
    I --> L[EntityAccess]
```

### Layer 4: Security and Access Control
```mermaid
graph TD
    A[Role] --> B[RolePermission]
    A --> C[PrincipalAssignment]
    A --> D[ProjectHierarchyPermission]
    A --> E[EntityAccess]
    
    F[Permission] --> G[RolePermission]
    
    H[Principal] --> I[PrincipalAssignment]
    
    J[User] --> K[PrincipalAssignment]
    J --> L[ProjectHierarchyPermission]
    J --> M[EntityAccess]
```

### Layer 5: Feature Licensing
```mermaid
graph TD
    A[FeaturePlan] --> B[PlanFeature]
    A --> C[Tenant]
    
    D[Feature] --> E[PlanFeature]
    D --> F[UserFeatureAccess]
    
    G[User] --> H[UserFeatureAccess]
    G --> I[Tenant]
```

### Layer 6: Compliance and Audit
```mermaid
graph TD
    A[ComplianceFramework] --> B[ComplianceRequirement]
    
    C[AuditLog] --> D[User]
    C --> E[Tenant]
    
    F[ActivityTemplate] --> G[SecurityProject]
    F --> H[User]
    
    I[SecurityProject] --> J[BusinessEntity]
    I --> K[User]
    I --> L[Tenant]
```

## Key Relationship Patterns

### 1. Multi-Tenant Isolation
Every major entity is connected to a Tenant, ensuring complete data isolation:
- Tenant → Users, Projects, Departments, etc.
- All queries are automatically scoped to the current tenant

### 2. Hierarchical Structures
Several entities support self-referencing hierarchies:
- Department → Department (parent-child)
- OrganizationalUnit → OrganizationalUnit (parent-child)
- BusinessEntity → BusinessEntity (parent-child)
- Project → Project (parent-child)

### 3. Access Control Patterns
Multiple access control mechanisms work together:
- Role → Permission (RBAC)
- User → Role (via PrincipalAssignment)
- User → Feature (via UserFeatureAccess)
- User → Project (via ProjectHierarchyPermission)
- User → BusinessEntity (via EntityAccess)

### 4. Audit and Compliance
Comprehensive audit trail:
- Every action is logged in AuditLog
- All entities are connected to their creators
- Compliance frameworks provide structure for requirements

## Data Flow Patterns

### 1. User Authentication and Authorization
```
User → UserSession → Role → Permission → Resource Access
```

### 2. Feature Access Control
```
User → UserFeatureAccess → Feature → PlanFeature → FeaturePlan
```

### 3. Project Management
```
User → Project → ProjectHierarchyPermission → Access Control
```

### 4. Business Entity Management
```
User → BusinessEntity → EntityAccess → Access Control
```

### 5. Security Activity Execution
```
User → ActivityTemplate → SecurityProject → BusinessEntity → Results
```

This diagram shows the comprehensive relationships between all database tables, demonstrating how the BlickTrack platform supports enterprise-grade cybersecurity management with multi-tenant architecture, hierarchical organization, advanced access control, and comprehensive audit capabilities.
