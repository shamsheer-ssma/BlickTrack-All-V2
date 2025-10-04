export default async function FeaturesDataPage() {
  // Fetch data from your database
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
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">All Features Data from Database</h1>
      
      {/* Categories */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Categories ({categories.length})</h2>
        <div className="space-y-4">
          {categories.map((category) => {
            const categoryFeatures = features.filter(f => f.categoryId === category.id);
            
            return (
              <div key={category.id} className="border border-gray-300 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.displayName}</h3>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <div className="text-sm text-gray-500 mb-4">
                  ID: {category.id} • Active: {category.isActive ? 'Yes' : 'No'} • 
                  Created: {new Date(category.createdAt).toLocaleDateString()}
                </div>
                <div className="text-lg font-medium text-gray-700">
                  {categoryFeatures.length} features in this category
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Features */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Features ({features.length})</h2>
        <div className="space-y-4">
          {features.map((feature) => {
            const category = categories.find(c => c.id === feature.categoryId);
            
            return (
              <div key={feature.id} className="border border-gray-300 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.displayName}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <div className="text-sm text-gray-500 mb-4">
                  ID: {feature.id} • Category: {category?.displayName} • 
                  Active: {feature.isActive ? 'Yes' : 'No'} • 
                  Created: {new Date(feature.createdAt).toLocaleDateString()}
                </div>
                <div className="flex space-x-2">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    View Details
                  </button>
                  <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                    Configure
                  </button>
                  <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
                    Manage Access
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gray-100 border border-gray-300 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Database Summary</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-3xl font-bold text-blue-600">{categories.length}</div>
            <div className="text-gray-700">Categories</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600">{features.length}</div>
            <div className="text-gray-700">Features</div>
          </div>
        </div>
      </div>
    </div>
  );
}

