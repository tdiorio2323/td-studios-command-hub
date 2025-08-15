import { NextRequest, NextResponse } from 'next/server'
import { MailingListService } from '@/lib/supabase-mailing'
import { z } from 'zod'

// Validation schema
const subscribeSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().optional(),
  source: z.string().default('tdstudiosdigital.com')
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validation = subscribeSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({
        success: false,
        error: 'Invalid input data',
        details: validation.error.errors
      }, { status: 400 })
    }

    const { email, name, source } = validation.data

    // Add subscriber to mailing list
    const result = await MailingListService.addSubscriber(email, name, source)

    if (!result.success) {
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 500 })
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to mailing list',
      data: {
        email: result.data?.email,
        name: result.data?.name,
        status: result.data?.status,
        subscribed_at: result.data?.subscribed_at
      }
    })

  } catch (error) {
    console.error('Mailing list subscription error:', error)
    
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