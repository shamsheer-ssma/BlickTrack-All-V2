import UnifiedDashboard from '@/components/dashboard/UnifiedDashboard'
import AuthGuard from '@/components/auth/AuthGuard'

export default function Dashboard() {
  return (
    <AuthGuard requireAuth={true}>
      <UnifiedDashboard />
    </AuthGuard>
  )
}
