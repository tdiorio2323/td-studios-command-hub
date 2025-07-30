import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function validateSession(request: NextRequest): Promise<{
  valid: boolean
  user?: {
    id: string
    email: string
    name: string
    role: string
  }
  error?: string
}> {
  try {
    const cookieStore = cookies()
    const sessionToken = cookieStore.get('td-session')?.value

    if (!sessionToken) {
      return { valid: false, error: 'No session token' }
    }

    // In a real app, validate against database
    // For now, assume valid if token exists
    return {
      valid: true,
      user: {
        id: '1',
        email: 'tyler@tdstudios.com',
        name: 'Tyler DiOrio',
        role: 'admin'
      }
    }
  } catch (error) {
    return { valid: false, error: 'Session validation failed' }
  }
}

export function requireAuth(handler: (request: NextRequest, user: any) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    const session = await validateSession(request)

    if (!session.valid) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required',
        redirect: '/login'
      }, { status: 401 })
    }

    return handler(request, session.user)
  }
}

export function optionalAuth(handler: (request: NextRequest, user?: any) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    const session = await validateSession(request)
    return handler(request, session.valid ? session.user : undefined)
  }
}
