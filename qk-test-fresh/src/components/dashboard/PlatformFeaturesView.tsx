'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Settings, 
  Shield, 
  Network, 
  Database, 
  Search, 
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  X,
  ArrowRight,
  Zap,
  Lock,
  ShieldCheck,
  Activity,
  BarChart3,
  Building2,
  Sparkles,
  TrendingUp,
  Clock,
  Star,
  Plus,
  Edit,
  Trash2,
  Users,
  Eye
} from 'lucide-react';
import { apiService } from '@/lib/api';
import type { FeatureCategory, Feature } from '@/types/dashboard';

export default function PlatformFeaturesView() {
  const [featureCategories, setFeatureCategories] = useState<FeatureCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [showRightPanel, setShowRightPanel] = useState(false);
  const [tenantsWithAccess, setTenantsWithAccess] = useState<any[]>([]);

  const loadFeatureCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const categories = await apiService.getFeatureCategories();
      setFeatureCategories(categories);
    } catch (err) {
      console.error('Error loading feature categories:', err);
      setError('Failed to load feature categories');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadTenantsWithAccess = useCallback(async (featureId: string) => {
    try {
      // This would be a real API call to get tenants with access to this feature
      // For now, using dummy data
      const dummyTenants = [
        { id: '1', name: 'Acme Corporation', plan: 'Enterprise', users: 142, status: 'Active' },
        { id: '2', name: 'TechStart Inc', plan: 'Premium', users: 38, status: 'Active' },
        { id: '3', name: 'Global Manufacturing', plan: 'Professional', users: 89, status: 'Trial' }
      ];
      setTenantsWithAccess(dummyTenants);
    } catch (err) {
      console.error('Error loading tenants with access:', err);
      setTenantsWithAccess([]);
    }
  }, []);

  useEffect(() => {
    loadFeatureCategories();
  }, [loadFeatureCategories]);

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'it security':
        return <Shield className="w-4 h-4" />;
      case 'product security':
        return <Database className="w-4 h-4" />;
      case 'ot security':
        return <Network className="w-4 h-4" />;
      default:
        return <Settings className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'it security':
        return {
          bg: 'bg-gradient-to-br from-blue-50 to-blue-100',
          border: 'border-blue-200',
          text: 'text-blue-800',
          icon: 'text-blue-600',
          accent: 'bg-blue-500',
          card: 'from-blue-500 to-blue-600'
        };
      case 'product security':
        return {
          bg: 'bg-gradient-to-br from-green-50 to-green-100',
          border: 'border-green-200',
          text: 'text-green-800',
          icon: 'text-green-600',
          accent: 'bg-green-500',
          card: 'from-green-500 to-green-600'
        };
      case 'ot security':
        return {
          bg: 'bg-gradient-to-br from-purple-50 to-purple-100',
          border: 'border-purple-200',
          text: 'text-purple-800',
          icon: 'text-purple-600',
          accent: 'bg-purple-500',
          card: 'from-purple-500 to-purple-600'
        };
      default:
        return {
          bg: 'bg-gradient-to-br from-gray-50 to-gray-100',
          border: 'border-gray-200',
          text: 'text-gray-800',
          icon: 'text-gray-600',
          accent: 'bg-gray-500',
          card: 'from-gray-500 to-gray-600'
        };
    }
  };

  const getFeatureIcon = (featureName: string) => {
    const name = featureName.toLowerCase();
    if (name.includes('threat')) return <ShieldCheck className="w-4 h-4" />;
    if (name.includes('compliance')) return <CheckCircle className="w-4 h-4" />;
    if (name.includes('risk')) return <AlertTriangle className="w-4 h-4" />;
    if (name.includes('network')) return <Network className="w-4 h-4" />;
    if (name.includes('code')) return <Database className="w-4 h-4" />;
    if (name.includes('sso')) return <Lock className="w-4 h-4" />;
    if (name.includes('monitoring')) return <Activity className="w-4 h-4" />;
    return <Zap className="w-4 h-4" />;
  };

  const handleFeatureClick = (feature: Feature) => {
    setSelectedFeature(feature);
    setShowRightPanel(true);
    loadTenantsWithAccess(feature.id);
  };

  const handleCloseRightPanel = () => {
    setShowRightPanel(false);
    setSelectedFeature(null);
  };

  const filteredCategories = featureCategories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.features.some(feature => 
                           feature.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           feature.description.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    const matchesCategory = selectedCategory === 'all' || category.name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Platform Features</h3>
          <p className="text-gray-600">Please wait...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Unable to Load Features</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadFeatureCategories}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50 min-h-screen">
      {/* Compact Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Platform Features</h1>
              <p className="text-sm text-gray-500">Manage platform capabilities across all tenants</p>
            </div>
          </div>
          <button
            onClick={loadFeatureCategories}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="text-sm">Refresh</span>
          </button>
        </div>
      </div>

      {/* Main Content with Right Panel */}
      <div className="flex-1 flex">
        {/* Main Content Area */}
        <div className={`flex-1 transition-all duration-300 ${showRightPanel ? 'mr-80' : ''}`}>
          {/* Compact Stats Cards */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-1">Total Features</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {featureCategories.reduce((sum, cat) => sum + cat.features.length, 0)}
                    </p>
                  </div>
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Settings className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-1">Sub-Features</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {featureCategories.reduce((sum, cat) => 
                        sum + cat.features.reduce((fSum, f) => fSum + f.subFeatures.length, 0), 0
                      )}
                    </p>
                  </div>
                  <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                    <Activity className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-1">Categories</p>
                    <p className="text-2xl font-bold text-gray-900">{featureCategories.length}</p>
                  </div>
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-1">Active Tenants</p>
                    <p className="text-2xl font-bold text-gray-900">12</p>
                  </div>
                  <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Compact Search and Filters */}
          <div className="px-6 pb-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search features..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>
                <div className="sm:w-48">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="all">All Categories</option>
                    {featureCategories.map(category => (
                      <option key={category.name} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Compact Features Grid */}
          <div className="px-6 pb-6">
            <div className="space-y-6">
              {filteredCategories.map(category => {
                const colors = getCategoryColor(category.name);
                return (
                  <div key={category.name} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                    <div className={`px-4 py-3 ${colors.bg} border-b ${colors.border}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 ${colors.bg} ${colors.border} border rounded-lg flex items-center justify-center`}>
                            <div className={colors.icon}>
                              {getCategoryIcon(category.name)}
                            </div>
                          </div>
                          <div>
                            <h3 className={`text-lg font-semibold ${colors.text}`}>{category.name}</h3>
                            <p className="text-sm text-gray-600">{category.features.length} features</p>
                          </div>
                        </div>
                        <div className={`px-3 py-1 ${colors.accent} text-white rounded-lg text-sm font-medium`}>
                          {category.features.length} Features
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {category.features.map(feature => (
                          <div
                            key={feature.id}
                            className="group p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer bg-gradient-to-br from-white to-gray-50 hover:from-blue-50 hover:to-indigo-50"
                            onClick={() => handleFeatureClick(feature)}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                                  <div className="text-white">
                                    {getFeatureIcon(feature.name)}
                                  </div>
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors text-sm">{feature.name}</h4>
                                  <p className="text-xs text-gray-500">Feature</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <ArrowRight className="w-3 h-3 text-gray-400 group-hover:text-blue-500 transition-colors" />
                              </div>
                            </div>
                            
                            <p className="text-gray-600 text-xs mb-3 line-clamp-2 leading-relaxed">{feature.description}</p>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3 text-xs text-gray-500">
                                <div className="flex items-center space-x-1">
                                  <Activity className="w-3 h-3" />
                                  <span>{feature.subFeatures.length} sub-features</span>
                                </div>
                              </div>
                              <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                                Active
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Panel */}
        {showRightPanel && selectedFeature && (
          <div className="w-80 bg-white border-l border-gray-200 shadow-lg flex flex-col">
            {/* Right Panel Header */}
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <div className="text-white">
                      {getFeatureIcon(selectedFeature.name)}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{selectedFeature.name}</h3>
                    <p className="text-sm text-gray-500">{selectedFeature.subFeatures.length} sub-features</p>
                  </div>
                </div>
                <button
                  onClick={handleCloseRightPanel}
                  className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Right Panel Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Feature Description */}
              <div className="p-4 border-b border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Description</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{selectedFeature.description}</p>
              </div>

              {/* Sub-Features Section */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-gray-900">Sub-Features</h4>
                  <button className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors flex items-center space-x-1">
                    <Plus className="w-3 h-3" />
                    <span>Add</span>
                  </button>
                </div>
                
                {selectedFeature.subFeatures.length > 0 ? (
                  <div className="space-y-2">
                    {selectedFeature.subFeatures.map(subFeature => (
                      <div key={subFeature.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h6 className="font-medium text-gray-900 text-sm mb-1">{subFeature.name}</h6>
                            <p className="text-xs text-gray-600 leading-relaxed">{subFeature.description}</p>
                          </div>
                          <div className="flex items-center space-x-1 ml-2">
                            <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                              <Edit className="w-3 h-3" />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Zap className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No sub-features defined</p>
                    <p className="text-xs text-gray-400">Click "Add" to create one</p>
                  </div>
                )}
              </div>

              {/* Tenants with Access */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-gray-900">Tenants with Access</h4>
                  <span className="text-xs text-gray-500">{tenantsWithAccess.length} tenants</span>
                </div>
                
                {tenantsWithAccess.length > 0 ? (
                  <div className="space-y-2">
                    {tenantsWithAccess.map(tenant => (
                      <div key={tenant.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h6 className="font-medium text-gray-900 text-sm">{tenant.name}</h6>
                            <div className="flex items-center space-x-3 mt-1">
                              <span className="text-xs text-gray-500">{tenant.plan}</span>
                              <span className="text-xs text-gray-500">{tenant.users} users</span>
                              <span className={`text-xs px-2 py-1 rounded ${
                                tenant.status === 'Active' 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}>
                                {tenant.status}
                              </span>
                            </div>
                          </div>
                          <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                            <Eye className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Users className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No tenants have access</p>
                    <p className="text-xs text-gray-400">This feature is not assigned to any tenant</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}