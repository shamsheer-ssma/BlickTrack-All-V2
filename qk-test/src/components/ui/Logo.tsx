import React from 'react';
import { Shield } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
}

const BRAND = {
  name: 'BlickTrack',
  tagline: 'Cybersecurity Lifecycle Management',
} as const;

const sizeClasses = {
  sm: {
    container: 'w-8 h-8',
    icon: 'w-4 h-4',
    text: 'text-lg',
    tagline: 'text-xs',
    spacing: 'space-x-2',
  },
  md: {
    container: 'w-10 h-10',
    icon: 'w-5 h-5',
    text: 'text-xl',
    tagline: 'text-xs',
    spacing: 'space-x-3',
  },
  lg: {
    container: 'w-12 h-12',
    icon: 'w-6 h-6',
    text: 'text-2xl',
    tagline: 'text-sm',
    spacing: 'space-x-3',
  },
  xl: {
    container: 'w-20 h-20',
    icon: 'w-10 h-10',
    text: 'text-4xl md:text-5xl',
    tagline: 'text-sm',
    spacing: 'space-x-6',
  },
};

export const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  showTagline = true, 
  className = '' 
}) => {
  const classes = sizeClasses[size];
  
  return (
    <div className={`flex items-center ${classes.spacing} ${className}`}>
      <div 
        className={`${classes.container} rounded-xl flex items-center justify-center`}
        style={{
          background: 'linear-gradient(to bottom right, #2563eb, #1e3a8a)'
        }}
      >
        <Shield className={`${classes.icon} text-white`} />
      </div>
      <div>
        <div 
          className={`${classes.text} font-bold block`}
          style={{
            background: 'linear-gradient(90deg, #2563eb 0%, #1e3a8a 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            color: '#2563eb'
          }}
        >
          {BRAND.name}
        </div>
        {showTagline && (
          <div 
            className={`${classes.tagline} font-medium mt-1 block text-gray-600`}
          >
            {BRAND.tagline}
          </div>
        )}
      </div>
    </div>
  );
};

export default Logo;
