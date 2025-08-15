# TD Studios Command Hub - Production Environment Variables Setup

## Required Environment Variables for Vercel Production

### Core Application
```bash
# Site Configuration
vercel env add NEXT_PUBLIC_SITE_URL production
# Value: https://td-studios-command-nd96kpo1b-td-studioss-projects.vercel.app
# (or your custom domain when configured)

vercel env add NEXT_PUBLIC_APP_URL production  
# Value: https://td-studios-command-nd96kpo1b-td-studioss-projects.vercel.app

# Database - Supabase
vercel env add NEXT_PUBLIC_SUPABASE_URL production
# Value: Your actual Supabase project URL

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# Value: Your Supabase anon public key

vercel env add SUPABASE_SERVICE_ROLE_KEY production
# Value: Your Supabase service role key (secret)
```

### AI Integration
```bash
# Claude API
vercel env add ANTHROPIC_API_KEY production
# Value: Your Anthropic Claude API key (sk-ant-api03-...)

# OpenAI API
vercel env add OPENAI_API_KEY production
# Value: Your OpenAI API key (sk-proj-...)
```

### Payment Processing - Stripe
```bash
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY production
# Value: Your Stripe publishable key (pk_live_...)

vercel env add STRIPE_SECRET_KEY production
# Value: Your Stripe secret key (sk_live_...)

vercel env add STRIPE_WEBHOOK_ENDPOINT_SECRET production
# Value: Your Stripe webhook endpoint secret (whsec_...)

# Stripe Price IDs
vercel env add STRIPE_PRICE_STARTER production
# Value: price_xxxxx (your Starter plan price ID)

vercel env add STRIPE_PRICE_PROFESSIONAL production
# Value: price_xxxxx (your Professional plan price ID)

vercel env add STRIPE_PRICE_ENTERPRISE production
# Value: price_xxxxx (your Enterprise plan price ID)

vercel env add STRIPE_PRICE_CUSTOM production
# Value: price_xxxxx (your Custom plan price ID)
```

### Email Service
```bash
vercel env add RESEND_API_KEY production
# Value: Your Resend API key (re_...)
```

### Optional Integrations
```bash
# Redis (for caching and rate limiting)
vercel env add REDIS_URL production
# Value: Your Redis connection URL

vercel env add UPSTASH_REDIS_REST_URL production
# Value: Your Upstash Redis REST URL (if using Upstash)

# Notion Integration
vercel env add NOTION_API_KEY production
# Value: Your Notion integration secret

# Airtable Integration  
vercel env add AIRTABLE_API_KEY production
# Value: Your Airtable API key

# Communication
vercel env add TELEGRAM_BOT_TOKEN production
# Value: Your Telegram bot token

vercel env add SLACK_BOT_TOKEN production
# Value: Your Slack bot token

vercel env add GMAIL_ACCESS_TOKEN production
# Value: Your Gmail API access token

# GitHub Integration
vercel env add GITHUB_TOKEN production
# Value: Your GitHub personal access token

# Security
vercel env add MASTER_ENCRYPTION_KEY production
# Value: A strong 32-character encryption key for sensitive data

# Database (if using external)
vercel env add DATABASE_URL production
# Value: Your database connection string (if not using Supabase)
```

## Setup Instructions

### Method 1: Using Vercel CLI (Recommended)
1. Run each command above and enter the corresponding value when prompted
2. Each variable will be automatically deployed with your next deployment

### Method 2: Using Vercel Dashboard
1. Go to https://vercel.com/td-studioss-projects/td-studios-command-hub/settings/environment-variables
2. Add each environment variable manually
3. Set the environment to "Production"
4. Click "Save"

### Method 3: Bulk Import
1. Create a `.env.production` file locally with all values
2. Run: `vercel env pull .env.production --environment=production`
3. Upload: `vercel env add --from-file=.env.production --environment=production`

## Priority Order (Set these first)

### Critical (App won't work without these):
1. NEXT_PUBLIC_SITE_URL
2. NEXT_PUBLIC_SUPABASE_URL  
3. NEXT_PUBLIC_SUPABASE_ANON_KEY
4. SUPABASE_SERVICE_ROLE_KEY
5. ANTHROPIC_API_KEY (for AI features)
6. OPENAI_API_KEY (for AI fallback)

### Important (Major features):
7. NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
8. STRIPE_SECRET_KEY
9. RESEND_API_KEY (for emails)
10. All STRIPE_PRICE_* variables

### Optional (Enhanced features):
- REDIS_URL / UPSTASH_REDIS_REST_URL
- Integration APIs (Notion, Airtable, etc.)
- Communication tokens (Telegram, Slack, Gmail)
- GITHUB_TOKEN
- MASTER_ENCRYPTION_KEY

## Security Notes
- Never commit actual API keys to git
- Use strong, unique keys for production
- Regularly rotate sensitive keys
- Monitor API usage and costs
- Set up billing alerts for AI APIs

## Verification
After setting up environment variables:
1. Redeploy the application: `vercel --prod`
2. Check the deployment logs for any missing variable warnings
3. Test critical functionality (login, AI features, payments)
4. Monitor error logs in Vercel dashboard

## Custom Domain Setup
Once environment variables are configured:
1. Add your custom domain in Vercel dashboard
2. Update NEXT_PUBLIC_SITE_URL to your custom domain
3. Update Stripe webhook URLs to point to new domain
4. Update any OAuth redirect URLs