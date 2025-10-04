'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    tenant: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    // Basic validation
    const newErrors: Record<string, string> = {}
    if (!formData.email) newErrors.email = 'Email is required'
    if (!formData.password) newErrors.password = 'Password is required'
    if (!formData.tenant) newErrors.tenant = 'Organization is required'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setLoading(false)
      return
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock authentication - in real app, call your API
      if (formData.email === 'admin@example.com' && formData.password === 'password') {
        toast({
          title: 'Login successful!',
          description: 'Welcome back to BlickTrack.',
          variant: 'default',
        })
        router.push('/dashboard')
      } else {
        setErrors({ general: 'Invalid credentials. Please try again.' })
      }
    } catch (error) {
      setErrors({ general: 'An error occurred. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <Card className="w-full border-0 shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
        <CardDescription>
          Sign in to your BlickTrack account to continue
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.general && (
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-md">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{errors.general}</span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="tenant">Organization</Label>
            <Input
              id="tenant"
              type="text"
              placeholder="Enter your organization name"
              value={formData.tenant}
              onChange={(e) => handleInputChange('tenant', e.target.value)}
              className={errors.tenant ? 'border-red-500' : ''}
            />
            {errors.tenant && (
              <p className="text-sm text-red-600">{errors.tenant}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <input
                id="remember"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <Label htmlFor="remember" className="text-sm text-gray-600">
                Remember me
              </Label>
            </div>
            <Link
              href="/auth/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Forgot password?
            </Link>
          </div>

          <Button type="submit" className="w-full" loading={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/auth/register" className="text-blue-600 hover:text-blue-800 font-medium">
              Sign up
            </Link>
          </p>
        </div>

        {/* Demo credentials */}
        <div className="mt-6 p-4 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-800 font-medium mb-2">Demo Credentials:</p>
          <div className="text-xs text-blue-700 space-y-1">
            <div>Organization: <code className="bg-blue-100 px-1 rounded">demo-org</code></div>
            <div>Email: <code className="bg-blue-100 px-1 rounded">admin@example.com</code></div>
            <div>Password: <code className="bg-blue-100 px-1 rounded">password</code></div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}