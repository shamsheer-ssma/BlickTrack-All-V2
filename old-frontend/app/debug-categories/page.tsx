import { getConnection } from '@/lib/database-direct';

async function getCategories() {
  try {
    const client = await getConnection();
    const result = await client.query('SELECT * FROM feature_categories ORDER BY "displayName"');
    await client.end();
    return result.rows;
  } catch (error) {
    console.error('Database error:', error);
    return [];
  }
}

export default async function DebugCategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Categories</h1>
      <p className="mb-4">Found {categories.length} categories</p>
      
      <div className="space-y-4">
        {categories.map((category) => (
          <div key={category.id} className="p-4 border rounded">
            <h3 className="font-bold">{category.displayName}</h3>
            <p className="text-sm text-gray-600">{category.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

