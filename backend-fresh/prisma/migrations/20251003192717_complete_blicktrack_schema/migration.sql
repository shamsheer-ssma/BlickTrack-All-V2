-- CreateEnum
CREATE TYPE "TenantStatus" AS ENUM ('TRIAL', 'ACTIVE', 'SUSPENDED', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED', 'INACTIVE', 'LOCKED');

-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('REGULAR', 'ADMIN', 'SERVICE_ACCOUNT', 'EXTERNAL', 'GUEST');

-- CreateEnum
CREATE TYPE "PrincipalType" AS ENUM ('USER', 'GROUP', 'SERVICE_PRINCIPAL', 'MANAGED_IDENTITY');

-- CreateEnum
CREATE TYPE "RoleType" AS ENUM ('BUILT_IN', 'CUSTOM', 'SYSTEM');

-- CreateEnum
CREATE TYPE "RiskLevel" AS ENUM ('VERY_LOW', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "ProjectType" AS ENUM ('THREAT_MODELING', 'SECURITY_ASSESSMENT', 'COMPLIANCE_AUDIT', 'INCIDENT_RESPONSE', 'SECURITY_TRAINING');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('DRAFT', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'ARCHIVED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ProjectHierarchyType" AS ENUM ('PROJECT', 'PRODUCT', 'PORTFOLIO', 'PROGRAM', 'INITIATIVE', 'WORKSTREAM');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('VERY_LOW', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "ThreatModelStatus" AS ENUM ('DRAFT', 'IN_REVIEW', 'APPROVED', 'PUBLISHED', 'ARCHIVED', 'DEPRECATED');

-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'APPROVED', 'REJECTED', 'NEEDS_REVISION');

-- CreateEnum
CREATE TYPE "FeatureCategory" AS ENUM ('PRODUCT_SECURITY', 'IT_SECURITY', 'OT_SECURITY');

-- CreateEnum
CREATE TYPE "PlanTier" AS ENUM ('TRIAL', 'PROFESSIONAL', 'ENTERPRISE', 'GUEST');

-- CreateEnum
CREATE TYPE "FeatureType" AS ENUM ('BOOLEAN', 'NUMERIC', 'STRING', 'JSON');

-- CreateEnum
CREATE TYPE "AuditEventType" AS ENUM ('AUTHENTICATION', 'AUTHORIZATION', 'DATA_ACCESS', 'DATA_MODIFICATION', 'CONFIGURATION_CHANGE', 'SECURITY_EVENT', 'COMPLIANCE_EVENT', 'SYSTEM_EVENT');

-- CreateEnum
CREATE TYPE "AuditSeverity" AS ENUM ('DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL');

-- CreateEnum
CREATE TYPE "BusinessEntityType" AS ENUM ('PRODUCT', 'PROJECT', 'SERVICE', 'SOLUTION', 'INITIATIVE', 'ENGAGEMENT', 'WORKSTREAM');

-- CreateEnum
CREATE TYPE "EntityStatus" AS ENUM ('PLANNING', 'APPROVED', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED', 'CANCELLED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ActivityCategory" AS ENUM ('THREAT_MODELING', 'VULNERABILITY_ASSESSMENT', 'PENETRATION_TESTING', 'CODE_REVIEW', 'ARCHITECTURE_REVIEW', 'COMPLIANCE_AUDIT', 'INCIDENT_RESPONSE', 'SECURITY_TRAINING', 'RISK_ASSESSMENT', 'SECURITY_MONITORING');

-- CreateEnum
CREATE TYPE "Complexity" AS ENUM ('VERY_LOW', 'LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH');

-- CreateEnum
CREATE TYPE "SecurityProjectStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'BLOCKED', 'UNDER_REVIEW', 'COMPLETED', 'CANCELLED', 'ON_HOLD');

-- CreateTable
CREATE TABLE "tenants" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "domain" TEXT,
    "planId" TEXT,
    "maxUsers" INTEGER,
    "maxProjects" INTEGER,
    "status" "TenantStatus" NOT NULL DEFAULT 'TRIAL',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isTrial" BOOLEAN NOT NULL DEFAULT true,
    "trialExpiresAt" TIMESTAMP(3),
    "mfaRequired" BOOLEAN NOT NULL DEFAULT false,
    "passwordPolicy" JSONB NOT NULL DEFAULT '{"minLength": 8, "requireSpecialChar": true}',
    "sessionTimeout" INTEGER NOT NULL DEFAULT 480,
    "complianceFrameworks" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "dataResidency" TEXT,
    "apiQuotaDaily" INTEGER NOT NULL DEFAULT 10000,
    "webhookUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant_configurations" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "industryType" TEXT NOT NULL DEFAULT 'TECHNOLOGY',
    "organizationType" TEXT NOT NULL DEFAULT 'PRODUCT_BASED',
    "productTerm" TEXT NOT NULL DEFAULT 'Product',
    "projectTerm" TEXT NOT NULL DEFAULT 'Project',
    "portfolioTerm" TEXT NOT NULL DEFAULT 'Portfolio',
    "workstreamTerm" TEXT NOT NULL DEFAULT 'Workstream',
    "defaultHierarchy" JSONB NOT NULL DEFAULT '[]',
    "maxHierarchyLevels" INTEGER NOT NULL DEFAULT 5,
    "securityFrameworks" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "defaultRiskLevel" "RiskLevel" NOT NULL DEFAULT 'MEDIUM',
    "theme" TEXT NOT NULL DEFAULT 'corporate',
    "primaryColor" TEXT NOT NULL DEFAULT '#2563eb',
    "logoUrl" TEXT,
    "customCssUrl" TEXT,
    "requiresApproval" BOOLEAN NOT NULL DEFAULT false,
    "auditRetentionDays" INTEGER NOT NULL DEFAULT 2555,
    "encryptionRequired" BOOLEAN NOT NULL DEFAULT true,
    "ssoEnabled" BOOLEAN NOT NULL DEFAULT false,
    "adIntegrationEnabled" BOOLEAN NOT NULL DEFAULT false,
    "apiAccessEnabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenant_configurations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organizational_units" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "parentId" TEXT,
    "level" INTEGER NOT NULL DEFAULT 0,
    "path" TEXT,
    "isRoot" BOOLEAN NOT NULL DEFAULT false,
    "isLeaf" BOOLEAN NOT NULL DEFAULT true,
    "unitType" TEXT NOT NULL,
    "costCenter" TEXT,
    "budgetCode" TEXT,
    "managerId" TEXT,
    "tenantId" TEXT NOT NULL,
    "location" TEXT,
    "timeZone" TEXT NOT NULL DEFAULT 'UTC',
    "country" TEXT,
    "region" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "organizational_units_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "business_entities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "entityType" "BusinessEntityType" NOT NULL DEFAULT 'PRODUCT',
    "category" TEXT,
    "businessValue" TEXT,
    "parentId" TEXT,
    "level" INTEGER NOT NULL DEFAULT 0,
    "path" TEXT,
    "isRoot" BOOLEAN NOT NULL DEFAULT false,
    "isLeaf" BOOLEAN NOT NULL DEFAULT true,
    "orgUnitId" TEXT,
    "tenantId" TEXT NOT NULL,
    "ownerId" TEXT,
    "status" "EntityStatus" NOT NULL DEFAULT 'PLANNING',
    "phase" TEXT,
    "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
    "plannedStartDate" TIMESTAMP(3),
    "actualStartDate" TIMESTAMP(3),
    "plannedEndDate" TIMESTAMP(3),
    "actualEndDate" TIMESTAMP(3),
    "budgetAllocated" DECIMAL(65,30),
    "budgetSpent" DECIMAL(65,30),
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "riskLevel" "RiskLevel" NOT NULL DEFAULT 'MEDIUM',
    "complianceFrameworks" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "regulatoryScope" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "externalId" TEXT,
    "contractNumber" TEXT,
    "projectCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "business_entities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entity_access" (
    "id" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "userId" TEXT,
    "roleId" TEXT,
    "accessLevel" TEXT NOT NULL,
    "canDelegate" BOOLEAN NOT NULL DEFAULT false,
    "tenantId" TEXT NOT NULL,
    "grantedById" TEXT,
    "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "entity_access_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "departments" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "tenantId" TEXT NOT NULL,
    "parentId" TEXT,
    "costCenter" TEXT,
    "manager" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "displayName" TEXT,
    "avatar" TEXT,
    "title" TEXT,
    "phone" TEXT,
    "passwordHash" TEXT,
    "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "emailVerificationToken" TEXT,
    "passwordResetToken" TEXT,
    "passwordResetExpiresAt" TIMESTAMP(3),
    "status" "UserStatus" NOT NULL DEFAULT 'PENDING',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMP(3),
    "failedLogins" INTEGER NOT NULL DEFAULT 0,
    "lockedUntil" TIMESTAMP(3),
    "mfaEnabled" BOOLEAN NOT NULL DEFAULT false,
    "mfaSecret" TEXT,
    "mfaBackupCodes" TEXT[],
    "tenantId" TEXT NOT NULL,
    "departmentId" TEXT,
    "userType" "UserType" NOT NULL DEFAULT 'REGULAR',
    "preferences" JSONB NOT NULL DEFAULT '{}',
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "locale" TEXT NOT NULL DEFAULT 'en-US',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "orgUnitId" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "location" TEXT,
    "deviceType" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "isSecure" BOOLEAN NOT NULL DEFAULT false,
    "mfaVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastActivity" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "principals" (
    "id" TEXT NOT NULL,
    "type" "PrincipalType" NOT NULL,
    "userId" TEXT,
    "groupId" TEXT,
    "serviceId" TEXT,
    "displayName" TEXT NOT NULL,

    CONSTRAINT "principals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "RoleType" NOT NULL DEFAULT 'CUSTOM',
    "category" TEXT,
    "tenantId" TEXT,
    "isBuiltIn" BOOLEAN NOT NULL DEFAULT false,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "provider" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "category" TEXT,
    "riskLevel" "RiskLevel" NOT NULL DEFAULT 'LOW',

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "id" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,
    "granted" BOOLEAN NOT NULL DEFAULT true,
    "conditions" JSONB,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "principal_assignments" (
    "id" TEXT NOT NULL,
    "principalId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "departmentId" TEXT,
    "assignedBy" TEXT NOT NULL,
    "reason" TEXT,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "conditions" JSONB,

    CONSTRAINT "principal_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "parentId" TEXT,
    "level" INTEGER NOT NULL DEFAULT 0,
    "path" TEXT,
    "isRoot" BOOLEAN NOT NULL DEFAULT false,
    "isLeaf" BOOLEAN NOT NULL DEFAULT true,
    "type" "ProjectType" NOT NULL DEFAULT 'THREAT_MODELING',
    "classification" TEXT,
    "hierarchyType" "ProjectHierarchyType" NOT NULL DEFAULT 'PROJECT',
    "status" "ProjectStatus" NOT NULL DEFAULT 'DRAFT',
    "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
    "tenantId" TEXT NOT NULL,
    "departmentId" TEXT,
    "ownerId" TEXT,
    "complianceFrameworks" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "riskLevel" "RiskLevel" NOT NULL DEFAULT 'MEDIUM',
    "inheritCompliance" BOOLEAN NOT NULL DEFAULT true,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_hierarchy_permissions" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "userId" TEXT,
    "roleId" TEXT,
    "permission" TEXT NOT NULL,
    "isInherited" BOOLEAN NOT NULL DEFAULT false,
    "inheritLevel" INTEGER,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_hierarchy_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "threat_models" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "version" TEXT NOT NULL DEFAULT '1.0',
    "methodology" TEXT NOT NULL DEFAULT 'STRIDE',
    "canvasData" JSONB,
    "assets" JSONB NOT NULL DEFAULT '[]',
    "threats" JSONB NOT NULL DEFAULT '[]',
    "mitigations" JSONB NOT NULL DEFAULT '[]',
    "status" "ThreatModelStatus" NOT NULL DEFAULT 'DRAFT',
    "riskLevel" "RiskLevel" NOT NULL DEFAULT 'MEDIUM',
    "classification" TEXT,
    "tenantId" TEXT NOT NULL,
    "projectId" TEXT,
    "ownerId" TEXT NOT NULL,
    "reviewStatus" "ReviewStatus" NOT NULL DEFAULT 'PENDING',
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "reviewNotes" TEXT,
    "complianceNotes" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "publishedAt" TIMESTAMP(3),

    CONSTRAINT "threat_models_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feature_plans" (
    "id" TEXT NOT NULL,
    "name" "PlanTier" NOT NULL,
    "displayName" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10,2),
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "billingPeriod" TEXT NOT NULL DEFAULT 'monthly',
    "maxUsers" INTEGER NOT NULL DEFAULT 10,
    "maxProjects" INTEGER NOT NULL DEFAULT 5,
    "maxThreatModels" INTEGER NOT NULL DEFAULT 20,
    "storageLimit" INTEGER NOT NULL DEFAULT 1024,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feature_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "features" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" "FeatureCategory" NOT NULL,
    "type" "FeatureType" NOT NULL DEFAULT 'BOOLEAN',
    "defaultEnabled" BOOLEAN NOT NULL DEFAULT false,
    "defaultConfig" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "features_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plan_features" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "featureId" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "config" JSONB NOT NULL DEFAULT '{}',
    "limits" JSONB DEFAULT '{}',
    "maxUsers" INTEGER,
    "currentUsers" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "plan_features_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_feature_access" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "featureId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "grantedBy" TEXT,
    "revokedAt" TIMESTAMP(3),
    "revokedBy" TEXT,
    "expiresAt" TIMESTAMP(3),
    "lastUsedAt" TIMESTAMP(3),
    "usageCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "user_feature_access_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compliance_frameworks" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "authority" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "compliance_frameworks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compliance_requirements" (
    "id" TEXT NOT NULL,
    "frameworkId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
    "riskLevel" "RiskLevel" NOT NULL DEFAULT 'MEDIUM',
    "guidance" TEXT,
    "references" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "compliance_requirements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "eventType" "AuditEventType" NOT NULL,
    "action" TEXT NOT NULL,
    "resource" TEXT,
    "resourceId" TEXT,
    "userId" TEXT,
    "tenantId" TEXT NOT NULL,
    "sessionId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "location" TEXT,
    "oldValues" JSONB,
    "newValues" JSONB,
    "riskLevel" "RiskLevel" NOT NULL DEFAULT 'LOW',
    "severity" "AuditSeverity" NOT NULL DEFAULT 'INFO',
    "metadata" JSONB,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "isAnomaly" BOOLEAN NOT NULL DEFAULT false,
    "isReviewed" BOOLEAN NOT NULL DEFAULT false,
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" "ActivityCategory" NOT NULL DEFAULT 'THREAT_MODELING',
    "subcategory" TEXT,
    "complexity" "Complexity" NOT NULL DEFAULT 'MEDIUM',
    "estimatedHours" INTEGER NOT NULL DEFAULT 8,
    "frameworks" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "standards" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "objectives" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "deliverables" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "steps" JSONB NOT NULL DEFAULT '[]',
    "skillsRequired" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "toolsRequired" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "prerequisiteChecks" JSONB NOT NULL DEFAULT '[]',
    "industries" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "entityTypes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "riskLevel" "RiskLevel" NOT NULL DEFAULT 'MEDIUM',
    "complianceEvidence" BOOLEAN NOT NULL DEFAULT false,
    "version" TEXT NOT NULL DEFAULT '1.0',
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdById" TEXT,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "avgRating" DECIMAL(3,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "activity_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "security_projects" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "templateId" TEXT,
    "entityId" TEXT NOT NULL,
    "status" "SecurityProjectStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
    "riskLevel" "RiskLevel" NOT NULL DEFAULT 'MEDIUM',
    "tenantId" TEXT NOT NULL,
    "ownerId" TEXT,
    "assignedTo" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "plannedStartDate" TIMESTAMP(3),
    "actualStartDate" TIMESTAMP(3),
    "plannedEndDate" TIMESTAMP(3),
    "actualEndDate" TIMESTAMP(3),
    "estimatedHours" INTEGER,
    "actualHours" INTEGER,
    "completionPercent" INTEGER NOT NULL DEFAULT 0,
    "milestones" JSONB NOT NULL DEFAULT '[]',
    "checklistItems" JSONB NOT NULL DEFAULT '[]',
    "findings" JSONB NOT NULL DEFAULT '[]',
    "recommendations" JSONB NOT NULL DEFAULT '[]',
    "deliverables" JSONB NOT NULL DEFAULT '[]',
    "evidenceFiles" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "reportGenerated" BOOLEAN NOT NULL DEFAULT false,
    "reportUrl" TEXT,
    "complianceFrameworks" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "auditEvidence" JSONB NOT NULL DEFAULT '[]',
    "approvalRequired" BOOLEAN NOT NULL DEFAULT false,
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "customFields" JSONB NOT NULL DEFAULT '{}',
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "security_projects_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tenants_name_key" ON "tenants"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tenants_slug_key" ON "tenants"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "tenants_domain_key" ON "tenants"("domain");

-- CreateIndex
CREATE INDEX "tenants_slug_idx" ON "tenants"("slug");

-- CreateIndex
CREATE INDEX "tenants_status_idx" ON "tenants"("status");

-- CreateIndex
CREATE UNIQUE INDEX "tenant_configurations_tenantId_key" ON "tenant_configurations"("tenantId");

-- CreateIndex
CREATE INDEX "organizational_units_parentId_idx" ON "organizational_units"("parentId");

-- CreateIndex
CREATE INDEX "organizational_units_level_idx" ON "organizational_units"("level");

-- CreateIndex
CREATE INDEX "organizational_units_unitType_idx" ON "organizational_units"("unitType");

-- CreateIndex
CREATE UNIQUE INDEX "organizational_units_tenantId_name_parentId_key" ON "organizational_units"("tenantId", "name", "parentId");

-- CreateIndex
CREATE INDEX "business_entities_entityType_idx" ON "business_entities"("entityType");

-- CreateIndex
CREATE INDEX "business_entities_status_idx" ON "business_entities"("status");

-- CreateIndex
CREATE INDEX "business_entities_ownerId_idx" ON "business_entities"("ownerId");

-- CreateIndex
CREATE INDEX "business_entities_orgUnitId_idx" ON "business_entities"("orgUnitId");

-- CreateIndex
CREATE INDEX "business_entities_parentId_idx" ON "business_entities"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "business_entities_tenantId_name_parentId_key" ON "business_entities"("tenantId", "name", "parentId");

-- CreateIndex
CREATE INDEX "entity_access_userId_idx" ON "entity_access"("userId");

-- CreateIndex
CREATE INDEX "entity_access_roleId_idx" ON "entity_access"("roleId");

-- CreateIndex
CREATE UNIQUE INDEX "entity_access_entityId_userId_accessLevel_key" ON "entity_access"("entityId", "userId", "accessLevel");

-- CreateIndex
CREATE UNIQUE INDEX "entity_access_entityId_roleId_accessLevel_key" ON "entity_access"("entityId", "roleId", "accessLevel");

-- CreateIndex
CREATE INDEX "departments_parentId_idx" ON "departments"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "departments_tenantId_name_key" ON "departments"("tenantId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_tenantId_idx" ON "users"("tenantId");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_status_idx" ON "users"("status");

-- CreateIndex
CREATE UNIQUE INDEX "user_sessions_sessionToken_key" ON "user_sessions"("sessionToken");

-- CreateIndex
CREATE INDEX "user_sessions_userId_idx" ON "user_sessions"("userId");

-- CreateIndex
CREATE INDEX "user_sessions_sessionToken_idx" ON "user_sessions"("sessionToken");

-- CreateIndex
CREATE INDEX "user_sessions_expiresAt_idx" ON "user_sessions"("expiresAt");

-- CreateIndex
CREATE INDEX "principals_type_idx" ON "principals"("type");

-- CreateIndex
CREATE INDEX "roles_type_idx" ON "roles"("type");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_tenantId_key" ON "roles"("name", "tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_name_key" ON "permissions"("name");

-- CreateIndex
CREATE INDEX "permissions_provider_resource_idx" ON "permissions"("provider", "resource");

-- CreateIndex
CREATE UNIQUE INDEX "role_permissions_roleId_permissionId_key" ON "role_permissions"("roleId", "permissionId");

-- CreateIndex
CREATE INDEX "principal_assignments_tenantId_idx" ON "principal_assignments"("tenantId");

-- CreateIndex
CREATE INDEX "principal_assignments_scope_idx" ON "principal_assignments"("scope");

-- CreateIndex
CREATE UNIQUE INDEX "principal_assignments_principalId_roleId_scope_key" ON "principal_assignments"("principalId", "roleId", "scope");

-- CreateIndex
CREATE INDEX "projects_status_idx" ON "projects"("status");

-- CreateIndex
CREATE INDEX "projects_departmentId_idx" ON "projects"("departmentId");

-- CreateIndex
CREATE INDEX "projects_parentId_idx" ON "projects"("parentId");

-- CreateIndex
CREATE INDEX "projects_level_idx" ON "projects"("level");

-- CreateIndex
CREATE INDEX "projects_hierarchyType_idx" ON "projects"("hierarchyType");

-- CreateIndex
CREATE UNIQUE INDEX "projects_tenantId_name_parentId_key" ON "projects"("tenantId", "name", "parentId");

-- CreateIndex
CREATE INDEX "project_hierarchy_permissions_userId_idx" ON "project_hierarchy_permissions"("userId");

-- CreateIndex
CREATE INDEX "project_hierarchy_permissions_roleId_idx" ON "project_hierarchy_permissions"("roleId");

-- CreateIndex
CREATE INDEX "project_hierarchy_permissions_isInherited_idx" ON "project_hierarchy_permissions"("isInherited");

-- CreateIndex
CREATE UNIQUE INDEX "project_hierarchy_permissions_projectId_userId_permission_key" ON "project_hierarchy_permissions"("projectId", "userId", "permission");

-- CreateIndex
CREATE UNIQUE INDEX "project_hierarchy_permissions_projectId_roleId_permission_key" ON "project_hierarchy_permissions"("projectId", "roleId", "permission");

-- CreateIndex
CREATE INDEX "threat_models_status_idx" ON "threat_models"("status");

-- CreateIndex
CREATE INDEX "threat_models_projectId_idx" ON "threat_models"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "feature_plans_name_key" ON "feature_plans"("name");

-- CreateIndex
CREATE UNIQUE INDEX "features_key_key" ON "features"("key");

-- CreateIndex
CREATE UNIQUE INDEX "plan_features_planId_featureId_key" ON "plan_features"("planId", "featureId");

-- CreateIndex
CREATE INDEX "user_feature_access_tenantId_featureId_idx" ON "user_feature_access"("tenantId", "featureId");

-- CreateIndex
CREATE INDEX "user_feature_access_isActive_expiresAt_idx" ON "user_feature_access"("isActive", "expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "user_feature_access_userId_featureId_key" ON "user_feature_access"("userId", "featureId");

-- CreateIndex
CREATE UNIQUE INDEX "compliance_frameworks_name_key" ON "compliance_frameworks"("name");

-- CreateIndex
CREATE INDEX "compliance_requirements_category_idx" ON "compliance_requirements"("category");

-- CreateIndex
CREATE UNIQUE INDEX "compliance_requirements_frameworkId_code_key" ON "compliance_requirements"("frameworkId", "code");

-- CreateIndex
CREATE INDEX "audit_logs_tenantId_timestamp_idx" ON "audit_logs"("tenantId", "timestamp");

-- CreateIndex
CREATE INDEX "audit_logs_userId_timestamp_idx" ON "audit_logs"("userId", "timestamp");

-- CreateIndex
CREATE INDEX "audit_logs_eventType_idx" ON "audit_logs"("eventType");

-- CreateIndex
CREATE INDEX "audit_logs_resource_resourceId_idx" ON "audit_logs"("resource", "resourceId");

-- CreateIndex
CREATE INDEX "audit_logs_riskLevel_idx" ON "audit_logs"("riskLevel");

-- CreateIndex
CREATE INDEX "activity_templates_category_idx" ON "activity_templates"("category");

-- CreateIndex
CREATE INDEX "activity_templates_complexity_idx" ON "activity_templates"("complexity");

-- CreateIndex
CREATE INDEX "activity_templates_isPublic_isActive_idx" ON "activity_templates"("isPublic", "isActive");

-- CreateIndex
CREATE INDEX "security_projects_status_idx" ON "security_projects"("status");

-- CreateIndex
CREATE INDEX "security_projects_priority_idx" ON "security_projects"("priority");

-- CreateIndex
CREATE INDEX "security_projects_ownerId_idx" ON "security_projects"("ownerId");

-- CreateIndex
CREATE INDEX "security_projects_entityId_idx" ON "security_projects"("entityId");

-- CreateIndex
CREATE INDEX "security_projects_templateId_idx" ON "security_projects"("templateId");

-- CreateIndex
CREATE UNIQUE INDEX "security_projects_tenantId_name_key" ON "security_projects"("tenantId", "name");

-- AddForeignKey
ALTER TABLE "tenants" ADD CONSTRAINT "tenants_planId_fkey" FOREIGN KEY ("planId") REFERENCES "feature_plans"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_configurations" ADD CONSTRAINT "tenant_configurations_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizational_units" ADD CONSTRAINT "organizational_units_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "organizational_units"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizational_units" ADD CONSTRAINT "organizational_units_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizational_units" ADD CONSTRAINT "organizational_units_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_entities" ADD CONSTRAINT "business_entities_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "business_entities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_entities" ADD CONSTRAINT "business_entities_orgUnitId_fkey" FOREIGN KEY ("orgUnitId") REFERENCES "organizational_units"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_entities" ADD CONSTRAINT "business_entities_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_entities" ADD CONSTRAINT "business_entities_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entity_access" ADD CONSTRAINT "entity_access_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "business_entities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entity_access" ADD CONSTRAINT "entity_access_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entity_access" ADD CONSTRAINT "entity_access_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entity_access" ADD CONSTRAINT "entity_access_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entity_access" ADD CONSTRAINT "entity_access_grantedById_fkey" FOREIGN KEY ("grantedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "departments" ADD CONSTRAINT "departments_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "departments" ADD CONSTRAINT "departments_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_orgUnitId_fkey" FOREIGN KEY ("orgUnitId") REFERENCES "organizational_units"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roles" ADD CONSTRAINT "roles_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "principal_assignments" ADD CONSTRAINT "principal_assignments_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "principal_assignments" ADD CONSTRAINT "principal_assignments_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "principal_assignments" ADD CONSTRAINT "principal_assignments_principalId_fkey" FOREIGN KEY ("principalId") REFERENCES "principals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "principal_assignments" ADD CONSTRAINT "principal_assignments_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_hierarchy_permissions" ADD CONSTRAINT "project_hierarchy_permissions_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_hierarchy_permissions" ADD CONSTRAINT "project_hierarchy_permissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_hierarchy_permissions" ADD CONSTRAINT "project_hierarchy_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_hierarchy_permissions" ADD CONSTRAINT "project_hierarchy_permissions_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "threat_models" ADD CONSTRAINT "threat_models_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "threat_models" ADD CONSTRAINT "threat_models_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plan_features" ADD CONSTRAINT "plan_features_planId_fkey" FOREIGN KEY ("planId") REFERENCES "feature_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plan_features" ADD CONSTRAINT "plan_features_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES "features"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_feature_access" ADD CONSTRAINT "user_feature_access_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_feature_access" ADD CONSTRAINT "user_feature_access_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES "features"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_feature_access" ADD CONSTRAINT "user_feature_access_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compliance_requirements" ADD CONSTRAINT "compliance_requirements_frameworkId_fkey" FOREIGN KEY ("frameworkId") REFERENCES "compliance_frameworks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_templates" ADD CONSTRAINT "activity_templates_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "security_projects" ADD CONSTRAINT "security_projects_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "activity_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "security_projects" ADD CONSTRAINT "security_projects_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "business_entities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "security_projects" ADD CONSTRAINT "security_projects_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "security_projects" ADD CONSTRAINT "security_projects_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
