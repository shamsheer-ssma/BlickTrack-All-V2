'use client';

import { useState } from 'react';
import {
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
} from 'lucide-react';

export default function CategoryLayoutPage() {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [selectedFeature, setSelectedFeature] = useState<any>(null);

  // Your exact data structure
  const categories = [
    {
      id: 'analytics',
      name: 'Analytics',
      featureCount: 1,
      features: [
        {
          id: 'analytics-dashboard',
          name: 'Analytics Dashboard',
          description: 'Visualize key metrics and insights.',
          isPremium: false,
          requiresLicense: false,
          isAddOn: false,
          isActive: true,
        }
      ]
    },
    {
      id: 'compliance',
      name: 'Compliance',
      featureCount: 1,
      features: [
        {
          id: 'compliance-management',
          name: 'Compliance Management',
          description: 'Manage and track regulatory compliance.',
          isPremium: true,
          requiresLicense: true,
          isAddOn: false,
          isActive: true,
        }
      ]
    },
    {
      id: 'integration',
      name: 'Integration',
      featureCount: 1,
      features: [
        {
          id: 'third-party-integrations',
          name: 'Third-Party Integrations',
          description: 'Connect with external services and APIs.',
          isPremium: false,
          requiresLicense: false,
          isAddOn: true,
          isActive: true,
        }
      ]
    },
    {
      id: 'it-security',
      name: 'IT Security',
      featureCount: 0,
      features: []
    },
    {
      id: 'ot-security',
      name: 'OT Security',
      featureCount: 0,
      features: []
    },
    {
      id: 'product-security',
      name: 'Product Security',
      featureCount: 3,
      features: [
        {
          id: 'sbom-management',
          name: 'SBOM Management',
          description: 'Software Bill of Materials management.',
          isPremium: false,
          requiresLicense: false,
          isAddOn: false,
          isActive: true,
        },
        {
          id: 'vulnerability-management',
          name: 'Vulnerability Management',
          description: 'Identify and manage security vulnerabilities.',
          isPremium: true,
          requiresLicense: true,
          isAddOn: false,
          isActive: true,
        },
        {
          id: 'threat-modeling',
          name: 'Threat Modeling',
          description: 'Identify, assess, and mitigate security threats.',
          isPremium: false,
          requiresLicense: false,
          isAddOn: false,
          isActive: true,
        }
      ]
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

  const getFeatureIcon = (featureName: string) => {
    switch (featureName) {
      case 'Analytics Dashboard':
        return BarChart3;
      case 'Compliance Management':
        return FileText;
      case 'Third-Party Integrations':
        return Settings;
      case 'SBOM Management':
        return Database;
      case 'Vulnerability Management':
        return AlertTriangle;
      case 'Threat Modeling':
        return Shield;
      default:
        return Circle;
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

  const getCategoryColor = (categoryName: string) => {
    const colors = {
      'Analytics': '#10B981', // Green
      'Compliance': '#3B82F6', // Blue
      'Integration': '#F59E0B', // Amber
      'IT Security': '#EF4444', // Red
      'OT Security': '#8B5CF6', // Purple
      'Product Security': '#06B6D4', // Cyan
    };
    return colors[categoryName as keyof typeof colors] || '#6B7280';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Feature Categories</h1>
        <p className="text-gray-600 mb-8">Select a category to view available features</p>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map(category => {
            const isExpanded = expandedCategories.has(category.id);
            const categoryColor = getCategoryColor(category.name);
            
            return (
              <div key={category.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Category Header */}
                <button
                  onClick={() => toggleCategoryExpanded(category.id)}
                  className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
                  style={{ borderLeftColor: categoryColor, borderLeftWidth: '4px' }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl shadow-lg"
                        style={{ backgroundColor: categoryColor }}
                      >
                        {category.name === 'Analytics' && '📊'}
                        {category.name === 'Compliance' && '⚖️'}
                        {category.name === 'Integration' && '🔌'}
                        {category.name === 'IT Security' && '🛡️'}
                        {category.name === 'OT Security' && '🏭'}
                        {category.name === 'Product Security' && '🔒'}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                        <p className="text-sm text-gray-500">{category.featureCount} features available</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-gray-400">{category.featureCount}</span>
                      {category.featureCount > 0 && (
                        <div className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                        </div>
                      )}
                    </div>
                  </div>
                </button>

                {/* Features List */}
                {isExpanded && (
                  <div className="border-t border-gray-100">
                    {category.features.length > 0 ? (
                      <div className="p-4 space-y-2">
                        {category.features.map((feature, index) => {
                          const FeatureIcon = getFeatureIcon(feature.name);
                          const featureColor = getFeatureColor(feature);
                          const FeatureShape = getFeatureShape(feature);
                          
                          return (
                            <button
                              key={feature.id}
                              onClick={() => setSelectedFeature(feature)}
                              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex items-center space-x-3">
                                <span className="text-sm font-medium text-gray-400 w-4">{index + 1}</span>
                                <FeatureShape className="w-4 h-4" style={{ color: featureColor }} />
                                <FeatureIcon className="w-4 h-4 text-gray-600" />
                                <div className="text-left">
                                  <h4 className="text-sm font-medium text-gray-900">{feature.name}</h4>
                                  <p className="text-xs text-gray-500">{feature.description}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
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
                                {feature.isActive ? (
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                ) : (
                                  <XCircle className="w-4 h-4 text-red-500" />
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-6 text-center text-gray-500">
                        <div className="text-gray-400 mb-2">
                          <Circle className="w-8 h-8 mx-auto" />
                        </div>
                        <p className="text-sm">No features available</p>
                        <p className="text-xs text-gray-400 mt-1">Features will appear here when added</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Feature Details Modal */}
        {selectedFeature && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
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
                      <h2 className="text-xl font-bold text-gray-900">{selectedFeature.name}</h2>
                      <p className="text-gray-600">{selectedFeature.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedFeature(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Feature Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
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
          </div>
        )}
      </div>
    </div>
  );
}

