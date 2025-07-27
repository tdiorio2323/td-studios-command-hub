import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check environment variables (safely)
    const envCheck = {
      anthropicKeyExists: !!process.env.ANTHROPIC_API_KEY,
      anthropicKeyLength: process.env.ANTHROPIC_API_KEY?.length || 0,
      anthropicKeyPrefix: process.env.ANTHROPIC_API_KEY?.substring(0, 7) || 'none',
      openaiKeyExists: !!process.env.OPENAI_API_KEY,
      openaiKeyLength: process.env.OPENAI_API_KEY?.length || 0,
      openaiKeyPrefix: process.env.OPENAI_API_KEY?.substring(0, 7) || 'none',
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV
    }

    return NextResponse.json({
      success: true,
      data: envCheck,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Debug check failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}