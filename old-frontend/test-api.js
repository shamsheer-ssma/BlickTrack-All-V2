// Simple test script to verify API endpoints
const testAPI = async () => {
  try {
    console.log('🧪 Testing Feature Categories API...');
    
    // Test GET
    const getResponse = await fetch('http://localhost:3000/api/admin/feature-categories');
    const getData = await getResponse.json();
    console.log('✅ GET Response:', getData);
    
    // Test POST
    const testCategory = {
      name: 'test-category-' + Date.now(),
      displayName: 'Test Category',
      description: 'A test category',
      icon: 'Shield',
      color: '#FF6B6B'
    };
    
    console.log('🧪 Testing POST with data:', testCategory);
    const postResponse = await fetch('http://localhost:3000/api/admin/feature-categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testCategory),
    });
    
    const postData = await postResponse.json();
    console.log('✅ POST Response:', postData);
    
    if (postData.success && postData.data) {
      const categoryId = postData.data.id;
      console.log('🧪 Testing DELETE with ID:', categoryId);
      
      const deleteResponse = await fetch(`http://localhost:3000/api/admin/feature-categories/${categoryId}`, {
        method: 'DELETE',
      });
      
      const deleteData = await deleteResponse.json();
      console.log('✅ DELETE Response:', deleteData);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

testAPI();

