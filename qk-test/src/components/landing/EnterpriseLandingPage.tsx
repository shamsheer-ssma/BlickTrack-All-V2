'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Logo from '../ui/Logo';
import Button from '../ui/Button';
import FeatureCard from '../ui/FeatureCard';
import { 
  ArrowRight,
  Layers,
  FileText,
  MessageSquare,
  Settings,
  Activity,
  Workflow,
  Link,
  Users,
  Shield
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
                className="text-gray-600 hover:text-white font-medium transition-all duration-300 py-2 px-4 rounded-full hover:scale-105"
                style={{
                  background: 'transparent',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(90deg, #2563eb 0%, #1e3a8a 100%)';
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(37, 99, 235, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Sign In
              </button>
              <button 
                className="text-white font-medium px-6 py-2 rounded-full transition-all duration-300 hover:scale-105"
                style={{
                  background: 'linear-gradient(90deg, #2563eb 0%, #1e3a8a 100%)',
                  boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)'
                }}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-10">
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
                    className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-700 bg-clip-text text-transparent drop-shadow-lg"
                    style={{
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      color: 'transparent',
                      display: 'inline-block',
                      textShadow: '0 2px 8px rgba(37,99,235,0.10)'
                    }}
                  >
                    One Platform for IT, OT, and Product Security
                  </h1>
                  <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Full visibility and control across all cyber security activities.
                  </p>
                </div>
              </div>
              
              {/* Sign In Box */}
              <div className="max-w-md mx-auto mb-8">
                <div 
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 group"
                  onClick={handleSignIn}
                >
                  <div className="text-center">
                    <div 
                      className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                      style={{
                        background: 'linear-gradient(135deg, #2563eb 0%, #1e3a8a 100%)',
                        boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)'
                      }}
                    >
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold mb-2" style={{
                      background: 'linear-gradient(90deg, #2563eb 0%, #1e3a8a 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      color: '#2563eb'
                    }}>
                      Sign In
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Access your BlickTrack dashboard
                    </p>
                    <div 
                      className="inline-flex items-center px-6 py-3 rounded-full font-medium text-white transition-all duration-300"
                      style={{
                        background: 'linear-gradient(90deg, #2563eb 0%, #1e3a8a 100%)',
                        boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)'
                      }}
                    >
                      <span>Continue to Login</span>
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
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
              className="text-2xl md:text-3xl font-bold mb-4"
              style={{
                background: 'linear-gradient(90deg, #2563eb 0%, #1e3a8a 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                color: '#2563eb',
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
                solution: "Audit-ready reports instantly."
              },
              {
                icon: Settings,
                title: "Enterprise-Grade RBAC & Teams",
                problem: "Complex user management and access control",
                solution: "Fine-grained access for every user."
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
                title: "Integrated Collaboration & Integration",
                problem: "Disconnected workflows with external partners",
                solution: "Seamless work with internal teams, external partners, DevSecOps tools, and AI-powered updates."
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
      <footer className="bg-gray-900 text-white">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Logo size="sm" showTagline={false} className="mb-4" />
                    <p className="text-gray-400 text-sm">
                      Cybersecurity Lifecycle Management
                    </p>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-blue-300 uppercase tracking-wider mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white text-sm">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm">API</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-blue-200 uppercase tracking-wider mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white text-sm">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-blue-100 uppercase tracking-wider mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white text-sm">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm">Status</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm">Security</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 BlickTrack. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-blue-300 hover:text-white text-sm">Privacy Policy</a>
              <a href="#" className="text-blue-200 hover:text-white text-sm">Terms of Service</a>
              <a href="#" className="text-blue-100 hover:text-white text-sm">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EnterpriseLandingPage;
