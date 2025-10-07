/**
 * API Service for BlickTrack Frontend
 * 
 * Handles all communication with the backend API including:
 * - Authentication (login, logout, token refresh)
 * - User management
 * - Error handling and response formatting
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';


// Import types from dashboard for API return types
import type {
  ActivityItem,
  Project,
  SystemHealth,
  NavigationItem,
  UserProfile,
  TenantFeature as UITenantFeature,
  TenantLicense,
  Feature,
  FeatureCategory
} from '@/types/dashboard';
import type { UserPermission } from '@/hooks/usePermissions';

// Use the API_BASE_URL directly since we now have a default value
const API_BASE_URL_ASSERTED = API_BASE_URL;

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  name?: string; // Fallback field for compatibility
  role: string;
  tenantId: string;
  isVerified?: boolean;
  mfaEnabled?: boolean;
  lastLoginAt?: string;
  createdAt?: string;
  tenant?: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token?: string;
  user?: User;
}

export interface ApiError {
  message: string;
  error: string;
  statusCode: number;
}

export interface AuditLog {
  id: string;
  date: string;
  service: string;
  category: string;
  activity: string;
  status: string;
  statusReason?: string;
  targetType?: string;
  targetId?: string;
  targetName?: string;
  actorType: string;
  actorId?: string;
  actorName?: string;
  actorEmail?: string;
  ipAddress?: string;
  userAgent?: string;
  requestId?: string;
  details?: Record<string, unknown>;
  changes?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  severity?: string; // Added for audit logs severity levels
  riskLevel?: string; // Added for audit logs risk levels
  user?: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    displayName?: string;
  };
  tenant?: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface SignInLog {
  id: string;
  date: string;
  service: string;
  category: string;
  activity: string;
  status: string;
  statusReason?: string;
  userEmail: string;
  userName?: string;
  authMethod?: string;
  mfaUsed: boolean;
  mfaMethod?: string;
  sessionId?: string;
  sessionDuration?: number;
  ipAddress?: string;
  userAgent?: string;
  location?: string;
  deviceType?: string;
  browser?: string;
  os?: string;
  riskLevel?: string;
  riskFactors?: Record<string, unknown>;
  isSuspicious: boolean;
  details?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  user?: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    displayName?: string;
  };
  tenant?: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  description?: string;
  status: 'active' | 'inactive' | 'suspended';
  plan: string;
  domain?: string;
  logo?: string;
  contactPerson: string;
  email: string;
  phone?: string;
  website?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
  features: UITenantFeature[];
  userCount?: number;
  licenseCount?: number;
  totalUsers: number;
  activeUsers: number;
  licenses: TenantLicense[];
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL_ASSERTED;
  }

  /**
   * Make HTTP request with error handling and token refresh
   */
  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add authorization header if token exists
    const token = this.getToken();
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      // Handle token expiration (401 Unauthorized)
      if (response.status === 401 && token) {
        // Try to refresh token
        const refreshed = await this.refreshToken();
        if (refreshed) {
          // Retry the request with new token
          const newToken = this.getToken();
          if (newToken) {
            config.headers = {
              ...config.headers,
              'Authorization': `Bearer ${newToken}`,
            };
            const retryResponse = await fetch(url, config);
            if (!retryResponse.ok) {
              const errorData: ApiError = await retryResponse.json();
              throw new Error(errorData.message || `HTTP ${retryResponse.status}: ${retryResponse.statusText}`);
            }
            return await retryResponse.json();
          }
        }
        
        // If refresh failed, clear auth and redirect to login
        this.removeToken();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        throw new Error('Session expired. Please log in again.');
      }
      
      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  /**
   * Get stored access token
   */
  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('access_token');
  }

  /**
   * Store access token
   */
  private setToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('access_token', token);
  }

  /**
   * Remove stored token
   */
  private removeToken(): void {
    if (typeof window === 'undefined') return;
    
    // Clear authentication tokens and user data
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    localStorage.removeItem('token'); // Legacy token storage
    
    // Clear temporary verification data
    localStorage.removeItem('pendingVerificationEmail');
    localStorage.removeItem('pendingPasswordResetEmail');
    localStorage.removeItem('pendingPasswordResetOtp');
    
    // Note: We keep 'theme' preference as it's not session-related
  }

  /**
   * Refresh access token using refresh token
   */
  private async refreshToken(): Promise<boolean> {
    if (typeof window === 'undefined') return false;
    
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) return false;

    try {
      const response = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.access_token) {
          this.setToken(data.access_token);
          return true;
        }
      }
    } catch (error) {
      console.warn('Token refresh failed:', error);
    }

    return false;
  }

  /**
   * Login user
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    // Store tokens
    if (response.access_token) {
      this.setToken(response.access_token);
    }
    
    // Store refresh token
    if (response.refresh_token) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('refresh_token', response.refresh_token);
      }
    }

    // Decode token to get user info (basic JWT decode)
    if (response.access_token) {
      try {
        const payload = JSON.parse(atob(response.access_token.split('.')[1]));
        const user = {
          id: payload.sub,
          email: payload.email,
          firstName: payload.firstName || '',
          lastName: payload.lastName || '',
          displayName: payload.displayName || payload.email,
          role: payload.role,
          tenantId: payload.tenantId,
        };
        
        // Store user info
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(user));
        }
        
        response.user = user;
      } catch (error) {
        console.warn('Could not decode JWT token:', error);
      }
    }

    return response;
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      // Get refresh token from storage
      const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null;
      
      if (refreshToken) {
        await this.request('/auth/logout', {
          method: 'POST',
          body: JSON.stringify({ refresh_token: refreshToken }),
        });
      }
    } catch (error) {
      console.warn('Logout API call failed:', error);
    } finally {
      // Always clear tokens on client side
      this.removeToken();
    }
  }

  /**
   * Send OTP to email for verification
   */
  async sendOtp(email: string): Promise<{ message: string }> {
    return this.request<{ message: string }>('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  /**
   * Verify OTP code
   */
  async verifyOtp(email: string, otp: string): Promise<{ message: string }> {
    return this.request<{ message: string }>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
  }

  /**
   * Reset password with OTP
   */
  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    return this.request<{ message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
  }

  /**
   * Get user profile
   */
  async getProfile(): Promise<User> {
    return this.request('/users/profile', {
      method: 'GET',
    });
  }


  // ==================== ROLE-BASED DASHBOARD METHODS ====================

  /**
   * Get role-based dashboard statistics
   */
  async getRoleBasedStats(): Promise<Record<string, unknown>> {
    return this.request('/dashboard/stats', {
      method: 'GET',
    });
  }

  /**
   * Get role-based activity feed
   */
  async getRoleBasedActivity(limit: number = 10): Promise<ActivityItem[]> {
    try {
      const result = await this.request(`/dashboard/activity?limit=${limit}`, {
        method: 'GET',
      });
      console.log('getRoleBasedActivity result:', result);
      return result as ActivityItem[];
    } catch (error) {
      console.error('Error in getRoleBasedActivity:', error);
      return [];
    }
  }

  /**
   * Get role-based projects
   */
  async getRoleBasedProjects(limit: number = 5): Promise<Project[]> {
    try {
      const result = await this.request(`/dashboard/projects?limit=${limit}`, {
        method: 'GET',
      });
      console.log('getRoleBasedProjects result:', result);
      return result as Project[];
    } catch (error) {
      console.error('Error in getRoleBasedProjects:', error);
      return [];
    }
  }

  /**
   * Get role-based system health
   */
  async getRoleBasedSystemHealth(): Promise<SystemHealth> {
    return this.request('/dashboard/health', {
      method: 'GET',
    });
  }

  /**
   * Get role-based navigation menu
   */
  async getRoleBasedNavigation(): Promise<NavigationItem[]> {
    try {
      const result = await this.request('/dashboard/navigation', {
        method: 'GET',
      });
      console.log('getRoleBasedNavigation result:', result);
      return result as NavigationItem[];
    } catch (error) {
      console.error('Error in getRoleBasedNavigation:', error);
      return [];
    }
  }

  /**
   * Get user permissions
   */
  async getUserPermissions(): Promise<UserPermission[]> {
    try {
      const result = await this.request('/dashboard/permissions', {
        method: 'GET',
      });
      console.log('getUserPermissions result:', result);
      return result as UserPermission[];
    } catch (error) {
      console.error('Error in getUserPermissions:', error);
      // Return empty array as fallback
      return [];
    }
  }

  // ==================== MULTI-TENANT FEATURE CONTROL METHODS ====================

  /**
   * Get available features for user based on role and tenant
   */
  async getAvailableFeatures(): Promise<Feature[]> {
    return this.request('/dashboard/features', {
      method: 'GET',
    });
  }

  /**
   * Check if user can access a specific feature
   */
  async checkFeatureAccess(featureSlug: string): Promise<{ featureSlug: string; canAccess: boolean }> {
    return this.request(`/dashboard/features/${featureSlug}/access`, {
      method: 'GET',
    });
  }

  /**
   * Get user profile with tenant information
   */
  async getUserProfile(): Promise<UserProfile> {
    return this.request('/dashboard/profile', {
      method: 'GET',
    });
  }

  /**
   * Get users based on role
   * Platform Admin: All users across all tenants
   * Tenant Admin: Users from their tenant only
   */
  async getUsers(): Promise<{
    users: User[];
    total: number;
    role: string;
    description: string;
  }> {
    return this.request('/dashboard/users', {
      method: 'GET',
    });
  }

  async updateUser(userId: string, updateData: {
    firstName?: string;
    lastName?: string;
    displayName?: string;
    email?: string;
    role?: string;
    isVerified?: boolean;
    mfaEnabled?: boolean;
  }): Promise<{
    success: boolean;
    message: string;
    user: User;
  }> {
    return this.request(`/dashboard/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  async deleteUser(userId: string): Promise<{
    success: boolean;
    message: string;
  }> {
    return this.request(`/dashboard/users/${userId}`, {
      method: 'DELETE',
    });
  }

  // ===============================================================
  // AUDIT & COMPLIANCE METHODS
  // ===============================================================

  /**
   * Get audit logs with filtering and pagination
   */
  async getAuditLogs(filters: {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
    service?: string;
    category?: string;
    status?: string;
    userId?: string;
    targetType?: string;
    search?: string;
  } = {}): Promise<{
    logs: AuditLog[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const queryParams = new URLSearchParams();
    
    if (filters.page) queryParams.append('page', filters.page.toString());
    if (filters.limit) queryParams.append('limit', filters.limit.toString());
    if (filters.startDate) queryParams.append('startDate', filters.startDate);
    if (filters.endDate) queryParams.append('endDate', filters.endDate);
    if (filters.service) queryParams.append('service', filters.service);
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.userId) queryParams.append('userId', filters.userId);
    if (filters.targetType) queryParams.append('targetType', filters.targetType);
    if (filters.search) queryParams.append('search', filters.search);

    const queryString = queryParams.toString();
    const url = `/audit/logs${queryString ? `?${queryString}` : ''}`;
    
    return this.request(url, {
      method: 'GET',
    });
  }

  /**
   * Get sign-in logs with filtering and pagination
   */
  async getSignInLogs(filters: {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
    status?: string;
    userId?: string;
    userEmail?: string;
    ipAddress?: string;
    isSuspicious?: boolean;
    search?: string;
  } = {}): Promise<{
    logs: SignInLog[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const queryParams = new URLSearchParams();
    
    if (filters.page) queryParams.append('page', filters.page.toString());
    if (filters.limit) queryParams.append('limit', filters.limit.toString());
    if (filters.startDate) queryParams.append('startDate', filters.startDate);
    if (filters.endDate) queryParams.append('endDate', filters.endDate);
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.userId) queryParams.append('userId', filters.userId);
    if (filters.userEmail) queryParams.append('userEmail', filters.userEmail);
    if (filters.ipAddress) queryParams.append('ipAddress', filters.ipAddress);
    if (filters.isSuspicious !== undefined) queryParams.append('isSuspicious', filters.isSuspicious.toString());
    if (filters.search) queryParams.append('search', filters.search);

    const queryString = queryParams.toString();
    const url = `/audit/sign-in-logs${queryString ? `?${queryString}` : ''}`;
    
    return this.request(url, {
      method: 'GET',
    });
  }

  /**
   * Get audit statistics and analytics
   */
  async getAuditStats(days: number = 30): Promise<{
    totalLogs: number;
    successCount: number;
    failureCount: number;
    warningCount: number;
    topServices: Array<{ service: string; count: number }>;
    topCategories: Array<{ category: string; count: number }>;
    dailyActivity: Array<{ date: string; count: number }>;
    hourlyActivity: Array<{ hour: number; count: number }>;
  }> {
    return this.request(`/audit/stats?days=${days}`, {
      method: 'GET',
    });
  }

  /**
   * Get sign-in statistics and analytics
   */
  async getSignInStats(days: number = 30): Promise<{
    totalSignIns: number;
    successCount: number;
    failureCount: number;
    blockedCount: number;
    mfaUsage: number;
    topUsers: Array<{ userEmail: string; count: number }>;
    topIPs: Array<{ ipAddress: string; count: number }>;
    dailySignIns: Array<{ date: string; count: number }>;
    hourlySignIns: Array<{ hour: number; count: number }>;
    suspiciousActivity: number;
  }> {
    return this.request(`/audit/sign-in-stats?days=${days}`, {
      method: 'GET',
    });
  }

  // ===============================================================
  // TENANT MANAGEMENT METHODS
  // ===============================================================

  /**
   * Get all tenants with filtering and pagination
   */
  async getTenants(filters: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    plan?: string;
  } = {}): Promise<{
    tenants: Tenant[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const queryParams = new URLSearchParams();
    
    if (filters.page) queryParams.append('page', filters.page.toString());
    if (filters.limit) queryParams.append('limit', filters.limit.toString());
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.plan) queryParams.append('plan', filters.plan);

    const queryString = queryParams.toString();
    const url = `/tenants${queryString ? `?${queryString}` : ''}`;
    
    return this.request(url, {
      method: 'GET',
    });
  }

  /**
   * Get feature categories and features
   */
  async getFeatureCategories(): Promise<FeatureCategory[]> {
    return this.request('/tenants/feature-categories', {
      method: 'GET',
    });
  }

  /**
   * Update tenant feature access
   */
  async updateTenantFeature(tenantId: string, featureId: string, data: {
    isEnabled: boolean;
  }): Promise<{
    success: boolean;
    message: string;
  }> {
    return this.request(`/tenants/${tenantId}/features/${featureId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * Update tenant sub-feature access
   */
  async updateTenantSubFeature(tenantId: string, featureId: string, subFeatureId: string, data: {
    isEnabled: boolean;
  }): Promise<{
    success: boolean;
    message: string;
  }> {
    return this.request(`/tenants/${tenantId}/features/${featureId}/sub-features/${subFeatureId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * Get tenant details with features and licenses
   */
  async getTenantDetails(tenantId: string): Promise<Tenant> {
    return this.request(`/tenants/${tenantId}`, {
      method: 'GET',
    });
  }

  /**
   * Get tenant features with sub-features
   */
  async getTenantFeatures(tenantId: string): Promise<{
    tenantId: string;
    tenantName: string;
    planName: string;
    features: Array<{
      id: string;
      featureId: string;
      featureName: string;
      featureKey: string;
      category: string;
      enabled: boolean;
      maxUsers: number | null;
      currentUsers: number;
      config: Record<string, unknown>;
      subFeatures: Array<{
        id: string;
        name: string;
        description: string;
      }>;
    }>;
  }> {
    return this.request(`/tenants/${tenantId}/features`, {
      method: 'GET',
    });
  }

  /**
   * Get current user's tenant features
   */
  async getCurrentUserTenantFeatures(): Promise<{
    tenantId: string;
    tenantName: string;
    planName: string;
    features: Array<{
      id: string;
      featureId: string;
      featureName: string;
      featureKey: string;
      category: string;
      enabled: boolean;
      maxUsers: number | null;
      currentUsers: number;
      config: Record<string, unknown>;
      subFeatures: Array<{
        id: string;
        name: string;
        description: string;
      }>;
    }>;
  }> {
    return this.request('/dashboard/tenant-features', {
      method: 'GET',
    });
  }

  /**
   * Create new tenant
   */
  async createTenant(data: {
    name: string;
    slug: string;
    email: string;
    phone?: string;
    website?: string;
    address?: string;
    contactPerson: string;
    plan: string;
  }): Promise<{
    success: boolean;
    message: string;
    tenant: Tenant;
  }> {
    return this.request('/tenants', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Update tenant information
   */
  async updateTenant(tenantId: string, data: {
    name?: string;
    slug?: string;
    email?: string;
    phone?: string;
    website?: string;
    address?: string;
    contactPerson?: string;
    plan?: string;
    status?: string;
  }): Promise<{
    success: boolean;
    message: string;
    tenant: Tenant;
  }> {
    return this.request(`/tenants/${tenantId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * Delete tenant
   */
  async deleteTenant(tenantId: string): Promise<{
    success: boolean;
    message: string;
  }> {
    return this.request(`/tenants/${tenantId}`, {
      method: 'DELETE',
    });
  }

  /**
   * Get current user from stored data
   */
  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    
    const userData = localStorage.getItem('user');
    if (!userData) return null;
    
    try {
      return JSON.parse(userData) as User;
    } catch (error) {
      console.warn('Could not parse stored user data:', error);
      return null;
    }
  }

  /**
   * Check if user is currently authenticated
   */
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    
    const token = this.getToken();
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      
      // Check if token is expired
      if (payload.exp && payload.exp < currentTime) {
        return false;
      }
      
      // Check if token has required fields
      return !!(payload.sub && payload.email && payload.role);
    } catch (error) {
      console.warn('Invalid token format:', error);
      return false;
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
