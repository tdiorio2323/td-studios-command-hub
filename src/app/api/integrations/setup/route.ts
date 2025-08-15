import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server'

interface IntegrationSetup {
  name: string
  description: string
  apiKeyRequired: string
  setupSteps: string[]
  testEndpoint: string
  documentation: string
  envVarName: string
}

export async function GET(request: NextRequest) {
  try {
    const integrationSetups: IntegrationSetup[] = [
      {
        name: 'OpenAI',
        description: 'GPT models and ChatGPT API access',
        apiKeyRequired: 'API Key',
        envVarName: 'OPENAI_API_KEY',
        setupSteps: [
          'Go to https://platform.openai.com/api-keys',
          'Create a new API key',
          'Copy the key (starts with "sk-")',
          'Add OPENAI_API_KEY=your_key to .env.local',
          'Restart your server'
        ],
        testEndpoint: '/api/integrations/test',
        documentation: 'https://platform.openai.com/docs'
      },
      {
        name: 'Anthropic (Claude)',
        description: 'Claude AI models and API access',
        apiKeyRequired: 'API Key',
        envVarName: 'ANTHROPIC_API_KEY',
        setupSteps: [
          'Go to https://console.anthropic.com/',
          'Navigate to API Keys',
          'Generate a new API key',
          'Copy the key',
          'Add ANTHROPIC_API_KEY=your_key to .env.local',
          'Restart your server'
        ],
        testEndpoint: '/api/integrations/test',
        documentation: 'https://docs.anthropic.com/'
      },
      {
        name: 'Notion',
        description: 'Workspace integration and database access',
        apiKeyRequired: 'Integration Token',
        envVarName: 'NOTION_API_KEY',
        setupSteps: [
          'Go to https://www.notion.so/my-integrations',
          'Create a new integration',
          'Copy the Internal Integration Token',
          'Share your databases with this integration',
          'Add NOTION_API_KEY=your_token to .env.local',
          'Restart your server'
        ],
        testEndpoint: '/api/integrations/test',
        documentation: 'https://developers.notion.com/'
      },
      {
        name: 'Airtable',
        description: 'Base and record management',
        apiKeyRequired: 'Personal Access Token',
        envVarName: 'AIRTABLE_API_KEY',
        setupSteps: [
          'Go to https://airtable.com/create/tokens',
          'Create a personal access token',
          'Select appropriate scopes (data.records:read, data.records:write)',
          'Copy the token',
          'Add AIRTABLE_API_KEY=your_token to .env.local',
          'Restart your server'
        ],
        testEndpoint: '/api/integrations/test',
        documentation: 'https://airtable.com/developers/web/api/introduction'
      },
      {
        name: 'Slack',
        description: 'Team communication and notifications',
        apiKeyRequired: 'Bot Token',
        envVarName: 'SLACK_BOT_TOKEN',
        setupSteps: [
          'Go to https://api.slack.com/apps',
          'Create a new app or select existing',
          'Go to OAuth & Permissions',
          'Add bot token scopes (chat:write, users:read)',
          'Install app to workspace',
          'Copy Bot User OAuth Token (starts with "xoxb-")',
          'Add SLACK_BOT_TOKEN=your_token to .env.local',
          'Restart your server'
        ],
        testEndpoint: '/api/integrations/test',
        documentation: 'https://api.slack.com/'
      },
      {
        name: 'GitHub',
        description: 'Repository management and code tracking',
        apiKeyRequired: 'Personal Access Token',
        envVarName: 'GITHUB_TOKEN',
        setupSteps: [
          'Go to https://github.com/settings/tokens',
          'Generate new token (classic)',
          'Select scopes: repo, user, admin:org',
          'Copy the token',
          'Add GITHUB_TOKEN=your_token to .env.local',
          'Restart your server'
        ],
        testEndpoint: '/api/integrations/test',
        documentation: 'https://docs.github.com/en/rest'
      },
      {
        name: 'Stripe',
        description: 'Payment processing and subscription management',
        apiKeyRequired: 'Secret Key',
        envVarName: 'STRIPE_SECRET_KEY',
        setupSteps: [
          'Go to https://dashboard.stripe.com/apikeys',
          'Copy the Secret key (starts with "sk_")',
          'Add STRIPE_SECRET_KEY=your_key to .env.local',
          'Also add STRIPE_PUBLISHABLE_KEY for frontend',
          'Restart your server'
        ],
        testEndpoint: '/api/integrations/test',
        documentation: 'https://stripe.com/docs/api'
      },
      {
        name: 'Supabase',
        description: 'Database and authentication backend',
        apiKeyRequired: 'Service Role Key',
        envVarName: 'SUPABASE_SERVICE_ROLE_KEY',
        setupSteps: [
          'Go to your Supabase project dashboard',
          'Navigate to Settings > API',
          'Copy the URL and service_role key',
          'Add NEXT_PUBLIC_SUPABASE_URL=your_url to .env.local',
          'Add SUPABASE_SERVICE_ROLE_KEY=your_key to .env.local',
          'Add NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key to .env.local',
          'Restart your server'
        ],
        testEndpoint: '/api/integrations/test',
        documentation: 'https://supabase.com/docs'
      }
    ]

    return NextResponse.json({
      success: true,
      message: 'Integration setup guide',
      integrations: integrationSetups,
      envFile: '.env.local',
      note: 'Add all environment variables to .env.local and restart your server after each addition'
    })

  } catch (error) {
    logger.error('Setup guide error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to generate setup guide'
    }, { status: 500 })
  }
}
