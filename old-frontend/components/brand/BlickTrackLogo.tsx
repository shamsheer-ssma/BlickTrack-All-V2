import { Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BlickTrackLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showIcon?: boolean;
  showTagline?: boolean;
  className?: string;
  textClassName?: string;
  iconClassName?: string;
  taglineClassName?: string;
}

// Function to render character-by-character gradient text
function renderGradientText(text: string) {
  const characters = text.split('');
  const totalChars = characters.length;
  
  return characters.map((char, index) => {
    // Calculate position (0 to 1) for gradient
    const position = index / (totalChars - 1);
    
    // Create gradient from blue (#3b82f6) to green (#22c55e)
    const r1 = 59, g1 = 130, b1 = 246; // Blue
    const r2 = 34, g2 = 197, b2 = 94;  // Green
    
    const r = Math.round(r1 + (r2 - r1) * position);
    const g = Math.round(g1 + (g2 - g1) * position);
    const b = Math.round(b1 + (b2 - b1) * position);
    
    const color = `rgb(${r}, ${g}, ${b})`;
    
    return (
      <span key={index} style={{ color }}>
        {char}
      </span>
    );
  });
}

export default function BlickTrackLogo({
  size = 'md',
  showIcon = true,
  showTagline = true,
  className,
  textClassName,
  iconClassName,
  taglineClassName,
}: BlickTrackLogoProps) {
  const sizeClasses = {
    sm: {
      icon: 'w-8 h-8',
      text: 'text-lg',
      tagline: 'text-xs',
    },
    md: {
      icon: 'w-10 h-10',
      text: 'text-xl',
      tagline: 'text-xs',
    },
    lg: {
      icon: 'w-12 h-12',
      text: 'text-2xl',
      tagline: 'text-sm',
    },
    xl: {
      icon: 'w-16 h-16',
      text: 'text-4xl',
      tagline: 'text-base',
    },
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={cn('flex items-center space-x-3', className)}>
      {showIcon && (
        <div className={cn(
          'bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg border border-white/20',
          currentSize.icon,
          iconClassName
        )}>
          <Shield className={cn('text-white drop-shadow-lg', 
            size === 'sm' ? 'w-4 h-4' : 
            size === 'md' ? 'w-5 h-5' : 
            size === 'lg' ? 'w-6 h-6' : 'w-8 h-8'
          )} />
        </div>
      )}
      
      <div>
        <h1 className={cn(
          'font-bold font-geometrica drop-shadow-lg',
          currentSize.text,
          textClassName
        )}>
          {renderGradientText('BlickTrack')}
        </h1>
        
        {showTagline && (
          <p className={cn(
            'text-white font-geometrica font-medium -mt-1 drop-shadow-md',
            currentSize.tagline,
            taglineClassName
          )}>
            Secure Development Lifecycle Platform
          </p>
        )}
      </div>
    </div>
  );
}

export function BlickTrackGradientText({ 
  text, 
  className 
}: { 
  text: string; 
  className?: string; 
}) {
  return (
    <span 
      className={cn(
        'inline-block',
        className
      )}
      style={{
        background: 'linear-gradient(to right, #3b82f6,rgb(5, 70, 29))',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}
    >
      {text}
    </span>
  );
}