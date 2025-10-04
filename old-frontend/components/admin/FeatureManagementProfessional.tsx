/**
 * FeatureManagementProfessional.tsx
 * 
 * Professional Enterprise-Grade Feature Management Interface
 * 
 * Features:
 * - Clean, professional list view (no boxes or dropdowns)
 * - Easy-to-scan categories and features
 * - Enterprise-grade UX design
 * - Intuitive navigation and selection
 * - Modern, clean interface
 * 
 * @author BlickTrack Development Team
 * @version 2.0.0
 * @created 2025-10-02
 */

'use client';

import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, 
  ChevronDown, 
  Shield, 
  CheckCircle, 
  XCircle,
  Settings,
  Eye,
  EyeOff,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Grid,
  List,
  Star,
  Lock,
  Unlock,
  Zap,
  BarChart3,
  Users,
  Building2,
  Key,
  FileText,
  Database,
  Globe,
  ShieldCheck,
  AlertTriangle,
  Info
} from 'lucide-react';

interface Feature {
  id: string;
  name: string;
  displayName: string;
  description: string;
  type: string;
  level: number;
  isActive: boolean;
  isVisible: boolean;
  isPremium: boolean;
  isAddOn: boolean;
  requiresLicense: boolean;
  children?: Feature[];
  categories?: Array<{
    id: string;
    order: number;
    isPrimary: boolean;
    category: {
      id: string;
      name: string;
      displayName: string;
      icon: string;
      color: string;
    };
  }>;
}

interface Category {
  id: string;
  name: string;
  displayName: string;
  description: string;
  icon: string;
  color: string;
  order: number;
  isActive: boolean;
  isVisible: boolean;
}

interface FeatureManagementProfessionalProps {
  tenantId?: string;
  tenantName?: string;
}

const getCategoryIcon = (iconName: string) => {
  const iconMap: { [key: string]: any } = {
    'shield': Shield,
    'check-circle': CheckCircle,
    'chart-bar': BarChart3,
    'users': Users,
    'building': Building2,
    'key': Key,
    'file-text': FileText,
    'database': Database,
    'globe': Globe,
    'shield-check': ShieldCheck,
    'alert-triangle': AlertTriangle,
    'info': Info,
    'zap': Zap
  };
  return iconMap[iconName] || Shield;
};

const getFeatureIcon = (featureName: string) => {
  const iconMap: { [key: string]: any } = {
    'threat-modeling': Shield,
    'basic-threat-modeling': FileText,
    'ai-enhanced-threat-modeling': Zap,
    'compliance': CheckCircle,
    'analytics': BarChart3,
    'integrations': Globe,
    'security': ShieldCheck,
    'users': Users,
    'tenants': Building2,
    'permissions': Key,
    'reports': BarChart3,
    'settings': Settings
  };
  return iconMap[featureName] || Settings;
};

export default function FeatureManagementProfessional({ tenantId, tenantName }: FeatureManagementProfessionalProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      console.log('🔍 [PROFESSIONAL FEATURES] Fetching data...');
      
      const [categoriesRes, featuresRes] = await Promise.all([
        fetch('/api/admin/feature-categories'),
        fetch('/api/admin/features')
      ]);

      const [categoriesData, featuresData] = await Promise.all([
        categoriesRes.json(),
        featuresRes.json()
      ]);

      if (categoriesData.success) {
        setCategories(categoriesData.data);
        console.log('✅ [PROFESSIONAL FEATURES] Categories loaded:', categoriesData.data.length);
      }

      if (featuresData.success) {
        setFeatures(featuresData.data);
        console.log('✅ [PROFESSIONAL FEATURES] Features loaded:', featuresData.data.length);
      }

    } catch (error) {
      console.error('❌ [PROFESSIONAL FEATURES] Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

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
    return features.filter(feature => 
      feature.categories?.some(cat => cat.category.id === categoryId) && !feature.parentId
    );
  };

  const getSubFeatures = (featureId: string) => {
    return features.filter(feature => feature.parentId === featureId);
  };

  const filteredCategories = categories.filter(category =>
    category.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getFeaturesForCategory(category.id).some(feature =>
      feature.displayName.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading features...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Feature Management</h1>
              <p className="text-gray-600 mt-1">Manage platform features and capabilities</p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search features..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-white shadow-sm text-blue-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-white shadow-sm text-blue-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex">
        {/* Categories Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Categories</h2>
            <p className="text-sm text-gray-500 mt-1">{filteredCategories.length} categories</p>
          </div>
          
          <div className="p-4 space-y-1">
            {filteredCategories.map(category => {
              const categoryFeatures = getFeaturesForCategory(category.id);
              const isExpanded = expandedCategories.has(category.id);
              const IconComponent = getCategoryIcon(category.icon);
              
              return (
                <div key={category.id} className="mb-2">
                  <button
                    onClick={() => {
                      toggleCategoryExpanded(category.id);
                      setSelectedCategory(category.id);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                      selectedCategory === category.id
                        ? 'bg-blue-50 border border-blue-200 shadow-sm'
                        : 'hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: category.color + '15', color: category.color }}
                      >
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-medium text-gray-900">{category.displayName}</h3>
                        <p className="text-sm text-gray-500">{categoryFeatures.length} features</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-400">{categoryFeatures.length}</span>
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </button>

                  {/* Features List */}
                  {isExpanded && (
                    <div className="ml-4 mt-2 space-y-1">
                      {categoryFeatures.map(feature => {
                        const subFeatures = getSubFeatures(feature.id);
                        const FeatureIcon = getFeatureIcon(feature.name);
                        
                        return (
                          <div key={feature.id} className="group">
                            <button
                              onClick={() => setSelectedFeature(feature)}
                              className={`w-full flex items-center justify-between p-2 rounded-md transition-all duration-200 ${
                                selectedFeature?.id === feature.id
                                  ? 'bg-blue-100 border border-blue-200'
                                  : 'hover:bg-gray-50 border border-transparent'
                              }`}
                            >
                              <div className="flex items-center space-x-2">
                                <FeatureIcon className="w-4 h-4 text-gray-500" />
                                <div className="text-left">
                                  <h4 className="text-sm font-medium text-gray-900">{feature.displayName}</h4>
                                  <p className="text-xs text-gray-500">{feature.description}</p>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-1">
                                {feature.isPremium && (
                                  <Star className="w-3 h-3 text-yellow-500" />
                                )}
                                {feature.requiresLicense && (
                                  <Lock className="w-3 h-3 text-gray-400" />
                                )}
                                {feature.isActive ? (
                                  <CheckCircle className="w-3 h-3 text-green-500" />
                                ) : (
                                  <XCircle className="w-3 h-3 text-red-500" />
                                )}
                              </div>
                            </button>

                            {/* Sub-features */}
                            {subFeatures.length > 0 && (
                              <div className="ml-4 mt-1 space-y-1">
                                {subFeatures.map(subFeature => {
                                  const SubFeatureIcon = getFeatureIcon(subFeature.name);
                                  
                                  return (
                                    <button
                                      key={subFeature.id}
                                      onClick={() => setSelectedFeature(subFeature)}
                                      className={`w-full flex items-center justify-between p-2 rounded-md transition-all duration-200 ${
                                        selectedFeature?.id === subFeature.id
                                          ? 'bg-blue-100 border border-blue-200'
                                          : 'hover:bg-gray-50 border border-transparent'
                                      }`}
                                    >
                                      <div className="flex items-center space-x-2">
                                        <SubFeatureIcon className="w-3 h-3 text-gray-400" />
                                        <span className="text-xs text-gray-700">{subFeature.displayName}</span>
                                      </div>
                                      
                                      <div className="flex items-center space-x-1">
                                        {subFeature.isActive ? (
                                          <CheckCircle className="w-3 h-3 text-green-500" />
                                        ) : (
                                          <XCircle className="w-3 h-3 text-red-500" />
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
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Feature Details */}
        <div className="flex-1 p-6">
          {selectedFeature ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {(() => {
                      const FeatureIcon = getFeatureIcon(selectedFeature.name);
                      return <FeatureIcon className="w-6 h-6 text-blue-600" />;
                    })()}
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{selectedFeature.displayName}</h2>
                      <p className="text-gray-600">{selectedFeature.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {selectedFeature.isActive ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <XCircle className="w-3 h-3 mr-1" />
                        Inactive
                      </span>
                    )}
                    
                    {selectedFeature.isPremium && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Star className="w-3 h-3 mr-1" />
                        Premium
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Feature Details</h3>
                    <dl className="space-y-2">
                      <div>
                        <dt className="text-sm text-gray-500">Type</dt>
                        <dd className="text-sm text-gray-900 capitalize">{selectedFeature.type}</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-500">Level</dt>
                        <dd className="text-sm text-gray-900">{selectedFeature.level}</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-500">Visibility</dt>
                        <dd className="text-sm text-gray-900">
                          {selectedFeature.isVisible ? 'Visible' : 'Hidden'}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-500">License Required</dt>
                        <dd className="text-sm text-gray-900">
                          {selectedFeature.requiresLicense ? 'Yes' : 'No'}
                        </dd>
                      </div>
                    </dl>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Actions</h3>
                    <div className="space-y-2">
                      <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Feature
                      </button>
                      <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                        <Settings className="w-4 h-4 mr-2" />
                        Configure
                      </button>
                      <button className="w-full flex items-center justify-center px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Feature</h3>
              <p className="text-gray-500">Choose a feature from the sidebar to view its details and manage settings.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

