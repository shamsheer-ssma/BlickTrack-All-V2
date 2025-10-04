# 🏢 Dynamic Organizational Structure System
## Complete Guide for BlickTrack Platform

---

## 📖 Table of Contents
1. [What is This System?](#what-is-this-system)
2. [Why Do We Need This?](#why-do-we-need-this)
3. [How It Works (Simple Explanation)](#how-it-works-simple-explanation)
4. [Database Design](#database-design)
5. [Admin Workflow](#admin-workflow)
6. [Code Implementation](#code-implementation)
7. [User Assignment Process](#user-assignment-process)
8. [Real-World Examples](#real-world-examples)
9. [Testing & Validation](#testing--validation)

---

## 🤔 What is This System?

Think of this like a **digital organization chart builder** for companies. Just like how you might draw an organization chart on paper showing who reports to whom, this system lets company admins create their organization structure in our software.

### Simple Analogy 🌳
Imagine your company is like a **family tree**:
- The company (Boeing) is the **root** of the tree
- Departments (IT, Finance) are **main branches**
- Teams (Security Team, Dev Team) are **smaller branches**
- Employees are the **leaves** on the branches

Our system lets admins **build this tree digitally** and assign employees to the right branches.

---

## 🎯 Why Do We Need This?

### The Problem 😵
Different companies organize themselves differently:

**Company A (Flat Structure):**
```
Boeing
├── IT Department
├── Security Department
├── Finance Department
└── HR Department
```

**Company B (Hierarchical Structure):**
```
Boeing
├── Commercial Division
│   ├── IT Department
│   │   ├── Infrastructure Team
│   │   └── Applications Team
│   └── Engineering Department
└── Defense Division
    ├── R&D Department
    └── Security Department
```

### The Solution ✅
Instead of forcing all companies to use the same structure, we let each company **build their own structure** that matches how they actually work.

---

## 🔧 How It Works (Simple Explanation)

### Step 1: Admin Logs In
Company admin (like Boeing's IT manager) logs into our system.

### Step 2: Choose Structure Type
Admin picks how they want to organize:
- **"Flat"** = All departments at same level
- **"Hierarchical"** = Departments have sub-departments
- **"Matrix"** = Mix of both

### Step 3: Build Organization
Admin either:
- Picks a **template** (quick setup)
- Builds **custom structure** (drag & drop)

### Step 4: Add Users
Admin assigns employees to departments/teams.

### Step 5: Ready to Use!
Employees can now use features based on their department assignment.

---

## 🗃️ Database Design

### Main Tables

#### 1. OrganizationalUnit Table
This is like a **box** that can contain other boxes (departments, teams, etc.).

```sql
CREATE TABLE organizational_units (
  id          VARCHAR PRIMARY KEY,
  name        VARCHAR NOT NULL,        -- "IT Department"
  type        VARCHAR NOT NULL,        -- "DEPARTMENT", "TEAM", etc.
  level       INTEGER NOT NULL,        -- 1, 2, 3 (depth in tree)
  tenant_id   VARCHAR NOT NULL,        -- Which company owns this
  parent_id   VARCHAR,                 -- Points to parent box (can be empty for top level)
  
  -- Helper fields
  display_order INTEGER DEFAULT 0,     -- For sorting in UI
  is_active     BOOLEAN DEFAULT true,  -- Can be disabled
  metadata      JSON DEFAULT '{}',     -- Custom fields per company
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 2. UserOrgAssignment Table
This connects **employees** to **organizational boxes**.

```sql
CREATE TABLE user_org_assignments (
  id         VARCHAR PRIMARY KEY,
  user_id    VARCHAR NOT NULL,         -- Which employee
  org_unit_id VARCHAR NOT NULL,        -- Which department/team
  
  is_primary BOOLEAN DEFAULT false,    -- Their main assignment
  role       VARCHAR,                  -- "Member", "Lead", "Manager"
  
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Visual Database Relationship

```
Tenant (Boeing)
    ↓
OrganizationalUnit (IT Department)
    ↓
OrganizationalUnit (Security Team) ← UserOrgAssignment → User (John Smith)
```

---

## 👨‍💼 Admin Workflow

### Phase 1: Initial Setup

#### Option A: Quick Template Setup (5 minutes)
```typescript
// Admin Dashboard: Template Selection
const templates = [
  {
    name: "Technology Company",
    preview: "Engineering, Security, Operations (3 depts, 8 teams)",
    structure: [
      { name: "Engineering", teams: ["Frontend", "Backend", "QA"] },
      { name: "Security", teams: ["IT Security", "Product Security"] },
      { name: "Operations", teams: ["Infrastructure", "Support"] }
    ]
  },
  {
    name: "Manufacturing Company", 
    preview: "Production, IT, R&D (4 business units, 12 depts)",
    structure: [
      { name: "Production", departments: ["Manufacturing", "Quality"] },
      { name: "IT", departments: ["Infrastructure", "Applications"] }
    ]
  }
];

// Admin clicks "Apply Template" → Done!
```

#### Option B: Custom Structure Builder (15-30 minutes)
```typescript
// Admin Dashboard: Drag & Drop Builder
const OrgBuilder = () => {
  return (
    <div className="org-builder">
      <h2>Build Your Organization Structure</h2>
      
      {/* Drag & Drop Interface */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="org-tree">
          <OrgNode 
            name="Boeing" 
            type="ROOT" 
            onAddChild={addDepartment}
          >
            <OrgNode 
              name="IT Department" 
              type="DEPARTMENT"
              onAddChild={addTeam}
            >
              <OrgNode name="Security Team" type="TEAM" />
              <OrgNode name="Infrastructure Team" type="TEAM" />
            </OrgNode>
          </OrgNode>
        </div>
      </DragDropContext>
      
      <button onClick={saveStructure}>Save Structure</button>
    </div>
  );
};
```

### Phase 2: User Assignment

#### Bulk User Import
```typescript
// Admin uploads CSV file with user assignments
const csvFormat = `
Name,Email,Primary Department,Secondary Teams,Role
John Smith,john@boeing.com,IT Department,Security Team,Developer
Jane Doe,jane@boeing.com,Security Department,,Manager
Bob Wilson,bob@boeing.com,IT Department,QA Team;Security Team,QA Engineer
`;

// System processes CSV and creates user assignments
```

#### Individual User Assignment
```typescript
// Admin assigns users one by one
const UserAssignment = () => {
  return (
    <div className="user-assignment">
      <h3>Assign: John Smith</h3>
      
      {/* Primary Assignment (Required) */}
      <div className="primary-assignment">
        <label>Primary Department:</label>
        <select>
          <option value="it-dept">IT Department</option>
          <option value="security-dept">Security Department</option>
        </select>
      </div>
      
      {/* Secondary Assignments (Optional) */}
      <div className="secondary-assignments">
        <label>Additional Teams:</label>
        <MultiSelect options={availableTeams} />
      </div>
      
      <button onClick={saveAssignment}>Save Assignment</button>
    </div>
  );
};
```

---

## 💻 Code Implementation

### Backend Implementation

#### 1. Template Application Service
```typescript
// services/OrganizationTemplateService.ts
export class OrganizationTemplateService {
  async applyTemplate(tenantId: string, templateId: string) {
    const template = this.getTemplate(templateId);
    
    // Database transaction (all or nothing)
    return await prisma.$transaction(async (tx) => {
      console.log(`Applying template ${templateId} for tenant ${tenantId}`);
      
      // Create organizational structure
      for (const unit of template.structure) {
        await this.createOrgUnitRecursive(tx, tenantId, unit, null, 1);
      }
      
      console.log('Template applied successfully!');
    });
  }
  
  private async createOrgUnitRecursive(tx, tenantId, unitData, parentId, level) {
    // Create the organizational unit
    const orgUnit = await tx.organizationalUnit.create({
      data: {
        name: unitData.name,
        type: unitData.type || 'DEPARTMENT',
        level: level,
        tenantId: tenantId,
        parentId: parentId,
        displayOrder: unitData.order || 0,
        isActive: true,
        metadata: unitData.customFields || {}
      }
    });
    
    console.log(`Created: ${unitData.name} (Level ${level})`);
    
    // Create children if they exist
    if (unitData.children && unitData.children.length > 0) {
      for (let i = 0; i < unitData.children.length; i++) {
        await this.createOrgUnitRecursive(
          tx, tenantId, unitData.children[i], orgUnit.id, level + 1
        );
      }
    }
    
    return orgUnit;
  }
  
  private getTemplate(templateId: string) {
    const templates = {
      'TECH_COMPANY': {
        name: 'Technology Company',
        structure: [
          {
            name: 'Engineering Department',
            type: 'DEPARTMENT',
            children: [
              { name: 'Frontend Team', type: 'TEAM' },
              { name: 'Backend Team', type: 'TEAM' },
              { name: 'QA Team', type: 'TEAM' }
            ]
          },
          {
            name: 'Security Department',
            type: 'DEPARTMENT', 
            children: [
              { name: 'IT Security Team', type: 'TEAM' },
              { name: 'Product Security Team', type: 'TEAM' }
            ]
          }
        ]
      }
    };
    
    return templates[templateId];
  }
}
```

#### 2. User Assignment Service
```typescript
// services/UserAssignmentService.ts
export class UserAssignmentService {
  async assignUserToOrg(
    userId: string, 
    orgUnitId: string, 
    isPrimary: boolean, 
    role?: string
  ) {
    console.log(`Assigning user ${userId} to org unit ${orgUnitId}`);
    
    // If this is a primary assignment, remove existing primary
    if (isPrimary) {
      await prisma.userOrgAssignment.updateMany({
        where: { 
          userId: userId, 
          isPrimary: true 
        },
        data: { 
          isPrimary: false 
        }
      });
      
      console.log('Removed existing primary assignment');
    }
    
    // Create new assignment
    const assignment = await prisma.userOrgAssignment.create({
      data: {
        userId: userId,
        orgUnitId: orgUnitId,
        isPrimary: isPrimary,
        role: role || 'Member'
      }
    });
    
    console.log(`Assignment created successfully!`);
    return assignment;
  }
  
  async getUserOrganizationPath(userId: string) {
    // Get user's primary assignment with full hierarchy path
    const assignment = await prisma.userOrgAssignment.findFirst({
      where: { 
        userId: userId, 
        isPrimary: true 
      },
      include: {
        orgUnit: {
          include: {
            parent: {
              include: {
                parent: {
                  include: {
                    parent: true
                  }
                }
              }
            }
          }
        }
      }
    });
    
    if (!assignment) return null;
    
    // Build hierarchy path: "Boeing > IT Department > Security Team"
    const path = this.buildHierarchyPath(assignment.orgUnit);
    
    return {
      path: path,
      role: assignment.role,
      orgUnit: assignment.orgUnit
    };
  }
  
  private buildHierarchyPath(orgUnit: any): string {
    const path = [];
    let current = orgUnit;
    
    while (current) {
      path.unshift(current.name);
      current = current.parent;
    }
    
    return path.join(' > ');
  }
}
```

#### 3. API Controllers
```typescript
// controllers/OrganizationController.ts
export class OrganizationController {
  
  @Post('/apply-template')
  async applyTemplate(@Body() body: { templateId: string }, @Req() req) {
    const tenantId = req.user.tenantId; // From JWT token
    
    try {
      const result = await this.templateService.applyTemplate(tenantId, body.templateId);
      
      return {
        success: true,
        message: 'Template applied successfully',
        data: result
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to apply template',
        error: error.message
      };
    }
  }
  
  @Post('/save-custom-structure')
  async saveCustomStructure(@Body() body: { structure: any[] }, @Req() req) {
    const tenantId = req.user.tenantId;
    
    try {
      // Validate structure first
      this.validateStructure(body.structure);
      
      const result = await this.builderService.saveCustomStructure(tenantId, body.structure);
      
      return {
        success: true,
        message: 'Custom structure saved successfully',
        data: result
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to save structure',
        error: error.message
      };
    }
  }
  
  @Get('/hierarchy')
  async getOrganizationHierarchy(@Req() req) {
    const tenantId = req.user.tenantId;
    
    const hierarchy = await prisma.organizationalUnit.findMany({
      where: { tenantId },
      include: {
        children: {
          include: {
            children: {
              include: {
                children: true
              }
            }
          }
        },
        userAssignments: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: {
        displayOrder: 'asc'
      }
    });
    
    return {
      success: true,
      data: hierarchy
    };
  }
  
  private validateStructure(structure: any[]) {
    // Check for circular references
    // Validate naming conventions
    // Check depth limits
    // etc.
  }
}
```

### Frontend Implementation

#### 1. Template Selection Component
```typescript
// components/TemplateSelector.tsx
import React, { useState } from 'react';

interface Template {
  id: string;
  name: string;
  description: string;
  preview: string;
  structure: any[];
}

export const TemplateSelector: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [isApplying, setIsApplying] = useState(false);
  
  const templates: Template[] = [
    {
      id: 'TECH_COMPANY',
      name: 'Technology Company',
      description: 'Perfect for software companies with engineering focus',
      preview: '3 departments, 8 teams, typical tech structure',
      structure: [
        { name: 'Engineering', teams: ['Frontend', 'Backend', 'QA'] },
        { name: 'Security', teams: ['IT Security', 'Product Security'] },
        { name: 'Operations', teams: ['Infrastructure', 'Support'] }
      ]
    },
    {
      id: 'MANUFACTURING',
      name: 'Manufacturing Company',
      description: 'Ideal for manufacturing and industrial companies',
      preview: '4 business units, 12 departments, hierarchical structure',
      structure: [
        { name: 'Production', departments: ['Manufacturing', 'Quality', 'Maintenance'] },
        { name: 'IT', departments: ['Infrastructure', 'Applications', 'Security'] }
      ]
    }
  ];
  
  const handleApplyTemplate = async () => {
    if (!selectedTemplate) {
      alert('Please select a template first');
      return;
    }
    
    setIsApplying(true);
    
    try {
      const response = await fetch('/api/organization/apply-template', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          templateId: selectedTemplate
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert('Template applied successfully! Your organization structure is ready.');
        // Redirect to user assignment page
        window.location.href = '/admin/users/assign';
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      alert('Failed to apply template. Please try again.');
      console.error('Template application error:', error);
    } finally {
      setIsApplying(false);
    }
  };
  
  return (
    <div className="template-selector">
      <h2>Choose Your Organization Structure</h2>
      <p>Select a template that matches your company type, or build a custom structure.</p>
      
      <div className="templates-grid">
        {templates.map(template => (
          <div 
            key={template.id}
            className={`template-card ${selectedTemplate === template.id ? 'selected' : ''}`}
            onClick={() => setSelectedTemplate(template.id)}
          >
            <h3>{template.name}</h3>
            <p className="description">{template.description}</p>
            <div className="preview">
              <strong>Preview:</strong> {template.preview}
            </div>
            
            {/* Mini preview of structure */}
            <div className="structure-preview">
              {template.structure.map((unit, index) => (
                <div key={index} className="preview-unit">
                  <span className="unit-name">{unit.name}</span>
                  {unit.teams && (
                    <span className="unit-count">({unit.teams.length} teams)</span>
                  )}
                  {unit.departments && (
                    <span className="unit-count">({unit.departments.length} depts)</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="actions">
        <button 
          onClick={handleApplyTemplate}
          disabled={!selectedTemplate || isApplying}
          className="apply-template-btn"
        >
          {isApplying ? 'Applying Template...' : 'Apply Selected Template'}
        </button>
        
        <button 
          onClick={() => window.location.href = '/admin/organization/custom-builder'}
          className="custom-builder-btn"
        >
          Build Custom Structure Instead
        </button>
      </div>
    </div>
  );
};
```

#### 2. User Assignment Component
```typescript
// components/UserAssignment.tsx
import React, { useState, useEffect } from 'react';

interface OrgUnit {
  id: string;
  name: string;
  type: string;
  level: number;
  children?: OrgUnit[];
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  primaryAssignment?: {
    orgUnitId: string;
    orgUnitName: string;
    role: string;
  };
}

export const UserAssignment: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [orgStructure, setOrgStructure] = useState<OrgUnit[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);
  
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    // Load users and organization structure
    const [usersResponse, orgResponse] = await Promise.all([
      fetch('/api/users', { 
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      }),
      fetch('/api/organization/hierarchy', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
    ]);
    
    const usersData = await usersResponse.json();
    const orgData = await orgResponse.json();
    
    setUsers(usersData.data);
    setOrgStructure(orgData.data);
  };
  
  const handleAssignUser = async (userId: string, orgUnitId: string, role: string) => {
    setIsAssigning(true);
    
    try {
      const response = await fetch('/api/users/assign-org', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          userId: userId,
          orgUnitId: orgUnitId,
          isPrimary: true,
          role: role
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert('User assigned successfully!');
        loadData(); // Refresh data
        setSelectedUser(null);
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      alert('Failed to assign user. Please try again.');
      console.error('User assignment error:', error);
    } finally {
      setIsAssigning(false);
    }
  };
  
  const renderOrgTree = (units: OrgUnit[], level = 0) => {
    return units.map(unit => (
      <div key={unit.id} className={`org-unit level-${level}`}>
        <div className="unit-header">
          <span className="unit-name">{unit.name}</span>
          <span className="unit-type">{unit.type}</span>
        </div>
        
        {unit.children && unit.children.length > 0 && (
          <div className="unit-children">
            {renderOrgTree(unit.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };
  
  return (
    <div className="user-assignment">
      <h2>Assign Users to Organization</h2>
      
      <div className="assignment-layout">
        {/* Users List */}
        <div className="users-panel">
          <h3>Users</h3>
          <div className="users-list">
            {users.map(user => (
              <div 
                key={user.id}
                className={`user-card ${selectedUser?.id === user.id ? 'selected' : ''}`}
                onClick={() => setSelectedUser(user)}
              >
                <div className="user-info">
                  <strong>{user.firstName} {user.lastName}</strong>
                  <span className="user-email">{user.email}</span>
                </div>
                
                {user.primaryAssignment ? (
                  <div className="current-assignment">
                    <span>Assigned to: {user.primaryAssignment.orgUnitName}</span>
                    <span>Role: {user.primaryAssignment.role}</span>
                  </div>
                ) : (
                  <div className="no-assignment">
                    <span className="unassigned">Not assigned</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Organization Structure */}
        <div className="org-panel">
          <h3>Organization Structure</h3>
          <div className="org-tree">
            {renderOrgTree(orgStructure)}
          </div>
        </div>
        
        {/* Assignment Form */}
        {selectedUser && (
          <div className="assignment-form">
            <h3>Assign: {selectedUser.firstName} {selectedUser.lastName}</h3>
            
            <div className="form-group">
              <label>Department/Team:</label>
              <select id="orgUnitSelect">
                <option value="">Select department or team...</option>
                {/* Flatten org structure for dropdown */}
                {flattenOrgStructure(orgStructure).map(unit => (
                  <option key={unit.id} value={unit.id}>
                    {'  '.repeat(unit.level)} {unit.name} ({unit.type})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Role:</label>
              <select id="roleSelect">
                <option value="Member">Member</option>
                <option value="Lead">Team Lead</option>
                <option value="Manager">Manager</option>
                <option value="Director">Director</option>
              </select>
            </div>
            
            <div className="form-actions">
              <button 
                onClick={() => {
                  const orgUnitId = (document.getElementById('orgUnitSelect') as HTMLSelectElement).value;
                  const role = (document.getElementById('roleSelect') as HTMLSelectElement).value;
                  if (orgUnitId) {
                    handleAssignUser(selectedUser.id, orgUnitId, role);
                  } else {
                    alert('Please select a department or team');
                  }
                }}
                disabled={isAssigning}
              >
                {isAssigning ? 'Assigning...' : 'Assign User'}
              </button>
              
              <button onClick={() => setSelectedUser(null)}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to flatten org structure for dropdown
const flattenOrgStructure = (units: OrgUnit[], level = 0): (OrgUnit & { level: number })[] => {
  let flattened: (OrgUnit & { level: number })[] = [];
  
  for (const unit of units) {
    flattened.push({ ...unit, level });
    
    if (unit.children && unit.children.length > 0) {
      flattened = flattened.concat(flattenOrgStructure(unit.children, level + 1));
    }
  }
  
  return flattened;
};
```

---

## 👥 User Assignment Process

### Step-by-Step Process

#### 1. Admin Views Users
```
Admin Dashboard → Users Tab
Shows: List of all users in the tenant
Status: "Assigned" or "Not Assigned"
```

#### 2. Admin Selects User
```
Click on "John Smith"
Shows: User details and current assignment (if any)
Options: "Assign" or "Reassign"
```

#### 3. Admin Chooses Assignment
```
Primary Department: [Dropdown with all departments]
Role: [Member, Lead, Manager, Director]
Additional Teams: [Multi-select for secondary assignments]
```

#### 4. System Processes Assignment
```
Database Updates:
1. Remove old primary assignment (if exists)
2. Create new primary assignment
3. Create secondary assignments (if any)
4. Update user's access permissions
```

#### 5. User Gets Access
```
Next Login: User sees features based on their assignment
Dashboard: Shows their department and role
Navigation: Only sees features allowed for their role
```

### Assignment Rules

#### Primary Assignment (Required)
- Every user MUST have exactly one primary assignment
- Determines main access permissions
- Used for reporting and hierarchy display

#### Secondary Assignments (Optional)
- User can belong to multiple teams
- Provides additional feature access
- Useful for cross-functional work

#### Example Assignments
```typescript
// John Smith's Assignments
{
  primary: {
    orgUnitId: "it-department-id",
    orgUnitName: "IT Department", 
    role: "Developer",
    isPrimary: true
  },
  secondary: [
    {
      orgUnitId: "security-team-id",
      orgUnitName: "Security Team",
      role: "Consultant",
      isPrimary: false
    },
    {
      orgUnitId: "qa-team-id", 
      orgUnitName: "QA Team",
      role: "Member",
      isPrimary: false
    }
  ]
}
```

---

## 🌍 Real-World Examples

### Example 1: Boeing (Manufacturing Company)

#### Organization Structure
```
Boeing (Tenant)
├── Commercial Aircraft (Business Unit)
│   ├── IT Department
│   │   ├── Infrastructure Team
│   │   ├── Applications Team
│   │   └── Security Team
│   ├── Engineering Department
│   │   ├── Design Team
│   │   ├── Testing Team
│   │   └── Quality Team
│   └── Finance Department
└── Defense Systems (Business Unit)
    ├── IT Department
    │   ├── Infrastructure Team
    │   └── Security Team
    ├── R&D Department
    │   ├── Research Team
    │   └── Development Team
    └── Security Department
        ├── Physical Security Team
        └── Cyber Security Team
```

#### User Assignments
```typescript
const boeingUsers = [
  {
    name: "John Smith",
    email: "john.smith@boeing.com",
    primary: "Commercial Aircraft > IT Department > Security Team",
    role: "Security Analyst",
    secondary: ["Defense Systems > Security Department > Cyber Security Team"]
  },
  {
    name: "Jane Doe", 
    email: "jane.doe@boeing.com",
    primary: "Commercial Aircraft > Engineering Department",
    role: "Engineering Manager",
    secondary: []
  },
  {
    name: "Bob Wilson",
    email: "bob.wilson@boeing.com", 
    primary: "Defense Systems > R&D Department > Development Team",
    role: "Senior Developer",
    secondary: ["Commercial Aircraft > IT Department > Applications Team"]
  }
];
```

### Example 2: Huawei (Technology Company)

#### Organization Structure
```
Huawei (Tenant)
├── Consumer Business Group
│   ├── Product Development
│   │   ├── Mobile Team
│   │   ├── Laptop Team
│   │   └── IoT Team
│   ├── Security Department
│   │   ├── Product Security Team
│   │   └── Privacy Team
│   └── Quality Assurance
│       ├── Testing Team
│       └── Compliance Team
├── Enterprise Business Group  
│   ├── IT Department
│   │   ├── Infrastructure Team
│   │   └── Applications Team
│   ├── Security Department
│   │   ├── IT Security Team
│   │   └── Network Security Team
│   └── R&D Department
│       ├── Cloud Team
│       └── AI Team
└── Carrier Business Group
    ├── Network Engineering
    │   ├── 5G Team
    │   └── Core Network Team
    ├── Security Department
    │   ├── Network Security Team
    │   └── Telecom Security Team
    └── Operations
        ├── Support Team
        └── Maintenance Team
```

### Example 3: BlickTrack (Flat Structure)

#### Organization Structure
```
BlickTrack (Tenant)
├── Engineering Department
│   ├── Frontend Team
│   ├── Backend Team
│   └── DevOps Team
├── Security Department  
│   ├── Product Security Team
│   └── IT Security Team
├── Operations Department
│   ├── Support Team
│   └── Infrastructure Team
├── Business Department
│   ├── Sales Team
│   └── Marketing Team
└── Finance Department
    └── Accounting Team
```

---

## 🧪 Testing & Validation

### Testing Checklist

#### 1. Template Application Test
```typescript
// Test Case: Apply Technology Company Template
async function testTemplateApplication() {
  const tenantId = "test-tenant-123";
  const templateId = "TECH_COMPANY";
  
  // Apply template
  const result = await templateService.applyTemplate(tenantId, templateId);
  
  // Verify structure was created
  const orgUnits = await prisma.organizationalUnit.findMany({
    where: { tenantId },
    orderBy: { level: 'asc' }
  });
  
  console.log('Created org units:', orgUnits.length);
  
  // Expected: 3 departments + 8 teams = 11 total units
  assert(orgUnits.length === 11, 'Should create 11 organizational units');
  
  // Verify hierarchy
  const departments = orgUnits.filter(u => u.level === 1);
  assert(departments.length === 3, 'Should create 3 departments');
  
  const teams = orgUnits.filter(u => u.level === 2);  
  assert(teams.length === 8, 'Should create 8 teams');
  
  console.log('✅ Template application test passed');
}
```

#### 2. User Assignment Test
```typescript
// Test Case: Assign User to Multiple Teams
async function testUserAssignment() {
  const userId = "test-user-123";
  const primaryOrgId = "it-department-id";
  const secondaryOrgIds = ["security-team-id", "qa-team-id"];
  
  // Assign primary
  await userAssignmentService.assignUserToOrg(userId, primaryOrgId, true, "Developer");
  
  // Assign secondary
  for (const orgId of secondaryOrgIds) {
    await userAssignmentService.assignUserToOrg(userId, orgId, false, "Consultant");
  }
  
  // Verify assignments
  const assignments = await prisma.userOrgAssignment.findMany({
    where: { userId },
    include: { orgUnit: true }
  });
  
  assert(assignments.length === 3, 'Should have 3 total assignments');
  
  const primary = assignments.find(a => a.isPrimary);
  assert(primary.orgUnitId === primaryOrgId, 'Primary assignment should match');
  
  const secondaries = assignments.filter(a => !a.isPrimary);
  assert(secondaries.length === 2, 'Should have 2 secondary assignments');
  
  console.log('✅ User assignment test passed');
}
```

#### 3. Hierarchy Query Test
```typescript
// Test Case: Get User Organization Path
async function testHierarchyPath() {
  const userId = "test-user-123";
  
  const path = await userAssignmentService.getUserOrganizationPath(userId);
  
  console.log('User organization path:', path.path);
  // Expected: "Boeing > IT Department > Security Team"
  
  assert(path.path.includes('Boeing'), 'Path should include tenant name');
  assert(path.path.includes('IT Department'), 'Path should include department');
  assert(path.path.includes('Security Team'), 'Path should include team');
  
  console.log('✅ Hierarchy path test passed');
}
```

### Manual Testing Steps

#### Admin Testing
1. **Login as Tenant Admin**
   - Navigate to Organization Setup
   - Verify template options are displayed
   
2. **Apply Template**
   - Select "Technology Company" template
   - Click "Apply Template"
   - Verify success message
   - Check organization structure is created
   
3. **Assign Users**
   - Navigate to User Assignment
   - Select unassigned user
   - Assign to department with role
   - Verify assignment appears in user list
   
4. **Test Hierarchy**
   - View organization chart
   - Verify parent-child relationships
   - Check user assignments are displayed

#### User Testing  
1. **Login as Regular User**
   - Verify dashboard shows assigned department
   - Check navigation reflects user's permissions
   - Test feature access based on department

2. **Multi-Assignment User**
   - Login as user with multiple team assignments
   - Verify access to features from all assigned teams
   - Check department switcher (if implemented)

### Performance Testing
```typescript
// Test large organization structures
async function testLargeOrganization() {
  const startTime = Date.now();
  
  // Create structure: 10 business units, 50 departments, 200 teams
  const largeStructure = generateLargeOrgStructure(10, 5, 4);
  
  await organizationService.createHierarchicalStructure(tenantId, largeStructure);
  
  const creationTime = Date.now() - startTime;
  console.log(`Large organization creation took: ${creationTime}ms`);
  
  // Test query performance
  const queryStart = Date.now();
  const hierarchy = await organizationService.getFullHierarchy(tenantId);
  const queryTime = Date.now() - queryStart;
  
  console.log(`Hierarchy query took: ${queryTime}ms`);
  
  // Performance assertions
  assert(creationTime < 5000, 'Creation should take less than 5 seconds');
  assert(queryTime < 1000, 'Query should take less than 1 second');
  
  console.log('✅ Performance test passed');
}
```

---

## 🚀 Deployment Checklist

### Database Setup
- [ ] Run Prisma migration to create new tables
- [ ] Add indexes for performance
- [ ] Set up foreign key constraints
- [ ] Configure backup for organizational data

### Backend Deployment
- [ ] Deploy new API endpoints
- [ ] Configure environment variables
- [ ] Test API endpoints with Postman
- [ ] Set up monitoring for organization services

### Frontend Deployment
- [ ] Build and deploy new admin interfaces
- [ ] Test template selection in staging
- [ ] Test user assignment workflows
- [ ] Configure error handling and loading states

### Data Migration (If Needed)
- [ ] Export existing department data
- [ ] Map to new organizational structure
- [ ] Import user assignments
- [ ] Validate data integrity

### Go-Live Process
1. **Phase 1**: Enable for new tenants only
2. **Phase 2**: Migrate existing tenants with simple structures  
3. **Phase 3**: Migrate complex tenants with assistance
4. **Phase 4**: Full rollout with self-service

---

## 🎉 Success Criteria

### For Admins
- [ ] Can set up organization structure in under 10 minutes
- [ ] Can assign 100+ users efficiently
- [ ] Can modify structure without breaking user assignments
- [ ] Can generate organization reports

### For Users  
- [ ] See correct department in profile
- [ ] Access features based on department assignment
- [ ] Navigate using organizational context
- [ ] Receive notifications relevant to their role

### For System
- [ ] Handle 10,000+ organizational units per tenant
- [ ] Query hierarchy in under 500ms
- [ ] Support unlimited nesting levels
- [ ] Maintain data integrity during restructuring

---

## 📞 Support & Troubleshooting

### Common Issues

#### "Template Application Failed"
**Cause**: Database constraint violation or circular reference
**Solution**: Check for duplicate department names, validate structure before applying

#### "User Assignment Not Working"  
**Cause**: Invalid org unit ID or missing permissions
**Solution**: Verify org unit exists and admin has proper permissions

#### "Hierarchy Display Broken"
**Cause**: Circular parent-child reference in database
**Solution**: Run hierarchy validation query, fix circular references

### Debug Queries
```sql
-- Find circular references
WITH RECURSIVE hierarchy_check AS (
  SELECT id, parent_id, name, 1 as level, ARRAY[id] as path
  FROM organizational_units 
  WHERE parent_id IS NULL
  
  UNION ALL
  
  SELECT o.id, o.parent_id, o.name, h.level + 1, h.path || o.id
  FROM organizational_units o
  JOIN hierarchy_check h ON o.parent_id = h.id
  WHERE NOT o.id = ANY(h.path)  -- Prevent infinite recursion
)
SELECT * FROM hierarchy_check WHERE level > 10;  -- Flag deep nesting

-- Find orphaned org units
SELECT * FROM organizational_units 
WHERE parent_id IS NOT NULL 
AND parent_id NOT IN (SELECT id FROM organizational_units);

-- Find users without primary assignment
SELECT u.* FROM users u
LEFT JOIN user_org_assignments uoa ON u.id = uoa.user_id AND uoa.is_primary = true
WHERE uoa.id IS NULL;
```

---

**🎯 This system gives you complete flexibility to handle any organizational structure while keeping the setup process simple for admins and intuitive for users. The key is starting with templates for quick setup, then allowing customization as needed.**

**Once implemented, your tenants can onboard quickly but still have the power to model their exact organizational structure when they need more complexity.**