'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Building2, 
  Shield, 
  Activity, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings,
  BarChart3,
  Eye,
  MoreHorizontal
} from 'lucide-react';
import { TenantManagement } from '@/components/admin/TenantManagement';

interface PlatformStats {
  totalUsers: number;
  totalTenants: number;
  activeUsers: number;
  systemHealth: number;
  securityAlerts: number;
  uptime: number;
}

interface Tenant {
  id: string;
  name: string;
  plan: string;
  userCount: number;
  isActive: boolean;
  lastActivity: string;
  healthScore: number;
  status: 'active' | 'trial' | 'suspended' | 'inactive';
}

interface RecentActivity {
  id: string;
  type: 'user_login' | 'tenant_created' | 'security_alert' | 'system_update';
  message: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export function PlatformAdminDashboard() {
  const [stats, setStats] = useState<PlatformStats>({
    totalUsers: 0,
    totalTenants: 0,
    activeUsers: 0,
    systemHealth: 0,
    securityAlerts: 0,
    uptime: 0
  });
  
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'tenants' | 'users' | 'features'>('overview');

  useEffect(() => {
    fetchPlatformData();
  }, []);

  const fetchPlatformData = async () => {
    try {
      setLoading(true);
      console.log('🔍 [PLATFORM DASHBOARD] Fetching platform data...');
      
      // Fetch platform statistics
      console.log('📊 [PLATFORM DASHBOARD] Fetching stats...');
      const statsResponse = await fetch('/api/admin/stats');
      const statsData = await statsResponse.json();
      console.log('📊 [PLATFORM DASHBOARD] Stats response:', statsData);
      
      if (statsData.success) {
        setStats(statsData.data);
        console.log('✅ [PLATFORM DASHBOARD] Stats loaded:', statsData.data);
      } else {
        console.error('❌ [PLATFORM DASHBOARD] Stats failed:', statsData.error);
      }
      
      // Fetch tenants data
      console.log('🏢 [PLATFORM DASHBOARD] Fetching tenants...');
      const tenantsResponse = await fetch('/api/admin/tenants');
      const tenantsData = await tenantsResponse.json();
      console.log('🏢 [PLATFORM DASHBOARD] Tenants response:', tenantsData);
      
      if (tenantsData.success) {
        setTenants(tenantsData.data);
        console.log('✅ [PLATFORM DASHBOARD] Tenants loaded:', tenantsData.data);
      } else {
        console.error('❌ [PLATFORM DASHBOARD] Tenants failed:', tenantsData.error);
      }
      
      // Fetch recent activity
      console.log('📝 [PLATFORM DASHBOARD] Fetching activity...');
      const activityResponse = await fetch('/api/admin/activity');
      const activityData = await activityResponse.json();
      console.log('📝 [PLATFORM DASHBOARD] Activity response:', activityData);
      
      if (activityData.success) {
        setRecentActivity(activityData.data);
        console.log('✅ [PLATFORM DASHBOARD] Activity loaded:', activityData.data);
      } else {
        console.error('❌ [PLATFORM DASHBOARD] Activity failed:', activityData.error);
      }
      
    } catch (error) {
      console.error('❌ [PLATFORM DASHBOARD] Error fetching platform data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'trial': return 'text-blue-600 bg-blue-100';
      case 'suspended': return 'text-red-600 bg-red-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-96 bg-gray-200 rounded-lg"></div>
            <div className="h-96 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Platform Administration</h1>
          <p className="text-gray-600 mt-1">Monitor and manage the BlickTrack platform</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Settings className="w-4 h-4 mr-2 inline" />
            Platform Settings
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <BarChart3 className="w-4 h-4 mr-2 inline" />
            Advanced Analytics
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', name: 'Overview', icon: BarChart3 },
            { id: 'tenants', name: 'Tenants', icon: Building2 },
            { id: 'users', name: 'Users', icon: Users },
            { id: 'features', name: 'Features', icon: Settings }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>+12% from last month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Tenants</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalTenants}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Building2 className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <CheckCircle className="w-4 h-4 mr-1" />
            <span>All systems operational</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">System Health</p>
              <p className="text-3xl font-bold text-gray-900">{stats.systemHealth}%</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <CheckCircle className="w-4 h-4 mr-1" />
            <span>Excellent performance</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Security Alerts</p>
              <p className="text-3xl font-bold text-gray-900">{stats.securityAlerts}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <Shield className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-red-600">
            <AlertTriangle className="w-4 h-4 mr-1" />
            <span>Requires attention</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tenants Overview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Tenant Overview</h2>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {tenants.slice(0, 5).map((tenant) => (
                <div key={tenant.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{tenant.name}</p>
                      <p className="text-sm text-gray-600">{tenant.userCount} users • {tenant.plan} plan</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tenant.status)}`}>
                      {tenant.status}
                    </span>
                    <div className="flex items-center text-sm text-gray-500">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                      {tenant.healthScore}%
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${getSeverityColor(activity.severity).split(' ')[1]}`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Building2 className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Create New Tenant</p>
                  <p className="text-sm text-gray-600">Add a new organization</p>
                </div>
              </div>
            </button>
            
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Manage Users</p>
                  <p className="text-sm text-gray-600">View and manage all users</p>
                </div>
              </div>
            </button>
            
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Shield className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Security Center</p>
                  <p className="text-sm text-gray-600">Monitor security alerts</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
        </>
      )}

      {activeTab === 'tenants' && (
        <TenantManagement />
      )}

      {activeTab === 'users' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">User Management</h2>
          <p className="text-gray-600">User management functionality will be implemented here.</p>
        </div>
      )}

      {activeTab === 'features' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Feature Management</h2>
          <p className="text-gray-600">Feature management functionality will be implemented here.</p>
        </div>
      )}
    </div>
  );
}