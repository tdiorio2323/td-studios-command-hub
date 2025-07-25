#!/usr/bin/env node

/**
 * TD Studios API Integration Test Suite
 * Tests all API endpoints to ensure they're working correctly
 */

const BASE_URL = 'http://localhost:3000'

// Test utilities
async function makeRequest(endpoint, method = 'GET', body = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      }
    }
    
    if (body) {
      options.body = JSON.stringify(body)
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, options)
    const data = await response.json()
    
    return {
      success: response.ok,
      status: response.status,
      data
    }
  } catch (error) {
    return {
      success: false,
      status: 0,
      error: error.message
    }
  }
}

// Test cases
const tests = [
  {
    name: 'AI Chat Health Check',
    endpoint: '/api/ai/chat',
    method: 'GET'
  },
  {
    name: 'AI Chat with Claude',
    endpoint: '/api/ai/chat',
    method: 'POST',
    body: {
      messages: [{ role: 'user', content: 'Hello, this is a test' }],
      model: 'claude'
    }
  },
  {
    name: 'Task Prioritization',
    endpoint: '/api/ai/tasks/prioritize',
    method: 'POST',
    body: {
      tasks: [
        'Review project documentation',
        'Fix critical bug in payment system',
        'Schedule team meeting',
        'Update social media content'
      ],
      context: 'Software development project'
    }
  },
  {
    name: 'Content Generation',
    endpoint: '/api/ai/content/generate',
    method: 'POST',
    body: {
      prompts: ['Write a brief introduction about AI in business'],
      type: 'blog',
      count: 1
    }
  },
  {
    name: 'AI Workflows Info',
    endpoint: '/api/ai/workflows',
    method: 'GET'
  },
  {
    name: 'Analytics Dashboard',
    endpoint: '/api/analytics',
    method: 'GET'
  },
  {
    name: 'AI Engine Health Check',
    endpoint: '/api/ai/health',
    method: 'GET'
  }
]

// Run tests
async function runTests() {
  console.log('🚀 TD Studios API Integration Test Suite')
  console.log('========================================\n')
  
  let passed = 0
  let failed = 0
  
  for (const test of tests) {
    console.log(`Testing: ${test.name}`)
    
    const result = await makeRequest(test.endpoint, test.method, test.body)
    
    if (result.success) {
      console.log(`✅ PASS - Status: ${result.status}`)
      if (result.data?.data) {
        console.log(`   Response: ${JSON.stringify(result.data.data).substring(0, 100)}...`)
      }
      passed++
    } else {
      console.log(`❌ FAIL - Status: ${result.status}`)
      console.log(`   Error: ${result.error || JSON.stringify(result.data)}`)
      failed++
    }
    
    console.log('')
  }
  
  console.log('========================================')
  console.log(`📊 Test Results: ${passed} passed, ${failed} failed`)
  
  if (failed === 0) {
    console.log('🎉 All APIs are working correctly!')
  } else {
    console.log('⚠️  Some APIs need attention.')
  }
}

// Check if server is running first
async function checkServer() {
  try {
    const response = await fetch(`${BASE_URL}/api/ai/health`)
    return response.ok
  } catch {
    return false
  }
}

// Main execution
async function main() {
  console.log('Checking if TD Studios server is running...')
  
  const serverRunning = await checkServer()
  
  if (!serverRunning) {
    console.log('❌ Server is not running. Please start with: npm run dev')
    process.exit(1)
  }
  
  console.log('✅ Server is running. Starting tests...\n')
  await runTests()
}

main().catch(console.error)