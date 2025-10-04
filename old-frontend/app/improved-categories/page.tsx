'use client';

import { useState } from 'react';
import {
  Search,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  XCircle,
  Shield,
  FileText,
  BarChart3,
  Settings,
  Folder,
  Crown,
  Lock,
  Plus,
  Circle,
  Zap,
  Database,
  AlertTriangle,
  Users,
  Building2,
} from 'lucide-react';

export default function ImprovedCategoriesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<any>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // Mock data based on your structure
  const categories = [
    {
      id: 'analytics',
      name: 'analytics',
      displayName: 'Analytics',
      description: 'Data visualization and reporting tools for insights.',
      icon: '📊',
      color: '#10B981', // Green
      order: 1,
      featureCount: 1,
    },
    {
      id: 'compliance',
      name: 'compliance',
      displayName: 'Compliance',
      description: 'Tools and features for regulatory compliance and governance.',
      icon: '⚖️',
      color: '#3B82F6', // Blue
      order: 2,
      featureCount: 1,
    },
    {
      id: 'integration',
      name: 'integration',
      displayName: 'Integration',
      description: 'Connect with third-party services and platforms.',
      icon: '🔌',
      color: '#F59E0B', // Amber
      order: 3,
      featureCount: 1,
    },
    {
      id: 'it-security',
      name: 'it-security',
      displayName: 'IT Security',
      description: 'Information technology security features.',
      icon: '🛡️',
      color: '#EF4444', // Red
      order: 4,
      featureCount: 0,
    },
    {
      id: 'ot-security',
      name: 'ot-security',
      displayName: 'OT Security',
      description: 'Operational technology security features.',
      icon: '🏭',
      color: '#8B5CF6', // Purple
      order: 5,
      featureCount: 0,
    },
    {
      id: 'product-security',
      name: 'product-security',
      displayName: 'Product Security',
      description: 'Product security and vulnerability management.',
      icon: '🔒',
      color: '#06B6D4', // Cyan
      order: 6,
      featureCount: 3,
    },
  ];

  const features = [
    {
      id: 'analytics-dashboard',
      name: 'analytics-dashboard',
      displayName: 'Analytics Dashboard',
      description: 'Visualize key metrics and insights.',
      categoryId: 'analytics',
      isPremium: false,
      requiresLicense: false,
      isAddOn: false,
      isActive: true,
      children: [],
    },
    {
      id: 'compliance-management',
      name: 'compliance-management',
      displayName: 'Compliance Management',
      description: 'Manage and track regulatory compliance.',
      categoryId: 'compliance',
      isPremium: true,
      requiresLicense: true,
      isAddOn: false,
      isActive: true,
      children: [],
    },
    {
      id: 'third-party-integrations',
      name: 'third-party-integrations',
      displayName: 'Third-Party Integrations',
      description: 'Connect with external services and APIs.',
      categoryId: 'integration',
      isPremium: false,
      requiresLicense: false,
      isAddOn: true,
      isActive: true,
      children: [],
    },
    {
      id: 'sbom-management',
      name: 'sbom-management',
      displayName: 'SBOM Management',
      description: 'Software Bill of Materials management.',
      categoryId: 'product-security',
      isPremium: false,
      requiresLicense: false,
      isAddOn: false,
      isActive: true,
      children: [],
    },
    {
      id: 'vulnerability-management',
      name: 'vulnerability-management',
      displayName: 'Vulnerability Management',
      description: 'Identify and manage security vulnerabilities.',
      categoryId: 'product-security',
      isPremium: true,
      requiresLicense: true,
      isAddOn: false,
      isActive: true,
      children: [],
    },
    {
      id: 'threat-modeling',
      name: 'threat-modeling',
      displayName: 'Threat Modeling',
      description: 'Identify, assess, and mitigate security threats.',
      categoryId: 'product-security',
      isPremium: false,
      requiresLicense: false,
      isAddOn: false,
      isActive: true,
      children: [],
    },
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

  const getFeaturesForCategory = (categoryId: string) => {
    return features.filter(f => f.categoryId === categoryId);
  };

  const getFeatureIcon = (featureName: string) => {
    switch (featureName) {
      case 'analytics-dashboard':
        return BarChart3;
      case 'compliance-management':
        return FileText;
      case 'third-party-integrations':
        return Settings;
      case 'sbom-management':
        return Database;
      case 'vulnerability-management':
        return AlertTriangle;
      case 'threat-modeling':
        return Shield;
      default:
        return Zap;
    }
  };

  const getFeatureColor = (feature: any) => {
    if (feature.isPremium) return '#F59E0B'; // Amber for premium
    if (feature.requiresLicense) return '#8B5CF6'; // Purple for license required
    if (feature.isAddOn) return '#06B6D4'; // Cyan for add-ons
    return '#6B7280'; // Gray for regular features
  };

  const getFeatureShape = (feature: any) => {
    if (feature.isPremium) return Crown;
    if (feature.requiresLicense) return Lock;
    if (feature.isAddOn) return Plus;
    return Circle;
  };

  const filteredCategories = categories
    .filter(category =>
      category.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Feature Categories</h1>
              <p className="text-gray-600 mt-1">Select a category to view available features</p>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search categories or features..."
                className="w-64 pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-blue-50 border-b border-blue-200 px-6 py-3">
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <Folder className="w-4 h-4 text-blue-600" />
            <span className="text-gray-700 font-medium">Categories</span>
          </div>
          <div className="flex items-center space-x-2">
            <Circle className="w-4 h-4 text-gray-600" />
            <span className="text-gray-700">Regular Features</span>
          </div>
          <div className="flex items-center space-x-2">
            <Crown className="w-4 h-4 text-yellow-600" />
            <span className="text-gray-700">Premium Features</span>
          </div>
          <div className="flex items-center space-x-2">
            <Lock className="w-4 h-4 text-purple-600" />
            <span className="text-gray-700">License Required</span>
          </div>
          <div className="flex items-center space-x-2">
            <Plus className="w-4 h-4 text-cyan-600" />
            <span className="text-gray-700">Add-ons</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex">
        {/* Categories Sidebar */}
        <div className="w-80 bg-white shadow-sm min-h-screen">
          <div className="p-4 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Folder className="w-5 h-5 mr-2 text-blue-600" />
              Categories
            </h2>
            <p className="text-sm text-gray-500 mt-1">{filteredCategories.length} categories</p>
          </div>
          
          <div className="p-4 space-y-3">
            {filteredCategories.map(category => {
              const categoryFeatures = getFeaturesForCategory(category.id);
              const isExpanded = expandedCategories.has(category.id);
              
              return (
                <div key={category.id}>
                  {/* Category Header */}
                  <button
                    onClick={() => {
                      toggleCategoryExpanded(category.id);
                      setSelectedCategory(category.id);
                    }}
                    className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${
                      selectedCategory === category.id
                        ? 'bg-blue-100 shadow-md border-2 border-blue-300'
                        : 'hover:bg-gray-50 border-2 border-transparent hover:border-gray-200'
                    }`}
                    style={{ borderLeftColor: category.color, borderLeftWidth: '4px' }}
                  >
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl shadow-lg"
                        style={{ backgroundColor: category.color }}
                      >
                        {category.icon}
                      </div>
                      <div className="text-left flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg">{category.displayName}</h3>
                        <p className="text-sm text-gray-600">{category.description}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                            {categoryFeatures.length} features available
                          </span>
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: category.color }}></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-gray-400">{categoryFeatures.length}</span>
                      {categoryFeatures.length > 0 && (
                        <div className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                        </div>
                      )}
                    </div>
                  </button>

                  {/* Features Dropdown */}
                  {isExpanded && categoryFeatures.length > 0 && (
                    <div className="mt-3 ml-6 space-y-2">
                      {categoryFeatures.map((feature, index) => {
                        const FeatureIcon = getFeatureIcon(feature.name);
                        const featureColor = getFeatureColor(feature);
                        const FeatureShape = getFeatureShape(feature);
                        
                        return (
                          <div key={feature.id} className="group">
                            <button
                              onClick={() => setSelectedFeature(feature)}
                              className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                                selectedFeature?.id === feature.id
                                  ? 'bg-blue-50 shadow-sm border border-blue-200'
                                  : 'hover:bg-gray-50 border border-transparent hover:border-gray-200'
                              }`}
                            >
                              <div className="flex items-center space-x-3">
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm font-medium text-gray-400 w-4">{index + 1}</span>
                                  <FeatureShape className="w-4 h-4" style={{ color: featureColor }} />
                                  <FeatureIcon className="w-4 h-4 text-gray-600" />
                                </div>
                                <div className="text-left">
                                  <h4 className="text-sm font-medium text-gray-900">{feature.displayName}</h4>
                                  <p className="text-xs text-gray-500">{feature.description}</p>
                                  <div className="flex items-center space-x-1 mt-1">
                                    {feature.isPremium && (
                                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                        <Crown className="w-3 h-3 mr-1" />
                                        Premium
                                      </span>
                                    )}
                                    {feature.requiresLicense && (
                                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                        <Lock className="w-3 h-3 mr-1" />
                                        License
                                      </span>
                                    )}
                                    {feature.isAddOn && (
                                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800">
                                        <Plus className="w-3 h-3 mr-1" />
                                        Add-on
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                {feature.isActive ? (
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                ) : (
                                  <XCircle className="w-4 h-4 text-red-500" />
                                )}
                              </div>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Empty State for Categories with No Features */}
                  {isExpanded && categoryFeatures.length === 0 && (
                    <div className="mt-3 ml-6 p-4 bg-gray-50 rounded-lg text-center">
                      <div className="text-gray-400 mb-2">
                        <Folder className="w-8 h-8 mx-auto" />
                      </div>
                      <p className="text-sm text-gray-500">No features available</p>
                      <p className="text-xs text-gray-400 mt-1">Features will appear here when added</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Feature Details */}
        <div className="flex-1 p-6">
          {selectedFeature ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 shadow-sm bg-gradient-to-r from-gray-50 to-blue-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {(() => {
                      const FeatureIcon = getFeatureIcon(selectedFeature.name);
                      const featureColor = getFeatureColor(selectedFeature);
                      const FeatureShape = getFeatureShape(selectedFeature);
                      return (
                        <>
                          <FeatureShape className="w-6 h-6" style={{ color: featureColor }} />
                          <FeatureIcon className="w-8 h-8 text-blue-600" />
                        </>
                      );
                    })()}
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{selectedFeature.displayName}</h2>
                      <p className="text-gray-600">{selectedFeature.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {selectedFeature.isPremium && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                        <Crown className="w-4 h-4 mr-1" />
                        Premium
                      </span>
                    )}
                    {selectedFeature.requiresLicense && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                        <Lock className="w-4 h-4 mr-1" />
                        License Required
                      </span>
                    )}
                    {selectedFeature.isAddOn && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-cyan-100 text-cyan-800">
                        <Plus className="w-4 h-4 mr-1" />
                        Add-on
                      </span>
                    )}
                    {selectedFeature.isActive ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                        <XCircle className="w-4 h-4 mr-1" />
                        Inactive
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Feature Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                  <div>
                    <p className="font-medium text-gray-500">Name</p>
                    <p>{selectedFeature.name}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500">Type</p>
                    <p>Feature</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500">Premium</p>
                    <p>{selectedFeature.isPremium ? 'Yes' : 'No'}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500">License Required</p>
                    <p>{selectedFeature.requiresLicense ? 'Yes' : 'No'}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500">Add-on</p>
                    <p>{selectedFeature.isAddOn ? 'Yes' : 'No'}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500">Active</p>
                    <p>{selectedFeature.isActive ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-500 border border-gray-200">
              <Shield className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-xl font-medium">Select a category to view available features</p>
              <p className="text-sm mt-2">Choose a category from the left sidebar to see its features.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

