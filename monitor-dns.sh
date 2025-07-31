#!/bin/bash
echo "🔍 Monitoring DNS changes for tdstudiosny.com..."
echo "Press Ctrl+C to stop"
echo ""

while true; do
    echo "$(date): Checking DNS..."
    dig +short tdstudiosny.com
    echo "---"
    sleep 30
done
