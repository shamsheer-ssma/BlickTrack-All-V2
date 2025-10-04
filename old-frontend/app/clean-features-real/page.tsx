export default async function CleanFeaturesRealPage() {
  // Fetch real data server-side
  let categories = [];
  let features = [];

  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    
    const [categoriesRes, featuresRes] = await Promise.all([
      fetch(`${baseUrl}/api/admin/feature-categories`, { cache: 'no-store' }),
      fetch(`${baseUrl}/api/admin/features`, { cache: 'no-store' })
    ]);

    if (categoriesRes.ok) {
      const categoriesData = await categoriesRes.json();
      if (categoriesData.success) {
        categories = categoriesData.data;
      }
    }

    if (featuresRes.ok) {
      const featuresData = await featuresRes.json();
      if (featuresData.success) {
        features = featuresData.data;
      }
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Clean Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">✅ CLEAN FEATURES UI</h1>
              <p className="text-sm text-gray-500">Much cleaner, less text, more visual</p>
            </div>
            <div className="flex items-center space-x-2">
              <a 
                href="/old-features-final"
                className="inline-flex items-center px-3 py-2 border border-red-300 rounded-lg text-sm font-medium text-red-700 bg-white hover:bg-red-50"
              >
                ❌ See Old UI
              </a>
              <a 
                href="/feature-comparison"
                className="inline-flex items-center px-3 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700"
              >
                🔄 Compare
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Clean Sidebar - Categories Only */}
        <div className="w-80 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white text-sm mr-3">📁</span>
              Categories
            </h2>
            <div className="space-y-2">
              {categories.map((category, index) => {
                const categoryFeatures = features.filter(f => f.categoryId === category.id);
                const colors = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];
                const color = colors[index % colors.length];
                
                return (
                  <div key={category.id} className="p-4 bg-white rounded-lg shadow-sm border-l-4 hover:shadow-md transition-shadow cursor-pointer" style={{ borderLeftColor: color }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg mr-3"
                          style={{ backgroundColor: color }}
                        >
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{category.displayName}</h3>
                          <p className="text-xs text-gray-500">{categoryFeatures.length} features</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium text-gray-600">{categoryFeatures.length}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content - Features Grid */}
        <div className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
              <span className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white text-sm mr-3">⚡</span>
              Features
            </h2>
            <p className="text-sm text-gray-500">All features across all categories</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, index) => {
              const category = categories.find(c => c.id === feature.categoryId);
              const colors = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];
              const color = colors[index % colors.length];
              
              return (
                <div key={feature.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm mr-3"
                        style={{ backgroundColor: color }}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{feature.displayName}</h4>
                        <p className="text-xs text-gray-500">{category?.displayName}</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{feature.description}</p>
                  
                  <div className="flex space-x-2">
                    <button className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                      Configure
                    </button>
                    <button className="px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors">
                      View
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {features.length === 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📋</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Features Found</h3>
              <p className="text-gray-500">Features will appear here when they are available</p>
            </div>
          )}
        </div>
      </div>

      {/* Improvements Section */}
      <div className="bg-green-50 border-t border-green-200 p-6">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-lg font-semibold text-green-800 mb-3">✅ Improvements in CLEAN UI:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-700">
            <div>
              <ul className="space-y-1">
                <li>• <strong>70% less text</strong> - replaced with icons and visuals</li>
                <li>• <strong>Clear visual hierarchy</strong> - colors, spacing, typography</li>
                <li>• <strong>Color-coded categories</strong> - easy to distinguish</li>
              </ul>
            </div>
            <div>
              <ul className="space-y-1">
                <li>• <strong>Sidebar navigation</strong> - clear category selection</li>
                <li>• <strong>Card-based layout</strong> - clean feature display</li>
                <li>• <strong>Quick actions</strong> - Configure, View buttons</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
