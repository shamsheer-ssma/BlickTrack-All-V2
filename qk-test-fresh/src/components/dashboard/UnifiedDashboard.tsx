
'use client';

import React, { useEffect, useCallback, useMemo } from 'react';
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
  RefreshCw,
  User,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { apiService } from '@/lib/api';
// import { BLICKTRACK_THEME } from '@/lib/theme';
import Logo from '../ui/Logo';
import BreadcrumbNavigation from '../ui/BreadcrumbNavigation';
import Sidebar from './Sidebar';
import UsersView from './UsersView';
import AuditLogsView from './AuditLogsView';
import SignInLogsView from './SignInLogsView';
import TenantsView from './TenantsView';
import PlatformFeaturesView from './PlatformFeaturesView';
import {
  UserProfile,
  SearchResult
} from '@/types/dashboard';

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

import { useDashboardState } from '@/hooks/useDashboardState';
// PREVIOUS STATE MANAGEMENT: 20+ individual useState hooks
// - Difficult to track state changes
// - Prone to bugs with interconnected state
// - Hard to debug and test
//
// NEW STATE MANAGEMENT: useDashboardState custom hook with useReducer
// - Single source of truth for all dashboard state
// - Predictable state updates through actions
// - Easier debugging with centralized state logic
// - Better performance with batched updates
// - Type-safe action dispatching
// ============================================================================

export default React.memo(function UnifiedDashboard() {
  const router = useRouter();

  // ============================================================================
  // STATE MANAGEMENT - REFACTORED
  // ============================================================================
  // WHY: Replaced 20+ useState hooks with a single custom hook
  // BENEFITS:
  // - All state changes go through predictable actions
  // - Easier to debug (can log all state changes)
  // - Prevents stale closure bugs
  // - Better TypeScript support
  // - Centralized business logic
  // ============================================================================
  const {
    // State slices
    userProfile,
    userRole,
    stats,
    navigation,
    permissions,
    activity,
    projects,
    systemHealth,
    loading,
    error,
    sidebarOpen,
    currentView,
    lastUpdated,
    isRefreshing,
    searchQuery,
    searchResults,
    showSearchResults,
    notifications,
    showNotifications,
    showUserMenu,
    userMenuTimeout,

    // Actions
    setUserRole,
    setPermissions,
    setDashboardData,
    setLoading,
    setLoadingState,
    setSidebarOpen,
    setCurrentView,
    setLastUpdated,
    setRefreshing,
    setSearchQuery,
    setSearchResults,
    setShowSearchResults,
    addNotification,
    markNotificationRead,
    clearNotifications,
    setShowNotifications,
    setShowUserMenu,
    setUserMenuTimeout,
  } = useDashboardState();

  useEffect(() => {
    loadDashboardData();
    
    // Removed auto-refresh - users can manually refresh if needed
    // This prevents annoying automatic refreshes every 30 seconds

    // Set up mock notifications (keeping this for demo purposes)
    const notificationInterval = setInterval(() => {
      addMockNotification();
    }, 45000); // Add notification every 45 seconds

    return () => {
      clearInterval(notificationInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Close search results, notifications, and user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.search-container')) {
        setShowSearchResults(false);
      }
      if (!target.closest('.notification-container')) {
        setShowNotifications(false);
      }
      if (!target.closest('.user-menu-container')) {
        if (userMenuTimeout) {
          clearTimeout(userMenuTimeout);
          setUserMenuTimeout(null);
        }
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setShowNotifications, setShowSearchResults, setShowUserMenu, setUserMenuTimeout, userMenuTimeout]);

  // Cleanup user menu timeout on unmount
  useEffect(() => {
    return () => {
      if (userMenuTimeout) {
        clearTimeout(userMenuTimeout);
      }
    };
  }, [userMenuTimeout]);

  // Search functionality
  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    try {
      // Search through different data sources
      const navMatches: SearchResult[] = navigation
        .filter(item =>
          item.label.toLowerCase().includes(query.toLowerCase()) ||
          item.path.toLowerCase().includes(query.toLowerCase())
        )
        .map(item => ({ type: 'navigation', ...item }));

      const projectMatches: SearchResult[] = projects
        .filter(project =>
          project.name?.toLowerCase().includes(query.toLowerCase()) ||
          project.description?.toLowerCase().includes(query.toLowerCase())
        )
        .map(project => ({ type: 'project', ...project }));

      const activityMatches: SearchResult[] = activity
        .filter(item =>
          item.action?.toLowerCase().includes(query.toLowerCase()) ||
          item.eventType?.toLowerCase().includes(query.toLowerCase())
        )
        .map(item => ({ type: 'activity', ...item }));

      const results: SearchResult[] = [
        ...navMatches,
        ...projectMatches,
        ...activityMatches,
      ];

      setSearchResults(results);
      setShowSearchResults(true);
    } catch (error) {
      console.error('Search error:', error);
    }
  }, [navigation, projects, activity, setSearchResults, setShowSearchResults]);

  const handleSearchInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    handleSearch(query);
  }, [handleSearch, setSearchQuery]);

  const handleSearchResultClick = useCallback((result: SearchResult) => {
    if (result.type === 'navigation') {
      router.push(result.path);
    } else if (result.type === 'project') {
      router.push(`/projects/${result.id}`);
    }
    setShowSearchResults(false);
    setSearchQuery('');
  }, [router, setShowSearchResults, setSearchQuery]);

  const handleNavigation = useCallback((path: string) => {
    // Handle different navigation paths with smooth transitions
    switch (path) {
      case '/dashboard':
        setCurrentView('dashboard');
        break;
      case '/platform-features':
        setCurrentView('platform-features');
        break;
      case '/tenants':
        setCurrentView('tenants');
        break;
      case '/users':
        setCurrentView('users');
        break;
      case '/audit-logs':
        setCurrentView('audit-logs');
        break;
      case '/sign-in-logs':
        setCurrentView('sign-in-logs');
        break;
      case '/system':
        setCurrentView('system');
        break;
      case '/analytics':
        setCurrentView('analytics');
        break;
      default:
        // For other paths, use router navigation
        router.push(path);
        break;
    }
  }, [setCurrentView, router]);

  // ============================================================================
  // REFRESH DASHBOARD DATA FUNCTION - UPDATED FOR NEW STATE MANAGEMENT
  // ============================================================================
  // WHY: Updated to use setRefreshing instead of setIsRefreshing
  // BENEFITS: Consistent action naming, better state management
  // ============================================================================
  const refreshDashboardData = useCallback(async () => {
    if (isRefreshing) return;

    setRefreshing(true);
    try {
      // Call loadDashboardData directly without dependency
      await loadDashboardData();
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error refreshing dashboard:', error);
    } finally {
      setRefreshing(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRefreshing, setRefreshing, setLastUpdated]);  // Logout function
  // ============================================================================
  // LOGOUT FUNCTION - UPDATED FOR NEW STATE MANAGEMENT
  // ============================================================================
  // WHY: Using setDashboardData for bulk state reset instead of individual setters
  // BENEFITS: Cleaner code, consistent state management, better performance
  // ============================================================================
  const handleLogout = useCallback(async () => {
    try {
      setLoading(true);

      // Call logout API to revoke refresh token
      await apiService.logout();

      // ============================================================================
      // BULK STATE RESET - IMPROVED MAINTAINABILITY
      // ============================================================================
      // WHY: Single action resets all related state instead of multiple setters
      // BENEFITS: Easier to maintain, less prone to missing state resets
      // ============================================================================
      setDashboardData({
        userProfile: null,
        activity: [],
        projects: [],
      });
      setPermissions({});
      clearNotifications();

      // Redirect to login
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout on client side even if API call fails
      setDashboardData({
        userProfile: null,
        activity: [],
        projects: [],
      });
      setPermissions({});
      clearNotifications();
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [router, setLoading, setDashboardData, setPermissions, clearNotifications]);

  // ============================================================================
  // NOTIFICATION FUNCTIONS - UPDATED FOR NEW STATE MANAGEMENT
  // ============================================================================
  // WHY: Replaced direct state mutations with action dispatchers
  // BENEFITS: Predictable state updates, easier debugging, centralized logic
  // ============================================================================

  // Add mock notification
  const addMockNotification = useCallback(() => {
    // This is dummy data, need to fetch from DB
    const notificationTypes = [
      { type: 'success', message: 'New user registered', icon: 'Users' },
      { type: 'info', message: 'System backup completed', icon: 'Database' },
      { type: 'warning', message: 'High CPU usage detected', icon: 'Cpu' },
      { type: 'error', message: 'Security alert triggered', icon: 'Shield' },
      { type: 'info', message: 'Project status updated', icon: 'Folder' }
    ];

    const randomNotification = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
    const newNotification = {
      id: Date.now(),
      type: randomNotification.type,
      message: randomNotification.message,
      icon: randomNotification.icon,
      timestamp: new Date(),
      read: false
    };

    addNotification(newNotification); // Use action instead of direct state mutation
  }, [addNotification]);

  // Mark notification as read
  const markNotificationAsRead = useCallback((id: number) => {
    markNotificationRead(id); // Use action instead of direct state mutation
  }, [markNotificationRead]);

  // Clear all notifications
  const clearAllNotifications = useCallback(() => {
    clearNotifications(); // Use action instead of direct state mutation
  }, [clearNotifications]);

  const loadDashboardData = useCallback(async () => {
    try {
      setLoadingState({ loading: true, error: null });

      // Get current user
      // TEMP: Skip authentication check for testing
      // const currentUser = apiService.getCurrentUser();
      // if (!currentUser) {
      //   router.push('/login');
      //   return;
      // }

      // setUserRole(currentUser.role || 'USER');
      setUserRole('ADMIN'); // TEMP: Set default role for testing

      // Load all dashboard data in parallel
      const results = await Promise.allSettled([
        apiService.getRoleBasedStats(),
        apiService.getRoleBasedNavigation(),
        apiService.getUserPermissions(),
        apiService.getRoleBasedActivity(10),
        apiService.getRoleBasedProjects(5),
        apiService.getRoleBasedSystemHealth(),
        apiService.getUserProfile(),
      ]);

      // Extract results with fallbacks
      const statsData = results[0].status === 'fulfilled' ? results[0].value : {};
      const navigationData = results[1].status === 'fulfilled' ? results[1].value : [];
      const permissionsData = results[2].status === 'fulfilled' ? results[2].value : [];
      const activityData = results[3].status === 'fulfilled' ? results[3].value : [];
      const projectsData = results[4].status === 'fulfilled' ? results[4].value : [];
      const healthData = results[5].status === 'fulfilled' ? results[5].value : {};
      const profileData = results[6].status === 'fulfilled' ? results[6].value : {};

      // Log any failed API calls
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          console.error(`API call ${index} failed:`, result.reason);
        }
      });

      // Debug logging
      console.log('API Results:', {
        statsData,
        navigationData,
        permissionsData,
        activityData,
        projectsData,
        healthData,
        profileData
      });

      // ============================================================================
      // BATCHED STATE UPDATE - IMPROVED PERFORMANCE
      // ============================================================================
      // WHY: Using setDashboardData for bulk updates instead of individual setters
      // BENEFITS: Single dispatch reduces re-renders, better performance
      // ============================================================================
      setDashboardData({
        stats: statsData,
        navigation: navigationData,
        activity: Array.isArray(activityData) ? activityData : [],
        projects: Array.isArray(projectsData) ? projectsData : [],
        systemHealth: healthData,
        userProfile: profileData as UserProfile,
      });

      // Convert UserPermission[] to object keyed by feature slug
      const permissionsObj: Record<string, import('@/hooks/usePermissions').UserPermission> = {};

      // More robust type checking
      if (permissionsData && typeof permissionsData === 'object' && Array.isArray(permissionsData)) {
        try {
          permissionsData.forEach((perm) => {
            if (perm && typeof perm === 'object' && perm.feature && perm.feature.slug) {
              permissionsObj[perm.feature.slug] = perm;
            }
          });
        } catch (forEachError) {
          console.error('Error in permissionsData.forEach:', forEachError);
          console.log('permissionsData type:', typeof permissionsData);
          console.log('permissionsData value:', permissionsData);
        }
      } else {
        console.warn('permissionsData is not a valid array:', {
          type: typeof permissionsData,
          isArray: Array.isArray(permissionsData),
          value: permissionsData
        });
      }
      setPermissions(permissionsObj);

    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setLoadingState({ loading: false, error: 'Failed to load dashboard data. Please try again.' });
    } finally {
      setLoading(false);
    }
  }, [setLoadingState, setUserRole, setDashboardData, setPermissions, setLoading]);

  // const getRoleDisplayName = (role: string) => {
  //   switch (role) {
  //     case 'PLATFORM_ADMIN': return 'Platform Administrator';
  //     case 'TENANT_ADMIN': return 'Tenant Administrator';
  //     case 'USER': return 'User';
  //     default: return 'User';
  //   }
  // };

  // const getRoleColor = (role: string) => {
  //   switch (role) {
  //     case 'PLATFORM_ADMIN': return 'text-red-600';
  //     case 'TENANT_ADMIN': return 'text-blue-600';
  //     case 'USER': return 'text-green-600';
  //     default: return 'text-gray-600';
  //   }
  // };


  const renderStatsCards = useMemo(() => {
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
  }, [userRole, stats]);

  const renderSystemHealth = useMemo(() => {
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
            <div className="text-2xl font-bold text-blue-600">{systemHealth && systemHealth.responseTime ? systemHealth.responseTime : '120ms'}</div>
            <div className="text-sm text-gray-600">Response Time</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{systemHealth && systemHealth.storageUsage ? systemHealth.storageUsage : '45%'}</div>
            <div className="text-sm text-gray-600">Storage Usage</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{systemHealth && systemHealth.memoryUsage ? systemHealth.memoryUsage : '62%'}</div>
            <div className="text-sm text-gray-600">Memory Usage</div>
          </div>
        </div>
      </div>
    );
  }, [permissions, systemHealth]);

  const renderNavigation = useMemo(() => {
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
  }, [navigation, router]);

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

  console.log('UnifiedDashboard render - sidebarOpen:', sidebarOpen);

  return (
    <div
      className="min-h-screen bg-gray-50"
      style={{ minHeight: '100vh' }}
      role="application"
      aria-label="Enterprise Dashboard"
    >
      {/* Header - Full Width */}
      <header
        className="text-white shadow-lg w-full"
        style={{
          background: 'linear-gradient(135deg, #073c82 0%, #00d6bc 100%)',
        }}
        role="banner"
        aria-label="Dashboard header"
      >
        <div className="w-full px-4 sm:px-6 lg:px-8">
          {/* Top Row - Logo, Breadcrumb, and User Actions */}
          <div className="flex justify-between items-center py-1">
            <div className="flex items-center space-x-4">
              {/* Hamburger Menu Button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSidebarOpen(!sidebarOpen);
                  }
                }}
                className="text-white/90 hover:text-white hover:bg-white/10 p-2 rounded transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-[#073c82]"
                aria-expanded={sidebarOpen}
                aria-controls="main-sidebar"
                aria-label={sidebarOpen ? "Hide navigation menu" : "Show navigation menu"}
                title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
              >
                <Menu className="w-5 h-5" aria-hidden="true" />
              </button>
              
              <Logo 
                size="sm" 
                showTagline={false} 
                className="cursor-pointer" 
                variant="light"
                // onClick removed: Logo does not support onClick prop
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
                                  {result.type === 'navigation' && result.label}
                                  {result.type === 'project' && result.name}
                                  {result.type === 'activity' && result.action}
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
                          <div className="text-sm">No results found for &quot;{searchQuery}&quot;</div>
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
                <div className="relative notification-container">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="flex items-center space-x-1 text-white/90 hover:text-white hover:bg-white/10 px-2 py-1 rounded transition-all duration-200"
                  >
                    <Bell className="w-4 h-4" />
                    {notifications.filter(n => !n.read).length > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 font-bold ml-1">
                        {notifications.filter(n => !n.read).length}
                      </span>
                    )}
                  </button>
                  
                  {/* Notifications Dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                      <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                          <button
                            onClick={clearAllNotifications}
                            className="text-sm text-gray-500 hover:text-gray-700"
                          >
                            Clear All
                          </button>
                        </div>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map((notification) => {
                            const IconComponent = iconMap[notification.icon as keyof typeof iconMap] || Bell;
                            return (
                              <div
                                key={notification.id}
                                onClick={() => markNotificationAsRead(notification.id)}
                                className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                                  !notification.read ? 'bg-blue-50' : ''
                                }`}
                              >
                                <div className="flex items-start space-x-3">
                                  <div className={`p-2 rounded-full ${
                                    notification.type === 'success' ? 'bg-green-100' :
                                    notification.type === 'error' ? 'bg-red-100' :
                                    notification.type === 'warning' ? 'bg-yellow-100' :
                                    'bg-blue-100'
                                  }`}>
                                    <IconComponent className={`w-4 h-4 ${
                                      notification.type === 'success' ? 'text-green-600' :
                                      notification.type === 'error' ? 'text-red-600' :
                                      notification.type === 'warning' ? 'text-yellow-600' :
                                      'text-blue-600'
                                    }`} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900">
                                      {notification.message}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {notification.timestamp ? notification.timestamp.toLocaleTimeString() : ''}
                                    </p>
                                  </div>
                                  {!notification.read && (
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                  )}
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="p-8 text-center text-gray-500">
                            <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                            <p>No notifications</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Live Status Indicator */}
              <div className="flex items-center space-x-2 text-white/80 text-xs">
                <div className={`w-2 h-2 rounded-full ${isRefreshing ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`}></div>
                <span>{isRefreshing ? 'Updating...' : 'Live'}</span>
                <span className="text-white/60">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </span>
              </div>
              
              {/* User Profile Info with Dropdown */}
              {userProfile && (
                <div
                  className="relative user-menu-container"
                  onMouseEnter={() => {
                    if (userMenuTimeout) {
                      clearTimeout(userMenuTimeout);
                      setUserMenuTimeout(null);
                    }
                    setShowUserMenu(true);
                  }}
                  onMouseLeave={() => {
                    const timeout = setTimeout(() => {
                      setShowUserMenu(false);
                    }, 300); // 300ms delay before closing
                    setUserMenuTimeout(timeout);
                  }}
                >
                  <div className="flex items-center space-x-3 cursor-pointer group">
                    {/* User Initials Circle - Glass Morphism Effect */}
                    <div className="relative w-8 h-8 rounded-full flex items-center justify-center overflow-hidden group">
                      {/* Gradient Background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm"></div>

                      {/* Animated Gradient Border */}
                      <div className="absolute inset-0 rounded-full p-[1px] bg-gradient-to-r from-[#073c82] via-[#00d6bc] to-[#073c82]">
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-sm flex items-center justify-center group-hover:from-white/25 group-hover:to-white/10 transition-all duration-300">
                          {/* User Initials */}
                          <span className="font-bold text-xs text-white drop-shadow-sm relative z-10">
                            {`${userProfile.firstName?.[0] || ''}${userProfile.lastName?.[0] || ''}`.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      {/* Subtle Inner Glow */}
                      <div className="absolute inset-1 rounded-full bg-gradient-to-br from-white/10 to-transparent opacity-50"></div>
                    </div>

                    <div className="text-left">
                      <div className="font-semibold text-xs text-white drop-shadow-sm">
                        {userProfile.firstName} {userProfile.lastName}
                      </div>
                      <div className="text-xs text-white/80 drop-shadow-sm">
                        {userProfile.tenantName}
                      </div>
                    </div>

                    {/* Dropdown Arrow */}
                    <ChevronDown className={`w-3 h-3 text-white/80 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
                  </div>

                  {/* User Menu Dropdown */}
                  {showUserMenu && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                      {/* User Info Header */}
                      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-[#073c82] to-[#00d6bc] rounded-full flex items-center justify-center">
                            <span className="font-bold text-xs text-white">
                              {`${userProfile.firstName?.[0] || ''}${userProfile.lastName?.[0] || ''}`.toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-sm text-gray-900">
                              {userProfile.firstName} {userProfile.lastName}
                            </div>
                            <div className="text-xs text-gray-500">
                              {userProfile.email}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-1">
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            router.push('/profile');
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                        >
                          <User className="w-4 h-4 mr-3 text-gray-500" />
                          My Profile
                        </button>

                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            router.push('/settings');
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                        >
                          <Settings className="w-4 h-4 mr-3 text-gray-500" />
                          Settings
                        </button>

                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            router.push('/help');
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                        >
                          <Shield className="w-4 h-4 mr-3 text-gray-500" />
                          Help & Support
                        </button>

                        <div className="border-t border-gray-200 my-1"></div>

                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            handleLogout();
                          }}
                          disabled={loading}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <LogOut className={`w-4 h-4 mr-3 text-red-500 ${loading ? 'animate-spin' : ''}`} />
                          {loading ? 'Signing Out...' : 'Sign Out'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main
        id="main-content"
        className={`px-4 sm:px-6 lg:px-8 py-8 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}
        style={{
          marginLeft: sidebarOpen ? '16rem' : '0',
          transition: 'margin-left 0.3s ease-in-out'
        }}
        role="main"
        aria-label="Main content"
      >
        {/* Conditional Content Rendering with Smooth Transitions */}
        <div className="transition-all duration-300 ease-in-out">
          {currentView === 'platform-features' ? (
            <div className="animate-fadeIn">
              <PlatformFeaturesView />
            </div>
          ) : currentView === 'tenants' ? (
            <div className="animate-fadeIn">
              <TenantsView />
            </div>
          ) : currentView === 'users' ? (
            <div className="animate-fadeIn">
              <UsersView />
            </div>
          ) : currentView === 'audit-logs' ? (
            <div className="animate-fadeIn">
              <AuditLogsView />
            </div>
          ) : currentView === 'sign-in-logs' ? (
            <div className="animate-fadeIn">
              <SignInLogsView />
            </div>
          ) : currentView === 'dashboard' ? (
            <div className="animate-fadeIn">
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
                  {stats.securityAlerts && stats.securityAlerts > 0 ? 'Needs attention' : 'All clear'}
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
          {renderStatsCards}
        </div>

        {/* Charts & Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* User Activity Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              User Activity Trend
            </h3>
            <div className="space-y-4">
              {/* Activity Bars */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Today</span>
                  <span className="text-sm font-medium text-gray-900">24 users</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full" style={{width: '85%'}}></div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">This Week</span>
                  <span className="text-sm font-medium text-gray-900">156 users</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full" style={{width: '92%'}}></div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">This Month</span>
                  <span className="text-sm font-medium text-gray-900">1,247 users</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full" style={{width: '78%'}}></div>
                </div>
              </div>
            </div>
          </div>

          {/* System Performance Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Monitor className="w-5 h-5 mr-2" />
              System Performance
            </h3>
            <div className="space-y-6">
              {/* CPU Usage */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">CPU Usage</span>
                  <span className="text-sm font-medium text-gray-900">68%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full" style={{width: '68%'}}></div>
                </div>
              </div>
              
              {/* Memory Usage */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Memory Usage</span>
                  <span className="text-sm font-medium text-gray-900">45%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-gradient-to-r from-blue-400 to-blue-500 h-3 rounded-full" style={{width: '45%'}}></div>
                </div>
              </div>
              
              {/* Disk Usage */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Disk Usage</span>
                  <span className="text-sm font-medium text-gray-900">32%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-gradient-to-r from-green-400 to-green-500 h-3 rounded-full" style={{width: '32%'}}></div>
                </div>
              </div>
              
              {/* Network Usage */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Network</span>
                  <span className="text-sm font-medium text-gray-900">12%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-gradient-to-r from-purple-400 to-purple-500 h-3 rounded-full" style={{width: '12%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Health & Navigation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {renderSystemHealth}
          {renderNavigation}
        </div>

        {/* Security Alerts & Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Security Alerts */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Security Alerts
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-red-800">High Priority</span>
                </div>
                <span className="text-xs text-red-600">3 alerts</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-yellow-800">Medium Priority</span>
                </div>
                <span className="text-xs text-yellow-600">7 alerts</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-green-800">Low Priority</span>
                </div>
                <span className="text-xs text-green-600">12 alerts</span>
              </div>
            </div>
          </div>

          {/* Project Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Folder className="w-5 h-5 mr-2" />
              Project Status
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">In Progress</span>
                <div className="flex items-center">
                  <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{width: '75%'}}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">8</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Completed</span>
                <div className="flex items-center">
                  <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: '100%'}}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">15</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">On Hold</span>
                <div className="flex items-center">
                  <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{width: '40%'}}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">3</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Overdue</span>
                <div className="flex items-center">
                  <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{width: '60%'}}></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">2</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Activity Timeline
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-xs text-gray-600">User login</p>
                  <p className="text-xs text-gray-400">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-xs text-gray-600">Project created</p>
                  <p className="text-xs text-gray-400">15 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-xs text-gray-600">Security scan</p>
                  <p className="text-xs text-gray-400">1 hour ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-xs text-gray-600">Report generated</p>
                  <p className="text-xs text-gray-400">2 hours ago</p>
                </div>
              </div>
            </div>
          </div>
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
                      {item.user?.firstName} {item.user?.lastName} • {item.createdAt ? new Date(item.createdAt).toLocaleString() : ''}
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
          ) : null}
        </div>
      </main>

      {/* Main Sidebar */}
      <aside
        id="main-sidebar"
        className="absolute left-0 w-64 z-50 transition-all duration-300 rounded-r-xl flex flex-col"
        style={{ 
          top: '80px', // Directly below header
          height: 'calc(100vh - 80px)', // Full viewport height minus header
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease-in-out',
          backgroundColor: 'white',
          boxShadow: '2px 0 4px rgba(0,0,0,0.1)'
        }}
        role="complementary"
        aria-label="Main navigation sidebar"
        aria-hidden={!sidebarOpen}
      >
        <div className="flex-1">
          <Sidebar onNavigation={handleNavigation} />
        </div>
        
        {/* Status Indicator - At bottom of main sidebar */}
        <div className="bg-gray-50 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full mr-2 ${isRefreshing ? 'bg-yellow-500 animate-pulse' : error ? 'bg-red-500' : 'bg-green-500'}`}></div>
              <span className={`text-xs font-medium ${isRefreshing ? 'text-yellow-700' : error ? 'text-red-700' : 'text-green-700'}`}>
                {isRefreshing ? 'Updating...' : error ? 'System Offline' : 'System Online'}
              </span>
            </div>
            <button
              onClick={refreshDashboardData}
              disabled={isRefreshing}
              className="text-xs text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Refresh data"
            >
              <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

      </aside>

      {/* Secondary Sidebar - Below main sidebar for next page */}
      <div
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
});
