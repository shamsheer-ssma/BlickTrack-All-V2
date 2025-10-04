export default function NoBordersPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">No Borders Feature Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Security Category */}
        <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center text-white text-lg">
              🛡️
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">Security</h3>
              <p className="text-sm text-gray-500">Security-focused features</p>
            </div>
          </div>
        </div>

        {/* Compliance Category */}
        <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center text-white text-lg">
              ✅
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">Compliance</h3>
              <p className="text-sm text-gray-500">Compliance and regulatory features</p>
            </div>
          </div>
        </div>

        {/* Analytics Category */}
        <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center text-white text-lg">
              📊
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">Analytics</h3>
              <p className="text-sm text-gray-500">Analytics and reporting features</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Features</h2>
        <div className="space-y-3">
          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-lg mb-2">Threat Modeling</h3>
                <p className="text-gray-600 mb-3">Comprehensive threat modeling capabilities</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>Type: feature</span>
                  <span>Level: 1</span>
                  <span>Visibility: Visible</span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  ✓ Active
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-lg mb-2">Compliance Management</h3>
                <p className="text-gray-600 mb-3">Comprehensive compliance management tools</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>Type: feature</span>
                  <span>Level: 1</span>
                  <span>Visibility: Visible</span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  ✓ Active
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                  ⭐ Premium
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-lg mb-2">Analytics & Reporting</h3>
                <p className="text-gray-600 mb-3">Advanced analytics and reporting capabilities</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>Type: feature</span>
                  <span>Level: 1</span>
                  <span>Visibility: Visible</span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  ✓ Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

