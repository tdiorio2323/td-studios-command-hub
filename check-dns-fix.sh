#!/bin/bash
echo "🔍 Checking DNS for tdstudioshq.com..."
echo "Current DNS:"
dig +short tdstudioshq.com
echo ""

CURRENT_IP=$(dig +short tdstudioshq.com | head -1)
if [[ "$CURRENT_IP" == "76.76.19."* ]]; then
    echo "✅ DNS is pointing to Vercel! Testing website..."
    curl -I https://tdstudioshq.com/dashboard
else
    echo "❌ Still pointing to Wix (185.230.63.x)"
    echo "💡 Update DNS records in your domain registrar"
fi
