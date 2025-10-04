'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard,
  Users,
  Building2,
  Shield,
  Activity,
  Settings,
  FileText,
  BarChart3,
  ChevronRight,
  ChevronDown,
  Layers
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
  children?: NavItem[];
}

const navigation: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    name: 'User Management',
    href: '/users',
    icon: <Users className="w-5 h-5" />,
    children: [
      { name: 'All Users', href: '/users', icon: <Users className="w-4 h-4" /> },
      { name: 'User Roles', href: '/users/roles', icon: <Shield className="w-4 h-4" /> },
      { name: 'Permissions', href: '/users/permissions', icon: <Settings className="w-4 h-4" /> },
    ]
  },
  {
    name: 'Tenant Management',
    href: '/tenants',
    icon: <Building2 className="w-5 h-5" />,
    children: [
      { name: 'All Tenants', href: '/tenants', icon: <Building2 className="w-4 h-4" /> },
      { name: 'Tenant Settings', href: '/tenants/settings', icon: <Settings className="w-4 h-4" /> },
      { name: 'Billing', href: '/tenants/billing', icon: <FileText className="w-4 h-4" /> },
    ]
  },
  {
    name: 'Features',
    href: '/features/dashboard/platform-admin?view=features',
    icon: <Layers className="w-5 h-5" />,
    children: [
      { name: 'All Features', href: '/features/dashboard/platform-admin?view=features', icon: <Layers className="w-4 h-4" /> },
      { name: 'Feature Categories', href: '/features/dashboard/platform-admin?view=features', icon: <Shield className="w-4 h-4" /> },
      { name: 'Feature Access', href: '/features/dashboard/platform-admin?view=features', icon: <Settings className="w-4 h-4" /> },
    ]
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: <BarChart3 className="w-5 h-5" />,
  },
  {
    name: 'System',
    href: '/system',
    icon: <Activity className="w-5 h-5" />,
    badge: '3',
    children: [
      { name: 'System Health', href: '/system/health', icon: <Activity className="w-4 h-4" /> },
      { name: 'Logs', href: '/system/logs', icon: <FileText className="w-4 h-4" /> },
      { name: 'Settings', href: '/system/settings', icon: <Settings className="w-4 h-4" /> },
    ]
  },
];

export default function Sidebar() {
  const [expandedItems, setExpandedItems] = useState<string[]>(['Dashboard']);
  const pathname = usePathname();

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(item => item !== itemName)
        : [...prev, itemName]
    );
  };

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  const renderNavItem = (item: NavItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.name);
    const isItemActive = isActive(item.href);

    return (
      <div key={item.name}>
        <div
          className={`flex items-center justify-between px-3 py-2 rounded-lg transition-colors cursor-pointer ${
            level > 0 ? 'ml-4' : ''
          } ${
            isItemActive 
              ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
              : 'text-slate-700 hover:bg-slate-100'
          }`}
          onClick={() => {
            if (hasChildren) {
              toggleExpanded(item.name);
            }
          }}
        >
          <Link 
            href={item.href} 
            className="flex items-center space-x-3 flex-1"
            onClick={(e) => {
              if (hasChildren) {
                e.preventDefault();
              }
            }}
          >
            <div className={`${isItemActive ? 'text-blue-600' : 'text-slate-500'}`}>
              {item.icon}
            </div>
            <span className="font-medium">{item.name}</span>
            {item.badge && (
              <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </Link>
          
          {hasChildren && (
            <div className={`transform transition-transform ${
              isExpanded ? 'rotate-90' : ''
            }`}>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </div>
          )}
        </div>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children!.map(child => renderNavItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-slate-200 overflow-y-auto z-30 hidden lg:block">
      <div className="p-4">
        <nav className="space-y-2">
          {navigation.map(item => renderNavItem(item))}
        </nav>
      </div>
    </div>
  );
}


