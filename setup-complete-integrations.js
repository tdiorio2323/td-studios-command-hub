#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

console.log('🚀 TD Studios Complete Integration Setup')
console.log('=====================================\n')

const envPath = path.join(process.cwd(), '.env.local')

// Complete integration list with every possible service
const allIntegrations = [
  {
    category: '🤖 AI Services',
    integrations: [
      { name: 'OpenAI', env: 'OPENAI_API_KEY', value: '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' },
      { name: 'Anthropic (Claude)', env: 'ANTHROPIC_API_KEY', value: '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' },
      { name: 'Google AI', env: 'GOOGLE_AI_API_KEY', value: 'your_google_ai_api_key' },
      { name: 'Cohere', env: 'COHERE_API_KEY', value: 'your_cohere_api_key' },
      { name: 'Hugging Face', env: 'HUGGINGFACE_API_KEY', value: 'your_huggingface_api_key' },
      { name: 'Replicate', env: 'REPLICATE_API_TOKEN', value: 'your_replicate_api_token' }
    ]
  },
  {
    category: '💾 Database & Backend',
    integrations: [
      { name: 'Supabase URL', env: 'NEXT_PUBLIC_SUPABASE_URL', value: 'https://xsfiadcympwrpqluwqua.supabase.co' },
      { name: 'Supabase Anon Key', env: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', value: 'your_supabase_anon_key' },
      { name: 'Supabase Service Role', env: 'SUPABASE_SERVICE_ROLE_KEY', value: 'your_supabase_service_role_key' },
      { name: 'Redis URL', env: 'REDIS_URL', value: 'your_redis_url' },
      { name: 'Upstash Redis', env: 'UPSTASH_REDIS_REST_URL', value: 'your_upstash_redis_url' },
      { name: 'MongoDB', env: 'MONGODB_URI', value: 'your_mongodb_uri' },
      { name: 'PlanetScale', env: 'PLANETSCALE_DATABASE_URL', value: 'your_planetscale_url' }
    ]
  },
  {
    category: '💳 Payment Processing',
    integrations: [
      { name: 'Stripe Secret', env: 'STRIPE_SECRET_KEY', value: 'your_stripe_secret_key' },
      { name: 'Stripe Publishable', env: 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', value: 'your_stripe_publishable_key' },
      { name: 'Stripe Webhook', env: 'STRIPE_WEBHOOK_SECRET', value: 'your_stripe_webhook_secret' },
      { name: 'PayPal Client ID', env: 'PAYPAL_CLIENT_ID', value: 'your_paypal_client_id' },
      { name: 'PayPal Secret', env: 'PAYPAL_CLIENT_SECRET', value: 'your_paypal_client_secret' }
    ]
  },
  {
    category: '🏢 Productivity & Workspace',
    integrations: [
      { name: 'Notion API', env: 'NOTION_API_KEY', value: 'your_notion_integration_token' },
      { name: 'Airtable API', env: 'AIRTABLE_API_KEY', value: 'your_airtable_personal_access_token' },
      { name: 'Slack Bot Token', env: 'SLACK_BOT_TOKEN', value: 'xoxb-your-slack-bot-token' },
      { name: 'Discord Bot Token', env: 'DISCORD_BOT_TOKEN', value: 'your_discord_bot_token' }
    ]
  },
  {
    category: '💻 Development & Code',
    integrations: [
      { name: 'GitHub Token', env: 'GITHUB_TOKEN', value: 'your_github_personal_access_token' },
      { name: 'GitLab Token', env: 'GITLAB_TOKEN', value: 'your_gitlab_access_token' },
      { name: 'Vercel Token', env: 'VERCEL_TOKEN', value: 'your_vercel_api_token' },
      { name: 'Netlify Token', env: 'NETLIFY_ACCESS_TOKEN', value: 'your_netlify_access_token' }
    ]
  },
  {
    category: '📧 Communication & Messaging',
    integrations: [
      { name: 'Gmail Access Token', env: 'GMAIL_ACCESS_TOKEN', value: 'your_gmail_access_token' },
      { name: 'Gmail Refresh Token', env: 'GMAIL_REFRESH_TOKEN', value: 'your_gmail_refresh_token' },
      { name: 'Telegram Bot Token', env: 'TELEGRAM_BOT_TOKEN', value: 'your_telegram_bot_token' },
      { name: 'Twilio Account SID', env: 'TWILIO_ACCOUNT_SID', value: 'your_twilio_account_sid' },
      { name: 'SendGrid API', env: 'SENDGRID_API_KEY', value: 'your_sendgrid_api_key' },
      { name: 'Resend API', env: 'RESEND_API_KEY', value: 'your_resend_api_key' }
    ]
  },
  {
    category: '📱 Social Media',
    integrations: [
      { name: 'Twitter Bearer Token', env: 'TWITTER_BEARER_TOKEN', value: 'your_twitter_bearer_token' },
      { name: 'Instagram Access Token', env: 'INSTAGRAM_ACCESS_TOKEN', value: 'your_instagram_access_token' },
      { name: 'LinkedIn Client ID', env: 'LINKEDIN_CLIENT_ID', value: 'your_linkedin_client_id' },
      { name: 'YouTube API', env: 'YOUTUBE_API_KEY', value: 'your_youtube_data_api_key' },
      { name: 'TikTok Client Key', env: 'TIKTOK_CLIENT_KEY', value: 'your_tiktok_client_key' }
    ]
  },
  {
    category: '📊 Analytics & Monitoring',
    integrations: [
      { name: 'Google Analytics', env: 'NEXT_PUBLIC_GA_ID', value: 'your_google_analytics_id' },
      { name: 'Mixpanel', env: 'MIXPANEL_TOKEN', value: 'your_mixpanel_project_token' },
      { name: 'Amplitude', env: 'AMPLITUDE_API_KEY', value: 'your_amplitude_api_key' },
      { name: 'Sentry', env: 'SENTRY_DSN', value: 'your_sentry_dsn' },
      { name: 'PostHog', env: 'POSTHOG_KEY', value: 'your_posthog_project_api_key' }
    ]
  },
  {
    category: '📁 File Storage & CDN',
    integrations: [
      { name: 'UploadThing Secret', env: 'UPLOADTHING_SECRET', value: 'your_uploadthing_secret' },
      { name: 'AWS Access Key', env: 'AWS_ACCESS_KEY_ID', value: 'your_aws_access_key' },
      { name: 'AWS Secret Key', env: 'AWS_SECRET_ACCESS_KEY', value: 'your_aws_secret_key' },
      { name: 'Cloudinary Cloud', env: 'CLOUDINARY_CLOUD_NAME', value: 'your_cloudinary_cloud_name' }
    ]
  },
  {
    category: '🏪 Business & CRM',
    integrations: [
      { name: 'Salesforce Client ID', env: 'SALESFORCE_CLIENT_ID', value: 'your_salesforce_client_id' },
      { name: 'HubSpot Token', env: 'HUBSPOT_ACCESS_TOKEN', value: 'your_hubspot_access_token' },
      { name: 'Pipedrive Token', env: 'PIPEDRIVE_API_TOKEN', value: 'your_pipedrive_api_token' }
    ]
  },
  {
    category: '🎨 Design & Creative',
    integrations: [
      { name: 'Figma Token', env: 'FIGMA_ACCESS_TOKEN', value: 'your_figma_access_token' },
      { name: 'Canva API', env: 'CANVA_API_KEY', value: 'your_canva_api_key' },
      { name: 'Adobe Client ID', env: 'ADOBE_CLIENT_ID', value: 'your_adobe_client_id' }
    ]
  },
  {
    category: '📋 Project Management',
    integrations: [
      { name: 'Jira API Token', env: 'JIRA_API_TOKEN', value: 'your_jira_api_token' },
      { name: 'Asana Token', env: 'ASANA_ACCESS_TOKEN', value: 'your_asana_access_token' },
      { name: 'Trello API Key', env: 'TRELLO_API_KEY', value: 'your_trello_api_key' },
      { name: 'Monday.com Token', env: 'MONDAY_API_TOKEN', value: 'your_monday_api_token' }
    ]
  }
]

// Generate the complete .env.local content
function generateEnvContent() {
  let content = `# TD Studios Complete Integration Environment Variables
# Generated by setup-complete-integrations.js
# Last updated: ${new Date().toISOString()}

# Core Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXTAUTH_SECRET="td-studios-super-secret-key-development-2024"
NEXTAUTH_URL="http://localhost:3000"
DATABASE_URL="file:./dev.db"

`

  allIntegrations.forEach(category => {
    content += `# ${category.category}\n`
    category.integrations.forEach(integration => {
      content += `${integration.env}="${integration.value}"\n`
    })
    content += '\n'
  })

  content += `# Security & Encryption
MASTER_ENCRYPTION_KEY="td-studios-master-key-32-chars-long"
JWT_SECRET="td-studios-jwt-secret-key"

# Development Environment
NODE_ENV="development"
VERCEL_ENV="development"
`

  return content
}

// Main setup function
async function setupIntegrations() {
  try {
    console.log('📝 Generating complete .env.local file...\n')

    const envContent = generateEnvContent()

    // Write to .env.local
    fs.writeFileSync(envPath, envContent)

    console.log('✅ Successfully created .env.local with ALL possible integrations!\n')

    // Show summary
    let totalIntegrations = 0
    allIntegrations.forEach(category => {
      console.log(`${category.category}: ${category.integrations.length} integrations`)
      totalIntegrations += category.integrations.length
    })

    console.log(`\n🎉 Total: ${totalIntegrations} integrations configured!\n`)

    console.log('🔧 Next Steps:')
    console.log('1. Replace placeholder values with your actual API keys')
    console.log('2. Run: npm run dev')
    console.log('3. Go to Settings > Integrations to test connections')
    console.log('4. Use the "Test All Integrations" button\n')

    console.log('📚 Get API Keys From:')
    console.log('• OpenAI: https://platform.openai.com/api-keys')
    console.log('• Anthropic: https://console.anthropic.com/')
    console.log('• GitHub: https://github.com/settings/tokens')
    console.log('• Notion: https://developers.notion.com/')
    console.log('• Slack: https://api.slack.com/apps')
    console.log('• Stripe: https://dashboard.stripe.com/apikeys')
    console.log('• Supabase: https://app.supabase.com/projects')
    console.log('• And many more...\n')

    console.log('🔒 Security Note:')
    console.log('• Never commit .env.local to git')
    console.log('• Keep API keys secure and rotate them regularly')
    console.log('• Use environment-specific keys for production\n')

  } catch (error) {
    console.error('❌ Error setting up integrations:', error.message)
    process.exit(1)
  }
}

// Run the setup
setupIntegrations()
