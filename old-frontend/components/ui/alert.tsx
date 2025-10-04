'use client';

import React from 'react';
import { AlertTriangle, CheckCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

interface AlertProps {
  variant?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  description?: string;
  children?: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

const variantClasses = {
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

const variantIcons = {
  success: CheckCircle,
  error: AlertTriangle,
  warning: AlertTriangle,
  info: Info
};

export function Alert({
  variant = 'info',
  title,
  description,
  children,
  dismissible = false,
  onDismiss,
  className
}: AlertProps) {
  const Icon = variantIcons[variant];
  const classes = variantClasses[variant];

  return (
    <div className={cn(
      'rounded-lg border p-4',
      classes.container,
      className
    )}>
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className={cn('h-5 w-5', classes.icon)} />
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className={cn('text-sm font-medium', classes.title)}>
              {title}
            </h3>
          )}
          {description && (
            <div className={cn('mt-1 text-sm', classes.description)}>
              {description}
            </div>
          )}
          {children && (
            <div className={cn('mt-2 text-sm', classes.description)}>
              {children}
            </div>
          )}
        </div>
        {dismissible && onDismiss && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <Button
                variant="ghost"
                size="icon"
                onClick={onDismiss}
                className={cn(
                  'inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2',
                  classes.icon,
                  'hover:bg-opacity-20'
                )}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Toast Component
interface ToastProps extends AlertProps {
  open?: boolean;
  duration?: number;
}

export function Toast({
  open = true,
  duration = 5000,
  onDismiss,
  ...props
}: ToastProps) {
  React.useEffect(() => {
    if (open && duration > 0 && onDismiss) {
      const timer = setTimeout(onDismiss, duration);
      return () => clearTimeout(timer);
    }
  }, [open, duration, onDismiss]);

  if (!open) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full">
      <Alert
        {...props}
        dismissible
        onDismiss={onDismiss}
      />
    </div>
  );
}

// Toast Provider and Hook
interface ToastContextType {
  showToast: (toast: Omit<ToastProps, 'open'>) => void;
  hideToast: () => void;
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
  const [toast, setToast] = React.useState<ToastProps | null>(null);

  const showToast = (toastProps: Omit<ToastProps, 'open'>) => {
    setToast({ ...toastProps, open: true });
  };

  const hideToast = () => {
    setToast(null);
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {toast && (
        <Toast
          {...toast}
          onDismiss={hideToast}
        />
      )}
    </ToastContext.Provider>
  );
}

