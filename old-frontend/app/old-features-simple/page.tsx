'use client';

import { useState, useEffect } from 'react';

export default function OldFeaturesSimplePage() {
  const [features, setFeatures] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuresRes, categoriesRes] = await Promise.all([
          fetch('/api/admin/features'),
          fetch('/api/admin/feature-categories'),
        ]);

        const featuresData = await featuresRes.json();
        const categoriesData = await categoriesRes.json();

        if (featuresData.success) setFeatures(featuresData.data);
        if (categoriesData.success) setCategories(categoriesData.data);
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
          <p className="text-gray-600">Loading features...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">❌ OLD FEATURES UI</h1>
              <p className="text-gray-600">This is the original UI with "too much text" problem</p>
            </div>
            <div className="flex space-x-3">
              <a 
                href="/clean-features"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                See Clean UI
              </a>
              <a 
                href="/feature-comparison"
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Compare UIs
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Feature Categories Section - OLD UI */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Feature Categories</h2>
          <p className="text-gray-600 mb-6">Select a category to view available features</p>
          
          <div className="space-y-4">
            {categories.map((category) => {
              const categoryFeatures = features.filter(f => f.categoryId === category.id);
              return (
                <div key={category.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{category.displayName}</h3>
                      <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-gray-500">
                        {categoryFeatures.length} features available
                      </span>
                    </div>
                  </div>
                  
                  {categoryFeatures.length > 0 ? (
                    <div className="space-y-3">
                      {categoryFeatures.map((feature) => (
                        <div key={feature.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{feature.displayName}</h4>
                            <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                            <div className="flex items-center space-x-4 mt-2">
                              <span className="text-xs text-gray-500">
                                Status: <span className="font-medium text-green-600">Active</span>
                              </span>
                              <span className="text-xs text-gray-500">
                                Type: <span className="font-medium text-blue-600">Core Feature</span>
                              </span>
                              <span className="text-xs text-gray-500">
                                Access: <span className="font-medium text-purple-600">All Tenants</span>
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <button className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 transition-colors">
                              View Details
                            </button>
                            <button className="px-3 py-1 text-xs bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition-colors">
                              Configure
                            </button>
                            <button className="px-3 py-1 text-xs bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors">
                              Manage Access
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>No features available in this category</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Problems with OLD UI */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-800 mb-3">❌ Problems with OLD UI:</h3>
          <ul className="text-sm text-red-700 space-y-2">
            <li>• <strong>Too much text everywhere</strong> - overwhelming for users</li>
            <li>• <strong>No visual hierarchy</strong> - everything looks the same</li>
            <li>• <strong>Hard to distinguish</strong> categories from features</li>
            <li>• <strong>Too many action buttons</strong> - user doesn't know which to click</li>
            <li>• <strong>Information overload</strong> - too many details at once</li>
            <li>• <strong>Poor scanning</strong> - hard to quickly find what you need</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
