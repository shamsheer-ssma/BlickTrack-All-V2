import { Shield } from 'lucide-react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left side - Branding */}
      <div className="hidden lg:flex flex-col justify-center items-center bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 p-8">
        <div className="text-center text-white">
          <div className="flex items-center justify-center mb-8">
            <Shield className="h-16 w-16" />
          </div>
          <h1 className="text-4xl font-bold mb-4">BlickTrack</h1>
          <p className="text-xl text-blue-100 mb-8 max-w-md">
            Enterprise Cybersecurity Management Platform
          </p>
          <div className="grid grid-cols-1 gap-4 text-left max-w-md">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-300 rounded-full" />
              <span className="text-blue-100">Multi-tenant RBAC system</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-300 rounded-full" />
              <span className="text-blue-100">Comprehensive threat modeling</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-300 rounded-full" />
              <span className="text-blue-100">Enterprise compliance tracking</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-300 rounded-full" />
              <span className="text-blue-100">Advanced security analytics</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Auth form */}
      <div className="flex flex-col justify-center items-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 lg:hidden">
            <div className="flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-blue-600 mr-2" />
              <span className="text-2xl font-bold">BlickTrack</span>
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}