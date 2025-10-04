export default async function FeaturesCompleteWorkingPage() {
  // Fetch all data from your database using the same approach as working pages
  let categories = [];
  let features = [];
  let tenants = [];
  let subscriptionPlans = [];

  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    
    const [categoriesRes, featuresRes, tenantsRes, subscriptionPlansRes] = await Promise.all([
      fetch(`${baseUrl}/api/admin/feature-categories`, { cache: 'no-store' }),
      fetch(`${baseUrl}/api/admin/features`, { cache: 'no-store' }),
      fetch(`${baseUrl}/api/admin/tenants`, { cache: 'no-store' }),
      fetch(`${baseUrl}/api/admin/subscription-plans`, { cache: 'no-store' })
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

    if (tenantsRes.ok) {
      const tenantsData = await tenantsRes.json();
      if (tenantsData.success) {
        tenants = tenantsData.data;
      }
    }

    if (subscriptionPlansRes.ok) {
      const subscriptionPlansData = await subscriptionPlansRes.json();
      if (subscriptionPlansData.success) {
        subscriptionPlans = subscriptionPlansData.data;
      }
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Complete Features Data</h1>
          <p className="text-gray-600">All data from your database - categories, features, tenants, and plans</p>
          <div className="mt-2 text-sm text-gray-500">
            {categories.length} categories • {features.length} features • {tenants.length} tenants • {subscriptionPlans.length} plans
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Categories ({categories.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => {
              const categoryFeatures = features.filter(f => f.categoryId === category.id);
              
              return (
                <div key={category.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.displayName}</h3>
                  <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                  <div className="text-xs text-gray-500 mb-3">
                    ID: {category.id} • Active: {category.isActive ? 'Yes' : 'No'}
                  </div>
                  <div className="text-sm text-gray-700">
                    {categoryFeatures.length} features
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Features */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Features ({features.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature) => {
              const category = categories.find(c => c.id === feature.categoryId);
              
              return (
                <div key={feature.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.displayName}</h3>
                  <p className="text-sm text-gray-600 mb-3">{feature.description}</p>
                  <div className="text-xs text-gray-500 mb-3">
                    ID: {feature.id} • Category: {category?.displayName} • Active: {feature.isActive ? 'Yes' : 'No'}
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200">
                      View
                    </button>
                    <button className="px-3 py-1 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200">
                      Edit
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tenants */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Tenants ({tenants.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tenants.map((tenant) => (
              <div key={tenant.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{tenant.name}</h3>
                <div className="text-xs text-gray-500 mb-3">
                  ID: {tenant.id} • Active: {tenant.isActive ? 'Yes' : 'No'}
                </div>
                <div className="text-sm text-gray-700">
                  Users: {tenant.userCount || 0}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subscription Plans */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Subscription Plans ({subscriptionPlans.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subscriptionPlans.map((plan) => (
              <div key={plan.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{plan.displayName}</h3>
                <div className="text-sm text-gray-600 mb-3">{plan.description}</div>
                <div className="text-xs text-gray-500 mb-3">
                  ID: {plan.id} • Tier: {plan.tier} • Price: ${plan.price}/{plan.billingCycle}
                </div>
                <div className="text-sm text-gray-700">
                  Active: {plan.isActive ? 'Yes' : 'No'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-4">Database Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{categories.length}</div>
              <div className="text-sm text-blue-700">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{features.length}</div>
              <div className="text-sm text-blue-700">Features</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{tenants.length}</div>
              <div className="text-sm text-blue-700">Tenants</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{subscriptionPlans.length}</div>
              <div className="text-sm text-blue-700">Plans</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

