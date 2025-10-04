'use client';

import React from 'react';
import Sidebar from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Full width at top */}
      <div className="w-full">
        {children}
      </div>
      
      {/* Connection Box - Between header and sidebar */}
      <div className="fixed left-0 top-20 w-64 h-8 z-20 bg-white border-b border-gray-200 flex items-center justify-center">
        <div className="text-blue-800 text-xs font-medium">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })} - {new Date().toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>
      
      {/* Sidebar - Below connection box */}
      <div className="fixed left-0 top-24 h-screen w-64 z-10">
        <Sidebar />
      </div>
    </div>
  );
}
