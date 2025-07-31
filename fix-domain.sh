#!/bin/bash
echo "🔄 Monitoring tdstudioshq.com DNS fix..."
echo "Target IP: 216.198.79.1 (Vercel)"
echo "Press Ctrl+C to stop"
echo ""

while true; do
    CURRENT_IP=$(dig +short tdstudioshq.com | head -1)
    echo "$(date '+%H:%M:%S'): $CURRENT_IP"
    
    if [[ "$CURRENT_IP" == "216.198.79.1" ]]; then
        echo "🎉 SUCCESS! DNS now points to Vercel!"
        echo "Testing tdstudioshq.com..."
        sleep 5
        curl -s -I https://tdstudioshq.com/dashboard | head -2
        break
    elif [[ "$CURRENT_IP" == "185.230"* ]]; then
        echo "❌ Still Wix - Change DNS to 216.198.79.1"
    else
        echo "⏳ DNS updating..."
    fi
    
    echo "---"
    sleep 30
done
