# BlickTrack Hierarchical Project & Product Architecture

## Overview

BlickTrack now supports unlimited hierarchical depth for products and projects, enabling complex organizational structures like portfolios, programs, products, sub-products, projects, and workstreams.

## Schema Changes

### Enhanced Project Model

```prisma
model Project {
  // HIERARCHICAL STRUCTURE SUPPORT
  parentId String?
  parent   Project? @relation("ProjectHierarchy", fields: [parentId], references: [id])
  children Project[] @relation("ProjectHierarchy")
  
  // Hierarchy metadata
  level       Int     @default(0) // 0=root, 1=child, 2=grandchild, etc.
  path        String? // "/root/child/grandchild" for quick queries
  isRoot      Boolean @default(false)
  isLeaf      Boolean @default(true)
  
  // Hierarchy-specific types
  hierarchyType ProjectHierarchyType @default(PROJECT)
  
  // Compliance inheritance
  inheritCompliance Boolean @default(true) // inherit from parent?
}
```

### New Hierarchy Types

```prisma
enum ProjectHierarchyType {
  PROJECT      // Individual project (leaf level)
  PRODUCT      // Product containing multiple projects
  PORTFOLIO    // Portfolio of products/projects
  PROGRAM      // Program management level
  INITIATIVE   // Strategic initiative level
  WORKSTREAM   // Sub-project workstream
}
```

### Hierarchical Permissions

```prisma
model ProjectHierarchyPermission {
  projectId String
  userId    String?
  roleId    String?
  
  permission   String  // "read", "write", "admin", "manage_children"
  isInherited  Boolean @default(false) // inherited from parent?
  inheritLevel Int?    // from which level inherited
}
```

## Use Cases Supported

### 1. Enterprise Portfolio Structure
```
Boeing Defense Division (PORTFOLIO)
├── F-35 Program (PROGRAM)
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

### 2. Software Product Hierarchy
```
Microsoft Office 365 (PORTFOLIO)
├── Office Applications (PROGRAM)
│   ├── Microsoft Word (PRODUCT) 
│   │   ├── Document Security (PROJECT)
│   │   ├── Collaboration Features (PROJECT)
│   │   └── Mobile App Security (PROJECT)
│   ├── Microsoft Excel (PRODUCT)
│   │   ├── Data Protection (PROJECT)
│   │   └── Formula Security (PROJECT)
│   └── Microsoft PowerPoint (PRODUCT)
│       └── Presentation Security (PROJECT)
└── Cloud Services (PROGRAM)
    ├── OneDrive (PRODUCT)
    │   ├── File Encryption (PROJECT)
    │   └── Sharing Security (PROJECT)
    └── Teams (PRODUCT)
        ├── Meeting Security (PROJECT)
        └── Chat Encryption (PROJECT)
```

### 3. Banking Product Suite
```
Digital Banking Platform (PORTFOLIO)
├── Customer Banking (PROGRAM)
│   ├── Mobile Banking App (PRODUCT)
│   │   ├── Authentication Security (PROJECT)
│   │   ├── Transaction Security (PROJECT)
│   │   └── Data Privacy Compliance (PROJECT)
│   └── Online Banking Portal (PRODUCT)
│       ├── Web Security Assessment (PROJECT)
│       └── API Security Testing (PROJECT)
├── Business Banking (PROGRAM)
│   ├── Corporate Banking Suite (PRODUCT)
│   │   ├── Wire Transfer Security (PROJECT)
│   │   └── Account Management Security (PROJECT)
│   └── Small Business Tools (PRODUCT)
│       └── Payment Processing Security (PROJECT)
└── Investment Services (PROGRAM)
    └── Trading Platform (PRODUCT)
        ├── Order Management Security (PROJECT)
        └── Market Data Security (PROJECT)
```

## Permission Inheritance Model

### Hierarchical Access Control

1. **Inheritance by Default**: Child projects inherit permissions from parents
2. **Override Capability**: Specific permissions can be granted/denied at any level
3. **Granular Control**: Different permission types can be set independently

### Permission Types

- `read`: View project and its threat models
- `write`: Edit project details and threat models  
- `admin`: Full control over project
- `manage_children`: Create/delete child projects

### Example Permission Flow

```
Portfolio Manager (Jane)
├── read, write, admin, manage_children → Boeing Defense Portfolio
    ├── INHERITED: read, write → F-35 Program
    │   ├── INHERITED: read → F-35A Product
    │   │   ├── INHERITED: read → Avionics Security Project
    │   │   └── EXPLICIT: write → Engine Control Project (granted specifically)
    │   └── EXPLICIT: admin → F-35B Product (granted specifically)
    └── EXPLICIT: none → C-17 Program (access denied)

Security Analyst (John)  
├── read → F-35A Product (granted at product level)
    ├── INHERITED: read → Avionics Security Project
    ├── INHERITED: read → Engine Control Project  
    └── INHERITED: read → Weapon Systems Project
```

## Database Queries for Hierarchical Data

### 1. Get All Children (Recursive)
```sql
WITH RECURSIVE project_tree AS (
  -- Base case: start with parent
  SELECT id, name, parent_id, level, 0 as depth
  FROM projects 
  WHERE id = $parentId
  
  UNION ALL
  
  -- Recursive case: get children
  SELECT p.id, p.name, p.parent_id, p.level, pt.depth + 1
  FROM projects p
  INNER JOIN project_tree pt ON p.parent_id = pt.id
)
SELECT * FROM project_tree ORDER BY depth, name;
```

### 2. Get Full Path to Root
```sql
WITH RECURSIVE path_to_root AS (
  -- Base case: start with current project
  SELECT id, name, parent_id, name as path, 0 as depth
  FROM projects 
  WHERE id = $projectId
  
  UNION ALL
  
  -- Recursive case: get parents
  SELECT p.id, p.name, p.parent_id, p.name || ' / ' || ptr.path, ptr.depth + 1
  FROM projects p
  INNER JOIN path_to_root ptr ON ptr.parent_id = p.id
)
SELECT path FROM path_to_root ORDER BY depth DESC LIMIT 1;
```

### 3. Get Effective Permissions (with inheritance)
```sql
WITH RECURSIVE permission_inheritance AS (
  -- Direct permissions
  SELECT project_id, user_id, permission, false as is_inherited, 0 as inherit_level
  FROM project_hierarchy_permissions 
  WHERE user_id = $userId AND project_id = $projectId
  
  UNION ALL
  
  -- Inherited permissions from parents
  SELECT p.id, php.user_id, php.permission, true as is_inherited, pi.inherit_level + 1
  FROM projects p
  INNER JOIN permission_inheritance pi ON p.parent_id = pi.project_id
  INNER JOIN project_hierarchy_permissions php ON php.project_id = p.parent_id
  WHERE php.user_id = $userId
)
SELECT DISTINCT permission, min(inherit_level) as closest_grant
FROM permission_inheritance 
GROUP BY permission
ORDER BY closest_grant;
```

## API Design Patterns

### 1. Project Creation with Hierarchy
```typescript
interface CreateProjectRequest {
  name: string;
  description?: string;
  parentId?: string;  // null = root level
  hierarchyType: ProjectHierarchyType;
  // ... other fields
}

// Auto-calculate level and path
const createProject = async (data: CreateProjectRequest) => {
  let level = 0;
  let path = `/${data.name}`;
  
  if (data.parentId) {
    const parent = await prisma.project.findUnique({
      where: { id: data.parentId }
    });
    level = parent.level + 1;
    path = `${parent.path}/${data.name}`;
    
    // Update parent's isLeaf status
    await prisma.project.update({
      where: { id: data.parentId },
      data: { isLeaf: false }
    });
  }
  
  return prisma.project.create({
    data: {
      ...data,
      level,
      path,
      isRoot: !data.parentId,
      isLeaf: true
    }
  });
};
```

### 2. Permission Check with Inheritance
```typescript
const checkPermission = async (userId: string, projectId: string, permission: string): Promise<boolean> => {
  // Check direct permission first
  const directPerm = await prisma.projectHierarchyPermission.findFirst({
    where: { userId, projectId, permission }
  });
  
  if (directPerm) return true;
  
  // Check inherited permissions by walking up the tree
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { parent: true }
  });
  
  if (project?.parent) {
    return checkPermission(userId, project.parent.id, permission);
  }
  
  return false;
};
```

### 3. Bulk Permission Updates
```typescript
const grantPermissionToSubtree = async (
  rootProjectId: string, 
  userId: string, 
  permission: string
) => {
  // Get all descendants
  const descendants = await getProjectDescendants(rootProjectId);
  
  // Create permissions for all descendants
  const permissions = descendants.map(project => ({
    projectId: project.id,
    userId,
    permission,
    isInherited: project.id !== rootProjectId,
    inheritLevel: project.level - descendants[0].level,
    tenantId: project.tenantId
  }));
  
  await prisma.projectHierarchyPermission.createMany({
    data: permissions,
    skipDuplicates: true
  });
};
```

## Frontend Components

### 1. Hierarchical Project Tree
```typescript
const ProjectTree: React.FC<{ tenantId: string }> = ({ tenantId }) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const { data: projects } = useQuery(['projects', tenantId], () => 
    fetchProjectHierarchy(tenantId)
  );
  
  const renderProjectNode = (project: Project, level = 0) => (
    <div key={project.id} style={{ paddingLeft: level * 20 }}>
      <div className="project-node">
        {!project.isLeaf && (
          <button onClick={() => toggleExpanded(project.id)}>
            {expandedNodes.has(project.id) ? '▼' : '▶'}
          </button>
        )}
        <span className={`hierarchy-type ${project.hierarchyType.toLowerCase()}`}>
          {project.hierarchyType}
        </span>
        <span className="project-name">{project.name}</span>
        <span className="project-path">{project.path}</span>
      </div>
      
      {expandedNodes.has(project.id) && project.children?.map(child =>
        renderProjectNode(child, level + 1)
      )}
    </div>
  );
  
  return (
    <div className="project-tree">
      {projects?.filter(p => p.isRoot).map(project => 
        renderProjectNode(project)
      )}
    </div>
  );
};
```

### 2. Permission Management Interface
```typescript
const ProjectPermissions: React.FC<{ projectId: string }> = ({ projectId }) => {
  const [permissions, setPermissions] = useState<ProjectPermission[]>([]);
  const [showInherited, setShowInherited] = useState(false);
  
  return (
    <div className="project-permissions">
      <div className="permission-filters">
        <label>
          <input 
            type="checkbox" 
            checked={showInherited}
            onChange={(e) => setShowInherited(e.target.checked)}
          />
          Show inherited permissions
        </label>
      </div>
      
      <table className="permissions-table">
        <thead>
          <tr>
            <th>User/Role</th>
            <th>Permission</th>
            <th>Source</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {permissions.filter(p => showInherited || !p.isInherited).map(perm => (
            <tr key={`${perm.userId}-${perm.permission}`}>
              <td>{perm.user?.name || perm.role?.name}</td>
              <td>{perm.permission}</td>
              <td>
                {perm.isInherited ? (
                  <span className="inherited">
                    Inherited from level {perm.inheritLevel}
                  </span>
                ) : (
                  <span className="direct">Direct</span>
                )}
              </td>
              <td>
                {!perm.isInherited && (
                  <button onClick={() => revokePermission(perm.id)}>
                    Revoke
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
```

## Migration Strategy

### 1. Existing Data Migration
```sql
-- Add new columns with defaults
ALTER TABLE projects 
ADD COLUMN parent_id VARCHAR(36),
ADD COLUMN level INTEGER DEFAULT 0,
ADD COLUMN path VARCHAR(1000),
ADD COLUMN is_root BOOLEAN DEFAULT true,
ADD COLUMN is_leaf BOOLEAN DEFAULT true,
ADD COLUMN hierarchy_type VARCHAR(20) DEFAULT 'PROJECT',
ADD COLUMN inherit_compliance BOOLEAN DEFAULT true;

-- Update path for existing projects  
UPDATE projects SET path = '/' || name WHERE path IS NULL;

-- Add foreign key constraint
ALTER TABLE projects 
ADD CONSTRAINT fk_project_parent 
FOREIGN KEY (parent_id) REFERENCES projects(id);

-- Create hierarchy permissions table
CREATE TABLE project_hierarchy_permissions (
  id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id VARCHAR(36) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id VARCHAR(36) REFERENCES users(id),
  role_id VARCHAR(36) REFERENCES roles(id),
  permission VARCHAR(100) NOT NULL,
  is_inherited BOOLEAN DEFAULT false,
  inherit_level INTEGER,
  tenant_id VARCHAR(36) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 2. Gradual Rollout Plan

1. **Phase 1**: Deploy schema changes with feature flag disabled
2. **Phase 2**: Enable hierarchy creation for new projects only
3. **Phase 3**: Provide migration tools for existing projects
4. **Phase 4**: Enable full hierarchical features
5. **Phase 5**: Optimize performance and add advanced features

## Benefits of This Approach

### 1. Unlimited Flexibility
- Support any organizational structure
- No arbitrary depth limits
- Configurable hierarchy types

### 2. Scalable Permissions
- Efficient inheritance model
- Granular control when needed
- Clear audit trail

### 3. Performance Optimized
- Path-based queries for fast lookups
- Level indexing for depth queries
- Materialized permission views

### 4. User Experience
- Familiar tree navigation
- Clear visual hierarchy
- Intuitive permission model

This hierarchical architecture makes BlickTrack truly enterprise-ready for organizations of any size and complexity!