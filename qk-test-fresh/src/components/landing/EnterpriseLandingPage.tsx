'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Logo from '../ui/Logo';
import FeatureCard from '../ui/FeatureCard';
// import { BLICKTRACK_THEME, getGradientStyle } from '@/lib/theme';
import { 
  Layers,
  FileText,
  MessageSquare,
  Settings,
  Activity,
  Workflow,
  Link,
  Users
} from 'lucide-react';

const EnterpriseLandingPage = () => {
  const router = useRouter();

  const handleSignIn = () => {
    router.push('/login');
  };

  return (
  <div className="min-h-screen bg-white">
      {/* Header */}
  <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo size="md" showTagline={true} />
            
            <div className="flex items-center space-x-6">
              <button 
                onClick={handleSignIn}
                className="text-white font-medium px-6 py-2 rounded-full transition-all duration-300 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #073c82 0%, #00d6bc 100%)',
                  boxShadow: '0 4px 6px -1px rgba(7, 60, 130, 0.2)'
                }}
              >
                Sign In
              </button>
              <button 
                className="text-white font-medium px-6 py-2 rounded-full transition-all duration-300 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #073c82 0%, #00d6bc 100%)',
                  boxShadow: '0 4px 6px -1px rgba(7, 60, 130, 0.2)'
                }}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section 
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%)',
        }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23073c82' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        <div className="relative w-full px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex flex-col items-center justify-center mb-12">
                <div className="mb-8">
                  <Logo size="xl" showTagline={true} />
                  <div className="mt-16" />
                </div>
                <div className="text-center mb-10">
                  <h1 
                    className="text-3xl md:text-4xl lg:text-5xl font-normal mb-4 leading-tight transition-all duration-300 hover:scale-105 cursor-default"
                    style={{
                      background: 'linear-gradient(90deg, #073c82 0%, #00d6bc 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      color: '#073c82',
                      display: 'inline-block',
                      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                      fontWeight: '400',
                      letterSpacing: '-0.025em',
                    }}
                    onMouseEnter={(e: React.MouseEvent<HTMLSpanElement>) => {
                      e.currentTarget.style.background = 'linear-gradient(90deg, #00d6bc 0%, #073c82 100%)';
                      (e.currentTarget.style as CSSStyleDeclaration & { webkitBackgroundClip?: string; webkitTextFillColor?: string }).webkitBackgroundClip = 'text';
                      (e.currentTarget.style as CSSStyleDeclaration & { webkitTextFillColor?: string }).webkitTextFillColor = 'transparent';
                      e.currentTarget.style.backgroundClip = 'text';
                    }}
                    onMouseLeave={(e: React.MouseEvent<HTMLSpanElement>) => {
                      e.currentTarget.style.background = 'linear-gradient(90deg, #073c82 0%, #00d6bc 100%)';
                      (e.currentTarget.style as CSSStyleDeclaration & { webkitBackgroundClip?: string; webkitTextFillColor?: string }).webkitBackgroundClip = 'text';
                      (e.currentTarget.style as CSSStyleDeclaration & { webkitTextFillColor?: string }).webkitTextFillColor = 'transparent';
                      e.currentTarget.style.backgroundClip = 'text';
                    }}
                  >
                    One Platform <span style={{ 
                      background: 'linear-gradient(90deg, #073c82 0%, #00d6bc 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      color: '#073c82',
                      opacity: 0.7
                    } as React.CSSProperties}>|</span> Any Product <span style={{ 
                      background: 'linear-gradient(90deg, #073c82 0%, #00d6bc 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      color: '#073c82',
                      opacity: 0.7
                    } as React.CSSProperties}>|</span> Complete Security Compliance
                  </h1>
                  <p 
                    className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed"
                    style={{
                      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                      fontWeight: '400',
                    }}
                  >
                    Full visibility and control across all cyber security activities.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>


      {/* Features Grid */}
      <section id="features" className="py-20 bg-gray-50 border-t border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center mb-8">
            <h2 
              className="text-2xl md:text-3xl mb-4"
              style={{
                background: 'linear-gradient(90deg, #073c82 0%, #00d6bc 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                color: '#073c82',
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                fontWeight: '500',
                letterSpacing: '-0.025em',
                display: 'inline-block'
              }}
            >
              Our Solutions
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Layers,
                title: "Unified Security Platform",
                problem: "Scattered security tools across multiple platforms",
                solution: "All your security activities in one place."
              },
              {
                icon: Workflow,
                title: "Complete Secure Development Lifecycle",
                problem: "Fragmented security processes across development",
                solution: "Trainings, requirements, threat modeling, SAST/DAST, and vulnerability management."
              },
              {
                icon: MessageSquare,
                title: "Speak Your Organization's Language",
                problem: "Generic security tools that don't match your processes",
                solution: "Tailored to your processes and org structure."
              },
              {
                icon: FileText,
                title: "Auto-Generated Compliance Evidence",
                problem: "Manual, time-consuming compliance reporting",
                solution: "Audit-ready reports instantly for PM, QA, RA, SOC, CISOs, Auditors."
              },
              {
                icon: Settings,
                title: "Enterprise-Grade Security",
                problem: "Complex user management and access control. ",
                solution: "Fine-grained access for every user. MFA,SSO,RBAC,ABAC and more."
              },
              {
                icon: Users,
                title: "Easy Collaboration with Teams",
                problem: "Siloed teams causing burnout and inefficiency",
                solution: "Reduce burnout for dev, security, QA, legal, regulatory, IT, and product teams."
              },
              {
                icon: Activity,
                title: "Post-Market Activity Support",
                problem: "Limited post-deployment security monitoring",
                solution: "Incident response, vulnerability disclosure, and ongoing monitoring."
              },
              {
                icon: Link,
                title: "Collaboration & Integration",
                problem: "Disconnected workflows with external partners",
                solution: "Seamless work with internal teams, external partners, integrate DevSecOps tools, and AI-powered insights."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <FeatureCard
                  icon={feature.icon}
                  title={feature.title}
                  solution={feature.solution}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer 
        className="text-white"
        style={{
          background: 'linear-gradient(135deg, #073c82 0%, #00d6bc 100%)',
        }}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Logo size="sm" showTagline={true} className="mb-4" variant="light" />
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-200 hover:text-white text-sm">Features</a></li>
                <li><a href="#" className="text-gray-200 hover:text-white text-sm">Pricing</a></li>
                <li><a href="#" className="text-gray-200 hover:text-white text-sm">API</a></li>
                <li><a href="#" className="text-gray-200 hover:text-white text-sm">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-200 hover:text-white text-sm">About</a></li>
                <li><a href="#" className="text-gray-200 hover:text-white text-sm">Careers</a></li>
                <li><a href="#" className="text-gray-200 hover:text-white text-sm">Blog</a></li>
                <li><a href="#" className="text-gray-200 hover:text-white text-sm">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-200 hover:text-white text-sm">Help Center</a></li>
                <li><a href="#" className="text-gray-200 hover:text-white text-sm">Documentation</a></li>
                <li><a href="#" className="text-gray-200 hover:text-white text-sm">Status</a></li>
                <li><a href="#" className="text-gray-200 hover:text-white text-sm">Security</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-300 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-200 text-sm">
              © 2025 BlickTrack. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-200 hover:text-white text-sm">Privacy Policy</a>
              <a href="#" className="text-gray-200 hover:text-white text-sm">Terms of Service</a>
              <a href="#" className="text-gray-200 hover:text-white text-sm">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EnterpriseLandingPage;
