#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

console.log(`
🚀 TD Studios Integration Setup Guide
====================================

This script will help you set up all your API integrations for seamless access.
You'll never need to log in manually again once these are configured!

`)

const integrations = [
  {
    name: '🤖 OpenAI (ChatGPT)',
    envVar: 'OPENAI_API_KEY',
    description: 'GPT models and ChatGPT API access',
    getSteps: [
      '1. Go to: https://platform.openai.com/api-keys',
      '2. Click "Create new secret key"',
      '3. Copy the key (starts with "sk-")',
      '4. Paste it when prompted below'
    ]
  },
  {
    name: '🧠 Anthropic (Claude)',
    envVar: 'ANTHROPIC_API_KEY',
    description: 'Claude AI models and API access',
    getSteps: [
      '1. Go to: https://console.anthropic.com/',
      '2. Navigate to "API Keys"',
      '3. Generate a new API key',
      '4. Copy the key and paste below'
    ]
  },
  {
    name: '📧 Gmail (Email Management)',
    envVar: 'GMAIL_ACCESS_TOKEN',
    description: 'Read and send emails directly from dashboard',
    getSteps: [
      '1. Go to: https://console.cloud.google.com/',
      '2. Enable Gmail API for your project',
      '3. Create OAuth 2.0 credentials',
      '4. Use OAuth Playground: https://developers.google.com/oauthplayground/',
      '5. Get access token with Gmail scopes',
      '6. Also get GMAIL_REFRESH_TOKEN, GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET'
    ]
  },
  {
    name: '💬 Telegram (Bot Messaging)',
    envVar: 'TELEGRAM_BOT_TOKEN',
    description: 'Send and receive Telegram messages via bot',
    getSteps: [
      '1. Open Telegram and message @BotFather',
      '2. Send /newbot command',
      '3. Choose bot name and username',
      '4. Copy the bot token provided',
      '5. Send a message to your bot',
      '6. Get chat ID from: https://api.telegram.org/bot<TOKEN>/getUpdates'
    ]
  },
  {
    name: '📝 Notion',
    envVar: 'NOTION_API_KEY',
    description: 'Workspace integration and database access',
    getSteps: [
      '1. Go to: https://www.notion.so/my-integrations',
      '2. Click "Create new integration"',
      '3. Copy the "Internal Integration Token"',
      '4. Share your databases with this integration',
      '5. Paste the token below'
    ]
  },
  {
    name: '📊 Airtable',
    envVar: 'AIRTABLE_API_KEY',
    description: 'Base and record management',
    getSteps: [
      '1. Go to: https://airtable.com/create/tokens',
      '2. Create a personal access token',
      '3. Select scopes: data.records:read, data.records:write',
      '4. Copy the token and paste below'
    ]
  },
  {
    name: '💬 Slack',
    envVar: 'SLACK_BOT_TOKEN',
    description: 'Team communication and notifications',
    getSteps: [
      '1. Go to: https://api.slack.com/apps',
      '2. Create a new app or select existing',
      '3. Go to "OAuth & Permissions"',
      '4. Add scopes: chat:write, users:read',
      '5. Install app to workspace',
      '6. Copy "Bot User OAuth Token" (starts with "xoxb-")'
    ]
  },
  {
    name: '🐙 GitHub',
    envVar: 'GITHUB_TOKEN',
    description: 'Repository management and code tracking',
    getSteps: [
      '1. Go to: https://github.com/settings/tokens',
      '2. Generate new token (classic)',
      '3. Select scopes: repo, user, admin:org',
      '4. Copy the token and paste below'
    ]
  },
  {
    name: '💳 Stripe',
    envVar: 'STRIPE_SECRET_KEY',
    description: 'Payment processing and subscription management',
    getSteps: [
      '1. Go to: https://dashboard.stripe.com/apikeys',
      '2. Copy the "Secret key" (starts with "sk_")',
      '3. Paste it below'
    ]
  },
  {
    name: '🗄️ Supabase',
    envVar: 'SUPABASE_SERVICE_ROLE_KEY',
    description: 'Database and authentication backend',
    getSteps: [
      '1. Go to your Supabase project: https://app.supabase.com/project/xsfiadcympwrpqluwqua/settings/api',
      '2. Copy the URL and service_role key',
      '3. We\'ll set up all three required variables'
    ]
  }
]

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local')
let existingEnv = ''

if (fs.existsSync(envPath)) {
  existingEnv = fs.readFileSync(envPath, 'utf8')
  console.log('✅ Found existing .env.local file')
} else {
  console.log('📝 Creating new .env.local file')
}

console.log(`
📋 INTEGRATION STATUS CHECK
==========================
`)

// Check current status
integrations.forEach(integration => {
  const hasKey = existingEnv.includes(integration.envVar)
  const status = hasKey ? '✅ Configured' : '❌ Missing'
  console.log(`${integration.name}: ${status}`)
})

console.log(`
🔧 SETUP INSTRUCTIONS
====================

Copy and paste these environment variables into your .env.local file:

# ===== TD STUDIOS API INTEGRATIONS =====

# OpenAI (ChatGPT)
OPENAI_API_KEY=your_openai_key_here

# Anthropic (Claude)
ANTHROPIC_API_KEY=your_anthropic_key_here

# Gmail (Email Management)
GMAIL_CLIENT_ID=your_gmail_client_id.apps.googleusercontent.com
GMAIL_CLIENT_SECRET=your_gmail_client_secret
GMAIL_ACCESS_TOKEN=your_gmail_access_token
GMAIL_REFRESH_TOKEN=your_gmail_refresh_token

# Telegram (Bot Messaging)
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_default_chat_id

# Notion
NOTION_API_KEY=your_notion_token_here

# Airtable
AIRTABLE_API_KEY=your_airtable_token_here

# Slack
SLACK_BOT_TOKEN=your_slack_bot_token_here

# GitHub
GITHUB_TOKEN=your_github_token_here

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here

# Supabase (TD Studios HQ Database)
NEXT_PUBLIC_SUPABASE_URL=https://xsfiadcympwrpqluwqua.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_key_here

`)

console.log(`
🎯 QUICK SETUP LINKS
===================
`)

integrations.forEach(integration => {
  console.log(`${integration.name}`)
  integration.getSteps.forEach(step => {
    console.log(`   ${step}`)
  })
  console.log('')
})

console.log(`
⚠️  IMPORTANT SECURITY NOTES:
============================
• Never commit .env.local to git (it's already in .gitignore)
• Keep your API keys secret and secure
• Rotate keys regularly for better security
• Use environment-specific keys (test vs production)

🧪 TESTING YOUR SETUP:
======================
After adding your keys to .env.local:

1. Restart your server: npm run dev
2. Test integrations: curl http://localhost:3000/api/integrations/test
3. Check the settings page: http://localhost:3000/dashboard/settings

🎉 Once configured, you'll have seamless access to all platforms without manual logins!
`)

// Create a sample .env.local file
const sampleEnvContent = `# ===== TD STUDIOS API INTEGRATIONS =====
# Replace 'your_key_here' with actual API keys

# OpenAI (ChatGPT)
OPENAI_API_KEY=your_openai_key_here

# Anthropic (Claude)
ANTHROPIC_API_KEY=your_anthropic_key_here

# Gmail (Email Management)
GMAIL_CLIENT_ID=your_gmail_client_id.apps.googleusercontent.com
GMAIL_CLIENT_SECRET=your_gmail_client_secret
GMAIL_ACCESS_TOKEN=your_gmail_access_token
GMAIL_REFRESH_TOKEN=your_gmail_refresh_token

# Telegram (Bot Messaging)
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_default_chat_id

# Notion
NOTION_API_KEY=your_notion_token_here

# Airtable
AIRTABLE_API_KEY=your_airtable_token_here

# Slack
SLACK_BOT_TOKEN=your_slack_bot_token_here

# GitHub
GITHUB_TOKEN=your_github_token_here

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here

# Supabase (TD Studios HQ Database)
NEXT_PUBLIC_SUPABASE_URL=https://xsfiadcympwrpqluwqua.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_key_here
`
