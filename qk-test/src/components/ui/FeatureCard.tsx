/**
 * File: FeatureCard.tsx
 * Purpose: Reusable feature card component for displaying SaaS features with permission-based access control.
 * 
 * This component provides:
 * - Dynamic feature display based on user permissions
 * - Consistent styling across the application
 * - Hover effects and interactive states
 * - Permission-based action buttons
 * 
 * Key Features:
 * - Permission-aware rendering
 * - Responsive design
 * - Accessibility support
 * - Customizable styling
 * 
 * Props:
 * - feature: Feature object with id, name, slug, description
 * - canEdit: Whether user can edit this feature
 * - canDelete: Whether user can delete this feature
 * - onEdit: Edit callback function
 * - onDelete: Delete callback function
 * - className: Additional CSS classes
 */

'use client';

import React from 'react';
import { Shield, Edit3, Trash2, ExternalLink, Lock } from 'lucide-react';
import { BLICKTRACK_THEME } from '@/lib/theme';

export interface Feature {
  id: string;
  name: string;
  slug?: string;
  key?: string;
  description?: string;
  isActive?: boolean;
}

interface FeatureCardProps {
  // For dashboard/management use
  feature?: Feature;
  canEdit?: boolean;
  canDelete?: boolean;
  onEdit?: (feature: Feature) => void;
  onDelete?: (feature: Feature) => void;
  onClick?: (feature: Feature) => void;
  className?: string;
  showActions?: boolean;
  
  // For landing page use
  icon?: React.ComponentType<any>;
  title?: string;
  solution?: string;
  problem?: string;
}

const getFeatureIcon = (slug?: string) => {
  if (!slug) return <Shield className="w-8 h-8" />;
  
  const iconMap: Record<string, React.ReactNode> = {
    'threat-modeling': <Shield className="w-8 h-8" />,
    'sbom-generation': <Shield className="w-8 h-8" />,
    'security-training': <Shield className="w-8 h-8" />,
    'compliance': <Shield className="w-8 h-8" />,
    'vulnerability-management': <Shield className="w-8 h-8" />,
    'incident-response': <Shield className="w-8 h-8" />,
    'risk-assessment': <Shield className="w-8 h-8" />,
    'audit-management': <Shield className="w-8 h-8" />,
    default: <Shield className="w-8 h-8" />
  };
  
  return iconMap[slug] || iconMap.default;
};

export default function FeatureCard({
  feature,
  canEdit = false,
  canDelete = false,
  onEdit,
  onDelete,
  onClick,
  className = '',
  showActions = true,
  // Landing page props
  icon: IconComponent,
  title,
  solution,
  problem
}: FeatureCardProps) {
  // Determine if this is a landing page card or a feature management card
  const isLandingPageCard = !feature && (title || solution);
  
  // Get display values
  const displayTitle = isLandingPageCard ? title : feature?.name;
  const displayDescription = isLandingPageCard ? solution : feature?.description;
  const displayIcon = isLandingPageCard ? (IconComponent ? <IconComponent className="w-8 h-8" /> : <Shield className="w-8 h-8" />) : getFeatureIcon(feature?.slug || feature?.key);
  const isActive = isLandingPageCard ? true : feature?.isActive;

  const handleCardClick = () => {
    if (onClick && feature) {
      onClick(feature);
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit && canEdit && feature) {
      onEdit(feature);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete && canDelete && feature) {
      onDelete(feature);
    }
  };

  return (
    <div
      className={`
        relative bg-white rounded-lg shadow-md border border-gray-200 
        hover:shadow-lg hover:border-blick-blue transition-all duration-300
        cursor-pointer group overflow-hidden
        ${className}
      `}
      onClick={handleCardClick}
      style={{
        fontFamily: BLICKTRACK_THEME.typography.fontFamily.primary
      }}
    >
      {/* Gradient accent bar */}
      <div 
        className="h-1 w-full"
        style={{
          background: `linear-gradient(90deg, ${BLICKTRACK_THEME.colors.primary.blue} 0%, ${BLICKTRACK_THEME.colors.primary.teal} 100%)`
        }}
      />
      
      <div className="p-6">
        {/* Header with icon and actions */}
        <div className="flex items-start justify-between mb-4">
          <div 
            className="p-3 rounded-lg"
            style={{
              background: `linear-gradient(135deg, ${BLICKTRACK_THEME.colors.primary.blue}15 0%, ${BLICKTRACK_THEME.colors.primary.teal}15 100%)`
            }}
          >
            {displayIcon}
          </div>
          
          {!isLandingPageCard && showActions && (canEdit || canDelete) && (
            <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {canEdit && (
                <button
                  onClick={handleEditClick}
                  className="p-2 rounded-md hover:bg-gray-100 transition-colors"
                  title="Edit feature"
                  style={{ color: BLICKTRACK_THEME.colors.primary.blue }}
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              )}
              {canDelete && (
                <button
                  onClick={handleDeleteClick}
                  className="p-2 rounded-md hover:bg-red-100 transition-colors"
                  title="Delete feature"
                  style={{ color: '#ef4444' }}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Feature content */}
        <div className="space-y-3">
          <h3 
            className="text-lg font-semibold text-gray-900 group-hover:text-blick-blue transition-colors"
            style={{ 
              fontFamily: BLICKTRACK_THEME.typography.fontFamily.primary,
              color: BLICKTRACK_THEME.colors.text.primary
            }}
          >
            {displayTitle}
          </h3>
          
          {displayDescription && (
            <p 
              className="text-sm text-gray-600 leading-relaxed"
              style={{ 
                fontFamily: BLICKTRACK_THEME.typography.fontFamily.primary,
                color: BLICKTRACK_THEME.colors.text.muted
              }}
            >
              {displayDescription}
            </p>
          )}

          {/* Feature status */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-2">
              <div 
                className={`w-2 h-2 rounded-full ${
                  isActive ? 'bg-green-500' : 'bg-gray-400'
                }`}
              />
              <span 
                className="text-xs font-medium"
                style={{ 
                  fontFamily: BLICKTRACK_THEME.typography.fontFamily.primary,
                  color: isActive ? BLICKTRACK_THEME.colors.primary.teal : BLICKTRACK_THEME.colors.text.muted
                }}
              >
                {isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <ExternalLink className="w-3 h-3" />
              <span>Access</span>
            </div>
          </div>
        </div>

        {/* Permission indicators */}
        {!isLandingPageCard && !canEdit && !canDelete && (
          <div className="absolute top-4 right-4">
            <Lock 
              className="w-4 h-4 text-gray-400"
            />
          </div>
        )}
      </div>

      {/* Hover effect overlay */}
      <div 
        className="absolute inset-0 bg-gradient-to-r from-blick-blue/5 to-blick-teal/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
      />
    </div>
  );
}