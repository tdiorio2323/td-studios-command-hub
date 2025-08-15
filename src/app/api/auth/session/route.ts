import { logger } from '@/lib/logger';
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const sessionToken = cookieStore.get('td-session')?.value

    if (!sessionToken) {
      return NextResponse.json({
        success: false,
        authenticated: false,
        error: 'No session found'
      }, { status: 401 })
    }

    // In a real app, validate the session token against database
    // For now, we'll assume valid if it exists

    return NextResponse.json({
      success: true,
      authenticated: true,
      user: {
        id: '1',
        email: 'tyler@tdstudios.com',
        name: 'Tyler DiOrio',
        role: 'admin'
      }
    })

  } catch (error) {
    logger.error('Session validation error:', error)
    return NextResponse.json({
      success: false,
      authenticated: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}
