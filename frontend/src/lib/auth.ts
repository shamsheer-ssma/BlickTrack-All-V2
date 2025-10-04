// Authentication utilities compatible with old frontend architecture
import { User, AuthSession, LoginCredentials, SignupData, ApiResponse } from '@/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export class AuthService {
  private static instance: AuthService
  private currentUser: User | null = null

  static getInstance(): AuthService {
    if (!this.instance) {
      this.instance = new AuthService()
    }
    return this.instance
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false
    
    const token = this.getToken()
    return !!token && !this.isTokenExpired(token)
  }

  // Get current user
  getCurrentUser(): User | null {
    if (this.currentUser) return this.currentUser

    if (typeof window === 'undefined') return null

    const userStr = localStorage.getItem('blick_user')
    if (userStr) {
      try {
        this.currentUser = JSON.parse(userStr)
        return this.currentUser
      } catch (error) {
        console.error('Error parsing stored user:', error)
        this.clearSession()
      }
    }
    return null
  }

  // Get authentication token
  getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('blick_token')
  }

  // Check if token is expired
  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload.exp * 1000 < Date.now()
    } catch {
      return true
    }
  }

  // Login user
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthSession>> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        credentials: 'include', // Include cookies
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Store user and token
        this.currentUser = data.data.user
        localStorage.setItem('blick_user', JSON.stringify(data.data.user))
        localStorage.setItem('blick_token', data.data.token)

        // Set cookie for server-side access
        document.cookie = `blick_token=${data.data.token}; path=/; secure; samesite=strict`

        return data
      } else {
        return {
          success: false,
          error: data.error || 'Login failed'
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      return {
        success: false,
        error: 'Network error during login'
      }
    }
  }

  // Register new user
  async signup(userData: SignupData): Promise<ApiResponse<User>> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Signup error:', error)
      return {
        success: false,
        error: 'Network error during signup'
      }
    }
  }

  // Verify session with server
  async verifySession(): Promise<boolean> {
    try {
      const token = this.getToken()
      if (!token) return false

      const response = await fetch(`${API_BASE_URL}/api/auth/session`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.user) {
          this.currentUser = data.user
          localStorage.setItem('blick_user', JSON.stringify(data.user))
          return true
        }
      }
      
      // Session invalid, clear it
      this.clearSession()
      return false
    } catch (error) {
      console.error('Session verification error:', error)
      this.clearSession()
      return false
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      const token = this.getToken()
      if (token) {
        await fetch(`${API_BASE_URL}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
        })
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      this.clearSession()
    }
  }

  // Clear local session
  private clearSession(): void {
    this.currentUser = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('blick_user')
      localStorage.removeItem('blick_token')
      // Clear cookie
      document.cookie = 'blick_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
    }
  }

  // Get user role
  getUserRole(): string | null {
    const user = this.getCurrentUser()
    return user?.role || null
  }

  // Check if user has specific role
  hasRole(role: string): boolean {
    const userRole = this.getUserRole()
    return userRole === role
  }

  // Check if user has any of the specified roles
  hasAnyRole(roles: string[]): boolean {
    const userRole = this.getUserRole()
    return userRole ? roles.includes(userRole) : false
  }

  // Get user permissions based on role
  getUserPermissions(): string[] {
    const role = this.getUserRole()
    const permissions: Record<string, string[]> = {
      'Platform Admin': [
        'manage_users',
        'manage_tenants',
        'manage_settings',
        'view_all_data',
        'manage_platform',
        'audit_logs'
      ],
      'Tenant Admin': [
        'manage_tenant_users',
        'manage_tenant_settings',
        'view_tenant_data',
        'manage_assets',
        'configure_compliance'
      ],
      'Security Manager': [
        'manage_threats',
        'manage_vulnerabilities',
        'view_security_reports',
        'assign_tasks',
        'approve_remediation'
      ],
      'Security Analyst': [
        'view_threats',
        'create_incidents',
        'update_vulnerabilities',
        'run_scans',
        'generate_reports'
      ],
      'Compliance Officer': [
        'manage_compliance',
        'audit_controls',
        'generate_compliance_reports',
        'view_audit_logs'
      ],
      'User': [
        'view_dashboard',
        'view_own_assets',
        'report_incidents'
      ]
    }

    return role ? permissions[role] || [] : []
  }

  // Check if user has specific permission
  hasPermission(permission: string): boolean {
    const permissions = this.getUserPermissions()
    return permissions.includes(permission)
  }
}

// Export singleton instance
export const authService = AuthService.getInstance()

// Legacy compatibility functions
export const getCurrentUser = () => authService.getCurrentUser()
export const isAuthenticated = () => authService.isAuthenticated()
export const getToken = () => authService.getToken()
export const logout = () => authService.logout()
export const login = (credentials: LoginCredentials) => authService.login(credentials)
export const signup = (userData: SignupData) => authService.signup(userData)
export const verifySession = () => authService.verifySession()
export const getUserRole = () => authService.getUserRole()
export const hasRole = (role: string) => authService.hasRole(role)
export const hasPermission = (permission: string) => authService.hasPermission(permission)