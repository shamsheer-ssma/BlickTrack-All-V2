-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'TENANT_ADMIN', 'PRODUCT_OWNER', 'SECURITY_LEAD', 'SECURITY_ANALYST', 'VIEWER', 'PLATFORM_ADMIN', 'END_USER', 'COLLABORATOR', 'DEPARTMENT_HEAD', 'PROJECT_MANAGER', 'SECURITY_OFFICER');

-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('REFRESH', 'ACCESS', 'EMAIL_VERIFICATION', 'PASSWORD_RESET', 'INVITATION');

-- CreateEnum
CREATE TYPE "ScopeType" AS ENUM ('GLOBAL', 'PLATFORM', 'TENANT', 'DEPARTMENT', 'PROJECT', 'USER');

-- CreateEnum
CREATE TYPE "ResourceType" AS ENUM ('TENANT', 'USER', 'PROJECT', 'ROLE', 'PERMISSION', 'AUDIT_LOG');

-- CreateEnum
CREATE TYPE "ActionType" AS ENUM ('CREATE', 'READ', 'UPDATE', 'DELETE', 'MANAGE', 'ALL');

-- AlterTable
ALTER TABLE "audit_logs" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "endpoint" TEXT,
ADD COLUMN     "errorMessage" TEXT,
ADD COLUMN     "method" TEXT,
ADD COLUMN     "success" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "role_permissions" ADD COLUMN     "action" "ActionType",
ADD COLUMN     "effect" TEXT NOT NULL DEFAULT 'ALLOW',
ADD COLUMN     "resource" "ResourceType";

-- AlterTable
ALTER TABLE "tenant_configurations" ADD COLUMN     "enable2FA" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "enableDarkMode" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "enableLandingPage" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "enableRegistration" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "settings" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "ssoClientId" TEXT,
ADD COLUMN     "ssoIssuerUrl" TEXT,
ADD COLUMN     "ssoMetadataUrl" TEXT,
ADD COLUMN     "ssoProvider" TEXT,
ADD COLUMN     "ssoTenantId" TEXT;

-- AlterTable
ALTER TABLE "tenants" ADD COLUMN     "settings" JSONB NOT NULL DEFAULT '{}';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastLoginIp" TEXT,
ADD COLUMN     "name" TEXT,
ADD COLUMN     "password" TEXT,
ADD COLUMN     "passwordChangedAt" TIMESTAMP(3),
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'VIEWER';

-- CreateTable
CREATE TABLE "verification_tokens" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "identifier" TEXT,
    "type" "TokenType" NOT NULL DEFAULT 'EMAIL_VERIFICATION',
    "userId" TEXT,
    "email" TEXT,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens"("token");

-- AddForeignKey
ALTER TABLE "verification_tokens" ADD CONSTRAINT "verification_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
