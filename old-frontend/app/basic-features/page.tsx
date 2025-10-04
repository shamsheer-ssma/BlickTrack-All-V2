export default async function BasicFeaturesPage() {
  // Fetch real data from your database
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
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Features from Database</h1>
      
      {/* Categories */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Categories ({categories.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => {
            const categoryFeatures = features.filter(f => f.categoryId === category.id);
            
            return (
              <div key={category.id} className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.displayName}</h3>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <div className="text-sm text-gray-500">
                  {categoryFeatures.length} features
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Features */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Features ({features.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const category = categories.find(c => c.id === feature.categoryId);
            
            return (
              <div key={feature.id} className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.displayName}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <div className="text-sm text-gray-500">
                  Category: {category?.displayName}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

