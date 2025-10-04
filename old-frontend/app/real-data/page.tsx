'use client';

import { useState, useEffect } from 'react';

export default function RealDataPage() {
  const [categories, setCategories] = useState([]);
  const [features, setFeatures] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('🔍 [REAL DATA] Fetching real data from database...');
        
        const [categoriesRes, featuresRes, statsRes] = await Promise.all([
          fetch('/api/admin/feature-categories'),
          fetch('/api/admin/features'),
          fetch('/api/admin/stats')
        ]);

        const [categoriesData, featuresData, statsData] = await Promise.all([
          categoriesRes.json(),
          featuresRes.json(),
          statsRes.json()
        ]);

        if (categoriesData.success) {
          setCategories(categoriesData.data);
          console.log('✅ [REAL DATA] Categories loaded from database:', categoriesData.data.length);
        }

        if (featuresData.success) {
          setFeatures(featuresData.data);
          console.log('✅ [REAL DATA] Features loaded from database:', featuresData.data.length);
        }

        if (statsData.success) {
          setStats(statsData.data);
          console.log('✅ [REAL DATA] Stats loaded from database:', statsData.data);
        }

      } catch (error) {
        console.error('❌ [REAL DATA] Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading real data from database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Real Database Data</h1>
        
        {/* Stats */}
        {stats && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Platform Statistics (Real Data)</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-sm font-medium text-gray-500">Total Tenants</h3>
                <p className="text-2xl font-bold text-gray-900">{stats.totalTenants}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-sm font-medium text-gray-500">Active Users</h3>
                <p className="text-2xl font-bold text-gray-900">{stats.activeUsers}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-sm font-medium text-gray-500">System Health</h3>
                <p className="text-2xl font-bold text-gray-900">{stats.systemHealth}%</p>
              </div>
            </div>
          </div>
        )}

        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Feature Categories (Real Data - {categories.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category: any) => (
              <div key={category.id} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg"
                    style={{ backgroundColor: category.color }}
                  >
                    {category.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{category.displayName}</h3>
                    <p className="text-sm text-gray-500">{category.description}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <p>Features: {category.featureCount || 0}</p>
                  <p>Order: {category.order}</p>
                  <p>Active: {category.isActive ? 'Yes' : 'No'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Features (Real Data - {features.length})</h2>
          <div className="space-y-3">
            {features.map((feature: any) => (
              <div key={feature.id} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg mb-2">{feature.displayName}</h3>
                    <p className="text-gray-600 mb-3">{feature.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Type: {feature.type}</span>
                      <span>Level: {feature.level}</span>
                      <span>Order: {feature.order}</span>
                      <span>Visibility: {feature.isVisible ? 'Visible' : 'Hidden'}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {feature.isActive ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        ✓ Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                        ✗ Inactive
                      </span>
                    )}
                    {feature.isPremium && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                        ⭐ Premium
                      </span>
                    )}
                    {feature.requiresLicense && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        🔒 License Required
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

