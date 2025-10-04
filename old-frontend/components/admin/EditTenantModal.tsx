'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Building2, 
  Mail, 
  Users, 
  Briefcase, 
  FileText,
  Loader2,
  AlertTriangle,
  Save
} from 'lucide-react';

interface EditTenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  tenant: {
    id: string;
    name: string;
    plan: string;
    contactEmail?: string;
    industry?: string;
    maxUsers: number;
    isActive: boolean;
    status: string;
  } | null;
}

interface TenantFormData {
  name: string;
  contactEmail: string;
  plan: string;
  industry: string;
  maxUsers: number;
  description: string;
  isActive: boolean;
}

const PLANS = [
  { value: 'free', label: 'Free', description: 'Up to 10 users, basic features' },
  { value: 'starter', label: 'Starter', description: 'Up to 25 users, advanced features' },
  { value: 'professional', label: 'Professional', description: 'Up to 100 users, premium features' },
  { value: 'enterprise', label: 'Enterprise', description: 'Unlimited users, all features' }
];

const INDUSTRIES = [
  'Technology',
  'Healthcare',
  'Finance',
  'Government',
  'Education',
  'Retail',
  'Manufacturing',
  'Consulting',
  'Other'
];

export function EditTenantModal({ isOpen, onClose, onSuccess, tenant }: EditTenantModalProps) {
  const [formData, setFormData] = useState<TenantFormData>({
    name: '',
    contactEmail: '',
    plan: 'free',
    industry: '',
    maxUsers: 10,
    description: '',
    isActive: true
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof TenantFormData, string>>>({});
  const [apiError, setApiError] = useState<string>('');

  // Populate form when tenant changes
  useEffect(() => {
    if (tenant) {
      setFormData({
        name: tenant.name || '',
        contactEmail: tenant.contactEmail || '',
        plan: tenant.plan || 'free',
        industry: tenant.industry || '',
        maxUsers: tenant.maxUsers || 10,
        description: '',
        isActive: tenant.isActive
      });
    }
  }, [tenant]);

  const handleInputChange = (field: keyof TenantFormData, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    // Clear API error when user starts typing
    if (apiError) {
      setApiError('');
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof TenantFormData, string>> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Tenant name is required';
    }
    
    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = 'Contact email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email address';
    }
    
    if (!formData.industry) {
      newErrors.industry = 'Industry is required';
    }
    
    if (formData.maxUsers < 1) {
      newErrors.maxUsers = 'Max users must be at least 1';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tenant) return;
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch(`/api/admin/tenants/update?id=${tenant.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        console.log('✅ Tenant updated successfully:', data.data);
        onSuccess();
        onClose();
      } else {
        console.error('❌ Failed to update tenant:', data);
        setApiError(data.details || data.error || 'Failed to update tenant. Please try again.');
      }
    } catch (error) {
      console.error('❌ Error updating tenant:', error);
      setApiError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !tenant) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Edit Tenant</h3>
                <p className="text-sm text-gray-600">Update tenant information and settings</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* API Error Display */}
          {apiError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{apiError}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-4">Basic Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tenant Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="e.g., Acme Corporation"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.contactEmail ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="admin@acmecorp.com"
                    />
                  </div>
                  {errors.contactEmail && (
                    <p className="mt-1 text-sm text-red-600">{errors.contactEmail}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Plan and Industry */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-4">Plan & Industry</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subscription Plan
                  </label>
                  <select
                    value={formData.plan}
                    onChange={(e) => handleInputChange('plan', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {PLANS.map((plan) => (
                      <option key={plan.value} value={plan.value}>
                        {plan.label} - {plan.description}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industry *
                  </label>
                  <select
                    value={formData.industry}
                    onChange={(e) => handleInputChange('industry', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.industry ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Industry</option>
                    {INDUSTRIES.map((industry) => (
                      <option key={industry} value={industry}>
                        {industry}
                      </option>
                    ))}
                  </select>
                  {errors.industry && (
                    <p className="mt-1 text-sm text-red-600">{errors.industry}</p>
                  )}
                </div>
              </div>
            </div>

            {/* User Limits and Status */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-4">User Limits & Status</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Users
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="number"
                      min="1"
                      max="10000"
                      value={formData.maxUsers}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        handleInputChange('maxUsers', isNaN(value) ? 1 : value);
                      }}
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.maxUsers ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.maxUsers && (
                    <p className="mt-1 text-sm text-red-600">{errors.maxUsers}</p>
                  )}
                  <p className="mt-1 text-sm text-gray-500">
                    Maximum number of users allowed for this tenant
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={() => handleInputChange('isActive', true)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">Active</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="isActive"
                        checked={!formData.isActive}
                        onChange={() => handleInputChange('isActive', false)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">Inactive</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Brief description of the tenant organization..."
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <Save className="w-4 h-4" />
              <span>{loading ? 'Updating...' : 'Update Tenant'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
