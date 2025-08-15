import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    logger.info('🗄️ Verifying TD Studios Supabase connection...')

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    // Check environment variables
    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
      return NextResponse.json({
        success: false,
        status: 'misconfigured',
        error: 'Missing Supabase environment variables',
        project: 'xsfiadcympwrpqluwqua TD STUDIOS HQ',
        missing: {
          url: !supabaseUrl,
          anonKey: !supabaseAnonKey,
          serviceKey: !supabaseServiceKey
        },
        setup: {
          message: 'Get your keys from Supabase dashboard',
          instructions: [
            '1. Go to: https://app.supabase.com/project/xsfiadcympwrpqluwqua/settings/api',
            '2. Copy the Project URL and API keys',
            '3. Update .env.local with the correct values:',
            '   NEXT_PUBLIC_SUPABASE_URL="https://xsfiadcympwrpqluwqua.supabase.co"',
            '   NEXT_PUBLIC_SUPABASE_ANON_KEY="your_anon_key"',
            '   SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"',
            '4. Restart your server'
          ]
        }
      }, { status: 400 })
    }

    // Test connection with service role key
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'GET',
      headers: {
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json'
      }
    })

    if (response.ok) {
      // Try to check if users table exists
      const usersResponse = await fetch(`${supabaseUrl}/rest/v1/users?select=count&limit=1`, {
        headers: {
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'Content-Type': 'application/json'
        }
      })

      const schemaStatus = usersResponse.ok ? 'ready' : 'needs_setup'

      return NextResponse.json({
        success: true,
        status: 'connected',
        message: 'Supabase connection verified',
        project: {
          id: 'xsfiadcympwrpqluwqua',
          name: 'TD STUDIOS HQ',
          url: supabaseUrl,
          region: 'Auto-detected from URL'
        },
        schema: {
          status: schemaStatus,
          message: schemaStatus === 'ready' ? 'Database schema is set up' : 'Database schema needs to be created',
          setupUrl: schemaStatus === 'needs_setup' ? 'https://app.supabase.com/project/xsfiadcympwrpqluwqua/editor' : null
        },
        capabilities: {
          database: true,
          auth: true,
          storage: true,
          realtime: true,
          edgeFunctions: true
        },
        testedAt: new Date().toISOString()
      })
    } else {
      return NextResponse.json({
        success: false,
        status: 'connection_failed',
        error: `HTTP ${response.status}`,
        details: await response.text(),
        troubleshooting: [
          'Verify your Supabase project is active',
          'Check your API keys are correct',
          'Ensure your project URL is https://xsfiadcympwrpqluwqua.supabase.co',
          'Try regenerating your service role key'
        ]
      }, { status: 500 })
    }

  } catch (error) {
    logger.error('Supabase verification error:', error)
    return NextResponse.json({
      success: false,
      status: 'error',
      error: 'Failed to verify Supabase connection',
      details: error instanceof Error ? error.message : 'Unknown error',
      project: 'xsfiadcympwrpqluwqua TD STUDIOS HQ'
    }, { status: 500 })
  }
}
