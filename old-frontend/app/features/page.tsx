'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { FeatureManagement } from '@/components/admin/FeatureManagement';
import { 
  Layers,
  Plus,
  Search,
  Filter,
  Grid,
  List,
  MoreVertical,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';

export default function FeaturesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  return (
    <Layout showSidebar={true}>
      <div className="px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center">
                <Layers className="w-6 h-6 mr-3 text-blue-600" />
                Feature Management
              </h1>
              <p className="text-slate-600 mt-1">
                Manage platform features, categories, and access controls
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                Add Feature
              </button>
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
                placeholder="Search features..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="threat-modeling">Threat Modeling</option>
              <option value="vulnerability-scanning">Vulnerability Scanning</option>
              <option value="compliance">Compliance</option>
              <option value="analytics">Analytics</option>
            </select>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Feature Management Component */}
        <FeatureManagement />
      </div>
    </Layout>
  );
}

