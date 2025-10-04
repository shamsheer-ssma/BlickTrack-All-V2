# Schema Migration Strategy

## Phase 1 → Phase 2 Migration
```sql
-- Add new tables
CREATE TABLE permissions (...);
CREATE TABLE role_permissions (...);
CREATE TABLE departments (...);

-- Add columns to existing tables
ALTER TABLE users ADD COLUMN department_id VARCHAR;
ALTER TABLE projects ADD COLUMN department_id VARCHAR;
ALTER TABLE user_roles ADD COLUMN conditions JSONB;

-- Migrate existing data
INSERT INTO permissions (name, category, action) VALUES 
  ('project:read', 'project', 'read'),
  ('project:write', 'project', 'write');

-- Create default role permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p;
```

## Phase 2 → Phase 3 Migration
```sql
-- Add enterprise tables
CREATE TABLE feature_plans (...);
CREATE TABLE features (...);
CREATE TABLE compliance_frameworks (...);
CREATE TABLE audit_logs (...);

-- Add plan association to tenants
ALTER TABLE tenants ADD COLUMN plan_id VARCHAR;
UPDATE tenants SET plan_id = (SELECT id FROM feature_plans WHERE name = 'starter');
```

## Rollback Strategy
- Keep previous schema versions in git
- Use Prisma migration rollback: `npx prisma migrate reset`
- Database snapshots before major migrations