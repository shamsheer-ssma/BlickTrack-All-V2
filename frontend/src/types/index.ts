// Core application types that align with backend and old frontend
export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: UserRole
  tenant: string
  organization: string
  userType: 'Licensed User' | 'Guest User'
  isLicensed: boolean
  emailVerified: boolean
  avatar?: string
  company?: string // Legacy compatibility
  createdAt?: Date
  updatedAt?: Date
}

export type UserRole = 
  | 'Platform Admin'
  | 'Tenant Admin'
  | 'Security Manager'
  | 'Security Analyst'
  | 'Compliance Officer'
  | 'User'

export interface Tenant {
  id: string
  name: string
  domain: string
  isActive: boolean
  settings: TenantSettings
  createdAt: Date
  updatedAt: Date
}

export interface TenantSettings {
  maxUsers: number
  features: string[]
  customization: {
    logo?: string
    primaryColor?: string
    secondaryColor?: string
  }
}

export interface AuthSession {
  user: User
  token: string
  refreshToken?: string
  expiresAt: Date
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface SignupData {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  organization: string
  tenant?: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface DashboardMetrics {
  totalThreats: number
  activeVulnerabilities: number
  complianceScore: number
  securityIncidents: number
  assetsMonitored: number
  usersActive: number
}

export interface SecurityThreat {
  id: string
  title: string
  severity: 'Low' | 'Medium' | 'High' | 'Critical'
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed'
  description: string
  category: string
  assignedTo?: string
  createdAt: Date
  updatedAt: Date
}

export interface Vulnerability {
  id: string
  cveId?: string
  title: string
  severity: 'Low' | 'Medium' | 'High' | 'Critical'
  status: 'Open' | 'Patched' | 'Mitigated' | 'False Positive'
  description: string
  affectedAssets: string[]
  recommendations: string[]
  createdAt: Date
  updatedAt: Date
}

export interface Asset {
  id: string
  name: string
  type: 'Server' | 'Workstation' | 'Mobile' | 'Network' | 'Application' | 'Database'
  status: 'Active' | 'Inactive' | 'Decommissioned'
  ipAddress?: string
  location?: string
  owner?: string
  lastScan?: Date
  riskScore: number
  vulnerabilities: number
}

export interface ComplianceFramework {
  id: string
  name: string
  version: string
  description: string
  requirements: ComplianceRequirement[]
}

export interface ComplianceRequirement {
  id: string
  title: string
  description: string
  status: 'Compliant' | 'Non-Compliant' | 'Partially Compliant' | 'Not Assessed'
  evidence?: string[]
  dueDate?: Date
}

export interface NavigationItem {
  title: string
  href: string
  icon: any
  badge?: {
    text: string
    variant: 'default' | 'secondary' | 'destructive' | 'outline'
  } | null
  items?: NavigationItem[]
  roles?: UserRole[] // Role-based navigation
}

export interface AuditLog {
  id: string
  userId: string
  userName: string
  action: string
  resource: string
  details: Record<string, any>
  ipAddress: string
  userAgent: string
  timestamp: Date
}

// Form validation types
export interface FormValidationError {
  field: string
  message: string
}

export interface FormState<T> {
  data: T
  errors: FormValidationError[]
  isSubmitting: boolean
  isValid: boolean
}

// API client types
export interface RequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  headers?: Record<string, string>
  body?: any
  timeout?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Theme and UI types
export interface ThemeConfig {
  mode: 'light' | 'dark' | 'system'
  primaryColor: string
  accentColor: string
  borderRadius: number
}

export interface NotificationConfig {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  duration?: number
  persistent?: boolean
  actions?: Array<{
    label: string
    handler: () => void
  }>
}