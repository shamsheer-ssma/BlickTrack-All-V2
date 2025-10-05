'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path: string;
  icon?: string;
}

interface BreadcrumbNavigationProps {
  className?: string;
  showHome?: boolean;
  customPath?: BreadcrumbItem[];
}

export default function BreadcrumbNavigation({ 
  className = '', 
  showHome = true,
  customPath 
}: BreadcrumbNavigationProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Path segment to user-friendly label mapping
  const pathLabels: { [key: string]: string } = {
    'dashboard': 'Dashboard',
    'threat-modeling': 'Threat Modeling',
    'create': 'Create',
    'edit': 'Edit',
    'view': 'View',
    'settings': 'Settings',
    'users': 'Users',
    'projects': 'Projects',
    'reports': 'Reports',
    'analytics': 'Analytics',
    'compliance': 'Compliance',
    'audit': 'Audit',
    'admin': 'Admin',
    'profile': 'Profile',
    'sbom': 'SBOM',
    'vulnerability': 'Vulnerability',
    'risk': 'Risk',
    'assessment': 'Assessment',
    'scan': 'Scan',
    'report': 'Report',
    'template': 'Template',
    'workflow': 'Workflow',
    'integration': 'Integration',
    'api': 'API',
    'documentation': 'Documentation',
    'help': 'Help',
    'support': 'Support'
  };

  // Icon mapping for breadcrumb items
  const iconMap: { [key: string]: string } = {
    'dashboard': 'Home',
    'threat-modeling': 'Shield',
    'create': 'Plus',
    'edit': 'Edit',
    'view': 'Eye',
    'settings': 'Settings',
    'users': 'Users',
    'projects': 'Folder',
    'reports': 'FileText',
    'analytics': 'BarChart',
    'compliance': 'CheckCircle',
    'audit': 'Clipboard',
    'admin': 'Cog',
    'profile': 'User'
  };

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (customPath) return customPath;

    const pathSegments = pathname.split('/').filter(segment => segment);
    const breadcrumbs: BreadcrumbItem[] = [];

    let currentPath = '';
    pathSegments.forEach((segment) => {
      currentPath += `/${segment}`;
      const label = pathLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
      const icon = iconMap[segment];
      
      breadcrumbs.push({
        label,
        path: currentPath,
        icon
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  const handleBreadcrumbClick = (path: string) => {
    router.push(path);
  };

  if (breadcrumbs.length === 0) return null;

  return (
    <nav className={`flex items-center space-x-1 text-xs ${className}`} aria-label="Breadcrumb">
      {showHome && (
        <>
          <button
            onClick={() => handleBreadcrumbClick('/dashboard')}
            className="flex items-center text-white/60 hover:text-white transition-colors"
            title="Dashboard"
          >
            <Home className="w-3 h-3" />
          </button>
          {breadcrumbs.length > 0 && (
            <ChevronRight className="w-3 h-3 text-white/40" />
          )}
        </>
      )}
      
      {breadcrumbs.map((item, index) => (
        <React.Fragment key={index}>
          <button
            onClick={() => handleBreadcrumbClick(item.path)}
            className="text-white/80 hover:text-white transition-colors cursor-pointer flex items-center space-x-1"
            title={item.label}
          >
            <span>{item.label}</span>
          </button>
          {index < breadcrumbs.length - 1 && (
            <ChevronRight className="w-3 h-3 text-white/40" />
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
