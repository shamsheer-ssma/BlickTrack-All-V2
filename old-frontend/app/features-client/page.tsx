'use client';

import { useState, useEffect } from 'react';

export default function FeaturesClientPage() {
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

        const categoriesData = await categoriesRes.json();
        const featuresData = await featuresRes.json();

        if (categoriesData.success) {
          setCategories(categoriesData.data);
        }
        if (featuresData.success) {
          setFeatures(featuresData.data);
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
      <h1 className="text-3xl font-bold mb-8">All Features Data</h1>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Categories ({categories.length})</h2>
        {categories.map((category) => {
          const categoryFeatures = features.filter(f => f.categoryId === category.id);
          
          return (
            <div key={category.id} className="border p-4 mb-4 rounded">
              <h3 className="text-xl font-semibold">{category.displayName}</h3>
              <p className="text-gray-600 mb-2">{category.description}</p>
              <p className="text-sm text-gray-500">ID: {category.id} • Active: {category.isActive ? 'Yes' : 'No'}</p>
              <p className="text-lg font-medium">{categoryFeatures.length} features</p>
            </div>
          );
        })}
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Features ({features.length})</h2>
        {features.map((feature) => {
          const category = categories.find(c => c.id === feature.categoryId);
          
          return (
            <div key={feature.id} className="border p-4 mb-4 rounded">
              <h3 className="text-xl font-semibold">{feature.displayName}</h3>
              <p className="text-gray-600 mb-2">{feature.description}</p>
              <p className="text-sm text-gray-500">ID: {feature.id} • Category: {category?.displayName} • Active: {feature.isActive ? 'Yes' : 'No'}</p>
              <div className="mt-2">
                <button className="px-4 py-2 bg-blue-600 text-white rounded mr-2">View</button>
                <button className="px-4 py-2 bg-green-600 text-white rounded mr-2">Edit</button>
                <button className="px-4 py-2 bg-purple-600 text-white rounded">Manage</button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-gray-100 p-4 rounded">
        <h3 className="text-xl font-semibold mb-2">Summary</h3>
        <p>{categories.length} categories • {features.length} features</p>
      </div>
    </div>
  );
}

