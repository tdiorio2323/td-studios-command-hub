import { createHash } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'

// Temporary user database - replace with Supabase when configured
const TEMP_USERS = [
  {
    id: '1',
    email: 'tyler@tdstudios.com',
    password: createHash('sha256').update('tdstudios2024').digest('hex'),
    name: 'Tyler DiOrio',
    role: 'admin'
  },
  {
    id: '1b',
    email: 'tyler@tdstudiosny.com',
    password: createHash('sha256').update('tdstudios2024').digest('hex'),
    name: 'Tyler DiOrio',
    role: 'admin'
  },
  {
    id: '2',
    email: 'demo@tdstudios.com',
    password: createHash('sha256').update('aibeast').digest('hex'),
    name: 'Demo User',
    role: 'user'
  }
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({
        success: false,
        error: 'Email and password are required'
      }, { status: 400 })
    }

    // Hash the provided password
    const hashedPassword = createHash('sha256').update(password).digest('hex')

    // Find user
    const user = TEMP_USERS.find(u =>
      u.email.toLowerCase() === email.toLowerCase() &&
      u.password === hashedPassword
    )

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'Invalid email or password'
      }, { status: 401 })
    }

    // Create session token
    const sessionToken = createHash('sha256')
      .update(`${user.id}-${Date.now()}-${Math.random()}`)
      .digest('hex')

    // Create response with user data
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      session: sessionToken
    })

    // Set session cookie
    response.cookies.set('td-session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })

    return response

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Handle logout
export async function DELETE(request: NextRequest) {
  try {
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    })

    // Clear session cookie
    response.cookies.delete('td-session')
    return response

  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}
