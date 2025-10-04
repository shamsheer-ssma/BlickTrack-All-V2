'use client';

import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Users, 
  Settings, 
  ToggleLeft, 
  ToggleRight,
  Eye,
  MoreHorizontal,
  Search,
  Filter,
  Plus,
  AlertTriangle,
  CheckCircle,
  Clock,
  Shield,
  BarChart3,
  Mail,
  User,
  X,
  RefreshCw
} from 'lucide-react';
import { CreateTenantModal } from './CreateTenantModal';
import { EditTenantModal } from './EditTenantModal';
import { DeleteTenantModal } from './DeleteTenantModal';
import { TenantActionsMenu } from './TenantActionsMenu';
import { TenantUsersModal } from './TenantUsersModal';
import { TenantAnalyticsModal } from './TenantAnalyticsModal';
import { ToastProvider } from '@/components/ui/toast';
import { useRouter } from 'next/navigation';

interface Tenant {
  id: string;
  name: string;
  plan: string;
  userCount: number;
  activeUsers: number;
  enabledFeatures: number;
  isActive: boolean;
  lastActivity: string;
  healthScore: number;
  status: 'active' | 'trial' | 'suspended' | 'inactive';
  contactEmail?: string;
  billingEmail?: string;
  technicalContact?: string;
  industry?: string;
  maxUsers: number;
}

interface PlatformFeature {
  id: string;
  name: string;
  description: string;
  category: string;
  requiresLicense: boolean;
  isPremium: boolean;
  isAddOn: boolean;
  isActive: boolean;
  isVisible: boolean;
  isDeprecated: boolean;
  settings: any;
  limits: any;
  dependencies: string[];
}

interface TenantFeature {
  id: string;
  tenantId: string;
  featureId: string;
  isEnabled: boolean;
  isActive: boolean;
  isTrial: boolean;
  enabledAt: string | null;
  disabledAt: string | null;
  trialExpiresAt: string | null;
  settings: any;
  limits: any;
  usageCount: number;
  lastUsedAt: string | null;
  assignedBy: string | null;
  assignedAt: string;
  assignmentReason: string | null;
  feature: PlatformFeature;
}

function TenantManagementContent() {
  const router = useRouter();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [tenantFeatures, setTenantFeatures] = useState<TenantFeature[]>([]);
  const [platformFeatures, setPlatformFeatures] = useState<PlatformFeature[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFeatureModal, setShowFeatureModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);

  useEffect(() => {
    fetchTenants();
    fetchPlatformFeatures();
  }, []);

  useEffect(() => {
    if (selectedTenant) {
      fetchTenantFeatures(selectedTenant.id);
    }
  }, [selectedTenant]);

  const fetchTenants = async (forceRefresh = false) => {
    const now = Date.now();
    const CACHE_DURATION = 30000; // 30 seconds cache
    
    // Check if we need to refresh data
    if (!forceRefresh && now - lastFetchTime < CACHE_DURATION && tenants.length > 0) {
      console.log('🚀 [TENANT MANAGEMENT] Using cached data');
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setIsRefreshing(true);
    try {
      const response = await fetch('/api/admin/tenants');
      const data = await response.json();
      
      if (data.success) {
        setTenants(data.data);
        setLastFetchTime(now);
      } else {
        console.error('Failed to fetch tenants:', data.error);
      }
    } catch (error) {
      console.error('Error fetching tenants:', error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const fetchPlatformFeatures = async () => {
    try {
      const response = await fetch('/api/admin/features');
      const data = await response.json();
      
      if (data.success) {
        setPlatformFeatures(data.data);
      } else {
        console.error('Failed to fetch platform features:', data.error);
      }
    } catch (error) {
      console.error('Error fetching platform features:', error);
    }
  };

  const fetchTenantFeatures = async (tenantId: string) => {
    try {
      const response = await fetch(`/api/admin/tenants/${tenantId}/features`);
      const data = await response.json();
      
      if (data.success) {
        setTenantFeatures(data.data);
      } else {
        console.error('Failed to fetch tenant features:', data.error);
      }
    } catch (error) {
      console.error('Error fetching tenant features:', error);
    }
  };

  const toggleFeature = async (tenantId: string, featureId: string, enabled: boolean) => {
    try {
      const response = await fetch(`/api/admin/tenants/${tenantId}/features`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featureId, enabled })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Update local state
        setTenantFeatures(prev => {
          const existing = prev.find(tf => tf.featureId === featureId);
          if (existing) {
            return prev.map(tf => 
              tf.featureId === featureId 
                ? { ...tf, isEnabled: enabled, enabledAt: enabled ? new Date().toISOString() : tf.enabledAt, disabledAt: enabled ? tf.disabledAt : new Date().toISOString() }
                : tf
            );
          } else {
            return [...prev, {
              id: `tf_${Date.now()}`,
              tenantId,
              featureId,
              isEnabled: enabled,
              isActive: true,
              isTrial: false,
              enabledAt: enabled ? new Date().toISOString() : null,
              disabledAt: enabled ? null : new Date().toISOString(),
              trialExpiresAt: null,
              settings: {},
              limits: {},
              usageCount: 0,
              lastUsedAt: null,
              assignedBy: null,
              assignedAt: new Date().toISOString(),
              assignmentReason: null,
              feature: platformFeatures.find(f => f.id === featureId)!
            }];
          }
        });
      } else {
        console.error('Failed to toggle feature:', data.error);
      }
    } catch (error) {
      console.error('Error toggling feature:', error);
    }
  };

  const handleCreateTenantSuccess = () => {
    fetchTenants();
  };

  const handleEditSuccess = () => {
    fetchTenants();
  };

  const handleDeleteSuccess = () => {
    fetchTenants();
    setSelectedTenant(null);
  };

  const handleEditTenant = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setShowEditModal(true);
  };

  const handleDeleteTenant = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setShowDeleteModal(true);
  };

  const handleViewDetails = (tenant: Tenant) => {
    console.log('View details for tenant:', tenant);
    // You could implement a detailed view modal here
  };

  const handleManageUsers = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setShowUsersModal(true);
  };

  const handleManageFeatures = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setShowFeatureModal(true);
  };

  const handleViewAnalytics = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setShowAnalyticsModal(true);
  };

  // Navigation functions for right panel
  const navigateToTenantUsers = (tenant: Tenant) => {
    // Store tenant context in sessionStorage for filtering
    sessionStorage.setItem('selectedTenantId', tenant.id);
    sessionStorage.setItem('selectedTenantName', tenant.name);
    router.push('/features/dashboard/platform-admin?view=users&tenant=' + tenant.id);
  };

  const navigateToTenantFeatures = (tenant: Tenant) => {
    sessionStorage.setItem('selectedTenantId', tenant.id);
    sessionStorage.setItem('selectedTenantName', tenant.name);
    router.push('/features/dashboard/platform-admin?view=features&tenant=' + tenant.id);
  };

  const navigateToTenantSecurity = (tenant: Tenant) => {
    sessionStorage.setItem('selectedTenantId', tenant.id);
    sessionStorage.setItem('selectedTenantName', tenant.name);
    router.push('/features/dashboard/platform-admin?view=security&tenant=' + tenant.id);
  };

  const navigateToTenantAnalytics = (tenant: Tenant) => {
    sessionStorage.setItem('selectedTenantId', tenant.id);
    sessionStorage.setItem('selectedTenantName', tenant.name);
    router.push('/features/dashboard/platform-admin?view=reports&tenant=' + tenant.id);
  };

  const navigateToTenantSettings = (tenant: Tenant) => {
    sessionStorage.setItem('selectedTenantId', tenant.id);
    sessionStorage.setItem('selectedTenantName', tenant.name);
    router.push('/features/dashboard/platform-admin?view=settings&tenant=' + tenant.id);
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

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredTenants = tenants.filter(tenant => {
    const matchesSearch = tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tenant.contactEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tenant.industry?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || tenant.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const groupedFeatures = platformFeatures.reduce((acc, feature) => {
    if (!acc[feature.category]) {
      acc[feature.category] = [];
    }
    acc[feature.category].push(feature);
    return acc;
  }, {} as Record<string, PlatformFeature[]>);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="h-96 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Main Content Area */}
      <div className={`transition-all duration-300 ${selectedTenant ? 'flex-1' : 'w-full'}`}>
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tenant Management</h1>
              <p className="text-gray-600 mt-1">Manage tenants and their feature access</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => fetchTenants(true)}
                disabled={isRefreshing}
                className="px-3 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2 disabled:opacity-50"
              >
                <div className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`}>
                  <RefreshCw className="w-4 h-4" />
                </div>
                <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
              </button>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2 inline" />
                Create Tenant
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <BarChart3 className="w-4 h-4 mr-2 inline" />
                Analytics
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tenants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="trial">Trial</option>
              <option value="suspended">Suspended</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Tenants List */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Tenants ({filteredTenants.length})
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              {filteredTenants.length === 0 ? (
                <div className="p-6 text-center">
                  <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">No tenants found</p>
                  <p className="text-sm text-gray-500">
                    {searchTerm || statusFilter !== 'all' 
                      ? 'Try adjusting your search or filter criteria'
                      : 'No tenants have been created yet'
                    }
                  </p>
                </div>
              ) : (
                filteredTenants.map((tenant) => (
                <div
                  key={tenant.id}
                  className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors border border-gray-200 rounded-lg mb-3 ${
                    selectedTenant?.id === tenant.id ? 'bg-blue-50 border-blue-300 shadow-md' : 'hover:shadow-sm'
                  }`}
                  onClick={() => setSelectedTenant(tenant)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-6 h-6 text-blue-600" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">{tenant.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tenant.status)}`}>
                            {tenant.status}
                          </span>
                          <div className={`flex items-center text-sm ${getHealthColor(tenant.healthScore)}`}>
                            <div className={`w-2 h-2 rounded-full mr-1 ${getHealthColor(tenant.healthScore).replace('text-', 'bg-')}`}></div>
                            {tenant.healthScore}%
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span>{tenant.userCount}/{tenant.maxUsers} users</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Shield className="w-4 h-4 text-gray-400" />
                            <span className="capitalize">{tenant.plan} plan</span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <BarChart3 className="w-4 h-4 text-gray-400" />
                            <span>{tenant.enabledFeatures} features</span>
                          </div>
                          
                          {tenant.contactEmail && (
                            <div className="flex items-center space-x-2">
                              <Mail className="w-4 h-4 text-gray-400" />
                              <span className="truncate">{tenant.contactEmail}</span>
                            </div>
                          )}
                          
                          {tenant.technicalContact && (
                            <div className="flex items-center space-x-2">
                              <User className="w-4 h-4 text-gray-400" />
                              <span className="truncate">{tenant.technicalContact}</span>
                            </div>
                          )}
                          
                          {tenant.industry && (
                            <div className="flex items-center space-x-2">
                              <Building2 className="w-4 h-4 text-gray-400" />
                              <span className="truncate">{tenant.industry}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-2 text-xs text-gray-500">
                          Last activity: {new Date(tenant.lastActivity).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0 ml-4">
                      <TenantActionsMenu
                        tenant={tenant}
                        onEdit={handleEditTenant}
                        onDelete={handleDeleteTenant}
                        onViewDetails={handleViewDetails}
                        onManageUsers={handleManageUsers}
                        onManageFeatures={handleManageFeatures}
                        onViewAnalytics={handleViewAnalytics}
                      />
                    </div>
                  </div>
                </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Feature Access */}
      {selectedTenant && (
        <div className="w-96 bg-white border-l border-gray-200 shadow-lg">
          <div className="h-full flex flex-col">
            {/* Right Panel Header */}
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{selectedTenant.name}</h3>
                    <p className="text-sm text-gray-600 capitalize">{selectedTenant.plan} Plan</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTenant(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              {/* Tenant Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="text-xs text-gray-600">Users</p>
                      <p className="text-sm font-semibold text-gray-900">{selectedTenant.userCount}/{selectedTenant.maxUsers}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="text-xs text-gray-600">Health</p>
                      <p className="text-sm font-semibold text-gray-900">{selectedTenant.healthScore}%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Navigation */}
            <div className="p-6 border-b border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-4">Quick Actions</h4>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => navigateToTenantUsers(selectedTenant)}
                  className="p-3 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors group"
                >
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Users</span>
                  </div>
                  <p className="text-xs text-blue-600 mt-1">Manage users</p>
                </button>
                
                <button
                  onClick={() => navigateToTenantFeatures(selectedTenant)}
                  className="p-3 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors group"
                >
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-900">Features</span>
                  </div>
                  <p className="text-xs text-green-600 mt-1">Manage features</p>
                </button>
                
                <button
                  onClick={() => navigateToTenantSecurity(selectedTenant)}
                  className="p-3 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 transition-colors group"
                >
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-medium text-red-900">Security</span>
                  </div>
                  <p className="text-xs text-red-600 mt-1">Security settings</p>
                </button>
                
                <button
                  onClick={() => navigateToTenantAnalytics(selectedTenant)}
                  className="p-3 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors group"
                >
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-900">Analytics</span>
                  </div>
                  <p className="text-xs text-purple-600 mt-1">View reports</p>
                </button>
              </div>
            </div>

            {/* Feature Access Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">Feature Access</h4>
                  <span className="text-sm text-gray-600">
                    {tenantFeatures.filter(tf => tf.isEnabled).length} of {platformFeatures.length} enabled
                  </span>
                </div>

                <div className="space-y-4">
                  {Object.entries(groupedFeatures).map(([category, features]) => (
                    <div key={category}>
                      <h5 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        {category}
                      </h5>
                      <div className="space-y-2">
                        {features.map((feature) => {
                          const tenantFeature = tenantFeatures.find(tf => tf.featureId === feature.id);
                          const isEnabled = tenantFeature?.isEnabled || false;
                          const isTrial = tenantFeature?.isTrial || false;
                          
                          return (
                            <div key={feature.id} className={`p-3 rounded-lg border transition-all duration-200 ${
                              isEnabled ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                            }`}>
                              <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <p className="text-sm font-medium text-gray-900 truncate">{feature.name}</p>
                                    {feature.isPremium && (
                                      <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                                        Pro
                                      </span>
                                    )}
                                    {isTrial && (
                                      <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                                        Trial
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-600 truncate">{feature.description}</p>
                                </div>
                                <button
                                  onClick={() => toggleFeature(selectedTenant.id, feature.id, !isEnabled)}
                                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ml-2 ${
                                    isEnabled ? 'bg-green-600' : 'bg-gray-200'
                                  }`}
                                >
                                  <span
                                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                                      isEnabled ? 'translate-x-5' : 'translate-x-1'
                                    }`}
                                  />
                                </button>
                              </div>
                              
                              {isEnabled && tenantFeature && (
                                <div className="mt-2 text-xs text-gray-500 space-y-1">
                                  {tenantFeature.enabledAt && (
                                    <div>✓ Enabled {new Date(tenantFeature.enabledAt).toLocaleDateString()}</div>
                                  )}
                                  {tenantFeature.usageCount > 0 && (
                                    <div>📊 Used {tenantFeature.usageCount} times</div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Panel Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <button 
                onClick={() => setShowFeatureModal(true)}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Manage All Features
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feature Management Modal */}
      {showFeatureModal && selectedTenant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Manage Features - {selectedTenant.name}
                </h3>
                <button
                  onClick={() => setShowFeatureModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="space-y-6">
                {Object.entries(groupedFeatures).map(([category, features]) => (
                  <div key={category}>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">{category}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {features.map((feature) => {
                        const tenantFeature = tenantFeatures.find(tf => tf.featureId === feature.id);
                        const isEnabled = tenantFeature?.isEnabled || false;
                        
                        return (
                          <div key={feature.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h5 className="font-medium text-gray-900">{feature.name}</h5>
                                <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                                {feature.requiresLicense && (
                                  <span className="inline-block mt-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                                    Requires License
                                  </span>
                                )}
                              </div>
                              <button
                                onClick={() => toggleFeature(selectedTenant.id, feature.id, !isEnabled)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                  isEnabled ? 'bg-blue-600' : 'bg-gray-200'
                                }`}
                              >
                                <span
                                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    isEnabled ? 'translate-x-6' : 'translate-x-1'
                                  }`}
                                />
                              </button>
                            </div>
                            {isEnabled && tenantFeature?.enabledAt && (
                              <p className="text-xs text-gray-500">
                                Enabled: {new Date(tenantFeature.enabledAt).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowFeatureModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => setShowFeatureModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Tenant Modal */}
      <CreateTenantModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateTenantSuccess}
      />

      <EditTenantModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedTenant(null);
        }}
        onSuccess={handleEditSuccess}
        tenant={selectedTenant}
      />

      <DeleteTenantModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedTenant(null);
        }}
        onConfirm={handleDeleteSuccess}
        tenant={selectedTenant}
      />

      <TenantUsersModal
        isOpen={showUsersModal}
        onClose={() => {
          setShowUsersModal(false);
          setSelectedTenant(null);
        }}
        tenant={selectedTenant}
      />

      <TenantAnalyticsModal
        isOpen={showAnalyticsModal}
        onClose={() => {
          setShowAnalyticsModal(false);
          setSelectedTenant(null);
        }}
        tenant={selectedTenant}
      />
    </div>
  );
}

export function TenantManagement() {
  return (
    <ToastProvider>
      <TenantManagementContent />
    </ToastProvider>
  );
}