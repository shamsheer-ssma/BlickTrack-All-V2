'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  Wifi
} from 'lucide-react';
import { apiService } from '@/lib/api';
import { BLICKTRACK_THEME } from '@/lib/theme';
import Logo from '../ui/Logo';

interface DashboardStats {
  // Platform Admin Stats
  totalTenants?: number;
  totalUsers?: number;
  activeUsers?: number;
  totalProjects?: number;
  activeProjects?: number;
  completedProjects?: number;
  overdueProjects?: number;
  securityAlerts?: number;
  systemUptime?: string;
  dataProcessed?: string;
  
  // Tenant Admin Stats
  tenantUptime?: string;
  
  // User Stats
  myProjects?: number;
  notifications?: number;
  tasksCompleted?: number;
  tasksPending?: number;
}

interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  path: string;
}

interface UserPermissions {
  canViewDashboard: boolean;
  canViewProjects: boolean;
  canViewReports: boolean;
  canManagePlatform?: boolean;
  canManageTenants?: boolean;
  canManageAllUsers?: boolean;
  canViewSystemHealth?: boolean;
  canViewAnalytics?: boolean;
  canManageSystemSettings?: boolean;
  canManageTenant?: boolean;
  canManageTenantUsers?: boolean;
  canViewTenantAnalytics?: boolean;
  canManageTenantSettings?: boolean;
  canManageProfile?: boolean;
  canViewNotifications?: boolean;
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

export default function UnifiedDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>('');
  const [stats, setStats] = useState<DashboardStats>({});
  const [navigation, setNavigation] = useState<NavigationItem[]>([]);
  const [permissions, setPermissions] = useState<UserPermissions>({} as UserPermissions);
  const [activity, setActivity] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [systemHealth, setSystemHealth] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get current user
      const currentUser = apiService.getCurrentUser();
      if (!currentUser) {
        router.push('/login');
        return;
      }

      setUser(currentUser);
      setUserRole(currentUser.role || 'USER');

      // Load all dashboard data in parallel
      const [
        statsData,
        navigationData,
        permissionsData,
        activityData,
        projectsData,
        healthData,
        profileData,
      ] = await Promise.all([
        apiService.getRoleBasedStats(),
        apiService.getRoleBasedNavigation(),
        apiService.getUserPermissions(),
        apiService.getRoleBasedActivity(10),
        apiService.getRoleBasedProjects(5),
        apiService.getRoleBasedSystemHealth(),
        apiService.getUserProfile(),
      ]);

      setStats(statsData);
      setNavigation(navigationData);
      setPermissions(permissionsData);
      setActivity(activityData);
      setProjects(projectsData);
      setSystemHealth(healthData);
      setUserProfile(profileData);

    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'PLATFORM_ADMIN': return 'Platform Administrator';
      case 'TENANT_ADMIN': return 'Tenant Administrator';
      case 'USER': return 'User';
      default: return 'User';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'PLATFORM_ADMIN': return 'text-red-600';
      case 'TENANT_ADMIN': return 'text-blue-600';
      case 'USER': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const renderStatsCards = () => {
    const cards = [];

    // Platform Admin Cards
    if (userRole === 'PLATFORM_ADMIN') {
      cards.push(
        { title: 'Total Tenants', value: stats.totalTenants || 0, icon: Building, color: 'blue' },
        { title: 'Total Users', value: stats.totalUsers || 0, icon: Users, color: 'green' },
        { title: 'Active Users', value: stats.activeUsers || 0, icon: Activity, color: 'emerald' },
        { title: 'Total Projects', value: stats.totalProjects || 0, icon: Folder, color: 'purple' },
        { title: 'Active Projects', value: stats.activeProjects || 0, icon: TrendingUp, color: 'orange' },
        { title: 'Security Alerts', value: stats.securityAlerts || 0, icon: AlertTriangle, color: 'red' },
      );
    }
    // Tenant Admin Cards
    else if (userRole === 'TENANT_ADMIN') {
      cards.push(
        { title: 'Total Users', value: stats.totalUsers || 0, icon: Users, color: 'blue' },
        { title: 'Active Users', value: stats.activeUsers || 0, icon: Activity, color: 'green' },
        { title: 'Total Projects', value: stats.totalProjects || 0, icon: Folder, color: 'purple' },
        { title: 'Active Projects', value: stats.activeProjects || 0, icon: TrendingUp, color: 'orange' },
        { title: 'Completed Projects', value: stats.completedProjects || 0, icon: CheckCircle, color: 'emerald' },
        { title: 'Security Alerts', value: stats.securityAlerts || 0, icon: AlertTriangle, color: 'red' },
      );
    }
    // User Cards
    else {
      cards.push(
        { title: 'My Projects', value: stats.myProjects || 0, icon: Folder, color: 'blue' },
        { title: 'Active Projects', value: stats.activeProjects || 0, icon: TrendingUp, color: 'orange' },
        { title: 'Completed Projects', value: stats.completedProjects || 0, icon: CheckCircle, color: 'emerald' },
        { title: 'Notifications', value: stats.notifications || 0, icon: Bell, color: 'purple' },
        { title: 'Tasks Completed', value: stats.tasksCompleted || 0, icon: CheckCircle, color: 'green' },
        { title: 'Tasks Pending', value: stats.tasksPending || 0, icon: Clock, color: 'yellow' },
      );
    }

    return cards.map((card, index) => {
      const IconComponent = card.icon;
      return (
        <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
              <p className="text-3xl font-bold text-gray-900">{card.value}</p>
            </div>
            <div className={`p-3 rounded-lg bg-${card.color}-100`}>
              <IconComponent className={`w-6 h-6 text-${card.color}-600`} />
            </div>
          </div>
        </div>
      );
    });
  };

  const renderSystemHealth = () => {
    if (!permissions.canViewSystemHealth && !permissions.canViewTenantAnalytics) {
      return null;
    }

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Monitor className="w-5 h-5 mr-2" />
          System Health
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{systemHealth.uptime || '99.9%'}</div>
            <div className="text-sm text-gray-600">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{systemHealth.responseTime || '120ms'}</div>
            <div className="text-sm text-gray-600">Response Time</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{systemHealth.storageUsage || '45%'}</div>
            <div className="text-sm text-gray-600">Storage Usage</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{systemHealth.memoryUsage || '62%'}</div>
            <div className="text-sm text-gray-600">Memory Usage</div>
          </div>
        </div>
      </div>
    );
  };

  const renderNavigation = () => {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Navigation</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {navigation.map((item) => {
            const IconComponent = iconMap[item.icon as keyof typeof iconMap] || Home;
            return (
              <button
                key={item.id}
                onClick={() => router.push(item.path)}
                className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <IconComponent className="w-5 h-5 mr-3 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadDashboardData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      {/* Header - Full Width */}
      <div 
        className="text-white shadow-lg w-full"
        style={{
          background: 'linear-gradient(135deg, #073c82 0%, #00d6bc 100%)',
        }}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            <div className="flex items-center space-x-4">
              <Logo 
                size="sm" 
                showTagline={false} 
                className="cursor-pointer" 
                variant="light"
                onClick={() => router.push('/')}
              />
            </div>

            {/* Center - Search Box */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search resources, services, and docs..."
                  className="block w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all duration-200"
                  style={{ backdropFilter: 'blur(10px)' }}
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* User Profile Info - Compact */}
              {userProfile && (
                <div className="flex items-center space-x-3 bg-white/10 rounded-lg px-3 py-2 border border-white/20">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-white font-semibold text-xs">
                      {userProfile.firstName} {userProfile.lastName}
                    </div>
                    <div className="text-white/70 text-xs">
                      {userProfile.tenantName}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Action Buttons - Compact */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => router.push('/profile')}
                  className="flex items-center space-x-1 text-white/90 hover:text-white hover:bg-white/10 px-2 py-1 rounded transition-all duration-200"
                >
                  <User className="w-4 h-4" />
                  <span className="text-xs font-medium">Profile</span>
                </button>
                {permissions.canViewNotifications && (
                  <button
                    onClick={() => router.push('/notifications')}
                    className="flex items-center space-x-1 text-white/90 hover:text-white hover:bg-white/10 px-2 py-1 rounded transition-all duration-200"
                  >
                    <Bell className="w-4 h-4" />
                    {stats.notifications && stats.notifications > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 font-bold ml-1">
                        {stats.notifications}
                      </span>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-8 ml-64">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {renderStatsCards()}
        </div>

        {/* System Health & Navigation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {renderSystemHealth()}
          {renderNavigation()}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Recent Activity
          </h3>
          <div className="space-y-3">
            {activity.length > 0 ? (
              activity.map((item, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{item.action || item.eventType}</p>
                    <p className="text-xs text-gray-500">
                      {item.user?.firstName} {item.user?.lastName} • {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No recent activity</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
