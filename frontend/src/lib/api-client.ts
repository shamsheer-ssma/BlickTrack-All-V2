// API client compatible with old frontend and new backend
import { RequestConfig, ApiResponse, PaginatedResponse } from '@/types'
import { authService } from './auth'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export class ApiClient {
  private static instance: ApiClient

  static getInstance(): ApiClient {
    if (!this.instance) {
      this.instance = new ApiClient()
    }
    return this.instance
  }

  private async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      headers = {},
      body,
      timeout = 30000
    } = config

    try {
      const token = authService.getToken()
      const defaultHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        ...headers
      }

      if (token) {
        defaultHeaders['Authorization'] = `Bearer ${token}`
      }

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers: defaultHeaders,
        body: body ? JSON.stringify(body) : undefined,
        credentials: 'include',
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      let data
      try {
        data = await response.json()
      } catch (error) {
        // Handle non-JSON responses
        data = { success: false, error: 'Invalid response format' }
      }

      if (!response.ok) {
        // Handle authentication errors
        if (response.status === 401) {
          authService.logout()
          window.location.href = '/auth/login'
        }

        return {
          success: false,
          error: data.error || `HTTP ${response.status}: ${response.statusText}`
        }
      }

      return data
    } catch (error: any) {
      console.error(`API request failed for ${endpoint}:`, error)
      
      if (error.name === 'AbortError') {
        return {
          success: false,
          error: 'Request timeout'
        }
      }

      return {
        success: false,
        error: error.message || 'Network error'
      }
    }
  }

  // Auth endpoints
  async login(credentials: { email: string; password: string }) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: credentials
    })
  }

  async signup(userData: any) {
    return this.request('/api/auth/signup', {
      method: 'POST',
      body: userData
    })
  }

  async logout() {
    return this.request('/api/auth/logout', { method: 'POST' })
  }

  async verifySession() {
    return this.request('/api/auth/session')
  }

  async resetPassword(email: string) {
    return this.request('/api/auth/reset-password', {
      method: 'POST',
      body: { email }
    })
  }

  // User management endpoints
  async getUsers(params?: { page?: number; limit?: number; role?: string }) {
    const query = params ? `?${new URLSearchParams(params as any).toString()}` : ''
    return this.request<PaginatedResponse<any>>(`/api/users${query}`)
  }

  async getUser(id: string) {
    return this.request(`/api/users/${id}`)
  }

  async createUser(userData: any) {
    return this.request('/api/users', {
      method: 'POST',
      body: userData
    })
  }

  async updateUser(id: string, userData: any) {
    return this.request(`/api/users/${id}`, {
      method: 'PUT',
      body: userData
    })
  }

  async deleteUser(id: string) {
    return this.request(`/api/users/${id}`, { method: 'DELETE' })
  }

  // Tenant management endpoints
  async getTenants(params?: { page?: number; limit?: number }) {
    const query = params ? `?${new URLSearchParams(params as any).toString()}` : ''
    return this.request<PaginatedResponse<any>>(`/api/tenants${query}`)
  }

  async getTenant(id: string) {
    return this.request(`/api/tenants/${id}`)
  }

  async createTenant(tenantData: any) {
    return this.request('/api/tenants', {
      method: 'POST',
      body: tenantData
    })
  }

  async updateTenant(id: string, tenantData: any) {
    return this.request(`/api/tenants/${id}`, {
      method: 'PUT',
      body: tenantData
    })
  }

  async deleteTenant(id: string) {
    return this.request(`/api/tenants/${id}`, { method: 'DELETE' })
  }

  // Dashboard endpoints
  async getDashboardMetrics() {
    return this.request('/api/dashboard/metrics')
  }

  async getDashboardData(role?: string) {
    const query = role ? `?role=${role}` : ''
    return this.request(`/api/dashboard${query}`)
  }

  // Threats and vulnerabilities
  async getThreats(params?: { page?: number; limit?: number; severity?: string; status?: string }) {
    const query = params ? `?${new URLSearchParams(params as any).toString()}` : ''
    return this.request<PaginatedResponse<any>>(`/api/security/threats${query}`)
  }

  async getThreat(id: string) {
    return this.request(`/api/security/threats/${id}`)
  }

  async createThreat(threatData: any) {
    return this.request('/api/security/threats', {
      method: 'POST',
      body: threatData
    })
  }

  async updateThreat(id: string, threatData: any) {
    return this.request(`/api/security/threats/${id}`, {
      method: 'PUT',
      body: threatData
    })
  }

  async getVulnerabilities(params?: { page?: number; limit?: number; severity?: string; status?: string }) {
    const query = params ? `?${new URLSearchParams(params as any).toString()}` : ''
    return this.request<PaginatedResponse<any>>(`/api/security/vulnerabilities${query}`)
  }

  async getVulnerability(id: string) {
    return this.request(`/api/security/vulnerabilities/${id}`)
  }

  async updateVulnerability(id: string, vulnData: any) {
    return this.request(`/api/security/vulnerabilities/${id}`, {
      method: 'PUT',
      body: vulnData
    })
  }

  // Asset management
  async getAssets(params?: { page?: number; limit?: number; type?: string; status?: string }) {
    const query = params ? `?${new URLSearchParams(params as any).toString()}` : ''
    return this.request<PaginatedResponse<any>>(`/api/assets${query}`)
  }

  async getAsset(id: string) {
    return this.request(`/api/assets/${id}`)
  }

  async createAsset(assetData: any) {
    return this.request('/api/assets', {
      method: 'POST',
      body: assetData
    })
  }

  async updateAsset(id: string, assetData: any) {
    return this.request(`/api/assets/${id}`, {
      method: 'PUT',
      body: assetData
    })
  }

  async deleteAsset(id: string) {
    return this.request(`/api/assets/${id}`, { method: 'DELETE' })
  }

  // Compliance endpoints
  async getComplianceFrameworks() {
    return this.request('/api/compliance/frameworks')
  }

  async getComplianceStatus(frameworkId?: string) {
    const query = frameworkId ? `?framework=${frameworkId}` : ''
    return this.request(`/api/compliance/status${query}`)
  }

  async updateComplianceRequirement(id: string, data: any) {
    return this.request(`/api/compliance/requirements/${id}`, {
      method: 'PUT',
      body: data
    })
  }

  // Audit logs
  async getAuditLogs(params?: { page?: number; limit?: number; userId?: string; action?: string }) {
    const query = params ? `?${new URLSearchParams(params as any).toString()}` : ''
    return this.request<PaginatedResponse<any>>(`/api/audit/logs${query}`)
  }

  // Settings endpoints
  async getSettings() {
    return this.request('/api/settings')
  }

  async updateSettings(settings: any) {
    return this.request('/api/settings', {
      method: 'PUT',
      body: settings
    })
  }

  // System health
  async getSystemHealth() {
    return this.request('/api/system/health')
  }

  async getSystemStats() {
    return this.request('/api/system/stats')
  }
}

// Export singleton instance
export const apiClient = ApiClient.getInstance()

// Legacy compatibility exports
export const api = apiClient
export default apiClient