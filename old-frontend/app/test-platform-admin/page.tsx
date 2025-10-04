export default function TestPlatformAdmin() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Test Platform Admin</h1>
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <p className="text-gray-600 mb-4">This is a simple test page to verify the platform admin route works.</p>
          <div className="space-y-4">
            <a 
              href="/clean-features"
              className="block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Clean Features
            </a>
            <a 
              href="/simple-features"
              className="block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Go to Simple Features
            </a>
            <a 
              href="/feature-comparison"
              className="block px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Go to Feature Comparison
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

