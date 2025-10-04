/**
 * API Service for BlickTrack Frontend
 * 
 * Handles all communication with the backend API including:
 * - Authentication (login, logout, token refresh)
 * - User management
 * - Error handling and response formatting
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token?: string;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    displayName: string;
    role: string;
    tenantId: string;
  };
}

export interface ApiError {
  message: string;
  error: string;
  statusCode: number;
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
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
   * Get user profile
   */
  async getProfile(): Promise<any> {
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
  getCurrentUser(): any | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
