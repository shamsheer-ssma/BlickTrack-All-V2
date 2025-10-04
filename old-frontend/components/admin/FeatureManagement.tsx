'use client';

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  FileCheck, 
  BarChart3, 
  Plug, 
  Plus, 
  Search, 
  Filter,
  ChevronRight,
  ChevronDown,
  Settings,
  Users,
  Eye,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Building2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Grid3X3,
  List,
  FolderOpen,
  Cog
} from 'lucide-react';
import { ToastProvider } from '@/components/ui/toast';
import { CategoryManagementModal } from './CategoryManagementModal';
import { FeatureManagementModal } from './FeatureManagementModal';

interface FeatureCategory {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  icon: string;
  color: string;
  order: number;
  isActive: boolean;
  isVisible: boolean;
}

interface Feature {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  categoryId: string;
  category: FeatureCategory;
  parentId?: string;
  parent?: Feature;
  children: Feature[];
  type: 'category' | 'feature' | 'sub-feature' | 'capability';
  level: number;
  order: number;
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

interface FeatureManagementProps {
  tenantId?: string;
  tenantName?: string;
}

interface Tenant {
  id: string;
  name: string;
  plan: string;
  isActive: boolean;
  userCount: number;
  maxUsers: number;
  healthScore: number;
  status: string;
}

interface TenantFeature {
  id: string;
  tenantId: string;
  featureId: string;
  isEnabled: boolean;
  isActive: boolean;
  isTrial: boolean;
  enabledAt?: string;
  disabledAt?: string;
  trialExpiresAt?: string;
  settings: any;
  limits: any;
  usageCount: number;
  lastUsedAt?: string;
}

function FeatureManagementContent({ tenantId, tenantName }: FeatureManagementProps) {
  const [categories, setCategories] = useState<FeatureCategory[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [tenantFeatures, setTenantFeatures] = useState<TenantFeature[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [expandedFeatures, setExpandedFeatures] = useState<Set<string>>(new Set());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCategoryManagement, setShowCategoryManagement] = useState(false);
  const [showFeatureManagement, setShowFeatureManagement] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedFeature) {
      fetchTenantFeatures(selectedFeature.id);
    }
  }, [selectedFeature]);

  const fetchData = async () => {
    setLoading(true);
    try {
      console.log('🔍 [FEATURE MANAGEMENT] Fetching data from API...');
      
      const [categoriesRes, featuresRes, tenantsRes] = await Promise.all([
        fetch('/api/admin/feature-categories'),
        fetch('/api/admin/features'),
        fetch('/api/admin/tenants')
      ]);

      console.log('📊 [FEATURE MANAGEMENT] API responses:', {
        categories: categoriesRes.status,
        features: featuresRes.status,
        tenants: tenantsRes.status
      });

      const [categoriesData, featuresData, tenantsData] = await Promise.all([
        categoriesRes.json(),
        featuresRes.json(),
        tenantsRes.json()
      ]);

      console.log('📊 [FEATURE MANAGEMENT] API data:', {
        categories: categoriesData.success ? categoriesData.data?.length : 'failed',
        features: featuresData.success ? featuresData.data?.length : 'failed',
        tenants: tenantsData.success ? tenantsData.data?.length : 'failed'
      });

      if (categoriesData.success) {
        setCategories(categoriesData.data);
        console.log('✅ [FEATURE MANAGEMENT] Categories loaded:', categoriesData.data.length);
      } else {
        console.error('❌ [FEATURE MANAGEMENT] Categories failed:', categoriesData.error);
      }
      
      if (featuresData.success) {
        setFeatures(featuresData.data);
        console.log('✅ [FEATURE MANAGEMENT] Features loaded:', featuresData.data.length);
      } else {
        console.error('❌ [FEATURE MANAGEMENT] Features failed:', featuresData.error);
      }
      
      if (tenantsData.success) {
        setTenants(tenantsData.data);
        console.log('✅ [FEATURE MANAGEMENT] Tenants loaded:', tenantsData.data.length);
      } else {
        console.error('❌ [FEATURE MANAGEMENT] Tenants failed:', tenantsData.error);
      }

      // Auto-expand first category
      if (categoriesData.success && categoriesData.data.length > 0) {
        setExpandedCategories(new Set([categoriesData.data[0].id]));
      }
    } catch (error) {
      console.error('❌ [FEATURE MANAGEMENT] Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTenantFeatures = async (featureId: string) => {
    try {
      // Mock tenant features data
      const mockTenantFeatures = tenants.map(tenant => ({
        tenantId: tenant.id,
        tenantName: tenant.name,
        isEnabled: tenant.features.includes(featureId),
        subscriptionPlan: tenant.subscriptionPlan,
        lastModified: new Date().toISOString()
      }));
      
      setTenantFeatures(mockTenantFeatures);
    } catch (error) {
      console.error('Error fetching tenant features:', error);
    }
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const toggleFeature = (featureId: string) => {
    setExpandedFeatures(prev => {
      const newSet = new Set(prev);
      if (newSet.has(featureId)) {
        newSet.delete(featureId);
      } else {
        newSet.add(featureId);
      }
      return newSet;
    });
  };

  const toggleTenantFeature = async (tenantId: string, featureId: string, enabled: boolean) => {
    try {
      const response = await fetch(`/api/admin/tenants/${tenantId}/features`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featureId, enabled })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setTenantFeatures(prev => 
          prev.map(tf => 
            tf.tenantId === tenantId && tf.featureId === featureId
              ? { ...tf, isEnabled: enabled, enabledAt: enabled ? new Date().toISOString() : tf.enabledAt, disabledAt: enabled ? tf.disabledAt : new Date().toISOString() }
              : tf
          )
        );
      }
    } catch (error) {
      console.error('Error toggling tenant feature:', error);
    }
  };

  const getCategoryIcon = (iconName: string) => {
    const icons: { [key: string]: React.ComponentType<any> } = {
      Shield,
      FileCheck,
      BarChart3,
      Plug
    };
    const IconComponent = icons[iconName] || Shield;
    return <IconComponent className="w-5 h-5" />;
  };

  const getFeatureIcon = (type: string) => {
    switch (type) {
      case 'category': return <Building2 className="w-4 h-4" />;
      case 'feature': return <Shield className="w-4 h-4" />;
      case 'sub-feature': return <Settings className="w-4 h-4" />;
      case 'capability': return <CheckCircle className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
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

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredCategories = categories.filter(category => {
    const categoryFeatures = features.filter(f => 
      f.categories && f.categories.some(cat => cat.category && cat.category.id === category.id)
    );
    const hasMatchingFeatures = categoryFeatures.some(feature => 
      feature.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feature.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return category.isActive && (categoryFilter === 'all' || category.id === categoryFilter) && hasMatchingFeatures;
  });

  const getTenantFeature = (tenantId: string, featureId: string) => {
    return tenantFeatures.find(tf => tf.tenantId === tenantId && tf.featureId === featureId);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 h-96 bg-gray-200 rounded-lg"></div>
            <div className="lg:col-span-2 h-96 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Feature Management</h1>
            <p className="text-gray-600 mt-1">
              {tenantId && tenantName 
                ? `Managing features for ${tenantName}` 
                : 'Manage platform features and tenant access'
              }
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 flex items-center space-x-1 ${
                  viewMode === 'grid' 
                    ? 'bg-white text-gray-900 shadow-sm transform scale-105' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
                <span>Compact</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 flex items-center space-x-1 ${
                  viewMode === 'list' 
                    ? 'bg-white text-gray-900 shadow-sm transform scale-105' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <List className="w-4 h-4" />
                <span>Detailed</span>
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setShowCategoryManagement(true)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
              >
                <FolderOpen className="w-4 h-4" />
                <span>Categories</span>
              </button>
              <button 
                onClick={() => setShowFeatureManagement(true)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
              >
                <Cog className="w-4 h-4" />
                <span>Manage</span>
              </button>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Feature</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">

      {/* Compact Summary Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Features</p>
              <p className="text-2xl font-bold text-gray-900">{features.length}</p>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Features</p>
              <p className="text-2xl font-bold text-green-600">{features.filter(f => f.isActive).length}</p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Premium Features</p>
              <p className="text-2xl font-bold text-yellow-600">{features.filter(f => f.isPremium).length}</p>
            </div>
            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-purple-600">{categories.length}</p>
            </div>
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <FileCheck className="w-4 h-4 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters - Compact */}
      <div className="flex items-center space-x-4 bg-white p-4 rounded-lg border border-gray-200">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search features..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>{category.displayName}</option>
          ))}
        </select>
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <span>Showing {filteredCategories.reduce((acc, cat) => acc + features.filter(f => f.categoryId === cat.id && f.parentId === null).length, 0)} features</span>
          <span>•</span>
          <span>{features.filter(f => f.isPremium).length} premium</span>
          <span>•</span>
          <span>{tenants.length} tenants</span>
          <span>•</span>
          <span className="flex items-center">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
            {tenants.reduce((acc, tenant) => acc + features.filter(f => getTenantFeature(tenant.id, f.id)?.isEnabled).length, 0)} enabled
          </span>
        </div>
      </div>

      {viewMode === 'grid' ? (
        /* Compact Professional Grid View */
        <div className="space-y-4">
          {filteredCategories.map(category => {
            // Get features that belong to this category through the many-to-many relationship
            const categoryFeatures = features.filter(f => 
              f.categories && f.categories.some(cat => cat.category && cat.category.id === category.id) && f.parentId === null
            );
            const subFeatures = features.filter(f => 
              f.categories && f.categories.some(cat => cat.category && cat.category.id === category.id) && f.parentId !== null
            );
            
            return (
              <div key={category.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Category Header - Compact */}
                <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: category.color + '20', color: category.color }}
                      >
                        {getCategoryIcon(category.icon)}
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">{category.displayName}</h2>
                        <p className="text-sm text-gray-600">{categoryFeatures.length} features • {subFeatures.length} sub-features</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        {categoryFeatures.filter(f => f.isActive).length} Active
                      </span>
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Features Grid - Ultra Compact */}
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-3">
                    {categoryFeatures.map(feature => {
                      const featureSubFeatures = features.filter(f => f.parentId === feature.id);
                      const enabledTenants = tenants.filter(tenant => {
                        const tenantFeature = getTenantFeature(tenant.id, feature.id);
                        return tenantFeature?.isEnabled;
                      });
                      
                      return (
                        <div
                          key={feature.id}
                          onClick={() => setSelectedFeature(feature)}
                          className={`group relative p-3 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] ${
                            selectedFeature?.id === feature.id 
                              ? 'border-blue-500 bg-blue-50 shadow-md' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {/* Feature Header */}
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <div className="text-gray-400 group-hover:text-blue-500 transition-colors">
                                {getFeatureIcon(feature.type)}
                              </div>
                              <h3 className="font-medium text-gray-900 text-sm truncate">{feature.displayName}</h3>
                            </div>
                            <div className="flex items-center space-x-1">
                              {featureSubFeatures.length > 0 && (
                                <div className="w-2 h-2 bg-green-400 rounded-full" title={`${featureSubFeatures.length} sub-features`} />
                              )}
                              {feature.isPremium && (
                                <div className="w-2 h-2 bg-yellow-400 rounded-full" title="Premium Feature" />
                              )}
                              {feature.requiresLicense && (
                                <div className="w-2 h-2 bg-blue-400 rounded-full" title="Requires License" />
                              )}
                              {feature.isAddOn && (
                                <div className="w-2 h-2 bg-purple-400 rounded-full" title="Add-on Feature" />
                              )}
                            </div>
                          </div>

                          {/* Feature Description */}
                          <p className="text-xs text-gray-500 mb-3 line-clamp-2">{feature.description}</p>

                          {/* Stats Row */}
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                            <span className="flex items-center space-x-1">
                              <span>{featureSubFeatures.length} sub-features</span>
                              {featureSubFeatures.length > 0 && (
                                <span className="text-blue-500">•</span>
                              )}
                              {featureSubFeatures.length > 0 && (
                                <span className="text-blue-500">
                                  {featureSubFeatures.filter(sf => sf.isPremium).length} premium
                                </span>
                              )}
                            </span>
                            <span>{enabledTenants.length} tenants</span>
                          </div>

                          {/* Subscription Plans */}
                          <div className="flex flex-wrap gap-1 mb-2">
                            {feature.isPremium ? (
                              <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">
                                Pro+
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                                Free
                              </span>
                            )}
                            {feature.requiresLicense && (
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                                License
                              </span>
                            )}
                          </div>

                          {/* Tenant Status */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-1">
                              <div className={`w-2 h-2 rounded-full ${
                                enabledTenants.length > 0 ? 'bg-green-400' : 'bg-gray-300'
                              }`} />
                              <span className="text-xs text-gray-500">
                                {enabledTenants.length > 0 ? 'Enabled' : 'Disabled'}
                              </span>
                            </div>
                            <div className="text-xs text-gray-400">
                              {enabledTenants.length}/{tenants.length}
                            </div>
                          </div>

                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg pointer-events-none" />
                        </div>
                      );
                    })}
                  </div>

                  {/* Sub-features Section - Grouped by Parent Feature */}
                  {categoryFeatures.some(f => features.filter(sf => sf.parentId === f.id).length > 0) && (
                    <div className="mt-6 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-medium text-gray-700">Sub-features by Category</h4>
                        <span className="text-xs text-gray-500">
                          {categoryFeatures.reduce((acc, f) => acc + features.filter(sf => sf.parentId === f.id).length, 0)} total
                        </span>
                      </div>
                      
                      <div className="space-y-4">
                        {categoryFeatures.map(parentFeature => {
                          const parentSubFeatures = features.filter(f => f.parentId === parentFeature.id);
                          if (parentSubFeatures.length === 0) return null;
                          
                          return (
                            <div key={parentFeature.id} className="bg-gray-50 rounded-lg p-4">
                              <div className="flex items-center space-x-2 mb-3">
                                <div className="w-6 h-6 text-gray-500">
                                  {getFeatureIcon(parentFeature.type)}
                                </div>
                                <h5 className="text-sm font-medium text-gray-800">{parentFeature.displayName}</h5>
                                <span className="text-xs text-gray-500">({parentSubFeatures.length} sub-features)</span>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                                {parentSubFeatures.map(subFeature => {
                                  const enabledTenants = tenants.filter(tenant => {
                                    const tenantFeature = getTenantFeature(tenant.id, subFeature.id);
                                    return tenantFeature?.isEnabled;
                                  });
                                  
                                  return (
                                    <div
                                      key={subFeature.id}
                                      onClick={() => setSelectedFeature(subFeature)}
                                      className="p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-200 hover:shadow-sm"
                                    >
                                      <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center space-x-2">
                                          <div className="w-4 h-4 text-gray-400">
                                            {getFeatureIcon(subFeature.type)}
                                          </div>
                                          <span className="text-sm font-medium text-gray-800 truncate">
                                            {subFeature.displayName}
                                          </span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                          {subFeature.isPremium && (
                                            <div className="w-2 h-2 bg-yellow-400 rounded-full" title="Premium" />
                                          )}
                                          {subFeature.requiresLicense && (
                                            <div className="w-2 h-2 bg-blue-400 rounded-full" title="License" />
                                          )}
                                        </div>
                                      </div>
                                      
                                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">{subFeature.description}</p>
                                      
                                      <div className="flex items-center justify-between">
                                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                          subFeature.isPremium 
                                            ? 'bg-yellow-100 text-yellow-700' 
                                            : 'bg-green-100 text-green-700'
                                        }`}>
                                          {subFeature.isPremium ? 'Pro+' : 'Free'}
                                        </span>
                                        <div className="flex items-center space-x-1">
                                          <div className={`w-2 h-2 rounded-full ${
                                            enabledTenants.length > 0 ? 'bg-green-400' : 'bg-gray-300'
                                          }`} />
                                          <span className="text-xs text-gray-500">
                                            {enabledTenants.length}/{tenants.length}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          
          {/* Compact Feature Details Modal */}
          {selectedFeature && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden">
                {/* Modal Header */}
                <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        {getFeatureIcon(selectedFeature.type)}
                      </div>
                      <div>
                        {/* Breadcrumb for sub-features */}
                        {selectedFeature.parentId && (
                          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-1">
                            <span 
                              className="hover:text-blue-600 cursor-pointer"
                              onClick={() => {
                                const parentFeature = features.find(f => f.id === selectedFeature.parentId);
                                if (parentFeature) setSelectedFeature(parentFeature);
                              }}
                            >
                              {features.find(f => f.id === selectedFeature.parentId)?.displayName}
                            </span>
                            <span>›</span>
                            <span className="text-gray-700 font-medium">{selectedFeature.displayName}</span>
                          </div>
                        )}
                        <h3 className="text-xl font-semibold text-gray-900">{selectedFeature.displayName}</h3>
                        <p className="text-sm text-gray-600">{selectedFeature.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        {selectedFeature.isPremium && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                            Premium
                          </span>
                        )}
                        {selectedFeature.requiresLicense && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                            License
                          </span>
                        )}
                        {selectedFeature.isAddOn && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                            Add-on
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => setSelectedFeature(null)}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(95vh-120px)]">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Feature Info */}
                    <div className="lg:col-span-1 space-y-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-3">Feature Details</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Type:</span>
                            <span className="font-medium capitalize">{selectedFeature.type}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Category:</span>
                            <span className="font-medium">{selectedFeature.category.displayName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Level:</span>
                            <span className="font-medium">{selectedFeature.level}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Status:</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              selectedFeature.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {selectedFeature.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Subscription Plans */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-3">Subscription Plans</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Free Plan:</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              !selectedFeature.isPremium ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {!selectedFeature.isPremium ? 'Included' : 'Not Included'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Pro Plan:</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              selectedFeature.isPremium ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {selectedFeature.isPremium ? 'Included' : 'Not Included'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Enterprise:</span>
                            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                              Always Included
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Sub-Features Section */}
                      {(() => {
                        const subFeatures = features.filter(f => f.parentId === selectedFeature.id);
                        if (subFeatures.length === 0) return null;
                        
                        return (
                          <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 mb-3">Sub-Features ({subFeatures.length})</h4>
                            <div className="space-y-3">
                              {subFeatures.map(subFeature => {
                                const enabledTenants = tenants.filter(tenant => {
                                  const tenantFeature = getTenantFeature(tenant.id, subFeature.id);
                                  return tenantFeature?.isEnabled;
                                });
                                
                                return (
                                  <div
                                    key={subFeature.id}
                                    onClick={() => setSelectedFeature(subFeature)}
                                    className="p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                                  >
                                    <div className="flex items-start justify-between mb-2">
                                      <div className="flex items-center space-x-2">
                                        <div className="w-4 h-4 text-gray-400">
                                          {getFeatureIcon(subFeature.type)}
                                        </div>
                                        <span className="text-sm font-medium text-gray-800">
                                          {subFeature.displayName}
                                        </span>
                                      </div>
                                      <div className="flex items-center space-x-1">
                                        {subFeature.isPremium && (
                                          <div className="w-2 h-2 bg-yellow-400 rounded-full" title="Premium" />
                                        )}
                                        {subFeature.requiresLicense && (
                                          <div className="w-2 h-2 bg-blue-400 rounded-full" title="License" />
                                        )}
                                      </div>
                                    </div>
                                    
                                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">{subFeature.description}</p>
                                    
                                    <div className="flex items-center justify-between">
                                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                        subFeature.isPremium 
                                          ? 'bg-yellow-100 text-yellow-700' 
                                          : 'bg-green-100 text-green-700'
                                      }`}>
                                        {subFeature.isPremium ? 'Pro+' : 'Free'}
                                      </span>
                                      <div className="flex items-center space-x-1">
                                        <div className={`w-2 h-2 rounded-full ${
                                          enabledTenants.length > 0 ? 'bg-green-400' : 'bg-gray-300'
                                        }`} />
                                        <span className="text-xs text-gray-500">
                                          {enabledTenants.length}/{tenants.length} tenants
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Tenant Management */}
                    <div className="lg:col-span-2">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-gray-900">Tenant Access Control</h4>
                        <div className="text-sm text-gray-500">
                          {tenants.filter(t => getTenantFeature(t.id, selectedFeature.id)?.isEnabled).length} of {tenants.length} tenants enabled
                        </div>
                      </div>
                      
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {tenants.map(tenant => {
                          const tenantFeature = getTenantFeature(tenant.id, selectedFeature.id);
                          const isEnabled = tenantFeature?.isEnabled || false;
                          const isTrial = tenantFeature?.isTrial || false;
                          
                          return (
                            <div key={tenant.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                  <Building2 className="w-4 h-4 text-blue-600" />
                                </div>
                                <div>
                                  <h5 className="font-medium text-gray-900 text-sm">{tenant.name}</h5>
                                  <div className="flex items-center space-x-3 text-xs text-gray-600">
                                    <span className="capitalize">{tenant.plan}</span>
                                    <span>•</span>
                                    <span>{tenant.userCount}/{tenant.maxUsers} users</span>
                                    <span>•</span>
                                    <div className={`flex items-center ${getHealthColor(tenant.healthScore)}`}>
                                      <div className={`w-1.5 h-1.5 rounded-full mr-1 ${getHealthColor(tenant.healthScore).replace('text-', 'bg-')}`}></div>
                                      {tenant.healthScore}%
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                {isTrial && (
                                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                    Trial
                                  </span>
                                )}
                                <button
                                  onClick={() => toggleTenantFeature(tenant.id, selectedFeature.id, !isEnabled)}
                                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                                    isEnabled ? 'bg-blue-600' : 'bg-gray-300'
                                  }`}
                                >
                                  <span
                                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                                      isEnabled ? 'translate-x-5' : 'translate-x-1'
                                    }`}
                                  />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* List View - Sidebar Layout */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Features List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Features</h2>
              </div>
              <div className="max-h-96 overflow-y-auto">
              {filteredCategories.map(category => {
                const categoryFeatures = features.filter(f => 
                  f.categories && f.categories.some(cat => cat.category && cat.category.id === category.id) && f.parentId === null
                );
                const isExpanded = expandedCategories.has(category.id);
                
                return (
                  <div key={category.id} className="border-b border-gray-100 last:border-b-0">
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: category.color + '20', color: category.color }}
                        >
                          {getCategoryIcon(category.icon)}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{category.displayName}</h3>
                          <p className="text-sm text-gray-500">{categoryFeatures.length} features</p>
                        </div>
                      </div>
                      {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                    
                    {isExpanded && (
                      <div className="bg-gray-50">
                        {categoryFeatures.map(feature => (
                          <div key={feature.id}>
                            <button
                              onClick={() => setSelectedFeature(feature)}
                              className={`w-full px-8 py-3 text-left hover:bg-gray-100 flex items-center space-x-3 ${
                                selectedFeature?.id === feature.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                              }`}
                            >
                              <div className="text-gray-400">
                                {getFeatureIcon(feature.type)}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900">{feature.displayName}</h4>
                                <p className="text-sm text-gray-500">{feature.description}</p>
                                <div className="flex items-center space-x-2 mt-1">
                                  {feature.isPremium && (
                                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                                      Premium
                                    </span>
                                  )}
                                  {feature.requiresLicense && (
                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                      License
                                    </span>
                                  )}
                                  {feature.isAddOn && (
                                    <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                                      Add-on
                                    </span>
                                  )}
                                </div>
                              </div>
                            </button>
                            
                            {/* Sub-features */}
                            {feature.children && feature.children.length > 0 && (
                              <div className="ml-8">
                                {feature.children.map(child => (
                                  <button
                                    key={child.id}
                                    onClick={() => setSelectedFeature(child)}
                                    className={`w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center space-x-3 ${
                                      selectedFeature?.id === child.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                                    }`}
                                  >
                                    <div className="text-gray-400">
                                      {getFeatureIcon(child.type)}
                                    </div>
                                    <div className="flex-1">
                                      <h5 className="text-sm font-medium text-gray-900">{child.displayName}</h5>
                                      <p className="text-xs text-gray-500">{child.description}</p>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Feature Details & Tenant Access */}
        <div className="lg:col-span-2">
          {selectedFeature ? (
            <div className="space-y-6">
              {/* Feature Information */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        {getFeatureIcon(selectedFeature.type)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{selectedFeature.displayName}</h3>
                        <p className="text-gray-600">{selectedFeature.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Feature Details</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Type:</span>
                          <span className="font-medium">{selectedFeature.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Category:</span>
                          <span className="font-medium">{selectedFeature.category.displayName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Level:</span>
                          <span className="font-medium">{selectedFeature.level}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            selectedFeature.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {selectedFeature.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Access Control</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          {selectedFeature.isPremium ? (
                            <CheckCircle className="w-4 h-4 text-yellow-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-gray-400" />
                          )}
                          <span className="text-sm">Premium Feature</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {selectedFeature.requiresLicense ? (
                            <CheckCircle className="w-4 h-4 text-blue-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-gray-400" />
                          )}
                          <span className="text-sm">Requires License</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {selectedFeature.isAddOn ? (
                            <CheckCircle className="w-4 h-4 text-purple-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-gray-400" />
                          )}
                          <span className="text-sm">Add-on Feature</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tenant Access Management */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Tenant Access - {selectedFeature.displayName}
                  </h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {tenants.map(tenant => {
                      const tenantFeature = getTenantFeature(tenant.id, selectedFeature.id);
                      const isEnabled = tenantFeature?.isEnabled || false;
                      const isTrial = tenantFeature?.isTrial || false;
                      
                      return (
                        <div key={tenant.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Building2 className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{tenant.name}</h4>
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <span className="capitalize">{tenant.plan} plan</span>
                                <span>{tenant.userCount}/{tenant.maxUsers} users</span>
                                <div className={`flex items-center ${getHealthColor(tenant.healthScore)}`}>
                                  <div className={`w-2 h-2 rounded-full mr-1 ${getHealthColor(tenant.healthScore).replace('text-', 'bg-')}`}></div>
                                  {tenant.healthScore}%
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            {isTrial && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                Trial
                              </span>
                            )}
                            <button
                              onClick={() => toggleTenantFeature(tenant.id, selectedFeature.id, !isEnabled)}
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
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
              <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Select a feature to view details and manage tenant access</p>
            </div>
          )}
          </div>
        </div>
      )}
        </div>

        {/* Management Modals */}
        <CategoryManagementModal
          isOpen={showCategoryManagement}
          onClose={() => setShowCategoryManagement(false)}
          categories={categories}
          onCategoryChange={fetchData}
        />

        <FeatureManagementModal
          isOpen={showFeatureManagement}
          onClose={() => setShowFeatureManagement(false)}
          features={features}
          categories={categories}
          onFeatureChange={fetchData}
        />
      </div>
    );
  }

  export function FeatureManagement({ tenantId, tenantName }: FeatureManagementProps) {
    return (
      <ToastProvider>
        <FeatureManagementContent tenantId={tenantId} tenantName={tenantName} />
      </ToastProvider>
    );
  }
