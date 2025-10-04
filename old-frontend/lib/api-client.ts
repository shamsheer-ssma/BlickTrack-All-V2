// Secure API client with error handling, retry logic, and type safety

import { toast } from '@/components/ui/alert';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  details?: string;
  message?: string;
}

export interface ApiError {
  message: string;
  status: number;
  details?: string;
}

export class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private retryAttempts: number;
  private retryDelay: number;

  constructor(
    baseURL: string = '/api',
    retryAttempts: number = 3,
    retryDelay: number = 1000
  ) {
    this.baseURL = baseURL;
    this.retryAttempts = retryAttempts;
    this.retryDelay = retryDelay;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  // Set authentication token
  setAuthToken(token: string) {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  // Remove authentication token
  clearAuthToken() {
    delete this.defaultHeaders['Authorization'];
  }

  // Generic request method
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
    };

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= this.retryAttempts; attempt++) {
      try {
        const response = await fetch(url, config);
        
        // Handle different response types
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new ApiError(
            errorData.message || `HTTP ${response.status}`,
            response.status,
            errorData.details
          );
        }

        const data = await response.json();
        return data;
      } catch (error) {
        lastError = error as Error;
        
        // Don't retry on client errors (4xx)
        if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
          break;
        }
        
        // Retry on server errors (5xx) or network errors
        if (attempt < this.retryAttempts) {
          await this.delay(this.retryDelay * Math.pow(2, attempt));
          continue;
        }
      }
    }

    throw lastError || new Error('Request failed');
  }

  // Delay utility
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // GET request
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const url = params ? `${endpoint}?${new URLSearchParams(params)}` : endpoint;
    return this.request<T>(url, { method: 'GET' });
  }

  // POST request
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PATCH request
  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Upload file
  async upload<T>(endpoint: string, file: File, additionalData?: Record<string, any>): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    return this.request<T>(endpoint, {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type for FormData, let browser set it
        ...this.defaultHeaders,
        'Content-Type': undefined,
      },
    });
  }
}

// Create default API client instance
export const apiClient = new ApiClient();

// Error handling decorator
export function withErrorHandling<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  errorMessage?: string
) {
  return async (...args: T): Promise<R | null> => {
    try {
      return await fn(...args);
    } catch (error) {
      console.error('API Error:', error);
      
      const message = errorMessage || 
        (error instanceof ApiError ? error.message : 'An unexpected error occurred');
      
      toast({
        variant: 'error',
        title: 'Error',
        description: message,
      });
      
      return null;
    }
  };
}

// Type-safe API methods for specific endpoints
export const tenantApi = {
  // Get all tenants
  getAll: () => apiClient.get<{ id: string; name: string; plan: string; status: string }[]>('/admin/tenants'),
  
  // Get tenant by ID
  getById: (id: string) => apiClient.get(`/admin/tenants/${id}`),
  
  // Create tenant
  create: (data: {
    name: string;
    contactEmail: string;
    plan: string;
    industry: string;
    maxUsers: number;
  }) => apiClient.post('/admin/tenants/create', data),
  
  // Update tenant
  update: (id: string, data: {
    name: string;
    contactEmail: string;
    plan: string;
    industry: string;
    maxUsers: number;
    isActive: boolean;
  }) => apiClient.put(`/admin/tenants/update?id=${id}`, data),
  
  // Delete tenant
  delete: (id: string) => apiClient.delete(`/admin/tenants/delete?id=${id}`),
  
  // Get tenant features
  getFeatures: (id: string) => apiClient.get(`/admin/tenants/${id}/features`),
  
  // Toggle tenant feature
  toggleFeature: (id: string, featureId: string, enabled: boolean) => 
    apiClient.post(`/admin/tenants/${id}/features`, { featureId, enabled }),
};

export const userApi = {
  // Get all users
  getAll: () => apiClient.get('/admin/users'),
  
  // Get user by ID
  getById: (id: string) => apiClient.get(`/admin/users/${id}`),
  
  // Create user
  create: (data: {
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    tenantId: string;
  }) => apiClient.post('/admin/users', data),
  
  // Update user
  update: (id: string, data: {
    firstName: string;
    lastName: string;
    role: string;
    isActive: boolean;
  }) => apiClient.put(`/admin/users/${id}`, data),
  
  // Delete user
  delete: (id: string) => apiClient.delete(`/admin/users/${id}`),
};

export const authApi = {
  // Login
  login: (email: string, password: string) => 
    apiClient.post('/auth/login', { email, password }),
  
  // Logout
  logout: () => apiClient.post('/auth/logout'),
  
  // Verify token
  verify: () => apiClient.get('/auth/verify'),
  
  // Refresh token
  refresh: () => apiClient.post('/auth/refresh'),
};

// Custom error class
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Request interceptor for adding auth token
export function setupAuthInterceptor() {
  // Get token from localStorage or cookies
  const token = localStorage.getItem('authToken') || 
                document.cookie
                  .split('; ')
                  .find(row => row.startsWith('authToken='))
                  ?.split('=')[1];
  
  if (token) {
    apiClient.setAuthToken(token);
  }
}

// Response interceptor for handling common errors
export function setupResponseInterceptor() {
  // This would be implemented in a real app with axios or similar
  // For now, we handle errors in the request method
}

// Initialize API client
export function initializeApiClient() {
  setupAuthInterceptor();
  setupResponseInterceptor();
}

