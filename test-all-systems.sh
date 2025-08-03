#!/bin/bash

echo "🧪 TESTING TD STUDIOS ULTIMATE - ALL SYSTEMS"
echo "============================================="

echo ""
echo "🗄️  Testing Database Connection..."
curl -s -X GET http://localhost:3000/api/database/test | jq .

echo ""
echo "🤖 Testing AI Systems..."
curl -s -X GET http://localhost:3000/api/ai/health | jq .

echo ""
echo "🔗 Testing All Integrations..."
curl -s -X GET http://localhost:3000/api/integrations/test | jq .

echo ""
echo "💬 Testing Message Systems..."
curl -s -X GET http://localhost:3000/api/messages/test | jq .

echo ""
echo "🔐 Testing Auth Session..."
curl -s -X GET http://localhost:3000/api/auth/session | jq .

echo ""
echo "👥 Testing Affiliate System..."
curl -s -X POST http://localhost:3000/api/admin/create-affiliate-invite \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Creator","email":"test@example.com","instagram":"@testcreator"}' | jq .

echo ""
echo "📊 Testing Platform Stats..."
curl -s -X POST http://localhost:3000/api/database/test \
  -H "Content-Type: application/json" \
  -d '{"query":"platform_stats"}' | jq .

echo ""
echo "✅ ALL SYSTEMS TESTED!"
echo "============================================="
