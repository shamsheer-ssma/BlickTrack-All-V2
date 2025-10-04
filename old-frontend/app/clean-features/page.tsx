'use client';

import { useState } from 'react';
import {
  Search,
  Filter,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  XCircle,
  Shield,
  FileText,
  BarChart3,
  Settings,
  Database,
  AlertTriangle,
  Crown,
  Lock,
  Plus,
  Circle,
  Users,
  Building2,
  Star,
  Zap,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  MoreVertical,
  ArrowUpDown,
  Info,
  ExternalLink,
  Check,
  X,
  Play,
  Pause,
  Settings2,
} from 'lucide-react';

export default function CleanFeaturesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<any>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // Simplified data structure with minimal text
  const categories = [
    {
      id: 'security',
      name: 'Security',
      icon: Shield,
      color: '#EF4444',
      bgColor: '#FEF2F2',
      count: 1,
      features: [
        {
          id: 'threat-modeling',
          name: 'Threat Modeling',
          type: 'feature',
          status: 'active',
          priority: 'high',
          isPremium: false,
          subFeatures: 3
        }
      ]
    },
    {
      id: 'compliance',
      name: 'Compliance',
      icon: FileText,
      color: '#3B82F6',
      bgColor: '#EFF6FF',
      count: 1,
      features: [
        {
          id: 'compliance-management',
          name: 'Compliance Management',
          type: 'feature',
          status: 'active',
          priority: 'high',
          isPremium: true,
          subFeatures: 0
        }
      ]
    },
    {
      id: 'analytics',
      name: 'Analytics',
      icon: BarChart3,
      color: '#10B981',
      bgColor: '#ECFDF5',
      count: 1,
      features: [
        {
          id: 'analytics-dashboard',
          name: 'Analytics Dashboard',
          type: 'feature',
          status: 'active',
          priority: 'medium',
          isPremium: false,
          subFeatures: 0
        }
      ]
    },
    {
      id: 'integrations',
      name: 'Integrations',
      icon: Settings,
      color: '#F59E0B',
      bgColor: '#FFFBEB',
      count: 1,
      features: [
        {
          id: 'third-party-integrations',
          name: 'Third-Party Integrations',
          type: 'feature',
          status: 'active',
          priority: 'medium',
          isPremium: false,
          subFeatures: 0
        }
      ]
    },
    {
      id: 'product-security',
      name: 'Product Security',
      icon: Database,
      color: '#8B5CF6',
      bgColor: '#F3E8FF',
      count: 2,
      features: [
        {
          id: 'sbom-management',
          name: 'SBOM Management',
          type: 'feature',
          status: 'active',
          priority: 'high',
          isPremium: true,
          subFeatures: 0
        },
        {
          id: 'vulnerability-management',
          name: 'Vulnerability Management',
          type: 'feature',
          status: 'active',
          priority: 'high',
          isPremium: true,
          subFeatures: 0
        }
      ]
    }
  ];

  const toggleCategoryExpanded = (categoryId: string) => {
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

  const getFeatureIcon = (featureName: string) => {
    switch (featureName) {
      case 'Threat Modeling': return Shield;
      case 'Compliance Management': return FileText;
      case 'Analytics Dashboard': return BarChart3;
      case 'Third-Party Integrations': return Settings;
      case 'SBOM Management': return Database;
      case 'Vulnerability Management': return AlertTriangle;
      default: return Circle;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'inactive': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'paused': return <Pause className="w-4 h-4 text-yellow-500" />;
      default: return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  const filteredCategories = categories
    .filter(category =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.features.some(feature =>
        feature.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Clean Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Features</h1>
              <p className="text-sm text-gray-500">Manage your platform features</p>
            </div>
            <div className="flex items-center space-x-2">
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <Plus className="w-4 h-4 mr-2" />
                Add
              </button>
              <button className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                <Settings2 className="w-4 h-4 mr-2" />
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Simple Search */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search features..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex">
        {/* Clean Sidebar */}
        <div className="w-72 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-4">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Categories</h2>
            <div className="space-y-1">
              {filteredCategories.map(category => {
                const isExpanded = expandedCategories.has(category.id);
                const isSelected = selectedCategory === category.id;
                const CategoryIcon = category.icon;
                
                return (
                  <div key={category.id}>
                    <button
                      onClick={() => {
                        toggleCategoryExpanded(category.id);
                        setSelectedCategory(category.id);
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                        isSelected
                          ? 'bg-blue-50 border border-blue-200'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                          style={{ backgroundColor: category.color }}
                        >
                          <CategoryIcon className="w-4 h-4" />
                        </div>
                        <span className="font-medium text-gray-900">{category.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">{category.count}</span>
                        {category.count > 0 && (
                          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        )}
                      </div>
                    </button>

                    {/* Features List */}
                    {isExpanded && category.features.length > 0 && (
                      <div className="mt-1 ml-4 space-y-1">
                        {category.features.map(feature => {
                          const FeatureIcon = getFeatureIcon(feature.name);
                          const isFeatureSelected = selectedFeature?.id === feature.id;
                          
                          return (
                            <button
                              key={feature.id}
                              onClick={() => setSelectedFeature(feature)}
                              className={`w-full flex items-center justify-between p-2 rounded-md transition-all duration-200 ${
                                isFeatureSelected
                                  ? 'bg-blue-50 border border-blue-200'
                                  : 'hover:bg-gray-50'
                              }`}
                            >
                              <div className="flex items-center space-x-2">
                                <FeatureIcon className="w-4 h-4 text-gray-600" />
                                <span className="text-sm font-medium text-gray-900">{feature.name}</span>
                                {feature.isPremium && (
                                  <Crown className="w-3 h-3 text-yellow-500" />
                                )}
                              </div>
                              <div className="flex items-center space-x-1">
                                {getStatusIcon(feature.status)}
                                {feature.subFeatures > 0 && (
                                  <span className="text-xs text-gray-500">{feature.subFeatures}</span>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content - Clean and Focused */}
        <div className="flex-1 p-6">
          {selectedFeature ? (
            <div className="space-y-6">
              {/* Feature Header - Minimal */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {(() => {
                      const FeatureIcon = getFeatureIcon(selectedFeature.name);
                      return <FeatureIcon className="w-8 h-8 text-blue-600" />;
                    })()}
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{selectedFeature.name}</h2>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(selectedFeature.priority)}`}>
                          {selectedFeature.priority.toUpperCase()}
                        </span>
                        {getStatusIcon(selectedFeature.status)}
                        {selectedFeature.isPremium && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <Crown className="w-3 h-3 mr-1" />
                            Premium
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Actions - Visual Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Status Card */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Status</h3>
                      <p className="text-sm text-gray-500">Active</p>
                    </div>
                  </div>
                </div>

                {/* Subscription Card */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Crown className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Plan</h3>
                      <p className="text-sm text-gray-500">Enterprise</p>
                    </div>
                  </div>
                </div>

                {/* Access Card */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Access</h3>
                      <p className="text-sm text-gray-500">3 tenants</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sub-features - Only if exists */}
              {selectedFeature.subFeatures > 0 && (
                <div className="bg-white rounded-lg border border-gray-200">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900">Sub-features</h3>
                      <button className="inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                        <Plus className="w-3 h-3 mr-1" />
                        Add
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="space-y-2">
                      {['Basic Threat Modeling', 'AI Enhanced Threat Modeling', 'Automated Analysis'].map((subFeature, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <span className="text-sm text-gray-400">{index + 1}</span>
                            <span className="text-sm font-medium text-gray-900">{subFeature}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <button className="text-gray-400 hover:text-gray-600">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tenant Access - Visual List */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">Tenant Access</h3>
                    <button className="inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                      <Plus className="w-3 h-3 mr-1" />
                      Add Tenant
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="space-y-2">
                    {[
                      { name: 'Acme Corp', status: 'active', users: 150 },
                      { name: 'TechStart Inc', status: 'trial', users: 25 },
                      { name: 'Global Systems', status: 'active', users: 8 }
                    ].map((tenant, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Building2 className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-900">{tenant.name}</span>
                            <p className="text-xs text-gray-500">{tenant.users} users</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            tenant.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {tenant.status === 'active' ? <CheckCircle className="w-3 h-3 mr-1" /> : <AlertTriangle className="w-3 h-3 mr-1" />}
                            {tenant.status}
                          </span>
                          <button className="text-gray-400 hover:text-gray-600">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Feature</h3>
              <p className="text-gray-500">Choose a feature from the sidebar to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}