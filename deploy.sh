#!/bin/bash

# TD Studios Portal Deployment Script

echo "🚀 Starting TD Studios Portal Deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building the project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed!"
    exit 1
fi

# Deploy based on platform choice
echo "🌐 Choose deployment platform:"
echo "1) Vercel (Recommended)"
echo "2) Netlify"
echo "3) Custom Server"

read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        echo "🚀 Deploying to Vercel..."
        if command -v vercel &> /dev/null; then
            vercel --prod
        else
            echo "Installing Vercel CLI..."
            npm install -g vercel
            vercel --prod
        fi
        ;;
    2)
        echo "🚀 Deploying to Netlify..."
        if command -v netlify &> /dev/null; then
            netlify deploy --prod
        else
            echo "Installing Netlify CLI..."
            npm install -g netlify-cli
            netlify deploy --prod
        fi
        ;;
    3)
        echo "📋 Custom deployment selected."
        echo "Please manually deploy the .next folder to your server."
        echo "Make sure to set up environment variables from .env.example"
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo "🎉 Deployment process completed!"
echo "📝 Don't forget to:"
echo "   1. Configure your custom domain in your hosting platform"
echo "   2. Set up environment variables"
echo "   3. Update DNS records for your domain"
echo "   4. Test the deployment"

echo "🌟 Your TD Studios Portal should be live soon!"