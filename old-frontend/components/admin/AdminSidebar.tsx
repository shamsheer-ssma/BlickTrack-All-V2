'use client';

import { useState } from 'react';
import {
  Users,
  Building2,
  Key,
  Settings,
  Activity,
  BarChart3,
  FileText,
  UserCheck,
  UserX,
  Crown,
  Database,
  Layers
} from 'lucide-react';

export type AdminView = 
  | 'overview'
  | 'users'
  | 'user-roles'
  | 'permissions'
  | 'tenants'
  | 'features'
  | 'security'
  | 'audit-logs'
  | 'reports'
  | 'settings'
  | 'help';

interface AdminSidebarProps {
  activeView: AdminView;
  onViewChange: (view: AdminView) => void;
}

interface SidebarItem {
  id: AdminView;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  children?: SidebarItem[];
}

const sidebarItems: SidebarItem[] = [
  {
    id: 'overview',
    label: 'Overview',
    icon: BarChart3
  },
  {
    id: 'users',
    label: 'User Management',
    icon: Users,
    children: [
      { id: 'users', label: 'All Users', icon: Users },
      { id: 'user-roles', label: 'User Roles', icon: UserCheck },
      { id: 'permissions', label: 'Permissions', icon: Key }
    ]
  },
  {
    id: 'tenants',
    label: 'Tenant Management',
    icon: Building2
  },
  {
    id: 'features',
    label: 'Features',
    icon: Layers
  },
  {
    id: 'reports',
    label: 'Reports & Analytics',
    icon: Activity
  },
  {
    id: 'settings',
    label: 'System Settings',
    icon: Settings
  }
];

export default function AdminSidebar({ activeView, onViewChange }: AdminSidebarProps) {
  const [expandedItems, setExpandedItems] = useState<Set<AdminView>>(
    new Set<AdminView>(['users', 'tenants', 'security']) // Default expanded sections
  );

  const toggleExpanded = (itemId: AdminView) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const renderSidebarItem = (item: SidebarItem, level: number = 0) => {
    const isActive = activeView === item.id;
    const isExpanded = expandedItems.has(item.id);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.id}>
        <button
          onClick={() => {
            if (hasChildren) {
              toggleExpanded(item.id);
            } else {
              onViewChange(item.id);
            }
          }}
          className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
            isActive
              ? 'bg-blue-100 text-blue-700 border border-blue-200'
              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
          } ${level > 0 ? 'ml-4' : ''}`}
        >
          <div className="flex items-center space-x-3">
            <item.icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
            <span>{item.label}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            {item.badge && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                {item.badge}
              </span>
            )}
            {hasChildren && (
              <div className={`transform transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            )}
          </div>
        </button>

        {/* Render children if expanded */}
        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children!.map((child) => renderSidebarItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
            <Crown className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Platform Admin</h2>
            <p className="text-xs text-gray-500">Administration Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {sidebarItems.map((item) => renderSidebarItem(item))}
      </nav>

    </div>
  );
}
