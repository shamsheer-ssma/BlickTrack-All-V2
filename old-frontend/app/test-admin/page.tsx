'use client';

export default function TestAdminPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Test Admin Page</h1>
      <p className="text-gray-600">This is a simple test page to check if the admin components work.</p>
      
      <div className="mt-8 p-4 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">Component Test</h2>
        <p>If you can see this page, the basic routing is working.</p>
      </div>
    </div>
  );
}

