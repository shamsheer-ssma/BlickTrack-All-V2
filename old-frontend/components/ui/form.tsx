'use client';

import React, { createContext, useContext, useState } from 'react';
import { cn } from '@/lib/utils';
import { AlertTriangle, CheckCircle } from 'lucide-react';

// Form Context
interface FormContextType {
  errors: Record<string, string>;
  setErrors: (errors: Record<string, string>) => void;
  setError: (field: string, message: string) => void;
  clearError: (field: string) => void;
  clearAllErrors: () => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export function useFormContext() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
}

// Form Provider
interface FormProviderProps {
  children: React.ReactNode;
  initialErrors?: Record<string, string>;
}

export function FormProvider({ children, initialErrors = {} }: FormProviderProps) {
  const [errors, setErrors] = useState<Record<string, string>>(initialErrors);

  const setError = (field: string, message: string) => {
    setErrors(prev => ({ ...prev, [field]: message }));
  };

  const clearError = (field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const clearAllErrors = () => {
    setErrors({});
  };

  return (
    <FormContext.Provider value={{
      errors,
      setErrors,
      setError,
      clearError,
      clearAllErrors
    }}>
      {children}
    </FormContext.Provider>
  );
}

// Form Component
interface FormProps {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  className?: string;
  initialErrors?: Record<string, string>;
}

export function Form({ children, onSubmit, className, initialErrors }: FormProps) {
  return (
    <FormProvider initialErrors={initialErrors}>
      <form onSubmit={onSubmit} className={cn('space-y-6', className)}>
        {children}
      </form>
    </FormProvider>
  );
}

// Form Field Component
interface FormFieldProps {
  children: React.ReactNode;
  className?: string;
}

export function FormField({ children, className }: FormFieldProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {children}
    </div>
  );
}

// Form Label Component
interface FormLabelProps {
  children: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
  className?: string;
}

export function FormLabel({ children, htmlFor, required, className }: FormLabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        'block text-sm font-medium text-gray-700',
        required && "after:content-['*'] after:ml-1 after:text-red-500",
        className
      )}
    >
      {children}
    </label>
  );
}

// Form Input Component
interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  required?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  helperText?: string;
}

export function FormInput({
  label,
  error,
  required,
  leftIcon,
  rightIcon,
  helperText,
  className,
  id,
  ...props
}: FormInputProps) {
  const { errors, clearError } = useFormContext();
  const fieldError = error || errors[id || ''];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (fieldError) {
      clearError(id || '');
    }
    props.onChange?.(e);
  };

  return (
    <FormField>
      {label && (
        <FormLabel htmlFor={id} required={required}>
          {label}
        </FormLabel>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}
        <input
          id={id}
          className={cn(
            'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors',
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            fieldError ? 'border-red-300 focus:ring-red-500' : 'border-gray-300',
            className
          )}
          onChange={handleChange}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>
      {fieldError && (
        <div className="flex items-center text-sm text-red-600">
          <AlertTriangle className="w-4 h-4 mr-1" />
          {fieldError}
        </div>
      )}
      {helperText && !fieldError && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </FormField>
  );
}

// Form Select Component
interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  required?: boolean;
  options: { value: string; label: string; disabled?: boolean }[];
  placeholder?: string;
  helperText?: string;
}

export function FormSelect({
  label,
  error,
  required,
  options,
  placeholder,
  helperText,
  className,
  id,
  ...props
}: FormSelectProps) {
  const { errors, clearError } = useFormContext();
  const fieldError = error || errors[id || ''];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (fieldError) {
      clearError(id || '');
    }
    props.onChange?.(e);
  };

  return (
    <FormField>
      {label && (
        <FormLabel htmlFor={id} required={required}>
          {label}
        </FormLabel>
      )}
      <select
        id={id}
        className={cn(
          'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors',
          fieldError ? 'border-red-300 focus:ring-red-500' : 'border-gray-300',
          className
        )}
        onChange={handleChange}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      {fieldError && (
        <div className="flex items-center text-sm text-red-600">
          <AlertTriangle className="w-4 h-4 mr-1" />
          {fieldError}
        </div>
      )}
      {helperText && !fieldError && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </FormField>
  );
}

// Form Textarea Component
interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  required?: boolean;
  helperText?: string;
}

export function FormTextarea({
  label,
  error,
  required,
  helperText,
  className,
  id,
  ...props
}: FormTextareaProps) {
  const { errors, clearError } = useFormContext();
  const fieldError = error || errors[id || ''];

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (fieldError) {
      clearError(id || '');
    }
    props.onChange?.(e);
  };

  return (
    <FormField>
      {label && (
        <FormLabel htmlFor={id} required={required}>
          {label}
        </FormLabel>
      )}
      <textarea
        id={id}
        className={cn(
          'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none',
          fieldError ? 'border-red-300 focus:ring-red-500' : 'border-gray-300',
          className
        )}
        onChange={handleChange}
        {...props}
      />
      {fieldError && (
        <div className="flex items-center text-sm text-red-600">
          <AlertTriangle className="w-4 h-4 mr-1" />
          {fieldError}
        </div>
      )}
      {helperText && !fieldError && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </FormField>
  );
}

// Form Checkbox Component
interface FormCheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function FormCheckbox({
  label,
  error,
  helperText,
  className,
  id,
  ...props
}: FormCheckboxProps) {
  const { errors, clearError } = useFormContext();
  const fieldError = error || errors[id || ''];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (fieldError) {
      clearError(id || '');
    }
    props.onChange?.(e);
  };

  return (
    <FormField>
      <div className="flex items-start space-x-3">
        <input
          id={id}
          type="checkbox"
          className={cn(
            'mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded',
            fieldError ? 'border-red-300' : '',
            className
          )}
          onChange={handleChange}
          {...props}
        />
        <div className="flex-1">
          {label && (
            <FormLabel htmlFor={id} className="text-sm font-medium text-gray-700">
              {label}
            </FormLabel>
          )}
          {fieldError && (
            <div className="flex items-center text-sm text-red-600 mt-1">
              <AlertTriangle className="w-4 h-4 mr-1" />
              {fieldError}
            </div>
          )}
          {helperText && !fieldError && (
            <p className="text-sm text-gray-500 mt-1">{helperText}</p>
          )}
        </div>
      </div>
    </FormField>
  );
}

// Form Radio Group Component
interface FormRadioGroupProps {
  label?: string;
  error?: string;
  required?: boolean;
  options: { value: string; label: string; disabled?: boolean }[];
  value?: string;
  onChange?: (value: string) => void;
  name: string;
  helperText?: string;
}

export function FormRadioGroup({
  label,
  error,
  required,
  options,
  value,
  onChange,
  name,
  helperText
}: FormRadioGroupProps) {
  const { errors, clearError } = useFormContext();
  const fieldError = error || errors[name];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (fieldError) {
      clearError(name);
    }
    onChange?.(e.target.value);
  };

  return (
    <FormField>
      {label && (
        <FormLabel required={required}>
          {label}
        </FormLabel>
      )}
      <div className="space-y-2">
        {options.map((option) => (
          <div key={option.value} className="flex items-center">
            <input
              id={`${name}-${option.value}`}
              name={name}
              type="radio"
              value={option.value}
              checked={value === option.value}
              onChange={handleChange}
              disabled={option.disabled}
              className={cn(
                'h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300',
                fieldError ? 'border-red-300' : ''
              )}
            />
            <label
              htmlFor={`${name}-${option.value}`}
              className="ml-3 text-sm font-medium text-gray-700"
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
      {fieldError && (
        <div className="flex items-center text-sm text-red-600">
          <AlertTriangle className="w-4 h-4 mr-1" />
          {fieldError}
        </div>
      )}
      {helperText && !fieldError && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </FormField>
  );
}

// Form Error Display Component
interface FormErrorProps {
  error?: string;
  className?: string;
}

export function FormError({ error, className }: FormErrorProps) {
  if (!error) return null;

  return (
    <div className={cn(
      'p-4 bg-red-50 border border-red-200 rounded-lg',
      className
    )}>
      <div className="flex items-center">
        <AlertTriangle className="w-5 h-5 text-red-400 mr-3" />
        <p className="text-sm text-red-800">{error}</p>
      </div>
    </div>
  );
}

// Form Success Display Component
interface FormSuccessProps {
  message?: string;
  className?: string;
}

export function FormSuccess({ message, className }: FormSuccessProps) {
  if (!message) return null;

  return (
    <div className={cn(
      'p-4 bg-green-50 border border-green-200 rounded-lg',
      className
    )}>
      <div className="flex items-center">
        <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
        <p className="text-sm text-green-800">{message}</p>
      </div>
    </div>
  );
}

