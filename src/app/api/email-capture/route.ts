import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    // Basic email validation
    if (!email || !email.includes('@')) {
      return NextResponse.json({
        success: false,
        error: 'Valid email is required'
      }, { status: 400 })
    }

    // Log the email capture
    logger.info(`Email captured: ${email}`)

    // In a real implementation, you would:
    // 1. Save to database
    // 2. Add to mailing list (Mailchimp, ConvertKit, etc.)
    // 3. Send welcome email
    
    // For now, just log it
    console.log('New email capture:', email)

    return NextResponse.json({
      success: true,
      message: 'Email captured successfully'
    })

  } catch (error) {
    logger.error('Email capture error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to capture email'
    }, { status: 500 })
  }
}