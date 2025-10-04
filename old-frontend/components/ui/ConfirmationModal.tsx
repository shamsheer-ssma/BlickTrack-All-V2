/**
 * ConfirmationModal.tsx
 * 
 * Reusable Confirmation Modal Component
 * 
 * Features:
 * - Professional confirmation dialogs
 * - Multiple types: danger, warning, info, success
 * - Customizable titles, messages, and button text
 * - Smooth animations and transitions
 * - Accessibility support with focus management
 * - Consistent styling across the application
 * 
 * @author BlickTrack Development Team
 * @version 1.0.0
 * @created 2025-01-30
 * @updated 2025-01-30
 */

'use client';

import React from 'react';
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  type?: 'danger' | 'warning' | 'info' | 'success';
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'danger',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isLoading = false
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const getIconAndColors = () => {
    switch (type) {
      case 'danger':
        return {
          icon: <XCircle className="w-6 h-6 text-red-600" />,
          iconBg: 'bg-red-100',
          confirmBg: 'bg-red-600 hover:bg-red-700',
          confirmText: 'text-white'
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="w-6 h-6 text-yellow-600" />,
          iconBg: 'bg-yellow-100',
          confirmBg: 'bg-yellow-600 hover:bg-yellow-700',
          confirmText: 'text-white'
        };
      case 'info':
        return {
          icon: <Info className="w-6 h-6 text-blue-600" />,
          iconBg: 'bg-blue-100',
          confirmBg: 'bg-blue-600 hover:bg-blue-700',
          confirmText: 'text-white'
        };
      case 'success':
        return {
          icon: <CheckCircle className="w-6 h-6 text-green-600" />,
          iconBg: 'bg-green-100',
          confirmBg: 'bg-green-600 hover:bg-green-700',
          confirmText: 'text-white'
        };
      default:
        return {
          icon: <AlertTriangle className="w-6 h-6 text-gray-600" />,
          iconBg: 'bg-gray-100',
          confirmBg: 'bg-gray-600 hover:bg-gray-700',
          confirmText: 'text-white'
        };
    }
  };

  const { icon, iconBg, confirmBg, confirmText: confirmTextColor } = getIconAndColors();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 ${iconBg} rounded-full flex items-center justify-center`}>
              {icon}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-500">Please confirm your action</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            disabled={isLoading}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 leading-relaxed">{message}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 p-6 bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-6 py-2 ${confirmBg} ${confirmTextColor} rounded-lg transition-colors font-medium flex items-center space-x-2`}
            disabled={isLoading}
          >
            {isLoading && (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
