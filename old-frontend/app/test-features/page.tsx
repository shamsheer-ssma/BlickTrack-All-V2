'use client';

export default function TestFeaturesPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Test Features Page</h1>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">API Test</h2>
        <button 
          onClick={async () => {
            try {
              console.log('Testing features API...');
              const response = await fetch('/api/admin/features');
              const data = await response.json();
              console.log('Features API response:', data);
              alert(`Features API: ${data.success ? 'SUCCESS' : 'FAILED'} - ${data.data?.length || 0} features`);
            } catch (error) {
              console.error('Features API error:', error);
              alert(`Features API ERROR: ${error.message}`);
            }
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Test Features API
        </button>
      </div>
    </div>
  );
}

