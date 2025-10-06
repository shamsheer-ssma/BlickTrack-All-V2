/**
 * Dashboard Types
 *
 * Centralized type definitions for dashboard components.
 * Moved from inline definitions in component files for better organization and reusability.
 */

export interface ActivityUser {
  firstName?: string;
  lastName?: string;
}

export interface DashboardStats {
  // Platform Admin Stats
  totalTenants?: number;
  totalUsers?: number;
  activeUsers?: number;
  totalProjects?: number;
  activeProjects?: number;
  completedProjects?: number;
  overdueProjects?: number;
  securityAlerts?: number;
  systemUptime?: string;
  dataProcessed?: string;

  // Tenant Admin Stats
  tenantUptime?: string;

  // User Stats
  myProjects?: number;
  notifications?: number;
  tasksCompleted?: number;
  tasksPending?: number;
}

export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  path: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  tenantName?: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
}

export interface ActivityItem {
  id: string;
  action?: string;
  eventType?: string;
  user?: ActivityUser;
  createdAt?: string;
}

export interface SystemHealth {
  status?: string;
  uptime?: string;
  responseTime?: string;
  storageUsage?: string;
  memoryUsage?: string;
}

export interface Notification {
  id: number;
  message: string;
  type?: string;
  icon?: string;
  timestamp?: Date;
  read?: boolean;
}

export type SearchResult =
  | ({ type: 'navigation' } & NavigationItem)
  | ({ type: 'project' } & Project)
  | ({ type: 'activity' } & ActivityItem);

export interface TenantFeature {
  id: string;
  featureId: string;
  featureName: string;
  category: string;
  isEnabled: boolean;
  purchasedAt: string;
  expiresAt?: string;
  subFeatures: SubFeature[];
}

export interface SubFeature {
  id: string;
  name: string;
  isEnabled: boolean;
  description?: string;
}

export interface TenantLicense {
  id: string;
  name: string;
  type: 'basic' | 'premium' | 'enterprise';
  maxUsers: number;
  features: string[];
  expiresAt?: string;
  isActive: boolean;
}

export interface Feature {
  id: string;
  name: string;
  description: string;
  subFeatures: SubFeature[];
}

export interface FeatureCategory {
  id: string;
  name: string;
  description: string;
  features: Feature[];
}