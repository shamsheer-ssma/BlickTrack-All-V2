/**
 * AdminLayout.tsx
 * 
 * Main Admin Dashboard Layout Component
 * 
 * Features:
 * - Comprehensive admin dashboard with multiple views
 * - 3-column management modals for Features and Tenants
 * - Dynamic view switching with URL parameters
 * - Tenant context management and filtering
 * - Professional header with user information
 * - Responsive sidebar navigation
 * - State management for all admin operations
 * 
 * @author BlickTrack Development Team
 * @version 1.0.0
 * @created 2025-01-30
 * @updated 2025-01-30
 */

'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import AdminSidebar, { AdminView } from './AdminSidebar';
import UserManagement from './UserManagement';
import { TenantManagement } from './TenantManagement';
import FeatureManagement from './FeatureManagementNew';
import { TenantManagementModal } from './TenantManagementModal';
import GradientHeader from '../layout/GradientHeader';
import { getUserInfoForHeader } from '@/lib/auth';
import { 
  BarChart3, 
  Users, 
  Building2, 
  Shield, 
  Settings,
  Activity,
  FileText,
  Key,
  UserCheck,
  Database
} from 'lucide-react';

// Placeholder components for other views
const OverviewView = () => (
  <div className="p-6">
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-900 flex items-center">
        <BarChart3 className="w-6 h-6 mr-3 text-blue-600" />
        Platform Overview
      </h1>
      <p className="text-gray-600 mt-1">
        System-wide metrics and analytics
      </p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Users</p>
            <p className="text-2xl font-bold text-gray-900">1,247</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center">
          <div className="p-2 bg-green-100 rounded-lg">
            <Building2 className="w-6 h-6 text-green-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Active Tenants</p>
            <p className="text-2xl font-bold text-gray-900">23</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Activity className="w-6 h-6 text-purple-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">System Health</p>
            <p className="text-2xl font-bold text-green-600">99.9%</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const UserRolesView = () => (
  <div className="p-6">
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-900 flex items-center">
        <UserCheck className="w-6 h-6 mr-3 text-blue-600" />
        User Roles
      </h1>
      <p className="text-gray-600 mt-1">
        Manage user roles and assignments
      </p>
    </div>
    
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <p className="text-gray-500">User roles management coming soon...</p>
    </div>
  </div>
);

const PermissionsView = () => (
  <div className="p-6">
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-900 flex items-center">
        <Key className="w-6 h-6 mr-3 text-blue-600" />
        Permissions
      </h1>
      <p className="text-gray-600 mt-1">
        Configure system permissions and access controls
      </p>
    </div>
    
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <p className="text-gray-500">Permissions management coming soon...</p>
    </div>
  </div>
);

const TenantsView = ({ tenantId, tenantName, onOpenTenantManagement }: { tenantId?: string; tenantName?: string; onOpenTenantManagement?: () => void }) => (
  <div className="p-6">
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-900 flex items-center">
        <Building2 className="w-6 h-6 mr-3 text-blue-600" />
        Tenant Management
      </h1>
      <p className="text-gray-600 mt-2">Manage tenants and their configurations</p>
    </div>
    
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Tenant Overview</h2>
        <button
          onClick={onOpenTenantManagement}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Settings className="w-4 h-4" />
          <span>Manage Tenants</span>
        </button>
      </div>
      
      <TenantManagement />
    </div>
  </div>
);

const FeaturesView = ({ tenantId, tenantName }: { tenantId?: string; tenantName?: string }) => (
  <FeatureManagement tenantId={tenantId} tenantName={tenantName} />
);

const SecurityView = () => (
  <div className="p-6">
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-900 flex items-center">
        <Shield className="w-6 h-6 mr-3 text-blue-600" />
        Security & Compliance
      </h1>
      <p className="text-gray-600 mt-1">
        Security policies and compliance monitoring
      </p>
    </div>
    
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <p className="text-gray-500">Security management coming soon...</p>
    </div>
  </div>
);

const AuditLogsView = () => (
  <div className="p-6">
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-900 flex items-center">
        <FileText className="w-6 h-6 mr-3 text-blue-600" />
        Audit Logs
      </h1>
      <p className="text-gray-600 mt-1">
        System audit logs and activity monitoring
      </p>
    </div>
    
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <p className="text-gray-500">Audit logs coming soon...</p>
    </div>
  </div>
);

const ReportsView = () => (
  <div className="p-6">
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-900 flex items-center">
        <Activity className="w-6 h-6 mr-3 text-blue-600" />
        Reports & Analytics
      </h1>
      <p className="text-gray-600 mt-1">
        Generate reports and view analytics
      </p>
    </div>
    
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <p className="text-gray-500">Reports and analytics coming soon...</p>
    </div>
  </div>
);

const SettingsView = () => (
  <div className="p-6">
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-900 flex items-center">
        <Settings className="w-6 h-6 mr-3 text-blue-600" />
        System Settings
      </h1>
      <p className="text-gray-600 mt-1">
        Configure system-wide settings
      </p>
    </div>
    
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <p className="text-gray-500">System settings coming soon...</p>
    </div>
  </div>
);

const renderView = (view: AdminView, tenantId?: string, tenantName?: string, onOpenTenantManagement?: () => void) => {
  switch (view) {
    case 'overview':
      return <OverviewView />;
    case 'users':
      return <UserManagement tenantId={tenantId} tenantName={tenantName} />;
    case 'user-roles':
      return <UserRolesView />;
    case 'permissions':
      return <PermissionsView />;
    case 'tenants':
      return <TenantsView tenantId={tenantId} tenantName={tenantName} onOpenTenantManagement={onOpenTenantManagement} />;
    case 'features':
      return <FeaturesView tenantId={tenantId} tenantName={tenantName} />;
    case 'security':
      return <SecurityView />;
    case 'audit-logs':
      return <AuditLogsView />;
    case 'reports':
      return <ReportsView />;
    case 'settings':
      return <SettingsView />;
    default:
      return <OverviewView />;
  }
};

export default function AdminLayout() {
  const searchParams = useSearchParams();
  const [activeView, setActiveView] = useState<AdminView>('overview');
  const [tenantId, setTenantId] = useState<string | undefined>();
  const [tenantName, setTenantName] = useState<string | undefined>();
  
  // Tenant Management Modal State
  const [showTenantManagementModal, setShowTenantManagementModal] = useState(false);
  const [selectedTenantForManagement, setSelectedTenantForManagement] = useState<any>(null);
  const [selectedUserForManagement, setSelectedUserForManagement] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<{
    name: string;
    email: string;
    role: string;
    tenant?: string;
    company?: string;
  } | null>(null);

  useEffect(() => {
    // Get user info for header
    const user = getUserInfoForHeader();
    setUserInfo(user);

    // Get view from URL parameters
    const view = searchParams.get('view') as AdminView;
    if (view && ['overview', 'users', 'user-roles', 'permissions', 'tenants', 'features', 'security', 'audit-logs', 'reports', 'settings'].includes(view)) {
      setActiveView(view);
    }

    // Get tenant context from URL parameters or sessionStorage
    const urlTenantId = searchParams.get('tenant');
    const sessionTenantId = typeof window !== 'undefined' ? sessionStorage.getItem('selectedTenantId') : null;
    const sessionTenantName = typeof window !== 'undefined' ? sessionStorage.getItem('selectedTenantName') : null;

    if (urlTenantId) {
      setTenantId(urlTenantId);
      // Store in sessionStorage for persistence
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('selectedTenantId', urlTenantId);
      }
    } else if (sessionTenantId) {
      setTenantId(sessionTenantId);
    }

    if (sessionTenantName) {
      setTenantName(sessionTenantName);
    }
  }, [searchParams]);

  // Tenant Management Functions
  const handleTenantSelect = (tenant: any) => {
    setSelectedTenantForManagement(tenant);
    setSelectedUserForManagement(null);
  };

  const handleUserSelect = (user: any) => {
    setSelectedUserForManagement(user);
  };

  const handleEditTenant = (tenant: any) => {
    // TODO: Implement edit tenant functionality
    console.log('Edit tenant:', tenant);
  };

  const handleEditUser = (user: any) => {
    // TODO: Implement edit user functionality
    console.log('Edit user:', user);
  };

  const handleDeleteTenant = (tenantId: string, tenantName: string) => {
    // TODO: Implement delete tenant functionality
    console.log('Delete tenant:', tenantId, tenantName);
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    // TODO: Implement delete user functionality
    console.log('Delete user:', userId, userName);
  };

  // Use actual user info if available, otherwise fallback to default
  const headerUserInfo = userInfo || {
    name: 'Platform Admin',
    email: 'admin@blicktrack.com',
    role: 'Platform Admin',
    tenant: 'BlickTrack Platform',
    company: 'BlickTrack Inc.'
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <GradientHeader 
        showSidebar={true} 
        showSearch={true}
        showNotifications={true}
        showProfile={true}
        userInfo={headerUserInfo}
      />
      <div className="flex">
        <AdminSidebar activeView={activeView} onViewChange={setActiveView} />
        <main className="flex-1 transition-all duration-300">
          {/* Breadcrumb for tenant context */}
          {tenantId && tenantName && (
            <div className="bg-blue-50 border-b border-blue-200 px-6 py-3">
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-blue-600">Tenant:</span>
                <span className="font-medium text-blue-900">{tenantName}</span>
                <span className="text-blue-400">•</span>
                <span className="text-blue-600">ID: {tenantId}</span>
                <button
                  onClick={() => {
                    setTenantId(undefined);
                    setTenantName(undefined);
                    if (typeof window !== 'undefined') {
                      sessionStorage.removeItem('selectedTenantId');
                      sessionStorage.removeItem('selectedTenantName');
                    }
                  }}
                  className="ml-4 text-blue-600 hover:text-blue-800 text-xs underline"
                >
                  Clear Filter
                </button>
              </div>
            </div>
          )}
          
          {renderView(activeView, tenantId, tenantName, () => setShowTenantManagementModal(true))}
        </main>
      </div>

      {/* Tenant Management Modal */}
      <TenantManagementModal
        isOpen={showTenantManagementModal}
        onClose={() => {
          setShowTenantManagementModal(false);
          setSelectedTenantForManagement(null);
          setSelectedUserForManagement(null);
        }}
        onTenantUpdate={() => {
          // Refresh tenant data
          console.log('Tenant updated');
        }}
        onTenantSelect={handleTenantSelect}
        onUserSelect={handleUserSelect}
        onEditTenant={handleEditTenant}
        onEditUser={handleEditUser}
        onDeleteTenant={handleDeleteTenant}
        onDeleteUser={handleDeleteUser}
        selectedTenant={selectedTenantForManagement}
        selectedUser={selectedUserForManagement}
      />
    </div>
  );
}


