# 🚀 TD Studios Command Hub - Vercel Deployment Guide

## 📋 Pre-Deployment Checklist

### ✅ Environment Variables for Vercel
Copy these to your Vercel dashboard:

```bash
# AI Services (REQUIRED)
ANTHROPIC_API_KEY=your_anthropic_api_key_here
OPENAI_API_KEY=your_openai_api_key_here

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Authentication
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=https://tdstudioshq.com

# Domain Configuration
NEXT_PUBLIC_APP_URL=https://tdstudioshq.com
NEXT_PUBLIC_WIX_REDIRECT=true

# Security Settings
WIX_PASSWORD_PRIMARY=tdstudios2024
WIX_PASSWORD_ENTERPRISE=commandhub
ENABLE_REFERRER_CHECK=true

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=your_google_analytics_id

# Stripe (Future monetization)
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

## 🚀 Deployment Commands

```bash
# 1. Prepare for deployment
cd /Users/tylerdiorio/td-studios
npm run build

# 2. Test production build locally
npm run start

# 3. Deploy to Vercel
npx vercel --prod

# 4. Set custom domain in Vercel dashboard
# Domain: tdstudioshq.com
# Point to your Vercel deployment URL
```

## 🔗 Domain Configuration

### Vercel Dashboard Settings:
1. **Project Settings** → **Domains**
2. **Add Domain**: `tdstudioshq.com`
3. **DNS Setup**: Point to Vercel's servers
4. **SSL**: Automatic (Vercel handles this)

### Wix Integration:
- Keep Wix as landing/marketing page
- Redirect authenticated users to Vercel-hosted app
- Maintain professional branding consistency

## ⚡ Production Optimizations

```json
// next.config.js updates for production
{
  "experimental": {
    "serverComponentsExternalPackages": ["@anthropic-ai/sdk", "openai"]
  },
  "env": {
    "CUSTOM_KEY": "value"
  }
}
```

## 🧪 Testing Production Deployment

```bash
# Test all API endpoints after deployment
curl https://tdstudioshq.com/api/ai/health
curl https://tdstudioshq.com/api/ai/chat -X POST -H "Content-Type: application/json" -d '{"messages":[{"role":"user","content":"test"}]}'
```

## 📊 Monitoring & Analytics

- **Vercel Analytics**: Built-in performance monitoring
- **API Usage**: Track Claude/OpenAI API calls
- **Error Tracking**: Monitor for production issues
- **Performance**: Response times and optimization opportunities

## 🎯 Go-Live Checklist

- [ ] All environment variables set in Vercel
- [ ] Domain pointing to Vercel deployment
- [ ] SSL certificate active
- [ ] API endpoints responding correctly
- [ ] Authentication working
- [ ] Analytics tracking enabled
- [ ] Error monitoring configured
- [ ] Performance optimized