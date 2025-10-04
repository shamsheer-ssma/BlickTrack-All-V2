'use client';

import React, { useState, useEffect } from 'react';
import { X, Plus, Edit, Trash2, Save, AlertCircle } from 'lucide-react';

interface FeatureCategory {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  icon?: string;
  color?: string;
  order: number;
  isActive: boolean;
  isVisible: boolean;
  metadata: any;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface CategoryManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: FeatureCategory[];
  onCategoryChange: () => void;
}

export function CategoryManagementModal({ 
  isOpen, 
  onClose, 
  categories, 
  onCategoryChange 
}: CategoryManagementModalProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingCategory, setEditingCategory] = useState<FeatureCategory | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    description: '',
    icon: '',
    color: '#3B82F6',
    order: 0,
    isActive: true,
    isVisible: true,
    tags: [] as string[]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const resetForm = () => {
    setFormData({
      name: '',
      displayName: '',
      description: '',
      icon: '',
      color: '#3B82F6',
      order: 0,
      isActive: true,
      isVisible: true,
      tags: []
    });
    setError('');
  };

  const handleCreate = () => {
    setIsCreating(true);
    setEditingCategory(null);
    resetForm();
  };

  const handleEdit = (category: FeatureCategory) => {
    setEditingCategory(category);
    setIsCreating(false);
    setFormData({
      name: category.name,
      displayName: category.displayName,
      description: category.description || '',
      icon: category.icon || '',
      color: category.color || '#3B82F6',
      order: category.order,
      isActive: category.isActive,
      isVisible: category.isVisible,
      tags: category.tags || []
    });
    setError('');
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');

    try {
      const url = editingCategory 
        ? `/api/admin/feature-categories/${editingCategory.id}`
        : '/api/admin/feature-categories';
      
      const method = editingCategory ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to save category');
      }

      onCategoryChange();
      resetForm();
      setIsCreating(false);
      setEditingCategory(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/admin/feature-categories/${categoryId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to delete category');
      }

      onCategoryChange();
      if (editingCategory?.id === categoryId) {
        resetForm();
        setEditingCategory(null);
        setIsCreating(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleTagAdd = (tag: string) => {
    if (tag.trim() && !formData.tags.includes(tag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag.trim()]
      }));
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Category Management</h2>
              <p className="text-sm text-gray-600">Manage feature categories and their settings</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Categories List */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Categories ({categories.length})</h3>
                <button
                  onClick={handleCreate}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Category</span>
                </button>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      editingCategory?.id === category.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => handleEdit(category)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: category.color + '20', color: category.color }}
                        >
                          {category.icon || '📁'}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{category.displayName}</h4>
                          <p className="text-sm text-gray-500">{category.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {category.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(category.id);
                          }}
                          className="p-1 text-red-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Form */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {isCreating ? 'Create New Category' : editingCategory ? 'Edit Category' : 'Select a Category'}
              </h3>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-red-700">{error}</span>
                </div>
              )}

              {(isCreating || editingCategory) && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="security"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Display Name *
                      </label>
                      <input
                        type="text"
                        value={formData.displayName}
                        onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Security"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                      placeholder="Category description..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Icon
                      </label>
                      <input
                        type="text"
                        value={formData.icon}
                        onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="🔒"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Color
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={formData.color}
                          onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                          className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                        />
                        <input
                          type="text"
                          value={formData.color}
                          onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="#3B82F6"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Order
                      </label>
                      <input
                        type="number"
                        value={formData.order}
                        onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.isActive}
                          onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Active</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.isVisible}
                          onChange={(e) => setFormData(prev => ({ ...prev, isVisible: e.target.checked }))}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Visible</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tags
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full flex items-center space-x-1"
                        >
                          <span>{tag}</span>
                          <button
                            onClick={() => handleTagRemove(tag)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder="Add tag..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleTagAdd(e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      onClick={() => {
                        resetForm();
                        setIsCreating(false);
                        setEditingCategory(null);
                      }}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={loading || !formData.name || !formData.displayName}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>{loading ? 'Saving...' : 'Save'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

