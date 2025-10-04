'use client';

import { useState, useEffect } from 'react';

export default function SimplePlatformAdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [features, setFeatures] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('🔍 [SIMPLE ADMIN] Fetching data...');
        
        // Fetch features
        const featuresRes = await fetch('/api/admin/features');
        const featuresData = await featuresRes.json();
        console.log('📊 [SIMPLE ADMIN] Features response:', featuresData);
        
        if (featuresData.success) {
          setFeatures(featuresData.data);
        }
        
        // Fetch tenants
        const tenantsRes = await fetch('/api/admin/tenants');
        const tenantsData = await tenantsRes.json();
        console.log('🏢 [SIMPLE ADMIN] Tenants response:', tenantsData);
        
        if (tenantsData.success) {
          setTenants(tenantsData.data);
        }
        
        // Fetch stats
        const statsRes = await fetch('/api/admin/stats');
        const statsData = await statsRes.json();
        console.log('📈 [SIMPLE ADMIN] Stats response:', statsData);
        
        if (statsData.success) {
          setStats(statsData.data);
        }
        
      } catch (error) {
        console.error('❌ [SIMPLE ADMIN] Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading Platform Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Platform Admin Dashboard</h1>
        
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Total Tenants</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.totalTenants}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">Active Users</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.activeUsers}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm font-medium text-gray-500">System Health</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.systemHealth}%</p>
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Features ({features.length})</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((feature: any) => (
                <div key={feature.id} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900">{feature.displayName}</h3>
                  <p className="text-sm text-gray-500 mt-1">{feature.description}</p>
                  <div className="mt-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      feature.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {feature.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tenants Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Tenants ({tenants.length})</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tenants.map((tenant: any) => (
                <div key={tenant.id} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900">{tenant.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{tenant.description}</p>
                  <div className="mt-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      tenant.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {tenant.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

