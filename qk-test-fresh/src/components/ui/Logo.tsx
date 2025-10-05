import React from 'react';
import { Shield } from 'lucide-react';
import { BLICKTRACK_THEME, getGradientStyle } from '@/lib/theme';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
  variant?: 'default' | 'light' | 'dark';
}

// const BRAND = {
//   name: 'BlickTrack',
//   tagline: 'Security Unified',
// } as const;

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
  className = '',
  variant = 'default'
}) => {
  const classes = sizeClasses[size];
  
  return (
    <div className={`flex items-start ${className}`}>
      <div
        className={`${classes.container} rounded-xl flex items-center justify-center mr-3`}
        style={{
          background: BLICKTRACK_THEME.colors.gradients.primary,
          boxShadow: BLICKTRACK_THEME.colors.shadows.primary,
        }}
      >
        <Shield className={`${classes.icon} text-white`} />
      </div>
      <div className="flex flex-col items-start">
        <div
          className={`${classes.text} font-bold`}
          style={{
            ...(variant === 'light' 
              ? { 
                  color: '#ffffff',
                  fontFamily: BLICKTRACK_THEME.typography.fontFamily.primary,
                }
              : variant === 'dark'
              ? {
                  color: '#1f2937',
                  fontFamily: BLICKTRACK_THEME.typography.fontFamily.primary,
                }
              : {
                  ...getGradientStyle('primary'),
                  fontFamily: BLICKTRACK_THEME.typography.fontFamily.primary,
                }
            ),
          }}
        >
          BlickTrack
        </div>
               {showTagline && (
                 <div 
                   className={`${classes.tagline} font-medium`}
                   style={{
                     color: variant === 'light' 
                       ? '#e5e7eb' 
                       : variant === 'dark'
                       ? '#6b7280'
                       : BLICKTRACK_THEME.colors.text.muted,
                     fontFamily: BLICKTRACK_THEME.typography.fontFamily.primary,
                   }}
                 >
                   &nbsp;Security Unified
                 </div>
               )}
      </div>
    </div>
  );
};

export default Logo;
