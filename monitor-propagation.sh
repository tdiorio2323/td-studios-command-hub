#!/bin/bash
echo "🔍 Monitoring DNS propagation for tdstudioshq.com"
echo "Looking for Vercel IPs (76.76.19.x)..."
echo "Press Ctrl+C to stop"
echo ""

while true; do
    echo "$(date '+%H:%M:%S'): Checking DNS..."
    IPS=$(dig +short tdstudioshq.com)
    echo "$IPS"
    
    if echo "$IPS" | grep -q "76.76.19"; then
        echo "🎉 SUCCESS! DNS now points to Vercel!"
        echo "Testing website..."
        curl -I https://tdstudioshq.com/dashboard 2>/dev/null | head -3
        break
    else
        echo "⏳ Still propagating..."
    fi
    
    echo "---"
    sleep 60
done
