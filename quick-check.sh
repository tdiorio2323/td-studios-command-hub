#!/bin/bash
echo "🔍 Quick DNS Status Check"
echo "=========================="
echo "Current tdstudioshq.com DNS:"
dig +short tdstudioshq.com | head -3

echo ""
echo "🧪 Testing Working URLs:"
echo "✅ www.tdstudioshq.com:"
curl -s -I https://www.tdstudioshq.com/dashboard | head -1

echo "✅ Vercel direct URL:"  
curl -s -I https://tdstudioshq.vercel.app/dashboard | head -1

echo ""
if dig +short tdstudioshq.com | grep -q "76.76.19"; then
    echo "🎉 SUCCESS! Main domain ready!"
    curl -s -I https://tdstudioshq.com/dashboard | head -1
else
    echo "⏳ Main domain still propagating..."
fi
