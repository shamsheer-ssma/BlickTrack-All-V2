'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Home, 
  Users, 
  Building, 
  Settings, 
  Monitor, 
  BarChart, 
  Folder, 
  FileText, 
  Bell,
  Cog,
  Shield,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
  Mail,
  HardDrive,
  Cpu,
  Wifi
} from 'lucide-react';
import { apiService } from '@/lib/api';
// import Logo from '@/components/ui/Logo';

interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  path: string;
}

const iconMap = {
  Home,
  Users,
  Building,
  Settings,
  Monitor,
  BarChart,
  Folder,
  FileText,
  Bell,
  Cog,
  Shield,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
  Mail,
  HardDrive,
  Cpu,
  Wifi,
};

interface SidebarProps {
  onNavigation?: (path: string) => void;
}

export default function Sidebar({ onNavigation }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [navigation, setNavigation] = useState<NavigationItem[]>([]);
  const [loading, setLoading] = useState(true);

  console.log('Sidebar component rendered, navigation length:', navigation.length);

  const loadNavigationData = useCallback(async () => {
    try {
      // TEMP: Skip authentication check for testing
      // const currentUser = apiService.getCurrentUser();
      // if (!currentUser) {
      //   router.push('/login');
      //   return;
      // }

      const navigationData = await apiService.getRoleBasedNavigation();

      // If API returns empty array, use default navigation
      if (!navigationData || navigationData.length === 0) {
        const defaultNavigation: NavigationItem[] = [
          { id: 'dashboard', label: 'Dashboard', icon: 'Home', path: '/dashboard' },
          { id: 'users', label: 'Users', icon: 'Users', path: '/users' },
          { id: 'projects', label: 'Projects', icon: 'Folder', path: '/projects' },
          { id: 'threat-modeling', label: 'Threat Models', icon: 'Shield', path: '/threat-modeling' },
          { id: 'analytics', label: 'Analytics', icon: 'BarChart', path: '/analytics' },
          { id: 'settings', label: 'Settings', icon: 'Settings', path: '/settings' },
        ];
        setNavigation(defaultNavigation);
      } else {
        setNavigation(navigationData);
      }
    } catch (error) {
      console.error('Error loading navigation:', error);
      // Use default navigation on error
      const defaultNavigation: NavigationItem[] = [
        { id: 'dashboard', label: 'Dashboard', icon: 'Home', path: '/dashboard' },
        { id: 'users', label: 'Users', icon: 'Users', path: '/users' },
        { id: 'projects', label: 'Projects', icon: 'Folder', path: '/projects' },
        { id: 'threat-modeling', label: 'Threat Models', icon: 'Shield', path: '/threat-modeling' },
        { id: 'analytics', label: 'Analytics', icon: 'BarChart', path: '/analytics' },
        { id: 'settings', label: 'Settings', icon: 'Settings', path: '/settings' },
      ];
      setNavigation(defaultNavigation);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNavigationData();
  }, [loadNavigationData]);

  const handleNavigation = (path: string) => {
    if (onNavigation) {
      onNavigation(path);
    } else {
      router.push(path);
    }
  };


  if (loading) {
    return (
      <div
        className="w-64 bg-white shadow-lg h-full flex items-center justify-center"
        role="status"
        aria-label="Loading navigation"
      >
        <div
          className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
          aria-hidden="true"
        ></div>
        <span className="sr-only">Loading navigation menu...</span>
      </div>
    );
  }

  return (
    <nav
      className="w-64 bg-white shadow-xl"
      style={{ minHeight: 'calc(100vh - 88px)' }}
      aria-label="Main navigation"
      role="navigation"
    >
      <div className="flex flex-col h-full">
        {/* Navigation */}
        <ul
          className="px-4 py-4 space-y-2 flex-1 overflow-y-auto"
          role="menubar"
          aria-label="Navigation menu"
        >
          {navigation.map((item) => {
            const IconComponent = iconMap[item.icon as keyof typeof iconMap] || Home;
            const isActive = pathname === item.path;

            return (
              <li key={item.id} role="none">
                <button
                  onClick={() => handleNavigation(item.path)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleNavigation(item.path);
                    }
                  }}
                  className={`
                    w-full flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                    ${isActive
                      ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-r-4 border-blue-500 shadow-sm'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
                    }
                  `}
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={`${item.label} ${isActive ? '(current page)' : ''}`}
                  role="menuitem"
                >
                  <IconComponent className="w-5 h-5 mr-3" aria-hidden="true" />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
