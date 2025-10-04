# 🚀 BlickTrack Database Setup Guide

## Overview

This guide helps you set up the complete BlickTrack database infrastructure using Docker on Windows. Our database schema supports all the advanced features we've discussed:

- ✅ **Hierarchical Projects** - Unlimited depth product/project hierarchies
- ✅ **Multi-tenant Architecture** - Complete tenant isolation
- ✅ **Advanced RBAC** - Role-based access control with inheritance
- ✅ **Feature Licensing** - Granular feature access control
- ✅ **Organizational Flexibility** - Adaptable to any company structure
- ✅ **Activity Templates** - Pre-built security activity templates
- ✅ **Compliance Management** - Built-in compliance framework support

## 📋 Prerequisites

### 1. Install Docker Desktop for Windows
- Download from: https://www.docker.com/products/docker-desktop/
- Ensure Docker is running (look for the Docker icon in system tray)

### 2. Install Node.js & npm
- Download from: https://nodejs.org/ (LTS version recommended)
- Verify installation: `node --version` and `npm --version`

### 3. Verify Prerequisites
```powershell
# Check Docker
docker --version

# Check Node.js
node --version

# Check npm
npm --version
```

## 🚀 Quick Setup (Automated)

### Option 1: Using Batch Script (Recommended)
```cmd
# Navigate to backend directory
cd c:\GIT\BlickTrack\backend

# Run the automated setup
setup-database.bat
```

### Option 2: Manual Setup
```cmd
# 1. Start database services
docker-compose up -d

# 2. Wait for database to be ready (check logs)
docker logs blicktrack-postgres

# 3. Run migrations
npx prisma migrate dev --name "initial-setup"

# 4. Seed database
npx prisma db seed

# 5. Generate Prisma client
npx prisma generate
```

## 🗄️ Database Schema Overview

### Core Models (23 Total)

#### 1. **Multi-tenant Foundation**
- `Tenant` - Company accounts with industry-specific configuration
- `TenantConfiguration` - Industry templates and terminology customization
- `User` - Multi-tenant users with organization assignment
- `Department` - Hierarchical department structure

#### 2. **Hierarchical Project System**
- `Project` - Unlimited hierarchy: Portfolio → Program → Product → Project → Workstream
- `ProjectHierarchyPermission` - Inherited permissions across hierarchy levels
- `OrganizationalUnit` - Flexible org structure (Division → Department → Team)
- `BusinessEntity` - Universal containers for products/projects/services

#### 3. **Advanced Access Control**
- `Role` - Custom roles with granular permissions
- `Permission` - Granular permissions (read/write/admin/manage_children)
- `Principal` - Users, roles, and groups
- `PrincipalAssignment` - Role assignments with context
- `EntityAccess` - Business entity access control

#### 4. **Feature Licensing System**
- `FeaturePlan` - Subscription plans (Trial/Professional/Enterprise)
- `Feature` - Individual features with licensing controls
- `PlanFeature` - Feature availability per plan with user limits
- `UserFeatureAccess` - Individual user feature access tracking

#### 5. **Security & Compliance**
- `ActivityTemplate` - Pre-built security activity templates
- `SecurityProject` - Instantiated security activities
- `ThreatModel` - Threat modeling with STRIDE methodology
- `ComplianceFramework` - NIST, ISO27001, SOX, etc.
- `ComplianceRequirement` - Specific compliance requirements
- `AuditLog` - Comprehensive audit trail

## 🌳 Hierarchical Architecture Examples

### Aerospace & Defense (Boeing)
```
Boeing Defense Division (PORTFOLIO)
├── F-35 Lightning II Program (PROGRAM)
│   ├── F-35A Lightning II (PRODUCT)
│   │   ├── Avionics Security Assessment (PROJECT)
│   │   ├── Engine Control Systems (PROJECT)
│   │   └── Weapon Systems Integration (PROJECT)
│   └── F-35B STOVL Variant (PRODUCT)
│       ├── VTOL Security Analysis (PROJECT)
│       └── Marine Integration Testing (PROJECT)
└── C-17 Globemaster Program (PROGRAM)
    └── C-17 Modernization (PRODUCT)
        ├── Cargo Systems Upgrade (PROJECT)
        └── Navigation Security (PROJECT)
```

### Financial Services (Banking)
```
Digital Banking Platform (PORTFOLIO)
├── Customer Banking Services (PROGRAM)
│   ├── Mobile Banking Application (PRODUCT)
│   │   ├── Authentication Security Assessment (PROJECT)
│   │   ├── Transaction Security Analysis (PROJECT)
│   │   └── Data Privacy Compliance (PROJECT)
│   └── Online Banking Portal (PRODUCT)
│       ├── Web Application Security (PROJECT)
│       └── API Security Testing (PROJECT)
└── Business Banking Services (PROGRAM)
    ├── Corporate Banking Suite (PRODUCT)
    └── Small Business Tools (PRODUCT)
```

## 🔧 Database Services

### PostgreSQL Database
- **Port**: 5432
- **Database**: `blicktrack_dev`
- **Username**: `blicktrack_admin`
- **Password**: `BlickTrack@2024!`
- **Connection**: `postgresql://blicktrack_admin:BlickTrack@2024!@localhost:5432/blicktrack_dev`

### pgAdmin Web Interface
- **URL**: http://localhost:8080
- **Email**: admin@blicktrack.com
- **Password**: BlickTrack@Admin2024!

### Redis Cache (Optional)
- **Port**: 6379
- **URL**: `redis://localhost:6379`

## 📊 Database Management

### Prisma Studio (Database Browser)
```cmd
# Open Prisma Studio
npx prisma studio

# Opens at: http://localhost:5555
```

### Common Prisma Commands
```cmd
# Generate client after schema changes
npx prisma generate

# Create new migration
npx prisma migrate dev --name "description-of-changes"

# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# Seed database with sample data
npx prisma db seed

# View migration status
npx prisma migrate status

# Deploy migrations to production
npx prisma migrate deploy
```

### Docker Commands
```cmd
# View running containers
docker ps

# View logs
docker logs blicktrack-postgres
docker logs blicktrack-pgadmin

# Stop services
docker-compose down

# Start services
docker-compose up -d

# Rebuild services
docker-compose up -d --build

# Remove all data (fresh start)
docker-compose down -v
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Database Connection Error
```
Error: P1001 - Can't reach database server
```
**Solution:**
```cmd
# Check if Docker is running
docker ps

# Restart database
docker-compose restart blicktrack-database
```

#### 2. Migration Failed
```
Error: P3009 - Migration failed to apply cleanly
```
**Solution:**
```cmd
# Reset and reapply migrations
npx prisma migrate reset
npx prisma migrate dev
```

#### 3. Port Already in Use
```
Error: Port 5432 is already in use
```
**Solution:**
```cmd
# Check what's using the port
netstat -ano | findstr :5432

# Kill the process or change port in docker-compose.yml
```

#### 4. Permission Denied
```
Error: Permission denied on Docker volume
```
**Solution:**
```cmd
# Run as administrator or adjust Docker settings
# Docker Desktop > Settings > Resources > File Sharing
```

## 🧪 Testing the Setup

### 1. Verify Database Connection
```cmd
docker exec -it blicktrack-postgres psql -U blicktrack_admin -d blicktrack_dev -c "SELECT version();"
```

### 2. Check Schema Creation
```cmd
docker exec -it blicktrack-postgres psql -U blicktrack_admin -d blicktrack_dev -c "\dt"
```

### 3. Verify Seed Data
```cmd
docker exec -it blicktrack-postgres psql -U blicktrack_admin -d blicktrack_dev -c "SELECT name FROM tenants;"
```

## 📈 Performance Optimization

### Database Configuration
Our PostgreSQL setup includes:
- **Extensions**: uuid-ossp, pgcrypto, btree_gin, pg_trgm
- **Optimized Indexes**: On all foreign keys and frequently queried fields
- **Connection Pooling**: Ready for production scaling

### Monitoring
```sql
-- Check database performance
SELECT schemaname, tablename, n_tup_ins, n_tup_upd, n_tup_del 
FROM pg_stat_user_tables 
ORDER BY n_tup_ins DESC;

-- Check index usage
SELECT schemaname, tablename, attname, n_distinct, correlation 
FROM pg_stats 
WHERE schemaname = 'public';
```

## 🚀 Next Steps

After database setup:

1. **Start Backend**: `npm run dev`
2. **Test APIs**: Use Postman or curl to test endpoints
3. **Run Frontend**: Start React frontend application
4. **Create First Tenant**: Use the tenant creation API
5. **Set Up Hierarchy**: Create your organizational structure

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [BlickTrack API Documentation](../docs/API.md)

---

**🎉 Your BlickTrack database is now ready for enterprise-grade cybersecurity management!**