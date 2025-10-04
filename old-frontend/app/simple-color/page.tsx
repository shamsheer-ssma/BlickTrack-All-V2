export default function SimpleColorPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Simple Color-Coded Features</h1>
      
      {/* Legend */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Visual Legend</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-600 rounded"></div>
            <span>Categories</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-600 rounded-full"></div>
            <span>Regular Features</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-600 rounded-full"></div>
            <span>Premium Features</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-purple-600 rounded-full"></div>
            <span>License Required</span>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-500">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center text-white text-lg">
              🛡️
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Security</h3>
              <p className="text-sm text-gray-600">Security features</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
              <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
              <span className="text-sm">Threat Modeling</span>
            </div>
            <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
              <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
              <span className="text-sm">Basic Threat Modeling</span>
            </div>
            <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
              <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
              <span className="text-sm">AI Enhanced Threat Modeling</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white text-lg">
              ⚖️
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Compliance</h3>
              <p className="text-sm text-gray-600">Compliance features</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
              <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
              <span className="text-sm">Compliance Management</span>
              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">License</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white text-lg">
              📈
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Analytics</h3>
              <p className="text-sm text-gray-600">Analytics features</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
              <div className="w-3 h-3 bg-cyan-600 rounded-full"></div>
              <span className="text-sm">Analytics Dashboard</span>
              <span className="text-xs bg-cyan-100 text-cyan-800 px-2 py-1 rounded-full">Add-on</span>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Details */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Feature Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Visual Distinctions</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• <strong>Categories:</strong> Square icons with colored left border</li>
              <li>• <strong>Regular Features:</strong> Gray circles</li>
              <li>• <strong>Premium Features:</strong> Yellow circles with crown icon</li>
              <li>• <strong>License Required:</strong> Purple circles with lock icon</li>
              <li>• <strong>Add-ons:</strong> Cyan circles with plus icon</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Color Coding</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• <strong>Security:</strong> Red color scheme</li>
              <li>• <strong>Compliance:</strong> Blue color scheme</li>
              <li>• <strong>Analytics:</strong> Green color scheme</li>
              <li>• <strong>Integrations:</strong> Amber color scheme</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

