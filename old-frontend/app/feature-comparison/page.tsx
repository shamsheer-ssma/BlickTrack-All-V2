'use client';

import React, { useState } from 'react';

export default function FeatureComparisonPage() {
  const [activeTab, setActiveTab] = useState<'old' | 'new'>('old');

  const categories = [
    {
      id: '1',
      displayName: 'Security',
      description: 'Security-related features',
      features: [
        { id: '1', displayName: 'Threat Modeling', description: 'Identify and assess security threats' },
        { id: '2', displayName: 'Vulnerability Management', description: 'Track and manage vulnerabilities' }
      ]
    },
    {
      id: '2', 
      displayName: 'Compliance',
      description: 'Compliance and regulatory features',
      features: [
        { id: '3', displayName: 'Compliance Management', description: 'Manage regulatory compliance' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Feature UI Comparison</h1>
        
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('old')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'old'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                ❌ OLD UI (Too Much Text)
              </button>
              <button
                onClick={() => setActiveTab('new')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'new'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                ✅ NEW UI (Clean & Visual)
              </button>
            </nav>
          </div>
        </div>

        {/* OLD UI */}
        {activeTab === 'old' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-red-600 mb-6">❌ OLD UI - Too Much Text</h2>
            
            <div className="space-y-6">
              {categories.map((category) => (
                <div key={category.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{category.displayName}</h3>
                      <p className="text-sm text-gray-600">{category.description}</p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {category.features.length} features available
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    {category.features.map((feature) => (
                      <div key={feature.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div>
                          <p className="font-medium text-gray-900">{feature.displayName}</p>
                          <p className="text-sm text-gray-600">{feature.description}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                            View Details
                          </button>
                          <button className="px-3 py-1 text-xs bg-green-100 text-green-800 rounded">
                            Enable
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded">
              <h4 className="font-semibold text-red-800 mb-2">Problems with OLD UI:</h4>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• Too much text everywhere - overwhelming</li>
                <li>• No visual hierarchy - everything looks the same</li>
                <li>• Hard to distinguish categories from features</li>
                <li>• No clear action buttons</li>
                <li>• User doesn't know where to go</li>
              </ul>
            </div>
          </div>
        )}

        {/* NEW UI */}
        {activeTab === 'new' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-green-600 mb-6">✅ NEW UI - Clean & Visual</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Sidebar - Categories */}
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-4">
                  <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center">
                    <span className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white text-sm mr-3">📁</span>
                    Categories
                  </h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category.id} className="p-3 bg-white rounded-lg shadow-sm border-l-4 border-blue-500 cursor-pointer hover:shadow-md transition-shadow">
                        <div className="flex items-center">
                          <span className="w-6 h-6 bg-blue-500 rounded-md flex items-center justify-center text-white text-xs mr-3">🛡️</span>
                          <div>
                            <p className="font-semibold text-gray-900">{category.displayName}</p>
                            <p className="text-xs text-gray-500">{category.features.length} features</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Main Content - Features */}
              <div className="lg:col-span-2">
                <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-4">
                  <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center">
                    <span className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white text-sm mr-3">⚡</span>
                    Features
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {categories.flatMap(cat => cat.features).map((feature) => (
                      <div key={feature.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center">
                            <span className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-sm mr-3">🔧</span>
                            <div>
                              <h4 className="font-semibold text-gray-900">{feature.displayName}</h4>
                              <p className="text-xs text-gray-500">Security Category</p>
                            </div>
                          </div>
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-4">{feature.description}</p>
                        
                        <div className="flex space-x-2">
                          <button className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                            Configure
                          </button>
                          <button className="px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors">
                            View
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded">
              <h4 className="font-semibold text-green-800 mb-2">Improvements in NEW UI:</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• ✅ Clear visual hierarchy with colors and icons</li>
                <li>• ✅ Sidebar for categories, main area for features</li>
                <li>• ✅ Less text, more visual elements</li>
                <li>• ✅ Color-coded categories and features</li>
                <li>• ✅ Clear action buttons</li>
                <li>• ✅ User knows exactly where to go</li>
              </ul>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <div className="mt-8 p-6 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Try All the UI Pages:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <a 
              href="/old-features-final" 
              className="p-4 bg-white rounded-lg shadow-sm border border-red-200 hover:shadow-md transition-shadow text-center"
            >
              <div className="text-2xl mb-2">❌</div>
              <h4 className="font-semibold text-gray-900">Old Features</h4>
              <p className="text-sm text-gray-600">Original UI (Too Much Text)</p>
            </a>
            <a 
              href="/clean-features-real" 
              className="p-4 bg-white rounded-lg shadow-sm border border-blue-200 hover:shadow-md transition-shadow text-center"
            >
              <div className="text-2xl mb-2">🧹</div>
              <h4 className="font-semibold text-gray-900">Clean Features</h4>
              <p className="text-sm text-gray-600">Sidebar + Cards Layout</p>
            </a>
            <a 
              href="/simple-features" 
              className="p-4 bg-white rounded-lg shadow-sm border border-green-200 hover:shadow-md transition-shadow text-center"
            >
              <div className="text-2xl mb-2">✨</div>
              <h4 className="font-semibold text-gray-900">Simple Features</h4>
              <p className="text-sm text-gray-600">Minimal Text, Max Visual</p>
            </a>
            <a 
              href="/visual-demo.html" 
              className="p-4 bg-white rounded-lg shadow-sm border border-purple-200 hover:shadow-md transition-shadow text-center"
            >
              <div className="text-2xl mb-2">🎨</div>
              <h4 className="font-semibold text-gray-900">Visual Demo</h4>
              <p className="text-sm text-gray-600">Static HTML Demo</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
