'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
import { BLICKTRACK_THEME } from '@/lib/theme';
import Logo from '../ui/Logo';
import BreadcrumbNavigation from '../ui/BreadcrumbNavigation';
import Sidebar from './Sidebar';

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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.search-container')) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Search functionality
  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    try {
      // Search through different data sources
      const results = [];
      
      // Search in navigation items
      const navMatches = navigation.filter(item => 
        item.label.toLowerCase().includes(query.toLowerCase()) ||
        item.path.toLowerCase().includes(query.toLowerCase())
      );
      
      // Search in projects
      const projectMatches = projects.filter(project => 
        project.name?.toLowerCase().includes(query.toLowerCase()) ||
        project.description?.toLowerCase().includes(query.toLowerCase())
      );
      
      // Search in activity
      const activityMatches = activity.filter(item => 
        item.action?.toLowerCase().includes(query.toLowerCase()) ||
        item.eventType?.toLowerCase().includes(query.toLowerCase())
      );

      // Combine results
      results.push(
        ...navMatches.map(item => ({ type: 'navigation', ...item })),
        ...projectMatches.map(project => ({ type: 'project', ...project })),
        ...activityMatches.map(item => ({ type: 'activity', ...item }))
      );

      setSearchResults(results);
      setShowSearchResults(true);
    } catch (error) {
      console.error('Search error:', error);
    }
  }, [navigation, projects, activity]);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    handleSearch(query);
  };

  const handleSearchResultClick = (result: any) => {
    if (result.type === 'navigation') {
      router.push(result.path);
    } else if (result.type === 'project') {
      router.push(`/projects/${result.id}`);
    }
    setShowSearchResults(false);
    setSearchQuery('');
  };

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
    <div className="min-h-screen bg-gray-50" style={{ minHeight: '100vh' }}>
      {/* Header - Full Width */}
      <div 
        className="text-white shadow-lg w-full"
        style={{
          background: 'linear-gradient(135deg, #073c82 0%, #00d6bc 100%)',
        }}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8">
          {/* Top Row - Logo, Breadcrumb, and User Actions */}
          <div className="flex justify-between items-center py-1">
            <div className="flex items-center space-x-4">
              {/* Hamburger Menu Button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-white/90 hover:text-white hover:bg-white/10 p-2 rounded transition-all duration-200"
                title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
              >
                <Menu className="w-5 h-5" />
              </button>
              
              <Logo 
                size="sm" 
                showTagline={false} 
                className="cursor-pointer" 
                variant="light"
                onClick={() => router.push('/')}
              />
              
              {/* 2 Column Gap */}
              <div className="flex space-x-4">
                <div className="w-4"></div>
                <div className="w-4"></div>
              </div>
              
              {/* Breadcrumb Navigation - Moved to same line */}
              <BreadcrumbNavigation 
                className="text-white/80 text-xs"
                showHome={true}
              />
            </div>

            {/* Center - Search Box */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative search-container">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search resources, services, and docs..."
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  onFocus={() => searchQuery && setShowSearchResults(true)}
                  className="block w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all duration-200"
                  style={{ backdropFilter: 'blur(10px)' }}
                />
                
                {/* Search Results Dropdown */}
                {showSearchResults && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-50">
                    <div className="p-2">
                      {searchResults.length > 0 ? (
                        <>
                          <div className="text-xs text-gray-500 font-medium mb-2 px-2">
                            Search Results ({searchResults.length})
                          </div>
                          {searchResults.map((result, index) => (
                            <div
                              key={index}
                              onClick={() => handleSearchResultClick(result)}
                              className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer transition-colors"
                            >
                              <div className="flex-shrink-0">
                                {result.type === 'navigation' && <Home className="w-4 h-4 text-blue-500" />}
                                {result.type === 'project' && <Folder className="w-4 h-4 text-green-500" />}
                                {result.type === 'activity' && <Activity className="w-4 h-4 text-orange-500" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-gray-900 truncate">
                                  {result.label || result.name || result.action}
                                </div>
                                <div className="text-xs text-gray-500 truncate">
                                  {result.type === 'navigation' && result.path}
                                  {result.type === 'project' && result.description}
                                  {result.type === 'activity' && result.eventType}
                                </div>
                              </div>
                              <div className="text-xs text-gray-400 capitalize">
                                {result.type}
                              </div>
                            </div>
                          ))}
                        </>
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          <div className="text-sm">No results found for "{searchQuery}"</div>
                          <div className="text-xs mt-1">Try searching for navigation items, projects, or activities</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications - Next to user details */}
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
              
              {/* User Profile Info */}
              {userProfile && (
                <div className="flex items-center space-x-3 bg-white/10 rounded-lg px-3 py-2 border border-white/20">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Shield className="w-4 h-4 text-white" />
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
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div 
        className={`px-4 sm:px-6 lg:px-8 py-8 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}
        style={{
          marginLeft: sidebarOpen ? '16rem' : '0',
          transition: 'margin-left 0.3s ease-in-out'
        }}
      >
        {/* 4-Column Grid - Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers || 0}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12% from last month
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Active Projects */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Projects</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeProjects || 0}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +8% from last month
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <Folder className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* Security Alerts */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Security Alerts</p>
                <p className="text-2xl font-bold text-gray-900">{stats.securityAlerts || 0}</p>
                <p className="text-xs text-red-600 flex items-center mt-1">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {stats.securityAlerts > 0 ? 'Needs attention' : 'All clear'}
                </p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          {/* System Uptime */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">System Uptime</p>
                <p className="text-2xl font-bold text-gray-900">{stats.systemUptime || '99.9%'}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  All systems operational
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <Monitor className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {renderStatsCards()}
        </div>

        {/* System Health & Navigation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {renderSystemHealth()}
          {renderNavigation()}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => router.push('/threat-modeling/create')}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4 text-left">
                <p className="text-sm font-medium text-gray-900">Create Threat Model</p>
                <p className="text-xs text-gray-500">Start a new security assessment</p>
              </div>
            </button>
            <button 
              onClick={() => router.push('/threat-modeling')}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="p-2 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4 text-left">
                <p className="text-sm font-medium text-gray-900">View Threat Models</p>
                <p className="text-xs text-gray-500">Manage existing models</p>
              </div>
            </button>
            <button 
              onClick={() => router.push('/projects')}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="p-2 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
                <Folder className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4 text-left">
                <p className="text-sm font-medium text-gray-900">View Projects</p>
                <p className="text-xs text-gray-500">Manage security projects</p>
              </div>
            </button>
          </div>
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
      
      
      {/* Main Sidebar */}
      <div 
        className="absolute left-0 w-64 z-50 transition-all duration-300 rounded-r-xl flex flex-col"
        style={{ 
          top: '80px', // Directly below header
          height: 'calc(100vh - 80px)', // Full viewport height minus header
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease-in-out',
          backgroundColor: 'white',
          boxShadow: '2px 0 4px rgba(0,0,0,0.1)'
        }}
      >
        <div className="flex-1">
          <Sidebar />
        </div>
        
        {/* Status Indicator - At bottom of main sidebar */}
        <div className="bg-gray-50 p-3">
          <div className="flex items-center justify-center">
            <div className={`w-2 h-2 rounded-full mr-2 ${loading ? 'bg-yellow-500' : error ? 'bg-red-500' : 'bg-green-500'}`}></div>
            <span className={`text-xs font-medium ${loading ? 'text-yellow-700' : error ? 'text-red-700' : 'text-green-700'}`}>
              {loading ? 'Connecting...' : error ? 'System Offline' : 'System Online'}
            </span>
          </div>
        </div>
      </div>

      {/* Secondary Sidebar - Below main sidebar for next page */}
      <div 
        className="absolute left-0 w-64 z-40 transition-all duration-300 rounded-r-xl"
        style={{ 
          top: 'calc(100vh - 80px + 20px)', // Below the main sidebar with gap
          height: '200px', // Fixed height for secondary sidebar
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease-in-out',
          backgroundColor: '#f8fafc', // Light gray background for division
          boxShadow: '2px 0 4px rgba(0,0,0,0.1)',
          borderTop: '2px solid #e2e8f0' // Division line
        }}
      >
        {/* Empty secondary sidebar - can be used for additional content later */}
      </div>
    </div>
  );
}
