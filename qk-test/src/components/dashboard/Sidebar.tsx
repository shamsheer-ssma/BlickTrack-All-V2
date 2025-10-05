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
  Menu
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


  if (loading) {
    return (
      <div className="w-64 bg-white shadow-lg h-full flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-xl" style={{ minHeight: 'calc(100vh - 88px)' }}>
        <div className="flex flex-col h-full">

          {/* Navigation */}
          <nav className="px-4 py-4 space-y-2 flex-1 overflow-y-auto">
            {navigation.map((item) => {
              const IconComponent = iconMap[item.icon as keyof typeof iconMap] || Home;
              const isActive = pathname === item.path;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.path)}
                  className={`
                    w-full flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200
                    ${isActive 
                      ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-r-4 border-blue-500 shadow-sm' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
                    }
                  `}
                >
                  <IconComponent className="w-5 h-5 mr-3" />
                  {item.label}
                </button>
              );
            })}
          </nav>

        </div>
      </div>
    </>
  );
}
