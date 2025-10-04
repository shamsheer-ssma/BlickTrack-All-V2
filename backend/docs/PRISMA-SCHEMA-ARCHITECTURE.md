# BlickTrack Prisma Schema Architecture Guide

**Enterprise Cybersecurity Platform Database Architecture**

This document provides a comprehensive, non-technical explanation of the BlickTrack database schema, its relationships, architecture, and how it supports the enterprise cybersecurity platform.

## Table of Contents

1. [Overview](#overview)
2. [Core Architecture Principles](#core-architecture-principles)
3. [Database Tables and Their Purposes](#database-tables-and-their-purposes)
4. [Key Relationships and Dependencies](#key-relationships-and-dependencies)
5. [Multi-Tenant Architecture](#multi-tenant-architecture)
6. [Security and Access Control](#security-and-access-control)
7. [Feature Licensing System](#feature-licensing-system)
8. [Compliance and Audit System](#compliance-and-audit-system)
9. [Data Flow and Usage Patterns](#data-flow-and-usage-patterns)
10. [Business Logic and Rules](#business-logic-and-rules)

## Overview

The BlickTrack database is designed as a comprehensive, enterprise-grade cybersecurity platform that supports:

- **Multi-tenant architecture** - Multiple organizations can use the platform independently
- **Hierarchical project management** - Complex organizational structures with portfolios, programs, products, and projects
- **Advanced security controls** - Role-based access control (RBAC) and attribute-based access control (ABAC)
- **Feature licensing** - Granular control over which features users can access
- **Compliance management** - Support for various security frameworks and audit requirements
- **Activity templates** - Pre-built security activity templates for different industries

## Core Architecture Principles

### 1. Multi-Tenant Design
Every piece of data belongs to a specific tenant (organization), ensuring complete data isolation between different companies using the platform.

### 2. Hierarchical Organization
The system supports complex organizational structures with multiple levels:
- **Platform Level** - Global administration
- **Tenant Level** - Individual organizations
- **Department Level** - Organizational units within tenants
- **Project Level** - Individual projects and work items

### 3. Flexible Entity Management
The system can handle different types of business entities (products, projects, services) in a unified way while maintaining their specific characteristics.

### 4. Security-First Approach
Every action is logged, every access is controlled, and every permission is explicitly defined.

## Database Tables and Their Purposes

### Core Tenant Management

#### `Tenant` Table
**Purpose**: Represents an organization using the BlickTrack platform
**Key Information**:
- Organization name, domain, and unique identifier
- Subscription plan and licensing information
- Security settings (MFA requirements, password policies)
- Compliance framework preferences
- API quotas and integration settings

**Business Value**: Each tenant is a separate company with their own data, users, and security requirements.

#### `TenantConfiguration` Table
**Purpose**: Stores industry-specific settings and terminology for each tenant
**Key Information**:
- Industry type (aerospace, financial, healthcare, etc.)
- Custom terminology (what they call "products" vs "solutions")
- Default security frameworks and risk levels
- UI/UX customization (themes, colors, logos)
- Compliance and approval requirements

**Business Value**: Allows the platform to adapt to different industries and organizational cultures.

### User Management and Authentication

#### `User` Table
**Purpose**: Stores information about all users in the system
**Key Information**:
- Personal details (name, email, phone, title)
- Authentication data (password hashes, MFA settings)
- Status and activity tracking
- Role and permissions
- Multi-tenant context (which organization they belong to)

**Business Value**: Centralized user management with security controls and activity tracking.

#### `UserSession` Table
**Purpose**: Tracks active user sessions for security and analytics
**Key Information**:
- Session tokens and expiration
- Device and location information
- Security status (HTTPS, MFA verification)
- Activity timestamps

**Business Value**: Enables session management, security monitoring, and user activity tracking.

### Organizational Structure

#### `OrganizationalUnit` Table
**Purpose**: Represents flexible organizational structures within tenants
**Key Information**:
- Unit name, description, and hierarchy
- Manager assignments and cost centers
- Geographic and timezone information
- Metadata for custom properties

**Business Value**: Supports any organizational structure from flat teams to complex corporate hierarchies.

#### `Department` Table
**Purpose**: Traditional department-based organization within tenants
**Key Information**:
- Department name and hierarchy
- Cost center and manager information
- Status and activity tracking

**Business Value**: Provides familiar department-based organization for traditional corporate structures.

### Business Entity Management

#### `BusinessEntity` Table
**Purpose**: Universal container for any type of business work (products, projects, services)
**Key Information**:
- Entity name, type, and classification
- Hierarchy support (can contain other entities)
- Ownership and organizational assignment
- Lifecycle management (status, phases, timeline)
- Financial tracking (budget, spending)
- Risk and compliance information

**Business Value**: Unified approach to managing different types of business work while maintaining their specific characteristics.

#### `EntityAccess` Table
**Purpose**: Controls who can access which business entities
**Key Information**:
- User or role assignments
- Access levels (read, write, admin, owner)
- Delegation permissions
- Expiration and audit trail

**Business Value**: Granular access control for business entities with full audit trail.

### Project Management

#### `Project` Table
**Purpose**: Manages security projects and their hierarchical relationships
**Key Information**:
- Project name, description, and type
- Hierarchical structure (parent-child relationships)
- Status, priority, and classification
- Ownership and organizational context
- Compliance and risk information
- Timeline and metadata

**Business Value**: Supports complex project hierarchies while maintaining security and compliance requirements.

#### `ProjectHierarchyPermission` Table
**Purpose**: Manages access control across project hierarchies
**Key Information**:
- User or role assignments to projects
- Permission levels and inheritance
- Tenant context and audit trail

**Business Value**: Enables fine-grained access control across complex project structures.

### Security and Access Control

#### `Role` Table
**Purpose**: Defines roles that can be assigned to users
**Key Information**:
- Role name, description, and type
- Tenant context (global or tenant-specific)
- Built-in vs custom roles
- Associated permissions

**Business Value**: Provides flexible role-based access control that can be customized per tenant.

#### `Permission` Table
**Purpose**: Defines individual permissions that can be granted
**Key Information**:
- Permission name and description
- Resource and action definitions
- Category and risk level
- Provider information

**Business Value**: Granular permission system that follows industry standards.

#### `RolePermission` Table
**Purpose**: Links roles to their specific permissions
**Key Information**:
- Role and permission associations
- Permission state (granted/denied)
- ABAC conditions for dynamic access control

**Business Value**: Enables complex permission combinations and conditional access control.

#### `PrincipalAssignment` Table
**Purpose**: Assigns roles to users or groups at specific scopes
**Key Information**:
- Principal (user/group) and role assignments
- Scope definition (where the role applies)
- Assignment metadata and expiration
- ABAC conditions

**Business Value**: Implements Azure-style role assignments with scope-based access control.

### Feature Licensing System

#### `FeaturePlan` Table
**Purpose**: Defines subscription plans and their capabilities
**Key Information**:
- Plan name and pricing
- User and project limits
- Storage and feature limits
- Public availability

**Business Value**: Enables different pricing tiers with appropriate feature limitations.

#### `Feature` Table
**Purpose**: Defines individual features that can be licensed
**Key Information**:
- Feature key, name, and description
- Category and type
- Default configuration

**Business Value**: Granular feature management for licensing and access control.

#### `PlanFeature` Table
**Purpose**: Links features to plans with specific configurations
**Key Information**:
- Plan and feature associations
- Feature configuration per plan
- User limits per feature
- Current usage tracking

**Business Value**: Enables per-feature licensing with usage tracking and limits.

#### `UserFeatureAccess` Table
**Purpose**: Tracks which users have access to which features
**Key Information**:
- User and feature associations
- Access status and expiration
- Usage tracking and audit trail
- Grant/revoke history

**Business Value**: Implements granular feature access control with usage monitoring.

### Compliance and Audit

#### `ComplianceFramework` Table
**Purpose**: Defines security compliance frameworks
**Key Information**:
- Framework name and version
- Category and authority
- Status and metadata

**Business Value**: Supports multiple compliance frameworks for different industries and requirements.

#### `ComplianceRequirement` Table
**Purpose**: Defines specific requirements within compliance frameworks
**Key Information**:
- Requirement code and title
- Category and priority
- Implementation guidance
- References and documentation

**Business Value**: Provides detailed compliance requirements with implementation guidance.

#### `AuditLog` Table
**Purpose**: Records all system activities for security and compliance
**Key Information**:
- Event type and action details
- User and resource context
- Request information (IP, user agent, location)
- Change tracking (old/new values)
- Risk level and severity
- Review status

**Business Value**: Comprehensive audit trail for security monitoring and compliance reporting.

### Activity Templates and Security Projects

#### `ActivityTemplate` Table
**Purpose**: Pre-built templates for security activities
**Key Information**:
- Template name, category, and complexity
- Framework alignment and standards
- Step-by-step instructions
- Required skills and tools
- Industry applicability
- Usage statistics

**Business Value**: Provides standardized, industry-specific security activity templates.

#### `SecurityProject` Table
**Purpose**: Instantiated security activities from templates
**Key Information**:
- Project name and description
- Template reference and business context
- Status, priority, and risk level
- Ownership and assignment
- Timeline and progress tracking
- Results and deliverables
- Compliance and audit evidence

**Business Value**: Enables systematic execution of security activities with progress tracking and compliance evidence.

### Threat Modeling

#### `ThreatModel` Table
**Purpose**: Stores threat modeling data and results
**Key Information**:
- Model name, version, and methodology
- Canvas data (diagrams and flows)
- Assets, threats, and mitigations
- Status and classification
- Ownership and project context
- Review and approval status
- Compliance notes

**Business Value**: Centralized threat modeling data with review workflows and compliance integration.

## Key Relationships and Dependencies

### Primary Relationships

1. **Tenant → Users**: Each tenant has many users
2. **Tenant → Departments**: Each tenant has many departments
3. **Tenant → Projects**: Each tenant has many projects
4. **User → UserSessions**: Each user can have multiple active sessions
5. **Project → ThreatModels**: Each project can have multiple threat models
6. **Role → Permissions**: Each role has many permissions
7. **User → FeatureAccess**: Each user can have access to multiple features

### Hierarchical Relationships

1. **OrganizationalUnit → OrganizationalUnit**: Self-referencing hierarchy
2. **Department → Department**: Self-referencing hierarchy
3. **BusinessEntity → BusinessEntity**: Self-referencing hierarchy
4. **Project → Project**: Self-referencing hierarchy

### Cross-Table Dependencies

1. **TenantConfiguration → Tenant**: One-to-one relationship
2. **EntityAccess → BusinessEntity**: Many-to-one relationship
3. **EntityAccess → User**: Many-to-one relationship
4. **ProjectHierarchyPermission → Project**: Many-to-one relationship
5. **SecurityProject → ActivityTemplate**: Many-to-one relationship
6. **SecurityProject → BusinessEntity**: Many-to-one relationship

## Multi-Tenant Architecture

### Data Isolation
- Every table includes a `tenantId` field
- All queries are automatically scoped to the current tenant
- No data can be accessed across tenant boundaries

### Tenant-Specific Configuration
- Each tenant can have custom terminology and settings
- Industry-specific templates and frameworks
- Custom UI/UX themes and branding

### Scalability
- Supports unlimited tenants
- Each tenant can have unlimited users and projects
- Hierarchical organization supports complex structures

## Security and Access Control

### Role-Based Access Control (RBAC)
- Users are assigned roles
- Roles have specific permissions
- Permissions control access to resources

### Attribute-Based Access Control (ABAC)
- Access decisions based on user attributes
- Dynamic conditions (time, location, device)
- Context-aware permissions

### Scope-Based Access Control
- Permissions apply to specific scopes
- Hierarchical scope inheritance
- Granular access control

### Audit and Compliance
- All actions are logged
- Comprehensive audit trail
- Compliance framework support

## Feature Licensing System

### Plan-Based Features
- Different subscription plans have different features
- Feature limits per plan (users, projects, storage)
- Upgrade paths between plans

### User-Level Access Control
- Individual user access to specific features
- Usage tracking and monitoring
- Temporary access and expiration

### License Enforcement
- Real-time license checking
- Usage limit enforcement
- Automatic access revocation

## Compliance and Audit System

### Framework Support
- Multiple compliance frameworks (NIST, ISO, SOC2)
- Requirement tracking and mapping
- Evidence collection and management

### Audit Logging
- Comprehensive activity logging
- Risk-based audit levels
- Anomaly detection and alerting

### Reporting and Analytics
- Compliance status reporting
- Usage analytics and insights
- Risk assessment and trending

## Data Flow and Usage Patterns

### User Authentication Flow
1. User logs in with credentials
2. System validates credentials and creates session
3. User's roles and permissions are loaded
4. Access to features is checked against licenses

### Project Creation Flow
1. User creates project within tenant
2. Project is assigned to department (if applicable)
3. Access permissions are set based on user roles
4. Project is added to organizational hierarchy

### Feature Access Flow
1. User requests access to feature
2. System checks user's feature access permissions
3. System checks plan limits and current usage
4. Access is granted or denied based on results

### Audit Logging Flow
1. User performs action
2. System logs action with context
3. Risk level is assessed
4. Log entry is stored with metadata

## Business Logic and Rules

### Data Validation Rules
- Email addresses must be unique across the platform
- Tenant names and slugs must be unique
- Project names must be unique within tenant and parent
- User roles must be valid for the tenant context

### Business Rules
- Users can only access data within their tenant
- Feature access is limited by plan and user limits
- Project hierarchies must maintain valid parent-child relationships
- Audit logs cannot be modified after creation

### Security Rules
- Passwords must meet policy requirements
- MFA is required based on tenant settings
- Sessions expire based on tenant configuration
- All access is logged and monitored

### Compliance Rules
- Data retention follows compliance framework requirements
- Audit logs are immutable and tamper-proof
- Access controls enforce least privilege principle
- All changes are tracked and auditable

## Conclusion

The BlickTrack Prisma schema represents a comprehensive, enterprise-grade cybersecurity platform that supports:

- **Multi-tenant architecture** with complete data isolation
- **Flexible organizational structures** that adapt to any industry
- **Advanced security controls** with RBAC and ABAC
- **Granular feature licensing** with usage tracking
- **Comprehensive compliance support** with multiple frameworks
- **Audit and monitoring** with full activity logging

The schema is designed to scale from small teams to large enterprises while maintaining security, compliance, and usability standards. Every aspect of the system is built with security and auditability in mind, ensuring that organizations can trust the platform with their most sensitive cybersecurity data and processes.
