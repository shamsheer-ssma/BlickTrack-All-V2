'use client';

import React, { useState, useEffect } from 'react';
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
  User, 
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
  Menu,
  X
} from 'lucide-react';
import { apiService } from '@/lib/api';
import Logo from '@/components/ui/Logo';

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
  User,
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

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [navigation, setNavigation] = useState<NavigationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNavigationData();
  }, []);

  const loadNavigationData = async () => {
    try {
      const currentUser = apiService.getCurrentUser();
      if (!currentUser) {
        router.push('/login');
        return;
      }

      const navigationData = await apiService.getRoleBasedNavigation();
      setNavigation(navigationData);
    } catch (error) {
      console.error('Error loading navigation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="w-64 bg-white shadow-lg h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-xl h-screen border-r border-gray-200">
        <div className="flex flex-col h-full">

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const IconComponent = iconMap[item.icon as keyof typeof iconMap] || Home;
              const isActive = pathname === item.path;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.path)}
                  className={`
                    w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                    ${isActive 
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <IconComponent className="w-5 h-5 mr-3" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Footer Actions */}
          <div className="px-4 py-4 border-t border-gray-200 space-y-2">
            <button
              onClick={() => handleNavigation('/profile')}
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50"
            >
              <User className="w-5 h-5 mr-3" />
              Profile
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50"
            >
              <X className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
