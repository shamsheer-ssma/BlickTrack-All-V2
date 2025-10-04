/**
 * FeatureItem.tsx
 * 
 * Reusable Feature Item Component
 * 
 * Features:
 * - Displays individual features and sub-features
 * - Hierarchical support with indentation
 * - Interactive selection and expansion
 * - Edit/Delete actions with hover effects
 * - Status indicators and visual feedback
 * - Accessibility support with keyboard navigation
 * - Customizable icons and styling
 * 
 * @author BlickTrack Development Team
 * @version 1.0.0
 * @created 2025-01-30
 * @updated 2025-01-30
 */

'use client';

import React, { useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  ChevronDown, 
  ChevronRight, 
  Edit, 
  Trash2, 
  Cog,
  MoreVertical
} from 'lucide-react';

interface FeatureItemProps {
  feature: {
    id: string;
    name: string;
    displayName: string;
    description?: string;
    type: 'feature' | 'sub-feature';
    level: number;
    isActive: boolean;
    isVisible: boolean;
    children?: any[];
  };
  categoryColor: string;
  onSelect: (feature: any) => void;
  onEdit: (feature: any) => void;
  onDelete: (featureId: string, featureName: string) => void;
  onToggleExpanded: (featureId: string) => void;
  isExpanded: boolean;
  isSelected: boolean;
  depth?: number;
}

export const FeatureItem: React.FC<FeatureItemProps> = ({
  feature,
  categoryColor,
  onSelect,
  onEdit,
  onDelete,
  onToggleExpanded,
  isExpanded,
  isSelected,
  depth = 0
}) => {
  const hasChildren = feature.children && feature.children.length > 0;
  const indentClass = depth > 0 ? `ml-${depth * 4}` : '';

  const getFeatureIcon = (featureName: string) => {
    const iconMap: { [key: string]: any } = {
      'threat-modeling': '🛡️',
      'basic-threat-modeling': '📋',
      'ai-enhanced-threat-modeling': '🤖',
      'compliance-management': '📊',
      'analytics-dashboard': '📈',
      'third-party-integrations': '🔌',
      'vulnerability-scanning': '🔍',
      'incident-response': '🚨',
      'sbom-management': '📦'
    };
    return iconMap[featureName] || '⚙️';
  };

  return (
    <div className={`group ${indentClass}`}>
      {/* Feature Item */}
      <div
        onClick={() => onSelect(feature)}
        className={`w-full px-3 py-2.5 text-left hover:bg-gray-50 transition-colors flex items-center justify-between rounded-md border cursor-pointer ${
          isSelected 
            ? 'bg-blue-50 border-blue-200 shadow-sm' 
            : 'border-transparent hover:border-gray-200'
        }`}
        style={{ marginLeft: `${depth * 16}px` }}
      >
        <div className="flex items-center space-x-3">
          <div 
            className="w-6 h-6 rounded-md flex items-center justify-center text-sm"
            style={{ 
              backgroundColor: categoryColor + '15', 
              color: categoryColor 
            }}
          >
            {getFeatureIcon(feature.name)}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900 truncate">
              {feature.displayName}
            </h4>
            {feature.description && (
              <p className="text-xs text-gray-500 truncate mt-1">
                {feature.description}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2 ml-2">
          {/* Status Indicator */}
          {feature.isActive ? (
            <CheckCircle className="w-4 h-4 text-green-500" />
          ) : (
            <XCircle className="w-4 h-4 text-red-500" />
          )}
          
          {/* Expand/Collapse for features with children */}
          {hasChildren && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpanded(feature.id);
              }}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              {isExpanded ? (
                <ChevronDown className="w-3 h-3 text-gray-400" />
              ) : (
                <ChevronRight className="w-3 h-3 text-gray-400" />
              )}
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <div
              onClick={(e) => {
                e.stopPropagation();
                onEdit(feature);
              }}
              className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
              title="Edit Feature"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  e.stopPropagation();
                  onEdit(feature);
                }
              }}
            >
              <Edit className="w-3 h-3" />
            </div>
            <div
              onClick={(e) => {
                e.stopPropagation();
                onDelete(feature.id, feature.displayName);
              }}
              className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
              title="Delete Feature"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  e.stopPropagation();
                  onDelete(feature.id, feature.displayName);
                }
              }}
            >
              <Trash2 className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>

      {/* Sub-features */}
      {hasChildren && isExpanded && (
        <div className="mt-1 space-y-1">
          {feature.children?.map(subFeature => (
            <FeatureItem
              key={subFeature.id}
              feature={subFeature}
              categoryColor={categoryColor}
              onSelect={onSelect}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleExpanded={onToggleExpanded}
              isExpanded={false} // Sub-features don't expand by default
              isSelected={isSelected && selectedFeature?.id === subFeature.id}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};
