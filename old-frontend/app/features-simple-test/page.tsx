'use client';

import { useState, useEffect } from 'react';

export default function FeaturesSimpleTestPage() {
  const [categories, setCategories] = useState([]);
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, featuresRes] = await Promise.all([
          fetch('/api/admin/feature-categories'),
          fetch('/api/admin/features')
        ]);

        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          if (categoriesData.success) {
            setCategories(categoriesData.data);
          }
        }

        if (featuresRes.ok) {
          const featuresData = await featuresRes.json();
          if (featuresData.success) {
            setFeatures(featuresData.data);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Features Simple Test</h1>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Categories ({categories.length})</h2>
        {categories.map((category) => (
          <div key={category.id} className="border p-4 mb-4 rounded">
            <h3 className="text-xl font-semibold">{category.displayName}</h3>
            <p className="text-gray-600">{category.description}</p>
            <p className="text-sm text-gray-500">ID: {category.id}</p>
          </div>
        ))}
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Features ({features.length})</h2>
        {features.map((feature) => (
          <div key={feature.id} className="border p-4 mb-4 rounded">
            <h3 className="text-xl font-semibold">{feature.displayName}</h3>
            <p className="text-gray-600">{feature.description}</p>
            <p className="text-sm text-gray-500">ID: {feature.id}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

