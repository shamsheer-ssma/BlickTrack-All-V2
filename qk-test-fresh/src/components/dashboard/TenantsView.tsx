'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Building, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Shield, 
  Users, 
  Calendar,
  Mail,
  Phone,
  Globe,
  CheckCircle,
  XCircle,
  AlertTriangle,
  X
} from 'lucide-react';
import { apiService } from '@/lib/api';

interface Tenant {
  id: string;
  name: string;
  slug: string;
  email: string;
  phone?: string;
  website?: string;
  address?: string;
  status: 'active' | 'inactive' | 'suspended';
  plan: string;
  createdAt: string;
  updatedAt: string;
  contactPerson: string;
  totalUsers: number;
  activeUsers: number;
  features: TenantFeature[];
  licenses: TenantLicense[];
}

interface TenantFeature {
  id: string;
  featureId: string;
  featureName: string;
  category: string;
  isEnabled: boolean;
  purchasedAt: string;
  expiresAt?: string;
  subFeatures: SubFeature[];
}

interface SubFeature {
  id: string;
  name: string;
  isEnabled: boolean;
  description?: string;
}

interface TenantLicense {
  id: string;
  name: string;
  type: 'basic' | 'premium' | 'enterprise';
  maxUsers: number;
  features: string[];
  expiresAt?: string;
  isActive: boolean;
}

export default function TenantsView() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [showRightPanel, setShowRightPanel] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tenantToEdit, setTenantToEdit] = useState<Tenant | null>(null);
  const [tenantToDelete, setTenantToDelete] = useState<Tenant | null>(null);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');
  const [columnFilters, setColumnFilters] = useState({
    name: '',
    email: '',
    status: '',
    plan: '',
    users: '',
    created: ''
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalTenants, setTotalTenants] = useState(0);

  // Load tenants data
  const loadTenants = useCallback(async () => {
    try {
      setLoading(true);
      
      // This would be a real API call
      const response = await apiService.getTenants({
        page: currentPage,
        limit: pageSize,
        search: searchTerm,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        plan: planFilter !== 'all' ? planFilter : undefined
      });
      
      setTenants(response.tenants);
      setTotalTenants(response.total);
    } catch (err) {
      console.error('Error loading tenants:', err);
      setTenants([]);
      setTotalTenants(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, searchTerm, statusFilter, planFilter]);

  useEffect(() => {
    loadTenants();
  }, [loadTenants]);

  // Handle tenant selection
  const handleTenantSelect = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setShowRightPanel(true);
  };

  // Handle edit tenant
  const handleEditTenant = (tenant: Tenant) => {
    setTenantToEdit(tenant);
    setShowEditModal(true);
  };

  // Handle delete tenant
  const handleDeleteTenant = (tenant: Tenant) => {
    setTenantToDelete(tenant);
    setShowDeleteModal(true);
  };

  // Confirm delete tenant
  const confirmDeleteTenant = async () => {
    if (!tenantToDelete) return;
    
    try {
      await apiService.deleteTenant(tenantToDelete.id);
      
      // Remove from local state
      setTenants(prev => prev.filter(t => t.id !== tenantToDelete.id));
      setTotalTenants(prev => prev - 1);
      
      // Close right panel if deleted tenant was selected
      if (selectedTenant?.id === tenantToDelete.id) {
        setShowRightPanel(false);
        setSelectedTenant(null);
      }
      
      setShowDeleteModal(false);
      setTenantToDelete(null);
    } catch (err) {
      console.error('Error deleting tenant:', err);
    }
  };

  // Handle feature access toggle
  const handleFeatureToggle = async (featureId: string, enabled: boolean) => {
    if (!selectedTenant) return;
    
    try {
      await apiService.updateTenantFeature(selectedTenant.id, featureId, { isEnabled: enabled });
      
      // Update local state
      setSelectedTenant(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          features: prev.features.map(f => 
            f.featureId === featureId ? { ...f, isEnabled: enabled } : f
          )
        };
      });
      
      // Update tenants list
      setTenants(prev => prev.map(t => 
        t.id === selectedTenant.id ? {
          ...t,
          features: t.features.map(f => 
            f.featureId === featureId ? { ...f, isEnabled: enabled } : f
          )
        } : t
      ));
    } catch (err) {
      console.error('Error updating feature access:', err);
    }
  };

  // Handle sub-feature toggle
  const handleSubFeatureToggle = async (featureId: string, subFeatureId: string, enabled: boolean) => {
    if (!selectedTenant) return;
    
    try {
      await apiService.updateTenantSubFeature(selectedTenant.id, featureId, subFeatureId, { isEnabled: enabled });
      
      // Update local state
      setSelectedTenant(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          features: prev.features.map(f => 
            f.featureId === featureId ? {
              ...f,
              subFeatures: f.subFeatures.map(sf => 
                sf.id === subFeatureId ? { ...sf, isEnabled: enabled } : sf
              )
            } : f
          )
        };
      });
    } catch (err) {
      console.error('Error updating sub-feature access:', err);
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-50';
      case 'inactive':
        return 'text-gray-600 bg-gray-50';
      case 'suspended':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'inactive':
        return <XCircle className="w-4 h-4" />;
      case 'suspended':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <XCircle className="w-4 h-4" />;
    }
  };

  // Get plan color
  const getPlanColor = (plan: string) => {
    switch (plan.toLowerCase()) {
      case 'enterprise':
        return 'text-purple-600 bg-purple-50';
      case 'premium':
        return 'text-blue-600 bg-blue-50';
      case 'basic':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  // Filter tenants based on search and filters
  const filteredTenants = tenants.filter(tenant => {
    // Search filter
    if (searchTerm && !tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !tenant.email.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Status filter
    if (statusFilter !== 'all' && tenant.status !== statusFilter) {
      return false;
    }
    
    // Plan filter
    if (planFilter !== 'all' && tenant.plan.toLowerCase() !== planFilter.toLowerCase()) {
      return false;
    }
    
    // Column filters
    if (columnFilters.name && !tenant.name.toLowerCase().includes(columnFilters.name.toLowerCase())) {
      return false;
    }
    if (columnFilters.email && !tenant.email.toLowerCase().includes(columnFilters.email.toLowerCase())) {
      return false;
    }
    if (columnFilters.status && tenant.status !== columnFilters.status) {
      return false;
    }
    if (columnFilters.plan && tenant.plan.toLowerCase() !== columnFilters.plan.toLowerCase()) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="flex h-full bg-gray-50 relative">
      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${showRightPanel ? 'mr-80' : ''}`}>
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Tenants Management</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Manage all tenants, their features, and access permissions
                </p>
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                Add Tenant
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <Building className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Tenants</p>
                  <p className="text-2xl font-bold text-gray-900">{totalTenants}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {tenants.filter(t => t.status === 'active').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {tenants.reduce((sum, t) => sum + t.totalUsers, 0)}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center">
                <Shield className="w-8 h-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Features Used</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {tenants.reduce((sum, t) => sum + t.features.filter(f => f.isEnabled).length, 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Search & Filters</h3>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setPlanFilter('all');
                    setColumnFilters({
                      name: '',
                      email: '',
                      status: '',
                      plan: '',
                      users: '',
                      created: ''
                    });
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Clear all
                </button>
              </div>
              
              {/* Main Search */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search tenants by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Filter Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Plan</label>
                  <select
                    value={planFilter}
                    onChange={(e) => setPlanFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Plans</option>
                    <option value="basic">Basic</option>
                    <option value="premium">Premium</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="name">Name</option>
                    <option value="created">Created Date</option>
                    <option value="users">User Count</option>
                    <option value="status">Status</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Tenants Table */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tenant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Plan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Users
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Features
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                          <span className="ml-2">Loading tenants...</span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredTenants.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                        No tenants found
                      </td>
                    </tr>
                  ) : (
                    filteredTenants.map((tenant) => (
                      <tr
                        key={tenant.id}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleTenantSelect(tenant)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                <Building className="h-6 w-6 text-blue-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{tenant.name}</div>
                              <div className="text-sm text-gray-500">{tenant.slug}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{tenant.contactPerson}</div>
                          <div className="text-sm text-gray-500">{tenant.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(tenant.status)}`}>
                            {getStatusIcon(tenant.status)}
                            <span className="ml-1 capitalize">{tenant.status}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPlanColor(tenant.plan)}`}>
                            {tenant.plan}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center">
                            <Users className="w-4 h-4 text-gray-400 mr-1" />
                            {tenant.activeUsers}/{tenant.totalUsers}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center">
                            <Shield className="w-4 h-4 text-gray-400 mr-1" />
                            {tenant.features.filter(f => f.isEnabled).length}/{tenant.features.length}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(tenant.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditTenant(tenant);
                              }}
                              className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-all duration-200 border border-transparent hover:border-blue-200"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteTenant(tenant);
                              }}
                              className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-all duration-200 border border-transparent hover:border-red-200"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  disabled={currentPage * pageSize >= totalTenants}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{' '}
                    <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span>
                    {' '}to{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * pageSize, totalTenants)}
                    </span>
                    {' '}of{' '}
                    <span className="font-medium">{totalTenants}</span>
                    {' '}results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => prev + 1)}
                      disabled={currentPage * pageSize >= totalTenants}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Tenant Details */}
      {showRightPanel && selectedTenant && (
        <div className="absolute right-0 top-0 w-80 h-full bg-white shadow-xl border-l border-gray-200 z-50 overflow-y-auto" style={{ top: '0px', height: '100vh' }}>
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Tenant Details</h2>
              <button
                onClick={() => setShowRightPanel(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tenant Info */}
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center mr-4">
                  <Building className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{selectedTenant.name}</h3>
                  <p className="text-sm text-gray-500">{selectedTenant.slug}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 text-gray-400 mr-3" />
                  <span className="text-sm text-gray-900">{selectedTenant.email}</span>
                </div>
                {selectedTenant.phone && (
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-900">{selectedTenant.phone}</span>
                  </div>
                )}
                {selectedTenant.website && (
                  <div className="flex items-center">
                    <Globe className="w-4 h-4 text-gray-400 mr-3" />
                    <a href={selectedTenant.website} className="text-sm text-blue-600 hover:underline">
                      {selectedTenant.website}
                    </a>
                  </div>
                )}
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 text-gray-400 mr-3" />
                  <span className="text-sm text-gray-900">
                    Created {new Date(selectedTenant.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Status and Plan */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Status</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedTenant.status)}`}>
                  {getStatusIcon(selectedTenant.status)}
                  <span className="ml-1 capitalize">{selectedTenant.status}</span>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Plan</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPlanColor(selectedTenant.plan)}`}>
                  {selectedTenant.plan}
                </span>
              </div>
            </div>

            {/* User Stats */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">User Statistics</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{selectedTenant.totalUsers}</div>
                  <div className="text-xs text-gray-500">Total Users</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{selectedTenant.activeUsers}</div>
                  <div className="text-xs text-gray-500">Active Users</div>
                </div>
              </div>
            </div>

            {/* Features Management */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-gray-700">Feature Access</h4>
                <button
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  Manage All
                </button>
              </div>
              
              <div className="space-y-3">
                {selectedTenant.features.map((feature) => (
                  <div key={feature.id} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{feature.featureName}</div>
                        <div className="text-xs text-gray-500">{feature.category}</div>
                      </div>
                      <button
                        onClick={() => handleFeatureToggle(feature.featureId, !feature.isEnabled)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          feature.isEnabled ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            feature.isEnabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                    
                    {/* Sub-features */}
                    {feature.subFeatures.length > 0 && (
                      <div className="ml-4 space-y-1">
                        {feature.subFeatures.map((subFeature) => (
                          <div key={subFeature.id} className="flex items-center justify-between">
                            <span className="text-xs text-gray-600">{subFeature.name}</span>
                            <button
                              onClick={() => handleSubFeatureToggle(feature.featureId, subFeature.id, !subFeature.isEnabled)}
                              className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors ${
                                subFeature.isEnabled ? 'bg-blue-600' : 'bg-gray-200'
                              }`}
                            >
                              <span
                                className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                                  subFeature.isEnabled ? 'translate-x-4' : 'translate-x-0.5'
                                }`}
                              />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Licenses */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Licenses</h4>
              <div className="space-y-2">
                {selectedTenant.licenses.map((license) => (
                  <div key={license.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{license.name}</div>
                      <div className="text-xs text-gray-500">
                        {license.maxUsers} users • {license.type}
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      license.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {license.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                Edit Tenant
              </button>
              <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                View Users
              </button>
              <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                View Analytics
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Tenant Modal */}
      {showEditModal && tenantToEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Edit Tenant</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  defaultValue={tenantToEdit.name}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  defaultValue={tenantToEdit.email}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                <input
                  type="text"
                  defaultValue={tenantToEdit.contactPerson}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  defaultValue={tenantToEdit.status}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // TODO: Implement update logic
                  setShowEditModal(false);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Tenant Modal */}
      {showDeleteModal && tenantToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Delete Tenant</h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-4">
                Are you sure you want to delete <strong>{tenantToDelete.name}</strong>? 
                This action cannot be undone and will remove all associated data.
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                  <p className="text-sm text-red-800">
                    This will permanently delete the tenant and all its data.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteTenant}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Tenant
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

