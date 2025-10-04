'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Toast {
  id: string;
  title?: string;
  description: string;
  variant: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove after duration
    if (toast.duration !== 0) {
      setTimeout(() => {
        removeToast(id);
      }, toast.duration || 5000);
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearAllToasts }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  const { title, description, variant } = toast;

  const variantStyles = {
    success: {
      container: 'bg-green-50 border-green-200',
      icon: 'text-green-400',
      title: 'text-green-800',
      description: 'text-green-700'
    },
    error: {
      container: 'bg-red-50 border-red-200',
      icon: 'text-red-400',
      title: 'text-red-800',
      description: 'text-red-700'
    },
    warning: {
      container: 'bg-yellow-50 border-yellow-200',
      icon: 'text-yellow-400',
      title: 'text-yellow-800',
      description: 'text-yellow-700'
    },
    info: {
      container: 'bg-blue-50 border-blue-200',
      icon: 'text-blue-400',
      title: 'text-blue-800',
      description: 'text-blue-700'
    }
  };

  const icons = {
    success: CheckCircle,
    error: AlertTriangle,
    warning: AlertCircle,
    info: Info
  };

  const Icon = icons[variant];
  const styles = variantStyles[variant];

  return (
    <div className={cn(
      'rounded-lg border p-4 shadow-lg transition-all duration-300',
      styles.container
    )}>
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className={cn('h-5 w-5', styles.icon)} />
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className={cn('text-sm font-medium', styles.title)}>
              {title}
            </h3>
          )}
          <div className={cn('text-sm', styles.description)}>
            {description}
          </div>
        </div>
        <div className="ml-auto pl-3">
          <button
            onClick={() => onRemove(toast.id)}
            className={cn(
              'inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2',
              styles.icon,
              'hover:bg-opacity-20'
            )}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Convenience functions
export function useToastActions() {
  const { addToast } = useToast();

  return {
    success: (message: string, title?: string) => 
      addToast({ title, description: message, variant: 'success' }),
    error: (message: string, title?: string) => 
      addToast({ title, description: message, variant: 'error' }),
    warning: (message: string, title?: string) => 
      addToast({ title, description: message, variant: 'warning' }),
    info: (message: string, title?: string) => 
      addToast({ title, description: message, variant: 'info' })
  };
}

