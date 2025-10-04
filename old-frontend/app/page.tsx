'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, Users, Globe, CheckCircle, Zap as Lightning, BarChart, BookOpen, FileText, AlertTriangle, Eye } from 'lucide-react';
import BlickTrackLogo, { BlickTrackGradientText } from '@/components/brand/BlickTrackLogo';
import GradientHeader from '@/components/layout/GradientHeader';

export default function LandingPage() {
  const router = useRouter();

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/session');
        if (response.ok) {
          console.log('🔍 User already logged in, redirecting to dashboard');
          router.push('/dashboard');
        }
      } catch (error) {
        console.log('🔍 No active session found');
      }
    };

    checkSession();
  }, [router]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Gradient Header */}
      <GradientHeader />

      {/* Hero Section - Enhanced Visual Hierarchy */}
      <section className="relative px-6 py-20 pt-24 overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        {/* Floating Elements for Visual Interest */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-64 right-40 w-24 h-24 bg-green-500/10 rounded-full blur-xl animate-bounce"></div>
        <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-cyan-500/10 rounded-full blur-xl animate-pulse"></div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          
          <div className="mb-6">
            <BlickTrackLogo 
              size="xl" 
              showIcon={false} 
              showTagline={false}
              textClassName="text-5xl md:text-7xl font-bold leading-tight font-geometrica"
              className="justify-center"
            />
          </div>
          
          <p className="text-xl text-blue-100 mb-12 max-w-4xl mx-auto leading-relaxed font-geometrica">
            End-to-End Product & Application Security Lifecycle Management, AI.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link 
              href="/auth/signup" 
              className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl font-geometrica shadow-lg relative overflow-hidden"
            >
              <span className="relative z-10">Start Free Trial</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <Link 
              href="/auth/login" 
              className="group bg-gradient-to-r from-cyan-600 to-green-600 hover:from-cyan-700 hover:to-green-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl font-geometrica shadow-lg relative overflow-hidden"
            >
              <span className="relative z-10">Schedule Demo</span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section - 3 Focused Cards */}
      <section className="relative px-6 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-geometrica">
              Why BlickTrack?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-geometrica">
              Transform how teams approach product security
            </p>
          </div>
          
          {/* 3 Focused Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Visibility</h3>
              <p className="text-gray-600 leading-relaxed text-justify">
                See every risk, requirement, and compliance gap in one place — no blind spots.
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-100 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-600 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Lightning className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Traceability</h3>
              <p className="text-gray-600 leading-relaxed text-justify">
                Track every security issue from discovery to resolution with full accountability.
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-100 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <BarChart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Powered by AI</h3>
              <p className="text-gray-600 leading-relaxed text-justify">
                Automate threat modeling, vulnerability triage, testing, and integrations - enabling productivity and team efficiency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="relative px-6 py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-geometrica">
              Key Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-geometrica">
              Comprehensive security capabilities designed for security, quality, management, and development teams
            </p>
          </div>
          
          {/* 4x2 Feature Grid */}
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">AI-Powered Threat Modeling</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Generate and prioritize threats, mitigations, and test cases automatically.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <Eye className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Real-Time Vulnerability Intelligence</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Automated SBOMs, scanner integrations, and risk-based vulnerability prioritization.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <BarChart className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Continuous Compliance</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Always audit-ready with mappings to SOC 2, ISO 27001, NIST, HIPAA, GDPR.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                  <Users className="w-5 h-5 text-orange-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Collaborative Security Workflows</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Review, approve, and track everything in one place — designed for developers and security pros alike.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                  <BookOpen className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Security Training</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Comprehensive security training programs and awareness campaigns for all team members.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center mr-3">
                  <Globe className="w-5 h-5 text-teal-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">External Collaboration</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Unified platform for pen testing partners, supplier security, and third-party assessments.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                  <FileText className="w-5 h-5 text-yellow-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Internal Security Policy</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Enforce internal security policies with automated compliance monitoring and reporting.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                  <AlertTriangle className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Incident Response & Disclosure</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Streamlined incident response workflows and coordinated vulnerability disclosure processes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="relative px-6 py-20 bg-slate-800/20">
        <div className="max-w-4xl mx-auto text-center">
          <blockquote className="text-2xl font-medium text-white mb-6 leading-relaxed">
            &ldquo;Our vision is to empower cross-functional teams across development, security, quality, and operations with a single, intelligent platform — reducing repetitive work, boosting productivity, and letting them focus on what truly matters.&rdquo;
          </blockquote>
          <cite className="text-lg text-slate-400 font-medium">
            — Founder & CEO, BlickTrack
          </cite>
        </div>
      </section>


      {/* Comprehensive Footer */}
      <footer className="bg-gradient-to-r from-blick-blue to-blick-teal text-white py-16 w-full">
        <div className="w-full px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div className="md:col-span-2">
              <BlickTrackLogo 
                size="lg" 
                showIcon={true} 
                showTagline={true}
                className="mb-6"
                textClassName="text-2xl"
                taglineClassName="text-blue-100"
              />
              <p className="text-slate-300 mb-6 max-w-md leading-relaxed">
                End-to-End Cybersecurity Lifecycle Management, Powered by AI. Comprehensive security risk assessment, 
                threat modeling, vulnerability management, and compliance automation.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-slate-300 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-slate-300 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="#" className="text-slate-300 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/auth/login" className="text-slate-300 hover:text-white transition-colors">Login</Link></li>
                <li><Link href="/dashboard" className="text-slate-300 hover:text-white transition-colors">Dashboard</Link></li>
                <li><Link href="/features/threat-modeling" className="text-slate-300 hover:text-white transition-colors">Threat Modeling</Link></li>
                <li><Link href="/platform-settings" className="text-slate-300 hover:text-white transition-colors">Admin Guide</Link></li>
                <li><Link href="/features/vulnerability-scanning" className="text-slate-300 hover:text-white transition-colors">Vulnerabilities</Link></li>
                <li><Link href="/features/sbom-management" className="text-slate-300 hover:text-white transition-colors">SBOM Management</Link></li>
                <li><Link href="/features/incident-response" className="text-slate-300 hover:text-white transition-colors">Incident Response</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="text-slate-300 hover:text-white transition-colors">API Reference</a></li>
                <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#contact" className="text-slate-300 hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-slate-300 hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>

            {/* Bottom Bar */}
            <div className="border-t border-slate-700 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="text-slate-300 text-sm mb-4 md:mb-0">
                  © 2025 <BlickTrackGradientText text="BlickTrack" className="font-semibold" />. All rights reserved.
                </div>
                <div className="flex space-x-6">
                  <a href="#" className="text-slate-300 hover:text-white text-sm transition-colors">Privacy Policy</a>
                  <a href="#" className="text-slate-300 hover:text-white text-sm transition-colors">Terms of Service</a>
                  <a href="#" className="text-slate-300 hover:text-white text-sm transition-colors">Cookie Policy</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}