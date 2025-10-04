'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { 
  Settings,
  Search,
  Filter,
  Building2,
  Users,
  Shield,
  CheckCircle,
  XCircle,
  MoreVertical,
  Edit
} from 'lucide-react';

interface TenantFeatureAccess {
  tenantId: string;
  tenantName: string;
  features: {
    featureId: string;
    featureName: string;
    categoryName: string;
    isEnabled: boolean;
    subscriptionPlan: string;
    lastModified: string;
  }[];
}

export default function FeatureAccessPage() {
  const [tenantAccess, setTenantAccess] = useState<TenantFeatureAccess[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<string>('all');

  useEffect(() => {
    const fetchTenantAccess = async () => {
      try {
        // Mock data for now - replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setTenantAccess([
          {
            tenantId: 'tenant-1',
            tenantName: 'Acme Corporation',
            features: [
              {
                featureId: 'feature-1',
                featureName: 'Basic Threat Modeling',
                categoryName: 'Threat Modeling',
                isEnabled: true,
                subscriptionPlan: 'Pro',
                lastModified: '2025-01-27T10:30:00Z'
              },
              {
                featureId: 'feature-2',
                featureName: 'AI Enhanced Threat Modeling',
                categoryName: 'Threat Modeling',
                isEnabled: false,
                subscriptionPlan: 'Enterprise',
                lastModified: '2025-01-26T15:20:00Z'
              },
              {
                featureId: 'feature-3',
                featureName: 'Vulnerability Scanning',
                categoryName: 'Vulnerability Scanning',
                isEnabled: true,
                subscriptionPlan: 'Pro',
                lastModified: '2025-01-27T09:15:00Z'
              }
            ]
          },
          {
            tenantId: 'tenant-2',
            tenantName: 'TechStart Inc',
            features: [
              {
                featureId: 'feature-1',
                featureName: 'Basic Threat Modeling',
                categoryName: 'Threat Modeling',
                isEnabled: true,
                subscriptionPlan: 'Starter',
                lastModified: '2025-01-25T14:45:00Z'
              },
              {
                featureId: 'feature-3',
                featureName: 'Vulnerability Scanning',
                categoryName: 'Vulnerability Scanning',
                isEnabled: true,
                subscriptionPlan: 'Starter',
                lastModified: '2025-01-25T14:45:00Z'
              }
            ]
          }
        ]);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tenant access:', error);
        setLoading(false);
      }
    };

    fetchTenantAccess();
  }, []);

  const filteredTenants = tenantAccess.filter(tenant =>
    tenant.tenantName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleFeatureAccess = (tenantId: string, featureId: string) => {
    setTenantAccess(prev => 
      prev.map(tenant => 
        tenant.tenantId === tenantId
          ? {
              ...tenant,
              features: tenant.features.map(feature =>
                feature.featureId === featureId
                  ? { ...feature, isEnabled: !feature.isEnabled }
                  : feature
              )
            }
          : tenant
      )
    );
  };

  if (loading) {
    return (
      <Layout showSidebar={true}>
        <div className="px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showSidebar={true}>
      <div className="px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center">
                <Settings className="w-6 h-6 mr-3 text-blue-600" />
                Feature Access Control
              </h1>
              <p className="text-slate-600 mt-1">
                Manage feature access for different tenants and subscription plans
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tenants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Plans</option>
              <option value="starter">Starter</option>
              <option value="pro">Pro</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>
        </div>

        {/* Tenant Access List */}
        <div className="space-y-6">
          {filteredTenants.map((tenant) => (
            <div key={tenant.tenantId} className="bg-white rounded-lg shadow-sm border border-slate-200">
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Building2 className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{tenant.tenantName}</h3>
                      <p className="text-sm text-slate-500">Tenant ID: {tenant.tenantId}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-slate-500">
                      {tenant.features.filter(f => f.isEnabled).length} of {tenant.features.length} features enabled
                    </span>
                    <button className="p-1 text-slate-400 hover:text-slate-600">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tenant.features.map((feature) => (
                    <div key={feature.featureId} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-medium text-slate-900">{feature.featureName}</h4>
                          <p className="text-sm text-slate-500">{feature.categoryName}</p>
                        </div>
                        <button
                          onClick={() => toggleFeatureAccess(tenant.tenantId, feature.featureId)}
                          className={`p-1 rounded-full transition-colors ${
                            feature.isEnabled 
                              ? 'text-green-600 hover:bg-green-100' 
                              : 'text-red-600 hover:bg-red-100'
                          }`}
                        >
                          {feature.isEnabled ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            <XCircle className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          feature.subscriptionPlan === 'Enterprise' 
                            ? 'bg-purple-100 text-purple-800'
                            : feature.subscriptionPlan === 'Pro'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {feature.subscriptionPlan}
                        </span>
                        <span className="text-slate-500">
                          {new Date(feature.lastModified).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTenants.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No tenants found</h3>
            <p className="text-slate-500">
              {searchTerm ? 'Try adjusting your search terms' : 'No tenant access data available'}
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}

