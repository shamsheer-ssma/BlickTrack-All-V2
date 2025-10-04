/**
 * FeatureManagementNew.tsx
 * 
 * Comprehensive Feature Management System with 3-Column Layout
 * 
 * Features:
 * - 3-column layout: Categories → Features → Sub-features
 * - Full CRUD operations for categories, features, and sub-features
 * - Persistent database operations with PostgreSQL
 * - Professional UI/UX with hover effects and status indicators
 * - Edit/Delete functionality with confirmation modals
 * - Real-time data fetching and updates
 * 
 * @author BlickTrack Development Team
 * @version 1.0.0
 * @created 2025-01-30
 * @updated 2025-01-30
 */

'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  FolderOpen, 
  ChevronRight, 
  ChevronDown,
  ChevronUp,
  Users,
  Shield,
  BarChart3,
  FileText,
  Plug,
  Eye,
  EyeOff,
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertCircle,
  Crown,
  Zap,
  Layers,
  Target,
  Brain,
  Lock,
  CheckSquare,
  AlertTriangle,
  Activity,
  Edit,
  Trash2,
  Cog,
  RefreshCw
} from 'lucide-react';
import ConfirmationModal from '@/components/ui/ConfirmationModal';

interface SubscriptionPlan {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  tier: number;
  price: number;
  currency: string;
  billingCycle: string;
  isActive: boolean;
}

interface Feature {
  id: string;
  name: string;
  displayName: string;
  description: string;
  type: 'parent' | 'child' | 'standalone';
  level: number;
  isActive: boolean;
  isVisible: boolean;
  parentId?: string;
  subscriptionPlanId?: string;
  subscriptionPlan?: SubscriptionPlan;
  categories?: Array<{
    id: string;
    order: number;
    isPrimary: boolean;
    category: {
      id: string;
      name: string;
      displayName: string;
      icon: string;
      color: string;
    };
  }>;
  children?: Feature[];
}

interface Category {
  id: string;
  name: string;
  displayName: string;
  description: string;
  icon: string;
  color: string;
  order: number;
  priority?: number;
  isActive: boolean;
  isVisible: boolean;
  features?: Array<{
    id: string;
    order: number;
    isPrimary: boolean;
    feature: Feature;
  }>;
}

interface Tenant {
  id: string;
  name: string;
  isActive: boolean;
  subscriptionPlan: string;
  features?: string[];
}

interface FeatureManagementProps {
  tenantId?: string;
  tenantName?: string;
}

export default function FeatureManagementNew({ tenantId, tenantName }: FeatureManagementProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [tenantAccess, setTenantAccess] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [expandedFeatures, setExpandedFeatures] = useState<Set<string>>(new Set());
  const [allExpanded, setAllExpanded] = useState(true);
  const [sortBy, setSortBy] = useState<'name' | 'priority' | 'features'>('priority');
  const [showAddFeatureModal, setShowAddFeatureModal] = useState(false);
  const [addFeatureType, setAddFeatureType] = useState<'category' | 'feature' | 'subfeature'>('category');
  const [selectedParentCategory, setSelectedParentCategory] = useState('');
  const [selectedParentFeature, setSelectedParentFeature] = useState('');
  const [formError, setFormError] = useState<string>('');
  
  // Feature management states
  const [selectedFeatureForManagement, setSelectedFeatureForManagement] = useState<any>(null);
  const [selectedSubFeature, setSelectedSubFeature] = useState<any>(null);
  const [expandedFeaturesInManagement, setExpandedFeaturesInManagement] = useState<Set<string>>(new Set());
  const [showFeatureDeleteConfirm, setShowFeatureDeleteConfirm] = useState<{
    isOpen: boolean;
    featureId: string;
    featureName: string;
    isSubFeature: boolean;
  }>({
    isOpen: false,
    featureId: '',
    featureName: '',
    isSubFeature: false
  });
  const [editingFeature, setEditingFeature] = useState<any>(null);
  const [editingSubFeature, setEditingSubFeature] = useState<any>(null);
  const [featureForm, setFeatureForm] = useState({
    name: '',
    displayName: '',
    description: '',
    type: 'feature',
    level: 1,
    isActive: true,
    isVisible: true,
    subscriptionPlanId: ''
  });
  const [subFeatureForm, setSubFeatureForm] = useState({
    name: '',
    displayName: '',
    description: '',
    type: 'sub-feature',
    level: 2,
    isActive: true,
    isVisible: true,
    subscriptionPlanId: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCategory, setEditingCategory] = useState<{ id: string; displayName: string } | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{
    isOpen: boolean;
    categoryId: string;
    categoryName: string;
  }>({
    isOpen: false,
    categoryId: '',
    categoryName: ''
  });
  
  // Form states
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    displayName: '',
    description: '',
    icon: 'Shield',
    color: '#3B82F6'
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedFeature) {
      fetchTenantFeatures(selectedFeature.id);
      fetchTenantAccess(selectedFeature.id);
    }
  }, [selectedFeature]);

  const fetchData = async (forceRefresh = false) => {
    const now = Date.now();
    const CACHE_DURATION = 30000; // 30 seconds cache
    
    // Check if we need to refresh data
    if (!forceRefresh && now - lastFetchTime < CACHE_DURATION && categories.length > 0) {
      console.log('🚀 [FEATURE MANAGEMENT] Using cached data');
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setIsRefreshing(true);
    try {
      console.log('🔍 [FEATURE MANAGEMENT] Fetching data from API...');
      
      // Load categories first (most important for initial display)
      const categoriesRes = await fetch('/api/admin/feature-categories');
      const categoriesData = await categoriesRes.json();
      
      if (categoriesData.success) {
        setCategories(categoriesData.data);
        console.log('✅ [FEATURE MANAGEMENT] Categories loaded:', categoriesData.data.length);
        
        // Auto-expand ALL categories by default (dropdown style)
        if (categoriesData.data.length > 0) {
          const allCategoryIds = categoriesData.data.map((category: any) => category.id);
          setExpandedCategories(new Set(allCategoryIds));
          setAllExpanded(true);
          console.log('✅ [FEATURE MANAGEMENT] All categories expanded by default:', allCategoryIds);
        }
      } else {
        console.error('❌ [FEATURE MANAGEMENT] Failed to load categories:', categoriesData.error);
      }
      
      // Load features, tenants, and subscription plans in parallel (less critical for initial display)
      const [featuresRes, tenantsRes, subscriptionRes] = await Promise.all([
        fetch('/api/admin/features'),
        fetch('/api/admin/tenants'),
        fetch('/api/admin/subscription-plans')
      ]);

      const [featuresData, tenantsData, subscriptionData] = await Promise.all([
        featuresRes.json(),
        tenantsRes.json(),
        subscriptionRes.json()
      ]);
      
      if (featuresData.success) {
        setFeatures(featuresData.data);
        console.log('✅ [FEATURE MANAGEMENT] Features loaded:', featuresData.data.length);
      }
      
      if (tenantsData.success) {
        setTenants(tenantsData.data);
        console.log('✅ [FEATURE MANAGEMENT] Tenants loaded:', tenantsData.data.length);
      }
      
      if (subscriptionData.success) {
        setSubscriptionPlans(subscriptionData.data);
        console.log('✅ [FEATURE MANAGEMENT] Subscription plans loaded:', subscriptionData.data.length);
      }
      
      setLastFetchTime(now);
    } catch (error) {
      console.error('❌ [FEATURE MANAGEMENT] Error fetching data:', error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // API functions for creating new items
  const createCategory = async (formData: any) => {
    try {
      console.log('🔍 Creating category with data:', formData);
      const response = await fetch('/api/admin/feature-categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();
      console.log('📡 Create category response:', result);
      
      if (!response.ok) {
        throw new Error(result.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      return result;
      } catch (error) {
        console.error('❌ Create category error:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
      }
  };

  const createFeature = async (formData: any) => {
    console.log('🔍 [CREATE FEATURE] Sending data to API:', formData);
    const response = await fetch('/api/admin/features', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    const result = await response.json();
    console.log('🔍 [CREATE FEATURE] API response:', result);
    return result;
  };

  const createSubFeature = async (formData: any) => {
    console.log('🔍 [CREATE SUB-FEATURE] Sending data to API:', formData);
    const response = await fetch('/api/admin/features', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    const result = await response.json();
    console.log('🔍 [CREATE SUB-FEATURE] API response:', result);
    return result;
  };

  const updateCategory = async (categoryId: string, formData: any) => {
    try {
      console.log('🔍 Updating category with data:', { categoryId, formData });
      const response = await fetch(`/api/admin/feature-categories?id=${categoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const result = await response.json();
      console.log('📡 Update category response:', result);
      
      if (!response.ok) {
        throw new Error(result.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      return result;
    } catch (error) {
      console.error('❌ Update category error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  };

  const deleteCategory = async (categoryId: string) => {
    try {
      console.log('🔍 Deleting category:', categoryId);
      const response = await fetch(`/api/admin/feature-categories?id=${categoryId}`, {
        method: 'DELETE',
      });
      
      console.log('📡 Delete response status:', response.status);
      console.log('📡 Delete response headers:', response.headers.get('content-type'));
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('❌ Non-JSON response:', text);
        throw new Error(`Server returned non-JSON response: ${text.substring(0, 100)}...`);
      }
      
      const result = await response.json();
      console.log('📡 Delete category response:', result);
      
      if (!response.ok) {
        throw new Error(result.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      return result;
    } catch (error) {
      console.error('❌ Delete category error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      let result;

      console.log('🔍 [SUBMIT] Starting form submission:', { addFeatureType, editingCategory: !!editingCategory });

      if (addFeatureType === 'category') {
        console.log('🔍 [SUBMIT] Category form data:', categoryForm);
        
          // Validate required fields
          if (!categoryForm.name || !categoryForm.displayName) {
            // Show validation error in console and prevent submission
            console.error('❌ Validation failed: Name and Display Name are required for categories');
            return;
          }

        if (editingCategory) {
          console.log('🔍 [SUBMIT] Updating category:', editingCategory.id);
          result = await updateCategory(editingCategory.id, categoryForm);
        } else {
          console.log('🔍 [SUBMIT] Creating new category');
          result = await createCategory(categoryForm);
        }
      } else if (addFeatureType === 'feature') {
        console.log('🔍 [SUBMIT] Feature form data:', featureForm);
        
        // Validate required fields for features
        if (!featureForm.name || !featureForm.displayName) {
          setFormError('Name and Display Name are required for features');
          console.error('❌ Validation failed: Name and Display Name are required for features');
          return;
        }
        
        if (!selectedParentCategory) {
          setFormError('Please select a category for the feature');
          console.error('❌ Validation failed: Please select a category for the feature');
          return;
        }
        
        result = await createFeature({
          ...featureForm,
          categoryId: selectedParentCategory
        } as any);
      } else if (addFeatureType === 'subfeature') {
        console.log('🔍 [SUBMIT] Sub-feature form data:', subFeatureForm);
        
        // Validate required fields for sub-features
        if (!subFeatureForm.name || !subFeatureForm.displayName) {
          setFormError('Name and Display Name are required for sub-features');
          console.error('❌ Validation failed: Name and Display Name are required for sub-features');
          return;
        }
        
        if (!selectedParentFeature) {
          setFormError('Please select a parent feature for the sub-feature');
          console.error('❌ Validation failed: Please select a parent feature for the sub-feature');
          return;
        }
        
        result = await createSubFeature({
          ...subFeatureForm,
          parentId: selectedParentFeature
        });
      }

      if (result?.success) {
        console.log('✅ Successfully created:', addFeatureType, result.data);
        // Clear any previous errors
        setFormError('');
        
        // Azure-style smooth updates - update local state instead of full refresh
        if (addFeatureType === 'category') {
          if (editingCategory) {
            // Update existing category
            setCategories(prevCategories =>
              prevCategories.map(category =>
                category.id === editingCategory.id
                  ? { ...category, ...categoryForm }
                  : category
              )
            );
            console.log('✅ Category updated with smooth state update');
          } else {
            // Add new category and expand it by default
            setCategories(prevCategories => [...prevCategories, result.data]);
            setExpandedCategories(prevExpanded => new Set(Array.from(prevExpanded).concat(result.data.id)));
            setAllExpanded(true); // Keep all expanded state
            console.log('✅ Category added with smooth state update and auto-expanded');
          }
        } else if (addFeatureType === 'feature') {
          // Add new feature
          setFeatures(prevFeatures => [...prevFeatures, result.data]);
          console.log('✅ Feature added with smooth state update');
        } else if (addFeatureType === 'subfeature') {
          // Add new sub-feature
          setFeatures(prevFeatures => [...prevFeatures, result.data]);
          console.log('✅ Sub-feature added with smooth state update');
        }
        
        // Close modal and reset forms
        setShowAddFeatureModal(false);
        resetForms();
        console.log('✅ Successfully created with smooth update:', addFeatureType);
        } else {
          console.error('❌ Failed to create:', result?.error);
          console.error('❌ Full result:', result);
          // Show error to user
          setFormError(result?.error || 'Unknown error occurred');
          console.error(`Failed to ${editingCategory ? 'update' : 'create'}. Error: ${result?.error || 'Unknown error'}`);
        }
    } catch (error) {
      console.error('❌ Error creating:', error);
      // Show error in console instead of alert
      console.error(`An error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset all forms
  const resetForms = () => {
    setCategoryForm({
      name: '',
      displayName: '',
      description: '',
      icon: 'Shield',
      color: '#3B82F6'
    });
    setFeatureForm({
      name: '',
      displayName: '',
      description: '',
      type: 'feature',
      level: 1,
      isActive: true,
      isVisible: true,
      subscriptionPlanId: ''
    });
    setSubFeatureForm({
      name: '',
      displayName: '',
      description: '',
      type: 'sub-feature',
      level: 2,
      isActive: true,
      isVisible: true,
      subscriptionPlanId: ''
    });
    setSelectedParentCategory('');
    setSelectedParentFeature('');
    setEditingCategory(null);
  };

  // Handle edit category
  const handleEditCategory = (category: any) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      displayName: category.displayName,
      description: category.description || '',
      icon: category.icon || 'Shield',
      color: category.color || '#3B82F6'
    });
    setAddFeatureType('category');
    setShowAddFeatureModal(true);
  };

  // Handle delete category
  const handleDeleteCategory = async (categoryId: string) => {
    try {
      console.log('🔍 Attempting to delete category:', categoryId);
      
      // Call the API to delete from database
      const result = await deleteCategory(categoryId);
      console.log('📡 Delete result:', result);
      
      if (result?.success) {
        // Only remove from UI after successful database deletion
        const updatedCategories = categories.filter(cat => cat.id !== categoryId);
        setCategories(updatedCategories);
        
        // Close confirmation modal
        setShowDeleteConfirm({
          isOpen: false,
          categoryId: '',
          categoryName: ''
        });
        
        console.log('✅ Category deleted successfully from database!');
      } else {
        console.error('❌ Failed to delete category from database:', result?.error);
        // Show specific error message based on the error type
        const errorMessage = result?.error || 'Unknown error';
        if (errorMessage.includes('features')) {
          alert(`Cannot delete category: ${errorMessage}. Please remove all features from this category first.`);
        } else {
          alert(`Failed to delete category: ${errorMessage}`);
        }
      }
      
    } catch (error) {
      console.error('❌ Error deleting category:', error);
      alert(`An error occurred while deleting the category: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Handle delete confirmation
  const handleDeleteClick = (categoryId: string, categoryName: string) => {
    setShowDeleteConfirm({
      isOpen: true,
      categoryId,
      categoryName
    });
  };

  // Handle cancel delete
  const handleCancelDelete = () => {
    setShowDeleteConfirm({
      isOpen: false,
      categoryId: '',
      categoryName: ''
    });
  };

  // Feature Management Functions
  const handleFeatureSelect = (feature: any) => {
    setSelectedFeatureForManagement(feature);
    setSelectedSubFeature(null);
  };

  const handleSubFeatureSelect = (subFeature: any) => {
    setSelectedSubFeature(subFeature);
  };

  const toggleFeatureExpanded = (featureId: string) => {
    setExpandedFeaturesInManagement(prev => {
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
    console.log('🔍 Editing feature:', feature);
    setEditingFeature(feature);
    setEditingSubFeature(null);
    setAddFeatureType('feature'); // Set to feature to avoid showing category form
    setShowAddFeatureModal(true); // Open the modal
    setFeatureForm({
      name: feature.name || '',
      displayName: feature.displayName || '',
      description: feature.description || '',
      type: feature.type || 'feature',
      level: feature.level || 1,
      isActive: feature.isActive !== undefined ? feature.isActive : true,
      isVisible: feature.isVisible !== undefined ? feature.isVisible : true,
      subscriptionPlanId: feature.subscriptionPlanId || ''
    });
    console.log('✅ Feature form initialized and modal opened');
  };

  const handleEditSubFeature = (subFeature: any) => {
    console.log('🔍 Editing sub-feature:', subFeature);
    setEditingSubFeature(subFeature);
    setEditingFeature(null);
    setAddFeatureType('subfeature'); // Set to subfeature to avoid showing category form
    setShowAddFeatureModal(true); // Open the modal
    setSubFeatureForm({
      name: subFeature.name || '',
      displayName: subFeature.displayName || '',
      description: subFeature.description || '',
      type: subFeature.type || 'sub-feature',
      level: subFeature.level || 2,
      isActive: subFeature.isActive !== undefined ? subFeature.isActive : true,
      isVisible: subFeature.isVisible !== undefined ? subFeature.isVisible : true,
      subscriptionPlanId: subFeature.subscriptionPlanId || ''
    });
    console.log('✅ Sub-feature form initialized and modal opened:', {
      name: subFeature.name || '',
      displayName: subFeature.displayName || '',
      description: subFeature.description || '',
      type: subFeature.type || 'sub-feature',
      level: subFeature.level || 2,
      isActive: subFeature.isActive !== undefined ? subFeature.isActive : true,
      isVisible: subFeature.isVisible !== undefined ? subFeature.isVisible : true
    });
  };

  const handleDeleteFeatureClick = (featureId: string, featureName: string, isSubFeature: boolean = false) => {
    setShowFeatureDeleteConfirm({
      isOpen: true,
      featureId,
      featureName,
      isSubFeature
    });
  };

  const handleDeleteFeature = async (featureId: string) => {
    try {
      console.log('🔍 Deleting feature:', featureId);
      const response = await fetch(`/api/admin/features?id=${featureId}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete feature');
      }

      // Refresh the category to update feature list
      await fetchCategories();
      
      // Clear selections
      setSelectedFeatureForManagement(null);
      setSelectedSubFeature(null);
      
      console.log('✅ Feature deleted successfully');
    } catch (error) {
      console.error('❌ Error deleting feature:', error);
      alert('Failed to delete feature: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleCancelFeatureDelete = () => {
    setShowFeatureDeleteConfirm({
      isOpen: false,
      featureId: '',
      featureName: '',
      isSubFeature: false
    });
  };

  // Handle cancel edit operations
  const handleCancelEdit = () => {
    // Clear editing states
    setEditingFeature(null);
    setEditingSubFeature(null);
    
    // Reset forms
    setFeatureForm({
      name: '',
      displayName: '',
      description: '',
      type: 'feature',
      level: 1,
      isActive: true,
      isVisible: true,
      subscriptionPlanId: ''
    });
    
    setSubFeatureForm({
      name: '',
      displayName: '',
      description: '',
      type: 'sub-feature',
      level: 2,
      isActive: true,
      isVisible: true,
      subscriptionPlanId: ''
    });
    
    // Close modal
    setShowAddFeatureModal(false);
    setFormError('');
    
    console.log('✅ Edit operation cancelled');
  };

  // Toggle expand/collapse all categories
  const toggleAllCategories = () => {
    if (allExpanded) {
      // Collapse all
      setExpandedCategories(new Set());
      setAllExpanded(false);
      console.log('✅ All categories collapsed');
    } else {
      // Expand all
      const allCategoryIds = categories.map(category => category.id);
      setExpandedCategories(new Set(allCategoryIds));
      setAllExpanded(true);
      console.log('✅ All categories expanded');
    }
  };

  const updateFeature = async (featureId: string, updates: any) => {
    try {
      const response = await fetch(`/api/admin/features?id=${featureId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to update feature');
      }

      // Refresh categories to show updated data
      await fetchCategories();
      
      console.log('✅ Feature updated successfully');
      return result;
    } catch (error) {
      console.error('❌ Error updating feature:', error);
      throw error;
    }
  };

  const handleUpdateFeature = async () => {
    if (!editingFeature) return;
    
    try {
      setIsSubmitting(true);
      const result = await updateFeature(editingFeature.id, featureForm);
      
      // Update local state immediately (Azure-style smooth update)
      setFeatures(prevFeatures => 
        prevFeatures.map(feature => 
          feature.id === editingFeature.id 
            ? { ...feature, ...featureForm, type: featureForm.type as 'parent' | 'child' | 'standalone' }
            : feature
        )
      );
      
      // Update categories if this feature is in a category
      setCategories(prevCategories =>
        prevCategories.map(category => ({
          ...category,
          features: category.features?.map(feature =>
            feature.id === editingFeature.id
              ? { ...feature, ...featureForm }
              : feature
          ) || []
        }))
      );
      
      // Clear editing state
      setEditingFeature(null);
      setFeatureForm({
        name: '',
        displayName: '',
        description: '',
        type: 'feature',
        level: 1,
        isActive: true,
        isVisible: true,
        subscriptionPlanId: ''
      });
      
      // Close the modal
      setShowAddFeatureModal(false);
      setFormError('');
      
      console.log('✅ Feature updated successfully with smooth state update');
    } catch (error) {
      console.error('❌ Error updating feature:', error);
      setFormError(error instanceof Error ? error.message : 'Failed to update feature');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateSubFeature = async () => {
    if (!editingSubFeature) {
      console.log('❌ No sub-feature being edited');
      return;
    }
    
    console.log('🔍 Updating sub-feature:', {
      id: editingSubFeature.id,
      form: subFeatureForm
    });
    
    try {
      setIsSubmitting(true);
      const result = await updateFeature(editingSubFeature.id, subFeatureForm);
      console.log('✅ Update result:', result);
      
      // Update local state immediately (Azure-style smooth update)
      setFeatures(prevFeatures => 
        prevFeatures.map(feature => 
          feature.id === editingSubFeature.id 
            ? { ...feature, ...subFeatureForm, type: subFeatureForm.type as 'parent' | 'child' | 'standalone' }
            : feature
        )
      );
      
      // Note: Category updates for sub-features are complex due to nested structure
      // The main features array is updated above, which will reflect in the UI
      // For now, we rely on the main features array update for smooth UX
      
      // Clear editing state
      setEditingSubFeature(null);
      setSubFeatureForm({
        name: '',
        displayName: '',
        description: '',
        type: 'sub-feature',
        level: 2,
        isActive: true,
        isVisible: true,
        subscriptionPlanId: ''
      });
      
      // Close the modal
      setShowAddFeatureModal(false);
      setFormError('');
      
      console.log('✅ Sub-feature updated successfully with smooth state update');
    } catch (error) {
      console.error('❌ Error updating sub-feature:', error);
      setFormError(error instanceof Error ? error.message : 'Failed to update sub-feature');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchCategories = async (forceRefresh = false) => {
    const now = Date.now();
    const CACHE_DURATION = 30000; // 30 seconds cache
    
    // Check if we need to refresh data
    if (!forceRefresh && now - lastFetchTime < CACHE_DURATION && categories.length > 0) {
      console.log('🚀 [FEATURE MANAGEMENT] Using cached categories');
      return;
    }
    
    try {
      const response = await fetch('/api/admin/feature-categories');
      const result = await response.json();
      
      if (result.success) {
        setCategories(result.data);
        setLastFetchTime(now);
      } else {
        console.error('Failed to fetch categories:', result.error);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchTenantFeatures = async (featureId: string) => {
    // Mock tenant features data for now
    const mockTenantFeatures = tenants.map(tenant => ({
      tenantId: tenant.id,
      tenantName: tenant.name,
      isEnabled: tenant.features?.includes(featureId) || false,
      subscriptionPlan: tenant.subscriptionPlan,
      lastModified: new Date().toISOString()
    }));
  };

  const fetchTenantAccess = async (featureId: string) => {
    try {
      // Fetch tenants that have access to this feature
      const response = await fetch(`/api/admin/features/${featureId}/tenants`);
      
      // Check if response is ok and has content
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const text = await response.text();
      if (!text) {
        console.warn('⚠️ [TENANT ACCESS] Empty response, using fallback data');
        setTenantAccess([]);
        return;
      }
      
      const data = JSON.parse(text);
      
      if (data.success) {
        setTenantAccess(data.data);
        console.log('✅ [TENANT ACCESS] Loaded tenant access for feature:', featureId, data.data.length);
      } else {
        console.error('❌ [TENANT ACCESS] Failed to load tenant access:', data.error);
        // Fallback to mock data
        setTenantAccess(tenants.filter(tenant => 
          tenant.features?.includes(featureId) || false
        ));
      }
    } catch (error) {
      console.error('❌ [TENANT ACCESS] Error fetching tenant access:', error);
      // Fallback to mock data
      setTenantAccess(tenants.filter(tenant => 
        tenant.features?.includes(featureId) || false
      ));
    }
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const toggleFeature = (featureId: string) => {
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

  const getCategoryIcon = (iconName: string) => {
    const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
      'Shield': Shield,
      'FileCheck': FileText,
      'BarChart3': BarChart3,
      'Plug': Plug,
      'Crown': Crown,
      'Zap': Zap,
      'Layers': Layers
    };
    const IconComponent = iconMap[iconName] || Shield;
    return <IconComponent className="w-4 h-4" />;
  };

  const getFeatureIcon = (featureName: string) => {
    const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
      'threat-modeling': Target,
      'basic-threat-modeling': Shield,
      'ai-enhanced-threat-modeling': Brain,
      'compliance-management': CheckSquare,
      'soc2-compliance': Lock,
      'iso27001-compliance': Lock,
      'nist-compliance': Lock,
      'analytics-dashboard': BarChart3,
      'third-party-integrations': Plug,
      'vulnerability-scanning': AlertTriangle,
      'incident-response': Activity,
      'sbom-management': FileText
    };
    const IconComponent = iconMap[featureName] || Layers;
    return <IconComponent className="w-3 h-3" />;
  };

  // Helper function to deduplicate categories by category.id
  const deduplicateCategories = (categories: any[]) => {
    if (!categories) return [];
    const seen = new Set();
    return categories.filter(cat => {
      const categoryId = cat.category?.id;
      if (!categoryId || seen.has(categoryId)) return false;
      seen.add(categoryId);
      return true;
    });
  };

  const filteredCategories = categories.filter(category => {
    // If there's a search term, check if category or its features match
    if (searchTerm) {
      const categoryMatches = category.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            category.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const categoryFeatures = features.filter(f => 
        f.categories && f.categories.some(cat => cat.category && cat.category.id === category.id)
      );
      const hasMatchingFeatures = categoryFeatures.some(feature => 
        feature.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feature.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      return category.isActive && (categoryFilter === 'all' || category.id === categoryFilter) && (categoryMatches || hasMatchingFeatures);
    }
    
    // If no search term, show all active categories (even if they have no features)
    return category.isActive && (categoryFilter === 'all' || category.id === categoryFilter);
  });

  // Sort categories based on selected criteria
  const sortedCategories = [...filteredCategories].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.displayName.localeCompare(b.displayName);
      case 'priority':
        // Sort by priority (if available) or by name as fallback
        const aPriority = a.priority || 999;
        const bPriority = b.priority || 999;
        if (aPriority !== bPriority) {
          return aPriority - bPriority; // Lower number = higher priority
        }
        return a.displayName.localeCompare(b.displayName);
      case 'features':
        // Sort by number of features (descending)
        const aFeatureCount = features.filter(f => 
          f.categories && f.categories.some(cat => cat.category && cat.category.id === a.id) && f.parentId === null
        ).length;
        const bFeatureCount = features.filter(f => 
          f.categories && f.categories.some(cat => cat.category && cat.category.id === b.id) && f.parentId === null
        ).length;
        if (aFeatureCount !== bFeatureCount) {
          return bFeatureCount - aFeatureCount; // More features first
        }
        return a.displayName.localeCompare(b.displayName);
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="h-screen bg-gray-50 flex">
        {/* Left Sidebar Skeleton */}
        <div className="w-80 bg-white border-r border-gray-200 p-4">
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
                  <div className="ml-4 space-y-1">
                    <div className="h-8 bg-gray-100 rounded animate-pulse"></div>
                    <div className="h-8 bg-gray-100 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Main Content Skeleton */}
        <div className="flex-1 p-6">
          <div className="space-y-6">
            <div className="h-8 bg-gray-200 rounded animate-pulse w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-lg p-6 shadow-sm border">
                  <div className="h-6 bg-gray-200 rounded animate-pulse mb-4"></div>
                  <div className="h-4 bg-gray-100 rounded animate-pulse mb-2"></div>
                  <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Compact Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-900">Feature Management</h1>
            <div className="flex items-center space-x-2">
              <div 
                className={`w-2 h-2 rounded-full ${tenantId ? 'bg-blue-500' : 'bg-green-500'}`}
                title={tenantId ? 'Tenant-specific features' : 'Platform-wide features'}
              ></div>
              <span className="text-sm text-gray-600">
                {tenantId && tenantName ? `Managing: ${tenantName}` : 'Platform Features'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search features..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64 text-sm"
              />
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.displayName}
                </option>
              ))}
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'priority' | 'features')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              title="Sort categories by"
            >
              <option value="priority">Sort by Priority</option>
              <option value="name">Sort by Name</option>
              <option value="features">Sort by Features Count</option>
            </select>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleAllCategories}
                className="px-3 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2 text-sm"
                title={allExpanded ? 'Collapse All Categories' : 'Expand All Categories'}
              >
                {allExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                <span>{allExpanded ? 'Collapse All' : 'Expand All'}</span>
              </button>
              <button
                onClick={() => fetchData(true)}
                disabled={isRefreshing}
                className="px-3 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2 disabled:opacity-50 text-sm"
              >
                <div className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`}>
                  <RefreshCw className="w-4 h-4" />
                </div>
                <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
              </button>
              <button 
                onClick={() => setShowAddFeatureModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                <span>Add Features</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Professional 3-Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Categories & Features (25%) */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200 bg-white">
            <h2 className="text-sm font-bold text-gray-900">Feature Categories</h2>
            <p className="text-xs text-gray-600 mt-1">Select a category to view available features</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3">
            {sortedCategories.map(category => {
              const categoryFeatures = features.filter(f => 
                f.categories && f.categories.some(cat => cat.category && cat.category.id === category.id) && f.parentId === null
              );
              const isExpanded = expandedCategories.has(category.id);
              
              return (
                <div key={category.id} className="mb-2">
                  {/* Category Header */}
                  <div
                    onClick={() => toggleCategory(category.id)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center justify-between group rounded-lg border border-gray-200 hover:border-gray-300 cursor-pointer"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleCategory(category.id);
                      }
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-100 text-gray-600">
                        {getCategoryIcon(category.icon)}
                      </div>
                      <div className="flex-shrink-0 min-w-0">
                        <h3 className="text-xs font-bold text-gray-900 whitespace-nowrap">{category.displayName}</h3>
                        <p className="text-xs text-gray-600">{categoryFeatures.length} features available</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                        {categoryFeatures.length}
                      </span>
                      
                      {/* Action Buttons */}
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditCategory(category);
                          }}
                          className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors cursor-pointer"
                          title="Edit Category"
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              e.stopPropagation();
                              handleEditCategory(category);
                            }
                          }}
                        >
                          <Edit className="w-3 h-3" />
                        </div>
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(category.id, category.displayName);
                          }}
                          className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                          title="Delete Category"
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              e.stopPropagation();
                              handleDeleteClick(category.id, category.displayName);
                            }
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </div>
                      </div>
                      
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-500" />
                      )}
                    </div>
                  </div>

                  {/* Features List */}
                  {isExpanded && (
                    <div className="mt-2 ml-4 space-y-1">
                      {categoryFeatures.map(feature => {
                        const isFeatureExpanded = expandedFeatures.has(feature.id);
                        const hasChildren = feature.children && feature.children.length > 0;
                        
                        return (
                          <div key={feature.id} className="group">
                            {/* Feature Item */}
                            <div
                              onClick={() => setSelectedFeature(feature)}
                              className={`w-full px-3 py-2.5 text-left hover:bg-gray-50 transition-colors flex items-center justify-between rounded-md border cursor-pointer ${
                                selectedFeature?.id === feature.id 
                                  ? 'bg-blue-50 border-blue-200 shadow-sm' 
                                  : 'border-transparent hover:border-gray-200'
                              }`}
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-6 h-6 rounded-md flex items-center justify-center bg-gray-100 text-gray-600">
                                  {getFeatureIcon(feature.name)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-sm font-medium text-gray-900 truncate">{feature.displayName}</h4>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2 ml-2">
                                {feature.isActive ? (
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                ) : (
                                  <XCircle className="w-4 h-4 text-red-500" />
                                )}
                                
                                {/* Action Buttons */}
                                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                                  <div
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setAddFeatureType('subfeature');
                                      setSelectedParentFeature(feature.id);
                                      setShowAddFeatureModal(true);
                                      setFormError('');
                                    }}
                                    className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors cursor-pointer"
                                    title="Add Sub-feature"
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setAddFeatureType('subfeature');
                                        setSelectedParentFeature(feature.id);
                                        setShowAddFeatureModal(true);
                                        setFormError('');
                                      }
                                    }}
                                  >
                                    <Plus className="w-3 h-3" />
                                  </div>
                                  <div
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEditFeature(feature);
                                    }}
                                    className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                                    title="Edit Feature"
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleEditFeature(feature);
                                      }
                                    }}
                                  >
                                    <Edit className="w-3 h-3" />
                                  </div>
                                  <div
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteFeatureClick(feature.id, feature.displayName, false);
                                    }}
                                    className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                                    title="Delete Feature"
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleDeleteFeatureClick(feature.id, feature.displayName, false);
                                      }
                                    }}
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </div>
                                </div>
                                
                                {hasChildren && (
                                  isFeatureExpanded ? (
                                    <ChevronDown className="w-3 h-3 text-gray-400" />
                                  ) : (
                                    <ChevronRight className="w-3 h-3 text-gray-400" />
                                  )
                                )}
                              </div>
                            </div>

                            {/* Sub-features */}
                            {hasChildren && isFeatureExpanded && (
                              <div className="mt-1 ml-6 space-y-1">
                                {feature.children?.map(subFeature => (
                                  <div
                                    key={subFeature.id}
                                    className="group"
                                  >
                                    <div
                                      onClick={() => setSelectedFeature(subFeature)}
                                      className={`w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors flex items-center justify-between rounded-md border cursor-pointer ${
                                        selectedFeature?.id === subFeature.id 
                                          ? 'bg-blue-50 border-blue-200 shadow-sm' 
                                          : 'border-transparent hover:border-gray-200'
                                      }`}
                                    >
                                      <div className="flex items-center space-x-3">
                                        <div className="w-5 h-5 rounded-md bg-gray-100 flex items-center justify-center">
                                          {getFeatureIcon(subFeature.name)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <h5 className="text-xs font-medium text-gray-700 truncate">{subFeature.displayName}</h5>
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
                                              handleEditSubFeature(subFeature);
                                            }}
                                            className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                                            title="Edit Sub-feature"
                                            role="button"
                                            tabIndex={0}
                                            onKeyDown={(e) => {
                                              if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleEditSubFeature(subFeature);
                                              }
                                            }}
                                          >
                                            <Edit className="w-3 h-3" />
                                          </div>
                                          <div
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleDeleteFeatureClick(subFeature.id, subFeature.displayName, true);
                                            }}
                                            className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                                            title="Delete Sub-feature"
                                            role="button"
                                            tabIndex={0}
                                            onKeyDown={(e) => {
                                              if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleDeleteFeatureClick(subFeature.id, subFeature.displayName, true);
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
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content Area - Feature Details (50%) */}
        <div className="flex-1 bg-white">
          {selectedFeature ? (
            <div className="h-full flex flex-col">
              {/* Feature Header */}
              <div className="p-6 border-b border-gray-200 bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gray-100 text-gray-600">
                        {getFeatureIcon(selectedFeature.name)}
                      </div>
                      <div className="flex-1">
                        <h2 className="text-xl font-bold text-gray-900">{selectedFeature.displayName}</h2>
                      </div>
                      
                      {/* Action Buttons for Main Feature */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditFeature(selectedFeature)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Feature"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteFeatureClick(selectedFeature.id, selectedFeature.displayName, false)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Feature"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Feature Description Section */}
                    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
                      <h3 className="text-sm font-semibold text-gray-900 mb-2">Description</h3>
                      <p className="text-sm text-gray-700 leading-relaxed">{selectedFeature.description}</p>
                    </div>
                    
                    <div className="flex items-center space-x-4 mt-3">
                      <div className="flex items-center space-x-2">
                        {selectedFeature.isActive ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span className="text-sm text-gray-600">
                          {selectedFeature.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {selectedFeature.isVisible ? (
                          <Eye className="w-4 h-4 text-green-500" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        )}
                        <span className="text-sm text-gray-600">
                          {selectedFeature.isVisible ? 'Visible' : 'Hidden'}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Crown className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm text-gray-600">Level {selectedFeature.level}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Feature Content */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Feature Details */}
                  <div className="space-y-6">

                    {/* Sub-features */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-gray-900">Sub-features</h3>
                        <button
                          onClick={() => {
                            setAddFeatureType('subfeature');
                            setSelectedParentFeature(selectedFeature.id);
                            setShowAddFeatureModal(true);
                            setFormError('');
                          }}
                          className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center space-x-1"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add Sub-feature</span>
                        </button>
                      </div>
                      
                      {selectedFeature.children && selectedFeature.children.length > 0 ? (
                        <div className="space-y-3">
                          {selectedFeature.children.map(subFeature => (
                            <div key={subFeature.id} className="group p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                  <div className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center">
                                    {getFeatureIcon(subFeature.name)}
                                  </div>
                                  <h4 className="text-sm font-semibold text-gray-900">{subFeature.displayName}</h4>
                                </div>
                                <div className="flex items-center space-x-2">
                                  {subFeature.isActive ? (
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                  ) : (
                                    <XCircle className="w-4 h-4 text-red-500" />
                                  )}
                                  
                                  {/* Action Buttons */}
                                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                                    <button
                                      onClick={() => handleEditSubFeature(subFeature)}
                                      className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                      title="Edit Sub-feature"
                                    >
                                      <Edit className="w-3 h-3" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteFeatureClick(subFeature.id, subFeature.displayName, true)}
                                      className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                      title="Delete Sub-feature"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 leading-relaxed ml-8">{subFeature.description}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                          <div className="text-gray-400 mb-2">
                            <Plus className="w-8 h-8 mx-auto" />
                          </div>
                          <p className="text-sm text-gray-500 mb-3">No sub-features yet</p>
                          <button
                            onClick={() => {
                              setAddFeatureType('subfeature');
                              setSelectedParentFeature(selectedFeature.id);
                              setShowAddFeatureModal(true);
                              setFormError('');
                            }}
                            className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center space-x-2 mx-auto"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Add First Sub-feature</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <Layers className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Feature</h3>
                <p className="text-gray-500">Choose a feature from the sidebar to view details and manage settings.</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Subscription & Tenant Management (25%) */}
        <div className="w-80 bg-gray-50 border-l border-gray-200 flex flex-col">
          {selectedFeature ? (
            <>
              {/* Subscription Details Section */}
              <div className="p-4 border-b border-gray-200 bg-white">
                <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">Subscription Details</h2>
                
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-blue-900">
                          {selectedFeature.subscriptionPlan?.displayName || 'No Subscription'}
                        </h3>
                        <p className="text-xs text-blue-600">
                          {selectedFeature.subscriptionPlan?.description || 'This feature has no subscription assigned'}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-medium text-blue-700">
                          ${selectedFeature.subscriptionPlan?.price || 0}
                        </span>
                        <p className="text-xs text-blue-500">
                          {selectedFeature.subscriptionPlan?.billingCycle || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      setEditingFeature(selectedFeature);
                      setShowAddFeatureModal(true);
                    }}
                    className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-200 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Modify Subscription</span>
                  </button>
                </div>
              </div>

              {/* Tenant Access Section */}
              <div className="flex-1 flex flex-col">
                <div className="p-4 border-b border-gray-200 bg-white">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Tenant Access</h2>
                    <button
                      onClick={() => {
                        // Navigate to tenant management
                        window.location.href = '/admin/tenants';
                      }}
                      className="flex items-center space-x-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
                    >
                      <Cog className="w-3 h-3" />
                      <span>Settings</span>
                    </button>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-3">
                    {/* Search for tenants */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search tenants..."
                        className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    {/* Tenant list */}
                    <div className="space-y-2">
                      {tenantAccess.length > 0 ? (
                        tenantAccess.map(tenant => (
                          <div key={tenant.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                <span className="text-xs font-medium text-gray-600">
                                  {tenant.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-gray-900">{tenant.name}</h4>
                                <p className="text-xs text-gray-500 capitalize">{tenant.subscriptionPlan}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-green-400 rounded-full" title="Active"></div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <Users className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                          <h3 className="text-sm font-medium text-gray-900 mb-1">No Tenants</h3>
                          <p className="text-xs text-gray-500">No tenants have access to this feature</p>
                        </div>
                      )}
                    </div>
                    
                    {/* Summary */}
                    <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Total Tenants:</span>
                        <span className="font-medium text-gray-900">{tenantAccess.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center py-8">
                <AlertCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <h3 className="text-sm font-medium text-gray-900 mb-1">No Feature Selected</h3>
                <p className="text-xs text-gray-500">Select a feature to view subscription and tenant details</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Comprehensive Add Features Modal */}
      {showAddFeatureModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {editingCategory ? 'Edit Category' : 
                     editingFeature ? 'Edit Feature' : 
                     editingSubFeature ? 'Edit Sub-feature' : 
                     'Add Features & Categories'}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {editingCategory ? 'Update category information' : 
                     editingFeature ? 'Update feature information' : 
                     editingSubFeature ? 'Update sub-feature information' : 
                     'Create new categories, features, or sub-features'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowAddFeatureModal(false);
                    setFormError('');
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 flex-1 overflow-y-auto">
              {/* Error Display */}
              {formError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <XCircle className="w-4 h-4 text-red-500 mr-2" />
                    <span className="text-sm text-red-700">{formError}</span>
                  </div>
                </div>
              )}

              {/* Edit Forms - Show when editing */}
              {editingFeature && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="text-base font-semibold text-gray-900 mb-3">Edit Feature</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Feature Name</label>
                      <input
                        type="text"
                        placeholder="e.g., threat-modeling"
                        value={featureForm.name}
                        onChange={(e) => setFeatureForm({...featureForm, name: e.target.value})}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
                      <input
                        type="text"
                        placeholder="e.g., Threat Modeling"
                        value={featureForm.displayName}
                        onChange={(e) => setFeatureForm({...featureForm, displayName: e.target.value})}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        placeholder="Describe this feature..."
                        value={featureForm.description}
                        onChange={(e) => setFeatureForm({...featureForm, description: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                      <select 
                        value={featureForm.level}
                        onChange={(e) => setFeatureForm({...featureForm, level: parseInt(e.target.value)})}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      >
                        <option value={1}>Level 1 (Main Feature)</option>
                        <option value={2}>Level 2 (Sub-feature)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <select 
                        value={featureForm.isActive ? 'active' : 'inactive'}
                        onChange={(e) => setFeatureForm({...featureForm, isActive: e.target.value === 'active'})}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Subscription Plan</label>
                      <select 
                        value={featureForm.subscriptionPlanId || ''}
                        onChange={(e) => setFeatureForm({...featureForm, subscriptionPlanId: e.target.value})}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      >
                        <option value="">Select Subscription Plan</option>
                        {subscriptionPlans.map(plan => (
                          <option key={plan.id} value={plan.id}>
                            {plan.displayName} - ${plan.price}/{plan.billingCycle}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center justify-end space-x-3 mt-4">
                    <button
                      onClick={handleCancelEdit}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdateFeature}
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Updating...' : 'Update Feature'}
                    </button>
                  </div>
                </div>
              )}

              {editingSubFeature && (
                <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="text-base font-semibold text-gray-900 mb-3">Edit Sub-feature</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Sub-feature Name</label>
                      <input
                        type="text"
                        placeholder="e.g., basic-threat-modeling"
                        value={subFeatureForm.name}
                        onChange={(e) => setSubFeatureForm({...subFeatureForm, name: e.target.value})}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
                      <input
                        type="text"
                        placeholder="e.g., Basic Threat Modeling"
                        value={subFeatureForm.displayName}
                        onChange={(e) => setSubFeatureForm({...subFeatureForm, displayName: e.target.value})}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        placeholder="Describe this sub-feature..."
                        value={subFeatureForm.description}
                        onChange={(e) => setSubFeatureForm({...subFeatureForm, description: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                      <select 
                        value={subFeatureForm.level}
                        onChange={(e) => setSubFeatureForm({...subFeatureForm, level: parseInt(e.target.value)})}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      >
                        <option value={1}>Level 1 (Main Feature)</option>
                        <option value={2}>Level 2 (Sub-feature)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <select 
                        value={subFeatureForm.isActive ? 'active' : 'inactive'}
                        onChange={(e) => setSubFeatureForm({...subFeatureForm, isActive: e.target.value === 'active'})}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center justify-end space-x-3 mt-4">
                    <button
                      onClick={handleCancelEdit}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdateSubFeature}
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Updating...' : 'Update Sub-feature'}
                    </button>
                  </div>
                </div>
              )}
              
              {/* Feature Type Selection - Only show when not editing */}
              {!editingFeature && !editingSubFeature && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">What would you like to add?</h3>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => {
                      setAddFeatureType('category');
                      setFormError('');
                    }}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      addFeatureType === 'category'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <div className="text-center">
                      <FolderOpen className="w-8 h-8 mx-auto mb-2" />
                      <h4 className="font-medium">New Category</h4>
                      <p className="text-xs text-gray-500 mt-1">Create a new feature category</p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setAddFeatureType('feature');
                      setFormError('');
                    }}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      addFeatureType === 'feature'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <div className="text-center">
                      <Layers className="w-8 h-8 mx-auto mb-2" />
                      <h4 className="font-medium">New Feature</h4>
                      <p className="text-xs text-gray-500 mt-1">Add feature to existing category</p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setAddFeatureType('subfeature');
                      setFormError('');
                    }}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      addFeatureType === 'subfeature'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <div className="text-center">
                      <Target className="w-8 h-8 mx-auto mb-2" />
                      <h4 className="font-medium">New Sub-feature</h4>
                      <p className="text-xs text-gray-500 mt-1">Add sub-feature to existing feature</p>
                    </div>
                  </button>
                </div>
              </div>
              )}

              {/* Dynamic Form Based on Selection */}
              <div className="space-y-6">
                {addFeatureType === 'category' && !editingSubFeature && !editingFeature && !editingCategory && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900">Create New Category</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category Name</label>
                        <input
                          type="text"
                          placeholder="e.g., Security, Compliance"
                          value={categoryForm.name}
                          onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
                        <input
                          type="text"
                          placeholder="e.g., Security & Compliance"
                          value={categoryForm.displayName}
                          onChange={(e) => setCategoryForm({...categoryForm, displayName: e.target.value})}
                          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                          placeholder="Describe what this category includes..."
                          rows={3}
                          value={categoryForm.description}
                          onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                        <select 
                          value={categoryForm.icon}
                          onChange={(e) => setCategoryForm({...categoryForm, icon: e.target.value})}
                          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        >
                          <option value="Shield">Shield</option>
                          <option value="FileText">File Text</option>
                          <option value="BarChart3">Bar Chart</option>
                          <option value="Plug">Plug</option>
                          <option value="Crown">Crown</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">Default styling will be applied</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {addFeatureType === 'feature' && !editingSubFeature && !editingFeature && (
                  <div className="space-y-4">
                    <h4 className="text-base font-semibold text-gray-900">Add New Feature</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Category</label>
                        <select
                          value={selectedParentCategory}
                          onChange={(e) => setSelectedParentCategory(e.target.value)}
                          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        >
                          <option value="">Choose a category...</option>
                          {categories.map(category => (
                            <option key={category.id} value={category.id}>
                              {category.displayName}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Feature Name</label>
                        <input
                          type="text"
                          placeholder="e.g., threat-modeling"
                          value={featureForm.name}
                          onChange={(e) => setFeatureForm({...featureForm, name: e.target.value})}
                          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
                        <input
                          type="text"
                          placeholder="e.g., Threat Modeling"
                          value={featureForm.displayName}
                          onChange={(e) => setFeatureForm({...featureForm, displayName: e.target.value})}
                          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Feature Type</label>
                        <select 
                          value={featureForm.type}
                          onChange={(e) => setFeatureForm({...featureForm, type: e.target.value})}
                          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        >
                          <option value="core">Core Feature</option>
                          <option value="addon">Add-on Feature</option>
                          <option value="premium">Premium Feature</option>
                        </select>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                          placeholder="Describe what this feature does..."
                          rows={3}
                          value={featureForm.description}
                          onChange={(e) => setFeatureForm({...featureForm, description: e.target.value})}
                          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {addFeatureType === 'subfeature' && !editingSubFeature && !editingFeature && !editingCategory && (
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900">Add New Sub-feature</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Parent Feature</label>
                        <select
                          value={selectedParentFeature}
                          onChange={(e) => setSelectedParentFeature(e.target.value)}
                          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        >
                          <option value="">Choose a parent feature...</option>
                          {features.filter(f => f.parentId === null).map(feature => (
                            <option key={feature.id} value={feature.id}>
                              {feature.displayName}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Sub-feature Name</label>
                        <input
                          type="text"
                          placeholder="e.g., basic-threat-modeling"
                          value={subFeatureForm.name}
                          onChange={(e) => setSubFeatureForm({...subFeatureForm, name: e.target.value})}
                          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
                        <input
                          type="text"
                          placeholder="e.g., Basic Threat Modeling"
                          value={subFeatureForm.displayName}
                          onChange={(e) => setSubFeatureForm({...subFeatureForm, displayName: e.target.value})}
                          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                        <select 
                          value={subFeatureForm.level}
                          onChange={(e) => setSubFeatureForm({...subFeatureForm, level: parseInt(e.target.value)})}
                          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        >
                          <option value="1">Level 1</option>
                          <option value="2">Level 2</option>
                          <option value="3">Level 3</option>
                        </select>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                          placeholder="Describe what this sub-feature does..."
                          rows={3}
                          value={subFeatureForm.description}
                          onChange={(e) => setSubFeatureForm({...subFeatureForm, description: e.target.value})}
                          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Edit Forms */}
              {editingFeature && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Edit Feature</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Feature Name</label>
                      <input
                        type="text"
                        placeholder="e.g., threat-modeling"
                        value={featureForm.name}
                        onChange={(e) => setFeatureForm({...featureForm, name: e.target.value})}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
                      <input
                        type="text"
                        placeholder="e.g., Threat Modeling"
                        value={featureForm.displayName}
                        onChange={(e) => setFeatureForm({...featureForm, displayName: e.target.value})}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        placeholder="Describe this feature..."
                        value={featureForm.description}
                        onChange={(e) => setFeatureForm({...featureForm, description: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                      <select 
                        value={featureForm.level}
                        onChange={(e) => setFeatureForm({...featureForm, level: parseInt(e.target.value)})}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      >
                        <option value={1}>Level 1 (Main Feature)</option>
                        <option value={2}>Level 2 (Sub-feature)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <select 
                        value={featureForm.isActive ? 'active' : 'inactive'}
                        onChange={(e) => setFeatureForm({...featureForm, isActive: e.target.value === 'active'})}
                        className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center justify-end space-x-3 mt-4">
                    <button
                      onClick={handleCancelEdit}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdateFeature}
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Updating...' : 'Update Feature'}
                    </button>
                  </div>
                </div>
              )}


              {/* Modal Actions - Only show when not editing */}
              {!editingFeature && !editingSubFeature && (
              <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
                <button
                  onClick={() => {
                    setShowAddFeatureModal(false);
                    setFormError('');
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Creating...</span>
                    </>
                  ) : (
                    <span>
                      {editingCategory ? 'Update' : 'Create'} {addFeatureType === 'category' ? 'Category' : addFeatureType === 'feature' ? 'Feature' : 'Sub-feature'}
                    </span>
                  )}
                </button>
              </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirm.isOpen}
        onClose={handleCancelDelete}
        onConfirm={() => handleDeleteCategory(showDeleteConfirm.categoryId)}
        title="Delete Category"
        message={`Are you sure you want to delete "${showDeleteConfirm.categoryName}"? This action cannot be undone. If this category has features, you'll need to remove them first.`}
        type="danger"
        confirmText="Delete Category"
        cancelText="Cancel"
      />

      {/* Feature Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showFeatureDeleteConfirm.isOpen}
        onClose={handleCancelFeatureDelete}
        onConfirm={() => handleDeleteFeature(showFeatureDeleteConfirm.featureId)}
        title={`Delete ${showFeatureDeleteConfirm.isSubFeature ? 'Sub-feature' : 'Feature'}`}
        message={`Are you sure you want to delete "${showFeatureDeleteConfirm.featureName}"? This action cannot be undone.`}
        type="danger"
        confirmText={`Delete ${showFeatureDeleteConfirm.isSubFeature ? 'Sub-feature' : 'Feature'}`}
        cancelText="Cancel"
      />

      {/* Feature Management Modal */}

    </div>
  );
}
