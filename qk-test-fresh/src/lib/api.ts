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
  UserProfile
} from '@/components/dashboard/UnifiedDashboard';
import type { UserPermission, Feature, TenantFeature } from '@/hooks/usePermissions';

// Use the API_BASE_URL directly since we now have a default value
const API_BASE_URL_ASSERTED = API_BASE_URL;

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
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

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL_ASSERTED;
  }

  /**
   * Make HTTP request with error handling
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
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  }

  /**
   * Login user
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    // Store token
    if (response.access_token) {
      this.setToken(response.access_token);
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
      await this.request('/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.warn('Logout API call failed:', error);
    } finally {
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

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      // Check if token is expired
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      return payload.exp > now;
    } catch {
      return false;
    }
  }

  /**
   * Get current user from localStorage
   */
  getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
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
   * Get tenant features (what features this tenant has access to)
   */
  async getTenantFeatures(): Promise<TenantFeature[]> {
    return this.request('/dashboard/tenant-features', {
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
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
