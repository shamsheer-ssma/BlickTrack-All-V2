/**
 * File: seed.ts
 * Purpose: Database seeding script for the BlickTrack backend API. Populates the database with initial data including feature plans, tenants, users, features, and hierarchical project structures. Provides comprehensive test data for development and demonstration purposes.
 *
 * Key Functions / Components / Classes:
 *   - main(): Main seeding function that orchestrates data creation
 *   - Feature Plan Creation: Creates Professional and Enterprise plans
 *   - Tenant Creation: Creates enterprise tenants (BlickTrack, Huawei, Boeing, UTC)
 *   - Feature Creation: Creates security features across different categories
 *   - User Creation: Creates users for each tenant with proper authentication
 *   - Project Creation: Creates hierarchical project structures with portfolios, programs, products, and projects
 *
 * Inputs:
 *   - PrismaClient for database operations
 *   - bcryptjs for password hashing
 *   - Enterprise tenant data and configurations
 *   - User data with authentication credentials
 *   - Hierarchical project structures
 *
 * Outputs:
 *   - Populated database with initial data
 *   - Feature plans and tenant configurations
 *   - User accounts with hashed passwords
 *   - Hierarchical project structures
 *   - Console logging of seeding progress
 *
 * Dependencies:
 *   - @prisma/client for database operations
 *   - bcryptjs for password hashing
 *   - Prisma database schema
 *
 * Notes:
 *   - Implements comprehensive database seeding
 *   - Creates realistic enterprise data structures
 *   - Includes hierarchical project examples
 *   - Provides authentication-ready user accounts
 *   - Supports multi-tenant architecture
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting systematic BlickTrack database seeding...');

  // 1. Create Feature Plans first
  console.log('📋 Creating feature plans...');
  
  const professionalPlan = await prisma.featurePlan.create({
    data: {
      name: 'PROFESSIONAL',
      displayName: 'Professional',
      description: 'Advanced features for growing teams',
      price: 99.00,
      currency: 'USD',
      billingPeriod: 'monthly',
      maxUsers: 50,
      maxProjects: 25,
      maxThreatModels: 100,
      storageLimit: 10240, // 10GB
      isActive: true,
      isPublic: true,
    },
  });

  const enterprisePlan = await prisma.featurePlan.create({
    data: {
      name: 'ENTERPRISE',
      displayName: 'Enterprise',
      description: 'Full-featured solution for large organizations',
      price: 299.00,
      currency: 'USD',
      billingPeriod: 'monthly',
      maxUsers: 500,
      maxProjects: 100,
      maxThreatModels: 1000,
      storageLimit: 102400, // 100GB
      isActive: true,
      isPublic: true,
    },
  });

  // 2. Create Tenants with proper structure
  console.log('🏢 Creating enterprise tenants...');
  
  const blickTrack = await prisma.tenant.create({
    data: {
      name: 'BlickTrack',
      slug: 'blicktrack',
      domain: 'blicktrack.com',
      planId: enterprisePlan.id,
      status: 'ACTIVE',
      isTrial: false,
      isActive: true,
      mfaRequired: true,
      dataResidency: 'US',
      complianceFrameworks: ['SOC2', 'ISO27001', 'NIST'],
      apiQuotaDaily: 50000,
    },
  });

  const huawei = await prisma.tenant.create({
    data: {
      name: 'Huawei Technologies',
      slug: 'huawei',
      domain: 'huawei.com',
      planId: enterprisePlan.id,
      status: 'ACTIVE',
      isTrial: false,
      isActive: true,
      mfaRequired: true,
      dataResidency: 'APAC',
      complianceFrameworks: ['ISO27001', 'GB/T'],
      apiQuotaDaily: 100000,
    },
  });

  const boeing = await prisma.tenant.create({
    data: {
      name: 'Boeing Company',
      slug: 'boeing',
      domain: 'boeing.com',
      planId: enterprisePlan.id,
      status: 'ACTIVE',
      isTrial: false,
      isActive: true,
      mfaRequired: true,
      dataResidency: 'US', 
      complianceFrameworks: ['NIST', 'CMMC', 'DFARS'],
      apiQuotaDaily: 75000,
    },
  });

  const utc = await prisma.tenant.create({
    data: {
      name: 'United Technologies Corporation',
      slug: 'utc',
      domain: 'utc.com',
      planId: professionalPlan.id,
      status: 'ACTIVE',
      isTrial: false,
      isActive: true,
      mfaRequired: false,
      dataResidency: 'US',
      complianceFrameworks: ['SOC2'],
      apiQuotaDaily: 25000,
    },
  });

  // Create Gmail tenant for @gmail.com users
  const gmail = await prisma.tenant.create({
    data: {
      name: 'Gmail Users',
      slug: 'gmail',
      domain: 'gmail.com',
      planId: professionalPlan.id,
      status: 'ACTIVE',
      isTrial: true,
      isActive: true,
      mfaRequired: false,
      dataResidency: 'US',
      complianceFrameworks: ['GDPR'],
      apiQuotaDaily: 10000,
    },
  });

  console.log('✅ Created 5 enterprise tenants:');
  console.log(`  - ${blickTrack.name} (${enterprisePlan.displayName}) - ${blickTrack.domain}`);
  console.log(`  - ${huawei.name} (${enterprisePlan.displayName}) - ${huawei.domain}`);
  console.log(`  - ${boeing.name} (${enterprisePlan.displayName}) - ${boeing.domain}`);
  console.log(`  - ${utc.name} (${professionalPlan.displayName}) - ${utc.domain}`);
  console.log(`  - ${gmail.name} (${professionalPlan.displayName}) - ${gmail.domain}`);

  // 3. Create Features with Different Categories
  console.log('⚡ Creating features for different security contexts...');

  // IT Security Features
  const itThreatModeling = await prisma.feature.create({
    data: {
      key: 'it_threat_modeling',
      name: 'IT Infrastructure Threat Modeling',
      description: 'Threat modeling for IT infrastructure, networks, and enterprise systems',
      category: 'IT_SECURITY',
      type: 'JSON',
      defaultEnabled: true,
      defaultConfig: {
        templates: ['Network Security', 'Server Infrastructure', 'Cloud Architecture'],
        methodologies: ['STRIDE', 'PASTA', 'OCTAVE'],
        integrations: ['SIEM', 'Vulnerability Scanners', 'Network Monitoring']
      }
    }
  });

  const networkSecurity = await prisma.feature.create({
    data: {
      key: 'network_security_monitoring',
      name: 'Network Security Monitoring',
      description: 'Real-time network traffic analysis and threat detection',
      category: 'IT_SECURITY',
      type: 'BOOLEAN',
      defaultEnabled: true,
      defaultConfig: {
        alerting: true,
        dashboards: ['Network Traffic', 'Intrusion Detection', 'Firewall Analytics']
      }
    }
  });

  // Product Security Features  
  const productThreatModeling = await prisma.feature.create({
    data: {
      key: 'product_threat_modeling',
      name: 'Product/Application Threat Modeling',
      description: 'Threat modeling for software products, applications, and development lifecycle',
      category: 'PRODUCT_SECURITY',
      type: 'JSON',
      defaultEnabled: true,
      defaultConfig: {
        templates: ['Web Application', 'Mobile App', 'API Security', 'DevOps Pipeline'],
        methodologies: ['STRIDE', 'LINDDUN', 'OWASP Top 10'],
        integrations: ['SAST', 'DAST', 'SCA', 'Container Security']
      }
    }
  });

  const secureCodeReview = await prisma.feature.create({
    data: {
      key: 'secure_code_review',
      name: 'Secure Code Review',
      description: 'Automated and manual secure code review workflows',
      category: 'PRODUCT_SECURITY',
      type: 'BOOLEAN',
      defaultEnabled: true,
      defaultConfig: {
        staticAnalysis: true,
        manualReview: true,
        integrations: ['GitHub', 'GitLab', 'Azure DevOps']
      }
    }
  });

  // Compliance Features
  const complianceReporting = await prisma.feature.create({
    data: {
      key: 'compliance_reporting',
      name: 'Compliance Reporting & Auditing',
      description: 'Automated compliance reporting for various frameworks',
      category: 'PRODUCT_SECURITY',
      type: 'JSON',
      defaultEnabled: true,
      defaultConfig: {
        frameworks: ['SOC2', 'ISO27001', 'NIST', 'GDPR', 'HIPAA'],
        automation: true,
        scheduling: 'monthly'
      }
    }
  });

  const riskAssessment = await prisma.feature.create({
    data: {
      key: 'risk_assessment',
      name: 'Risk Assessment & Management',
      description: 'Comprehensive risk assessment and management workflows',
      category: 'IT_SECURITY',
      type: 'JSON',
      defaultEnabled: true,
      defaultConfig: {
        riskMatrix: '5x5',
        categories: ['Technical', 'Operational', 'Strategic', 'Compliance'],
        workflows: ['Assessment', 'Mitigation', 'Monitoring', 'Reporting']
      }
    }
  });

  // Core Platform Features
  const ssoIntegration = await prisma.feature.create({
    data: {
      key: 'sso_integration',
      name: 'Single Sign-On Integration',
      description: 'Enterprise SSO with multiple identity providers',
      category: 'OT_SECURITY',
      type: 'JSON',
      defaultEnabled: false,
      defaultConfig: {
        providers: ['Azure AD', 'Okta', 'SAML', 'OIDC'],
        mfa: true,
        provisioning: 'automatic'
      }
    }
  });

  console.log('✅ Created 7 features across different categories:');
  console.log('  📊 IT Security: IT Threat Modeling, Network Security Monitoring');
  console.log('  🛡️  Product Security: Product Threat Modeling, Secure Code Review');
  console.log('  📋 Compliance: Compliance Reporting');
  console.log('  ⚖️  Governance: Risk Assessment');
  console.log('  🔑 Core: SSO Integration');

  // 4. Create Users for Each Tenant
  console.log('👥 Creating users for all tenants...');
  
  // Import bcrypt for password hashing
  const bcrypt = require('bcryptjs');
  const hashedPassword = await bcrypt.hash('Syed@123', 12);

  // BlickTrack Users
  const blickTrackUsers = await Promise.all([
    prisma.user.create({
      data: {
        email: 'user.one@blicktrack.com',
        firstName: 'User',
        lastName: 'One',
        displayName: 'User One',
        passwordHash: hashedPassword,
        status: 'ACTIVE',
        isActive: true,
        isEmailVerified: true,
        userType: 'REGULAR',
        role: 'END_USER',
        tenantId: blickTrack.id,
        timezone: 'America/New_York',
        locale: 'en-US'
      }
    }),
    prisma.user.create({
      data: {
        email: 'user.two@blicktrack.com',
        firstName: 'User',
        lastName: 'Two',
        displayName: 'User Two',
        passwordHash: hashedPassword,
        status: 'ACTIVE',
        isActive: true,
        isEmailVerified: true,
        userType: 'REGULAR',
        role: 'END_USER',
        tenantId: blickTrack.id,
        timezone: 'America/New_York',
        locale: 'en-US'
      }
    }),
    prisma.user.create({
      data: {
        email: 'user.three@blicktrack.com',
        firstName: 'User',
        lastName: 'Three',
        displayName: 'User Three',
        passwordHash: hashedPassword,
        status: 'ACTIVE',
        isActive: true,
        isEmailVerified: true,
        userType: 'REGULAR',
        role: 'END_USER',
        tenantId: blickTrack.id,
        timezone: 'America/New_York',
        locale: 'en-US'
      }
    }),
    prisma.user.create({
      data: {
        email: 'admin@blicktrack.com',
        firstName: 'Admin',
        lastName: 'BlickTrack',
        displayName: 'Admin BlickTrack',
        passwordHash: hashedPassword,
        status: 'ACTIVE',
        isActive: true,
        isEmailVerified: true,
        userType: 'ADMIN',
        role: 'SUPER_ADMIN',
        tenantId: blickTrack.id,
        timezone: 'America/New_York',
        locale: 'en-US'
      }
    })
  ]);

  // Huawei Users
  const huaweiUsers = await Promise.all([
    prisma.user.create({
      data: {
        email: 'user.one@huawei.com',
        firstName: 'User',
        lastName: 'One',
        displayName: 'User One',
        passwordHash: hashedPassword,
        status: 'ACTIVE',
        isActive: true,
        isEmailVerified: true,
        userType: 'REGULAR',
        role: 'END_USER',
        tenantId: huawei.id,
        timezone: 'Asia/Shanghai',
        locale: 'zh-CN'
      }
    }),
    prisma.user.create({
      data: {
        email: 'user.two@huawei.com',
        firstName: 'User',
        lastName: 'Two',
        displayName: 'User Two',
        passwordHash: hashedPassword,
        status: 'ACTIVE',
        isActive: true,
        isEmailVerified: true,
        userType: 'REGULAR',
        role: 'END_USER',
        tenantId: huawei.id,
        timezone: 'Asia/Shanghai',
        locale: 'zh-CN'
      }
    }),
    prisma.user.create({
      data: {
        email: 'user.three@huawei.com',
        firstName: 'User',
        lastName: 'Three',
        displayName: 'User Three',
        passwordHash: hashedPassword,
        status: 'ACTIVE',
        isActive: true,
        isEmailVerified: true,
        userType: 'REGULAR',
        role: 'END_USER',
        tenantId: huawei.id,
        timezone: 'Asia/Shanghai',
        locale: 'zh-CN'
      }
    }),
    prisma.user.create({
      data: {
        email: 'admin.huawei@huawei.com',
        firstName: 'Admin',
        lastName: 'Huawei',
        displayName: 'Admin Huawei',
        passwordHash: hashedPassword,
        status: 'ACTIVE',
        isActive: true,
        isEmailVerified: true,
        userType: 'ADMIN',
        role: 'TENANT_ADMIN',
        tenantId: huawei.id,
        timezone: 'Asia/Shanghai',
        locale: 'zh-CN'
      }
    })
  ]);

  // Boeing Users
  const boeingUsers = await Promise.all([
    prisma.user.create({
      data: {
        email: 'user.one@boeing.com',
        firstName: 'User',
        lastName: 'One',
        displayName: 'User One',
        passwordHash: hashedPassword,
        status: 'ACTIVE',
        isActive: true,
        isEmailVerified: true,
        userType: 'REGULAR',
        role: 'END_USER',
        tenantId: boeing.id,
        timezone: 'America/Chicago',
        locale: 'en-US'
      }
    }),
    prisma.user.create({
      data: {
        email: 'user.two@boeing.com',
        firstName: 'User',
        lastName: 'Two',
        displayName: 'User Two',
        passwordHash: hashedPassword,
        status: 'ACTIVE',
        isActive: true,
        isEmailVerified: true,
        userType: 'REGULAR',
        role: 'END_USER',
        tenantId: boeing.id,
        timezone: 'America/Chicago',
        locale: 'en-US'
      }
    }),
    prisma.user.create({
      data: {
        email: 'user.three@boeing.com',
        firstName: 'User',
        lastName: 'Three',
        displayName: 'User Three',
        passwordHash: hashedPassword,
        status: 'ACTIVE',
        isActive: true,
        isEmailVerified: true,
        userType: 'REGULAR',
        role: 'END_USER',
        tenantId: boeing.id,
        timezone: 'America/Chicago',
        locale: 'en-US'
      }
    }),
    prisma.user.create({
      data: {
        email: 'admin.boeing@boeing.com',
        firstName: 'Admin',
        lastName: 'Boeing',
        displayName: 'Admin Boeing',
        passwordHash: hashedPassword,
        status: 'ACTIVE',
        isActive: true,
        isEmailVerified: true,
        userType: 'ADMIN',
        role: 'TENANT_ADMIN',
        tenantId: boeing.id,
        timezone: 'America/Chicago',
        locale: 'en-US'
      }
    })
  ]);

  // UTC Users
  const utcUsers = await Promise.all([
    prisma.user.create({
      data: {
        email: 'user.one@utc.com',
        firstName: 'User',
        lastName: 'One',
        displayName: 'User One',
        passwordHash: hashedPassword,
        status: 'ACTIVE',
        isActive: true,
        isEmailVerified: true,
        userType: 'REGULAR',
        role: 'END_USER',
        tenantId: utc.id,
        timezone: 'America/New_York',
        locale: 'en-US'
      }
    }),
    prisma.user.create({
      data: {
        email: 'user.two@utc.com',
        firstName: 'User',
        lastName: 'Two',
        displayName: 'User Two',
        passwordHash: hashedPassword,
        status: 'ACTIVE',
        isActive: true,
        isEmailVerified: true,
        userType: 'REGULAR',
        role: 'END_USER',
        tenantId: utc.id,
        timezone: 'America/New_York',
        locale: 'en-US'
      }
    }),
    prisma.user.create({
      data: {
        email: 'user.three@utc.com',
        firstName: 'User',
        lastName: 'Three',
        displayName: 'User Three',
        passwordHash: hashedPassword,
        status: 'ACTIVE',
        isActive: true,
        isEmailVerified: true,
        userType: 'REGULAR',
        role: 'END_USER',
        tenantId: utc.id,
        timezone: 'America/New_York',
        locale: 'en-US'
      }
    }),
    prisma.user.create({
      data: {
        email: 'admin.utc@utc.com',
        firstName: 'Admin',
        lastName: 'UTC',
        displayName: 'Admin UTC',
        passwordHash: hashedPassword,
        status: 'ACTIVE',
        isActive: true,
        isEmailVerified: true,
        userType: 'ADMIN',
        role: 'TENANT_ADMIN',
        tenantId: utc.id,
        timezone: 'America/New_York',
        locale: 'en-US'
      }
    })
  ]);

  console.log('✅ Created 16 users (4 per tenant):');
  console.log('  🏢 BlickTrack: 3 users + 1 admin');
  console.log('  🏢 Huawei: 3 users + 1 admin');
  console.log('  🏢 Boeing: 3 users + 1 admin');
  console.log('  🏢 UTC: 3 users + 1 admin');
  console.log('  🔐 All passwords: Syed@123 (bcrypt hashed)');

  // 6. Create Hierarchical Project Examples
  console.log('🏗️ Creating hierarchical project structures...');
  
  // Boeing Defense Portfolio
  const boeingPortfolio = await prisma.project.create({
    data: {
      name: 'Boeing Defense Division',
      description: 'Complete defense portfolio for Boeing',
      hierarchyType: 'PORTFOLIO',
      type: 'SECURITY_ASSESSMENT',
      status: 'ACTIVE',
      priority: 'HIGH',
      tenantId: boeing.id,
      level: 0,
      path: '/Boeing Defense Division',
      isRoot: true,
      isLeaf: false,
      riskLevel: 'HIGH',
      complianceFrameworks: ['NIST', 'SOX', 'ITAR'],
      inheritCompliance: false, // Portfolio sets compliance
      metadata: {
        portfolioManager: 'defense.portfolio@boeing.com',
        budgetCode: 'DEF-2024-001',
        classification: 'CONFIDENTIAL'
      }
    }
  });

  // F-35 Program under Boeing Portfolio  
  const f35Program = await prisma.project.create({
    data: {
      name: 'F-35 Lightning II Program',
      description: 'Joint Strike Fighter program management',
      hierarchyType: 'PROGRAM',
      type: 'SECURITY_ASSESSMENT',
      status: 'ACTIVE',
      priority: 'CRITICAL',
      tenantId: boeing.id,
      parentId: boeingPortfolio.id,
      level: 1,
      path: '/Boeing Defense Division/F-35 Lightning II Program',
      isRoot: false,
      isLeaf: false,
      riskLevel: 'CRITICAL',
      inheritCompliance: true,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2026-12-31'),
      metadata: {
        programManager: 'f35.program@boeing.com',
        contractNumber: 'F35-JSF-2024',
        securityClearance: 'SECRET'
      }
    }
  });

  // F-35A Product under F-35 Program
  const f35aProduct = await prisma.project.create({
    data: {
      name: 'F-35A Lightning II',
      description: 'Conventional takeoff and landing variant',
      hierarchyType: 'PRODUCT',
      type: 'THREAT_MODELING',
      status: 'ACTIVE',
      priority: 'CRITICAL',
      tenantId: boeing.id,
      parentId: f35Program.id,
      level: 2,
      path: '/Boeing Defense Division/F-35 Lightning II Program/F-35A Lightning II',
      isRoot: false,
      isLeaf: false,
      riskLevel: 'CRITICAL',
      inheritCompliance: true,
      metadata: {
        productManager: 'f35a.product@boeing.com',
        variant: 'CTOL',
        customerBranch: 'Air Force'
      }
    }
  });

  // Individual Projects under F-35A Product
  const avionicsProject = await prisma.project.create({
    data: {
      name: 'Avionics Security Assessment',
      description: 'Comprehensive security analysis of F-35A avionics systems',
      hierarchyType: 'PROJECT',
      type: 'THREAT_MODELING',
      status: 'ACTIVE',
      priority: 'HIGH',
      tenantId: boeing.id,
      parentId: f35aProduct.id,
      level: 3,
      path: '/Boeing Defense Division/F-35 Lightning II Program/F-35A Lightning II/Avionics Security Assessment',
      isRoot: false,
      isLeaf: true,
      riskLevel: 'HIGH',
      inheritCompliance: true,
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-09-30'),
      metadata: {
        projectLead: 'john.avionics@boeing.com',
        systemCategory: 'AVIONICS',
        threatModelingMethod: 'STRIDE'
      }
    }
  });

  const engineProject = await prisma.project.create({
    data: {
      name: 'Engine Control Systems',
      description: 'Security assessment of Pratt & Whitney F135 engine controls',
      hierarchyType: 'PROJECT', 
      type: 'SECURITY_ASSESSMENT',
      status: 'ACTIVE',
      priority: 'CRITICAL',
      tenantId: boeing.id,
      parentId: f35aProduct.id,
      level: 3,
      path: '/Boeing Defense Division/F-35 Lightning II Program/F-35A Lightning II/Engine Control Systems',
      isRoot: false,
      isLeaf: true,
      riskLevel: 'CRITICAL',
      inheritCompliance: true,
      startDate: new Date('2024-02-15'),
      endDate: new Date('2024-08-15'),
      metadata: {
        projectLead: 'sarah.engine@boeing.com',
        systemCategory: 'PROPULSION',
        vendor: 'Pratt & Whitney'
      }
    }
  });

  // Huawei Telecommunications Portfolio
  const huaweiPortfolio = await prisma.project.create({
    data: {
      name: 'Huawei Global Telecommunications',
      description: 'Worldwide telecommunications infrastructure portfolio',
      hierarchyType: 'PORTFOLIO',
      type: 'SECURITY_ASSESSMENT',
      status: 'ACTIVE',
      priority: 'HIGH',
      tenantId: huawei.id,
      level: 0,
      path: '/Huawei Global Telecommunications',
      isRoot: true,
      isLeaf: false,
      riskLevel: 'HIGH',
      complianceFrameworks: ['ISO27001', 'GDPR', '3GPP'],
      inheritCompliance: false,
      metadata: {
        portfolioManager: 'portfolio.manager@huawei.com',
        regions: ['EMEA', 'APAC', 'Americas'],
        businessUnit: 'Carrier Business Group'
      }
    }
  });

  // 5G Infrastructure Program
  const huawei5G = await prisma.project.create({
    data: {
      name: '5G Infrastructure Program',
      description: 'Global 5G network equipment and solutions',
      hierarchyType: 'PROGRAM',
      type: 'SECURITY_ASSESSMENT',
      status: 'ACTIVE',
      priority: 'CRITICAL',
      tenantId: huawei.id,
      parentId: huaweiPortfolio.id,
      level: 1,
      path: '/Huawei Global Telecommunications/5G Infrastructure Program',
      isRoot: false,
      isLeaf: false,
      riskLevel: 'CRITICAL',
      inheritCompliance: true,
      metadata: {
        programManager: '5g.program@huawei.com',
        technologyStandard: '3GPP Release 16',
        targetMarkets: ['Europe', 'Asia', 'Middle East']
      }
    }
  });

  // 5G Base Station Product
  const baseStationProduct = await prisma.project.create({
    data: {
      name: '5G Base Station Systems',
      description: 'Next-generation 5G base station hardware and software',
      hierarchyType: 'PRODUCT',
      type: 'THREAT_MODELING',
      status: 'ACTIVE',
      priority: 'CRITICAL',
      tenantId: huawei.id,
      parentId: huawei5G.id,
      level: 2,
      path: '/Huawei Global Telecommunications/5G Infrastructure Program/5G Base Station Systems',
      isRoot: false,
      isLeaf: false,
      riskLevel: 'CRITICAL',
      inheritCompliance: true,
      metadata: {
        productManager: 'basestation.product@huawei.com',
        productFamily: 'AAU5900 Series',
        spectrumBands: ['Sub-6GHz', 'mmWave']
      }
    }
  });

  // UTC Aerospace Portfolio
  const utcPortfolio = await prisma.project.create({
    data: {
      name: 'UTC Aerospace Systems',
      description: 'Aerospace systems and components portfolio',
      hierarchyType: 'PORTFOLIO', 
      type: 'COMPLIANCE_AUDIT',
      status: 'ACTIVE',
      priority: 'HIGH',
      tenantId: utc.id,
      level: 0,
      path: '/UTC Aerospace Systems',
      isRoot: true,
      isLeaf: false,
      riskLevel: 'HIGH',
      complianceFrameworks: ['AS9100', 'ISO14001', 'RTCA DO-178C'],
      inheritCompliance: false,
      metadata: {
        portfolioManager: 'aerospace.portfolio@utc.com',
        sectors: ['Commercial Aviation', 'Military', 'Space'],
        headquarters: 'Windsor Locks, Connecticut'
      }
    }
  });

  // Pratt & Whitney Engines Program
  const pwEngines = await prisma.project.create({
    data: {
      name: 'Pratt & Whitney Engines',
      description: 'Advanced jet engine development and manufacturing',
      hierarchyType: 'PROGRAM',
      type: 'SECURITY_ASSESSMENT', 
      status: 'ACTIVE',
      priority: 'CRITICAL',
      tenantId: utc.id,
      parentId: utcPortfolio.id,
      level: 1,
      path: '/UTC Aerospace Systems/Pratt & Whitney Engines',
      isRoot: false,
      isLeaf: false,
      riskLevel: 'CRITICAL',
      inheritCompliance: true,
      metadata: {
        programManager: 'pw.program@utc.com',
        engineTypes: ['Commercial', 'Military', 'General Aviation'],
        headquarters: 'East Hartford, Connecticut'
      }
    }
  });

  console.log('✅ Created hierarchical project structure:');
  console.log('  🏢 Boeing Defense Division (Portfolio)');
  console.log('    📁 F-35 Lightning II Program');
  console.log('      📦 F-35A Lightning II (Product)');
  console.log('        🚀 Avionics Security Assessment');
  console.log('        🚀 Engine Control Systems');
  console.log('  🏢 Huawei Global Telecommunications (Portfolio)');
  console.log('    📁 5G Infrastructure Program');
  console.log('      📦 5G Base Station Systems (Product)');
  console.log('  🏢 UTC Aerospace Systems (Portfolio)');
  console.log('    📁 Pratt & Whitney Engines Program');

  // 6. Create Tenant Configurations
  console.log('⚙️ Creating tenant configurations...');

  // BlickTrack (wants landing page)
  await prisma.tenantConfiguration.create({
    data: {
      tenantId: blickTrack.id,
      enableLandingPage: true,
      enableRegistration: true,
      enable2FA: false,
      enableDarkMode: true,
      theme: 'corporate',
      primaryColor: '#2563eb',
      ssoEnabled: false,
    }
  });

  // Boeing (wants direct login)
  await prisma.tenantConfiguration.create({
    data: {
      tenantId: boeing.id,
      enableLandingPage: false,
      enableRegistration: false,
      enable2FA: true,
      enableDarkMode: true,
      theme: 'aerospace',
      primaryColor: '#1e40af',
      ssoEnabled: false,
    }
  });

  // Huawei (wants landing page)
  await prisma.tenantConfiguration.create({
    data: {
      tenantId: huawei.id,
      enableLandingPage: true,
      enableRegistration: true,
      enable2FA: false,
      enableDarkMode: true,
      theme: 'corporate',
      primaryColor: '#dc2626',
      ssoEnabled: false,
    }
  });

  // UTC (wants direct login)
  await prisma.tenantConfiguration.create({
    data: {
      tenantId: utc.id,
      enableLandingPage: false,
      enableRegistration: false,
      enable2FA: true,
      enableDarkMode: true,
      theme: 'aerospace',
      primaryColor: '#059669',
      ssoEnabled: false,
    }
  });

  // Gmail tenant configuration
  await prisma.tenantConfiguration.create({
    data: {
      tenantId: gmail.id,
      enableLandingPage: true,
      enableRegistration: true,
      enable2FA: false,
      enableDarkMode: true,
      theme: 'modern',
      primaryColor: '#ea4335', // Gmail red color
      ssoEnabled: false,
    }
  });

  console.log('✅ Created tenant configurations:');
  console.log('  🏢 BlickTrack: Landing page enabled (corporate theme)');
  console.log('  🏢 Boeing: Direct login (aerospace theme)');
  console.log('  🏢 Huawei: Landing page enabled (corporate theme)');
  console.log('  🏢 UTC: Direct login (aerospace theme)');
  console.log('  📧 Gmail: Landing page enabled (modern theme)');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });