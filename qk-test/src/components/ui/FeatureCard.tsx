import React from 'react';
import { LucideIcon } from 'lucide-react';

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
  return (
    <div className={`bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl hover:border-blue-300 transition-all duration-300 group h-full flex flex-col ${className}`}>
      <div 
        className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-all duration-300 mx-auto"
        style={{
          background: 'linear-gradient(135deg, #2563eb 0%, #1e3a8a 100%)',
          boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2), 0 2px 4px -1px rgba(30, 58, 138, 0.1)'
        }}
      >
        <Icon className="w-7 h-7 text-white" />
      </div>
      <h3 className="text-lg font-bold text-blue-900 mb-3 group-hover:text-blue-600 transition-colors text-center">
        {title}
      </h3>
      <p className="text-sm text-gray-600 leading-relaxed flex-grow text-center">
        {solution}
      </p>
    </div>
  );
};

export default FeatureCard;
