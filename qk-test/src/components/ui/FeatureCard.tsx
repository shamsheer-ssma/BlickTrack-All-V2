import React from 'react';
import { LucideIcon } from 'lucide-react';
import { BLICKTRACK_THEME, getCardStyle } from '@/lib/theme';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  solution: string;
  problem?: string;
  className?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  solution,
  className = '',
}) => {
  const cardStyle = getCardStyle();
  
  return (
    <div 
      className={`p-6 hover:shadow-xl transition-all duration-300 group h-full flex flex-col ${className}`}
      style={cardStyle}
    >
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-all duration-300 mx-auto"
        style={{
          background: BLICKTRACK_THEME.colors.gradients.primary,
          boxShadow: BLICKTRACK_THEME.colors.shadows.primary,
        }}
      >
        <Icon className="w-7 h-7 text-white" />
      </div>
      <h3 
        className="text-lg font-bold mb-3 group-hover:transition-colors text-center"
        style={{
          color: BLICKTRACK_THEME.colors.primary.blue,
          fontFamily: BLICKTRACK_THEME.typography.fontFamily.primary,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = BLICKTRACK_THEME.colors.primary.teal;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = BLICKTRACK_THEME.colors.primary.blue;
        }}
      >
        {title}
      </h3>
      <p 
        className="text-sm leading-relaxed flex-grow text-center"
        style={{
          color: BLICKTRACK_THEME.colors.text.muted,
          fontFamily: BLICKTRACK_THEME.typography.fontFamily.primary,
        }}
      >
        {solution}
      </p>
    </div>
  );
};

export default FeatureCard;
