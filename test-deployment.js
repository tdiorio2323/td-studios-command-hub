#!/usr/bin/env node

const https = require('https');

console.log('Testing TD Studios deployment...\n');

// Test 1: Home page
https.get('https://td-studios.vercel.app', (res) => {
  console.log(`1. Home page: ${res.statusCode} ${res.statusMessage}`);
}).on('error', (e) => {
  console.error(`1. Home page error: ${e.message}`);
});

// Test 2: Login page
https.get('https://td-studios.vercel.app/login', (res) => {
  console.log(`2. Login page: ${res.statusCode} ${res.statusMessage}`);
}).on('error', (e) => {
  console.error(`2. Login page error: ${e.message}`);
});

// Test 3: Dashboard (should redirect to login)
https.get('https://td-studios.vercel.app/dashboard', (res) => {
  console.log(`3. Dashboard: ${res.statusCode} ${res.statusMessage}`);
}).on('error', (e) => {
  console.error(`3. Dashboard error: ${e.message}`);
});

// Test 4: AI Chat API GET
https.get('https://td-studios.vercel.app/api/ai/chat', (res) => {
  console.log(`4. AI Chat API (GET): ${res.statusCode} ${res.statusMessage}`);

  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    if (res.statusCode === 200) {
      console.log('   Response:', data.substring(0, 100) + '...');
    }
  });
}).on('error', (e) => {
  console.error(`4. AI Chat API error: ${e.message}`);
});

// Test 5: AI Chat API POST
setTimeout(() => {
  const postData = JSON.stringify({
    messages: [{ role: 'user', content: 'Test message' }],
    model: 'claude'
  });

  const options = {
    hostname: 'td-studios.vercel.app',
    port: 443,
    path: '/api/ai/chat',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': postData.length
    }
  };

  const req = https.request(options, (res) => {
    console.log(`5. AI Chat API (POST): ${res.statusCode} ${res.statusMessage}`);

    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      if (data) {
        try {
          const parsed = JSON.parse(data);
          console.log('   Response:', JSON.stringify(parsed, null, 2).substring(0, 200) + '...');
        } catch (e) {
          console.log('   Raw response:', data.substring(0, 100) + '...');
        }
      }
    });
  });

  req.on('error', (e) => {
    console.error(`5. AI Chat API POST error: ${e.message}`);
  });

  req.write(postData);
  req.end();
}, 1000);

console.log('\nNote: If API routes return 404/405, check Vercel build logs for compilation errors.');
console.log('Visit: https://vercel.com/td-studios-projects/td-studios/deployments\n');
