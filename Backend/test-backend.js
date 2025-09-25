// Simple test script to verify backend is working
const http = require('http');

console.log('🔍 Testing GreenCart Backend...\n');

// Test main endpoint
const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`✅ Main endpoint status: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const result = JSON.parse(data);
      console.log('📋 API Response:');
      console.log(JSON.stringify(result, null, 2));
      console.log('\n🎉 Backend is working correctly!');
      console.log('📍 Available endpoints:');
      Object.entries(result.endpoints || {}).forEach(([key, value]) => {
        console.log(`   - ${key}: http://localhost:5000${value}`);
      });
    } catch (e) {
      console.log('📝 Raw Response:', data);
    }
  });
});

req.on('error', (e) => {
  console.error(`❌ Error: ${e.message}`);
  console.log('💡 Make sure the backend server is running with: npm start');
});

req.end();