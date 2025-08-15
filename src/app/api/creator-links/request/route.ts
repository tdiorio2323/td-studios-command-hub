import { NextRequest, NextResponse } from 'next/server'
import { MailingListService } from '@/lib/supabase-mailing'
import { z } from 'zod'

// Validation schema
const linkRequestSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().optional(),
  requestedUsername: z.string().optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validation = linkRequestSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({
        success: false,
        error: 'Invalid input data',
        details: validation.error.errors
      }, { status: 400 })
    }

    const { email, name, requestedUsername } = validation.data

    // Create creator link page request
    const result = await MailingListService.createLinkPageRequest(
      email, 
      name, 
      requestedUsername
    )

    if (!result.success) {
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 500 })
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Creator link page request submitted successfully',
      data: {
        email: result.data?.email,
        name: result.data?.name,
        status: result.data?.status,
        requested_at: result.data?.requested_at
      }
    })

  } catch (error) {
    console.error('Creator link request error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}