'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { 
  Shield,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  Layers
} from 'lucide-react';

interface FeatureCategory {
  id: string;
  name: string;
  displayName: string;
  description: string;
  isActive: boolean;
  featureCount: number;
  createdAt: string;
  updatedAt: string;
}

export default function FeatureCategoriesPage() {
  const [categories, setCategories] = useState<FeatureCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/admin/feature-categories');
        const data = await response.json();
        
        if (data.success) {
          setCategories(data.data || []);
        } else {
          console.error('Failed to fetch categories:', data.error);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const filteredCategories = categories.filter(category =>
    category.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                <Shield className="w-6 h-6 mr-3 text-blue-600" />
                Feature Categories
              </h1>
              <p className="text-slate-600 mt-1">
                Organize features into logical categories for better management
              </p>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6 bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <div key={category.id} className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Layers className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{category.displayName}</h3>
                    <p className="text-sm text-slate-500">{category.name}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <button className="p-1 text-slate-400 hover:text-slate-600">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-slate-400 hover:text-slate-600">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-slate-400 hover:text-slate-600">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <p className="text-sm text-slate-600 mb-4">{category.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${category.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-sm text-slate-600">
                      {category.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="text-sm text-slate-500">
                    {category.featureCount} features
                  </div>
                </div>
                <button className="text-red-600 hover:text-red-800 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <Layers className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No categories found</h3>
            <p className="text-slate-500 mb-4">
              {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating your first feature category'}
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Add Category
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}

