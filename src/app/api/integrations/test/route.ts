import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server'

interface IntegrationTest {
  name: string
  status: 'connected' | 'disconnected' | 'error'
  details: string
  apiKeyPresent: boolean
  lastTested: string
}

export async function GET(request: NextRequest) {
  try {
    logger.info('🔌 Testing all TD Studios integrations...')

    const integrations: IntegrationTest[] = []

    // Test OpenAI
    try {
      const openaiKey = process.env.OPENAI_API_KEY
      if (openaiKey) {
        const response = await fetch('https://api.openai.com/v1/models', {
          headers: {
            'Authorization': `Bearer ${openaiKey}`,
            'Content-Type': 'application/json'
          }
        })

        integrations.push({
          name: 'OpenAI',
          status: response.ok ? 'connected' : 'error',
          details: response.ok ? 'API key valid, models accessible' : `HTTP ${response.status}`,
          apiKeyPresent: true,
          lastTested: new Date().toISOString()
        })
      } else {
        integrations.push({
          name: 'OpenAI',
          status: 'disconnected',
          details: 'API key not configured',
          apiKeyPresent: false,
          lastTested: new Date().toISOString()
        })
      }
    } catch (error) {
      integrations.push({
        name: 'OpenAI',
        status: 'error',
        details: error instanceof Error ? error.message : 'Unknown error',
        apiKeyPresent: !!process.env.OPENAI_API_KEY,
        lastTested: new Date().toISOString()
      })
    }

    // Test Anthropic (Claude)
    try {
      const anthropicKey = process.env.ANTHROPIC_API_KEY
      if (anthropicKey) {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'x-api-key': anthropicKey,
            'content-type': 'application/json',
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: 'claude-3-sonnet-20240229',
            max_tokens: 1,
            messages: [{ role: 'user', content: 'test' }]
          })
        })

        integrations.push({
          name: 'Anthropic (Claude)',
          status: response.ok ? 'connected' : 'error',
          details: response.ok ? 'API key valid, Claude accessible' : `HTTP ${response.status}`,
          apiKeyPresent: true,
          lastTested: new Date().toISOString()
        })
      } else {
        integrations.push({
          name: 'Anthropic (Claude)',
          status: 'disconnected',
          details: 'API key not configured',
          apiKeyPresent: false,
          lastTested: new Date().toISOString()
        })
      }
    } catch (error) {
      integrations.push({
        name: 'Anthropic (Claude)',
        status: 'error',
        details: error instanceof Error ? error.message : 'Unknown error',
        apiKeyPresent: !!process.env.ANTHROPIC_API_KEY,
        lastTested: new Date().toISOString()
      })
    }

    // Test Notion
    try {
      const notionKey = process.env.NOTION_API_KEY
      if (notionKey) {
        const response = await fetch('https://api.notion.com/v1/users/me', {
          headers: {
            'Authorization': `Bearer ${notionKey}`,
            'Notion-Version': '2022-06-28'
          }
        })

        integrations.push({
          name: 'Notion',
          status: response.ok ? 'connected' : 'error',
          details: response.ok ? 'API key valid, workspace accessible' : `HTTP ${response.status}`,
          apiKeyPresent: true,
          lastTested: new Date().toISOString()
        })
      } else {
        integrations.push({
          name: 'Notion',
          status: 'disconnected',
          details: 'API key not configured',
          apiKeyPresent: false,
          lastTested: new Date().toISOString()
        })
      }
    } catch (error) {
      integrations.push({
        name: 'Notion',
        status: 'error',
        details: error instanceof Error ? error.message : 'Unknown error',
        apiKeyPresent: !!process.env.NOTION_API_KEY,
        lastTested: new Date().toISOString()
      })
    }

    // Test Airtable
    try {
      const airtableKey = process.env.AIRTABLE_API_KEY
      if (airtableKey) {
        const response = await fetch('https://api.airtable.com/v0/meta/bases', {
          headers: {
            'Authorization': `Bearer ${airtableKey}`
          }
        })

        integrations.push({
          name: 'Airtable',
          status: response.ok ? 'connected' : 'error',
          details: response.ok ? 'API key valid, bases accessible' : `HTTP ${response.status}`,
          apiKeyPresent: true,
          lastTested: new Date().toISOString()
        })
      } else {
        integrations.push({
          name: 'Airtable',
          status: 'disconnected',
          details: 'API key not configured',
          apiKeyPresent: false,
          lastTested: new Date().toISOString()
        })
      }
    } catch (error) {
      integrations.push({
        name: 'Airtable',
        status: 'error',
        details: error instanceof Error ? error.message : 'Unknown error',
        apiKeyPresent: !!process.env.AIRTABLE_API_KEY,
        lastTested: new Date().toISOString()
      })
    }

    // Test Slack
    try {
      const slackToken = process.env.SLACK_BOT_TOKEN
      if (slackToken) {
        const response = await fetch('https://slack.com/api/auth.test', {
          headers: {
            'Authorization': `Bearer ${slackToken}`
          }
        })

        const data = await response.json()
        integrations.push({
          name: 'Slack',
          status: data.ok ? 'connected' : 'error',
          details: data.ok ? `Connected to ${data.team}` : data.error || 'Authentication failed',
          apiKeyPresent: true,
          lastTested: new Date().toISOString()
        })
      } else {
        integrations.push({
          name: 'Slack',
          status: 'disconnected',
          details: 'Bot token not configured',
          apiKeyPresent: false,
          lastTested: new Date().toISOString()
        })
      }
    } catch (error) {
      integrations.push({
        name: 'Slack',
        status: 'error',
        details: error instanceof Error ? error.message : 'Unknown error',
        apiKeyPresent: !!process.env.SLACK_BOT_TOKEN,
        lastTested: new Date().toISOString()
      })
    }

    // Test GitHub
    try {
      const githubToken = process.env.GITHUB_TOKEN
      if (githubToken) {
        const response = await fetch('https://api.github.com/user', {
          headers: {
            'Authorization': `token ${githubToken}`,
            'User-Agent': 'TD-Studios-Hub'
          }
        })

        integrations.push({
          name: 'GitHub',
          status: response.ok ? 'connected' : 'error',
          details: response.ok ? 'Personal access token valid' : `HTTP ${response.status}`,
          apiKeyPresent: true,
          lastTested: new Date().toISOString()
        })
      } else {
        integrations.push({
          name: 'GitHub',
          status: 'disconnected',
          details: 'Personal access token not configured',
          apiKeyPresent: false,
          lastTested: new Date().toISOString()
        })
      }
    } catch (error) {
      integrations.push({
        name: 'GitHub',
        status: 'error',
        details: error instanceof Error ? error.message : 'Unknown error',
        apiKeyPresent: !!process.env.GITHUB_TOKEN,
        lastTested: new Date().toISOString()
      })
    }

    // Test Stripe
    try {
      const stripeKey = process.env.STRIPE_SECRET_KEY
      if (stripeKey) {
        const response = await fetch('https://api.stripe.com/v1/account', {
          headers: {
            'Authorization': `Bearer ${stripeKey}`
          }
        })

        integrations.push({
          name: 'Stripe',
          status: response.ok ? 'connected' : 'error',
          details: response.ok ? 'Payment processing available' : `HTTP ${response.status}`,
          apiKeyPresent: true,
          lastTested: new Date().toISOString()
        })
      } else {
        integrations.push({
          name: 'Stripe',
          status: 'disconnected',
          details: 'Secret key not configured',
          apiKeyPresent: false,
          lastTested: new Date().toISOString()
        })
      }
    } catch (error) {
      integrations.push({
        name: 'Stripe',
        status: 'error',
        details: error instanceof Error ? error.message : 'Unknown error',
        apiKeyPresent: !!process.env.STRIPE_SECRET_KEY,
        lastTested: new Date().toISOString()
      })
    }

    // Test Supabase
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

      if (supabaseUrl && supabaseKey) {
        // Test with a simple health check that should work
        const response = await fetch(`${supabaseUrl}/health`, {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
          }
        })

        // If health endpoint doesn't exist, try the users table with limit
        if (!response.ok) {
          const fallbackResponse = await fetch(`${supabaseUrl}/rest/v1/users?select=count&limit=1`, {
            headers: {
              'apikey': supabaseKey,
              'Authorization': `Bearer ${supabaseKey}`,
              'Content-Type': 'application/json'
            }
          })

          integrations.push({
            name: 'Supabase',
            status: fallbackResponse.ok ? 'connected' : 'error',
            details: fallbackResponse.ok ? 'Database connection active' : `HTTP ${fallbackResponse.status} - May need database setup`,
            apiKeyPresent: true,
            lastTested: new Date().toISOString()
          })
        } else {
          integrations.push({
            name: 'Supabase',
            status: 'connected',
            details: 'Database health check passed',
            apiKeyPresent: true,
            lastTested: new Date().toISOString()
          })
        }
      } else {
        integrations.push({
          name: 'Supabase',
          status: 'disconnected',
          details: 'URL or service key not configured',
          apiKeyPresent: false,
          lastTested: new Date().toISOString()
        })
      }
    } catch (error) {
      integrations.push({
        name: 'Supabase',
        status: 'error',
        details: error instanceof Error ? error.message : 'Unknown error',
        apiKeyPresent: !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY),
        lastTested: new Date().toISOString()
      })
    }

    const summary = {
      total: integrations.length,
      connected: integrations.filter(i => i.status === 'connected').length,
      disconnected: integrations.filter(i => i.status === 'disconnected').length,
      errors: integrations.filter(i => i.status === 'error').length,
      apiKeysConfigured: integrations.filter(i => i.apiKeyPresent).length
    }

    return NextResponse.json({
      success: true,
      message: 'Integration test completed',
      summary,
      integrations,
      testedAt: new Date().toISOString()
    })

  } catch (error) {
    logger.error('Integration test error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to test integrations',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
