'use client';

import { useState, useEffect } from 'react';

export default function SimpleFeaturesRealPage() {
  const [categories, setCategories] = useState([]);
  const [features, setFeatures] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, featuresRes, tenantsRes, subscriptionPlansRes] = await Promise.all([
          fetch('/api/admin/feature-categories'),
          fetch('/api/admin/features'),
          fetch('/api/admin/tenants'),
          fetch('/api/admin/subscription-plans')
        ]);

        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          if (categoriesData.success) {
            setCategories(categoriesData.data);
          }
        }

        if (featuresRes.ok) {
          const featuresData = await featuresRes.json();
          if (featuresData.success) {
            setFeatures(featuresData.data);
          }
        }

        if (tenantsRes.ok) {
          const tenantsData = await tenantsRes.json();
          if (tenantsData.success) {
            setTenants(tenantsData.data);
          }
        }

        if (subscriptionPlansRes.ok) {
          const subscriptionPlansData = await subscriptionPlansRes.json();
          if (subscriptionPlansData.success) {
            setSubscriptionPlans(subscriptionPlansData.data);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
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
          <p className="text-gray-600">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Complete Features Data</h1>
          <p className="text-gray-600">All data from your database - categories, features, tenants, and plans</p>
          <div className="mt-2 text-sm text-gray-500">
            {categories.length} categories • {features.length} features • {tenants.length} tenants • {subscriptionPlans.length} plans
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category, index) => {
              const categoryFeatures = features.filter(f => f.categoryId === category.id);
              const colors = ['bg-red-100', 'bg-blue-100', 'bg-green-100', 'bg-yellow-100', 'bg-purple-100', 'bg-pink-100'];
              const textColors = ['text-red-800', 'text-blue-800', 'text-green-800', 'text-yellow-800', 'text-purple-800', 'text-pink-800'];
              
              return (
                <div key={category.id} className={`p-4 rounded-lg ${colors[index % colors.length]} border`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{category.displayName}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${textColors[index % textColors.length]}`}>
                      {categoryFeatures.length}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                  
                  {categoryFeatures.length > 0 ? (
                    <div className="space-y-2">
                      {categoryFeatures.map((feature) => (
                        <div key={feature.id} className="bg-white p-3 rounded border">
                          <h4 className="font-medium text-gray-900">{feature.displayName}</h4>
                          <p className="text-sm text-gray-600">{feature.description}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No features available</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* All Features */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">All Features ({features.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, index) => {
              const category = categories.find(c => c.id === feature.categoryId);
              const colors = ['bg-red-50', 'bg-blue-50', 'bg-green-50', 'bg-yellow-50', 'bg-purple-50', 'bg-pink-50'];
              const borderColors = ['border-red-200', 'border-blue-200', 'border-green-200', 'border-yellow-200', 'border-purple-200', 'border-pink-200'];
              
              return (
                <div key={feature.id} className={`p-4 rounded-lg border ${colors[index % colors.length]} ${borderColors[index % borderColors.length]}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{feature.displayName}</h3>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{feature.description}</p>
                  <p className="text-xs text-gray-500">Category: {category?.displayName}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tenants */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tenants ({tenants.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tenants.map((tenant) => (
              <div key={tenant.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{tenant.name}</h3>
                <div className="text-xs text-gray-500 mb-3">
                  ID: {tenant.id} • Active: {tenant.isActive ? 'Yes' : 'No'}
                </div>
                <div className="text-sm text-gray-700">
                  Users: {tenant.userCount || 0}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subscription Plans */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Subscription Plans ({subscriptionPlans.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subscriptionPlans.map((plan) => (
              <div key={plan.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{plan.displayName}</h3>
                <div className="text-sm text-gray-600 mb-3">{plan.description}</div>
                <div className="text-xs text-gray-500 mb-3">
                  ID: {plan.id} • Tier: {plan.tier} • Price: ${plan.price}/{plan.billingCycle}
                </div>
                <div className="text-sm text-gray-700">
                  Active: {plan.isActive ? 'Yes' : 'No'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-4">Database Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-3xl font-bold text-blue-600">{categories.length}</div>
              <div className="text-gray-700">Categories</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">{features.length}</div>
              <div className="text-gray-700">Features</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">{tenants.length}</div>
              <div className="text-gray-700">Tenants</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">{subscriptionPlans.length}</div>
              <div className="text-gray-700">Plans</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
