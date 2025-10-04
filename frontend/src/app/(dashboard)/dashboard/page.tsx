'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { authService } from '@/lib/auth'
import { apiClient } from '@/lib/api-client'
import { User, DashboardMetrics } from '@/types'
import {
  AlertTriangle,
  Shield,
  Users,
  Activity,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  Eye,
  ExternalLink,
} from 'lucide-react'

// Mock data - in real app, fetch from API
const dashboardData = {
  metrics: {
    totalThreats: 47,
    criticalVulns: 12,
    activeIncidents: 3,
    complianceScore: 87,
  },
  trends: {
    threats: { value: '+12%', direction: 'up' as const },
    vulnerabilities: { value: '-8%', direction: 'down' as const },
    incidents: { value: '+2', direction: 'up' as const },
    compliance: { value: '+5%', direction: 'up' as const },
  },
  recentActivities: [
    {
      id: 1,
      type: 'threat',
      title: 'New threat model created',
      description: 'Payment processing system threat model',
      timestamp: '2 hours ago',
      severity: 'medium',
    },
    {
      id: 2,
      type: 'vulnerability',
      title: 'Critical vulnerability detected',
      description: 'SQL injection in user authentication',
      timestamp: '4 hours ago',
      severity: 'critical',
    },
    {
      id: 3,
      type: 'incident',
      title: 'Security incident resolved',
      description: 'Unauthorized access attempt blocked',
      timestamp: '1 day ago',
      severity: 'low',
    },
  ],
  complianceFrameworks: [
    { name: 'SOC 2', score: 92, status: 'compliant' },
    { name: 'ISO 27001', score: 88, status: 'compliant' },
    { name: 'GDPR', score: 85, status: 'compliant' },
    { name: 'HIPAA', score: 78, status: 'needs-attention' },
  ],
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [dashboardMetrics, setDashboardMetrics] = useState<DashboardMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        // Check authentication
        const currentUser = authService.getCurrentUser()
        if (!currentUser) {
          console.log('❌ No authenticated user, redirecting to login')
          router.push('/auth/login')
          return
        }

        // Verify session is still valid
        const isValidSession = await authService.verifySession()
        if (!isValidSession) {
          console.log('❌ Invalid session, redirecting to login')
          router.push('/auth/login')
          return
        }

        console.log('✅ User authenticated:', currentUser)
        setUser(currentUser)

        // Fetch dashboard metrics
        const metricsResponse = await apiClient.getDashboardMetrics()
        if (metricsResponse.success && metricsResponse.data) {
          setDashboardMetrics(metricsResponse.data as DashboardMetrics)
        } else {
          console.warn('Failed to load dashboard metrics:', metricsResponse.error)
          // Set default metrics if API fails
          setDashboardMetrics({
            totalThreats: 24,
            activeVulnerabilities: 157,
            complianceScore: 87,
            securityIncidents: 3,
            assetsMonitored: 1247,
            usersActive: 89
          })
        }
      } catch (error) {
        console.error('Dashboard initialization error:', error)
        // Set default metrics on error
        setDashboardMetrics({
          totalThreats: 24,
          activeVulnerabilities: 157,
          complianceScore: 87,
          securityIncidents: 3,
          assetsMonitored: 1247,
          usersActive: 89
        })
      } finally {
        setIsLoading(false)
      }
    }

    initializeDashboard()
  }, [router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Shield className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user || !dashboardMetrics) {
    return null
  }

  const { metrics, trends, recentActivities, complianceFrameworks } = dashboardData

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'high':
        return <AlertCircle className="h-4 w-4 text-orange-500" />
      case 'medium':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'low':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-blue-500" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'border-red-200 bg-red-50'
      case 'high':
        return 'border-orange-200 bg-orange-50'
      case 'medium':
        return 'border-yellow-200 bg-yellow-50'
      case 'low':
        return 'border-green-200 bg-green-50'
      default:
        return 'border-blue-200 bg-blue-50'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Security Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your organization's security posture and recent activities.
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Threats</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalThreats}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {trends.threats.direction === 'up' ? (
                <TrendingUp className="h-3 w-3 text-red-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-green-500 mr-1" />
              )}
              <span className={trends.threats.direction === 'up' ? 'text-red-500' : 'text-green-500'}>
                {trends.threats.value}
              </span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Vulnerabilities</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.criticalVulns}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingDown className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-500">{trends.vulnerabilities.value}</span>
              <span className="ml-1">from last week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Incidents</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeIncidents}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-orange-500 mr-1" />
              <span className="text-orange-500">{trends.incidents.value}</span>
              <span className="ml-1">new this week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.complianceScore}%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-500">{trends.compliance.value}</span>
              <span className="ml-1">improvement</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>
              Latest security events and updates in your organization.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className={`flex items-start space-x-3 p-3 rounded-lg border ${getSeverityColor(activity.severity)}`}
              >
                <div className="flex-shrink-0 mt-1">
                  {getSeverityIcon(activity.severity)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.title}
                  </p>
                  <p className="text-sm text-gray-600">
                    {activity.description}
                  </p>
                  <div className="flex items-center mt-2 text-xs text-gray-500">
                    <Clock className="h-3 w-3 mr-1" />
                    {activity.timestamp}
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {activity.type}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Compliance Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Compliance Frameworks</CardTitle>
            <CardDescription>
              Current compliance status across different frameworks.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {complianceFrameworks.map((framework) => (
              <div key={framework.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{framework.name}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      {framework.score}%
                    </span>
                    <Badge
                      variant={framework.status === 'compliant' ? 'success' : 'warning'}
                      className="text-xs"
                    >
                      {framework.status === 'compliant' ? 'Compliant' : 'Needs Attention'}
                    </Badge>
                  </div>
                </div>
                <Progress value={framework.score} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks and shortcuts for security management.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <Shield className="h-6 w-6" />
              <span className="text-sm">Create Threat Model</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <AlertTriangle className="h-6 w-6" />
              <span className="text-sm">Scan Vulnerabilities</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <Activity className="h-6 w-6" />
              <span className="text-sm">Report Incident</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <Eye className="h-6 w-6" />
              <span className="text-sm">View Reports</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}