'use client';

import React, { useState } from 'react';
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye, 
  Settings, 
  UserPlus,
  Shield,
  BarChart3,
  Copy,
  Archive,
  Power,
  PowerOff
} from 'lucide-react';
import { useToastActions } from '@/components/ui/toast';

interface TenantActionsMenuProps {
  tenant: {
    id: string;
    name: string;
    plan: string;
    status: string;
    userCount: number;
    isActive: boolean;
  };
  onEdit: (tenant: any) => void;
  onDelete: (tenant: any) => void;
  onViewDetails: (tenant: any) => void;
  onManageUsers: (tenant: any) => void;
  onManageFeatures: (tenant: any) => void;
  onViewAnalytics: (tenant: any) => void;
}

export function TenantActionsMenu({ 
  tenant, 
  onEdit, 
  onDelete, 
  onViewDetails, 
  onManageUsers, 
  onManageFeatures, 
  onViewAnalytics 
}: TenantActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [togglingStatus, setTogglingStatus] = useState(false);
  const { success, error: showError } = useToastActions();

  const handleAction = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  const handleToggleStatus = async () => {
    setTogglingStatus(true);
    
    try {
      const response = await fetch(`/api/admin/tenants/${tenant.id}/toggle-status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !tenant.isActive })
      });
      
      const data = await response.json();
      
      if (data.success) {
        success(`Tenant ${!tenant.isActive ? 'activated' : 'deactivated'} successfully`);
        // Refresh the page to update the tenant status
        window.location.reload();
      } else {
        showError(data.error || 'Failed to update tenant status');
      }
    } catch (err) {
      showError('Network error occurred');
      console.error('Error toggling tenant status:', err);
    } finally {
      setTogglingStatus(false);
    }
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(tenant.id);
    success('Tenant ID copied to clipboard');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600';
      case 'trial': return 'text-blue-600';
      case 'suspended': return 'text-red-600';
      case 'inactive': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <div className="absolute right-0 top-8 z-20 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
            {/* Tenant Info Header */}
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm">
                    {tenant.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {tenant.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {tenant.plan} • {tenant.userCount} users
                  </p>
                  <div className="flex items-center mt-1">
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      tenant.status === 'active' ? 'bg-green-400' :
                      tenant.status === 'trial' ? 'bg-blue-400' :
                      tenant.status === 'suspended' ? 'bg-red-400' : 'bg-gray-400'
                    }`}></div>
                    <span className={`text-xs font-medium ${getStatusColor(tenant.status)}`}>
                      {tenant.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Items */}
            <div className="py-2">
              <button
                onClick={() => handleAction(() => onViewDetails(tenant))}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3"
              >
                <Eye className="w-4 h-4 text-gray-400" />
                <span>View Details</span>
              </button>

              <button
                onClick={() => handleAction(() => onEdit(tenant))}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3"
              >
                <Edit className="w-4 h-4 text-gray-400" />
                <span>Edit Tenant</span>
              </button>

              <button
                onClick={() => handleAction(() => onManageUsers(tenant))}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3"
              >
                <UserPlus className="w-4 h-4 text-gray-400" />
                <span>Manage Users</span>
              </button>

              <button
                onClick={() => handleAction(() => onManageFeatures(tenant))}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3"
              >
                <Settings className="w-4 h-4 text-gray-400" />
                <span>Manage Features</span>
              </button>

              <button
                onClick={() => handleAction(() => onViewAnalytics(tenant))}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3"
              >
                <BarChart3 className="w-4 h-4 text-gray-400" />
                <span>View Analytics</span>
              </button>

              <div className="border-t border-gray-100 my-2"></div>

              <button
                onClick={() => handleAction(handleCopyId)}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3"
              >
                <Copy className="w-4 h-4 text-gray-400" />
                <span>Copy Tenant ID</span>
              </button>

              <button
                onClick={() => handleAction(handleToggleStatus)}
                disabled={togglingStatus}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {togglingStatus ? (
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                ) : tenant.isActive ? (
                  <PowerOff className="w-4 h-4 text-gray-400" />
                ) : (
                  <Power className="w-4 h-4 text-gray-400" />
                )}
                <span>{togglingStatus ? 'Updating...' : (tenant.isActive ? 'Deactivate' : 'Activate')}</span>
              </button>

              <div className="border-t border-gray-100 my-2"></div>

              <button
                onClick={() => handleAction(() => onDelete(tenant))}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-3"
              >
                <Trash2 className="w-4 h-4 text-red-400" />
                <span>Delete Tenant</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
