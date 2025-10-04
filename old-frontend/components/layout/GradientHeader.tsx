'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { logoutUser } from '@/lib/auth';
import { 
  Menu, 
  Settings, 
  User, 
  LogOut,
  Search,
  ChevronDown,
  Mail,
  Calendar,
  Bell
} from 'lucide-react';
import BlickTrackLogo from '@/components/brand/BlickTrackLogo';

interface GradientHeaderProps {
  showSidebar?: boolean;
  showSearch?: boolean;
  showNotifications?: boolean;
  showProfile?: boolean;
  userInfo?: {
    name: string;
    email: string;
    role: string;
    tenant?: string;
    company?: string;
  };
}

export default function GradientHeader({ 
  showSidebar = false,
  showSearch = false,
  showNotifications = false,
  showProfile = false,
  userInfo = {
    name: 'Platform Admin',
    email: 'admin@blicktrack.com',
    role: 'Platform Admin',
    tenant: 'BlickTrack Platform',
    company: 'BlickTrack Inc.'
  }
}: GradientHeaderProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    logoutUser();
    router.push('/');
  };

  return (
    <header className="bg-gradient-to-r from-blick-blue to-blick-teal shadow-lg sticky top-0 z-50">
      <div className="px-6 py-0">
        <div className="flex items-center justify-between">
          {/* Left side - Logo and Menu */}
          <div className="flex items-center space-x-4">
            {showSidebar && (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            
            <Link href="/" className="flex items-center">
              <BlickTrackLogo 
                size="md" 
                showIcon={true} 
                showTagline={false}
                iconClassName="w-10 h-10 rounded-xl"
                textClassName="text-xl text-white"
              />
            </Link>
          </div>

          {/* Center - Search (only when showSearch is true) */}
          {showSearch && (
            <div className="flex-1 max-w-md mx-8 hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search users, tenants, or activities..."
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-white/30 focus:border-white/30 text-white placeholder-white/60 backdrop-blur-sm"
                />
              </div>
            </div>
          )}

          {/* Right side - Actions and Profile */}
          <div className="flex items-center space-x-4">
            {/* Navigation Links for Landing Page */}
            {!showSidebar && (
              <div className="hidden lg:flex items-center space-x-6">
                <Link 
                  href="#demo" 
                  className="group text-blue-900 hover:text-blue-800 transition-all duration-300 flex items-center text-sm font-medium px-4 py-2 rounded-xl hover:bg-white/20 backdrop-blur-sm border border-transparent hover:border-white/30 bg-white/10"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Demo
                </Link>
                <Link 
                  href="#contact" 
                  className="group text-blue-900 hover:text-blue-800 transition-all duration-300 flex items-center text-sm font-medium px-4 py-2 rounded-xl hover:bg-white/20 backdrop-blur-sm border border-transparent hover:border-white/30 bg-white/10"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Contact
                </Link>
                <Link 
                  href="/auth/login" 
                  className="group relative bg-white/20 backdrop-blur-md border border-white/30 text-blue-900 hover:bg-white/30 hover:border-white/40 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <User className="w-4 h-4 mr-2 relative z-10" />
                  <span className="relative z-10">Sign In</span>
                </Link>
              </div>
            )}

            {/* Dashboard Actions */}
            {showSidebar && (
              <>
                {/* Notifications Bell */}
                <div className="relative">
                  <button 
                    onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                    className="p-2 text-blue-900 hover:text-blue-800 hover:bg-white/10 rounded-lg transition-colors relative"
                  >
                    <Bell className="w-5 h-5" />
                    {/* Notification Badge */}
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                      3
                    </span>
                  </button>
                  
                  {/* Notification Dropdown */}
                  {isNotificationOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        <div className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">New vulnerability detected</p>
                          <p className="text-xs text-gray-500">High severity issue in Project Alpha</p>
                          <p className="text-xs text-gray-400">2 minutes ago</p>
                        </div>
                        <div className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">Security scan completed</p>
                          <p className="text-xs text-gray-500">Project Beta scan finished successfully</p>
                          <p className="text-xs text-gray-400">15 minutes ago</p>
                        </div>
                        <div className="px-4 py-3 hover:bg-gray-50">
                          <p className="text-sm font-medium text-gray-900">User access granted</p>
                          <p className="text-xs text-gray-500">New team member added to Project Gamma</p>
                          <p className="text-xs text-gray-400">1 hour ago</p>
                        </div>
                      </div>
                      <div className="px-4 py-2 border-t border-gray-100">
                        <Link href="/notifications" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                          View all notifications
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* Settings Button */}
                <button className="p-2 text-blue-900 hover:text-blue-800 hover:bg-white/10 rounded-lg transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Profile Dropdown - Only show when user is logged in */}
            {showProfile && (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-3 p-2 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                    <User className="w-4 h-4 text-blue-900" />
                  </div>
                  {showSidebar && (
                    <div className="text-left">
                      <p className="text-sm font-medium text-white hidden md:block">{userInfo.name}</p>
                      <p className="text-xs text-white/80 hidden md:block">{userInfo.email}</p>
                      {(userInfo.tenant || userInfo.company) && (
                        <p className="text-xs text-white/70 hidden md:block">{userInfo.tenant || userInfo.company}</p>
                      )}
                      {/* Mobile user info - always show */}
                      <div className="md:hidden">
                        <p className="text-sm font-medium text-white">{userInfo.name}</p>
                        <p className="text-xs text-white/80">{userInfo.role}</p>
                      </div>
                    </div>
                  )}
                  <ChevronDown className="w-4 h-4 text-white/80" />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                    {/* User Info Header */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{userInfo.name}</p>
                      <p className="text-xs text-gray-600">{userInfo.email}</p>
                      <p className="text-xs text-gray-500">{userInfo.role}</p>
                      {(userInfo.tenant || userInfo.company) && (
                        <p className="text-xs text-blue-600 font-medium">
                          {userInfo.tenant || userInfo.company}
                        </p>
                      )}
                    </div>
                    
                    {/* Menu Items */}
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Profile Settings
                    </Link>
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Account Settings
                    </Link>
                    <div className="border-t border-gray-200 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Button for Landing Page */}
            {!showSidebar && (
              <button className="lg:hidden text-white/80 hover:text-white transition-colors duration-200">
                <Menu className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {showSidebar && sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div 
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setSidebarOpen(false)}
          ></div>
        </div>
      )}
    </header>
  );
}
