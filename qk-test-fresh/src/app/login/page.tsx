import FastLoginPage from '@/components/auth/FastLoginPage'
import AuthGuard from '@/components/auth/AuthGuard'

export default function Login() {
  return (
    <AuthGuard requireAuth={false}>
      <FastLoginPage />
    </AuthGuard>
  )
}

