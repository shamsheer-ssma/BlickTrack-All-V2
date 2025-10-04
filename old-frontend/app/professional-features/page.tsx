'use client';

import { useState, useEffect } from 'react';
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
} from 'lucide-react';

export default function ProfessionalFeaturesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('priority');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<any>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);

  // Professional data structure with clean naming
  const categories = [
    {
      id: 'security',
      name: 'Security',
      description: 'Security and threat management features',
      icon: Shield,
      color: '#EF4444',
      bgColor: '#FEF2F2',
      borderColor: '#FECACA',
      order: 1,
      features: [
        {
          id: 'threat-modeling',
          name: 'Threat Modeling',
          description: 'Identify, assess, and mitigate security threats using industry-standard methodologies.',
          type: 'feature',
          level: 1,
          priority: 'high',
          isActive: true,
          isVisible: true,
          isPremium: false,
          requiresLicense: false,
          isAddOn: false,
          subscriptionPlan: 'Enterprise',
          tags: ['security', 'analysis', 'compliance'],
          subFeatures: [
            {
              id: 'basic-threat-modeling',
              name: 'Basic Threat Modeling',
              description: 'Fundamental threat identification and assessment.',
              isActive: true,
              isVisible: true,
            },
            {
              id: 'ai-enhanced-threat-modeling',
              name: 'AI Enhanced Threat Modeling',
              description: 'Advanced AI-driven threat analysis and recommendations.',
              isActive: true,
              isVisible: true,
            },
            {
              id: 'automated-analysis',
              name: 'Automated Analysis',
              description: 'Automated threat analysis and reporting.',
              isActive: true,
              isVisible: true,
            }
          ]
        }
      ]
    },
    {
      id: 'compliance',
      name: 'Compliance',
      description: 'Regulatory compliance and governance tools',
      icon: FileText,
      color: '#3B82F6',
      bgColor: '#EFF6FF',
      borderColor: '#BFDBFE',
      order: 2,
      features: [
        {
          id: 'compliance-management',
          name: 'Compliance Management',
          description: 'Comprehensive compliance tracking and reporting for various regulations.',
          type: 'feature',
          level: 1,
          priority: 'high',
          isActive: true,
          isVisible: true,
          isPremium: true,
          requiresLicense: true,
          isAddOn: false,
          subscriptionPlan: 'Professional',
          tags: ['compliance', 'governance', 'reporting'],
          subFeatures: []
        }
      ]
    },
    {
      id: 'analytics',
      name: 'Analytics',
      description: 'Data visualization and reporting tools',
      icon: BarChart3,
      color: '#10B981',
      bgColor: '#ECFDF5',
      borderColor: '#BBF7D0',
      order: 3,
      features: [
        {
          id: 'analytics-dashboard',
          name: 'Analytics Dashboard',
          description: 'Comprehensive analytics and reporting dashboard with real-time insights.',
          type: 'feature',
          level: 1,
          priority: 'medium',
          isActive: true,
          isVisible: true,
          isPremium: false,
          requiresLicense: false,
          isAddOn: true,
          subscriptionPlan: 'Starter',
          tags: ['analytics', 'reporting', 'dashboard'],
          subFeatures: []
        }
      ]
    },
    {
      id: 'integrations',
      name: 'Integrations',
      description: 'Third-party service integrations',
      icon: Settings,
      color: '#F59E0B',
      bgColor: '#FFFBEB',
      borderColor: '#FDE68A',
      order: 4,
      features: [
        {
          id: 'third-party-integrations',
          name: 'Third-Party Integrations',
          description: 'Connect with external services and APIs for seamless workflows.',
          type: 'feature',
          level: 1,
          priority: 'medium',
          isActive: true,
          isVisible: true,
          isPremium: false,
          requiresLicense: false,
          isAddOn: true,
          subscriptionPlan: 'Professional',
          tags: ['integrations', 'api', 'workflow'],
          subFeatures: []
        }
      ]
    },
    {
      id: 'product-security',
      name: 'Product Security',
      description: 'Product security and vulnerability management',
      icon: Database,
      color: '#8B5CF6',
      bgColor: '#F3E8FF',
      borderColor: '#DDD6FE',
      order: 5,
      features: [
        {
          id: 'sbom-management',
          name: 'SBOM Management',
          description: 'Software Bill of Materials management and tracking.',
          type: 'feature',
          level: 1,
          priority: 'high',
          isActive: true,
          isVisible: true,
          isPremium: true,
          requiresLicense: true,
          isAddOn: false,
          subscriptionPlan: 'Enterprise',
          tags: ['sbom', 'inventory', 'security'],
          subFeatures: []
        },
        {
          id: 'vulnerability-management',
          name: 'Vulnerability Management',
          description: 'Comprehensive vulnerability identification and remediation tracking.',
          type: 'feature',
          level: 1,
          priority: 'high',
          isActive: true,
          isVisible: true,
          isPremium: true,
          requiresLicense: true,
          isAddOn: false,
          subscriptionPlan: 'Enterprise',
          tags: ['vulnerability', 'security', 'remediation'],
          subFeatures: []
        }
      ]
    }
  ];

  const subscriptionPlans = [
    { id: 'starter', name: 'Starter', price: 29, features: ['analytics-dashboard'] },
    { id: 'professional', name: 'Professional', price: 99, features: ['compliance-management', 'third-party-integrations'] },
    { id: 'enterprise', name: 'Enterprise', price: 499, features: ['threat-modeling', 'sbom-management', 'vulnerability-management'] }
  ];

  const tenants = [
    { id: 'tenant-1', name: 'Acme Corp', status: 'active', plan: 'Enterprise', users: 150 },
    { id: 'tenant-2', name: 'TechStart Inc', status: 'trial', plan: 'Professional', users: 25 },
    { id: 'tenant-3', name: 'Global Systems', status: 'active', plan: 'Starter', users: 8 }
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
      case 'Threat Modeling':
        return Shield;
      case 'Compliance Management':
        return FileText;
      case 'Analytics Dashboard':
        return BarChart3;
      case 'Third-Party Integrations':
        return Settings;
      case 'SBOM Management':
        return Database;
      case 'Vulnerability Management':
        return AlertTriangle;
      default:
        return Circle;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusBadge = (isActive: boolean, isVisible: boolean) => {
    if (isActive && isVisible) {
      return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200"><CheckCircle className="w-3 h-3 mr-1" />Active</span>;
    } else if (isActive && !isVisible) {
      return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200"><EyeOff className="w-3 h-3 mr-1" />Hidden</span>;
    } else {
      return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200"><XCircle className="w-3 h-3 mr-1" />Inactive</span>;
    }
  };

  const filteredCategories = categories
    .filter(category =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.features.some(feature =>
        feature.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feature.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Feature Management</h1>
              <p className="text-gray-600 mt-1">Manage features, subscriptions, and tenant access</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <Plus className="w-4 h-4 mr-2" />
                Add Feature
              </button>
              <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Search and Filters */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search features, categories, or descriptions..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="priority">Sort by Priority</option>
              <option value="name">Sort by Name</option>
              <option value="category">Sort by Category</option>
            </select>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Categories Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Categories</h2>
            <p className="text-xs text-gray-500 mt-1">{filteredCategories.length} categories</p>
          </div>
          
          <div className="p-4 space-y-2">
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
                        ? 'bg-blue-50 border-2 border-blue-200 shadow-sm'
                        : 'hover:bg-gray-50 border-2 border-transparent hover:border-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-sm"
                        style={{ backgroundColor: category.color }}
                      >
                        <CategoryIcon className="w-5 h-5" />
                      </div>
                      <div className="text-left flex-1">
                        <h3 className="font-semibold text-gray-900 text-sm">{category.name}</h3>
                        <p className="text-xs text-gray-500">{category.features.length} features</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-gray-400">{category.features.length}</span>
                      {category.features.length > 0 && (
                        <div className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                          <ChevronDown className="w-4 h-4 text-gray-500" />
                        </div>
                      )}
                    </div>
                  </button>

                  {/* Features List */}
                  {isExpanded && category.features.length > 0 && (
                    <div className="mt-2 ml-4 space-y-1">
                      {category.features.map((feature, index) => {
                        const FeatureIcon = getFeatureIcon(feature.name);
                        const isFeatureSelected = selectedFeature?.id === feature.id;
                        
                        return (
                          <button
                            key={feature.id}
                            onClick={() => setSelectedFeature(feature)}
                            className={`w-full flex items-center justify-between p-2 rounded-md transition-all duration-200 ${
                              isFeatureSelected
                                ? 'bg-blue-50 border border-blue-200 shadow-sm'
                                : 'hover:bg-gray-50 border border-transparent hover:border-gray-200'
                            }`}
                          >
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-medium text-gray-400 w-4">{index + 1}</span>
                              <FeatureIcon className="w-4 h-4 text-gray-600" />
                              <div className="text-left">
                                <h4 className="text-sm font-medium text-gray-900">{feature.name}</h4>
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
                            {getStatusBadge(feature.isActive, feature.isVisible)}
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

        {/* Main Content */}
        <div className="flex-1 p-6">
          {selectedFeature ? (
            <div className="space-y-6">
              {/* Feature Header Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {(() => {
                        const FeatureIcon = getFeatureIcon(selectedFeature.name);
                        return <FeatureIcon className="w-8 h-8 text-blue-600" />;
                      })()}
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">{selectedFeature.name}</h2>
                        <p className="text-gray-600 mt-1">{selectedFeature.description}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(selectedFeature.priority)}`}>
                            {selectedFeature.priority.toUpperCase()} PRIORITY
                          </span>
                          {getStatusBadge(selectedFeature.isActive, selectedFeature.isVisible)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </button>
                      <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Feature Details */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Type</h3>
                      <p className="text-sm text-gray-900 capitalize">{selectedFeature.type}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Level</h3>
                      <p className="text-sm text-gray-900">Level {selectedFeature.level}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Subscription Plan</h3>
                      <p className="text-sm text-gray-900">{selectedFeature.subscriptionPlan}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Premium</h3>
                      <p className="text-sm text-gray-900">{selectedFeature.isPremium ? 'Yes' : 'No'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">License Required</h3>
                      <p className="text-sm text-gray-900">{selectedFeature.requiresLicense ? 'Yes' : 'No'}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Add-on</h3>
                      <p className="text-sm text-gray-900">{selectedFeature.isAddOn ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                  
                  {selectedFeature.tags && selectedFeature.tags.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedFeature.tags.map((tag: string) => (
                          <span key={tag} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Sub-features Card */}
              {selectedFeature.subFeatures && selectedFeature.subFeatures.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Sub-features</h3>
                      <button className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Sub-feature
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-3">
                      {selectedFeature.subFeatures.map((subFeature: any, index: number) => (
                        <div key={subFeature.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <span className="text-sm font-medium text-gray-400 w-6">{index + 1}</span>
                            <div>
                              <h4 className="font-medium text-gray-900">{subFeature.name}</h4>
                              <p className="text-sm text-gray-600">{subFeature.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getStatusBadge(subFeature.isActive, subFeature.isVisible)}
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

              {/* Subscription Details Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Subscription Details</h3>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Active Subscription</h4>
                        <p className="text-sm text-gray-600">{selectedFeature.subscriptionPlan} Plan</p>
                      </div>
                    </div>
                    <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                      Modify Subscription
                    </button>
                  </div>
                </div>
              </div>

              {/* Tenant Access Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Tenant Access</h3>
                    <button className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Tenant
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  {tenants.length > 0 ? (
                    <div className="space-y-3">
                      {tenants.map(tenant => (
                        <div key={tenant.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Building2 className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{tenant.name}</h4>
                              <p className="text-sm text-gray-600">{tenant.users} users • {tenant.plan} Plan</p>
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
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="w-8 h-8 text-gray-400" />
                      </div>
                      <h4 className="text-lg font-medium text-gray-900 mb-2">No Tenants Assigned</h4>
                      <p className="text-gray-600 mb-4">No tenants have access to this feature yet.</p>
                      <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Grant Access to Tenants
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-500 border border-gray-200">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Feature</h3>
              <p className="text-gray-600">Choose a feature from the left sidebar to view its details and manage access.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}