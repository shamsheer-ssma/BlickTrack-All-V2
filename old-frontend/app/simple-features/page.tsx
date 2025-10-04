'use client';

import { useState } from 'react';
import {
  Search,
  Shield,
  FileText,
  BarChart3,
  Settings,
  Database,
  AlertTriangle,
  Crown,
  CheckCircle,
  XCircle,
  Plus,
  Users,
  Building2,
  Edit,
  MoreVertical,
  Play,
  Pause,
} from 'lucide-react';

export default function SimpleFeaturesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFeature, setSelectedFeature] = useState<any>(null);

  // Ultra-simple data structure
  const features = [
    {
      id: 'threat-modeling',
      name: 'Threat Modeling',
      category: 'Security',
      icon: Shield,
      color: '#EF4444',
      status: 'active',
      isPremium: false,
      tenants: 3,
      subFeatures: 3
    },
    {
      id: 'compliance-management',
      name: 'Compliance Management',
      category: 'Compliance',
      icon: FileText,
      color: '#3B82F6',
      status: 'active',
      isPremium: true,
      tenants: 2,
      subFeatures: 0
    },
    {
      id: 'analytics-dashboard',
      name: 'Analytics Dashboard',
      category: 'Analytics',
      icon: BarChart3,
      color: '#10B981',
      status: 'active',
      isPremium: false,
      tenants: 5,
      subFeatures: 0
    },
    {
      id: 'third-party-integrations',
      name: 'Third-Party Integrations',
      category: 'Integrations',
      icon: Settings,
      color: '#F59E0B',
      status: 'active',
      isPremium: false,
      tenants: 1,
      subFeatures: 0
    },
    {
      id: 'sbom-management',
      name: 'SBOM Management',
      category: 'Product Security',
      icon: Database,
      color: '#8B5CF6',
      status: 'active',
      isPremium: true,
      tenants: 2,
      subFeatures: 0
    },
    {
      id: 'vulnerability-management',
      name: 'Vulnerability Management',
      category: 'Product Security',
      icon: AlertTriangle,
      color: '#8B5CF6',
      status: 'active',
      isPremium: true,
      tenants: 2,
      subFeatures: 0
    }
  ];

  const filteredFeatures = features.filter(feature =>
    feature.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    feature.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'inactive': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'paused': return <Pause className="w-4 h-4 text-yellow-500" />;
      default: return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Ultra-clean Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">Features</h1>
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Feature
            </button>
          </div>
        </div>
      </div>

      {/* Simple Search */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
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

      <div className="p-6">
        {selectedFeature ? (
          <div className="max-w-4xl mx-auto">
            {/* Feature Header */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
                    style={{ backgroundColor: selectedFeature.color }}
                  >
                    <selectedFeature.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedFeature.name}</h2>
                    <p className="text-gray-600">{selectedFeature.category}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
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

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-medium text-gray-900">Status</h3>
                <p className="text-sm text-gray-500">Active</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-medium text-gray-900">Tenants</h3>
                <p className="text-sm text-gray-500">{selectedFeature.tenants}</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Settings className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-medium text-gray-900">Sub-features</h3>
                <p className="text-sm text-gray-500">{selectedFeature.subFeatures}</p>
              </div>
            </div>

            {/* Back Button */}
            <button
              onClick={() => setSelectedFeature(null)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              ← Back to Features
            </button>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFeatures.map(feature => {
                const FeatureIcon = feature.icon;
                
                return (
                  <div
                    key={feature.id}
                    onClick={() => setSelectedFeature(feature)}
                    className="bg-white rounded-lg border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                        style={{ backgroundColor: feature.color }}
                      >
                        <FeatureIcon className="w-5 h-5" />
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(feature.status)}
                        {feature.isPremium && (
                          <Crown className="w-4 h-4 text-yellow-500" />
                        )}
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 mb-1">{feature.name}</h3>
                    <p className="text-sm text-gray-500 mb-4">{feature.category}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>{feature.tenants} tenants</span>
                      <span>{feature.subFeatures} sub-features</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Empty State */}
            {filteredFeatures.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No features found</h3>
                <p className="text-gray-500">Try adjusting your search terms</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}