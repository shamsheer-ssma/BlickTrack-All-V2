import React, { useReducer, useCallback } from 'react';

// ============================================================================
// TYPE IMPORTS FROM UNIFIED DASHBOARD
// ============================================================================
// WHY: These types are defined in UnifiedDashboard.tsx but we need them here
// for the state management hook. In a real refactor, these would be moved to
// a shared types file, but for now we import them from the component.
// ============================================================================

type DashboardStats = {
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
  tenantUptime?: string;
  myProjects?: number;
  notifications?: number;
  tasksCompleted?: number;
  tasksPending?: number;
};

type NavigationItem = {
  id: string;
  label: string;
  icon: string;
  path: string;
};

type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  tenantName?: string;
};

type Project = {
  id: string;
  name: string;
  description?: string;
};

type ActivityUser = {
  firstName?: string;
  lastName?: string;
};

type ActivityItem = {
  id: string;
  action?: string;
  eventType?: string;
  user?: ActivityUser;
  createdAt?: string;
};

type SystemHealth = {
  status?: string;
  uptime?: string;
  responseTime?: string;
  storageUsage?: string;
  memoryUsage?: string;
};

type Notification = {
  id: number;
  message: string;
  type?: string;
  icon?: string;
  timestamp?: Date;
  read?: boolean;
};

type SearchResult =
  | ({ type: 'navigation' } & NavigationItem)
  | ({ type: 'project' } & Project)
  | ({ type: 'activity' } & ActivityItem);

// Data state - API responses and core dashboard data
interface DashboardDataState {
  userProfile: UserProfile | null;
  userRole: string;
  stats: DashboardStats;
  navigation: NavigationItem[];
  permissions: Record<string, import('@/hooks/usePermissions').UserPermission>;
  activity: ActivityItem[];
  projects: Project[];
  systemHealth: SystemHealth;
}

// UI state - Component behavior and user interactions
interface DashboardUIState {
  loading: boolean;
  error: string | null;
  sidebarOpen: boolean;
  currentView: 'dashboard' | 'users' | 'tenants' | 'system' | 'analytics';
  lastUpdated: Date;
  isRefreshing: boolean;
}

// Search state - Search functionality
interface DashboardSearchState {
  searchQuery: string;
  searchResults: SearchResult[];
  showSearchResults: boolean;
}

// Notification state - User notifications
interface DashboardNotificationState {
  notifications: Notification[];
  showNotifications: boolean;
}

// User menu state - Dropdown menu management
interface DashboardUserMenuState {
  showUserMenu: boolean;
  userMenuTimeout: NodeJS.Timeout | null;
}

// Combined state interface
interface DashboardState {
  data: DashboardDataState;
  ui: DashboardUIState;
  search: DashboardSearchState;
  notifications: DashboardNotificationState;
  userMenu: DashboardUserMenuState;
}

// ============================================================================
// ACTION TYPE DEFINITIONS
// ============================================================================

type DashboardAction =
  // Data actions - API responses
  | { type: 'SET_USER_PROFILE'; payload: UserProfile | null }
  | { type: 'SET_USER_ROLE'; payload: string }
  | { type: 'SET_STATS'; payload: DashboardStats }
  | { type: 'SET_NAVIGATION'; payload: NavigationItem[] }
  | { type: 'SET_PERMISSIONS'; payload: Record<string, import('@/hooks/usePermissions').UserPermission> }
  | { type: 'SET_ACTIVITY'; payload: ActivityItem[] }
  | { type: 'SET_PROJECTS'; payload: Project[] }
  | { type: 'SET_SYSTEM_HEALTH'; payload: SystemHealth }
  | { type: 'SET_DASHBOARD_DATA'; payload: Partial<DashboardDataState> }

  // UI actions - Loading, errors, navigation
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_SIDEBAR_OPEN'; payload: boolean }
  | { type: 'SET_CURRENT_VIEW'; payload: DashboardUIState['currentView'] }
  | { type: 'SET_LAST_UPDATED'; payload: Date }
  | { type: 'SET_REFRESHING'; payload: boolean }

  // Search actions
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_SEARCH_RESULTS'; payload: SearchResult[] }
  | { type: 'SET_SHOW_SEARCH_RESULTS'; payload: boolean }
  | { type: 'CLEAR_SEARCH' }

  // Notification actions
  | { type: 'SET_NOTIFICATIONS'; payload: Notification[] }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: number }
  | { type: 'CLEAR_NOTIFICATIONS' }
  | { type: 'SET_SHOW_NOTIFICATIONS'; payload: boolean }

  // User menu actions
  | { type: 'SET_SHOW_USER_MENU'; payload: boolean }
  | { type: 'SET_USER_MENU_TIMEOUT'; payload: NodeJS.Timeout | null }

  // Bulk actions
  | { type: 'RESET_DASHBOARD_STATE' }
  | { type: 'SET_LOADING_STATE'; payload: { loading: boolean; error: string | null } };

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialState: DashboardState = {
  data: {
    userProfile: null,
    userRole: '',
    stats: {},
    navigation: [],
    permissions: {},
    activity: [],
    projects: [],
    systemHealth: {},
  },
  ui: {
    loading: true,
    error: null,
    sidebarOpen: true,
    currentView: 'dashboard',
    lastUpdated: new Date(),
    isRefreshing: false,
  },
  search: {
    searchQuery: '',
    searchResults: [],
    showSearchResults: false,
  },
  notifications: {
    notifications: [],
    showNotifications: false,
  },
  userMenu: {
    showUserMenu: false,
    userMenuTimeout: null,
  },
};

// ============================================================================
// REDUCER FUNCTION
// ============================================================================
// WHY useReducer: Manages complex state transitions predictably
// - All state changes go through actions (easier debugging)
// - Complex state updates can be batched
// - State logic is centralized and testable
// - Prevents stale closure bugs in async operations
// ============================================================================

function dashboardReducer(state: DashboardState, action: DashboardAction): DashboardState {
  switch (action.type) {
    // Data actions
    case 'SET_USER_PROFILE':
      return {
        ...state,
        data: { ...state.data, userProfile: action.payload }
      };

    case 'SET_USER_ROLE':
      return {
        ...state,
        data: { ...state.data, userRole: action.payload }
      };

    case 'SET_STATS':
      return {
        ...state,
        data: { ...state.data, stats: action.payload }
      };

    case 'SET_NAVIGATION':
      return {
        ...state,
        data: { ...state.data, navigation: action.payload }
      };

    case 'SET_PERMISSIONS':
      return {
        ...state,
        data: { ...state.data, permissions: action.payload }
      };

    case 'SET_ACTIVITY':
      return {
        ...state,
        data: { ...state.data, activity: action.payload }
      };

    case 'SET_PROJECTS':
      return {
        ...state,
        data: { ...state.data, projects: action.payload }
      };

    case 'SET_SYSTEM_HEALTH':
      return {
        ...state,
        data: { ...state.data, systemHealth: action.payload }
      };

    case 'SET_DASHBOARD_DATA':
      return {
        ...state,
        data: { ...state.data, ...action.payload }
      };

    // UI actions
    case 'SET_LOADING':
      return {
        ...state,
        ui: { ...state.ui, loading: action.payload }
      };

    case 'SET_ERROR':
      return {
        ...state,
        ui: { ...state.ui, error: action.payload }
      };

    case 'SET_LOADING_STATE':
      return {
        ...state,
        ui: { ...state.ui, ...action.payload }
      };

    case 'SET_SIDEBAR_OPEN':
      return {
        ...state,
        ui: { ...state.ui, sidebarOpen: action.payload }
      };

    case 'SET_CURRENT_VIEW':
      return {
        ...state,
        ui: { ...state.ui, currentView: action.payload }
      };

    case 'SET_LAST_UPDATED':
      return {
        ...state,
        ui: { ...state.ui, lastUpdated: action.payload }
      };

    case 'SET_REFRESHING':
      return {
        ...state,
        ui: { ...state.ui, isRefreshing: action.payload }
      };

    // Search actions
    case 'SET_SEARCH_QUERY':
      return {
        ...state,
        search: { ...state.search, searchQuery: action.payload }
      };

    case 'SET_SEARCH_RESULTS':
      return {
        ...state,
        search: { ...state.search, searchResults: action.payload }
      };

    case 'SET_SHOW_SEARCH_RESULTS':
      return {
        ...state,
        search: { ...state.search, showSearchResults: action.payload }
      };

    case 'CLEAR_SEARCH':
      return {
        ...state,
        search: {
          searchQuery: '',
          searchResults: [],
          showSearchResults: false,
        }
      };

    // Notification actions
    case 'SET_NOTIFICATIONS':
      return {
        ...state,
        notifications: { ...state.notifications, notifications: action.payload }
      };

    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: {
          ...state.notifications,
          notifications: [action.payload, ...state.notifications.notifications.slice(0, 9)]
        }
      };

    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: {
          ...state.notifications,
          notifications: state.notifications.notifications.map(notif =>
            notif.id === action.payload ? { ...notif, read: true } : notif
          )
        }
      };

    case 'CLEAR_NOTIFICATIONS':
      return {
        ...state,
        notifications: { ...state.notifications, notifications: [] }
      };

    case 'SET_SHOW_NOTIFICATIONS':
      return {
        ...state,
        notifications: { ...state.notifications, showNotifications: action.payload }
      };

    // User menu actions
    case 'SET_SHOW_USER_MENU':
      return {
        ...state,
        userMenu: { ...state.userMenu, showUserMenu: action.payload }
      };

    case 'SET_USER_MENU_TIMEOUT':
      return {
        ...state,
        userMenu: { ...state.userMenu, userMenuTimeout: action.payload }
      };

    // Bulk actions
    case 'RESET_DASHBOARD_STATE':
      return initialState;

    default:
      return state;
  }
}

// ============================================================================
// CUSTOM HOOK: useDashboardState
// ============================================================================
// WHY custom hook: Encapsulates all dashboard state logic in one place
// - Easier testing (can mock the entire hook)
// - Reusable across components if needed
// - Clean separation of concerns
// - Better TypeScript support
// ============================================================================

export function useDashboardState() {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);

  // ============================================================================
  // ACTION CREATORS
  // ============================================================================
  // WHY action creators: Provide a clean API for state updates
  // - Type-safe action dispatching
  // - Consistent action structure
  // - Easy to test and debug
  // ============================================================================

  // Data actions
  const setUserProfile = useCallback((userProfile: UserProfile | null) => {
    dispatch({ type: 'SET_USER_PROFILE', payload: userProfile });
  }, []);

  const setUserRole = useCallback((userRole: string) => {
    dispatch({ type: 'SET_USER_ROLE', payload: userRole });
  }, []);

  const setStats = useCallback((stats: DashboardStats) => {
    dispatch({ type: 'SET_STATS', payload: stats });
  }, []);

  const setNavigation = useCallback((navigation: NavigationItem[]) => {
    dispatch({ type: 'SET_NAVIGATION', payload: navigation });
  }, []);

  const setPermissions = useCallback((permissions: Record<string, import('@/hooks/usePermissions').UserPermission>) => {
    dispatch({ type: 'SET_PERMISSIONS', payload: permissions });
  }, []);

  const setActivity = useCallback((activity: ActivityItem[]) => {
    dispatch({ type: 'SET_ACTIVITY', payload: activity });
  }, []);

  const setProjects = useCallback((projects: Project[]) => {
    dispatch({ type: 'SET_PROJECTS', payload: projects });
  }, []);

  const setSystemHealth = useCallback((systemHealth: SystemHealth) => {
    dispatch({ type: 'SET_SYSTEM_HEALTH', payload: systemHealth });
  }, []);

  const setDashboardData = useCallback((data: Partial<DashboardDataState>) => {
    dispatch({ type: 'SET_DASHBOARD_DATA', payload: data });
  }, []);

  // UI actions
  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, []);

  const setError = useCallback((error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  const setLoadingState = useCallback((loadingState: { loading: boolean; error: string | null }) => {
    dispatch({ type: 'SET_LOADING_STATE', payload: loadingState });
  }, []);

  const setSidebarOpen = useCallback((sidebarOpen: boolean) => {
    dispatch({ type: 'SET_SIDEBAR_OPEN', payload: sidebarOpen });
  }, []);

  const setCurrentView = useCallback((currentView: DashboardUIState['currentView']) => {
    dispatch({ type: 'SET_CURRENT_VIEW', payload: currentView });
  }, []);

  const setLastUpdated = useCallback((lastUpdated: Date) => {
    dispatch({ type: 'SET_LAST_UPDATED', payload: lastUpdated });
  }, []);

  const setRefreshing = useCallback((isRefreshing: boolean) => {
    dispatch({ type: 'SET_REFRESHING', payload: isRefreshing });
  }, []);

  // Search actions
  const setSearchQuery = useCallback((searchQuery: string) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: searchQuery });
  }, []);

  const setSearchResults = useCallback((searchResults: SearchResult[]) => {
    dispatch({ type: 'SET_SEARCH_RESULTS', payload: searchResults });
  }, []);

  const setShowSearchResults = useCallback((showSearchResults: boolean) => {
    dispatch({ type: 'SET_SHOW_SEARCH_RESULTS', payload: showSearchResults });
  }, []);

  const clearSearch = useCallback(() => {
    dispatch({ type: 'CLEAR_SEARCH' });
  }, []);

  // Notification actions
  const setNotifications = useCallback((notifications: Notification[]) => {
    dispatch({ type: 'SET_NOTIFICATIONS', payload: notifications });
  }, []);

  const addNotification = useCallback((notification: Notification) => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
  }, []);

  const markNotificationRead = useCallback((id: number) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id });
  }, []);

  const clearNotifications = useCallback(() => {
    dispatch({ type: 'CLEAR_NOTIFICATIONS' });
  }, []);

  const setShowNotifications = useCallback((showNotifications: boolean) => {
    dispatch({ type: 'SET_SHOW_NOTIFICATIONS', payload: showNotifications });
  }, []);

  // User menu actions
  const setShowUserMenu = useCallback((showUserMenu: boolean) => {
    dispatch({ type: 'SET_SHOW_USER_MENU', payload: showUserMenu });
  }, []);

  const setUserMenuTimeout = useCallback((userMenuTimeout: NodeJS.Timeout | null) => {
    dispatch({ type: 'SET_USER_MENU_TIMEOUT', payload: userMenuTimeout });
  }, []);

  // Bulk actions
  const resetDashboardState = useCallback(() => {
    dispatch({ type: 'RESET_DASHBOARD_STATE' });
  }, []);

  // ============================================================================
  // COMPUTED SELECTORS
  // ============================================================================
  // WHY selectors: Provide derived state and computed values
  // - Centralized business logic
  // - Memoizable for performance
  // - Easy to test in isolation
  // ============================================================================

  const unreadNotificationsCount = state.notifications.notifications.filter(n => !n.read).length;

  const hasActiveSearch = state.search.searchQuery.length > 0 && state.search.showSearchResults;

  const isDataLoaded = !state.ui.loading && !state.ui.error && Object.keys(state.data.stats).length > 0;

  // ============================================================================
  // RETURN HOOK API
  // ============================================================================

  return {
    // State
    state,

    // Individual state slices for convenience
    userProfile: state.data.userProfile,
    userRole: state.data.userRole,
    stats: state.data.stats,
    navigation: state.data.navigation,
    permissions: state.data.permissions,
    activity: state.data.activity,
    projects: state.data.projects,
    systemHealth: state.data.systemHealth,

    loading: state.ui.loading,
    error: state.ui.error,
    sidebarOpen: state.ui.sidebarOpen,
    currentView: state.ui.currentView,
    lastUpdated: state.ui.lastUpdated,
    isRefreshing: state.ui.isRefreshing,

    searchQuery: state.search.searchQuery,
    searchResults: state.search.searchResults,
    showSearchResults: state.search.showSearchResults,

    notifications: state.notifications.notifications,
    showNotifications: state.notifications.showNotifications,

    showUserMenu: state.userMenu.showUserMenu,
    userMenuTimeout: state.userMenu.userMenuTimeout,

    // Computed values
    unreadNotificationsCount,
    hasActiveSearch,
    isDataLoaded,

    // Actions
    setUserProfile,
    setUserRole,
    setStats,
    setNavigation,
    setPermissions,
    setActivity,
    setProjects,
    setSystemHealth,
    setDashboardData,

    setLoading,
    setError,
    setLoadingState,
    setSidebarOpen,
    setCurrentView,
    setLastUpdated,
    setRefreshing,

    setSearchQuery,
    setSearchResults,
    setShowSearchResults,
    clearSearch,

    setNotifications,
    addNotification,
    markNotificationRead,
    clearNotifications,
    setShowNotifications,

    setShowUserMenu,
    setUserMenuTimeout,

    resetDashboardState,
  };
}

// ============================================================================
// TYPE EXPORTS
// ============================================================================
// Export types for use in components that consume this hook
export type { DashboardState, DashboardAction, DashboardDataState, DashboardUIState };