/**
 * FeatureManagementModal.tsx
 * 
 * 3-Column Feature Management Modal Component
 * 
 * Features:
 * - 3-column layout: Features → Sub-features → Details
 * - Interactive feature and sub-feature selection
 * - Edit/Delete actions with hover effects
 * - Professional UI/UX with status indicators
 * - Real-time data updates and refresh
 * - Accessibility support with keyboard navigation
 * 
 * @author BlickTrack Development Team
 * @version 1.0.0
 * @created 2025-01-30
 * @updated 2025-01-30
 */

'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle,
  ChevronDown,
  ChevronRight,
  Cog,
  Eye,
  EyeOff
} from 'lucide-react';
import { FeatureItem } from './FeatureItem';

interface FeatureManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: {
    id: string;
    name: string;
    displayName: string;
    color: string;
    features: any[];
  };
  onFeatureUpdate: () => void;
  onFeatureSelect?: (feature: any) => void;
  onSubFeatureSelect?: (subFeature: any) => void;
  onEditFeature?: (feature: any) => void;
  onEditSubFeature?: (subFeature: any) => void;
  onDeleteFeature?: (featureId: string, featureName: string) => void;
  onDeleteSubFeature?: (subFeatureId: string, subFeatureName: string) => void;
  selectedFeature?: any;
  selectedSubFeature?: any;
}

export const FeatureManagementModal: React.FC<FeatureManagementModalProps> = ({
  isOpen,
  onClose,
  category,
  onFeatureUpdate,
  onFeatureSelect,
  onSubFeatureSelect,
  onEditFeature,
  onEditSubFeature,
  onDeleteFeature,
  onDeleteSubFeature,
  selectedFeature,
  selectedSubFeature
}) => {
  const [features, setFeatures] = useState<any[]>([]);
  const [showAddFeature, setShowAddFeature] = useState(false);

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

  useEffect(() => {
    if (isOpen && category) {
      setFeatures(category.features || []);
    }
  }, [isOpen, category]);

  const toggleFeatureExpanded = (featureId: string) => {
    setExpandedFeatures(prev => {
      const newSet = new Set(prev);
      if (newSet.has(featureId)) {
        newSet.delete(featureId);
      } else {
        newSet.add(featureId);
      }
      return newSet;
    });
  };



  const handleEditFeature = (feature: any) => {
    // TODO: Implement edit feature functionality
    console.log('Edit feature:', feature);
  };

  const handleAddFeature = () => {
    setShowAddFeature(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: category.color }}
            >
              {category.displayName.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Manage Features - {category.displayName}
              </h2>
              <p className="text-sm text-gray-500">
                Add, edit, or remove features from this category
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content - 3 Column Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Column 1: Features List */}
          <div className="w-80 border-r border-gray-200 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Features ({features.length})
              </h3>
              <button
                onClick={handleAddFeature}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1 text-sm"
              >
                <Plus className="w-3 h-3" />
                <span>Add</span>
              </button>
            </div>

            {features.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                  <Cog className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">
                  No features yet
                </h3>
                <p className="text-xs text-gray-500 mb-3">
                  Add features to this category
                </p>
                <button
                  onClick={handleAddFeature}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Add First Feature
                </button>
              </div>
            ) : (
              <div className="space-y-1">
                {features.map(feature => (
                  <div
                    key={feature.id}
                    className="group"
                  >
                    <div
                      onClick={() => onFeatureSelect?.(feature)}
                      className={`w-full px-3 py-2.5 text-left hover:bg-gray-50 transition-colors flex items-center justify-between rounded-md border cursor-pointer ${
                        selectedFeature?.id === feature.id 
                          ? 'bg-blue-50 border-blue-200 shadow-sm' 
                          : 'border-transparent hover:border-gray-200'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-5 h-5 rounded-md flex items-center justify-center text-xs"
                          style={{ 
                            backgroundColor: category.color + '15', 
                            color: category.color 
                          }}
                        >
                          {getFeatureIcon(feature.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {feature.displayName}
                          </h4>
                          <p className="text-xs text-gray-500 truncate">
                            Level {feature.level || 1}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        {feature.isActive ? (
                          <CheckCircle className="w-3 h-3 text-green-500" />
                        ) : (
                          <XCircle className="w-3 h-3 text-red-500" />
                        )}
                        {feature.children && feature.children.length > 0 && (
                          <ChevronRight className="w-3 h-3 text-gray-400" />
                        )}
                        
                        {/* Action Buttons */}
                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditFeature?.(feature);
                            }}
                            className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                            title="Edit Feature"
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                e.stopPropagation();
                                onEditFeature?.(feature);
                              }
                            }}
                          >
                            <Edit className="w-3 h-3" />
                          </div>
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteFeature?.(feature.id, feature.displayName);
                            }}
                            className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                            title="Delete Feature"
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                e.stopPropagation();
                                onDeleteFeature?.(feature.id, feature.displayName);
                              }
                            }}
                          >
                            <Trash2 className="w-3 h-3" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Column 2: Sub-features List */}
          <div className="w-80 border-r border-gray-200 p-6 overflow-y-auto">
            {selectedFeature ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Sub-features ({selectedFeature.children?.length || 0})
                  </h3>
                  <button
                    onClick={() => {/* TODO: Add sub-feature */}}
                    className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-1 text-sm"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add</span>
                  </button>
                </div>

                {selectedFeature.children && selectedFeature.children.length > 0 ? (
                  <div className="space-y-1">
                    {selectedFeature.children.map(subFeature => (
                      <div
                        key={subFeature.id}
                        className="group"
                      >
                        <div
                          onClick={() => onSubFeatureSelect?.(subFeature)}
                          className={`w-full px-3 py-2.5 text-left hover:bg-gray-50 transition-colors flex items-center justify-between rounded-md border cursor-pointer ${
                            selectedSubFeature?.id === subFeature.id 
                              ? 'bg-green-50 border-green-200 shadow-sm' 
                              : 'border-transparent hover:border-gray-200'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <div 
                              className="w-5 h-5 rounded-md flex items-center justify-center text-xs bg-gray-100"
                            >
                              {getFeatureIcon(subFeature.name)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-gray-900 truncate">
                                {subFeature.displayName}
                              </h4>
                              <p className="text-xs text-gray-500 truncate">
                                Level {subFeature.level || 2}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            {subFeature.isActive ? (
                              <CheckCircle className="w-3 h-3 text-green-500" />
                            ) : (
                              <XCircle className="w-3 h-3 text-red-500" />
                            )}
                            
                            {/* Action Buttons */}
                            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onEditSubFeature?.(subFeature);
                                }}
                                className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                                title="Edit Sub-feature"
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onEditSubFeature?.(subFeature);
                                  }
                                }}
                              >
                                <Edit className="w-3 h-3" />
                              </div>
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDeleteSubFeature?.(subFeature.id, subFeature.displayName);
                                }}
                                className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                                title="Delete Sub-feature"
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onDeleteSubFeature?.(subFeature.id, subFeature.displayName);
                                  }
                                }}
                              >
                                <Trash2 className="w-3 h-3" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                      <Cog className="w-6 h-6 text-gray-400" />
                    </div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1">
                      No sub-features
                    </h3>
                    <p className="text-xs text-gray-500 mb-3">
                      Add sub-features to this feature
                    </p>
                    <button
                      onClick={() => {/* TODO: Add sub-feature */}}
                      className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      Add Sub-feature
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <ChevronRight className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Select a Feature
                </h3>
                <p className="text-gray-500">
                  Choose a feature from the left to view its sub-features
                </p>
              </div>
            )}
          </div>

          {/* Column 3: Details & Actions */}
          <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
            {selectedSubFeature ? (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Sub-feature Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Name</label>
                    <p className="text-sm text-gray-900">{selectedSubFeature.displayName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Type</label>
                    <p className="text-sm text-gray-900 capitalize">{selectedSubFeature.type || 'sub-feature'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Level</label>
                    <p className="text-sm text-gray-900">{selectedSubFeature.level || 2}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <div className="flex items-center space-x-2">
                      {selectedSubFeature.isActive ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                      <span className="text-sm text-gray-900">
                        {selectedSubFeature.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Visible</label>
                    <div className="flex items-center space-x-2">
                      {selectedSubFeature.isVisible ? (
                        <Eye className="w-4 h-4 text-green-500" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-red-500" />
                      )}
                      <span className="text-sm text-gray-900">
                        {selectedSubFeature.isVisible ? 'Visible' : 'Hidden'}
                      </span>
                    </div>
                  </div>
                  {selectedSubFeature.description && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Description</label>
                      <p className="text-sm text-gray-900">{selectedSubFeature.description}</p>
                    </div>
                  )}
                  <div className="pt-4 border-t border-gray-200 space-y-2">
                    <button
                      onClick={() => onEditSubFeature?.(selectedSubFeature)}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Edit Sub-feature
                    </button>
                    <button
                      onClick={() => onDeleteSubFeature?.(selectedSubFeature.id, selectedSubFeature.displayName)}
                      className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Delete Sub-feature
                    </button>
                  </div>
                </div>
              </div>
            ) : selectedFeature ? (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Feature Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Name</label>
                    <p className="text-sm text-gray-900">{selectedFeature.displayName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Type</label>
                    <p className="text-sm text-gray-900 capitalize">{selectedFeature.type || 'feature'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Level</label>
                    <p className="text-sm text-gray-900">{selectedFeature.level || 1}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <div className="flex items-center space-x-2">
                      {selectedFeature.isActive ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                      <span className="text-sm text-gray-900">
                        {selectedFeature.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Visible</label>
                    <div className="flex items-center space-x-2">
                      {selectedFeature.isVisible ? (
                        <Eye className="w-4 h-4 text-green-500" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-red-500" />
                      )}
                      <span className="text-sm text-gray-900">
                        {selectedFeature.isVisible ? 'Visible' : 'Hidden'}
                      </span>
                    </div>
                  </div>
                  {selectedFeature.description && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Description</label>
                      <p className="text-sm text-gray-900">{selectedFeature.description}</p>
                    </div>
                  )}
                  <div className="pt-4 border-t border-gray-200 space-y-2">
                    <button
                      onClick={() => onEditFeature?.(selectedFeature)}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Edit Feature
                    </button>
                    <button
                      onClick={() => onDeleteFeature?.(selectedFeature.id, selectedFeature.displayName)}
                      className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Delete Feature
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Cog className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Select a Feature
                </h3>
                <p className="text-gray-500">
                  Choose a feature from the left to view its details and manage it
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>

    </div>
  );
};