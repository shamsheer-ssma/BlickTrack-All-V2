import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, Lock, Users, BarChart3, AlertTriangle, CheckCircle } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50" style={{ backgroundColor: '#f0f9ff', minHeight: '100vh' }}>
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50" style={{ borderBottom: '1px solid #e5e7eb', backgroundColor: 'rgba(255,255,255,0.8)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900 test-css-loading">BlickTrack</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/auth/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Enterprise Cybersecurity
              <span className="text-blue-600"> Management Platform</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Comprehensive threat modeling, vulnerability management, and compliance tracking 
              for modern enterprises. Secure your digital assets with confidence.
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/auth/register">
                <Button size="lg">Start Free Trial</Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline">Learn More</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Complete Cybersecurity Management
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage cybersecurity across your enterprise in one platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Threat Modeling</CardTitle>
                <CardDescription>
                  Interactive STRIDE analysis with visual diagrams to identify and mitigate security threats.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-green-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <AlertTriangle className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Vulnerability Management</CardTitle>
                <CardDescription>
                  Comprehensive vulnerability lifecycle management with automated scanning and reporting.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-purple-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Compliance Tracking</CardTitle>
                <CardDescription>
                  Built-in support for SOC2, ISO27001, GDPR, HIPAA and other compliance frameworks.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-orange-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle>Multi-Tenant RBAC</CardTitle>
                <CardDescription>
                  Enterprise-grade role-based access control with 7 different user roles and granular permissions.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-cyan-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-cyan-600" />
                </div>
                <CardTitle>Advanced Analytics</CardTitle>
                <CardDescription>
                  Real-time dashboards and comprehensive reporting for security metrics and KPIs.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-red-200 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Lock className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle>Incident Response</CardTitle>
                <CardDescription>
                  End-to-end incident management workflows with automated notifications and escalation.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Secure Your Enterprise?
          </h3>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of organizations who trust BlickTrack for their cybersecurity management.
          </p>
          <Link href="/auth/register">
            <Button size="lg" variant="secondary">Start Your Free Trial</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="h-6 w-6 text-blue-400" />
                <span className="text-xl font-bold">BlickTrack</span>
              </div>
              <p className="text-gray-400">
                Enterprise cybersecurity management platform for the modern world.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white">Features</Link></li>
                <li><Link href="#" className="hover:text-white">Pricing</Link></li>
                <li><Link href="#" className="hover:text-white">Security</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white">About</Link></li>
                <li><Link href="#" className="hover:text-white">Contact</Link></li>
                <li><Link href="#" className="hover:text-white">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white">Documentation</Link></li>
                <li><Link href="#" className="hover:text-white">Support</Link></li>
                <li><Link href="#" className="hover:text-white">Status</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 BlickTrack. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}