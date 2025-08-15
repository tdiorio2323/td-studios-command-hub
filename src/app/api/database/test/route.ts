import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    logger.info('🧪 Testing TD Studios HQ database connection...')

    // Check environment variables first
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
      return NextResponse.json({
        success: false,
        error: 'Database connection not configured',
        project: 'xsfiadcympwrpqluwqua TD STUDIOS HQ',
        missing: {
          url: !supabaseUrl,
          anonKey: !supabaseAnonKey,
          serviceKey: !supabaseServiceKey
        },
        setup: {
          message: 'Environment variables not configured',
          instructions: [
            '1. Get your Supabase keys from: https://app.supabase.com/project/xsfiadcympwrpqluwqua/settings/api',
            '2. Add to .env.local:',
            '   NEXT_PUBLIC_SUPABASE_URL="https://xsfiadcympwrpqluwqua.supabase.co"',
            '   NEXT_PUBLIC_SUPABASE_ANON_KEY="your_anon_key"',
            '   SUPABASE_SERVICE_ROLE_KEY="your_service_key"',
            '3. Restart the server: npm run dev',
            '4. Run database schema: src/lib/db/schema.sql in Supabase SQL editor'
          ]
        }
      }, { status: 400 })
    }

    // Dynamic import to avoid issues with missing env vars
    const { supabase, supabaseAdmin } = await import('@/lib/supabase')

    // Test 1: Basic connection
    const { data: healthCheck, error: healthError } = await supabase
      .from('users')
      .select('count')
      .limit(1)

    if (healthError) {
      logger.error('❌ Database connection failed:', healthError)
      return NextResponse.json({
        success: false,
        error: 'Database connection failed',
        details: healthError.message,
        project: 'xsfiadcympwrpqluwqua TD STUDIOS HQ',
        possibleCauses: [
          'Database schema not set up (run src/lib/db/schema.sql)',
          'Invalid API keys',
          'Network connectivity issues',
          'Supabase project not accessible'
        ]
      }, { status: 500 })
    }

    // Test 2: Admin connection
    const { data: adminTest, error: adminError } = await supabaseAdmin
      .from('users')
      .select('count')
      .limit(1)

    // Test 3: Check if tables exist
    const { data: tables, error: tablesError } = await supabaseAdmin
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', ['users', 'subscriptions', 'usage_logs', 'payments'])

    const tableNames = tables?.map(t => t.table_name) || []
    const expectedTables = ['users', 'subscriptions', 'usage_logs', 'payments']
    const missingTables = expectedTables.filter(table => !tableNames.includes(table))

    logger.info('✅ Database connection successful!')
    logger.info(`📊 Tables found: ${tableNames.join(', ')}`)
    if (missingTables.length > 0) {
      logger.info(`⚠️  Missing tables: ${missingTables.join(', ')}`)
    }

    return NextResponse.json({
      success: true,
      message: 'TD Studios HQ database connection successful!',
      data: {
        project: 'xsfiadcympwrpqluwqua TD STUDIOS HQ',
        projectUrl: 'https://xsfiadcympwrpqluwqua.supabase.co',
        basicConnection: !healthError,
        adminConnection: !adminError,
        tablesFound: tableNames,
        missingTables: missingTables,
        allTablesExist: missingTables.length === 0,
        schemaStatus: missingTables.length === 0 ? 'complete' : 'incomplete',
        nextSteps: missingTables.length > 0 ? [
          'Run the SQL schema from src/lib/db/schema.sql in your Supabase SQL editor',
          'Visit: https://app.supabase.com/project/xsfiadcympwrpqluwqua/sql/new'
        ] : [
          'Database is ready!',
          'You can now use real data instead of mock data',
          'Start implementing user authentication'
        ]
      }
    })

  } catch (error) {
    logger.error('💥 Database test failed:', error)
    return NextResponse.json({
      success: false,
      error: 'Database test failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      troubleshooting: [
        'Check your environment variables in .env.local',
        'Verify your Supabase project URL and keys',
        'Ensure your database is accessible',
        'Run: node setup-supabase.js for setup instructions'
      ]
    }, { status: 500 })
  }
}
