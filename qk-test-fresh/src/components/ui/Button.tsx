import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  onClick,
  className = '',
  type = 'button',
}: ButtonProps) {
  const baseClasses = 'font-medium transition-all duration-300 transform hover:scale-105 rounded-xl flex items-center justify-center';
  
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40',
    secondary: 'border-2 border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white backdrop-blur-sm bg-white/5',
    ghost: 'text-gray-300 hover:text-white border border-gray-600 hover:border-gray-400',
  };
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  
  return (
    <button
      type={type}
      onClick={onClick}
      className={classes}
    >
      {children}
      {icon && <span className="ml-2">{icon}</span>}
    </button>
  );
}
