'use client';

import React, { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  Trash2, 
  Loader2,
  Building2,
  Users,
  Shield
} from 'lucide-react';

interface DeleteTenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  tenant: {
    id: string;
    name: string;
    plan: string;
    userCount: number;
    isActive: boolean;
  } | null;
}

export function DeleteTenantModal({ isOpen, onClose, onConfirm, tenant }: DeleteTenantModalProps) {
  const [loading, setLoading] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [apiError, setApiError] = useState<string>('');

  const expectedText = tenant?.name || '';

  const handleDelete = async () => {
    if (!tenant) return;
    
    if (confirmText !== expectedText) {
      setApiError('Please type the tenant name exactly as shown to confirm deletion.');
      return;
    }

    setLoading(true);
    setApiError('');

    try {
      const response = await fetch(`/api/admin/tenants/delete?id=${tenant.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (data.success) {
        console.log('✅ Tenant deleted successfully');
        onConfirm();
        onClose();
        setConfirmText('');
      } else {
        console.error('❌ Failed to delete tenant:', data);
        setApiError(data.details || data.error || 'Failed to delete tenant. Please try again.');
      }
    } catch (error) {
      console.error('❌ Error deleting tenant:', error);
      setApiError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setConfirmText('');
      setApiError('');
      onClose();
    }
  };

  if (!isOpen || !tenant) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Delete Tenant</h3>
              <p className="text-sm text-gray-600">This action cannot be undone</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Tenant Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{tenant.name}</h4>
                <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    <span>{tenant.userCount} users</span>
                  </div>
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 mr-1" />
                    <span>{tenant.plan} plan</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
              <div className="ml-3">
                <h4 className="text-sm font-medium text-red-800">Warning: This action is permanent</h4>
                <div className="mt-2 text-sm text-red-700">
                  <p>Deleting this tenant will permanently remove:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>All tenant data and configurations</li>
                    <li>All associated users and their data</li>
                    <li>All tenant-specific settings and features</li>
                    <li>All audit logs and activity history</li>
                  </ul>
                  <p className="mt-2 font-medium">This action cannot be undone!</p>
                </div>
              </div>
            </div>
          </div>

          {/* Confirmation */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To confirm deletion, type the tenant name exactly as shown:
            </label>
            <div className="font-mono text-sm bg-gray-100 px-3 py-2 rounded border mb-3">
              {expectedText}
            </div>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => {
                setConfirmText(e.target.value);
                if (apiError) setApiError('');
              }}
              placeholder={`Type "${expectedText}" to confirm`}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              disabled={loading}
            />
            {apiError && (
              <p className="mt-2 text-sm text-red-600">{apiError}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={loading || confirmText !== expectedText}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <Trash2 className="w-4 h-4" />
              <span>{loading ? 'Deleting...' : 'Delete Tenant'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
