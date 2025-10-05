# BlickTrack Database Schema - Complete Overview

**Comprehensive Guide to the Enterprise Cybersecurity Platform Database**

This document provides a complete overview of the BlickTrack Prisma schema, including architecture, relationships, usage patterns, and business logic for both technical and non-technical stakeholders.

## Executive Summary

The BlickTrack database schema represents a sophisticated, enterprise-grade cybersecurity platform designed to support:

- **Multi-tenant architecture** with complete data isolation
- **Hierarchical organizational structures** that adapt to any industry
- **Advanced security controls** with Role-Based Access Control (RBAC) and Attribute-Based Access Control (ABAC)
- **Granular feature licensing** with usage tracking and enforcement
- **Comprehensive compliance support** for multiple security frameworks
- **Audit and monitoring** with full activity logging and anomaly detection

## Schema Statistics

- **Total Tables**: 25 core tables
- **Total Enums**: 20 enumeration types
- **Total Relationships**: 50+ foreign key relationships
- **Hierarchical Tables**: 4 self-referencing tables
- **Audit Tables**: 1 comprehensive audit log table
- **Multi-tenant Tables**: 20+ tables with tenant isolation

## Core Architecture Components

### 1. Multi-Tenant Foundation
The entire platform is built on a multi-tenant architecture where:
- Each tenant represents a separate organization
- Complete data isolation between tenants
- Tenant-specific configuration and customization
- Scalable to support unlimited tenants

### 2. Hierarchical Organization Support
The schema supports complex organizational structures:
- **Platform Level**: Global administration and system management
- **Tenant Level**: Individual organizations and their data
- **Department Level**: Traditional organizational units
- **Project Level**: Individual projects and work items
- **Resource Level**: Specific resources and assets

### 3. Flexible Entity Management
Universal approach to managing different types of business work:
- **Products**: Traditional software products
- **Projects**: Time-bound initiatives
- **Services**: Ongoing service offerings
- **Solutions**: Packaged offerings
- **Initiatives**: Strategic programs
- **Engagements**: Client-specific work

### 4. Advanced Security Controls
Comprehensive security framework with multiple layers:
- **Authentication**: Multi-factor authentication, session management
- **Authorization**: Role-based and attribute-based access control
- **Audit**: Comprehensive activity logging and monitoring
- **Compliance**: Framework-specific requirements and evidence

## Table Categories and Purposes

### Core Management Tables (6 tables)
- **Tenant**: Organization management and configuration
- **TenantConfiguration**: Industry-specific settings and customization
- **User**: User account management and authentication
- **UserSession**: Session tracking and security
- **VerificationToken**: Email verification and password reset
- **Principal**: Security principal management

### Organizational Structure Tables (4 tables)
- **Department**: Traditional department-based organization
- **OrganizationalUnit**: Flexible organizational structure
- **BusinessEntity**: Universal business entity management
- **EntityAccess**: Business entity access control

### Project Management Tables (3 tables)
- **Project**: Security project management with hierarchy
- **ProjectHierarchyPermission**: Project-level access control
- **ThreatModel**: Threat modeling data and results

### Security and Access Control Tables (4 tables)
- **Role**: Role definitions and management
- **Permission**: Individual permission definitions
- **RolePermission**: Role-permission associations
- **PrincipalAssignment**: Role assignments to users/groups

### Feature Licensing Tables (4 tables)
- **FeaturePlan**: Subscription plan definitions
- **Feature**: Individual feature definitions
- **PlanFeature**: Plan-feature associations with limits
- **UserFeatureAccess**: User-level feature access control

### Compliance and Audit Tables (3 tables)
- **ComplianceFramework**: Security framework definitions
- **ComplianceRequirement**: Specific compliance requirements
- **AuditLog**: Comprehensive activity logging

### Activity Management Tables (2 tables)
- **ActivityTemplate**: Pre-built security activity templates
- **SecurityProject**: Instantiated security activities

## Key Relationships and Dependencies

### Primary Data Flow
1. **Tenant** → **Users** → **Sessions** → **Activities**
2. **Tenant** → **Projects** → **ThreatModels** → **Results**
3. **User** → **Roles** → **Permissions** → **Access**
4. **Feature** → **Plans** → **Users** → **Usage**

### Hierarchical Relationships
- **Department** → **Department** (parent-child)
- **OrganizationalUnit** → **OrganizationalUnit** (parent-child)
- **BusinessEntity** → **BusinessEntity** (parent-child)
- **Project** → **Project** (parent-child)

### Access Control Relationships
- **User** → **Role** → **Permission** → **Resource**
- **User** → **Feature** → **Plan** → **Tenant**
- **User** → **Project** → **Permission** → **Access**
- **User** → **BusinessEntity** → **Access** → **Control**

## Business Logic and Rules

### Data Validation Rules
- **Uniqueness**: Email addresses, tenant names, and slugs must be unique
- **Referential Integrity**: All foreign keys must reference valid records
- **Hierarchy Integrity**: Parent-child relationships must be valid
- **Tenant Isolation**: All data must belong to a valid tenant

### Security Rules
- **Authentication**: Users must be authenticated to access the system
- **Authorization**: Users can only access resources they have permission for
- **Session Management**: Sessions expire based on tenant configuration
- **Audit Logging**: All actions must be logged for security and compliance

### Business Rules
- **Feature Access**: Users can only access features they have licenses for
- **Usage Limits**: Feature usage is limited by plan and user limits
- **Data Retention**: Audit logs are retained according to compliance requirements
- **Access Control**: All access follows the principle of least privilege

## Multi-Tenant Architecture Details

### Data Isolation
- Every table includes a `tenantId` field for data isolation
- All queries are automatically scoped to the current tenant
- No cross-tenant data access is possible
- Tenant-specific configuration and customization

### Scalability
- Supports unlimited tenants
- Each tenant can have unlimited users and projects
- Hierarchical organization supports complex structures
- Feature licensing scales with usage

### Security
- Complete data isolation between tenants
- Tenant-specific security policies
- Customizable compliance frameworks
- Isolated audit trails per tenant

## Feature Licensing System

### Plan-Based Licensing
- **Trial**: Limited time access with basic features
- **Professional**: Full features for growing teams
- **Enterprise**: Complete solution for large organizations
- **Guest**: Unlimited time with basic features only

### User-Level Access Control
- Individual user access to specific features
- Usage tracking and monitoring
- Temporary access and expiration
- Admin override capabilities

### License Enforcement
- Real-time license checking
- Usage limit enforcement
- Automatic access revocation
- Upgrade path management

## Compliance and Audit System

### Framework Support
- **NIST Cybersecurity Framework**: Comprehensive security controls
- **ISO 27001**: Information security management
- **SOC 2**: Security and availability controls
- **Custom Frameworks**: Tenant-specific requirements

### Audit Capabilities
- **Comprehensive Logging**: All system activities are logged
- **Risk Assessment**: Risk levels assigned to all activities
- **Anomaly Detection**: Unusual patterns are flagged
- **Compliance Reporting**: Framework-specific reports

### Evidence Management
- **Requirement Mapping**: Activities mapped to compliance requirements
- **Evidence Collection**: Automated evidence gathering
- **Documentation**: Comprehensive documentation and reporting
- **Retention**: Long-term storage of audit evidence

## Data Flow Patterns

### User Authentication Flow
1. User provides credentials
2. System validates credentials
3. Session is created and tracked
4. User's roles and permissions are loaded
5. Feature access is checked against licenses

### Project Creation Flow
1. User creates project within tenant
2. Project is assigned to department (if applicable)
3. Access permissions are set based on user roles
4. Project is added to organizational hierarchy
5. Audit log entry is created

### Feature Access Flow
1. User requests access to feature
2. System checks user's feature access permissions
3. System checks plan limits and current usage
4. Access is granted or denied based on results
5. Usage is tracked and logged

### Security Activity Flow
1. User selects activity template
2. Security project is created from template
3. Project is assigned to business entity
4. Progress is tracked and documented
5. Results are captured and audited

## Performance Considerations

### Indexing Strategy
- **Primary Keys**: All tables have UUID primary keys
- **Foreign Keys**: Indexed for fast joins
- **Tenant Scoping**: All queries are tenant-scoped
- **Hierarchy Queries**: Optimized for parent-child relationships

### Query Optimization
- **Tenant Isolation**: All queries include tenant filtering
- **Hierarchy Traversal**: Optimized for complex hierarchies
- **Permission Checking**: Cached for performance
- **Audit Logging**: Asynchronous to avoid performance impact

### Scalability Features
- **Horizontal Scaling**: Multi-tenant architecture supports scaling
- **Vertical Scaling**: Individual tenant scaling
- **Caching**: Permission and configuration caching
- **Background Jobs**: Asynchronous processing for heavy operations

## Security Considerations

### Data Protection
- **Encryption**: Sensitive data is encrypted at rest
- **Transmission**: All data transmission is encrypted
- **Access Control**: Granular access control at all levels
- **Audit Trail**: Comprehensive audit trail for all activities

### Compliance
- **Framework Support**: Multiple compliance frameworks supported
- **Evidence Collection**: Automated compliance evidence gathering
- **Reporting**: Comprehensive compliance reporting
- **Retention**: Long-term data retention for compliance

### Monitoring
- **Activity Logging**: All activities are logged and monitored
- **Anomaly Detection**: Unusual patterns are detected and flagged
- **Risk Assessment**: Risk levels are assigned to all activities
- **Alerting**: Automated alerting for security events

## Conclusion

The BlickTrack Prisma schema represents a comprehensive, enterprise-grade cybersecurity platform that successfully balances:

- **Flexibility**: Adapts to any organizational structure and industry
- **Security**: Implements multiple layers of security controls
- **Scalability**: Supports growth from small teams to large enterprises
- **Compliance**: Meets the requirements of multiple security frameworks
- **Usability**: Provides intuitive interfaces for complex security management

The schema is designed to be:
- **Maintainable**: Clear structure and relationships
- **Extensible**: Easy to add new features and capabilities
- **Performant**: Optimized for enterprise-scale operations
- **Secure**: Built with security and compliance in mind
- **Auditable**: Comprehensive logging and monitoring

This architecture enables organizations to manage their cybersecurity programs effectively while maintaining the highest standards of security, compliance, and operational excellence.
